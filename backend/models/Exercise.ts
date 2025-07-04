import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  description: { type: String, required: true },
  video: { type: String, required: true },
  icon: { type: String, required: true },
});

export default model('Review', ReviewSchema);