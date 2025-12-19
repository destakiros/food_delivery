# IN-N-OUT: Premium Online Food Delivery System

A professional full-stack MERN application built for elite culinary delivery experiences. Featuring a wide-screen cinematic UI, AI-powered dish facts, and robust admin management.

## 🚀 Features

- **Cinematic UI**: 1600px wide layout with high-impact hero visuals and smooth transitions.
- **Secure Auth**: JWT-based authentication with role-based access control (RBAC).
- **Dynamic Menu**: Real-time filtering, search, and deep-link category navigation.
- **Smart Customization**: Per-item choices (Size, Crust, Extra Toppings, Spice Levels).
- **Order Pipeline**: Real-time status tracking (Confirmed → Preparing → Out for Delivery → Delivered).
- **Admin Dashboard**: Comprehensive revenue analytics and inventory/order management.
- **AI Integration**: Gemini-powered culinary facts and pairing suggestions for every dish.
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile.

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, React Router 7, ESM modules.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **AI**: Google Gemini API (@google/genai).
- **State Management**: React Context (Auth, Cart, Toast).

## 📦 Setup Instructions

### Backend (server/)
1. Navigate to the root directory.
2. Create a `.env` file from `.env.example`.
3. Add your `DB_URI` (MongoDB connection string) and `JWT_SECRET`.
4. Install dependencies:
   ```bash
   npm install express mongoose dotenv cors jsonwebtoken bcryptjs @google/genai
   ```
5. Seed the database with professional mock data:
   ```bash
   node server/scripts/seed.js
   ```
6. Start the server:
   ```bash
   node server/server.js
   ```

### Frontend
1. The frontend uses standard ESM imports. For local development with Vite:
   ```bash
   npm install
   npm run dev
   ```
2. Ensure the backend is running on port 5000 (default) for the API proxy to work.

## 🧪 Testing
Run backend unit tests using Jest:
```bash
npm test
```
The project includes route-level tests for Menu and Order controllers.
