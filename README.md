# Grocify

**Grocify** is a full-stack grocery store web application built with the MERN stack. The project is powered by AI features and integrated with **Razorpay** for seamless payments. While the frontend consumes APIs and manages data with Redux, most of the logic and heavy lifting is handled on the backend, ensuring a robust and scalable application.

---

## Tech Stack

* **MongoDB** – Database
* **Node.js & Express.js** – Backend APIs and business logic
* **React.js** – Frontend
* **Redux** – State management and data flow
* **Tailwind CSS** – Styling
* **Gemini AI API** – AI-powered features (search, recommendations)
* **Razorpay** – Payment gateway integration
* **Cloudinary** – Image uploads

---

## Features

### Seller Dashboard

* **Product Management:** Sellers can add, update, or delete products.
* **Stock Control:** Sellers can mark products as in-stock or out-of-stock.
* **Order Management:** Sellers can view all orders for their products and track delivery status.

---

### Customer Side Features

#### Navbar & Footer

* Fully functional and responsive.
* Supports seamless navigation across the web app.

#### Home Page

* Displays top products dynamically.
* Highlights featured items and trending categories.

#### Product Listing Page

* Displays all products available in the store.
* Integrates **AI-powered smart search** to filter products by name, category, price, or keywords.
* Handles spelling mistakes automatically using AI.

#### Product Detail Page

* Shows detailed information about the product: price, available quantity, and description.
* **Add to Cart:** Users can add products to the cart only if they are in stock.
* **AI Recommendations:** Suggests similar products based on the category of the current product.

#### Cart Page

* Displays all products added to the cart.
* Users can **adjust quantity** or remove items.
* Dynamically updates **total price** based on cart contents.
* Ensures **stock validation**: if a product goes out of stock, it must be removed before proceeding to checkout.

#### Checkout Page

* Collects delivery address from the user.
* Initiates payment via **Razorpay**.
* Verifies payment signature to ensure secure transactions.
* Automatically redirects to the order page after successful payment.
* Dynamically calculates total price including all cart items.

#### Orders Page

* Users can view all their orders.
* Tracks delivery status in real-time (updates dynamically).
* Ensures that users only see their own orders.

---

### AI Features

* **Smart Search:**

  * Integrated on the product listing page.
  * Filters products by category, name, or price.
  * Corrects spelling mistakes and displays relevant results dynamically.
* **Product Recommendations:**

  * On the product detail page, AI recommends similar products based on category.
  * Helps users discover related items they may want to purchase.

---

### Backend Features

* **Authentication & Authorization:**

  * JWT-based login/signup for both sellers and customers.
* **Cart Management:**

  * Tracks products added to the cart with quantity control.
  * Validates stock before checkout.
* **Order Placement Flow:**

  * Generates Razorpay order.
  * Verifies payment signature.
  * Stores order with delivery address and order details.
* **Dynamic Total Price Calculation:** Automatically calculates order totals at checkout.
* **Seller-Specific Order Tracking:** Each seller sees orders related to their products only.
* **Error Handling & Security:** Comprehensive checks on both frontend and backend to prevent invalid operations.
* **Product Management:**

  * Sellers can add, update, delete products.
  * Users can view products seamlessly.
* **AI Integration:** Gemini API powers search and product recommendations directly from the backend.

---

## Folder Structure

```
Grocify/
├── Client/         # React frontend
├── Server/         # Node.js & Express backend
```


##  Create a .env file in Server/ with the following:
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_secret>

---
