import { useEffect, useState } from "react";
import styles from "./SellerBusinessForm.module.css";

const defaultForm = {
    companyName: "",
    taxCode: "",
    businessLicenseNumber: "",
    representativeName: "",
    businessAddress: ""
};

export default function SellerBusinessForm({
    initialValues,
    onSubmit
}) {
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
                <h3>Business Information</h3>

                <div className={styles.formGroup}>
                    <label>Company Name</label>
                    <input
                        type="text"
                        placeholder="Enter company name"
                        value={form.companyName}
                        onChange={(e) =>
                            handleChange("companyName", e.target.value)
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Tax Code</label>
                    <input
                        type="text"
                        placeholder="Enter tax code"
                        value={form.taxCode}
                        onChange={(e) =>
                            handleChange("taxCode", e.target.value)
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Business Registration Number</label>
                    <input
                        type="text"
                        placeholder="Business registration number"
                        value={form.businessLicenseNumber}
                        onChange={(e) =>
                            handleChange(
                                "businessLicenseNumber",
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Representative Name</label>
                    <input
                        type="text"
                        placeholder="Legal representative"
                        value={form.representativeName}
                        onChange={(e) =>
                            handleChange(
                                "representativeName",
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Business Address</label>

                    <textarea
                        rows={4}
                        placeholder="Business address"
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