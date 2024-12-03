This project is a MERN stack web application that allows users to manage brands and products. Users can perform CRUD operations on products and brands, with authentication enforced using JWT (JSON Web Tokens). The application also supports file uploads with Multer, search functionality, and uses local storage for storing authentication tokens.
Technologies Used
# Frontend:
React, React Router, Context API
# Backend:
Node.js, Express.js
Database: MongoDB Atlas
Authentication: JSON Web Tokens (JWT)
File Uploads: Multer
# Styling: 
Custom CSS and shared components
# Deployment:
Render
# Features
# 1. User Authentication with JWT (JSON Web Tokens)
Secure Access: Only authenticated users can perform certain actions like updating and deleting products.
JWT Token Handling:
Upon successful login or signup, the server generates a JWT token and sends it to the client.
The client stores the token in local storage to maintain the user's session.
Protected Routes:
Routes like update product and delete product are secured by middleware that checks for the JWT token's validity.
Authorization Middleware: Ensures that only authorized users can modify or delete their own resources.
# 2. CRUD Operations for Brands and Products
Create:
Users can create new brands and products.
The creation process includes file uploads (e.g., product images) using Multer.
Read:
Display all brands and products on the homepage.
Users can view products by brand or a detailed product page.
Update:
Users can edit product details (name, description, price, image) if authenticated.
Delete:
Authenticated users can delete products and brands.
A confirmation modal is shown before deletion to prevent accidental actions.
# 3. Search Functionality
   Dynamic Search Bar: Allows users to search products and brands by name.
Case-Insensitive Search: Searches are case-insensitive, ensuring a seamless user experience.
Real-Time Filtering: As users type into the search bar, the displayed list updates dynamically to match the search query.
# 4. File Uploads with Multer
Image Uploads: Products can have images uploaded and stored using Multer.
Static File Serving: Uploaded images are served statically via express.static().
Error Handling: If an error occurs during file upload (e.g., invalid file type), appropriate error messages are displayed.
# 5. Local Storage for Token Management
Session Persistence: The app stores the JWT token in local storage, ensuring users remain logged in even after refreshing the page.
Logout Functionality: The token is cleared from local storage when the user logs out, effectively ending the session.
# 6. Dynamic Routing with React Router
Nested Routes: Uses React Router to handle nested routes for brands, products, and authentication.
Protected Routes: Ensures that only authenticated users can access certain pages (e.g., product creation or update).
Redirects: Automatically redirects unauthenticated users to the login page if they attempt to access protected routes.
# 7. Error Handling and Validation
Backend Validation:
Ensures required fields are provided when creating or updating products.
Validates authentication tokens in protected routes.
Frontend Validation:
Form validation ensures that users cannot submit empty fields.
Displays appropriate error messages for missing or invalid inputs.
Global Error Handling: Catches and handles errors gracefully both on the client and server side.
# 8. CORS Configuration
Cross-Origin Resource Sharing (CORS) is enabled to allow frontend requests from different origins (e.g., localhost:3000 accessing an API running on localhost:5000).
# view live website here
https://brands-product-management-frontend.onrender.com/
