📖 Overview
Civic Voice is a web platform that bridges the gap between citizens and local authorities. It enables residents to report civic issues — such as broken roads, faulty streetlights, overflowing garbage, or water supply problems — directly to the relevant departments. Citizens can submit complaints, upload photos, track the status of their reports, and get notified when issues are resolved.
The goal is to make local governance more transparent, responsive, and citizen-driven

Features

📍 Issue Reporting — Submit civic complaints with location, category, description, and photo evidence
📊 Status Tracking — Track the progress of submitted issues (Pending → In Progress → Resolved)🔐 User Authentication — Secure login and registration for citizens
🛠️ Admin Dashboard — Authority panel to manage, assign, and resolve reported issues
📁 Photo Uploads — Attach images to better describe the issue

🛠️ Tech Stack
Frontend - React.js,TailwindCSS
Backend - Node.js + Express.js
Database - MySQL
Authentication - JWT / bcrypt


⚙️ Setup & Installation
Prerequisites
Make sure you have the following installed:

Node.js (v16 or above)
npm or yarn
Git
MySQL (v8 or above)


1. Clone the Repository
git clone https://github.com/ameera2311/Civic_voice_.git
cd Civic_voice_

2. Backend Setup
cd backend
npm install

Create a .env file in the backend/ directory:
envPORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=civic_voice
JWT_SECRET=your_jwt_secret_key

Start the backend server:
npm start
The server will run at http://localhost:5000

4. Frontend Setup
cd ../frontend
npm install

Create a .env file in the frontend/ directory (if needed):
envREACT_APP_API_URL=http://localhost:5000

Start the React development server:
npm start

The app will open at http://localhost:3000

🚀 Usage

Register / Login — Create an account or log in as a citizen.
Report an Issue — Click "Report Issue", fill in the details (title, category, location, description), and optionally upload a photo.
View Issues — Browse all reported issues in list view or on the map.
Track Status — Visit your profile to see the status of your submitted reports.
Admin Panel — Authorities can log in to the admin dashboard to manage and resolve issues.


📁 Project Structure
Civic_voice_/
├── backend/
│   ├── controllers/       # Route handler logic
│   ├── models/            # ml models
│   ├── routes/            # Express API routes
│   ├── middleware/        # Auth & error middleware
│   └── server.js          # Entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page-level components
│       ├── context/       # React Context / state management
│       ├── services/      # API call functions
│       └── App.js         # Root component
│
└── README.md



