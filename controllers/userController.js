const User = require("../models/User");
const multer = require("multer");
const Joi = require("joi");
const path = require("path");
const mongoose = require("mongoose");

// ✅ Joi validation schema for updating profile
const profileSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profileImages/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ✅ File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpeg", ".jpg", ".png", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, GIF) are allowed!"), false); // Reject file
  }
};

// ✅ Initialize Multer with proper error handling
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
}).single("profilePicture");

// ✅ Get Profile using MongoDB Aggregation
exports.getProfile = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const user = await User.aggregate([
      { $match: { _id: userId } }, // Filter by user ID
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          profilePicture: 1,
          createdAt: 1,
        },
      },
    ]);

    if (!user.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// ✅ Update Profile Picture Only
exports.updateProfile = async (req, res) => {
  try {

    // ✅ Ensure an image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // ✅ Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid file format. Only JPEG, PNG, and JPG are allowed." });
    }

    // ✅ Construct full image URL (assuming `uploads/profileImages/` is publicly accessible)
    const baseUrl = process.env.BASE_URL || "http://localhost:4509";
    const profilePictureUrl = `${baseUrl}/uploads/profileImages/${req.file.filename}`;

    // ✅ Update only the profile picture
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: profilePictureUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({"data":updatedUser,"message":"Image uploaded successfully"});
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};