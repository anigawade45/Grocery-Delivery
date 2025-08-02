import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import SupplierDashboard from "./SupplierDashboard";

const SupplierProfile = () => {
  const { user, token } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [lat, setLat] = useState(user?.location?.coordinates[1] || "");
  const [lng, setLng] = useState(user?.location?.coordinates[0] || "");
  const [address, setAddress] = useState(user?.formattedAddress || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [pincode, setPincode] = useState(user?.pincode || "");

  const [loadingLocation, setLoadingLocation] = useState(false);

  // Get current location and reverse geocode
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const addr = data.address || {};
          setCity(addr.city || addr.town || addr.village || "");
          setState(addr.state || "");
          setAddress(data.display_name || "");
          setPincode(addr.postcode || "");
          toast.success("Location fetched successfully");
        } catch (err) {
          toast.error("Reverse geocoding failed");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        toast.error("Location access denied");
        setLoadingLocation(false);
      }
    );
  };

  // Forward geocode from PIN code
  useEffect(() => {
    if (pincode.length === 6 && /^[1-9][0-9]{5}$/.test(pincode)) {
      const fetchAddressFromPin = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${pincode}&countrycodes=in&limit=1`
          );
          const data = await response.json();
          if (data?.length > 0) {
            const place = data[0];
            const { lat: fetchedLat, lon: fetchedLng, display_name } = place;
            setLat(fetchedLat);
            setLng(fetchedLng);
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${fetchedLat}&lon=${fetchedLng}`
            );
            const reverse = await res.json();
            const addr = reverse.address || {};
            setCity(addr.city || addr.town || addr.village || "");
            setState(addr.state || "");
            setAddress(
              display_name || `${addr.city || ""}, ${addr.state || ""}`
            );
            toast.success("Address auto-filled from pincode");
          } else {
            toast.warning("Invalid or unknown pincode.");
          }
        } catch (err) {
          toast.error("Failed to fetch address from pincode");
          console.error(err);
        }
      };

      fetchAddressFromPin();
    }
  }, [pincode]);

  // Submit handler
  const handleSave = async (e) => {
    e.preventDefault();

    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      toast.error("Latitude and longitude must be numeric.");
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/vendor/profile`,
        {
          name: name.trim(),
          bio: bio.trim(),
          location: {
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          formattedAddress: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">
        Profile Settings
      </h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode
          </label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Enter 6-digit pincode"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loadingLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {loadingLocation ? "Locating..." : "Use My Location"}
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white font-semibold py-2 px-4 rounded hover:bg-orange-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SupplierProfile;
