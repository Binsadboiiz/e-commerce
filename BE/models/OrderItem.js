import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
    },
    retailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    productName: String,
    price: Number,
    quantity: Number,
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "completed"],
        default: "pending"
    }
}, { timestamps: true });

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
export default OrderItem;