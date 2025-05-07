# Browse Mart E-commerce Web App

Browse Mart is a full-stack e-commerce web application that allows users to browse products, add them to the cart, place orders, and more. The application has two primary user roles: **Sellers** and **Consumers**. Sellers can upload products, manage inventory, and track sales, while consumers can browse products, add them to their cart, and complete their orders.

## Features

- **User Authentication:** Secure login and registration with JWT-based authentication.
- **Product Management:** Sellers can add, update, and delete products, as well as manage product visibility.
- **Order Management:** Consumers can place orders, view their order history, and check order details.
- **Cart and Wishlist:** Users can add items to their cart and wishlist for easy purchasing.
- **Seller Dashboard:** Sellers can view product performance and manage their products.
- **Responsive Design:** Built with ReactJS and Tailwind CSS, ensuring compatibility across all devices.

## Tech Stack

- **Frontend:**

  - ReactJS
  - Tailwind CSS
  - Axios for API requests

- **Backend:**

  - Node.js with Express.js
  - MongoDB (NoSQL Database)
  - JWT for Authentication
  - Mongoose for MongoDB interactions

- **Deployment:**

  - Frontend: Vercel
  - Backend: Vercel

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Make sure you have **Node.js** and **npm** installed on your machine. You can download them from [here](https://nodejs.org/).

You will also need **MongoDB** or access to **MongoDB Atlas** for the database.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sumitgandhi2003/Browse-Mart-E-commerce-Web-App.git
   ```

2. **Navigate to the project folder**:

   ```bash
   cd Browse-Mart-E-commerce-Web-App
   ```

3. **Install dependencies** for both frontend and backend:

   - For the **frontend**:

     ```bash
     cd frontend
     npm install
     ```

   - For the **backend**:

     ```bash
     cd backend
     npm install
     ```

4. **Set up environment variables**:
   Create a `.env` file in both the `frontend` and `backend` folders with the necessary environment variables (e.g., MongoDB connection string, JWT secret).

   for **backend `.env`**:

   ```
   DB_URL=mongodb://localhost:27017
   DB_NAME=BrowseMartDB
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

   for **Frontend `.env`**:

   ```
   VITE_SERVER_URL = Backend-deployed-url

   ```

5. **Run the application**:

   - For the **frontend**:

     ```bash
     npm run dev
     ```

   - For the **backend**:

     ```bash
     npm run dev
     ```

### Running the App

Once the frontend and backend are up and running, the application should be accessible at `http://localhost:5173` (or the port you specified).

## API Documentation

### **User Routes**

- **POST `/api/auth/register`**: Register a new user.
- **POST `/api/auth/login`**: Log in and receive a JWT token.
- **GET `/api/user/profile`**: Get the logged-in user's profile details.
- **PUT `/api/user/update`**: Update the user's profile details.

### **Product Routes**

- **GET `/api/products`**: Get all products.
- **GET `/api/products/:id`**: Get a single product by ID.
- **POST `/api/products`**: Add a new product (Seller only).
- **PUT `/api/products/:id`**: Update an existing product (Seller only).

### **Order Routes**

- **POST `/api/orders`**: Place a new order.
- **GET `/api/orders`**: Get all orders of the logged-in user.
- **GET `/api/orders/:id`**: Get an order by ID.

### **Cart and Wishlist**

- **POST `/api/cart`**: Add a product to the cart.
- **GET `/api/cart`**: Get all items in the cart.
- **PUT `/api/cart/:id`**: Update the cart item quantity.
- **DELETE `/api/cart/:id`**: Remove an item from the cart.
- **POST `/api/wishlist`**: Add a product to the wishlist.
- **GET `/api/wishlist`**: Get all items in the wishlist.
