import mongoose, { mongo } from "mongoose";

const ShopSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true
    },
    description: String,
    logo: String,
    banner: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Shop = mongoose.model('Shop', ShopSchema);
export default Shop;