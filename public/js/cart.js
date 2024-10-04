const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Item = require('../models/item');

// Dummy coupon data
const coupons = {
    'AUG50': 50,
    'AUG100': 100
};

// Route to apply a coupon
router.post('/apply-coupon', (req, res) => {
    const { couponCode, totalAmount } = req.body;

    if (!couponCode || isNaN(totalAmount)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    const discount = coupons[couponCode] || 0;
    const discountedAmount = totalAmount - discount;

    res.json({ discount, discountedAmount });
});

// Route to remove an item from the cart
router.post('/remove-item', (req, res) => {
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ message: 'Invalid item ID' });
    }

    // Logic to remove item from the cart (to be implemented based on how you store cart data)
    res.json({ message: 'Item removed successfully' });
});

// Route to place an order
router.post('/cart/place-order', async (req, res) => {
    const { shippingDetails, items, totalAmount, discount, finalTotal } = req.body;

    // Debugging statements to check incoming data
    console.log('Received order details:');
    console.log('Shipping Details:', shippingDetails);
    console.log('Items:', items);
    console.log('Total Amount:', totalAmount);
    console.log('Discount:', discount);
    console.log('Final Total:', finalTotal);

    // Ensure required data is present
    if (!shippingDetails || !items || items.length === 0 || totalAmount <= 0) {
        return res.status(400).json({ message: 'Invalid order details' });
    }

    try {
        // Save the order to the database
        const order = new Order({
            shippingDetails,
            items,
            totalAmount,
            discount,
            finalTotal
        });
        await order.save();

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

// Route to add a new item
router.post('/add-item', async (req, res) => {
    try {
        const { name, description, price, size } = req.body;

        // Create a new item instance
        const newItem = new Item({
            name,
            description,
            price,
            size
        });

        // Save the item to the database
        await newItem.save();

        // Send a response
        res.status(201).send('Item saved successfully!');
    } catch (error) {
        console.error('Error saving item:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
