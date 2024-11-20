# Evo REST API

Evo is a robust and scalable REST API built with Node.js, Express.js, and MongoDB, designed to support functionalities such as user authentication, project creation and management, profile updates, conversations, payments, and more.

## Features

- User Authentication and Authorization
- Project Creation, Update, and Management
- User Profile Management
- Real-time Conversations
- Payment Integration (Razorpay and Stripe)

## Technology Stack

- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB (NoSQL)
- **Cloud Storage**: Cloudinary
- **Payment Gateways**: TON

## Getting Started

Follow these steps to run the application in your local environment and contribute:

### Prerequisites

- Node.js (version 14.x or higher)
- MongoDB
- npm or yarn (package manager)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd evo-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:

   Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   PORT=your-port
   EVO_DB_URL=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRY=your-jwt-expiry-time
   COOKIE_TIME=your-cookie-expiry-time
   CLOUDINARY_API=your-cloudinary-api-key
   CLOUDINARY_SECRET=your-cloudinary-secret
   CLOUDINARY_NAME=your-cloudinary-name
   ```

4. **Run the Application**:

   For development mode with Nodemon:
   ```bash
   npm run dev
   ```

## Contribution Guidelines

- Fork the repository and create a new branch for your feature or bugfix.
- Make your changes and ensure the application runs correctly.
- Submit a pull request with a clear description of the changes.

## API Documentation

Detailed API documentation is available on [Postman](https://documenter.getpostman.com/view/16261654/2s8YszQr8H).

## Project Structure

The project follows a modular structure for scalability and maintainability:

- **config/**: Configuration files (e.g., database, cloud storage).
- **controller/**: Business logic and request handling.
- **middleware/**: Custom middleware for authentication and validation.
- **models/**: Mongoose schemas and models.
- **routes/**: API route definitions.
- **utils/**: Utility functions for common tasks.

## License

This project is licensed under the [MIT License](LICENSE).

---

For any questions or issues, feel free to contact the project maintainer or open a new issue.
