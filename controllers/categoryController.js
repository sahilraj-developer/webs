const Category = require('../models/Category');
const Joi = require('joi');
const mongoose = require('mongoose');

// Validation schema
const categorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().optional(),
});

// Create Category
exports.createCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Categories using Aggregation
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      { $project: { name: 1, description: 1 } }, // Only return required fields
    ]);
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Single Category using Aggregation
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = new mongoose.Types.ObjectId(req.params.id);

    const category = await Category.aggregate([
      { $match: { _id: categoryId } }, // Match by ID
      { $limit: 1 }, // Limit to one result
      { $project: { name: 1, description: 1 } } // Only return required fields
    ]);

    if (category.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Category using Aggregation
exports.updateCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const categoryId = new mongoose.Types.ObjectId(req.params.id);

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId },
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Category using Aggregation
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = new mongoose.Types.ObjectId(req.params.id);

    const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
