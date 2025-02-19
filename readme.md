# NodeJS Task

## Project Overview
This Node.js project involves creating a MongoDB database with the following collections:

1. **Users** - Stores user details.
2. **Categories** - Stores different categories.
3. **Questions** - Stores questions, which can be assigned to multiple categories.

The project requires building APIs using **MongoDB Aggregation Queries** to efficiently manage and retrieve data.

---

## API Documentation

### **1. User Authentication**
#### **User Login**
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticates a user and returns a token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### **2. User Profile Management**
#### **View User Profile**
- **Endpoint:** `GET /api/users/profile`
- **Description:** Retrieves the authenticated user's profile.
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
    "_id": "userId",
    "name": "John Doe",
    "email": "user@example.com",
    "profilePicture": "uploads/profile.jpg"
  }
  ```

#### **Edit User Profile (With Profile Picture)**
- **Endpoint:** `PUT /api/users/profile`
- **Description:** Updates the user profile, including uploading a profile picture.
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Request Body:** (Form-Data for image upload)
  ```
  name: "John Doe"
  profilePicture: (file)
  ```
- **Response:**
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "_id": "userId",
      "name": "John Doe",
      "profilePicture": "uploads/profile.jpg"
    }
  }
  ```

### **3. Categories Management**
#### **Get All Categories**
- **Endpoint:** `GET /api/categories`
- **Description:** Retrieves all categories from the database.
- **Response:**
  ```json
  [
    { "_id": "categoryId1", "name": "Technology" },
    { "_id": "categoryId2", "name": "Science" }
  ]
  ```

### **4. Questions Management**
#### **Get Questions by Category**
- **Endpoint:** `GET /api/questions/:categoryId`
- **Description:** Retrieves all questions for a specific category using MongoDB aggregation.
- **Response:**
  ```json
  [
    {
      "_id": "questionId",
      "question": "What is JavaScript?",
      "categories": [
        { "_id": "categoryId1", "name": "Technology" }
      ]
    }
  ]
  ```

#### **Bulk Upload Questions (CSV Import)**
- **Endpoint:** `POST /api/questions/bulk-upload`
- **Description:** Allows bulk import of questions using a CSV file.
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Request Body:** (Form-Data for file upload)
  ```
  file: (CSV file)
  ```
- **CSV Format:**
  ```csv
  question,category1,category2
  "What is Node.js?","category_id","category_id"
  "What is MongoDB?","category_id","category_id"
  ```
- **Response:**
  ```json
  {
    "message": "Questions uploaded successfully",
    "questionsAdded": 10
  }
  ```

---

## **Technology Stack**
- **Node.js & Express.js** - Backend API framework
- **MongoDB & Mongoose** - Database and ODM
- **Multer** - File upload handling
- **JWT** - Authentication
- **Joi** - Request validation

## **Setup Instructions**
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/nodejs-task.git
   cd nodejs-task
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/yourDatabase
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```sh
   npm start
   ```

## **Conclusion**
This project efficiently handles users, categories, and questions using MongoDB aggregation queries, JWT authentication, and file upload capabilities.

