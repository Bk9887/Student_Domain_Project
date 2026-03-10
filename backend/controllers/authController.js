const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


// ================= JWT TOKEN =================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


// ================= EMAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Check email connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.log("Email server error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});


// ================= REGISTER USER =================
exports.registerUser = async (req, res) => {
  try {

    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    email = email.toLowerCase().trim();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      domain: null,
      domainProgress: [],
      points: 50,
      verificationToken,
      isVerified: false,
    });

    const verifyLink =
      `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: `"Skill Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Please verify your email by clicking the button below:</p>

        <a href="${verifyLink}"
           style="
           display:inline-block;
           padding:12px 24px;
           background:#4CAF50;
           color:white;
           text-decoration:none;
           border-radius:6px;
           margin-top:10px;">
           Verify Email
        </a>

        <p>If you did not create this account, ignore this email.</p>
      `,
    });

    res.status(201).json({
      message:
        "Signup successful. Please check your email to verify your account.",
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {
  try {

    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully. You can now login.",
    });

  } catch (error) {

    console.error("VERIFY EMAIL ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};



// ================= LOGIN USER =================
exports.loginUser = async (req, res) => {
  try {

    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      domain: user.domain,
      token: generateToken(user._id),
      redirect: user.domain
        ? "/dashboard"
        : "/domain-selection",
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};



// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {

    let { email } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Skill Platform" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset</h2>

        <p>You requested a password reset.</p>

        <a href="${resetLink}"
           style="
           display:inline-block;
           padding:12px 24px;
           background:#2196F3;
           color:white;
           text-decoration:none;
           border-radius:6px;">
           Reset Password
        </a>

        <p>This link expires in 10 minutes.</p>
      `,
    });

    res.json({
      message: "Password reset email sent",
    });

  } catch (error) {

    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};



// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {

    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};