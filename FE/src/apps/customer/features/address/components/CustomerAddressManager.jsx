import { useState, useEffect } from "react";
import { Plus, MapPin, Edit3, Trash2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import customerAddressApi from "../api/customerAddressApi";
import AddressModal from "./AddressModal";
import { notify } from "@/shared/utils/Notify";
import styles from "./CustomerAddressManager.module.css";

const MAX_ADDRESSES = 5;

export default function CustomerAddressManager() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const res = await customerAddressApi.getAddresses();
            const list = res?.data?.data || res?.data || [];
            setAddresses(list);
        } catch (err) {
            console.error("Failed to load customer addresses:", err);
            notify.error("Không thể tải danh sách địa chỉ nhận hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    const handleOpenAddModal = () => {
        if (addresses.length >= MAX_ADDRESSES) {
            notify.error(`Bạn chỉ có thể lưu tối đa ${MAX_ADDRESSES} địa chỉ nhận hàng.`);
            return;
        }
        setSelectedAddress(null);
        setModalOpen(true);
    };

    const handleOpenEditModal = (addr) => {
        setSelectedAddress(addr);
        setModalOpen(true);
    };

    const handleSetDefault = async (id) => {
        try {
            setActionLoadingId(id);
            await customerAddressApi.setDefaultAddress(id);
            notify.success("Đã đặt làm địa chỉ mặc định!");
            await loadAddresses();
        } catch (err) {
            console.error("Set default address error:", err);
            notify.error("Không thể thay đổi địa chỉ mặc định.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
            return;
        }

        try {
            setActionLoadingId(id);
            await customerAddressApi.deleteAddress(id);
            notify.success("Xóa địa chỉ thành công!");
            await loadAddresses();
        } catch (err) {
            console.error("Delete address error:", err);
            notify.error("Không thể xóa địa chỉ.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const isLimitReached = addresses.length >= MAX_ADDRESSES;

    return (
        <div className={styles.container}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.titleArea}>
                    <h3 className={styles.heading}>Địa chỉ nhận hàng</h3>
                    <span
                        className={`${styles.badgeCount} ${
                            isLimitReached ? styles.badgeLimitReached : ""
                        }`}
                    >
                        {addresses.length}/{MAX_ADDRESSES} địa chỉ
                    </span>
                </div>

                <button
                    type="button"
                    className={styles.btnAdd}
                    onClick={handleOpenAddModal}
                    disabled={isLimitReached || loading}
                    title={isLimitReached ? "Đã đạt tối đa 5 địa chỉ" : "Thêm địa chỉ mới"}
                >
                    <Plus size={18} />
                    <span>Thêm địa chỉ mới</span>
                </button>
            </div>

            {/* Limit Warning when 5 addresses reached */}
            {isLimitReached && (
                <div className={styles.limitWarning}>
                    <AlertCircle size={18} />
                    <span>
                        Bạn đã lưu tối đa <strong>{MAX_ADDRESSES} địa chỉ</strong>. Vui lòng xóa bớt địa chỉ không dùng nếu muốn thêm địa chỉ mới.
                    </span>
                </div>
            )}

            {/* Address List */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
            ) : addresses.length === 0 ? (
                <div className={styles.emptyState}>
                    <MapPin size={48} className={styles.emptyIcon} />
                    <h4 className={styles.emptyTitle}>Chưa có địa chỉ nhận hàng</h4>
                    <p className={styles.emptyDesc}>
                        Thêm địa chỉ nhận hàng để việc đặt hàng và giao nhận diễn ra nhanh chóng hơn.
                    </p>
                    <button
                        type="button"
                        className={styles.btnAdd}
                        onClick={handleOpenAddModal}
                    >
                        <Plus size={18} />
                        <span>Thêm địa chỉ đầu tiên</span>
                    </button>
                </div>
            ) : (
                <div className={styles.addressList}>
                    {addresses.map((addr) => {
                        const isProcessing = actionLoadingId === addr.id;

                        return (
                            <div
                                key={addr.id}
                                className={`${styles.card} ${
                                    addr.isDefault ? styles.cardDefault : ""
                                }`}
                            >
                                <div className={styles.infoSection}>
                                    <div className={styles.nameRow}>
                                        <span className={styles.fullName}>{addr.fullName}</span>
                                        <span className={styles.divider}>|</span>
                                        <span className={styles.phone}>{addr.phoneNumber}</span>

                                        {addr.isDefault && (
                                            <span className={styles.defaultBadge}>
                                                <CheckCircle2 size={13} />
                                                Mặc định
                                            </span>
                                        )}
                                    </div>

                                    <p className={styles.addressText}>
                                        {addr.fullAddress ||
                                            `${addr.streetAddress}, ${addr.ward || ""}, ${
                                                addr.district || ""
                                            }, ${addr.city}`}
                                    </p>
                                </div>

                                <div className={styles.actionsSection}>
                                    {!addr.isDefault && (
                                        <button
                                            type="button"
                                            className={`${styles.btnAction} ${styles.btnSetDefault}`}
                                            onClick={() => handleSetDefault(addr.id)}
                                            disabled={isProcessing}
                                        >
                                            Thiết lập mặc định
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className={styles.btnAction}
                                        onClick={() => handleOpenEditModal(addr)}
                                        disabled={isProcessing}
                                        title="Chỉnh sửa địa chỉ"
                                    >
                                        <Edit3 size={15} />
                                        <span>Cập nhật</span>
                                    </button>

                                    <button
                                        type="button"
                                        className={`${styles.btnAction} ${styles.btnActionDanger}`}
                                        onClick={() => handleDelete(addr.id)}
                                        disabled={isProcessing}
                                        title="Xóa địa chỉ"
                                    >
                                        <Trash2 size={15} />
                                        <span>Xóa</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Add / Edit */}
            <AddressModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialAddress={selectedAddress}
                onSuccess={loadAddresses}
            />
        </div>
    );
}
