
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: String,
    quantity: Number,
    price: Number,
    selectedOptions: mongoose.Schema.Types.Mixed
  }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  orderStatus: { 
    type: String, 
    enum: ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'], 
    default: 'Confirmed' 
  },
  deliveryAddress: { type: String, required: true },
  instructions: { type: String }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
