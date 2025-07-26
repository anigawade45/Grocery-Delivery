import React, { useState } from "react";

const ProfileSettings = () => {
  const [name, setName] = useState("Ravi Kumar");
  const [email, setEmail] = useState("ravi@rasoisathi.com");
  const [bio, setBio] = useState("Experienced street food vendor in Mumbai.");

  const handleSave = () => {
    alert("Profile saved successfully!");
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
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
