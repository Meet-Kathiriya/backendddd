const cartSchema = require("../models/cartSchema");

module.exports.getCart = async (req, res) => {
    try {
        let cart = await cartSchema.findOne({ user: req.user._id }).populate("items.product");

        if (!cart) {
            cart = await cartSchema.create({ user: req.user._id, items: [] });
        }

        res.status(200).json({ msg: "Cart data", data: cart });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        let cart = await cartSchema.findOne({ user: req.user._id });

        if (!cart) {
            cart = await cartSchema.create({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({ msg: "Item added to cart", data: cart });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartSchema.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        }

        const item = cart.items.id(req.params.itemId);
        if (!item) {
            return res.status(404).json({ msg: "Item not found" });
        }

        if (quantity <= 0) {
            item.remove();
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({ msg: "Cart updated", data: cart });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.removeFromCart = async (req, res) => {
    try {
        const cart = await cartSchema.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        }

        cart.items.id(req.params.itemId).remove();
        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({ msg: "Item removed from cart", data: cart });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        const cart = await cartSchema.findOne({ user: req.user._id });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(200).json({ msg: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

