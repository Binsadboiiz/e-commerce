import { useEffect, useState } from "react";
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
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >
            <section className={styles.section}>
                <h3>Bank Information</h3>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Bank Name <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>
                        <input
                            type="text"
                            value={form.bankName}
                            onChange={(e) =>
                                handleChange("bankName", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Branch</label>
                        <input
                            type="text"
                            value={form.branch}
                            onChange={(e) =>
                                handleChange("branch", e.target.value)
                            }
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Account Number <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>
                        <input
                            type="text"
                            value={form.accountNumber}
                            onChange={(e) =>
                                handleChange("accountNumber", e.target.value)
                            }
                            pattern="[a-zA-Z0-9]{8,20}"
                            title="Account number must contain 8 to 20 alphanumeric characters."
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Account Holder Name <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>
                        <input
                            type="text"
                            value={form.accountName}
                            onChange={(e) =>
                                handleChange("accountName", e.target.value)
                            }
                            required
                        />
                    </div>
                </div>
            </section>

            <div className={styles.actions}>
                <button
                    type="submit"
                    className={styles.primaryButton}
                >
                    Continue
                </button>
            </div>
        </form>
    );
}