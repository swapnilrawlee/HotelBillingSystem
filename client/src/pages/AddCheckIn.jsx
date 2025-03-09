import React, { useState } from "react";
import Navbar from "./Navbar";
import axiosInstance from "../utils/axiosInstance";

const AddCheckIn = () => {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [nights, setNights] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const handleCheckIn = async () => {
    try {
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + parseInt(nights));

      // Create the booking data object
      const bookingData = {
        guest_name: guestName,
        phone: phone,
        room_id: roomNumber, // room_number as input by the user
        check_in_date: checkInDate,
        check_out_date: checkOutDate.toISOString().split('T')[0], // Format the date (YYYY-MM-DD)
        payment_status: paymentStatus,
      };
      
      // Make the POST request to the backend
      await axiosInstance.post("/bookings", bookingData);

      // Alert success and reset the form
      alert(`Guest ${guestName} checked in successfully!`);
      setGuestName("");
      setPhone("");
      setRoomNumber("");
      setCheckInDate("");
      setNights(1);
      setPaymentStatus("Pending");

    } catch (error) {
      console.error("Error checking in guest:", error);
      alert("Failed to check-in guest. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">New Check-In</h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <label className="block mb-2">Guest Name:</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <label className="block mt-4 mb-2">Phone Number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <label className="block mt-4 mb-2">Room Number:</label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <label className="block mt-4 mb-2">Check-In Date:</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <label className="block mt-4 mb-2">Number of Nights:</label>
          <input
            type="number"
            value={nights}
            onChange={(e) => setNights(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <label className="block mt-4 mb-2">Payment Status:</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option>Pending</option>
            <option>Paid</option>
          </select>
        </div>

        <button onClick={handleCheckIn} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Confirm Check-In
        </button>
      </div>
    </div>
  );
};

export default AddCheckIn;
