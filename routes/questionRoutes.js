const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const {
  getQuestionsByCategory,
  importQuestionsFromCSV,
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestions,
} = require("../controllers/questionController");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Setup Multer for CSV uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".csv"); // Store file with .csv extension
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Only CSV files are allowed"), false);
    }
    cb(null, true);
  },
});

// ✅ Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { categoryId, id } = req.params;

  if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid question ID" });
  }
  next();
};

// ✅ Route to get all questions
router.get("/", auth, getQuestions);

// ✅ Route to import questions from CSV
router.post("/bulk-upload", auth, upload.single("file"), importQuestionsFromCSV);

// ✅ Route to create a new question
router.post("/", auth, createQuestion);

// ✅ Route to get a single question by ID
router.get("/:id", auth, validateObjectId, getQuestionById);

// ✅ Route to update a question by ID
router.put("/:id", auth, validateObjectId, updateQuestion);

// ✅ Route to delete a question by ID
router.delete("/:id", auth, validateObjectId, deleteQuestion);

// ✅ Route to get questions by category ID
router.get("/category/:categoryId", auth, validateObjectId, getQuestionsByCategory);

module.exports = router;
