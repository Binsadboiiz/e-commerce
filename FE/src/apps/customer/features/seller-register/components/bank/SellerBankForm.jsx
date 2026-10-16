import { useEffect, useState } from "react";
import { FiCreditCard, FiShield, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerBankForm.module.css";

const defaultValue = {
    bankName: "",
    accountNumber: "",
    accountName: "",
    branch: ""
};

export default function SellerBankForm({
    initialValues,
    onSubmit
}) {
    const { t } = useLanguage();
    const [form, setForm] = useState(defaultValue);

    useEffect(() => {
        if (initialValues) {
            setForm({
                ...defaultValue,
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
                    <h3>{t("sellerBank.title")}</h3>
                </div>

                <div className={styles.securityBox}>
                    <FiShield className={styles.securityIcon} size={18} />
                    <span>
                        {t("sellerBank.securityText")}
                    </span>
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerBank.bankName")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t("sellerBank.bankNamePlaceholder")}
                            value={form.bankName}
                            onChange={(e) =>
                                handleChange("bankName", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t("sellerBank.branch")}</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t("sellerBank.branchPlaceholder")}
                            value={form.branch}
                            onChange={(e) =>
                                handleChange("branch", e.target.value)
                            }
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerBank.accountNumber")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t("sellerBank.accountNumberPlaceholder")}
                            value={form.accountNumber}
                            onChange={(e) =>
                                handleChange("accountNumber", e.target.value)
                            }
                            pattern="[a-zA-Z0-9]{8,20}"
                            title={t("sellerBank.accountNumberTitle")}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerBank.accountName")} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={t("sellerBank.accountNamePlaceholder")}
                            value={form.accountName}
                            onChange={(e) =>
                                handleChange("accountName", e.target.value.toUpperCase())
                            }
                            required
                        />
                    </div>
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