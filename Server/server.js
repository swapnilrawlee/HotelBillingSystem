const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Create express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend URL
    methods: "GET, POST, PUT, PATCH, DELETE", // Add PATCH here
    allowedHeaders: "Content-Type, Authorization",
  })
);

const revenueRoute = require("./routes/revenue.js");
const occupancyRoute = require("./routes/occupancy.js");

// Routes
app.use('/api/rooms', require('./routes/rooms.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/bookings', require('./routes/bookings.js'));
app.use('/api/bills', require('./routes/bills.js'));
app.use("/api/revenue", revenueRoute);
app.use("/api/occupancy", occupancyRoute);
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
