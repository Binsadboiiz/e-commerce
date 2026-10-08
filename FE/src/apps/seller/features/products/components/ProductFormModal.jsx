import { useState, useEffect, useMemo } from "react";
import { X, Save, Plus, Trash2, Layers, Tag, Percent } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import CloudinaryImageUploader from "./CloudinaryImageUploader";
import { sellerProductApi } from "../api/sellerProductApi";
import { notify } from "@/shared/utils/Notify";
import styles from "./ProductFormModal.module.css";

const getInitialFormData = (data) => {
    let imagesList = [];
    if (data?.imageUrls && Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        imagesList = [...data.imageUrls];
    } else if (data?.imageUrl) {
        imagesList = [data.imageUrl];
    }

    const hasVariants = data?.variants && Array.isArray(data.variants) && data.variants.length > 1;

    return {
        name: data?.name || "",
        description: data?.description || "",
        categoryId: data?.categoryId || "",
        brandId: data?.brandId || "",
        price: data?.price || 0,
        discountPrice: data?.discountPrice || "",
        imageUrl: data?.imageUrl || (imagesList[0] || ""),
        imageUrls: imagesList,
        status: data?.status || "ACTIVE",
        initialStock: data?.stock || 0,
        hasMultipleVariants: hasVariants,
        variants: hasVariants ? data.variants.map(v => ({
            variantName: v.variantName || v.name || "",
            sku: v.sku || "",
            price: v.price || data?.price || 0,
            initialStock: v.stock || v.initialStock || 0
        })) : [
            {
                variantName: "Standard",
                sku: "",
                price: data?.price || 0,
                initialStock: data?.stock || 0
            }
        ]
    };
};

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
    const isUpdate = !!initialData;

    const [prevInitialData, setPrevInitialData] = useState(initialData);
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    const [formData, setFormData] = useState(() => getInitialFormData(initialData));

    // Category and Brand lists from API
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoadingMeta, setIsLoadingMeta] = useState(false);

    // Fetch categories and brands when modal opens
    useEffect(() => {
        if (!isOpen) return;

        const fetchMeta = async () => {
            try {
                setIsLoadingMeta(true);
                const [catRes, brandRes] = await Promise.all([
                    sellerProductApi.getCategories(),
                    sellerProductApi.getBrands()
                ]);
                const catList = catRes?.data || catRes || [];
                const brandList = brandRes?.data || brandRes || [];
                setCategories(catList);
                setBrands(brandList);

                // Default selection if creating new product and none selected
                if (!initialData) {
                    setFormData(prev => ({
                        ...prev,
                        categoryId: prev.categoryId || (catList[0]?.categoryId || catList[0]?.id || 1),
                        brandId: prev.brandId || (brandList[0]?.brandId || brandList[0]?.id || 1)
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch category/brand options:", err);
            } finally {
                setIsLoadingMeta(false);
            }
        };

        fetchMeta();
    }, [isOpen, initialData]);

    // Reset/sync form state when modal opens or initialData changes
    if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
        setPrevIsOpen(isOpen);
        setPrevInitialData(initialData);
        if (isOpen) {
            setFormData(getInitialFormData(initialData));
        }
    }

    // Computed Discount Percentage
    const discountPercent = useMemo(() => {
        const p = parseFloat(formData.price);
        const d = parseFloat(formData.discountPrice);
        if (p > 0 && d > 0 && d < p) {
            return Math.round(((p - d) / p) * 100);
        }
        return 0;
    }, [formData.price, formData.discountPrice]);

    // Total calculated stock across variants
    const totalVariantStock = useMemo(() => {
        if (!formData.hasMultipleVariants) {
            return parseInt(formData.initialStock) || 0;
        }
        return formData.variants.reduce((sum, v) => sum + (parseInt(v.initialStock) || 0), 0);
    }, [formData.hasMultipleVariants, formData.initialStock, formData.variants]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImagesChange = (newImages) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: newImages,
            imageUrl: newImages[0] || ""
        }));
    };

    // Variant Handlers
    const handleVariantChange = (index, field, value) => {
        setFormData(prev => {
            const updatedVariants = [...prev.variants];
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: value
            };
            return { ...prev, variants: updatedVariants };
        });
    };

    const handleAddVariantRow = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    variantName: `Variant ${prev.variants.length + 1}`,
                    sku: "",
                    price: parseFloat(prev.price) || 0,
                    initialStock: 10
                }
            ]
        }));
    };

    const handleRemoveVariantRow = (index) => {
        if (formData.variants.length <= 1) {
            notify.error("Product must have at least one variant.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, idx) => idx !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const basePrice = parseFloat(formData.price) || 0;
        const discountPriceVal = formData.discountPrice ? parseFloat(formData.discountPrice) : null;

        if (discountPriceVal !== null && discountPriceVal >= basePrice) {
            notify.error("Discount price must be less than regular selling price.");
            return;
        }

        const primaryImage = formData.imageUrls[0] || formData.imageUrl || "";

        let formattedVariants = [];
        if (formData.hasMultipleVariants) {
            formattedVariants = formData.variants.map(v => ({
                variantName: v.variantName || "Standard",
                sku: v.sku || "",
                price: parseFloat(v.price) || basePrice,
                initialStock: parseInt(v.initialStock) || 0,
                attributes: []
            }));
        } else {
            formattedVariants = [
                {
                    variantName: "Standard",
                    sku: "",
                    price: basePrice,
                    initialStock: parseInt(formData.initialStock) || 0,
                    attributes: []
                }
            ];
        }

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            categoryId: parseInt(formData.categoryId) || 1,
            brandId: parseInt(formData.brandId) || 1,
            price: basePrice,
            discountPrice: discountPriceVal,
            imageUrl: primaryImage,
            imageUrls: formData.imageUrls,
            stock: totalVariantStock,
            status: formData.status,
            variants: formattedVariants
        };

        onSubmit(payload);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        {isUpdate ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className={styles.modalBody}>
                        
                        {/* Product Name */}
                        <div className={styles.formGroup}>
                            <label>Product Name *</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.inputField}
                                placeholder="Enter product name (e.g., iPhone 15 Pro Max)"
                            />
                        </div>

                        {/* Category & Brand Selection Grid */}
                        <div className={styles.gridTwoCols}>
                            <div className={styles.formGroup}>
                                <label>Category *</label>
                                <select
                                    required
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className={styles.selectField}
                                    disabled={isLoadingMeta}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId || cat.id} value={cat.categoryId || cat.id}>
                                            {cat.type || cat.name || `Category ${cat.categoryId || cat.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Brand *</label>
                                <select
                                    required
                                    name="brandId"
                                    value={formData.brandId}
                                    onChange={handleChange}
                                    className={styles.selectField}
                                    disabled={isLoadingMeta}
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map(b => (
                                        <option key={b.brandId || b.id} value={b.brandId || b.id}>
                                            {b.name || `Brand ${b.brandId || b.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles.textareaField}
                                placeholder="Describe features, specifications, or warranty details..."
                            />
                        </div>

                        {/* Pricing & Sales Section */}
                        <div className={styles.variantSection}>
                            <h3 className={styles.variantTitle}>Pricing & Sales Information</h3>
                            
                            <div className={styles.gridTwoCols}>
                                <div className={styles.formGroup}>
                                    <label>Regular Price (VND) *</label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="1000"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        placeholder="100000"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Discount Price (VND)</label>
                                    <input
                                        type="number"
                                        name="discountPrice"
                                        min="0"
                                        step="1000"
                                        value={formData.discountPrice}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        placeholder="Optional promotional price"
                                    />
                                    {discountPercent > 0 && (
                                        <span className={styles.discountBadge}>
                                            <Percent size={12} /> {discountPercent}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Product Variants Toggle */}
                            <div className={styles.variantSectionHeader} style={{ marginTop: '8px' }}>
                                <label className={styles.variantToggleLabel}>
                                    <input
                                        type="checkbox"
                                        name="hasMultipleVariants"
                                        checked={formData.hasMultipleVariants}
                                        onChange={handleChange}
                                    />
                                    <Layers size={16} /> Product has multiple variants (Size, Color, SKU...)
                                </label>
                            </div>

                            {/* Single Stock vs Multi-Variants */}
                            {!formData.hasMultipleVariants ? (
                                <div className={styles.formGroup}>
                                    <label>{isUpdate ? "Total Stock *" : "Initial Stock *"}</label>
                                    <input
                                        required
                                        type="number"
                                        name="initialStock"
                                        min="0"
                                        value={formData.initialStock}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                    />
                                </div>
                            ) : (
                                <div className={styles.variantListContainer}>
                                    <div className={styles.variantCardHeader} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px', padding: '0 8px' }}>
                                        <span>Variant Name</span>
                                        <span>SKU</span>
                                        <span>Price (VND)</span>
                                        <span>Stock</span>
                                        <span></span>
                                    </div>

                                    {formData.variants.map((v, idx) => (
                                        <div key={idx} className={styles.variantCard}>
                                            <input
                                                type="text"
                                                placeholder="e.g. Size M / Red"
                                                value={v.variantName}
                                                onChange={(e) => handleVariantChange(idx, "variantName", e.target.value)}
                                                className={styles.inputField}
                                            />
                                            <input
                                                type="text"
                                                placeholder="SKU-123"
                                                value={v.sku}
                                                onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                                                className={styles.inputField}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Price"
                                                value={v.price}
                                                onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                                                className={styles.inputField}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Stock"
                                                value={v.initialStock}
                                                onChange={(e) => handleVariantChange(idx, "initialStock", e.target.value)}
                                                className={styles.inputField}
                                            />
                                            <button
                                                type="button"
                                                className={styles.removeVariantBtn}
                                                onClick={() => handleRemoveVariantRow(idx)}
                                                title="Remove variant"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                        <button
                                            type="button"
                                            className={styles.addVariantBtn}
                                            onClick={handleAddVariantRow}
                                        >
                                            <Plus size={16} /> Add Variant Option
                                        </button>

                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                                            Total Combined Stock: <strong>{totalVariantStock}</strong>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status for update */}
                        {isUpdate && (
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange}
                                    className={styles.selectField}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="OUT_OF_STOCK">Out of Stock</option>
                                </select>
                            </div>
                        )}

                        {/* Cloudinary Multiple Image Uploader */}
                        <div className={styles.formGroup}>
                            <CloudinaryImageUploader
                                images={formData.imageUrls}
                                onChange={handleImagesChange}
                                maxImages={10}
                            />
                        </div>

                    </div>

                    <div className={styles.modalFooter}>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose} 
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            isLoading={isSubmitting}
                            icon={<Save size={18} />}
                        >
                            Save Product
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
