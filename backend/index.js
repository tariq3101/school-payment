const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth");
const protect = require("./middleware/auth");
const paymentsRouter = require("./routes/payments");
const ordersRouter = require("./routes/orders");
const webhookRouter = require("./routes/webhook");
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:8080",
    "https://school-payment-frontend-lime.vercel.app/",
  ],  // frontend URL
  credentials: true
}));

// connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Mongo Error:", err));

// Routes
app.get("/", (req, res) => res.send("Payment Gateway API is running"));

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/webhook", webhookRouter);
app.use('/api/transactions', transactionRoutes);

// Example protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authorized!` });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
