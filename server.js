const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/shopping_cart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Define schemas and models
const itemSchema = new mongoose.Schema({
    name: String,
    price: Number
});

const Item = mongoose.model('Item', itemSchema);

const orderSchema = new mongoose.Schema({
    shippingDetails: {
        type: Map,
        of: String
    },
    items: [{
        productId: String,
        quantity: Number
    }],
    totalAmount: Number,
    discount: Number,
    finalTotal: Number
});

const Order = mongoose.model('Order', orderSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes to serve static pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/product1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product1.html'));
});

app.get('/product2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product2.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/order-confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order-confirmation.html'));
});

// POST route to handle order placement
app.post('/cart/place-order', async (req, res) => {
    try {
        const { shippingDetails, items, totalAmount, discount, finalTotal } = req.body;

        // Validate data
        if (!shippingDetails || !items || !totalAmount || !finalTotal) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate data types
        if (typeof totalAmount !== 'number' || typeof finalTotal !== 'number') {
            return res.status(400).json({ message: 'Total amount and final total must be numbers' });
        }

        if (!Array.isArray(items) || items.some(item => typeof item.productId !== 'string' || typeof item.quantity !== 'number')) {
            return res.status(400).json({ message: 'Invalid items format' });
        }

        // Create a new order
        const order = new Order({
            shippingDetails,
            items,
            totalAmount,
            discount,
            finalTotal
        });

        // Save the order to the database
        await order.save();

        // Send a success response
        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: `Failed to place order: ${error.message}` });
    }
});

// Example route to get items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find({});
        res.json(items);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
