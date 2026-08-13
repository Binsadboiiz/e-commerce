import { useState } from "react";
import { X, Save, Image as ImageIcon } from "lucide-react";
import styles from "./ProductFormModal.module.css";

const getInitialFormData = (data) => ({
    name: data?.name || "",
    description: data?.description || "",
    categoryId: data?.categoryId || 1,
    brandId: data?.brandId || 1,
    imageUrl: data?.imageUrl || "",
    status: data?.status || "active",
    price: data?.price || 0,
    initialStock: data?.stock || 0
});

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
    const isUpdate = !!initialData;

    const [prevInitialData, setPrevInitialData] = useState(initialData);
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    const [formData, setFormData] = useState(() => getInitialFormData(initialData));

    // Reset/sync form state when modal opens or initialData changes
    if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
        setPrevIsOpen(isOpen);
        setPrevInitialData(initialData);
        if (isOpen) {
            setFormData(getInitialFormData(initialData));
        }
    }

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isUpdate) {
            onSubmit({
                name: formData.name,
                description: formData.description,
                categoryId: parseInt(formData.categoryId) || 1,
                brandId: parseInt(formData.brandId) || 1,
                imageUrl: formData.imageUrl,
                status: formData.status,
                price: parseFloat(formData.price) || 0,
                stock: parseInt(formData.initialStock) || 0
            });
        } else {
            onSubmit({
                name: formData.name,
                description: formData.description,
                categoryId: parseInt(formData.categoryId) || 1,
                brandId: parseInt(formData.brandId) || 1,
                imageUrl: formData.imageUrl,
                variants: [
                    {
                        price: parseFloat(formData.price) || 0,
                        initialStock: parseInt(formData.initialStock) || 0,
                        attributes: []
                    }
                ]
            });
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        {isUpdate ? "Update Product" : "Add New Product"}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className={styles.modalBody}>
                        
                        <div className={styles.formGroup}>
                            <label>Product Name *</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.inputField}
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles.textareaField}
                                placeholder="Enter product description"
                            />
                        </div>

                            <div className={styles.variantSection}>
                                <h3 className={styles.variantTitle}>Sales Information</h3>
                                <div className={styles.variantRow}>
                                    <div className={styles.formGroup}>
                                        <label>Selling Price (VND) *</label>
                                        <input
                                            required
                                            type="number"
                                            name="price"
                                            min="0"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className={styles.inputField}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{isUpdate ? "Stock *" : "Initial Stock *"}</label>
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
                                </div>
                            </div>

                        {isUpdate && (
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange}
                                    className={styles.selectField}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>Product Image (URL)</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className={styles.inputField}
                                placeholder="https://example.com/image.jpg"
                            />
                            
                            <div className={styles.imagePreviewContainer}>
                                {formData.imageUrl ? (
                                    <img 
                                        src={formData.imageUrl} 
                                        alt="Preview" 
                                        className={styles.imagePreview} 
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onLoad={(e) => {
                                            e.target.style.display = 'block';
                                            if(e.target.nextSibling) e.target.nextSibling.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <>
                                        <ImageIcon size={32} color="#9ca3af" />
                                        <span className={styles.noImageText}>No image available</span>
                                    </>
                                )}
                                <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center' }}>
                                    <ImageIcon size={32} color="#ef4444" />
                                    <span className={styles.noImageText} style={{color: '#ef4444'}}>Invalid URL or broken image</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                            <Save size={18} />
                            {isSubmitting ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
