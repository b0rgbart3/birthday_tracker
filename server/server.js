const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const path = require("path");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: true, // Reflect the request origin
    credentials: true,
  }),
);
app.use(express.json());

const PORT = process.env.PORT || 5001;

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Birthday Schema
const birthdaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
});

const Birthday = mongoose.model("Birthday", birthdaySchema);

// API Endpoints

// Get all birthdays
app.get("/api/birthdays", async (req, res) => {
  try {
    const birthdays = await Birthday.find().sort({ name: 1 });
    res.json(birthdays);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new birthday
app.post("/api/birthdays", async (req, res) => {
  const birthday = new Birthday({
    name: req.body.name,
    date: req.body.date,
  });

  try {
    const newBirthday = await birthday.save();
    res.status(201).json(newBirthday);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a birthday
app.delete("/api/birthdays/:id", async (req, res) => {
  try {
    const result = await Birthday.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Birthday not found" });
    res.json({ message: "Birthday deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Email Notification Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reminder Logic Logic
const checkBirthdaysAndNotify = async () => {
  console.log("Running daily birthday check...");
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Find birthdays occurring exactly 7 days from now
    // We need to match Month and Day
    const birthdays = await Birthday.find();

    const upcoming = birthdays.filter((b) => {
      const bDate = new Date(b.date);
      return (
        bDate.getMonth() === nextWeek.getMonth() &&
        bDate.getDate() === nextWeek.getDate()
      );
    });

    for (const person of upcoming) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFICATION_EMAIL,
        subject: `Upcoming Birthday Reminder: ${person.name}`,
        text: `Just a reminder that ${person.name}'s birthday is in exactly one week on ${new Date(person.date).toLocaleDateString()}!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending email for ${person.name}:`, error);
        } else {
          console.log(`Email sent for ${person.name}: ` + info.response);
        }
      });
    }
  } catch (err) {
    console.error("Error in birthday check cron job:", err);
  }
};

// Daily Cron Job (at midnight)
cron.schedule("0 0 * * *", checkBirthdaysAndNotify);

// For testing: trigger manually if needed via endpoint (optional, but good for demo)
app.get("/api/test-reminders", async (req, res) => {
  await checkBirthdaysAndNotify();
  res.json({ message: "Manual check triggered. Check server logs." });
});

const buildPath = path.join(__dirname, "../client/dist");

// Serve static files
app.use(express.static(buildPath, { index: "index.html" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
