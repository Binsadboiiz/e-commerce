import { useState, useEffect, useMemo } from "react";
import { Save, Plus, Trash2, Layers, Percent, Tag } from "lucide-react";
import CloudinaryImageUploader from "./CloudinaryImageUploader";
import { sellerProductApi } from "../api/sellerProductApi";
import { notify } from "@/shared/utils/Notify";
import {
    SellerModal,
    SellerButton,
    SellerBadge,
    SellerFormField,
    SellerInput,
    SellerSelect,
    SellerTextarea
} from "@/apps/seller/components/common";
import styles from "./ProductFormModal.module.css";

const getInitialFormData = (data) => {
    let imagesList = [];
    if (data?.imageUrls && Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        imagesList = [...data.imageUrls];
    } else if (data?.imageUrl) {
        imagesList = [data.imageUrl];
    } else if (data?.images && Array.isArray(data.images) && data.images.length > 0) {
        imagesList = data.images.map(img => img.imageUrl || img).filter(Boolean);
    }

    if (Array.isArray(data?.variants)) {
        data.variants.forEach(v => {
            if (v.imageUrl && !imagesList.includes(v.imageUrl)) {
                imagesList.push(v.imageUrl);
            }
        });
    }

    const hasVariants = !!(
        data?.hasVariants || 
        (data?.variants && Array.isArray(data.variants) && (
            data.variants.length > 1 || 
            (data.variants.length === 1 && data.variants[0].attributes?.length > 0)
        ))
    );

    // Reconstruct attribute groups from data.attributes or data.variants
    let initialAttributeGroups = [];
    if (data?.attributes && Array.isArray(data.attributes) && data.attributes.length > 0) {
        initialAttributeGroups = data.attributes.map(g => ({
            name: g.attributeName || "Option",
            values: (g.attributeValues || []).map(v => v.value).filter(Boolean)
        }));
    } else if (data?.variants && Array.isArray(data.variants)) {
        const groupMap = {};
        data.variants.forEach(v => {
            (v.attributes || []).forEach(a => {
                const name = a.attributeName || "Option";
                if (!groupMap[name]) groupMap[name] = new Set();
                if (a.value) groupMap[name].add(a.value);
            });
        });
        initialAttributeGroups = Object.entries(groupMap).map(([name, set]) => ({
            name,
            values: Array.from(set)
        }));
    }

    if (initialAttributeGroups.length === 0) {
        initialAttributeGroups = [
            { name: "Color", values: [] },
            { name: "Size", values: [] }
        ];
    }

    let initialVariants = [];
    if (hasVariants && data?.variants && Array.isArray(data.variants) && data.variants.length > 0) {
        initialVariants = data.variants.map(v => {
            const rawAttrs = v.attributes || [];
            const attrList = rawAttrs.map(a => ({
                attributeName: a.attributeName || a.name || "Option",
                value: a.value
            }));
            const label = attrList.length > 0
                ? attrList.map(a => a.value).join(" / ")
                : (v.variantName || v.name || "Standard");

            return {
                variantId: v.variantId || null,
                variantName: label,
                sku: v.sku || v.SKU || "",
                price: v.price || data?.price || 0,
                initialStock: v.stock !== undefined ? v.stock : (v.availableStock !== undefined ? v.availableStock : (v.initialStock || 0)),
                imageUrl: v.imageUrl || "",
                attributes: attrList
            };
        });
    } else {
        initialVariants = [
            {
                variantId: null,
                variantName: "Standard",
                sku: "",
                price: data?.price || 0,
                initialStock: data?.stock !== undefined ? data.stock : 0,
                imageUrl: "",
                attributes: []
            }
        ];
    }

    return {
        name: data?.name || "",
        description: data?.description || "",
        categoryId: data?.categoryId || "",
        brandId: data?.brandId || "",
        price: data?.price || 0,
        discountPrice: data?.discountPrice || "",
        imageUrl: imagesList[0] || "",
        imageUrls: imagesList,
        status: data?.status || "ACTIVE",
        initialStock: data?.stock || 0,
        hasMultipleVariants: hasVariants,
        attributeGroups: initialAttributeGroups,
        variants: initialVariants
    };
};

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
    const isUpdate = !!initialData;

    const [prevInitialData, setPrevInitialData] = useState(initialData);
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    const [formData, setFormData] = useState(() => getInitialFormData(initialData));

    // Tag input local state for each attribute group index
    const [tagInputs, setTagInputs] = useState({});

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
            setTagInputs({});
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

    // Detect duplicate SKUs in current variants list
    const duplicateSkus = useMemo(() => {
        const counts = {};
        const duplicates = new Set();
        formData.variants.forEach(v => {
            const trimmed = (v.sku || "").trim().toLowerCase();
            if (trimmed) {
                counts[trimmed] = (counts[trimmed] || 0) + 1;
                if (counts[trimmed] > 1) {
                    duplicates.add(trimmed);
                }
            }
        });
        return duplicates;
    }, [formData.variants]);

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

    // ── Attribute Groups Management ──
    const handleAddAttributeGroup = (defaultName = "") => {
        setFormData(prev => ({
            ...prev,
            attributeGroups: [
                ...prev.attributeGroups,
                { name: defaultName || `Attribute ${prev.attributeGroups.length + 1}`, values: [] }
            ]
        }));
    };

    const handleRemoveAttributeGroup = (index) => {
        setFormData(prev => ({
            ...prev,
            attributeGroups: prev.attributeGroups.filter((_, idx) => idx !== index)
        }));
    };

    const handleAttributeNameChange = (index, newName) => {
        setFormData(prev => {
            const updated = [...prev.attributeGroups];
            updated[index] = { ...updated[index], name: newName };
            return { ...prev, attributeGroups: updated };
        });
    };

    const handleAddTagValue = (groupIndex) => {
        const val = (tagInputs[groupIndex] || "").trim();
        if (!val) return;

        // Support comma separation
        const newValues = val.split(",").map(s => s.trim()).filter(Boolean);

        setFormData(prev => {
            const updated = [...prev.attributeGroups];
            const currentValues = updated[groupIndex].values;
            const combined = [...currentValues];
            newValues.forEach(v => {
                if (!combined.some(existing => existing.toLowerCase() === v.toLowerCase())) {
                    combined.push(v);
                }
            });
            updated[groupIndex] = { ...updated[groupIndex], values: combined };
            return { ...prev, attributeGroups: updated };
        });

        setTagInputs(prev => ({ ...prev, [groupIndex]: "" }));
    };

    const handleRemoveTagValue = (groupIndex, tagIndex) => {
        setFormData(prev => {
            const updated = [...prev.attributeGroups];
            updated[groupIndex] = {
                ...updated[groupIndex],
                values: updated[groupIndex].values.filter((_, idx) => idx !== tagIndex)
            };
            return { ...prev, attributeGroups: updated };
        });
    };

    // ── Cartesian Product Generator ──
    const handleGenerateVariants = () => {
        const activeGroups = formData.attributeGroups.filter(
            g => g.name.trim() && g.values && g.values.length > 0
        );

        if (activeGroups.length === 0) {
            notify.error("Please add at least one attribute with values (e.g. Color: Black, White).");
            return;
        }

        // Cartesian product
        const cartesian = (arrays) => {
            return arrays.reduce((acc, curr) => {
                return acc.flatMap(a => curr.values.map(v => [
                    ...a,
                    { attributeName: curr.name.trim(), value: v.trim() }
                ]));
            }, [[]]);
        };

        const combinations = cartesian(activeGroups);
        const basePrice = parseFloat(formData.price) || 0;
        const baseSku = (formData.name || "PROD")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 6) || "SKU";

        // Preserve previous user inputs if attribute combo matches
        const newVariants = combinations.map((combo, idx) => {
            const comboKey = combo.map(a => `${a.attributeName.toLowerCase()}:${a.value.toLowerCase()}`).sort().join("|");
            
            // Check if existing variant has this exact combination
            const existing = formData.variants.find(ev => {
                if (!ev.attributes || ev.attributes.length === 0) return false;
                const evKey = ev.attributes.map(a => `${(a.attributeName || a.name || "").toLowerCase()}:${a.value.toLowerCase()}`).sort().join("|");
                return evKey === comboKey;
            });

            if (existing) {
                return {
                    ...existing,
                    attributes: combo,
                    variantName: combo.map(a => a.value).join(" / ")
                };
            }

            // Generate clean SKU: e.g. NIKE-BLK-M
            const attrParts = combo.map(a => a.value.slice(0, 3).toUpperCase()).join("-");
            const generatedSku = `${baseSku}-${attrParts}`;

            return {
                variantId: null,
                variantName: combo.map(a => a.value).join(" / "),
                sku: generatedSku,
                price: basePrice,
                initialStock: 10,
                imageUrl: "",
                attributes: combo
            };
        });

        setFormData(prev => ({
            ...prev,
            variants: newVariants
        }));

        notify.success(`Generated ${newVariants.length} variant combinations!`);
    };

    // ── Variant Rows Management ──
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
                    variantId: null,
                    variantName: `Variant ${prev.variants.length + 1}`,
                    sku: "",
                    price: parseFloat(prev.price) || 0,
                    initialStock: 10,
                    imageUrl: "",
                    attributes: []
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

        if (formData.hasMultipleVariants) {
            if (!formData.variants || formData.variants.length === 0) {
                notify.error("Please add or generate at least one variant.");
                return;
            }

            if (duplicateSkus.size > 0) {
                notify.error(`Duplicate SKU detected: '${Array.from(duplicateSkus).join(", ")}'. SKUs must be unique.`);
                return;
            }

            for (let i = 0; i < formData.variants.length; i++) {
                const v = formData.variants[i];
                if ((parseFloat(v.price) || 0) <= 0) {
                    notify.error(`Variant #${i + 1} price must be greater than 0.`);
                    return;
                }
                if ((parseInt(v.initialStock) || 0) < 0) {
                    notify.error(`Variant #${i + 1} stock cannot be negative.`);
                    return;
                }
            }
        }

        const primaryImage = formData.imageUrls[0] || formData.imageUrl || "";

        let formattedVariants = [];
        if (formData.hasMultipleVariants) {
            formattedVariants = formData.variants.map(v => ({
                variantId: v.variantId || null,
                variantName: v.variantName || (v.attributes?.length > 0 ? v.attributes.map(a => a.value).join(" / ") : "Standard"),
                sku: v.sku?.trim() || "",
                price: parseFloat(v.price) || basePrice,
                initialStock: parseInt(v.initialStock) || 0,
                imageUrl: v.imageUrl || "",
                attributes: (v.attributes || []).map(a => ({
                    attributeName: a.attributeName || a.name || "Option",
                    value: a.value
                }))
            }));
        } else {
            formattedVariants = [
                {
                    variantId: formData.variants[0]?.variantId || null,
                    variantName: "Standard",
                    sku: "",
                    price: basePrice,
                    initialStock: parseInt(formData.initialStock) || 0,
                    imageUrl: "",
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
        <SellerModal
            isOpen={isOpen}
            onClose={onClose}
            title={isUpdate ? "Edit Product" : "Add New Product"}
            maxWidth="880px"
            footer={
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", width: "100%" }}>
                    <SellerButton
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </SellerButton>
                    <SellerButton
                        type="submit"
                        form="product-form-modal"
                        variant="primary"
                        loading={isSubmitting}
                        icon={<Save size={16} />}
                    >
                        {isUpdate ? "Save Changes" : "Save Product"}
                    </SellerButton>
                </div>
            }
        >
            <form id="product-form-modal" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                <div className={styles.modalBody} style={{ padding: 0 }}>
                        
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
                                placeholder="Enter product name (e.g., Nike Sportswear Club Fleece Hoodie)"
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
                                    <Layers size={16} /> Product has multiple variants (Color, Size, Material...)
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    
                                    {/* 1. Attribute Groups Builder */}
                                    <div className={styles.attributeBuilderSection}>
                                        <div className={styles.attrBuilderHeader}>
                                            <span className={styles.attrBuilderTitle}>
                                                <Tag size={16} color="#2563eb" /> Variant Attributes (Phân loại hàng)
                                            </span>
                                            <div className={styles.quickAddBar}>
                                                <SellerButton
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAddAttributeGroup("Color")}
                                                >
                                                    + Color
                                                </SellerButton>
                                                <SellerButton
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAddAttributeGroup("Size")}
                                                >
                                                    + Size
                                                </SellerButton>
                                                <SellerButton
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAddAttributeGroup("")}
                                                >
                                                    + Custom
                                                </SellerButton>
                                            </div>
                                        </div>

                                        {formData.attributeGroups.map((group, gIdx) => (
                                            <div key={gIdx} className={styles.attrGroupCard}>
                                                <div className={styles.attrGroupHeader}>
                                                    <input
                                                        type="text"
                                                        value={group.name}
                                                        onChange={(e) => handleAttributeNameChange(gIdx, e.target.value)}
                                                        className={styles.attrNameInput}
                                                        placeholder="e.g. Color, Size"
                                                    />
                                                    <button
                                                        type="button"
                                                        className={styles.removeVariantBtn}
                                                        onClick={() => handleRemoveAttributeGroup(gIdx)}
                                                        title="Remove attribute group"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className={styles.tagContainer}>
                                                    {group.values.map((val, valIdx) => (
                                                        <span key={valIdx} className={styles.tagChip}>
                                                            {val}
                                                            <button
                                                                type="button"
                                                                className={styles.tagRemoveBtn}
                                                                onClick={() => handleRemoveTagValue(gIdx, valIdx)}
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <input
                                                        type="text"
                                                        placeholder="Add value (press Enter)..."
                                                        value={tagInputs[gIdx] || ""}
                                                        onChange={(e) => setTagInputs(prev => ({ ...prev, [gIdx]: e.target.value }))}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                handleAddTagValue(gIdx);
                                                            }
                                                        }}
                                                        className={styles.tagInput}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={styles.quickAddBtn}
                                                        onClick={() => handleAddTagValue(gIdx)}
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <SellerButton
                                            type="button"
                                            variant="primary"
                                            onClick={handleGenerateVariants}
                                            style={{ alignSelf: "flex-start" }}
                                        >
                                            Generate Variants Matrix
                                        </SellerButton>
                                    </div>

                                    {/* 2. Variants Table */}
                                    <div className={styles.variantListContainer}>
                                        <div className={styles.variantCardHeader} style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr 0.9fr 1.4fr auto', gap: '10px', padding: '0 8px' }}>
                                            <span>Variant Attributes</span>
                                            <span>SKU</span>
                                            <span>Price (VND)</span>
                                            <span>Stock</span>
                                            <span>Variant Image</span>
                                            <span></span>
                                        </div>

                                        {formData.variants.map((v, idx) => {
                                            const isDuplicateSku = v.sku && duplicateSkus.has(v.sku.trim().toLowerCase());

                                            return (
                                                <div key={idx} className={styles.variantCard} style={{ gridTemplateColumns: '2fr 1.3fr 1fr 0.9fr 1.4fr auto' }}>
                                                    {/* Variant Attributes info */}
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                                                        {v.attributes && v.attributes.length > 0 ? (
                                                            v.attributes.map((attr, aIdx) => (
                                                                <span key={aIdx} className={styles.attrBadge}>
                                                                    <strong>{attr.attributeName}:</strong> {attr.value}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Size M / Red"
                                                                value={v.variantName}
                                                                onChange={(e) => handleVariantChange(idx, "variantName", e.target.value)}
                                                                className={styles.inputField}
                                                                style={{ fontSize: '13px', padding: '6px 8px' }}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* SKU */}
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="SKU-123"
                                                            value={v.sku}
                                                            onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                                                            className={`${styles.inputField} ${isDuplicateSku ? styles.skuInputError : ""}`}
                                                            style={{ fontSize: '13px', padding: '6px 8px' }}
                                                            title={isDuplicateSku ? "Duplicate SKU detected" : ""}
                                                        />
                                                    </div>

                                                    {/* Price */}
                                                    <div>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Price"
                                                            value={v.price}
                                                            onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                                                            className={styles.inputField}
                                                            style={{ fontSize: '13px', padding: '6px 8px' }}
                                                        />
                                                    </div>

                                                    {/* Stock */}
                                                    <div>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Stock"
                                                            value={v.initialStock}
                                                            onChange={(e) => handleVariantChange(idx, "initialStock", e.target.value)}
                                                            className={styles.inputField}
                                                            style={{ fontSize: '13px', padding: '6px 8px' }}
                                                        />
                                                    </div>

                                                    {/* Variant Image */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                                        {v.imageUrl && (
                                                            <img
                                                                src={v.imageUrl}
                                                                alt="preview"
                                                                style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                                                            />
                                                        )}
                                                        <select
                                                            value={v.imageUrl || ""}
                                                            onChange={(e) => handleVariantChange(idx, "imageUrl", e.target.value)}
                                                            className={styles.selectField}
                                                            style={{ fontSize: '12px', padding: '6px 8px', width: '100%' }}
                                                        >
                                                            <option value="">Auto / None</option>
                                                            {formData.imageUrls?.map((url, imgIdx) => (
                                                                <option key={imgIdx} value={url}>
                                                                    {imgIdx === 0 ? "Main (Primary)" : `Image ${imgIdx + 1}`}
                                                                </option>
                                                            ))}
                                                            {v.imageUrl && !formData.imageUrls?.includes(v.imageUrl) && (
                                                                <option value={v.imageUrl}>Assigned Image</option>
                                                            )}
                                                        </select>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        type="button"
                                                        className={styles.removeVariantBtn}
                                                        onClick={() => handleRemoveVariantRow(idx)}
                                                        title="Remove variant"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                            <button
                                                type="button"
                                                className={styles.addVariantBtn}
                                                onClick={handleAddVariantRow}
                                            >
                                                <Plus size={16} /> Add Variant Option
                                            </button>

                                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                                                Total Variants: <strong>{formData.variants.length}</strong> | Total Combined Stock: <strong>{totalVariantStock}</strong>
                                            </span>
                                        </div>
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
                </form>
            </SellerModal>
        );
    }
