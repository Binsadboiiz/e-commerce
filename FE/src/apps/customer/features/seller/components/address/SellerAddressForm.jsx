import { useEffect, useState } from "react";
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
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >
            <section className={styles.section}>
                <h3>Contact Information</h3>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Full Name <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>

                        <input
                            type="text"
                            value={form.fullName}
                            placeholder="Enter your full name"
                            onChange={(e) =>
                                handleChange("fullName", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Phone Number <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>

                        <input
                            type="tel"
                            value={form.phoneNumber}
                            placeholder="Enter phone number"
                            onChange={(e) =>
                                handleChange("phoneNumber", e.target.value)
                            }
                            pattern="[0-9]{9,11}"
                            title="Phone number must contain 9 to 11 digits."
                            required
                        />
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h3>Address Information</h3>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>City / Province <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>

                        <input
                            type="text"
                            value={form.city}
                            placeholder="City"
                            onChange={(e) =>
                                handleChange("city", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>District <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>

                        <input
                            type="text"
                            value={form.district}
                            placeholder="District"
                            onChange={(e) =>
                                handleChange("district", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Ward <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>

                        <input
                            type="text"
                            value={form.ward}
                            placeholder="Ward"
                            onChange={(e) =>
                                handleChange("ward", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Postal Code</label>

                        <input
                            type="text"
                            value={form.postalCode}
                            placeholder="Postal code"
                            onChange={(e) =>
                                handleChange("postalCode", e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Street Address <span style={{ color: "#ff4d4f", marginLeft: "4px" }}>*</span></label>

                    <textarea
                        rows={4}
                        value={form.streetAddress}
                        placeholder="Street address"
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
                    Continue
                </button>
            </div>
        </form>
    );
}