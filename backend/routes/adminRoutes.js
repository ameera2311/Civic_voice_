

const express = require("express");
const router = express.Router();

const { verifyAdmin, verifyUser } = require("../middleware/authMiddleware");

const adminController = require("../controller/adminController");
const complaintController = require("../controller/complaintController");
const workerController = require("../controller/workerController");
const analyticsController = require("../controller/analyticsController");
const assignmentController = require("../controller/assignmentController");


// ========================
// ✅ Admin Login
// ========================
router.post("/login", adminController.adminLogin);


// ========================
// ✅ USER SIDE
// ========================
router.get(
  "/complaints/my",
  verifyUser,
  complaintController.getMyComplaints
);


// ========================
// ✅ ADMIN SIDE
// ========================
router.get(
  "/complaints",
  verifyAdmin,
  complaintController.getComplaints
);

router.patch(
  "/complaints/:id/status",
  verifyAdmin,
  complaintController.updateStatus
);
router.put(
  "/complaints/:id/assign",
  verifyAdmin,
  complaintController.assignWorker
);

router.patch(
  "/workers/:id",
  verifyAdmin,
  workerController.updateWorker
);
router.delete(
  "/complaints/:id",
  verifyAdmin,
  complaintController.deleteComplaint
);


// ========================
// ✅ WORKER MANAGEMENT
// ========================
router.get(
  "/workers",
  verifyAdmin,
  workerController.getWorkers
);

router.post(
  "/workers",
  verifyAdmin,
  workerController.addWorker
);

router.delete(
  "/workers/:id",
  verifyAdmin,
  workerController.deleteWorker
);


// ========================
// ✅ ANALYTICS
// ========================
router.get(
  "/analytics",
  verifyAdmin,
  analyticsController.getAnalytics
);

module.exports = router;
