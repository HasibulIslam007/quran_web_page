const express = require("express");
const router = express.Router();
const { searchAyahs } = require("../controllers/searchController");

router.get("/", searchAyahs);

module.exports = router;