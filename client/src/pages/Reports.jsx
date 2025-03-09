import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import Navbar from "./Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const Reports = () => {
  // Dummy Data for Reports
  const revenueData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: [
          50000, 65000, 70000, 80000, 75000, 90000, 120000, 110000, 95000,
          105000, 115000, 130000,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const occupancyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Room Occupancy (%)",
        data: [75, 80, 90, 85],
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar/>
      <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Hotel Reports</h1>
      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>
        <Bar
          data={revenueData}
        
        />
      </div>

      {/* Room Occupancy Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Room Occupancy Trend</h2>
        <Line
          data={occupancyData}
       
        />
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center">
          <FaFilePdf className="mr-2" /> Export PDF
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center">
          <FaFileExcel className="mr-2" /> Export Excel
        </button>
      </div>
    </div>
    </div>
  );
};

export default Reports;
