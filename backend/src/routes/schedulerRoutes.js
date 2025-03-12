const express = require("express");
const router = express.Router();
const { getSchedulers, getSchedulerById, updateScheduler, deleteScheduler } = require("../controllers/schedulerController");

router.get("/", getSchedulers);
router.get("/:id", getSchedulerById);
router.put("/:id", updateScheduler);
router.delete("/:id", deleteScheduler);

module.exports = router;
