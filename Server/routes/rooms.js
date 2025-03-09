const express = require('express');
const db = require('../config/mysqlconfig');
const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const [rooms] = await db.execute('SELECT * FROM rooms');
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/count', async (req, res) => {
  try {
    const [rooms] = await db.execute('select count(*) as total from rooms');
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/unavailable', async (req, res) => {
  try {
    const [rooms] = await db.execute(
      "SELECT COUNT(*) AS unavailable FROM rooms WHERE status = 'unavailable'"
    );

    // Extract count value properly
    const unavailableCount = rooms[0]?.unavailable || 0;

    res.json({ unavailable: unavailableCount }); // Send a clear JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add a new room
router.post('/', async (req, res) => {
  const { room_number, room_type, price, status, amenities } = req.body;

  try {
    await db.execute(
      'INSERT INTO rooms (room_number, room_type, price, status, amenities) VALUES (?, ?, ?, ?, ?)',
      [room_number, room_type, price, status, amenities]
    );
    res.status(201).json({ message: 'Room added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update room status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status input (Assuming ENUM('available', 'unavailable'))
  const validStatuses = ['available', 'unavailable'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    // Check if the room exists before updating
    const [roomCheck] = await db.execute('SELECT id FROM rooms WHERE id = ?', [id]);
    

    if (roomCheck.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Update the status
    const [result] = await db.execute('UPDATE rooms SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows > 0) {
      res.json({ message: `Room ${id} status updated to ${status}` });
    } else {
      res.status(500).json({ error: 'Failed to update room status' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a room
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the room exists
    const [roomCheck] = await db.execute('SELECT id FROM rooms WHERE id = ?', [id]);

    if (roomCheck.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Delete the room
    await db.execute('DELETE FROM rooms WHERE id = ?', [id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
