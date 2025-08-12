const Stripe = require("stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const sendNotification = require("../middlewares/sendNotification");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function ensureDbConnected() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const pendingOrderId = session.metadata?.pendingOrderId;

    if (!pendingOrderId) {
      console.warn("Missing pendingOrderId in Stripe metadata.");
      return res.status(400).json({ received: false });
    }

    await ensureDbConnected();

    const pendingOrder = await PendingOrder.findById(pendingOrderId);
    if (!pendingOrder) {
      console.warn("Pending order not found.");
      return res.status(404).json({ received: false });
    }

    const items = pendingOrder.items;
    const totalAmount = pendingOrder.totalAmount;
    const deliveryDate = pendingOrder.deliveryDate;
    const vendorId = pendingOrder.vendorId.toString();
    const supplierId = pendingOrder.supplierId.toString();

    let mongoSession;
    try {
      mongoSession = await mongoose.startSession();
      mongoSession.startTransaction();

      const order = new Order({
        vendorId,
        supplierId,
        items,
        totalAmount,
        paymentMethod: "Stripe",
        paymentStatus: "paid",
        status: "processing",
        paymentId: session.payment_intent,
        deliveryDate,
      });

      await order.save({ session: mongoSession });

      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { session: mongoSession }
        );
      }

      await Cart.findOneAndDelete({ vendorId }).session(mongoSession);

      await mongoSession.commitTransaction();
      console.log(`✅ Order ${order._id} created & marked paid.`);

      try {
        await sendNotification({
          userId: supplierId,
          type: "order",
          message: `You have a new paid order from vendor ${vendorId}.`,
        });
      } catch (notifyErr) {
        console.error(`❌ Failed to send supplier notification:`, notifyErr);
      }
    } catch (err) {
      console.error("Error creating order from webhook:", err);
      if (mongoSession) await mongoSession.abortTransaction();
    } finally {
      if (mongoSession) mongoSession.endSession();
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = stripeWebhook;
