import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true, enum: ["male", "female"]},
  workoutDays: {type: Number, required: true, enum: [3, 4, 5, 6]},
  height: {type: Number, required: true},
  weight: {type: Number, required: true},
  
}, { timestamps: true });

export default model('User', UserSchema);
