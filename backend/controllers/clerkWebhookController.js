const User = require("../models/User");

exports.handleClerkWebhook = async (req, res) => {
    const event = req.body;

    const { type, data } = event;

    try {
        if (type === "user.created" || type === "user.updated") {
            const clerkId = data.id;

            const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
            const email = data.email_addresses?.[0]?.email_address || "";
            const phone = data.phone_numbers?.[0]?.phone_number || "";

            await User.findOneAndUpdate(
                { clerkId },
                {
                    name,
                    email,
                    phone,
                    clerkId,
                },
                { upsert: true, new: true }
            );
        }

        if (type === "user.deleted") {
            await User.findOneAndDelete({ clerkId: data.id });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(500).json({ error: "Webhook handling failed" });
    }
};
