const express = require("express")
const router = express.Router()
const { handleUserSignUp, handleUserLogin } = require('../controllers/user')

router.post("/login", handleUserLogin);
router.post("/", handleUserSignUp);

module.exports = router;
