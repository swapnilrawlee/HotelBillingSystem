import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // axiosInstance configured for your API

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    roomType: "",
    status: "",
    priceMin: "",
    priceMax: "",
  });

  // Fetch rooms from the API
  useEffect(() => {
    axiosInstance
      .get("/rooms")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRooms(response.data);
        } else {
          setError("Invalid data format received");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching rooms");
        setLoading(false);
      });
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Function to filter rooms based on the filters
  const filteredRooms = rooms.filter((room) => {
    const { roomType, status, priceMin, priceMax } = filters;

    let matchesRoomType = true;
    let matchesStatus = true;
    let matchesPrice = true;

    // Check room type filter
    if (roomType && room.room_type !== roomType) {
      matchesRoomType = false;
    }

    // Check status filter (case-insensitive comparison)
    if (status && room.status.toLowerCase() !== status.toLowerCase()) {
      matchesStatus = false;
    }

    // Check price range filter
    if (priceMin && room.price < parseFloat(priceMin)) {
      matchesPrice = false;
    }
    if (priceMax && room.price > parseFloat(priceMax)) {
      matchesPrice = false;
    }

    return matchesRoomType && matchesStatus && matchesPrice;
  });

  // Function to toggle room status (Check In / Check Out)
  const handleToggleStatus = async (roomId, currentStatus) => {
    const newStatus = currentStatus === "available" ? "unavailable" : "available";
  
    try {
      await axiosInstance.put(`/rooms/${roomId}/status`, { status: newStatus });
  
      // Update the state for UI update
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, status: newStatus } : room
        )
      );
    } catch (error) {
      console.error("Error updating room status:", error);
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Room Management</h1>

        {/* Filters Section */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block mb-2">Room Type</label>
            <select
              name="roomType"
              value={filters.roomType}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Family">Family</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Executive">Executive</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleFilterChange}
                placeholder="Min"
                className="px-3 py-2 border rounded-lg w-24"
              />
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleFilterChange}
                placeholder="Max"
                className="px-3 py-2 border rounded-lg w-24"
              />
            </div>
          </div>
        </div>

        {/* Add Room Button */}
        <Link to="/add-room">
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600">
            <FaPlus className="mr-2" /> Add New Room
          </button>
        </Link>

        {/* Room Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Room No</th>
                <th className="p-2">Room ID</th>
                <th className="p-2">Type</th>
                <th className="p-2">Price (₹)</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms && filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="border-t">
                    <td className="p-2">{room.room_number}</td>
                    <td className="p-2">{room.id}</td>
                    <td className="p-2">{room.room_type}</td>
                    <td className="p-2">₹{room.price}</td>
                    <td className={`p-2 ${room.status === "available" ? "text-green-600" : "text-red-600"}`}>
                      {room.status === "available" ? "Available" : "Unavailable"}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleToggleStatus(room.id, room.status)}
                        className={`px-4 py-2 text-white rounded-lg ${
                          room.status === "available" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {room.status === "available" ? "Check In" : "Check Out"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-2 text-center">No rooms available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
