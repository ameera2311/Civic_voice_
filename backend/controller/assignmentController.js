const db = require("../models/db");

exports.assignWorker = (req, res) => {

  const complaintId = req.params.id;
  const { workerId } = req.body;

  if (!workerId) {
    return res.status(400).json({ message: "Worker ID required" });
  }

  const sql = "UPDATE complaints SET worker_id = ? WHERE id = ?";

  db.query(sql, [workerId, complaintId], (err) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Worker assignment failed" });
    }

    res.json({ message: "Worker assigned successfully" });

  });

};