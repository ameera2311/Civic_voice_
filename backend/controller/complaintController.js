const db = require("../models/db");
const { spawn } = require("child_process");
const predictDepartment = require("../utils/predictDepartment");
const predictUrgency = require("../utils/predictUrgency");


exports.createComplaint = async (req, res) => {

  const { title, description } = req.body;

  try {

    // ML prediction
    const department = await predictDepartment(description);

    const complaint = await Complaint.create({
      title,
      description,
      department
    });

    res.status(201).json(complaint);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Prediction failed" });
  }
};
/* ===================================================
   CREATE COMPLAINT (USER)
=================================================== */
exports.createComplaint = async (req, res) => {

  const userId = req.user.id;

  const {
    customerName,
    customerNumber,
    issue,
    description,
    predictedIssue,
    category,
    urgency, // manual urgency
    manualLocation,
    gpsLocation,
    latitude,
    longitude,
    imageName
  } = req.body;

  try {

    // ML department prediction
    const department = await predictDepartment(description);

    // ML urgency prediction
    const urgencyResult = await predictUrgency(description);

    const finalUrgency = urgency || urgencyResult.urgency;

    const sql = `
      INSERT INTO complaints (
        user_id,
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        userId,
        customerName,
        customerNumber,
        issue,
        description,
        predictedIssue,
        category || department,
        finalUrgency,
        manualLocation,
        gpsLocation,
        latitude,
        longitude,
        imageName,
        "Processing"
      ],
      (err, result) => {

        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Insert failed" });
        }

        res.status(201).json({
          message: "Complaint submitted",
          complaintId: result.insertId,
          predictedDepartment: department,
          predictedUrgency: urgencyResult.urgency
        });

      }
    );

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Prediction failed" });

  }

};


/* ===================================================
   USER: Get My Complaints
=================================================== */
exports.getMyComplaints = (req, res) => {
  const sql = `
    SELECT 
      complaints.*,
      workers.name AS worker_name,
      workers.phone AS worker_phone,
      workers.department
    FROM complaints
    LEFT JOIN workers 
      ON complaints.worker_id = workers.id
    WHERE complaints.user_id = ?
    ORDER BY complaints.created_at DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching complaints" });
    }
    res.json(results);
  });
};


/* ===================================================
   ADMIN: Get All Complaints
=================================================== */
exports.getComplaints = (req, res) => {

  const sql = `
    SELECT 
      complaints.id,
      complaints.title,
      complaints.category,
      complaints.urgency,
      complaints.status,
      complaints.worker_id,
      complaints.manual_location,
      complaints.customer_name,
      complaints.customer_number,
      complaints.created_at,
      workers.name AS worker_name,
      workers.phone AS worker_phone,
      workers.department
    FROM complaints
    LEFT JOIN workers
      ON complaints.worker_id = workers.id
    ORDER BY complaints.created_at DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching complaints" });
    }

    res.json(results);
  });
};


/* ===================================================
   DELETE COMPLAINT
   - If user: deletes only their complaint
   - If admin: can delete any complaint
=================================================== */
exports.deleteComplaint = (req, res) => {
  let sql;
  let params;

  if (req.user.role === "admin") {
    sql = "DELETE FROM complaints WHERE id = ?";
    params = [req.params.id];
  } else {
    sql = "DELETE FROM complaints WHERE id = ? AND user_id = ?";
    params = [req.params.id, req.user.id];
  }

  db.query(sql, params, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Delete failed" });
    }

    res.json({ message: "Complaint deleted successfully" });
  });
};


/* ===================================================
   ADMIN: Update Complaint Status
=================================================== */

exports.updateStatus = (req, res) => {
  const { status } = req.body;
  const complaintId = req.params.id;

  if (!status) {
    return res.status(400).json({
      message: "Status is required"
    });
  }

  const sql = `
    UPDATE complaints
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, complaintId], (err) => {
    if (err) {
      console.error("Status update error:", err);
      return res.status(500).json({
        message: "Failed to update complaint status"
      });
    }

    res.json({
      message: "Complaint status updated successfully"
    });
  });
};


/* ===================================================
   ADMIN: Assign Worker
=================================================== */
exports.assignWorker = (req, res) => {

  const workerId = req.body.worker_id || req.body.workerId;

  const sql = `
    UPDATE complaints
    SET worker_id = ?, status = 'Assigned'
    WHERE id = ?
  `;

  db.query(sql, [workerId, req.params.id], (err) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Worker assignment failed" });
    }

    res.json({
      message: "Worker assigned successfully"
    });

  });

};