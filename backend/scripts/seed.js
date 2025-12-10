require("dotenv").config();
const mongoose = require("mongoose");
const productSchema = require("../models/productSchema");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/craftcore");

const db = mongoose.connection;

db.once("open", async (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log("Db connected successfully");

        const products = [
            {
                name: 'Modern Sofa Set',
                price: 1299,
                category: 'Living Room',
                condition: 'New',
                image: '🛋️',
                description: 'Comfortable modern sofa set perfect for your living room'
            },
            {
                name: 'Elegant Dining Table',
                price: 899,
                category: 'Dining Room',
                condition: 'New',
                image: '🍽️',
                description: 'Beautiful dining table for family gatherings'
            },
            {
                name: 'Comfortable Bed Frame',
                price: 1599,
                category: 'Bedroom',
                condition: 'New',
                image: '🛏️',
                description: 'Premium bed frame for a good night sleep'
            },
            {
                name: 'Office Desk',
                price: 599,
                category: 'Office',
                condition: 'Like New',
                image: '💼',
                description: 'Spacious office desk for productivity'
            },
            {
                name: 'Coffee Table',
                price: 349,
                category: 'Living Room',
                condition: 'New',
                image: '☕',
                description: 'Stylish coffee table for your living space'
            },
            {
                name: 'Wardrobe Cabinet',
                price: 1199,
                category: 'Bedroom',
                condition: 'New',
                image: '🚪',
                description: 'Large wardrobe for all your storage needs'
            },
            {
                name: 'Bookshelf',
                price: 449,
                category: 'Office',
                condition: 'Like New',
                image: '📚',
                description: 'Perfect bookshelf for your collection'
            },
            {
                name: 'Dining Chairs Set',
                price: 599,
                category: 'Dining Room',
                condition: 'New',
                image: '🪑',
                description: 'Set of elegant dining chairs'
            },
            {
                name: 'Recliner Chair',
                price: 799,
                category: 'Living Room',
                condition: 'New',
                image: '🪑',
                description: 'Comfortable recliner for relaxation'
            }
        ];

        try {
            await productSchema.deleteMany({});
            await productSchema.insertMany(products);
            console.log('Products seeded successfully');
            process.exit(0);
        } catch (error) {
            console.error('Error seeding products:', error);
            process.exit(1);
        }
    }
});
