const Notification = require("../models/Notification");

const sendNotification = async ({ userId, type, message }) => {
    if (!userId || !type || !message) {
        console.warn("Missing fields in sendNotification:", { userId, type, message });
        return; // Skip creating a notification
    }

    try {
        const notification = new Notification({
            userId,
            type,
            message,
        });
        await notification.save();
    } catch (error) {
        console.error("Error sending notification:", error.message);
    }
};

module.exports = sendNotification;
