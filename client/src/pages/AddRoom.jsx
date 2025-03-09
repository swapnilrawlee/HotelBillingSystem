import React, { useState } from "react";
import Navbar from "./Navbar";
import axiosInstance from "../utils/axiosInstance"; // Import your axios instance

const AddRoom = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Single");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddRoom = () => {
    if (!roomNumber || !price) {
      setError("Room number and price are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const roomData = {
      room_number: roomNumber,  // Updated field name
      room_type: roomType,      // Updated field name
      price,                    // Price stays the same
      status: "Available",      // Assuming new rooms are initially available
      amenities,                // Amenities stays the same
    };

    // Make an API request to add a new room
    axiosInstance
      .post("/rooms", roomData)
      .then((response) => {
        setSuccessMessage(`Room ${roomNumber} added successfully!`);
        setLoading(false);
        // Reset form after successful submission
        setRoomNumber("");
        setRoomType("Single");
        setPrice("");
        setAmenities("");
      })
      .catch((error) => {
        setError("Error adding room.");
        setLoading(false);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Room</h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <label className="block mb-2">Room Number:</label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Room Number"
          />

          <label className="block mt-4 mb-2">Room Type:</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option>Single</option>
            <option>Double</option>
            <option>Deluxe</option>
            <option>Suite</option>
          </select>

          <label className="block mt-4 mb-2">Price (per night):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Price"
          />

          <label className="block mt-4 mb-2">Amenities:</label>
          <input
            type="text"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="WiFi, TV, AC, etc."
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

        <button
          onClick={handleAddRoom}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Room"}
        </button>
      </div>
    </div>
  );
};

export default AddRoom;
