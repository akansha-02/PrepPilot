import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '', index: true },
    image: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);