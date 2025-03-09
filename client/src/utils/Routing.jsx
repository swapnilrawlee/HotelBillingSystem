import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import RoomManagement from "../pages/RoomManagement.jsx";
import CheckIn from "../pages/CheckIn.jsx";
import Billing from "../pages/Billing.jsx";
import Reports from "../pages/Reports.jsx";
import Settings from "../pages/Settings.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import AddRoom from "../pages/AddRoom.jsx";
import NotFound from "../pages/NotFound.jsx";
import AddCheckIn from "../pages/AddCheckIn.jsx";
import BillDetail from "../pages/BillDetail.jsx";

// Function to check if user is authenticated
const isAuthenticated = () => {
    return localStorage.getItem("token") !== null; // Check if token exists
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const Routing = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/rooms" element={<ProtectedRoute element={<RoomManagement />} />} />
      <Route path="/check-in" element={<ProtectedRoute element={<CheckIn />} />} />
      <Route path="/billing" element={<ProtectedRoute element={<Billing />} />} />
      <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      <Route path="/add-room" element={<ProtectedRoute element={<AddRoom />} />} />
      <Route path="/add-checkin" element={<ProtectedRoute element={<AddCheckIn />} />} />
      <Route path="/bill/:id" element={<ProtectedRoute element={<BillDetail />} />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
