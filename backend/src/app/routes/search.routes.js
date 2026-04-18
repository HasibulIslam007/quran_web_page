const express = require("express");
const router = express.Router();
const { searchAyahs } = require("../controllers/searchController");

// GET /api/search?q=...&lang=eng|ban|arb
router.get("/", searchAyahs);

module.exports = router;