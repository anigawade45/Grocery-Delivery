const { Webhook } = require("svix");
const User = require("../models/User");

const clerkWebhooks = async (req, res) => {
    try {
        const payload = req.rawBody; // MUST use raw body for signature verification
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const evt = wh.verify(payload, headers);

        const { type, data } = evt;

        switch (type) {
            case "user.created": {
                const newUser = {
                    _id: data.id,
                    email: data.email_addresses[0]?.email_address,
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url,
                    role: data.public_metadata?.role || "vendor",
                    status: "approved",
                };
                await User.create(newUser);
                console.log("✅ User created:", newUser);
                break;
            }

            case "user.updated": {
                const update = {
                    email: data.email_addresses[0]?.email_address,
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url,
                    role: data.public_metadata?.role,
                };
                await User.findByIdAndUpdate(data.id, update);
                console.log("📝 User updated:", data.id);
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                console.log("❌ User deleted:", data.id);
                break;
            }

            default:
                console.log("ℹ️ Unhandled Clerk webhook event:", type);
                break;
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("❌ Clerk webhook error:", err.message);
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = { clerkWebhooks };
