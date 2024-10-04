const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
const OrderSchema = new mongoose.Schema({
    shippingDetails: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
}, { timestamps: true });


