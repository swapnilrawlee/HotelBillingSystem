// routes/occupancy.js
const express = require("express");
const db = require("../config/mysqlconfig");
const router = express.Router();

// Get weekly room occupancy data
router.get("/", (req, res) => {
  const query = `
    SELECT 
      WEEK(check_in_date) AS week, 
      COUNT(*) AS occupancy
    FROM bills
    GROUP BY WEEK(check_in_date)
    ORDER BY WEEK(check_in_date)`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching occupancy data" });
    }

    const weeks = results.map(row => `Week ${row.week}`);
    const occupancy = results.map(row => row.occupancy);

    res.json({ weeks, occupancy });
  });
});

module.exports = router;
