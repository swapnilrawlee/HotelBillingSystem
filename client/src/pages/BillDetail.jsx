import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get the bill ID from the URL
import Navbar from "./Navbar";

const BillDetail = () => {
  const { id } = useParams(); // Get the bill ID from URL params
  const [bill, setBill] = useState(null);

  useEffect(() => {
    // Fetch the bill details from the backend using the bill ID
    fetch(`/api/bills/${id}`)
      .then((response) => response.json())
      .then((data) => setBill(data))
      .catch((error) => console.error("Error fetching bill:", error));
  }, [id]);

  if (!bill) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Bill Details</h1>

        {/* Bill Details */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Bill for {bill.guest}</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Guest Name:</span>
              <span>{bill.guest}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Room Number:</span>
              <span>{bill.room}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Nights Stayed:</span>
              <span>{bill.nights}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Rate (₹/night):</span>
              <span>₹{bill.rate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Extras (₹):</span>
              <span>₹{bill.extras}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="font-semibold">Total (₹):</span>
              <span>₹{bill.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Check-In Date:</span>
              <span>{new Date(bill.check_in_date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Check-Out Date:</span>
              <span>{new Date(bill.check_out_date).toLocaleString()}</span>
            </div>
          </div>

          {/* Print and Download Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => window.print()}
            >
              Print
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={() => alert("Download functionality coming soon!")}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetail;
