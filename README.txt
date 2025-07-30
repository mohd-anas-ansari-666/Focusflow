FocusFlow – MERN Productivity App
A full-stack productivity web application that combines habit tracking, time management, and focus techniques into one seamless experience.

🌟 Key Features
Core Productivity Tools
📋 Habit Tracker: Create daily/weekly habits with streak counters and completion tracking

⏱️ Manual Timer: Start/stop sessions with custom titles, descriptions, and categories

🍅 Pomodoro Timer: 25/5/15 min work/break cycles with auto-progression and session counting

📊 Analytics Dashboard: Visual charts showing productivity patterns and time breakdown

🎯 Goal Tracking: Monitor progress with current and longest habit streaks

User Experience
🔐 Secure Authentication: JWT-based login/register with password hashing

📱 Responsive Design: Works seamlessly on desktop, tablet, and mobile

🎨 Modern UI: Clean Tailwind CSS interface with intuitive navigation

⚡ Real-time Updates: Live timer functionality and instant data sync

🌙 Session Persistence: Continue where you left off with active session tracking

Data & Analytics
📈 Statistics Visualization: Daily/weekly/monthly productivity insights

📂 Session Categories: Organize time by work, study, exercise, reading, coding, etc.

🔄 Progress Tracking: View total time, session counts, and average durations

📅 Calendar Integration: Date-based habit completion and session history

💾 Data Export: Download session logs and productivity reports

Advanced Features
🔔 Smart Notifications: Toast alerts for timer completion and milestones

⚙️ Customizable Settings: Adjust Pomodoro durations and auto-start preferences

🏆 Achievement System: Celebrate streak milestones and productivity goals

📝 Session Notes: Add descriptions and context to time tracking entries

🔄 Auto-save: Never lose progress with automatic data persistence

Tech Stack
Backend: MongoDB, Express v4, Node.js, JWT, bcryptjs
Frontend: React 18, Tailwind CSS, Axios, Recharts, React Router v6
Tools: Mongoose, Lucide icons, date-fns, react-hot-toast

Quick Start
Installation
bash
git clone https://github.com/yourname/focusflow.git
cd focusflow

# Backend setup
cd server && npm install
cp .env.example .env    # Configure MONGODB_URI & JWT_SECRET
npm run dev            # Runs on port 5000

# Frontend setup  
cd ../client && npm install
npm start              # Runs on port 3000
Environment Setup
text
# server/.env
MONGODB_URI=mongodb://localhost:27017/focusflow
JWT_SECRET=your-secure-secret-key
PORT=5000
CLIENT_URL=http://localhost:3000
API Endpoints
Method	Endpoint	Purpose
POST	/api/auth/register	Create new account
POST	/api/auth/login	User authentication
GET	/api/habits	Get user habits
POST	/api/habits/:id/complete	Mark habit complete
POST	/api/time/start	Start time session
PUT	/api/time/:id/end	End active session
GET	/api/time/stats?period=7d	Get productivity stats
Project Structure
text
server/     controllers/ models/ routes/ middleware/ config/
client/     src/components/ src/context/ src/hooks/ src/services/
Deployment
Backend: Heroku, Railway, Render
Frontend: Netlify, Vercel
Database: MongoDB Atlas (cloud) or local MongoDB

Built with ❤️ using the MERN stack - MIT License