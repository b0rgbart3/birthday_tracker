# Birthday Tracker & Reminder

A simple and elegant application to keep track of your friends' and family's birthdays. Built with a Node.js/Express backend, MongoDB, and a React/Vite frontend using shadcn/ui.

## Features

- **Birthday Entry**: Easily add names and birth dates.
- **Tracked List**: View all stored birthdays in a sleek, sortable table.
- **Automatic Sorting**: Sort by "Name" or "Date" with a single click.
- **Email Reminders**: Automatically sends an email notification 1 week before any upcoming birthday.
- **Dark Mode**: Premium dark-themed UI with pale blue highlights.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI.
- A Gmail account (with an App Password) for sending reminders.

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Create/Edit the `.env` file and provide your credentials:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   NOTIFICATION_EMAIL=where_to_send_reminders@gmail.com
   ```
3. Install dependencies and start the server:
   ```bash
   npm install
   npm start
   ```
   *The server will run on [http://localhost:5001](http://localhost:5001)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
   *The UI will usually run on [http://localhost:5173](http://localhost:5173) or [http://localhost:5174](http://localhost:5174)*

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **Notifications**: Node-cron (daily checks) and Nodemailer.

## 🧪 Testing Reminders
The backend includes a manual trigger for testing the birthday check logic:
- Visit `http://localhost:5001/api/test-reminders` to trigger a manual scan and check your server logs/email.
