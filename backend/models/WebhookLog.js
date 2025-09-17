const mongoose = require("mongoose");

const WebhookLogSchema = new mongoose.Schema({
  payload: { type: Object, required: true },  // store raw webhook payload
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WebhookLog", WebhookLogSchema);
