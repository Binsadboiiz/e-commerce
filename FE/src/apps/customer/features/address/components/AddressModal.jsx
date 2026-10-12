import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import VietnamAddressSelector from "@/shared/components/address/VietnamAddressSelector";
import customerAddressApi from "../api/customerAddressApi";
import { notify } from "@/shared/utils/Notify";
import styles from "./AddressModal.module.css";

const defaultFormData = {
    fullName: "",
    phoneNumber: "",
    city: "",
    district: "",
    ward: "",
    streetAddress: "",
    isDefault: false
};

export default function AddressModal({
    isOpen,
    onClose,
    initialAddress = null,
    onSuccess
}) {
    const [formData, setFormData] = useState(defaultFormData);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialAddress) {
                setFormData({
                    fullName: initialAddress.fullName || "",
                    phoneNumber: initialAddress.phoneNumber || "",
                    city: initialAddress.city || "",
                    district: initialAddress.district || "",
                    ward: initialAddress.ward || "",
                    streetAddress: initialAddress.streetAddress || "",
                    isDefault: Boolean(initialAddress.isDefault)
                });
            } else {
                setFormData(defaultFormData);
            }
        }
    }, [isOpen, initialAddress]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName.trim()) {
            notify.error("Vui lòng nhập họ và tên người nhận.");
            return;
        }

        const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
        if (phoneDigits.length < 9 || phoneDigits.length > 11) {
            notify.error("Số điện thoại phải từ 9 đến 11 chữ số.");
            return;
        }

        if (!formData.city || !formData.district || !formData.ward) {
            notify.error("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã.");
            return;
        }

        if (!formData.streetAddress.trim()) {
            notify.error("Vui lòng nhập số nhà, tên đường chi tiết.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                fullName: formData.fullName.trim(),
                phoneNumber: phoneDigits,
                city: formData.city,
                district: formData.district,
                ward: formData.ward,
                streetAddress: formData.streetAddress.trim(),
                isDefault: formData.isDefault
            };

            let response;
            if (initialAddress?.id) {
                response = await customerAddressApi.updateAddress(initialAddress.id, payload);
                notify.success("Cập nhật địa chỉ thành công!");
            } else {
                response = await customerAddressApi.createAddress(payload);
                notify.success("Thêm địa chỉ mới thành công!");
            }

            if (onSuccess) {
                onSuccess(response?.data?.data || response?.data);
            }
            onClose();
        } catch (error) {
            console.error("Save address failed:", error);
            const msg = error?.response?.data?.message || error?.message || "Không thể lưu địa chỉ. Vui lòng thử lại.";
            notify.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {initialAddress ? "Cập nhật địa chỉ nhận hàng" : "Thêm địa chỉ nhận hàng mới"}
                    </h3>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        disabled={submitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Họ và tên người nhận <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
                                placeholder="Ví dụ: Nguyễn Văn A"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Số điện thoại <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="tel"
                                className={styles.input}
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                placeholder="Ví dụ: 0912345678"
                                required
                            />
                        </div>
                    </div>

                    {/* Vietnam Administrative Boundaries 3-level linked selector */}
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

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Địa chỉ chi tiết (Số nhà, tòa nhà, tên đường) <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.streetAddress}
                            onChange={(e) => handleChange("streetAddress", e.target.value)}
                            placeholder="Ví dụ: Số 123, đường Nguyễn Huệ"
                            required
                        />
                    </div>

                    <label className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={formData.isDefault}
                            onChange={(e) => handleChange("isDefault", e.target.checked)}
                        />
                        <span className={styles.checkboxLabel}>Đặt làm địa chỉ nhận hàng mặc định</span>
                    </label>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.btnCancel}
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className={styles.btnSubmit}
                            disabled={submitting}
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            <span>{initialAddress ? "Lưu thay đổi" : "Hoàn thành"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
