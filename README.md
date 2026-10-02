# 🛒 E-Commerce Web Application

<p align="center">
  <strong>A modern full-stack e-commerce platform built with React, Node.js, Firebase, Stripe, and Cloudinary.</strong>
</p>

<p align="center">
  A complete online shopping solution featuring authentication, product management, cart functionality, secure payments, order processing, cloud image management, and an administrative dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
</p>

<p align="center">
  <a href="#license">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"/>
  </a>
  <a href="https://github.com/adilraj786/E-commerce/stargazers">
    <img src="https://img.shields.io/github/stars/adilraj786/E-commerce?style=flat-square" alt="GitHub Stars"/>
  </a>
  <a href="https://github.com/adilraj786/E-commerce/network/members">
    <img src="https://img.shields.io/github/forks/adilraj786/E-commerce?style=flat-square" alt="GitHub Forks"/>
  </a>
</p>

---

## 📌 Overview

This project is a full-stack e-commerce web application designed to provide a complete digital shopping experience.

Users can browse products, authenticate securely, manage their shopping cart, place orders, and make online payments through Stripe.

The application also includes an administrative dashboard that allows administrators to manage products, categories, banners, store content, and customer orders.

### Key integrations

* 🔐 Firebase Authentication
* 🗄️ Firebase Firestore
* 💳 Stripe Payments
* ☁️ Cloudinary Image Management
* ⚡ React + Vite
* 🖥️ Node.js + Express
* 🎨 Tailwind CSS

---

# ✨ Features

## 👤 Customer Features

* User registration and login
* Firebase Authentication
* Browse products
* Product categorization
* Product details
* Product image galleries
* Add products to cart
* Update cart quantities
* Remove products from cart
* Checkout workflow
* Stripe payment integration
* Order placement
* Order management
* Responsive user interface
* Toast notifications
* Protected user functionality

---

## 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* Product management
* Add products
* Edit products
* Delete products
* Product image uploads
* Category management
* Banner management
* Store content management
* Order management
* CRUD operations
* Administrative controls

---

## ☁️ Cloud Services

| Service                    | Purpose                          |
| -------------------------- | -------------------------------- |
| 🔥 Firebase Authentication | User authentication              |
| 🔥 Firebase Firestore      | Application database             |
| 💳 Stripe                  | Online payment processing        |
| ☁️ Cloudinary              | Product and banner image storage |
| 🖥️ Node.js                | Backend runtime                  |
| 🚀 Express.js              | Backend API                      |

---

# 🧰 Technology Stack

## Frontend

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router"/>
</p>

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router
* React Hot Toast
* Firebase SDK
* Stripe.js

## Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe"/>
</p>

* Node.js
* Express.js
* Stripe API
* REST API
* CORS

## Database & Cloud

<p>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
  <img src="https://img.shields.io/badge/Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firestore"/>
</p>

* Firebase Authentication
* Firebase Firestore
* Cloudinary
* Stripe

---

# 📁 Project Structure

```text
E-commerce/
│
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── Frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# ⚙️ Configuration

# 💳 Stripe Configuration

Stripe is used to process online payments.

## Backend Stripe Secret Key

The backend requires a Stripe Secret Key.

Recommended configuration:

```env
STRIPE_SECRET_KEY=sk_test_your_key
```

Use it from the environment instead of hardcoding it:

```javascript
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
```

### Important

The Stripe Secret Key must remain on the backend.

Never expose:

```text
sk_live_...
sk_test_...
```

inside frontend source code.

---

## Frontend Stripe Publishable Key

The frontend uses the Stripe Publishable Key.

Recommended configuration:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

Example usage:

```javascript
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
```

Frontend Stripe-related files may include:

```text
Frontend/src/pages/ProductPage/StripeWrapper.jsx
Frontend/src/pages/ProductPage/CheckoutPage.jsx
```

---

# 🔥 Firebase Configuration

Firebase provides authentication and database functionality.

The application uses Firebase for:

* User authentication
* User profiles
* Products
* Cart data
* Orders
* Application data

## Firebase Configuration

The Firebase configuration is located in:

```text
Frontend/src/context/FirebaseConfig.jsx
```

Example configuration:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

For better configuration management, use environment variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

# ☁️ Cloudinary Configuration

Cloudinary is used for cloud-based image management.

The application uses Cloudinary for:

* Product images
* Banner images
* Store images

Relevant files may include:

```text
Frontend/src/context/FirebaseContext.jsx
Frontend/src/pages/admin/AdminProductAdd.jsx
Frontend/src/pages/admin/AdminProductEdit.jsx
Frontend/src/pages/admin/AdminBannerAdd.jsx
```

Cloudinary upload endpoint:

```text
https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/image/upload
```

Recommended environment variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

# 🔐 Environment Variables

Create the required `.env` files for the backend and frontend.

## Backend `.env`

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

## Frontend `.env`

```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### `.gitignore`

Make sure your `.gitignore` contains:

```gitignore
node_modules/
.env
.env.local
.env.*.local
dist/
```

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/adilraj786/E-commerce.git
```

Navigate into the project:

```bash
cd E-commerce
```

---

# 🖥️ Backend Setup

Navigate to the backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Configure the backend `.env` file.

Start the backend server:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

Open a new terminal.

Navigate to the frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Configure the frontend `.env` file.

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔄 Running the Complete Application

Both frontend and backend servers must be running.

### Terminal 1 — Backend

```bash
cd Backend
npm install
node server.js
```

### Terminal 2 — Frontend

```bash
cd Frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 💰 Stripe Test Mode

For local development, use Stripe **Test Mode**.

Do not use real payment information while testing.

### Example Test Card

```text
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVC: Any 3 digits
ZIP: Any valid ZIP
```

Use Stripe's official testing documentation for additional test scenarios.

# 🧪 Development Checklist

Before running the application, verify:

* [ ] Node.js is installed
* [ ] Backend dependencies are installed
* [ ] Frontend dependencies are installed
* [ ] Firebase project is configured
* [ ] Firestore is enabled
* [ ] Firebase Authentication is configured
* [ ] Stripe account is configured
* [ ] Stripe test keys are configured
* [ ] Cloudinary account is configured
* [ ] Cloudinary upload preset is configured
* [ ] Environment variables are configured
* [ ] `.env` files are ignored by Git
* [ ] Backend server is running
* [ ] Frontend development server is running

---

# 🐛 Troubleshooting

## Backend Does Not Start

Navigate to the backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

Check the terminal for errors related to:

* Missing packages
* Environment variables
* Port conflicts
* Stripe configuration

---

## Frontend Does Not Start

Navigate to the frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

If dependencies are corrupted, try:

```bash
rm -rf node_modules
npm install
```

On Windows PowerShell, you can alternatively remove `node_modules` manually and run:

```bash
npm install
```

---

## Stripe Payment Fails

Check:

* Stripe publishable key
* Stripe secret key
* Backend server status
* Stripe test/live mode
* Browser console
* Backend terminal
* Network requests

Make sure the frontend and backend are using the correct Stripe keys.

---

## Firebase Errors

Check:

* Firebase configuration
* Firebase project ID
* Authentication settings
* Firestore configuration
* Firestore security rules
* Environment variables

---

## Cloudinary Upload Fails

Check:

* Cloudinary cloud name
* Upload preset
* Upload preset permissions
* Upload endpoint
* Environment variables
* Browser console

---

# 📌 Project Highlights

This project demonstrates practical experience in:

* Full-stack web application development
* React application architecture
* REST API integration
* Authentication and authorization
* Database integration
* Payment gateway integration
* Cloud-based image management
* Admin dashboard development
* CRUD operations
* State management
* Environment-based configuration
* Responsive web development
* Third-party API integration
* E-commerce workflow implementation

---

---

# 👨‍💻 Author

<p align="center">
  <strong>Adil Raj</strong>
  <br>
  Software Engineering Aspirant | Full-Stack Developer | AI & Cybersecurity | Building Scalable Software & Real-World Solutions
  <br><br>
  <a href="https://github.com/adilraj786">
    <img src="https://img.shields.io/badge/GitHub-adilraj786-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
</p>

<p align="center">
  <sub>Building practical software solutions with modern web technologies.</sub>
</p>

---

<p align="center">
  <strong>© MIT 2026 Adil Raj</strong>
  <br>
</p>
