import { useState, useEffect } from "react";
import { MapPin, Save, Loader2 } from "lucide-react";
import { sellerStoreApi } from "../api/sellerStoreApi";
import VietnamAddressSelector from "@/shared/components/address/VietnamAddressSelector";
import SEOHead from "@/shared/components/SEOHead";
import { notify } from "@/shared/utils/Notify";
import styles from "./SellerWarehouseAddressPage.module.css";

const defaultAddress = {
    fullName: "",
    phoneNumber: "",
    city: "",
    district: "",
    ward: "",
    streetAddress: "",
    postalCode: "",
    isDefault: true
};

export default function SellerWarehouseAddressPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(defaultAddress);

    useEffect(() => {
        let isMounted = true;

        async function loadAddress() {
            try {
                setLoading(true);
                const res = await sellerStoreApi.getWarehouseAddress();
                const data = res?.data?.data || res?.data;

                if (isMounted && data) {
                    setFormData({
                        fullName: data.fullName || "",
                        phoneNumber: data.phoneNumber || "",
                        city: data.city || "",
                        district: data.district || "",
                        ward: data.ward || "",
                        streetAddress: data.streetAddress || "",
                        postalCode: data.postalCode || "",
                        isDefault: true
                    });
                }
            } catch (err) {
                console.error("Failed to load seller warehouse address:", err);
                notify.error("Không thể tải thông tin địa chỉ kho hàng.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadAddress();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName.trim()) {
            notify.error("Vui lòng nhập tên người phụ trách kho.");
            return;
        }

        const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
        if (phoneDigits.length < 9 || phoneDigits.length > 11) {
            notify.error("Số điện thoại kho hàng phải từ 9 đến 11 chữ số.");
            return;
        }

        if (!formData.city || !formData.district || !formData.ward) {
            notify.error("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã.");
            return;
        }

        if (!formData.streetAddress.trim()) {
            notify.error("Vui lòng nhập số nhà, tên đường chi tiết của kho.");
            return;
        }

        try {
            setSaving(true);
            await sellerStoreApi.updateWarehouseAddress({
                fullName: formData.fullName.trim(),
                phoneNumber: phoneDigits,
                city: formData.city,
                district: formData.district,
                ward: formData.ward,
                streetAddress: formData.streetAddress.trim(),
                postalCode: formData.postalCode ? formData.postalCode.trim() : "",
                isDefault: true
            });

            notify.success("Cập nhật địa chỉ kho hàng thành công!");
        } catch (err) {
            console.error("Failed to update seller warehouse address:", err);
            const msg = err?.response?.data?.message || err?.message || "Lỗi khi cập nhật địa chỉ.";
            notify.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.page}>
            <SEOHead 
                title="Địa chỉ kho hàng | Kênh người bán" 
                description="Quản lý địa chỉ kho hàng lấy hàng cho đơn vị vận chuyển."
            />

            <div className={styles.header}>
                <h1 className={styles.title}>Địa chỉ kho hàng & Lấy hàng</h1>
                <p className={styles.subtitle}>
                    Địa chỉ này được sử dụng để đơn vị vận chuyển đến nhận đơn hàng và làm địa chỉ hoàn hàng.
                </p>
            </div>

            <div className={styles.card}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                        <Loader2 size={32} className="animate-spin text-blue-500" />
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {/* Section 1: Contact */}
                        <div className={styles.sectionBlock}>
                            <h2 className={styles.sectionTitle}>Thông tin người phụ trách kho</h2>
                            <div className={styles.gridTwoCols}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Họ và tên người liên hệ <span className={styles.requiredStar}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        placeholder="Ví dụ: Nguyễn Văn Quản Kho"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Số điện thoại liên hệ <span className={styles.requiredStar}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        placeholder="0988888888"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Address with Vietnam Administrative Selector */}
                        <div className={styles.sectionBlock}>
                            <h2 className={styles.sectionTitle}>Địa chỉ kho hàng</h2>

                            <VietnamAddressSelector
                                city={formData.city}
                                district={formData.district}
                                ward={formData.ward}
                                onChange={({ city, district, ward }) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        city,
                                        district,
                                        ward
                                    }));
                                }}
                            />

                            <div className={styles.gridTwoCols} style={{ marginTop: "1rem" }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Số nhà, tên đường, tên kho <span className={styles.requiredStar}>*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        placeholder="Số 45, Đường Lê Duẩn, Kho A"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Mã bưu chính (Postal Code)</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className={styles.inputField}
                                        placeholder="700000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={saving}
                            >
                                {saving ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
