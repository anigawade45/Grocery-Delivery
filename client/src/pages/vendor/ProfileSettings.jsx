import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

const ProfileSettings = () => {
  const { user, isLoaded } = useUser();
  const { user: clerkUser } = useClerk();

  const [name, setName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.publicMetadata?.bio || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      // Update fullName
      await clerkUser.update({ fullName: name });

      // Save additional metadata (like bio)
      await clerkUser.update({
        publicMetadata: {
          bio,
        },
      });

      alert("✅ Profile updated!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Failed to update profile.");
    }

    setSaving(false);
  };

  if (!isLoaded) {
    return <p className="text-center">Loading profile...</p>;
  }

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
            Email (managed by Clerk)
          </label>
          <input
            value={user?.emailAddresses[0]?.emailAddress || ""}
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
