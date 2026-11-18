import { useState, useEffect, useCallback } from "react";
import { Plus, Tag, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import axiosClient from "@/shared/features/auth/api/axiosClient.js";
import { sellerVoucherApi } from "../api/sellerVoucherApi.js";
import { notify } from "@/shared/utils/Notify.js";
import SEOHead from "@/shared/components/SEOHead.jsx";
import SellerVouchersSkeleton from "../components/SellerVouchersSkeleton.jsx";
import {
    SellerPageHeader,
    SellerButton,
    SellerCard,
    SellerInput,
    SellerSelect,
    SellerFormField,
    SellerBadge,
    SellerPagination,
    SellerEmptyState,
    SellerModal
} from "@/apps/seller/components/common";
import "./SellerVouchersPage.css";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
});

export default function SellerVouchersPage() {
    const [vouchers, setVouchers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [, setCategoriesLoading] = useState(false);
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
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleOpenCreate = () => {
        setModalMode("create");
        setSelectedVoucherId(null);
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
        setIsModalOpen(true);
    };

    const handleOpenEdit = (voucher) => {
        setModalMode("edit");
        setSelectedVoucherId(voucher.id);
        
        let formattedExpiredAt = "";
        if (voucher.expiredAt) {
            const d = new Date(voucher.expiredAt);
            formattedExpiredAt = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
        }

        setFormData({
            code: voucher.code,
            discountType: voucher.discountType.toLowerCase(),
            value: voucher.value,
            maxDiscount: voucher.maxDiscount || "",
            minOrderValue: voucher.minOrderValue || "",
            expiredAt: formattedExpiredAt,
            voucherType: voucher.voucherType,
            categoryId: voucher.categoryId || "",
            usageLimit: voucher.usageLimit || ""
        });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const validateForm = () => {
        const errors = {};
        if (modalMode === "create") {
            if (!formData.code.trim()) {
                errors.code = "Voucher code is required";
            } else if (!/^[A-Za-z0-9_-]{3,20}$/.test(formData.code.trim())) {
                errors.code = "Code must be 3-20 characters long and contain only letters, numbers, hyphens or underscores";
            }
        }

        if (formData.voucherType === "Category" && !formData.categoryId) {
            errors.categoryId = "Category selection is required";
        }

        const numericValue = parseFloat(formData.value);
        if (isNaN(numericValue) || numericValue <= 0) {
            errors.value = "Discount value must be greater than 0";
        } else if (formData.discountType === "percent" && numericValue > 100) {
            errors.value = "Percentage discount cannot exceed 100%";
        }

        if (formData.usageLimit && parseInt(formData.usageLimit, 10) <= 0) {
            errors.usageLimit = "Usage limit must be at least 1";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        try {
            setSubmitLoading(true);
            const payload = {
                discountType: formData.discountType,
                value: parseFloat(formData.value),
                maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
                minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
                expiredAt: formData.expiredAt ? new Date(formData.expiredAt).toISOString() : null,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null
            };

            if (modalMode === "create") {
                payload.code = formData.code.trim().toUpperCase();
                payload.voucherType = formData.voucherType;
                payload.categoryId = formData.voucherType === "Category" ? parseInt(formData.categoryId, 10) : null;
                
                await sellerVoucherApi.createVoucher(payload);
                notify.success("Voucher created successfully!");
            } else {
                await sellerVoucherApi.updateVoucher(selectedVoucherId, payload);
                notify.success("Voucher updated successfully!");
            }

            setIsModalOpen(false);
            fetchVouchers();
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Failed to save voucher";
            notify.error(message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleToggleActive = async (voucher) => {
        try {
            await sellerVoucherApi.toggleVoucherActive(voucher.id);
            notify.success(`Voucher ${voucher.isActive ? "deactivated" : "activated"} successfully`);
            setVouchers(prev =>
                prev.map(v => (v.id === voucher.id ? { ...v, isActive: !v.isActive } : v))
            );
        } catch (err) {
            const message = err?.message || "Failed to toggle status";
            notify.error(message);
        }
    };

    const handleDeleteVoucher = async (voucherId) => {
        if (!window.confirm("Are you sure you want to delete this voucher?")) return;
        try {
            await sellerVoucherApi.deleteVoucher(voucherId);
            notify.success("Voucher deleted successfully");
            fetchVouchers();
        } catch (err) {
            const message = err?.message || "Failed to delete voucher";
            notify.error(message);
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="seller-page-container">
            <SEOHead 
                title="Quản Lý Mã Giảm Giá - Kênh Người Bán" 
                robots="noindex, nofollow" 
                description="Tạo và quản lý các chương trình khuyến mãi, voucher giảm giá cho shop."
            />
            
            <SellerPageHeader
                title="Voucher Management"
                subtitle="Create and manage discounts to boost your shop sales"
                count={total}
            >
                <SellerButton
                    variant="primary"
                    icon={Plus}
                    onClick={handleOpenCreate}
                >
                    Create Voucher
                </SellerButton>
            </SellerPageHeader>

            {/* Filter and search */}
            <div className="seller-filter-card">
                <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px", maxWidth: "500px", width: "100%" }}>
                    <div style={{ flex: 1 }}>
                        <SellerInput
                            search
                            placeholder="Search by code..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    <SellerButton type="submit" variant="secondary">
                        Search
                    </SellerButton>
                </form>
            </div>

            {/* Voucher list */}
            <div className="seller-card" style={{ padding: 0, overflow: "hidden" }}>
                {loading ? (
                    <SellerVouchersSkeleton />
                ) : vouchers.length === 0 ? (
                    <SellerEmptyState
                        icon={Tag}
                        title="No Vouchers Found"
                        description="Start creating vouchers to attract more customers!"
                        actionLabel="Create your first voucher"
                        onAction={handleOpenCreate}
                    />
                ) : (
                    <div className="seller-table-container" style={{ border: "none", borderRadius: 0 }}>
                        <table className="seller-table">
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
                                                    <SellerBadge variant="neutral" size="sm">
                                                        {voucher.voucherType === "AllItems" ? "All Items" : voucher.voucherType}
                                                    </SellerBadge>
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
                                                    <span className="usage-limit"> / {voucher.usageLimit || "∞"}</span>
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
                                                <SellerButton
                                                    size="sm"
                                                    variant={voucher.isActive ? "outline" : "ghost"}
                                                    icon={voucher.isActive ? Eye : EyeOff}
                                                    onClick={() => handleToggleActive(voucher)}
                                                    title={voucher.isActive ? "Deactivate Voucher" : "Activate Voucher"}
                                                >
                                                    {voucher.isActive ? "Active" : "Inactive"}
                                                </SellerButton>
                                            </td>
                                            <td className="text-right">
                                                <div style={{ display: "inline-flex", gap: "6px" }}>
                                                    <SellerButton
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={Edit2}
                                                        onClick={() => handleOpenEdit(voucher)}
                                                        title="Edit Voucher"
                                                    />
                                                    <SellerButton
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={Trash2}
                                                        onClick={() => handleDeleteVoucher(voucher.id)}
                                                        title="Delete Voucher"
                                                        style={{ color: "var(--seller-danger, #ef4444)" }}
                                                    />
                                                </div>
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
                    <SellerPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>

            {/* Create/Edit Modal with SellerModal */}
            <SellerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === "create" ? "Create New Voucher" : "Edit Voucher"}
                subtitle={modalMode === "edit" ? `Editing code: ${formData.code}` : "Configure discounts and eligibility"}
                size="lg"
                footer={
                    <>
                        <SellerButton
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            disabled={submitLoading}
                        >
                            Cancel
                        </SellerButton>
                        <SellerButton
                            variant="primary"
                            onClick={handleSubmit}
                            loading={submitLoading}
                        >
                            Save Voucher
                        </SellerButton>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        {/* Code - Readonly in Edit Mode */}
                        <div style={{ gridColumn: "1 / -1" }}>
                            <SellerFormField
                                label="Voucher Code"
                                required
                                error={formErrors.code}
                                helper="Alphanumeric, underscores, hyphens. Uppercase will be auto-applied."
                            >
                                <SellerInput
                                    id="code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    placeholder="e.g. SUMMER50, VIPMALL"
                                    disabled={modalMode === "edit"}
                                    error={Boolean(formErrors.code)}
                                />
                            </SellerFormField>
                        </div>

                        {/* Voucher Type */}
                        <SellerFormField label="Voucher Type">
                            <SellerSelect
                                id="voucherType"
                                name="voucherType"
                                value={formData.voucherType}
                                onChange={handleInputChange}
                                disabled={modalMode === "edit"}
                            >
                                <option value="AllItems">All Items (Product discount)</option>
                                <option value="Shipping">Shipping Fee (Shipping discount)</option>
                                <option value="Category">Specific Category (Category discount)</option>
                            </SellerSelect>
                        </SellerFormField>

                        {/* Category Selection */}
                        {formData.voucherType === "Category" && (
                            <SellerFormField label="Product Category" required error={formErrors.categoryId}>
                                <SellerSelect
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    disabled={modalMode === "edit"}
                                    error={Boolean(formErrors.categoryId)}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.categoryId} value={c.categoryId}>
                                            {c.type}
                                        </option>
                                    ))}
                                </SellerSelect>
                            </SellerFormField>
                        )}

                        {/* Discount Type */}
                        <SellerFormField label="Discount Type">
                            <SellerSelect
                                id="discountType"
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleInputChange}
                            >
                                <option value="percent">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (VND)</option>
                            </SellerSelect>
                        </SellerFormField>

                        {/* Discount Value */}
                        <SellerFormField label="Discount Value" required error={formErrors.value}>
                            <SellerInput
                                type="number"
                                id="value"
                                name="value"
                                value={formData.value}
                                onChange={handleInputChange}
                                step="any"
                                min="0.01"
                                error={Boolean(formErrors.value)}
                            />
                        </SellerFormField>

                        {/* Max Discount */}
                        <SellerFormField label="Max Discount Cap (VND)" helper="Leave blank for no discount cap.">
                            <SellerInput
                                type="number"
                                id="maxDiscount"
                                name="maxDiscount"
                                value={formData.maxDiscount}
                                onChange={handleInputChange}
                                placeholder="e.g. 50000"
                            />
                        </SellerFormField>

                        {/* Minimum Order Value */}
                        <SellerFormField label="Min Order Value (VND)" helper="Leave blank for no minimum order condition.">
                            <SellerInput
                                type="number"
                                id="minOrderValue"
                                name="minOrderValue"
                                value={formData.minOrderValue}
                                onChange={handleInputChange}
                                placeholder="e.g. 150000"
                            />
                        </SellerFormField>

                        {/* Usage Limit */}
                        <SellerFormField label="Total Usage Limit" error={formErrors.usageLimit} helper="Leave blank for unlimited usage.">
                            <SellerInput
                                type="number"
                                id="usageLimit"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleInputChange}
                                placeholder="e.g. 100"
                                error={Boolean(formErrors.usageLimit)}
                            />
                        </SellerFormField>

                        {/* Expiration Date */}
                        <SellerFormField label="Expiration Date" helper="Leave blank for no expiration date.">
                            <SellerInput
                                type="datetime-local"
                                id="expiredAt"
                                name="expiredAt"
                                value={formData.expiredAt}
                                onChange={handleInputChange}
                            />
                        </SellerFormField>
                    </div>
                </form>
            </SellerModal>
        </div>
    );
}
