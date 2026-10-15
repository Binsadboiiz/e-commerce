import { useState, useMemo } from "react";
import { Search, Plus, Package, SlidersHorizontal, Edit2, Trash2 } from "lucide-react";
import useSellerProducts from "../hooks/useSellerProducts";
import { sellerProductApi } from "../api/sellerProductApi";
import ProductFormModal from "../components/ProductFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SEOHead from "@/shared/components/SEOHead";
import { notify } from "@/shared/utils/Notify";
import {
    SellerPageHeader,
    SellerButton,
    SellerBadge,
    SellerCard,
    SellerInput,
    SellerSelect,
    SellerTable,
    SellerEmptyState,
    SellerPagination
} from "@/apps/seller/components/common";
import styles from "./SellerProducts.module.css";

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
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

const TABLE_HEADERS = [
    "",
    "Product Name",
    "Category",
    "Price",
    "Stock",
    "Sold",
    "Status",
    "Created At",
    "Actions"
];

export default function SellerProducts() {
    // Filter states
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const pageSize = 20;

    // API params
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

    const handleOpenUpdate = async (product) => {
        if (product.status === "DELETED") return;
        try {
            const res = await sellerProductApi.getProductById(product.id || product.productId);
            const fullProduct = res?.data || res;
            setSelectedProduct(fullProduct);
            setIsFormModalOpen(true);
        } catch (err) {
            console.error("Failed to load product details:", err);
            setSelectedProduct(product);
            setIsFormModalOpen(true);
        }
    };

    const handleOpenDelete = (product) => {
        if (product.status === "DELETED") return;
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            if (selectedProduct) {
                const targetId = selectedProduct.productId || selectedProduct.id;
                await sellerProductApi.updateProduct(targetId, data);
                notify.success("Product updated successfully!");
            } else {
                await sellerProductApi.createProduct(data);
                notify.success("Product created successfully!");
            }
            setIsFormModalOpen(false);
            refetch();
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

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearchInput("");
        setSearch("");
        setStatus("all");
        setSortBy("newest");
        setPage(1);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(dateStr));
    };

    const renderStatusBadge = (productStatus) => {
        switch (productStatus) {
            case "ACTIVE":
                return <SellerBadge variant="success">Active</SellerBadge>;
            case "INACTIVE":
                return <SellerBadge variant="warning">Inactive</SellerBadge>;
            case "OUT_OF_STOCK":
                return <SellerBadge variant="danger">Out of Stock</SellerBadge>;
            case "DELETED":
                return <SellerBadge variant="neutral">Deleted</SellerBadge>;
            default:
                return <SellerBadge variant="neutral">{productStatus || "Unknown"}</SellerBadge>;
        }
    };

    return (
        <div className="seller-page-container">
            <SEOHead
                title="Product Management - Seller Center"
                robots="noindex, nofollow"
                description="Dashboard for managing product listings, inventory, and pricing for sellers."
            />

            {/* Standard Page Header */}
            <SellerPageHeader
                title="My Products"
                subtitle="Manage all products in your store"
                count={pagination.total > 0 ? pagination.total : null}
                actions={
                    <SellerButton
                        id="btn-add-product"
                        icon={<Plus size={18} />}
                        onClick={handleOpenCreate}
                    >
                        Add Product
                    </SellerButton>
                }
            />

            {/* Filter Bar */}
            <SellerCard className={styles.filterCard}>
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <SellerInput
                        id="input-search-products"
                        icon={<Search size={16} />}
                        placeholder="Search products by name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </form>

                <div className={styles.filterActions}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <SlidersHorizontal size={16} color="var(--seller-text-muted)" />
                        <SellerSelect
                            id="select-filter-status"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            options={STATUS_OPTIONS}
                        />
                    </div>

                    <SellerSelect
                        id="select-sort-products"
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setPage(1);
                        }}
                        options={SORT_OPTIONS}
                    />
                </div>
            </SellerCard>

            {/* Table */}
            <SellerTable
                headers={TABLE_HEADERS}
                emptyState={
                    !loading && products.length === 0 ? (
                        <SellerEmptyState
                            title="No products found"
                            description={
                                search || status !== "all"
                                    ? "No products matched your search criteria."
                                    : "Start adding products to your store to start selling."
                            }
                            action={
                                search || status !== "all" ? (
                                    <SellerButton variant="outline" size="sm" onClick={handleClearFilters}>
                                        Clear Filters
                                    </SellerButton>
                                ) : (
                                    <SellerButton size="sm" icon={<Plus size={16} />} onClick={handleOpenCreate}>
                                        Add First Product
                                    </SellerButton>
                                )
                            }
                        />
                    ) : null
                }
                footer={
                    <SellerPagination
                        page={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                }
            >
                {loading ? (
                    <tr>
                        <td colSpan={9} style={{ padding: "40px 16px", textAlign: "center" }}>
                            <div className="seller-flex-center" style={{ gap: "10px" }}>
                                <span className="seller-spinner" />
                                <span style={{ color: "var(--seller-text-secondary)", fontSize: "14px" }}>
                                    Loading products...
                                </span>
                            </div>
                        </td>
                    </tr>
                ) : (
                    products.map((product) => (
                        <tr
                            key={product.id}
                            className={product.status === "DELETED" ? styles.rowDeleted : ""}
                        >
                            <td className={styles.cellImage}>
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className={styles.productThumbnail}
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
                            <td>{product.categoryName || "—"}</td>
                            <td>
                                {product.discountPrice ? (
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span className={styles.priceOriginal}>
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className={styles.priceFinal}>
                                            {formatPrice(product.discountPrice)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className={styles.priceFinal}>
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </td>
                            <td>
                                <span className={product.stock <= 5 ? styles.stockLow : ""}>
                                    {product.stock}
                                </span>
                            </td>
                            <td>{product.soldCount || 0}</td>
                            <td>{renderStatusBadge(product.status)}</td>
                            <td>{formatDate(product.createdAt)}</td>
                            <td>
                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <button
                                        type="button"
                                        className="seller-icon-btn"
                                        onClick={() => handleOpenUpdate(product)}
                                        disabled={product.status === "DELETED"}
                                        title="Edit Product"
                                    >
                                        <Edit2 size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        className="seller-icon-btn seller-icon-btn-danger"
                                        onClick={() => handleOpenDelete(product)}
                                        disabled={product.status === "DELETED"}
                                        title="Delete Product"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </SellerTable>

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
