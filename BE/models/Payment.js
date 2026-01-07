import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    method: String,
    amount: Number,
    status: String,
    transactionId: String
}, { timestamps: true });

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;