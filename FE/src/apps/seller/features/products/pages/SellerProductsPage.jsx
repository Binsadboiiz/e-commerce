import { useState, useMemo } from "react";
import { Search, Plus, Package, ChevronLeft, ChevronRight, SlidersHorizontal, Edit2, Trash2 } from "lucide-react";
import useSellerProducts from "../hooks/useSellerProducts";
import { sellerProductApi } from "../api/sellerProductApi";
import ProductFormModal from "../components/ProductFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SEOHead from "@/shared/components/SEOHead";
import styles from "./SellerProducts.module.css";
import { notify } from "@/shared/utils/Notify";

// Cấu hình filter options
const STATUS_OPTIONS = [
    { value: "all", label: "All" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "OUT_OF_STOCK", label: "Out of Stock" },
    { value: "DELETED", label: "Deleted" },
];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "sold", label: "Best Selling" },
    { value: "stock_asc", label: "Stock: Low → High" },
    { value: "stock_desc", label: "Stock: High → Low" },
    { value: "name_asc", label: "Name: A → Z" },
    { value: "name_desc", label: "Name: Z → A" },
];

export default function SellerProducts() {
    // Filter states
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const pageSize = 20;

    // API call params
    const params = useMemo(() => ({
        page,
        pageSize,
        search: search || undefined,
        status: status !== "all" ? status : undefined,
        sortBy: sortBy !== "newest" ? sortBy : undefined,
    }), [page, search, status, sortBy]);

    const { products, loading, error, pagination, refetch } = useSellerProducts(params);

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handlers
    const handleOpenCreate = () => {
        setSelectedProduct(null);
        setIsFormModalOpen(true);
    };

    const handleOpenUpdate = (product) => {
        if (product.status === "DELETED") return; // Prevent editing deleted items
        setSelectedProduct(product);
        setIsFormModalOpen(true);
    };

    const handleOpenDelete = (product) => {
        if (product.status === "DELETED") return; // Prevent deleting already deleted items
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            if (selectedProduct) {
                await sellerProductApi.updateProduct(selectedProduct.id, data);
                notify.success("Product updated successfully!");
            } else {
                await sellerProductApi.createProduct(data);
                notify.success("Product created successfully!");
            }
            setIsFormModalOpen(false);
            refetch(); // Refresh list
        } catch (err) {
            console.error("Error saving product:", err);
            const msg = err?.response?.data?.message || err?.message || "An error occurred, please try again.";
            notify.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;
        try {
            setIsSubmitting(true);
            await sellerProductApi.deleteProduct(selectedProduct.id);
            notify.success("Product deleted successfully!");
            setIsDeleteModalOpen(false);
            refetch();
        } catch (err) {
            console.error("Error deleting product:", err);
            const msg = err?.response?.data?.message || err?.message || "An error occurred while deleting.";
            notify.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Search submit
    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    // Filter change
    const handleStatusChange = (val) => {
        setStatus(val);
        setPage(1);
    };

    const handleSortChange = (val) => {
        setSortBy(val);
        setPage(1);
    };

    // Format tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Format ngày
    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(dateStr));
    };

    // Status badge
    const getStatusBadge = (productStatus) => {
        const map = {
            ACTIVE: { class: styles.badgeActive, label: "Active" },
            INACTIVE: { class: styles.badgeInactive, label: "Inactive" },
            DELETED: { class: styles.badgeDeleted, label: "Deleted" },
            OUT_OF_STOCK: { class: styles.badgeInactive, label: "Out of Stock" },
        };
        const info = map[productStatus] || map.ACTIVE;
        return <span className={`${styles.badge} ${info.class}`}>{info.label}</span>;
    };

    return (
        <div className={styles.container}>
            <SEOHead 
                title="Quản Lý Sản Phẩm - Kênh Người Bán" 
                robots="noindex, nofollow" 
                description="Bảng điều khiển quản lý danh sách sản phẩm, kho hàng và giá bán dành cho người bán."
            />
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>My Products</h1>
                    <p className={styles.pageSubtitle}>
                        Manage all products in your store
                        {pagination.total > 0 && (
                            <span className={styles.totalCount}>
                                &nbsp;· {pagination.total} products
                            </span>
                        )}
                    </p>
                </div>
                <button className={styles.addBtn} id="btn-add-product" onClick={handleOpenCreate}>
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                {/* Search */}
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        id="input-search-products"
                    />
                </form>

                {/* Filters */}
                <div className={styles.filters}>
                    <SlidersHorizontal size={16} className={styles.filterIcon} />

                    <select
                        className={styles.filterSelect}
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        id="select-filter-status"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <select
                        className={styles.filterSelect}
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        id="select-sort-products"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                {loading ? (
                    <div className={styles.loadingState}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles.skeletonRow}>
                                <div className={styles.skeletonCell} style={{ width: "48px", height: "48px", borderRadius: "8px" }} />
                                <div className={styles.skeletonCell} style={{ flex: 1 }} />
                                <div className={styles.skeletonCell} style={{ width: "80px" }} />
                                <div className={styles.skeletonCell} style={{ width: "100px" }} />
                                <div className={styles.skeletonCell} style={{ width: "60px" }} />
                                <div className={styles.skeletonCell} style={{ width: "70px" }} />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className={styles.errorState}>
                        <p>An error occurred: {error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Package size={48} strokeWidth={1} />
                        <h3>No products found</h3>
                        <p>Start adding products to your store</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.thImage}></th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Sold</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className={`${styles.row} ${product.status === "DELETED" ? styles.rowDeleted : ""}`}
                                >
                                    <td className={styles.cellImage}>
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className={styles.productImage}
                                            />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <Package size={20} strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </td>
                                    <td className={styles.cellName}>
                                        <span className={styles.productName}>{product.name}</span>
                                        {product.brandName && (
                                            <span className={styles.productBrand}>{product.brandName}</span>
                                        )}
                                    </td>
                                    <td className={styles.cellCategory}>
                                        {product.categoryName || "—"}
                                    </td>
                                    <td className={styles.cellPrice}>
                                        {product.discountPrice ? (
                                            <>
                                                <span className={styles.priceOriginal}>
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className={styles.priceFinal}>
                                                    {formatPrice(product.discountPrice)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className={styles.priceFinal}>
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </td>
                                    <td className={styles.cellStock}>
                                        <span className={product.stock <= 5 ? styles.stockLow : ""}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className={styles.cellSold}>
                                        {product.soldCount || 0}
                                    </td>
                                    <td className={styles.cellStatus}>
                                        {getStatusBadge(product.status)}
                                    </td>
                                    <td className={styles.cellDate}>
                                        {formatDate(product.createdAt)}
                                    </td>
                                    <td className={styles.cellActions}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <button 
                                                className={styles.actionBtn} 
                                                onClick={() => handleOpenUpdate(product)}
                                                disabled={product.status === "DELETED"}
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                onClick={() => handleOpenDelete(product)}
                                                disabled={product.status === "DELETED"}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>
                        Page {pagination.page} / {pagination.totalPages}
                    </span>

                    <div className={styles.pageButtons}>
                        <button
                            className={styles.pageBtn}
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            id="btn-prev-page"
                        >
                            <ChevronLeft size={16} />
                            Prev
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= pagination.totalPages - 2) {
                                pageNum = pagination.totalPages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`${styles.pageNumBtn} ${page === pageNum ? styles.pageNumActive : ""}`}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            className={styles.pageBtn}
                            disabled={page >= pagination.totalPages}
                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                            id="btn-next-page"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ProductFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedProduct}
                isSubmitting={isSubmitting}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                product={selectedProduct}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
