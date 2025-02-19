const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ✅ Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profileImages/"); // Store images in 'uploads/profileImages/'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ✅ Filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and JPG images are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
});

// ✅ Routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, upload.single("profilePicture"), updateProfile);

module.exports = router;
