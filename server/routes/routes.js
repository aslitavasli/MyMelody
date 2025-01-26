const express = require("express");
const router = express.Router();
const cors = require("cors");
const {test, processword, handleSentence, getCategories, saveLevel, saveLevelAndCategory, thisLevelExists, changeLevelCategory, getCategoryNames, deleteCategory, changeCategoryName, deleteLevel} = require('../controllers/controllers')

router.use(
  cors({
    credentials: true,
    origin: "https://mymelody-3sak.onrender.com",
    methods: ["GET", "POST", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

router.options("*", cors());

/********************* USER SYSTEM *****************/
router.get("/test", test);

router.get("/processword", processword)

router.get("/api/processSentence", handleSentence)

router.post('/api/saveLevel', saveLevel)

router.post('/api/saveLevelAndCategory', saveLevelAndCategory)

router.post('/api/saveLevel', saveLevel)

router.get('/api/categories', getCategories)

router.get('/api/categoryNames', getCategoryNames)

router.get('/api/checkLevel', thisLevelExists)

router.post('/api/changeLevelCategory', changeLevelCategory)

router.delete('/api/deleteCategory', deleteCategory)

router.post('/api/changeCategoryName', changeCategoryName)

router.delete(`/api/deleteLevel/:phrase`, deleteLevel)

module.exports = router;
