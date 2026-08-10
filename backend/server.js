const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const JWT_SECRET = "safeher_secret_key_2026"; // Change this later in production

// Middleware
app.use(cors());
app.use(express.json());

// Simple file-based database
const DB_FILE = path.join(__dirname, "database.json");

// Initialize database if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
}

// Helper functions
function readDB() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ===== ROUTES =====

// Test route
app.get("/", (req, res) => {
  res.json({ message: "SafeHer Backend is running!" });
});

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const db = readDB();

    // Check if email already exists
    const existingUser = db.users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      emergencyContacts: [],
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    // Create token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const db = readDB();
    const user = db.users.find(u => u.email === email.toLowerCase());

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emergencyContacts: user.emergencyContacts || []
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});