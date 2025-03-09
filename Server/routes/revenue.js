// routes/revenue.js
const express = require("express");
const router = express.Router();
const db = require("../config/mysqlconfig");

// Get monthly revenue data
router.get("/", (req, res) => {
  const query = `
    SELECT 
      MONTHNAME(check_in_date) AS month, 
      SUM(rate * nights) AS revenue
    FROM bills
    GROUP BY MONTH(check_in_date)
    ORDER BY MONTH(check_in_date)`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching revenue data" });
    }

    const months = results.map(row => row.month);
    const revenue = results.map(row => row.revenue);

    res.json({ months, revenue });
  });
});

module.exports = router;
