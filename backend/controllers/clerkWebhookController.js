const { Webhook } = require("svix");
const User = require("../models/User");

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

const clerkWebhooks = async (req, res) => {
    try {
        const wh = new Webhook(webhookSecret);

        const payload = req.rawBody;
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const event = wh.verify(payload, headers);
        const { type, data } = event;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url || "",
                    role: data.public_metadata?.role || "vendor",
                    phone: data.phone_numbers?.[0]?.phone_number || "",
                    clerkId: data.id,
                    status: "approved",
                };

                await User.create(userData);
                return res.status(200).json({ success: true, message: "User created" });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url || "",
                    phone: data.phone_numbers?.[0]?.phone_number || "",
                };

                await User.findByIdAndUpdate(data.id, userData, { new: true });
                return res.status(200).json({ success: true, message: "User updated" });
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                return res.status(200).json({ success: true, message: "User deleted" });
            }

            default:
                return res.status(400).json({ success: false, message: `Unhandled event: ${type}` });
        }
    } catch (error) {
        console.error("❌ Clerk webhook error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { clerkWebhooks };
