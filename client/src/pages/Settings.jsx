import React, { useState } from "react";
import Navbar from "./Navbar";

const Settings = () => {
  const [hotelName, setHotelName] = useState("Grand Hotel");
  const [taxRate, setTaxRate] = useState(10);
  const [currency, setCurrency] = useState("₹");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar/>
      <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* General Settings */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">General Settings</h2>
        <label className="block mb-2">Hotel Name:</label>
        <input
          type="text"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Billing Settings */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Billing Settings</h2>
        <label className="block mb-2">Tax Rate (%):</label>
        <input
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <label className="block mt-4 mb-2">Currency Symbol:</label>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* User Settings */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">User Settings</h2>
        <label className="block mb-2">Change Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Save Button */}
      <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Save Changes
      </button>
    </div>
    </div>
  );
};

export default Settings;
