const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/surahs", require("./app/routes/surah.routes"));
app.use("/api/search", require("./app/routes/search.routes"));
app.use("/api/health", require("./app/routes/health.routes"));

module.exports = app;