import mongoose from "mongoose";

const OderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "completed", "cancelled"],
        default: "pending"
    },
    paymentMethod: String,
    paymentStatus: String,
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }
}, { timestamps: true });

const Oder = mongoose.model("Oder", OderSchema);
export default Oder;