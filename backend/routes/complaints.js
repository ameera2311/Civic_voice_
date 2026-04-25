const express = require("express");
const router = express.Router();
const db = require("../models/db");
const { verifyUser } = require("../middleware/authMiddleware");


/* --------------------------------------------------
   Helper: generate complaint ID
-------------------------------------------------- */
function generateComplaintId() {
  return `CVC-${Math.floor(100000 + Math.random() * 900000)}`;
}


/* --------------------------------------------------
   POST /api/complaints  (Create Complaint)
-------------------------------------------------- */
router.post("/", verifyUser, (req, res) => {

  const userId = req.user.id;

  const {
    customerName,
    customerNumber,
    issue,
    description,
    predictedIssue,
    category,
    urgency,
    manualLocation,
    gpsLocation,
    latitude,
    longitude,
    imageName
  } = req.body;

  const complaintId = generateComplaintId();

  /* ------------------------------------------
     STEP 1 : Find worker with least workload
  -------------------------------------------*/

  const workerSql = `
    SELECT workers.id,
           COUNT(complaints.id) AS total_work
    FROM workers
    LEFT JOIN complaints
      ON complaints.worker_id = workers.id
    WHERE workers.department = ?
    GROUP BY workers.id
    ORDER BY total_work ASC
    LIMIT 1
  `;

  db.query(workerSql, [predictedIssue], (err, workerResult) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Worker search failed" });
    }

    let workerId = null;

    if (workerResult.length > 0) {
      workerId = workerResult[0].id;
    }

    /* ------------------------------------------
       STEP 2 : Insert complaint
    -------------------------------------------*/

    const insertSql = `
      INSERT INTO complaints (
        complaint_id,
        user_id,
        worker_id,
        customer_name,
        customer_number,
        title,
        description,
        predicted_issue,
        category,
        urgency,
        manual_location,
        gps_location,
        latitude,
        longitude,
        image_name,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
        complaintId,
        userId,
        workerId,
        customerName,
        customerNumber,
        issue,
        description,
        predictedIssue,
        category,
        urgency,
        manualLocation,
        gpsLocation,
        latitude,
        longitude,
        imageName,
        "Assigned"
      ],
      (err) => {

        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Insert failed" });
        }

        res.status(201).json({
          complaintId,
          workerAssigned: workerId,
          status: "Assigned"
        });

      }
    );

  });

});


/* --------------------------------------------------
   POST /api/complaints/track
-------------------------------------------------- */
router.post("/track", (req, res) => {
  const { complaintId } = req.body;

  if (!complaintId) {
    return res.status(400).json({ message: "Complaint ID required" });
  }

  const sql = `
    SELECT 
      complaint_id,
      title,
      customer_name,
      customer_number,
      manual_location,
      latitude,
      longitude,
      category,
      urgency,
      status,
      created_at
    FROM complaints
    WHERE complaint_id = ?
  `;

  db.query(sql, [complaintId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Fetch failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(results[0]); // send full row
  });
});



/* --------------------------------------------------
   GET /api/complaints/my
-------------------------------------------------- */
router.get("/my", verifyUser, (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT
      id,
      complaint_id,
      title AS issue,
      customer_number AS phone,
      category,
      urgency,
      manual_location AS location,
      image_name AS image_url,
      status,
      created_at
    FROM complaints
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Fetch failed" });
    }

    res.json(results);
  });
});


/* --------------------------------------------------
   DELETE /api/complaints/:id
-------------------------------------------------- */
router.delete("/:id", verifyUser, (req, res) => {

  const { id } = req.params;

  db.query("DELETE FROM complaints WHERE id = ?", [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Delete failed" });
    }

    res.json({ message: "Deleted successfully" });
  });
});


module.exports = router;

/* --------------------------------------------------
   GET ALL COMPLAINTS (ADMIN)
-------------------------------------------------- */
router.get("/", (req, res) => {

  const sql = `
    SELECT
      complaints.id,
      complaints.complaint_id,
      complaints.title AS issue,
      complaints.category,
      complaints.urgency,
      complaints.manual_location,
      complaints.status,
      complaints.created_at,
      workers.name AS worker_name
    FROM complaints
    LEFT JOIN workers
      ON complaints.worker_id = workers.id
    ORDER BY complaints.created_at DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Fetch failed" });
    }

    res.json(results);

  });
});