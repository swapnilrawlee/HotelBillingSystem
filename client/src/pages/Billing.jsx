import React, { useEffect, useState } from "react";
import { FaFileInvoice, FaPrint, FaDownload, FaPlus, FaTrash, FaFilePdf, FaFileCsv } from "react-icons/fa";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Billing = () => {
  // Dummy Billing Data (Replace with API later)
  const [bills, setBills] = useState([
  ]);

  // State to hold new bill input values
  const [newBill, setNewBill] = useState({
    guest: '',
    room: '',
    nights: '',
    rate: '',
    extras: '',
    total: '',
    check_in_date: '',
    check_out_date: '',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a new bill
  const handleAddBill = async() => {
    const newBillData = {
      ...newBill,
      id: bills.length + 1, // Assign a new ID based on current bills count
      total: parseInt(newBill.rate) * parseInt(newBill.nights) + parseInt(newBill.extras), // Calculating total
    };

    const response = await axiosInstance.post('/bills',{
      guest_name: newBill.guest,
      room: newBill.room,
      nights: newBill.nights,
      rate: newBill.rate,
      extras: newBill.extras,
      total: newBill.total,
      check_in_date: newBill.check_in_date,
      check_out_date: newBill.check_out_date,
    })
    if (response.status === 201) {
      alert('Bill added successfully!');
      setBills((prevBills) => [...prevBills, newBillData]);

    } else {
      alert('Error adding bill. Please try again.');
    }

    setNewBill({
      guest: '',
      room: '',
      nights: '',
      rate: '',
      extras: '',
      total: '',
      check_in_date: '',
      check_out_date: '',
    }); // Clear form fields after submission
  };

  // Handle deleting a bill
  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      const response = await axiosInstance.delete(`/bills/${billId}`);
      if (response.status === 200) {
        alert('Bill deleted successfully!');
        setBills((prevBills) => prevBills.filter((bill) => bill.id!== billId));
      } else {
        alert('Error deleting bill. Please try again.');
      }
    }
  };
  //fetch all bills
  const fetchBills = async () => {
    const response = await axiosInstance.get('/bills');
    if (response.status === 200) {
      console.log(response.data);
      
      setBills(response.data);
    } else {
      alert('Error fetching bills. Please try again.');
    }
  };
  useEffect(() => {
    fetchBills();
  }, []);
  const handleViewBill = (bill) => {
    window.open(`/download/bill/${bill.id}`, "_blank");
  };
  //handle dowmadd bill
  const handleDownload = async (bill, type) => {
    try {
        const response = await axiosInstance.get(`/bills/download/${type}/${bill.id}`, {
            responseType: "blob", // Important for handling file downloads
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: response.headers["content-type"] });

        // Create a temporary download link
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `Invoice_${bill.guest_name}.${type}`; // Set filename dynamically
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up

    } catch (error) {
        console.error("Download error:", error);
    }
};

  // Handle printing the bill
  const handlePrint = (bill) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill - ${bill.guest}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .bill-container {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        h1 {
            font-size: 22px;
            margin-bottom: 20px;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: #fff;
            text-transform: uppercase;
        }
        td {
            color: #555;
        }
    </style>
</head>
<body>
    <div class="bill-container">
        <h1>Bill for ${bill.guest_name}</h1>
        <table>
            <tr><th>Guest Name</th><td>${bill.guest_name}</td></tr>
            <tr><th>Room</th><td>${bill.room}</td></tr>
            <tr><th>Nights</th><td>${bill.nights}</td></tr>
            <tr><th>Rate (₹/night)</th><td>₹${bill.rate}</td></tr>
            <tr><th>Extras (₹)</th><td>₹${bill.extras}</td></tr>
            <tr><th>Total (₹)</th><td><strong>₹${bill.total}</strong></td></tr>
            <tr><th>Check-In Date</th><td>${new Date(bill.check_in_date).toLocaleString()}</td></tr>
            <tr><th>Check-Out Date</th><td>${new Date(bill.check_out_date).toLocaleString()}</td></tr>
        </table>
    </div>
</body>
</html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Billing & Invoices</h1>

        {/* Billing Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Guest Name</th>
                <th className="p-2">Room</th>
                <th className="p-2">Nights</th>
                <th className="p-2">Rate (₹/night)</th>
                <th className="p-2">Extras (₹)</th>
                <th className="p-2">Total (₹)</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} className="border-t">
                  <td className="p-2">{bill.guest_name}</td>
                  <td className="p-2">{bill.room}</td>
                  <td className="p-2">{bill.nights}</td>
                  <td className="p-2">₹{bill.rate}</td>
                  <td className="p-2">₹{bill.extras}</td>
                  <td className="p-2 font-bold">₹{bill.total}</td>
                  <td className="p-2 flex space-x-2">
                    <button 
                      className="px-3 py-1 bg-red-500 text-white rounded-lg flex items-center" 
                      onClick={() => handleDownload(bill, 'pdf')}
                    >
                      <FaFilePdf className="mr-1" /> PDF
                    </button>

                    <button 
                      className="px-3 py-1 bg-green-500 text-white rounded-lg flex items-center" 
                      onClick={() => handleDownload(bill, 'csv')}
                    >
                      <FaFileCsv className="mr-1" /> CSV
                    </button>
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded-lg flex items-center"
                      onClick={() => handlePrint(bill)}
                    >
                      <FaPrint className="mr-1" /> Print
                    </button>
                  
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg flex items-center"
                      onClick={() => handleDeleteBill(bill.id)}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Bill Form */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Add New Bill</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="guest"
              placeholder="Guest Name"
              value={newBill.guest}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="room"
              placeholder="Room Number"
              value={newBill.room}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="nights"
              placeholder="Number of Nights"
              value={newBill.nights}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="rate"
              placeholder="Rate per Night"
              value={newBill.rate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="extras"
              placeholder="Extras"
              value={newBill.extras}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="datetime-local"
              name="check_in_date"
              value={newBill.check_in_date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="datetime-local"
              name="check_out_date"
              value={newBill.check_out_date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddBill}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
            >
              Add Bill
            </button>
            
            {/* deleteBill */}
            {bills.length > 0 && (
              <button
                onClick={() => handleDeleteBill(bills[0].id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg mt-4"
              >
                Delete All Bills
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
