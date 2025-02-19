// // 📌 5️⃣ models/Category.js
// const mongoose = require('mongoose');
// const categorySchema = new mongoose.Schema({ name: String });
// module.exports = mongoose.model('Category', categorySchema);


const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true, // Removes leading/trailing spaces
      minlength: [3, 'Category name must be at least 3 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters']
    }
  },
  { timestamps: true } // Adds `createdAt` & `updatedAt`
);

module.exports = mongoose.model('Category', categorySchema);
