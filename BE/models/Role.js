import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'retailer'],
        unique: true
    }
}, { timestamps: true });

const Role = mongoose.model('Role', RoleSchema);
export default Role;