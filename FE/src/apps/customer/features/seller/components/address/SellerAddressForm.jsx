import { useEffect, useState } from "react";
import { FiUser, FiMapPin, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerAddressForm.module.css";

const defaultForm = {
    fullName: "",
    phoneNumber: "",
    city: "",
    district: "",
    ward: "",
    streetAddress: "",
    postalCode: ""
};

export default function SellerAddressForm({
    initialValues,
    onSubmit
}) {
    const { t } = useLanguage();
    const [form, setForm] = useState(defaultForm);

    useEffect(() => {
        if (initialValues) {
            setForm({
                ...defaultForm,
                ...initialValues
            });
        }
    }, [initialValues]);

    function handleChange(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(form);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* Section 1: Contact Person */}
            <section className={styles.section}>
                <div className={styles.sectionTitleRow}>
                    <h3>{t("sellerAddress.contactTitle")}</h3>
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerAddress.fullName")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={form.fullName}
                            placeholder={t("sellerAddress.fullNamePlaceholder")}
                            onChange={(e) =>
                                handleChange("fullName", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerAddress.phone")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="tel"
                            className={styles.input}
                            value={form.phoneNumber}
                            placeholder={t("sellerAddress.phonePlaceholder")}
                            onChange={(e) =>
                                handleChange("phoneNumber", e.target.value)
                            }
                            pattern="[0-9]{9,11}"
                            title={t("sellerAddress.phoneTitle")}
                            required
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Warehouse Address */}
            <section className={styles.section}>
                <div className={styles.sectionTitleRow}>
                    <h3>{t("sellerAddress.warehouseTitle")}</h3>
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerAddress.city")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={form.city}
                            placeholder={t("sellerAddress.city")}
                            onChange={(e) =>
                                handleChange("city", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerAddress.district")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={form.district}
                            placeholder={t("sellerAddress.district")}
                            onChange={(e) =>
                                handleChange("district", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerAddress.ward")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={form.ward}
                            placeholder={t("sellerAddress.ward")}
                            onChange={(e) =>
                                handleChange("ward", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t("sellerAddress.postalCode")}</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={form.postalCode}
                            placeholder={t("sellerAddress.postalCodePlaceholder")}
                            onChange={(e) =>
                                handleChange("postalCode", e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        {t("sellerAddress.streetAddress")} <span className={styles.required}>*</span>
                    </label>
                    <textarea
                        rows={3}
                        className={styles.textarea}
                        value={form.streetAddress}
                        placeholder={t("sellerAddress.streetAddressPlaceholder")}
                        onChange={(e) =>
                            handleChange("streetAddress", e.target.value)
                        }
                        required
                    />
                </div>
            </section>

            <div className={styles.actions}>
                <button
                    type="submit"
                    className={styles.primaryButton}
                >
                    <span>{t("common.next")}</span>
                </button>
            </div>
        </form>
    );
}