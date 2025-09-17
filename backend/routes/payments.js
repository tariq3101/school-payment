const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const OrderStatus = require("../models/OrderStatus");
const protect = require("../middleware/auth");

const router = express.Router();

// POST /create-payment
// /create-payment
router.post("/create-payment", async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ error: "Amount and OrderId are required" });
    }

    const payload = {
      school_id: process.env.SCHOOL_ID,
      amount: amount.toString(),
      callback_url: process.env.CALLBACK_URL,
    };

    const sign = jwt.sign(payload, process.env.PG_KEY);

    const response = await axios.post(
      "https://dev-vanilla.edviron.com/erp/create-collect-request",
      {
        school_id: process.env.SCHOOL_ID,
        amount: amount.toString(),
        callback_url: process.env.CALLBACK_URL,
        sign,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const paymentData = response.data;

    // ✅ Save only mapping at this stage
    await OrderStatus.create({
      order_id: orderId,                       // your order reference
      collect_id: paymentData.collect_request_id, // Edviron ID
      order_amount: amount,
      status: "PENDING",
      payment_time: new Date(),
    });

    return res.json(paymentData);

  } catch (err) {
    console.error("Create Payment Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment creation failed", details: err.response?.data });
  }
});

router.get("/status/:collect_request_id", protect, async (req, res) => {
  try {
    const { collect_request_id } = req.params;

    if (!collect_request_id) {
      return res.status(400).json({ error: "collect_request_id is required" });
    }

    // JWT payload for status check
    const payload = {
      school_id: process.env.SCHOOL_ID,
      collect_request_id,
    };

    // Generate JWT sign with PG_KEY
    const sign = jwt.sign(payload, process.env.PG_KEY);

    // Call gateway API
    const response = await axios.get(
      `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}?school_id=${process.env.SCHOOL_ID}&sign=${sign}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    // Return full response to frontend
    console.log(response.data);
    return res.json(response.data);

  } catch (err) {
    console.error("Check Payment Status Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to check payment status", details: err.response?.data });
  }
});

// ✅ Callback route (redirected after payment)
// ✅ Callback route
router.get("/callback", async (req, res) => {
  try {
    const { EdvironCollectRequestId } = req.query;

    if (!EdvironCollectRequestId) {
      return res.status(400).json({ error: "collect_request_id missing in callback" });
    }

    // 1. Generate sign for status check
    const payload = {
      school_id: process.env.SCHOOL_ID,
      collect_request_id: EdvironCollectRequestId,
    };
    const sign = jwt.sign(payload, process.env.PG_KEY);

    // 2. Call status API
    const response = await axios.get(
      `https://dev-vanilla.edviron.com/erp/collect-request/${EdvironCollectRequestId}?school_id=${process.env.SCHOOL_ID}&sign=${sign}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const data = response.data;

    // 3. Update existing record (mapped by collect_id)
    await OrderStatus.findOneAndUpdate(
      { collect_id: EdvironCollectRequestId }, // find the same record created earlier
      {
        transaction_amount: data.amount,
        payment_mode: data.details?.payment_methods || "N/A",
        payment_details: data.details || {},
        bank_reference: data.details?.bank_ref || "N/A",
        payment_message: data.status,
        status: data.status,
        error_message: data.error || null,
        payment_time: new Date(),
        custom_order_id: EdvironCollectRequestId,
      },
      { new: true }
    );

    // 4. Respond / redirect
    res.redirect("https://school-payment-frontend-lime.vercel.app/transactions");

  } catch (err) {
    console.error("Callback Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to process callback", details: err.response?.data });
  }
});


module.exports = router;
