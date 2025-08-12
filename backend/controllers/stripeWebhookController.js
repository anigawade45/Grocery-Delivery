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
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.warn("Missing orderId in session metadata.");
        return res.status(400).json({ received: false });
      }

      let mongoSession;

      try {
        await ensureDbConnected(); // ✅ Ensure DB ready
        mongoSession = await mongoose.startSession();
        mongoSession.startTransaction();

        const order = await Order.findById(orderId).session(mongoSession);
        if (!order) {
          console.warn(`Order not found: ${orderId}`);
          await mongoSession.abortTransaction();
          return res.status(404).json({ received: false });
        }

        // Only handle Stripe orders
        if (order.paymentMethod !== "Stripe") {
          console.warn(`Skipping non-Stripe order ${orderId} in webhook.`);
          await mongoSession.abortTransaction();
          return res.status(200).json({ received: true });
        }

        // Update payment status
        order.paymentStatus = "paid";
        order.status = "processing";

        if (!order.deliveryDate) {
          order.deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        }
        await order.save({ session: mongoSession });

        // Deduct stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } },
            { session: mongoSession }
          );
        }

        // Clear vendor's cart
        await Cart.findOneAndDelete({ vendorId: order.vendorId }).session(mongoSession);

        // Commit transaction first
        await mongoSession.commitTransaction();

        console.log(`✅ Order ${orderId} marked as paid (card) and stock updated.`);

        // Notify supplier AFTER successful commit
        try {
          await sendNotification({
            userId: order.supplierId,
            type: "order",
            message: `You have a new paid order from vendor ${order.vendorId}.`,
          });
          console.log(`📢 Supplier notified for order ${orderId}.`);
        } catch (notifyErr) {
          console.error(`❌ Failed to send supplier notification for order ${orderId}:`, notifyErr);
        }

        res.json({ received: true });
      } catch (err) {
        console.error("Error processing successful payment:", err);
        if (mongoSession) {
          await mongoSession.abortTransaction();
        }
        return res.status(500).json({ received: false });
      } finally {
        if (mongoSession) {
          mongoSession.endSession();
        }
      }
      break;
    }

    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.warn("Missing orderId in session metadata.");
        return res.status(400).json({ received: false });
      }

      try {
        await ensureDbConnected(); // ✅ Ensure DB ready
        const order = await Order.findById(orderId);
        if (!order) break;

        if (order.paymentMethod !== "card") {
          console.warn(`Skipping non-card order ${orderId} in webhook.`);
          break;
        }

        order.paymentStatus = "failed";
        order.status = "cancelled";
        await order.save();

        console.log(`⚠️ Stripe payment failed for order ${orderId}. Marked cancelled.`);
      } catch (err) {
        console.error("Error processing failed payment:", err);
      }
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = stripeWebhook;
