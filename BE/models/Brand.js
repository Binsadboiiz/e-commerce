import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logo: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

const Brand = mongoose.model('Brand', BrandSchema);
export default Brand;