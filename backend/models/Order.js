const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentInfoSchema = new Schema({
  name: String,
  id: String,
  email: String,
}, { _id: false });

const OrderSchema = new Schema({
  school_id: { type: Schema.Types.Mixed },
  trustee_id: { type: Schema.Types.Mixed },
  student_info: StudentInfoSchema,
  gateway_name: String,
});

module.exports = mongoose.model("Order", OrderSchema);
