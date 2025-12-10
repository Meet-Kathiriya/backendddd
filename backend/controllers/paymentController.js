const Order = require('../models/orderSchema');
const Cart = require('../models/cartSchema');
const mongoose = require('mongoose');

// Lazy initialization of Stripe to avoid errors when key is not set
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

// Create payment intent
module.exports.createPaymentIntent = async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ msg: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' });
    }

    const { shippingAddress, cartItems } = req.body;
    const userId = req.user._id;

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.email || 
        !shippingAddress.phone || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      return res.status(400).json({ msg: 'Shipping address is incomplete' });
    }

    // Calculate totals from frontend cart items
    const subtotal = cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
        : item.price;
      return total + (price * item.quantity);
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const shipping = 50; // Fixed shipping cost
    const total = subtotal + tax + shipping;

    // Validate total amount
    if (total <= 0) {
      return res.status(400).json({ msg: 'Invalid total amount' });
    }

    // Initialize Stripe
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ msg: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
        orderType: 'ecommerce'
      }
    });

    // Create order with pending status
    // Convert product IDs to MongoDB ObjectIds
    const orderItems = cartItems.map(item => {
      const productId = item.id || item.productId;
      
      // Validate and convert to ObjectId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error(`Invalid product ID: ${productId}`);
      }
      
      return {
        product: new mongoose.Types.ObjectId(productId),
        quantity: item.quantity,
        price: typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
          : item.price
      };
    });

    const order = await Order.create({
      user: userId,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentIntentId: paymentIntent.id,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    res.status(200).json({
      msg: 'Payment intent created',
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ msg: error.message });
  }
};

// Confirm payment and update order
module.exports.confirmPayment = async (req, res) => {
  try {
    // Initialize Stripe
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ msg: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' });
    }

    const { paymentIntentId, orderId } = req.body;
    const userId = req.user._id;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        msg: 'Payment not completed',
        status: paymentIntent.status 
      });
    }

    // Update order status
    const order = await Order.findOne({ 
      _id: orderId, 
      user: userId,
      paymentIntentId 
    });

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    await order.save();

    // Clear user's cart after successful payment
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      msg: 'Payment confirmed successfully',
      order: order
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ msg: error.message });
  }
};

// Get user orders
module.exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ msg: 'Orders retrieved', data: orders });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get single order
module.exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      user: req.user._id 
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.status(200).json({ msg: 'Order retrieved', data: order });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

