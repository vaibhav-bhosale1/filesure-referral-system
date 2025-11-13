# FileSure - Full Stack Referral & Credit System

This is a full-stack intern assignment project for FileSure. It implements a referral and credit system for a digital product platform. The goal is to allow users to register, share a referral link, and earn credits when their referrals make a purchase.

**[Live Demo Link]** - (Add your deployed Vercel/Render link here)

---

## 🚀 Tech Stack

This project uses the exact modern stack specified in the technical requirements.

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, Zustand, Framer Motion  
**Backend:** Node.js, Express, TypeScript, Mongoose  
**Database:** MongoDB  
**Authentication:** JWT (JSON Web Tokens) & bcryptjs for hashing

---

## ✨ Features

This application implements all the core functional requirements:

- **Secure User Authentication:** Users can register, log in, and log out. Passwords are securely hashed, and sessions are managed with JWTs.
- **Unique Referral Link:** Every user receives a unique referral code and link upon registration.
- **Referral Tracking:** When a new user (Ryan) signs up using a referrer's link (Lina), the relationship is recorded with a pending status.
- **Credit Award System:** On the referred user's first purchase only, both the referrer and the referred user earn 2 credits.
- **Data Integrity:** The system uses database transactions and status tracking to prevent double-crediting for the same referral.
- **User Dashboard:** A protected dashboard displays key metrics:
  - Total Referred Users
  - Number of Converted Users (who purchased)
  - Total Credits Earned
  - The user's unique referral link with a "Copy" button
- **Purchase Simulation:** A "Simulate Purchase" button on the dashboard allows any user to trigger the purchase logic.

---

## 🛠️ Setup & Installation

To run this project locally, you'll need to run the server and client in two separate terminals.

### 1. Backend (/server)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/filesure-referral-system.git
cd filesure-referral-system/server

# 2. Install dependencies
npm install

# 3. Create your environment file
# (See "Environment Variables" section below)
cp .env.example .env

# 4. Run the development server
npm run dev

# Server will be running on http://localhost:5001
```

### 2. Frontend (/client)

```bash
# 1. Open a new terminal and navigate to the client folder
cd filesure-referral-system/client

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# App will be running on http://localhost:3000
```

---

## 🔑 Environment Variables

You must create a `.env` file in the `/server` directory. Copy the contents of `.env.example`.

**server/.env**

```env
# The port your backend server will run on
PORT=5001

# Your MongoDB connection string
MONGO_URI=your_mongodb_connection_string_here

# A strong, secret key for signing JSON Web Tokens
JWT_SECRET=your_super_secret_key_for_tokens
```

The frontend (`/client`) does not require any environment variables, as the API URL is hardcoded in `client/src/lib/api.ts`.

---

## 📋 API Endpoints

The backend provides the following RESTful API endpoints:

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Registers a new user. Can optionally include a `referralCode`. |
| POST | `/api/auth/login` | Public | Logs in a user and returns a JWT. |
| GET | `/api/dashboard` | Private | Gets all dashboard stats for the currently logged-in user. |
| POST | `/api/purchase` | Private | Simulates a purchase for the logged-in user and triggers referral credit logic. |
| GET | `/api/health` | Public | A simple health check route. |

---

## 📐 Architecture & Business Logic

The application is built with a clean, modular architecture in both the frontend and backend.

### Business Logic (Referral Flow)

1. **Lina signs up.** The system creates a User document for her with a unique `referralCode` (e.g., `LINA123`).

2. **Lina shares her link:** `.../register?r=LINA123`.

3. **Ryan clicks the link and registers.** The system:
   - Creates a User document for Ryan.
   - Sets Ryan's `referredBy` field to Lina's User ID.
   - Creates a new Referral document (`referrer: Lina_ID, referredUser: Ryan_ID, status: 'pending'`).

4. **Ryan logs in and clicks "Simulate Purchase".** The system:
   - Checks if `Ryan.hasMadeFirstPurchase` is `false`.
   - Checks if `Ryan.referredBy` is not `null`.
   - Finds the Referral document.
   - If `status` is `pending`, it awards 2 credits to Lina and 2 credits to Ryan.
   - It sets `Ryan.hasMadeFirstPurchase` to `true` and the `Referral.status` to `converted`.

5. **If Ryan clicks "Simulate Purchase" again**, the logic is skipped because `hasMadeFirstPurchase` is now `true`, preventing double-crediting.

---

## 🎯 Key Technical Implementations

### Frontend (Next.js + TypeScript)
- **State Management:** Zustand store with persistence for authentication
- **Routing:** Next.js App Router with protected routes
- **Form Handling:** React Hook Form with validation
- **Animations:** Framer Motion for smooth transitions
- **Styling:** Tailwind CSS with custom components

### Backend (Node.js + Express + TypeScript)
- **Authentication Middleware:** JWT-based auth protection
- **Database Models:** Mongoose schemas for User and Referral
- **Transaction Safety:** MongoDB transactions for credit awards
- **Error Handling:** Centralized error handling middleware
- **Validation:** Input validation and sanitization

---

## 📱 User Flow

### Registration with Referral
1. User receives referral link from friend
2. Clicks link with referral code in URL parameter
3. Registers with email and password
4. System automatically links them to referrer
5. Redirected to dashboard

### Dashboard Experience
1. View referral statistics
2. Copy unique referral link
3. Share with friends
4. Simulate purchase to test credit system
5. Watch credits accumulate

---

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- Secure HTTP headers
- Environment variable protection

---

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Configure build settings
4. Deploy

---

## 📝 Future Enhancements

- Email notifications for referrals
- Analytics dashboard with charts
- Credit redemption system
- Social sharing integration
- Admin panel for monitoring
- Rate limiting for API endpoints

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/vaibhav-bhosale1/filesure-referral-system/issues).

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/vaibhav-bhosale1)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/vaibhav-bhosale-0a2b13259/)

---

## 🙏 Acknowledgments

- FileSure for the internship opportunity
- Next.js and React teams for amazing frameworks
- MongoDB for reliable database solution

---

**Made with ❤️ for FileSure Internship Assignment**
