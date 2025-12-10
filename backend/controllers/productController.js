const productSchema = require("../models/productSchema");

module.exports.getAllProducts = async (req, res) => {
    try {
        const { category, condition, search } = req.query;
        let query = {};

        if (category && category !== 'All Categories') {
            query.category = category;
        }

        if (condition && condition !== 'All Conditions') {
            query.condition = condition;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        await productSchema.find(query).sort({ createdAt: -1 }).then((data) => {
            res.status(200).json({ msg: "All products", data: data });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.getProductById = async (req, res) => {
    try {
        await productSchema.findById(req.params.id).then((data) => {
            if (!data) {
                return res.status(404).json({ msg: "Product not found" });
            }
            res.status(200).json({ msg: "Product data", data: data });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.createProduct = async (req, res) => {
    try {
        await productSchema.create(req.body).then((data) => {
            res.status(200).json({ msg: "Product created successfully", data: data });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        await productSchema.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).then((data) => {
            if (!data) {
                return res.status(404).json({ msg: "Product not found" });
            }
            res.status(200).json({ msg: "Product updated successfully", data: data });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        await productSchema.findByIdAndDelete(req.params.id).then((data) => {
            if (!data) {
                return res.status(404).json({ msg: "Product not found" });
            }
            res.status(200).json({ msg: "Product deleted successfully" });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

