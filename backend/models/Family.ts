import { Schema, model } from 'mongoose';
import Users from './User';
const FamilySchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    
  }],
  drivers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
});

export default model('Family', FamilySchema);
