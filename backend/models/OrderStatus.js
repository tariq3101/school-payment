const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderStatusSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", // your Order schema
    required: true,
  },
  collect_id: {
    type: String, // from Edviron API
    required: true,
  },
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: { type: Schema.Types.Mixed },   // 👈 fix here
  payment_details: { type: Schema.Types.Mixed }, // 👈 store raw object too
  bank_reference: String,
  payment_message: String,
  status: String,
  error_message: String,
  payment_time: Date,
  custom_order_id:  { type: Schema.Types.Mixed }, 
});

module.exports = mongoose.model("OrderStatus", OrderStatusSchema);
