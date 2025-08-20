// server/index.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ----------------------
// CORS Middleware
// ----------------------
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // allow both
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

// ✅ Handles GET/POST/DELETE and also preflight OPTIONS automatically
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));



// ✅ Body parser for JSON requests
app.use(express.json());


// ----------------------
// PostgreSQL connection
// ----------------------
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Test DB connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL!");
    return client.query("SELECT NOW()")
      .then(res => {
        console.log("⏱ Current time from DB:", res.rows[0]);
        client.release();
      })
      .catch(err => {
        console.error("❌ Error running test query", err);
        client.release();
      });
  })
  .catch(err => console.error("❌ Failed to connect to PostgreSQL", err));

// ----------------------
// Routes
// ----------------------

// GET all favorites
app.get("/favorites", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM favorites");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST new favorite
app.post("/favorites", async (req, res) => {
  const { city_name } = req.body;
  try {
    await pool.query("INSERT INTO favorites (city_name) VALUES ($1)", [city_name]);
    res.status(201).json({ message: "City Added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE favorite
app.delete("/favorites/:city", async (req, res) => {
  const { city } = req.params;
  try {
    await pool.query("DELETE FROM favorites WHERE city_name = $1", [city]);
    res.json({ message: "City removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5050; 


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
