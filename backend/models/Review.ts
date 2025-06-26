import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default model('Review', ReviewSchema);