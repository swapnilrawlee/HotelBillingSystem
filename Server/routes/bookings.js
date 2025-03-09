const express = require('express');
const db = require('../config/mysqlconfig');
const router = express.Router();

// Create a booking (check-in)
// Inside your booking route (assuming you've already configured express and your database)

// Inside your booking route

router.post("/", async (req, res) => {
  console.log(req.body);

  const { guest_name, phone, room_id, check_in_date, check_out_date, payment_status } = req.body;

  try {
    // Check if the room_number exists in the rooms table
    const [roomCheck] = await db.execute('SELECT id FROM rooms WHERE room_number = ?', [room_id]);

    if (roomCheck.length === 0) {
      return res.status(400).json({ message: "Room ID does not exist." });
    }

    // If room exists, proceed with inserting the booking
    const result = await db.execute(
      "INSERT INTO bookings (guest_name, phone, room_id, check_in_date, check_out_date, payment_status) VALUES (?, ?, ?, ?, ?, ?)",
      [guest_name, phone, roomCheck[0].id, check_in_date, check_out_date, payment_status]
    );

    console.log(`Booking created successfully with booking ID: ${result[0].insertId}`);
    res.status(201).json({ message: "Booking created successfully" });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all bookings
router.get('/', async (req, res) => {
  try {
    const [bookings] = await db.execute('SELECT * FROM bookings');
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/checkin', async (req, res) => {
  try {
    const [rooms] = await db.execute(
      "SELECT COUNT(*) AS booked FROM bookings WHERE status = 'Checked-In'"
    );

    // Extract count value properly
    const bookedCount = rooms[0]?.booked || 0; // Fix incorrect reference

    res.json({ booked: bookedCount }); // Send correct JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/recentcheckins', async (req, res) => {
  try {
    const [recentCheckins] = await db.execute(
      `SELECT 
          b.id AS booking_id,
          b.guest_name,
          b.phone,
          r.room_number,
          b.check_in_date,
          b.check_out_date,
          b.payment_status,
          b.status
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.status = 'Checked-In'
       ORDER BY b.check_in_date DESC
       LIMIT 5`
    );

    res.json(recentCheckins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Update booking status (Check-In / Check-Out)
router.put('/:id', async (req, res) => {
  const { id } = req.params;  // Booking ID from URL
  const { status } = req.body;  // New status (Checked-In or Checked-Out)

  try {
    const validStatuses = ['Checked-In', 'Checked-Out']; // Allowed status values
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update the status in the database
    const [result] = await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: `Booking status updated to ${status}` });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
