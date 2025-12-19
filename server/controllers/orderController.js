
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const { items, totalAmount, deliveryAddress } = req.body;
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  
  const order = new Order({
    customerId: req.user._id,
    items,
    totalAmount,
    deliveryAddress,
    paymentStatus: 'Paid' // Simulated for this demo
  });
  
  const createdOrder = await order.save();

  // Mock Email Notification
  console.log(`[EMAIL] Notification sent to ${req.user.email}: Order ${createdOrder._id} has been confirmed!`);
  
  res.status(201).json(createdOrder);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('customerId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    const updatedOrder = await order.save();
    
    // Mock Email Notification on status change
    console.log(`[EMAIL] Status Update: Order ${order._id} is now ${updatedOrder.orderStatus}`);
    
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};
