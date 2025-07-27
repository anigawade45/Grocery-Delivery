import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileSettings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

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
      alert("✅ Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update profile.");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold text-orange-700 mb-6">
        My Profile
      </h2>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            value={email}
            readOnly
            className="mt-1 block w-full border border-gray-200 rounded-md p-2 bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={3}
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
