const express = require("express");
const WebhookLog = require("../models/WebhookLog");
const OrderStatus = require("../models/OrderStatus");

const router = express.Router();

/**
 * Webhook endpoint
 * POST /api/webhook
 */
router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    // 1. Always log the raw webhook
    await WebhookLog.create({ payload });

    // 2. Extract order_info
    const orderInfo = payload.order_info;
    if (!orderInfo || !orderInfo.order_id) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    // 3. Find the corresponding OrderStatus by collect_id / transaction_id
    const existingOrderStatus = await OrderStatus.findOne({
      collect_id: orderInfo.order_id
    });

    if (existingOrderStatus) {
      // Update existing record
      existingOrderStatus.order_amount = orderInfo.order_amount;
      existingOrderStatus.transaction_amount = orderInfo.transaction_amount;
      existingOrderStatus.payment_mode = orderInfo.payment_mode;
      existingOrderStatus.payment_details = orderInfo.payemnt_details || {}; // note spelling in payload
      existingOrderStatus.bank_reference = orderInfo.bank_reference;
      existingOrderStatus.payment_message = orderInfo.Payment_message;
      existingOrderStatus.status = orderInfo.status;
      existingOrderStatus.error_message = orderInfo.error_message;
      existingOrderStatus.payment_time = new Date(orderInfo.payment_time);

      await existingOrderStatus.save();
    } else {
      // Create new record if none exists
      await OrderStatus.create({
        collect_id: orderInfo.order_id,
        order_amount: orderInfo.order_amount,
        transaction_amount: orderInfo.transaction_amount,
        payment_mode: orderInfo.payment_mode,
        payment_details: orderInfo.payemnt_details || {},
        bank_reference: orderInfo.bank_reference,
        payment_message: orderInfo.Payment_message,
        status: orderInfo.status,
        error_message: orderInfo.error_message,
        payment_time: new Date(orderInfo.payment_time)
      });
    }

    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

module.exports = router;
