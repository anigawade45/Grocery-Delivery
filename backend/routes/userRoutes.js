const express = require("express");
const router = express.Router();
const { assignUserRole, getAllUsers  } = require("../controllers/userController");

router.post("/assign-role", assignUserRole);

router.get("/", getAllUsers);

module.exports = router;

