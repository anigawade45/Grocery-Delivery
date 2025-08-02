import React, { useEffect, useState, useContext } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const role = user?.role;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/${role}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Fetch notifications failed", err);
    }
  };

  const markAsRead = async (id) => {
    const role = user?.role;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/${role}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Mark as read failed", err);
    }
  };

  const deleteNotification = async (id) => {
    const role = user?.role;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/${role}/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete notification");
    }
  };

  useEffect(() => {
    if (user?.role) fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm text-center">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 text-sm font-sm border-b ${
                  !n.read ? "bg-blue-50 font-sm text-sm" : "bg-white"
                }`}
              >
                <div>{n.message}</div>
                <div className="flex justify-end text-xs text-gray-500 mt-1 gap-2">
                  {!n.read && (
                    <button onClick={() => markAsRead(n._id)}>
                      Mark as read
                    </button>
                  )}
                  <button onClick={() => deleteNotification(n._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
