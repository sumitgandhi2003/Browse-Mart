# BrowseMart

BrowseMart is a full-stack e-commerce web application that allows users to browse, purchase, and manage products seamlessly.

## Features

- User authentication (JWT-based login/signup)
- Product listing with categories
- Shopping cart functionality
- "Buy Now" feature for quick checkout
- Seller registration and product uploads
- Payment method selection and order management
- Wishlist and profile management
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend:

- React.js
- Tailwind CSS
- React Router

### Backend:

- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication

## Installation

### Prerequisites:

- Node.js and npm installed
- MongoDB database setup

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/browsemart.git
   cd browsemart
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory and add:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```
4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | /api/auth/signup | Register a new user             |
| POST   | /api/auth/login  | User login and JWT generation   |
| GET    | /api/products    | Get all products                |
| POST   | /api/products    | Add a new product (Seller only) |
| GET    | /api/cart        | Get user cart items             |
| POST   | /api/orders      | Place an order                  |

## Live Demo

[BrowseMart Live](https://browsemart.vercel.app/)

## License

This project is open-source and available under the MIT License.

---

Developed by [Sumit Gandhi](https://github.com/yourgithubprofile).
