import { Schema, model } from 'mongoose';

const AppointmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  family: { type: Schema.Types.ObjectId, ref: 'Family' },
  driver: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  days: { 
    type: [String], 
    enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    required: true,
    set: (days: string[]) => days.map(day => day.toLowerCase())
  },
  timeFrom: { type: String, required: true },
  timeTo: { type: String, required: true },
  recurring: { type: Boolean, default: false },
  locationFrom: { type: String, required: true },
  locationTo: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'done'], default: 'upcoming' },
  review: { type: Schema.Types.ObjectId, ref: 'Review' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('Appointment', AppointmentSchema);
