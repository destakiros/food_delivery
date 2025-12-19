
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const notificationSchema = mongoose.Schema({
  message: { type: String, required: true },
  time: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  suspensionEnd: { type: String },
  notifications: [notificationSchema],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
