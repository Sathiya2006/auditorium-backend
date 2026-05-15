require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* Models */
const Auditorium = mongoose.model("Auditorium", {
  name: String,
  capacity: Number
});

const Booking = mongoose.model("Booking", {
  name: String,
  department: String,
  date: String,
  time: String,
  eventName: String,
  auditorium: String
});

/* Routes */

/* Get auditoriums */
app.get("/api/auditoriums", async (req, res) => {
  const data = await Auditorium.find();
  res.json(data);
});

/* Add sample data */
app.get("/add-auditoriums", async (req, res) => {
  await Auditorium.insertMany([
    { name: "Main Hall", capacity: 500 },
    { name: "Seminar Hall", capacity: 200 },
    { name: "Conference Room", capacity: 100 }
  ]);
  res.send("Added");
});

/* Simple booking (NO CHECK) */
app.post("/api/bookings", async (req, res) => {
  const newBooking = new Booking(req.body);
  await newBooking.save();

  res.json({ message: "Booking saved" });
});

/* Get all bookings (NO FILTER) */
app.get("/bookings", async (req, res) => {
    const hall = req.query.hall;

  let data;

  if (hall) {
    data = await Booking.find({ auditorium: hall }); // filter
  } else {
    data = await Booking.find(); // all bookings (admin)
  }

  res.json(data);
});
app.get("/", (req, res) => {
    console.log("Home route hit");
    res.status(200).send("Backend Working Properly");
});

/* Server */
app.listen(8000, () => console.log("Server running on 5000"));