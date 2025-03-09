// routes/bills.js
const express = require('express');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');
const db = require('../config/mysqlconfig');  // Your MySQL config
const router = express.Router();

// Route to get all bills
router.get('/', async (req, res) => {
  try {
    const [bills] = await db.execute('SELECT * FROM bills');  // Query the bills table
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/revenue', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT SUM(total) AS total_revenue FROM bills");

    // Extract the total_revenue value properly
    const totalRevenue = rows[0]?.total_revenue || 0;

    res.json({ total_revenue: totalRevenue }); // Send response in a clear JSON format
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to add a new bill
router.post('/', async (req, res) => {
  try {
    const { guest_name, room, nights, rate, extras, check_in_date, check_out_date } = req.body;

    // Validate input data
    if (!guest_name || !room || !nights || !rate || !check_in_date || !check_out_date) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Calculate total
    const total = (parseFloat(rate) * parseInt(nights)) + (parseFloat(extras) || 0);

    // Insert into database
    const [result] = await db.execute(
      `INSERT INTO bills (guest_name, room, nights, rate, extras, total, check_in_date, check_out_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [guest_name, room, nights, rate, extras, total, check_in_date, check_out_date]
    );

    // Send response
    res.status(201).json({ message: 'Bill added successfully', billId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to download PDF invoice
router.get('/download/pdf/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the bill data based on the ID
    const [bill] = await db.execute('SELECT * FROM bills WHERE id = ?', [id]);
    console.log(bill[0].guest_name);
    

    if (bill.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Generate PDF
    const doc = new jsPDF();
    doc.text(`Invoice for ${bill[0].guest_name}`, 20, 20);
    doc.text(`Room No: ${bill[0].room}`, 20, 30);
    doc.text(`Nights: ${bill[0].nights}`, 20, 40);
    doc.text(`Rate (₹/night): ₹${bill[0].rate}`, 20, 50);
    doc.text(`Extras (₹): ₹${bill[0].extras}`, 20, 60);
    doc.text(`Total (₹): ₹${bill[0].total}`, 20, 70);

    // Save to file
    const fileName = `Invoice_${bill[0].guest_name}.pdf`;
    const filePath = path.join(__dirname, '../downloads', fileName);
    doc.save(filePath);

    // Send the file to the client
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to download CSV invoice
router.get('/download/csv/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the bill data based on the ID
    const [bill] = await db.execute('SELECT * FROM bills WHERE id = ?', [id]);

    if (bill.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Create CSV data
    const csvData = [
      ["Guest Name", "Room", "Nights", "Rate (₹/night)", "Extras (₹)", "Total (₹)"],
      [bill[0].guest_name, bill[0].room, bill[0].nights, bill[0].rate, bill[0].extras, bill[0].total],
    ];

    // Convert to CSV format
    const csv = csvData.map(row => row.join(',')).join('\n');

    // Save the CSV to a file
    const fileName = `Invoice_${bill[0].id}.csv`;
    const filePath = path.join(__dirname, '../downloads', fileName);
    fs.writeFileSync(filePath, csv);

    // Send the CSV file to the client
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// In routes/bills.js
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the bill from the database
      const [bill] = await db.execute('SELECT * FROM bills WHERE id = ?', [id]);
  
      if (bill.length === 0) {
        return res.status(404).json({ message: 'Bill not found' });
      }
  
      res.json(bill[0]);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  //delete bill
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Delete the bill from the database
      const [result] = await db.execute('DELETE FROM bills WHERE id =?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bill not found' });
      }
  
      res.json({ message: 'Bill deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  //update bill status

module.exports = router;
