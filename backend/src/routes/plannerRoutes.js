const express = require("express");
const router = express.Router();
const { getPlanners, getPlannerById, updatePlanner, deletePlanner } = require("../controllers/plannerController");

router.get("/", getPlanners);
router.get("/:id", getPlannerById);
router.put("/:id", updatePlanner);
router.delete("/:id", deletePlanner);

module.exports = router;
