const express = require("express");
const router = express.Router();
const { getAllSurahs, getSurahById } = require("../controllers/surahController");

router.get("/", getAllSurahs);
router.get("/:id", getSurahById);

module.exports = router;