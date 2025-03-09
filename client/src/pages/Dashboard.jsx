import React, { useEffect, useState } from "react";
import { FaBed, FaMoneyBillWave, FaClipboardList, FaUserCheck } from "react-icons/fa";
import Navbar from "./Navbar";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = ({ role }) => {
  const [totalRooms, setTotalRooms] = useState([]);
  const [unavailableRooms, setUnavailableRooms] = useState([]);
  const [booked, setBooked] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [guestData, setGuestData] = useState([]);
  const fetchingData = async() => {
    const response = await  axiosInstance.get("/rooms/count");
    const response1 = await  axiosInstance.get("/rooms/unavailable");
    const response2 = await  axiosInstance.get("/bookings/checkin");
    const response3 = await  axiosInstance.get("/bills/revenue");
    const response4 = await  axiosInstance.get("/bookings/recentcheckins");
    console.log(response4.data);
    setGuestData(response4.data)
    
    
    setRevenue(response3.data.total_revenue);

    
    setBooked(response2.data.booked);
    
    setTotalRooms(response.data[0].total);
    setUnavailableRooms(response1.data.unavailable);
  }
  useEffect(()=>{
    fetchingData()
  },[])
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
          <FaBed className="text-blue-500 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Total Rooms</h2>
            <p className="text-gray-600 text-xl">{totalRooms}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
          <FaUserCheck className="text-green-500 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Occupied Rooms</h2>
            <p className="text-gray-600 text-xl">{unavailableRooms}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
          <FaMoneyBillWave className="text-yellow-500 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold">Revenue Today</h2>
            <p className="text-gray-600 text-xl">₹{revenue}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
          <FaClipboardList className="text-red-500 text-4xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold"> Check-Ins</h2>
            <p className="text-gray-600 text-xl">{booked}</p>
          </div>
        </div>
      </div>

      {/* Conditional Rendering Based on Role */}
      {role === "admin" && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
          <p className="text-gray-600">Here you can manage the hotel operations, staff, and view detailed reports.</p>
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md">
            Manage Rooms
          </button>
        </div>
      )}

      {/* Recent Check-Ins Table */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Check-Ins</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Guest Name</th>
              <th className="p-2">Room</th>
              <th className="p-2">Check-In Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {guestData.map((guest) => (
             

                       <tr className="border-t" key={guest.id}>
              <td className="p-2">{guest.guest_name}</td>
              <td className="p-2">{guest.room_number}</td>
              <td className="p-2">{new Date(guest.check_in_date).toLocaleDateString()}</td>
              <td className="p-2 text-green-600">{guest.status}</td>
            </tr>
            ))}
           
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
