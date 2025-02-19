// // 📌 4️⃣ models/User.js
// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   profilePicture: String,
// });
// module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Prevents password from being returned in queries
    },
    profilePicture: {
      type: String, // Can store image URL or file path
      default: '' // Optional
    }
  },
  { timestamps: true } // Adds `createdAt` & `updatedAt`
);



module.exports = mongoose.model('User', userSchema);
