const express = require("express");
const router = express.Router();

const workerController = require("../controller/workerController");

router.get("/", workerController.getWorkers);
router.post("/", workerController.addWorker);
router.delete("/:id", workerController.deleteWorker);
router.put("/:id", workerController.updateWorker);

module.exports = router;