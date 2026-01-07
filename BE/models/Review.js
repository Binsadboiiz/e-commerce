import mongoose, { mongo } from "mongoose";

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: String
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);
export default Review;