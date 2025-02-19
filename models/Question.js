// // 📌 6️⃣ models/Question.js
// const mongoose = require('mongoose');
// const questionSchema = new mongoose.Schema({
//   text: String,
//   categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
// });
// module.exports = mongoose.model('Question', questionSchema);


const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Question text is required'],
      unique: true,
      trim: true,
      minlength: [5, 'Question must be at least 5 characters'],
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'At least one category is required']
      }
    ]
  },
  { timestamps: true } // Adds `createdAt` & `updatedAt`
);

module.exports = mongoose.model('Question', questionSchema);
