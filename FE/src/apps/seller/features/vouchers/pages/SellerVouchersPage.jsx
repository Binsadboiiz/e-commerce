import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Plus, Tag, ChevronLeft, ChevronRight, Edit2, Trash2, Calendar, ShoppingBag, Eye, EyeOff } from "lucide-react";
import axiosClient from "@/shared/features/auth/api/axiosClient.js";
import { sellerVoucherApi } from "../api/sellerVoucherApi.js";
import { notify } from "@/shared/utils/Notify.js";
import Button from "@/shared/components/ui/Button.jsx";
import SEOHead from "@/shared/components/SEOHead.jsx";
import "./SellerVouchersPage.css";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
});

export default function SellerVouchersPage() {
    const [vouchers, setVouchers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percent",
        value: 10,
        maxDiscount: "",
        minOrderValue: "",
        expiredAt: "",
        voucherType: "AllItems",
        categoryId: "",
        usageLimit: ""
    });

    const [formErrors, setFormErrors] = useState({});

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const res = await axiosClient.get("/categories");
            setCategories(res?.data || []);
        } catch (err) {
            console.error("Failed to load categories", err);
        } finally {
            setCategoriesLoading(false);
        }
    };

    // Fetch vouchers
    const fetchVouchers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await sellerVoucherApi.getMyVouchers({
                page,
                pageSize,
                search: search || undefined
            });
            const data = res?.data;
            setVouchers(data?.items || []);
            setTotal(data?.total || 0);
        } catch (err) {
            const message = err?.message || "Failed to load vouchers";
            notify.error(message);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Search handler
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    // Form inputs change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Open create modal
    const handleOpenCreate = () => {
        setFormData({
            code: "",
            discountType: "percent",
            value: 10,
            maxDiscount: "",
            minOrderValue: "",
            expiredAt: "",
            voucherType: "AllItems",
            categoryId: "",
            usageLimit: ""
        });
        setFormErrors({});
        setModalMode("create");
        setSelectedVoucherId(null);
        setIsModalOpen(true);
    };

    // Open edit modal
    const handleOpenEdit = (voucher) => {
        setFormData({
            code: voucher.code,
            discountType: voucher.discountType.toLowerCase(),
            value: voucher.value,
            maxDiscount: voucher.maxDiscount || "",
            minOrderValue: voucher.minOrderValue || "",
            expiredAt: voucher.expiredAt ? voucher.expiredAt.substring(0, 16) : "",
            voucherType: voucher.voucherType,
            categoryId: voucher.categoryId || "",
            usageLimit: voucher.usageLimit || ""
        });
        setFormErrors({});
        setModalMode("edit");
        setSelectedVoucherId(voucher.id);
        setIsModalOpen(true);
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (modalMode === "create") {
            if (!formData.code.trim()) {
                errors.code = "Voucher code is required.";
            } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.code)) {
                errors.code = "Code can only contain alphanumeric characters, underscores, or hyphens.";
            }
        }

        if (!formData.value || formData.value <= 0) {
            errors.value = "Discount value must be greater than 0.";
        } else if (formData.discountType === "percent" && formData.value > 100) {
            errors.value = "Percentage discount cannot exceed 100%.";
        }

        if (formData.voucherType === "Category" && !formData.categoryId) {
            errors.categoryId = "Please select a product category.";
        }

        if (formData.usageLimit && formData.usageLimit <= 0) {
            errors.usageLimit = "Usage limit must be greater than 0.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setSubmitLoading(true);
            const payload = {
                discountType: formData.discountType,
                value: parseFloat(formData.value),
                maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
                minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
                expiredAt: formData.expiredAt ? new Date(formData.expiredAt).toISOString() : null,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
            };

            if (modalMode === "create") {
                payload.code = formData.code.trim().toUpperCase();
                payload.voucherType = formData.voucherType;
                if (formData.voucherType === "Category") {
                    payload.categoryId = parseInt(formData.categoryId);
                }
                await sellerVoucherApi.createVoucher(payload);
                notify.success("Voucher created successfully!");
            } else {
                await sellerVoucherApi.updateVoucher(selectedVoucherId, payload);
                notify.success("Voucher updated successfully!");
            }

            setIsModalOpen(false);
            fetchVouchers();
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "An error occurred";
            notify.error(message);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Toggle Voucher Active/Inactive
    const handleToggleActive = async (voucher) => {
        try {
            const payload = {
                discountType: voucher.discountType,
                value: voucher.value,
                maxDiscount: voucher.maxDiscount,
                minOrderValue: voucher.minOrderValue,
                expiredAt: voucher.expiredAt,
                usageLimit: voucher.usageLimit,
                isActive: !voucher.isActive
            };
            await sellerVoucherApi.updateVoucher(voucher.id, payload);
            notify.success(`Voucher ${voucher.isActive ? "deactivated" : "activated"} successfully!`);
            fetchVouchers();
        } catch (err) {
            notify.error(err?.message || "Failed to toggle status");
        }
    };

    // Delete Voucher
    const handleDeleteVoucher = async (id) => {
        if (!window.confirm("Are you sure you want to delete/deactivate this voucher? If it has orders, it will be deactivated instead.")) {
            return;
        }

        try {
            await sellerVoucherApi.deleteVoucher(id);
            notify.success("Voucher deleted or deactivated successfully!");
            fetchVouchers();
        } catch (err) {
            notify.error(err?.message || "Failed to delete voucher");
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="seller-vouchers-container">
            <SEOHead 
                title="Quản Lý Mã Giảm Giá - Kênh Người Bán" 
                robots="noindex, nofollow" 
                description="Tạo và quản lý các chương trình khuyến mãi, voucher giảm giá cho shop."
            />
            <header className="vouchers-header">
                <div>
                    <h1 className="vouchers-title">Voucher Management</h1>
                    <p className="vouchers-subtitle">Create and manage discounts to boost your shop sales</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
                    Create Voucher
                </Button>
            </header>

            {/* Filter and search */}
            <div className="vouchers-filter-bar">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by code..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="search-input"
                    />
                    <Button type="submit" variant="secondary">Search</Button>
                </form>
            </div>

            {/* Voucher list */}
            <div className="vouchers-list-card">
                {loading ? (
                    <div className="vouchers-loading">
                        <div className="spinner" />
                        <p>Loading vouchers...</p>
                    </div>
                ) : vouchers.length === 0 ? (
                    <div className="vouchers-empty">
                        <Tag size={48} className="empty-icon" />
                        <h3>No Vouchers Found</h3>
                        <p>Start creating vouchers to attract more customers!</p>
                        <button className="create-first-btn" onClick={handleOpenCreate}>
                            Create your first voucher
                        </button>
                    </div>
                ) : (
                    <div className="vouchers-table-wrapper">
                        <table className="vouchers-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Type</th>
                                    <th>Discount</th>
                                    <th>Min Order</th>
                                    <th>Usage</th>
                                    <th>Expiration</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vouchers.map(voucher => {
                                    const isExpired = voucher.expiredAt && new Date(voucher.expiredAt) < new Date();
                                    return (
                                        <tr key={voucher.id}>
                                            <td>
                                                <span className="voucher-code-badge">{voucher.code}</span>
                                            </td>
                                            <td>
                                                <div className="voucher-type-cell">
                                                    <span className={`v-type-badge ${voucher.voucherType.toLowerCase()}`}>
                                                        {voucher.voucherType === "AllItems" ? "All Items" : voucher.voucherType}
                                                    </span>
                                                    {voucher.voucherType === "Category" && voucher.categoryName && (
                                                        <span className="v-category-name">
                                                            {voucher.categoryName}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="discount-value-text">
                                                    {voucher.discountType.toLowerCase() === "percent"
                                                        ? `${voucher.value}%`
                                                        : currencyFormatter.format(voucher.value)}
                                                </span>
                                                {voucher.maxDiscount && (
                                                    <div className="discount-cap">
                                                        Max: {currencyFormatter.format(voucher.maxDiscount)}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {voucher.minOrderValue 
                                                    ? currencyFormatter.format(voucher.minOrderValue) 
                                                    : "None"}
                                            </td>
                                            <td>
                                                <div className="usage-cell">
                                                    <span className="usage-count">{voucher.usageCount}</span>
                                                    {voucher.usageLimit ? (
                                                        <span className="usage-limit"> / {voucher.usageLimit}</span>
                                                    ) : (
                                                        <span className="usage-limit"> / ∞</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                {voucher.expiredAt ? (
                                                    <span className={`exp-date ${isExpired ? "expired" : ""}`}>
                                                        {new Date(voucher.expiredAt).toLocaleDateString("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                        {isExpired && " (Expired)"}
                                                    </span>
                                                ) : (
                                                    <span className="exp-date">Never Expires</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleActive(voucher)}
                                                    className={`status-toggle-btn ${voucher.isActive ? "active" : "inactive"}`}
                                                    title={voucher.isActive ? "Deactivate Voucher" : "Activate Voucher"}
                                                >
                                                    {voucher.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                                    <span>{voucher.isActive ? "Active" : "Inactive"}</span>
                                                </button>
                                            </td>
                                            <td className="text-right actions-cell">
                                                <button 
                                                    className="action-btn edit-btn" 
                                                    onClick={() => handleOpenEdit(voucher)}
                                                    title="Edit Voucher"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className="action-btn delete-btn" 
                                                    onClick={() => handleDeleteVoucher(voucher.id)}
                                                    title="Delete Voucher"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="vouchers-pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            className="pagination-arrow"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="pagination-info">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            className="pagination-arrow"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content-card">
                        <div className="modal-header">
                            <h2>{modalMode === "create" ? "Create New Voucher" : "Edit Voucher"}</h2>
                            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="voucher-form">
                            <div className="form-grid">
                                {/* Code - Readonly in Edit Mode */}
                                <div className="form-field full-width">
                                    <label htmlFor="code">Voucher Code <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        id="code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        placeholder="e.g. SUMMER50, VIPMALL"
                                        disabled={modalMode === "edit"}
                                        className={formErrors.code ? "error" : ""}
                                    />
                                    {formErrors.code && <span className="field-error-msg">{formErrors.code}</span>}
                                    <small className="help-text">Alphanumeric, underscores, hyphens. Uppercase will be auto-applied.</small>
                                </div>

                                {/* Voucher Type - Readonly in Edit Mode */}
                                <div className="form-field">
                                    <label htmlFor="voucherType">Voucher Type</label>
                                    <select
                                        id="voucherType"
                                        name="voucherType"
                                        value={formData.voucherType}
                                        onChange={handleInputChange}
                                        disabled={modalMode === "edit"}
                                    >
                                        <option value="AllItems">All Items (Product discount)</option>
                                        <option value="Shipping">Shipping Fee (Shipping discount)</option>
                                        <option value="Category">Specific Category (Category discount)</option>
                                    </select>
                                </div>

                                {/* Category Selection - Show only if Type is Category */}
                                {formData.voucherType === "Category" && (
                                    <div className="form-field">
                                        <label htmlFor="categoryId">Product Category <span className="req">*</span></label>
                                        <select
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            disabled={modalMode === "edit"}
                                            className={formErrors.categoryId ? "error" : ""}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.categoryId} value={c.categoryId}>
                                                    {c.type}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.categoryId && <span className="field-error-msg">{formErrors.categoryId}</span>}
                                    </div>
                                )}

                                {/* Discount Type */}
                                <div className="form-field">
                                    <label htmlFor="discountType">Discount Type</label>
                                    <select
                                        id="discountType"
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="percent">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (VND)</option>
                                    </select>
                                </div>

                                {/* Discount Value */}
                                <div className="form-field">
                                    <label htmlFor="value">Discount Value <span className="req">*</span></label>
                                    <input
                                        type="number"
                                        id="value"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        step="any"
                                        min="0.01"
                                        className={formErrors.value ? "error" : ""}
                                    />
                                    {formErrors.value && <span className="field-error-msg">{formErrors.value}</span>}
                                </div>

                                {/* Max Discount */}
                                <div className="form-field">
                                    <label htmlFor="maxDiscount">Max Discount Cap (VND)</label>
                                    <input
                                        type="number"
                                        id="maxDiscount"
                                        name="maxDiscount"
                                        value={formData.maxDiscount}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 50000"
                                    />
                                    <small className="help-text">Leave blank for no discount cap.</small>
                                </div>

                                {/* Minimum Order Value */}
                                <div className="form-field">
                                    <label htmlFor="minOrderValue">Min Order Value (VND)</label>
                                    <input
                                        type="number"
                                        id="minOrderValue"
                                        name="minOrderValue"
                                        value={formData.minOrderValue}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 150000"
                                    />
                                    <small className="help-text">Leave blank for no minimum order condition.</small>
                                </div>

                                {/* Usage Limit */}
                                <div className="form-field">
                                    <label htmlFor="usageLimit">Total Usage Limit</label>
                                    <input
                                        type="number"
                                        id="usageLimit"
                                        name="usageLimit"
                                        value={formData.usageLimit}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 100"
                                        className={formErrors.usageLimit ? "error" : ""}
                                    />
                                    {formErrors.usageLimit && <span className="field-error-msg">{formErrors.usageLimit}</span>}
                                    <small className="help-text">Leave blank for unlimited usage.</small>
                                </div>

                                {/* Expiration Date */}
                                <div className="form-field">
                                    <label htmlFor="expiredAt">Expiration Date</label>
                                    <input
                                        type="datetime-local"
                                        id="expiredAt"
                                        name="expiredAt"
                                        value={formData.expiredAt}
                                        onChange={handleInputChange}
                                    />
                                    <small className="help-text">Leave blank for no expiration date.</small>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={submitLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={submitLoading}
                                >
                                    Save Voucher
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
