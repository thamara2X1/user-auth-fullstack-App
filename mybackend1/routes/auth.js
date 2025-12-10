const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register API
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Registration attempt:", req.body.email);
    
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({ 
        status: "error",
        message: "Please provide name, email and password" 
      });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ 
        status: "error",
        message: "Email already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log("✅ User created successfully!");
    console.log("   User ID:", user._id);
    console.log("   Name:", user.name);
    console.log("   Email:", user.email);

    return res.status(201).json({
      status: "success",
      user_id: user._id,
      message: "Account created successfully"
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    console.log("🔐 Login attempt:", req.body.email);
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({ 
        status: "error",
        message: "Please provide email and password" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ 
        status: "error",
        message: "Invalid email or password" 
      });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ 
        status: "error",
        message: "Invalid email or password" 
      });
    }

    // Generate token using environment variable
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful!");
    console.log("   User ID:", user._id);
    console.log("   Email:", user.email);

    return res.status(200).json({
      status: "success",
      token,
      user_id: user._id,
      message: "Login successful"
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;