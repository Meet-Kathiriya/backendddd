const wishlistSchema = require("../models/wishlistSchema");

module.exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await wishlistSchema.findOne({ user: req.user._id }).populate("products");

        if (!wishlist) {
            wishlist = await wishlistSchema.create({ user: req.user._id, products: [] });
        }

        res.status(200).json({ msg: "Wishlist data", data: wishlist });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        let wishlist = await wishlistSchema.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await wishlistSchema.create({ user: req.user._id, products: [] });
        }

        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }

        await wishlist.populate("products");

        res.status(200).json({ msg: "Product added to wishlist", data: wishlist });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistSchema.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ msg: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            id => id.toString() !== req.params.productId
        );

        await wishlist.save();
        await wishlist.populate("products");

        res.status(200).json({ msg: "Product removed from wishlist", data: wishlist });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.clearWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistSchema.findOne({ user: req.user._id });

        if (wishlist) {
            wishlist.products = [];
            await wishlist.save();
        }

        res.status(200).json({ msg: "Wishlist cleared successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

