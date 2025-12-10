# CraftCore Backend API

Simple and clean backend for CraftCore furniture website using Node.js, Express.js, MongoDB, Mongoose, and JWT.

## Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── productController.js # Product CRUD logic
│   ├── cartController.js   # Cart management logic
│   └── wishlistController.js # Wishlist management logic
├── middlewares/
│   └── userAuth.js         # JWT authentication middleware
├── models/
│   ├── userSchema.js       # User model
│   ├── productSchema.js    # Product model
│   ├── cartSchema.js       # Cart model
│   └── wishlistSchema.js   # Wishlist model
├── routes/
│   ├── authRoute.js        # Auth routes
│   ├── productRoute.js     # Product routes
│   ├── cartRoute.js        # Cart routes
│   └── wishlistRoute.js   # Wishlist routes
├── scripts/
│   └── seed.js             # Seed initial products
├── server.js               # Main server file
└── package.json           # Dependencies
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/craftcore
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Seed initial products (optional):
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products (supports query: category, condition, search)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update/:itemId` - Update cart item quantity (protected)
- `DELETE /api/cart/remove/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Wishlist
- `GET /api/wishlist` - Get user wishlist (protected)
- `POST /api/wishlist/add` - Add product to wishlist (protected)
- `DELETE /api/wishlist/remove/:productId` - Remove product from wishlist (protected)
- `DELETE /api/wishlist/clear` - Clear wishlist (protected)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
