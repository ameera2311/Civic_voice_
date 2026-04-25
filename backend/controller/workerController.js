const db = require("../models/db");


/* ===================================================
   GET ALL WORKERS
=================================================== */
exports.getWorkers = (req, res) => {

  const sql = `
    SELECT 
      workers.*,
      COUNT(complaints.id) AS assigned_complaints
    FROM workers
    LEFT JOIN complaints
      ON complaints.worker_id = workers.id
    GROUP BY workers.id
    ORDER BY workers.name ASC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching workers" });
    }

    res.json(results);
  });
};


/* ===================================================
   ADD WORKER
=================================================== */
exports.addWorker = (req, res) => {
  console.log("Worker data received:", req.body);
  const { name, phone, department } = req.body;
  
  if (!name || !phone || !department) {
    return res.status(400).json({
      message: "Name, phone and department are required"
    });
  }
  
  const sql = `
    INSERT INTO workers (name, phone, department)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, phone, department], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Worker creation failed" });
    }

    res.json({
      message: "Worker added successfully",
      workerId: result.insertId
    });
  });
};


/* ===================================================
   DELETE WORKER
=================================================== */
exports.deleteWorker = (req, res) => {

  const workerId = req.params.id;

  const sql = `
    DELETE FROM workers
    WHERE id = ?
  `;

  db.query(sql, [workerId], (err) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Worker delete failed" });
    }

    res.json({
      message: "Worker deleted successfully"
    });
  });
};


/* ===================================================
   UPDATE WORKER
=================================================== */
exports.updateWorker = (req, res) => {

  const { name, phone, department } = req.body;

  const sql = `
    UPDATE workers
    SET name=?, phone=?, department=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, phone, department, req.params.id],
    (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Worker update failed" });
      }

      res.json({
        message: "Worker updated successfully"
      });
    }
  );
};