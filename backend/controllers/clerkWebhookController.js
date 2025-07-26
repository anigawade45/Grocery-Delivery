const { Webhook } = require("svix");
const User = require("../models/User");

const clerkWebhooks = async (req, res) => {
    try {
        const payload = req.body;
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const evt = wh.verify(payload, headers);

        const { data, type } = evt;

        switch (type) {
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                    role: data.public_metadata?.role || "vendor", // fallback default
                };

                await User.create(userData);
                break;
            }

            case "user.updated": {
                const updatedData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                    role: data.public_metadata?.role || undefined,
                };

                await User.findOneAndUpdate({ clerkId: data.id }, updatedData);
                break;
            }

            case "user.deleted": {
                await User.findOneAndDelete({ clerkId: data.id });
                break;
            }
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("🔴 Webhook Error:", err.message);
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = { clerkWebhooks };
