import React, { useState, useEffect } from "react";
import { FaUserCheck, FaPlus, FaDoorOpen } from "react-icons/fa";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // Import your axios instance

const CheckIn = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch check-in data
  const fetchCheckIns = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/bookings");
      setCheckIns(response.data);
    } catch (err) {
      console.error("Error fetching check-ins:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch check-ins when the component mounts
  useEffect(() => {
    fetchCheckIns();
  }, []);

  // Handle Check-Out
  const handleCheckOut = async (id) => {
    try {
      await axiosInstance.put(`/bookings/${id}`, { status: "Checked-Out" });
      fetchCheckIns(); // Refresh check-ins after checkout
    } catch (err) {
      console.error("Error checking out:", err);
    }
  };

  // Handle Check-In
  const handleCheckIn = async (id, roomId) => {
    try {
      // Update booking status to "Checked-In"
      await axiosInstance.put(`/bookings/${id}`, { status: "Checked-In" });

      // Update the room status to "Unavailable"
      await axiosInstance.patch(`/rooms/${roomId}/status`, {
        status: "Unavailable",
      });

      fetchCheckIns(); // Refresh check-ins after check-in
    } catch (err) {
      console.error("Error confirming check-in:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Guest Check-In</h1>

        {/* Add Check-In Button */}
        <Link to="/add-checkin">
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Add Check-In
          </button>
        </Link>

        {/* Check-In Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {loading ? (
            <p>Loading check-ins...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Guest Name</th>
                  <th className="p-2">Room</th>
                  <th className="p-2">Check-In Date</th>
                  <th className="p-2">Check-Out Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map((checkIn) => (
                  <tr key={checkIn.id} className="border-t">
                    <td className="p-2">{checkIn.guest_name}</td>
                    <td className="p-2">{checkIn.room_id}</td>
                    <td className="p-2">
                      {new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(checkIn.check_in_date))}
                    </td>
                    <td className="p-2">
                      {new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(checkIn.check_out_date))}
                    </td>
                    <td
                      className={`p-2 ${
                        checkIn.status === "Checked-In"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {checkIn.status}
                    </td>
                    <td className="p-2">
                      {checkIn.status === "Checked-In" ? (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-lg flex items-center"
                          onClick={() => handleCheckOut(checkIn.id)}
                        >
                          <FaDoorOpen className="mr-1" /> Check-Out
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded-lg flex items-center"
                          onClick={() =>
                            handleCheckIn(checkIn.id, checkIn.room_id)
                          }
                        >
                          <FaUserCheck className="mr-1" /> Confirm Check-In
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
