import { useEffect, useState } from "react";
import { FiBriefcase, FiInfo, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerBusinessForm.module.css";

const defaultForm = {
    companyName: "",
    taxCode: "",
    businessLicenseNumber: "",
    representative: "",
    businessAddress: ""
};

export default function SellerBusinessForm({
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
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit?.(form);
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.section}>
                <div className={styles.sectionTitleRow}>
                    <h3>{t("sellerBusiness.title")}</h3>
                </div>

                <div className={styles.infoBox}>
                    <FiInfo className={styles.infoIcon} size={18} />
                    <span>
                        {t("sellerBusiness.infoText")}
                    </span>
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerBusiness.companyName")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t("sellerBusiness.companyNamePlaceholder")}
                            value={form.companyName}
                            onChange={(e) =>
                                handleChange("companyName", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerBusiness.taxCode")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t("sellerBusiness.taxCodePlaceholder")}
                            value={form.taxCode}
                            onChange={(e) =>
                                handleChange("taxCode", e.target.value)
                            }
                            pattern="[0-9]{10}|[0-9]{13}"
                            title={t("sellerBusiness.taxCodeTitle")}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerBusiness.businessLicenseNumber")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t("sellerBusiness.businessLicenseNumberPlaceholder")}
                            value={form.businessLicenseNumber}
                            onChange={(e) =>
                                handleChange(
                                    "businessLicenseNumber",
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerBusiness.representative")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t("sellerBusiness.representativePlaceholder")}
                            value={form.representative}
                            onChange={(e) =>
                                handleChange(
                                    "representative",
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{t("sellerBusiness.businessAddress")}</label>
                    <textarea
                        rows={3}
                        className={styles.textarea}
                        placeholder={t("sellerBusiness.businessAddressPlaceholder")}
                        value={form.businessAddress}
                        onChange={(e) =>
                            handleChange(
                                "businessAddress",
                                e.target.value
                            )
                        }
                    />
                </div>
            </section>

            <div className={styles.actions}>
                <button type="submit" className={styles.primaryButton}>
                    <span>{t("common.next")}</span>
                </button>
            </div>
        </form>
    );
}