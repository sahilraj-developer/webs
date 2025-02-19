
const Question = require('../models/Question');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const Joi = require('joi');

// Joi schema for question validation
const questionSchema = Joi.object({
  text: Joi.string().min(5).required().messages({
    'string.base': 'Text should be a string',
    'string.min': 'Text must be at least 5 characters long',
    'any.required': 'Text is required',
  }),
  categoryIds: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid category ID format'))
    .min(1)
    .required()
    .messages({
      'array.base': 'Categories should be an array',
      'array.min': 'At least one category is required',
      'any.required': 'Category IDs are required',
    }),
});

// Get Questions with Aggregation (Populating Categories)
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      {
        $lookup: {
          from: 'categories', // Reference to Category collection
          localField: 'categories',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $project: {
          text: 1,
          categories: '$categoryDetails.name', // Fetch only category names
        },
      },
    ]);

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Error fetching questions');
  }
};

// Import Questions from CSV
exports.importQuestionsFromCSV = async (req, res) => {

  if (!req.file) return res.status(400).send('No file uploaded');

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const questions = results.map(row => ({
          text: row.text,
          categories: row.categories ? row.categories.split(',').map(id => new mongoose.Types.ObjectId(id.trim())) : [],
        }));

        if (questions.length === 0) {
          return res.status(400).send('No valid questions found in CSV');
        }

        await Question.insertMany(questions);
        res.status(201).send('Questions imported successfully');
      } catch (error) {
        console.error('Error importing questions:', error);
        res.status(500).send(`Error importing questions: ${error.message}`);
      }
    });
};

// Create Question with Joi validation
exports.createQuestion = async (req, res) => {
  try {
    const { error } = questionSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { text, categoryIds } = req.body;

    const objectIds = categoryIds.map(id => new mongoose.Types.ObjectId(id));

    const categories = await Category.find({ '_id': { $in: objectIds } });
    if (categories.length !== categoryIds.length) {
      return res.status(400).send('Some category IDs do not exist');
    }

    const newQuestion = new Question({ text, categories: objectIds });
    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).send('Error creating question: ' + error.message);
  }
};

// Get Question By ID using Aggregation
exports.getQuestionById = async (req, res) => {
  try {
    const categoryId = new mongoose.Types.ObjectId(req.params.id); // Convert to ObjectId

    const questions = await Question.aggregate([
      { 
        $match: { 
          categories: categoryId  // ✅ Match categoryId inside categories array
        } 
      }
    ]);

    if (!questions.length) {
      return res.status(404).json({ error: "No questions found for this category" });
    }

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Questions By Category using Aggregation
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const categoryId = new mongoose.Types.ObjectId(req.params.categoryId);
    
    const questions = await Question.aggregate([
      { $match: { categories: categoryId } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $project: {
          text: 1,
          categories: '$categoryDetails.name',
        },
      },
    ]);

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions by category:', error);
    res.status(500).send('Error fetching questions by category');
  }
};

// Update Question with Joi validation
exports.updateQuestion = async (req, res) => {
  try {
    const { error } = questionSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuestion) {
      return res.status(404).send('Question not found');
    }
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).send('Error updating question');
  }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).send('Question not found');
    }
    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).send('Error deleting question');
  }
};
