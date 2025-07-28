import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { name, email, bio } = res.data.user;
        setName(name);
        setEmail(email);
        setBio(bio || "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/vendor/profile`,
        { name, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">My Profile</h2>

      <div className="bg-white shadow rounded-2xl p-6 space-y-6 transition-all duration-200">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mt-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-300 rounded mt-6"></div>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (read-only)
              </label>
              <input
                value={email}
                readOnly
                className="block w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Write something about yourself..."
              ></textarea>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
