const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/auth");

const router = express.Router();

// 👉 Create a new order
router.post("/", protect, async (req, res) => {
  try {
    const { school_id, trustee_id, student_info, gateway_name } = req.body;

    if (!student_info || !student_info.name || !student_info.id) {
      return res.status(400).json({ error: "student_info.name and student_info.id are required" });
    }

    const order = new Order({ school_id, trustee_id, student_info, gateway_name });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Get all orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Get order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Update order
router.patch("/:id", protect, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Delete order
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
