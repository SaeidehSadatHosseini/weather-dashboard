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

// Get all favorites
app.get("/favorites", async (req, res) => {
  const result = await pool.query("SELECT * FROM favorites");
  res.json(result.rows);
});

// Add new favorite
app.post("/favorites", async (req, res) => {
  const { city_name } = req.body;
  const result = await pool.query(
    "INSERT INTO favorites (city_name) VALUES ($1) RETURNING *",
    [city_name]
  );
  res.json(result.rows[0]);
});

// Delete favorite
app.delete("/favorites/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM favorites WHERE id = $1", [id]);
  res.sendStatus(204);
});


// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5050; 


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
