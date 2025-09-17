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

const allowedOrigins = [
  "http://localhost:8080", // dev
  "https://school-payment-frontend-lime.vercel.app" // Vercel frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman, curl
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
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
