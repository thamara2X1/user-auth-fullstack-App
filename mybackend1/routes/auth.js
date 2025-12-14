const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Email configuration (using nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // Your Gmail address
    pass: process.env.EMAIL_PASSWORD  // Your Gmail App Password
  }
});

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

// Forgot Password API
router.post("/forgot-password", async (req, res) => {
  try {
    console.log("🔑 Forgot password request:", req.body.email);
    const { email } = req.body;

    // Validate input
    if (!email) {
      console.log("❌ Validation failed: Missing email");
      return res.status(400).json({ 
        status: "error",
        message: "Please provide email address" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    // Always return success (security: don't reveal if email exists)
    if (!user) {
      console.log("⚠️  User not found, but returning success:", email);
      return res.status(200).json({
        status: "success",
        message: "If an account exists with this email, you will receive a password reset link."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token expiry (1 hour)
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save to user document
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    // Email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #673AB7; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { 
              display: inline-block; 
              background-color: #673AB7; 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .link { color: #666; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <p>Hi ${user.name},</p>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p class="link">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: emailHtml
    });

    console.log("✅ Password reset email sent to:", email);
    console.log("   Token expires in: 1 hour");

    return res.status(200).json({
      status: "success",
      message: "If an account exists with this email, you will receive a password reset link."
    });

  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to process request. Please try again later."
    });
  }
});

// Reset Password API
router.post("/reset-password", async (req, res) => {
  try {
    console.log("🔄 Reset password attempt");
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({ 
        status: "error",
        message: "Token and password are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        status: "error",
        message: "Password must be at least 6 characters" 
      });
    }

    // Hash the token to compare with database
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      console.log("❌ Invalid or expired token");
      return res.status(400).json({ 
        status: "error",
        message: "Invalid or expired reset token" 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log("✅ Password reset successful for:", user.email);

    return res.status(200).json({
      status: "success",
      message: "Password reset successful! You can now login with your new password."
    });

  } catch (error) {
    console.error("❌ Reset password error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to reset password. Please try again."
    });
  }
});

// Verify Reset Token API (optional - to check token validity before showing reset form)
router.post("/verify-reset-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        status: "error",
        valid: false,
        message: "Token is required" 
      });
    }

    // Hash the token
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(200).json({ 
        status: "error",
        valid: false,
        message: "Invalid or expired token" 
      });
    }

    return res.status(200).json({
      status: "success",
      valid: true,
      message: "Token is valid"
    });

  } catch (error) {
    console.error("❌ Verify token error:", error);
    return res.status(500).json({
      status: "error",
      valid: false,
      message: "Failed to verify token"
    });
  }
});

module.exports = router;