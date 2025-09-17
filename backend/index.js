const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth");
const protect = require("./middleware/auth");
const paymentsRouter = require("./routes/payments");
const ordersRouter = require("./routes/orders");
const webhookRouter = require("./routes/webhook");
const transactionRoutes = require("./routes/transactions");

const app = express();
app.use(express.json());

// ✅ CORS setup for both localhost and Vercel frontend
const allowedOrigins = [
  "http://localhost:8080",
  "https://school-payment-frontend-lime.vercel.app"
];

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests safely
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.sendStatus(200);
  }
  next();
});

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Mongo Error:", err));

// ✅ Routes
app.get("/", (req, res) => res.send("Payment Gateway API is running"));

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/webhook", webhookRouter);
app.use("/api/transactions", transactionRoutes);

// ✅ Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authorized!` });
});

// ✅ Render requires process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
