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
      req.rawBody, // ✅ Use raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      // ✅ Get metadata from Stripe Checkout session
      const vendorId = session.metadata?.vendorId;
      const supplierId = session.metadata?.supplierId;
      const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
      const totalAmount = Number(session.metadata?.totalAmount || 0);

      if (!vendorId || !supplierId || items.length === 0) {
        console.warn("Missing metadata in Stripe session.");
        return res.status(400).json({ received: false });
      }

      let mongoSession;
      try {
        await ensureDbConnected();
        mongoSession = await mongoose.startSession();
        mongoSession.startTransaction();

        // ✅ Create order after successful payment
        const order = new Order({
          vendorId,
          supplierId,
          items: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price
          })),
          totalAmount,
          paymentMethod: "card",
          paymentStatus: "paid",
          status: "processing",
          paymentId: session.payment_intent,
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        });

        await order.save({ session: mongoSession });

        // ✅ Deduct stock
        for (const item of items) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } },
            { session: mongoSession }
          );
        }

        // ✅ Clear vendor's cart
        await Cart.findOneAndDelete({ vendorId }).session(mongoSession);

        await mongoSession.commitTransaction();
        console.log(`✅ Order ${order._id} created & marked paid.`);

        // Notify supplier AFTER commit
        try {
          await sendNotification({
            userId: supplierId,
            type: "order",
            message: `You have a new paid order from vendor ${vendorId}.`
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

      break;
    }

    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      console.log(`⚠️ Payment failed or session expired: ${event.type}`);
      // No order exists yet in new flow, so just log it
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = stripeWebhook;
