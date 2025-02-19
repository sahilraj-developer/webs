
const express = require('express');
const dotenv = require('dotenv');

const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");





const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const questionRoutes = require('./routes/questionRoutes');

dotenv.config();
connectDB();
const app = express();


// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan("dev")); // Log HTTP requests




app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});





app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
