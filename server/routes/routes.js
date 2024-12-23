const express = require("express");
const router = express.Router();
const cors = require("cors");
const {test, processword, handleSentence} = require('../controllers/controllers')

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173"
  })
);

/********************* USER SYSTEM *****************/
router.get("/test", test);

router.get("/processword", processword)

router.get("/api/processSentence", handleSentence)

module.exports = router;
