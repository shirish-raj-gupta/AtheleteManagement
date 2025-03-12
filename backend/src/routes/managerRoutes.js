const express = require("express");
const router = express.Router();
const { getManagers, getManagerById, updateManager, deleteManager } = require("../controllers/managerController");

router.get("/", getManagers);
router.get("/:id", getManagerById);
router.put("/:id", updateManager);
router.delete("/:id", deleteManager);

module.exports = router;
