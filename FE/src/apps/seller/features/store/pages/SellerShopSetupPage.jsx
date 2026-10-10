import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sellerStoreApi } from "../api/sellerStoreApi";
import SEOHead from "@/shared/components/SEOHead";
import { notify } from "@/shared/utils/Notify";
import { ROUTES } from "@/config/route.config";
import { useLanguage } from "@/shared/context/LanguageContext";
import styles from "./SellerShopSetupPage.module.css";

/**
 * SellerShopSetupPage Component
 * Dedicated first-time onboarding page for approved sellers to initialize their shop name,
 * shop description, contact details, and warehouse address before entering the Seller Dashboard.
 */
export function SellerShopSetupPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        streetAddress: "",
    });

    useEffect(() => {
        const checkStatus = async () => {
            try {
                setLoading(true);
                const res = await sellerStoreApi.getShopStatus();
                const data = res?.data || res || {};

                if (data.hasShop) {
                    // Redirect to seller dashboard if store is already initialized
                    navigate(ROUTES.SELLER_DASHBOARD, { replace: true });
                    return;
                }

                // Initialize form: address & phone prefilled from registration, shop name left blank for customer
                setFormData({
                    name: "",
                    description: "",
                    phone: data.suggestedPhone || "",
                    city: data.suggestedCity || "",
                    district: data.suggestedDistrict || "",
                    ward: data.suggestedWard || "",
                    streetAddress: data.suggestedStreetAddress || "",
                });
            } catch (err) {
                console.error("Failed to fetch shop status:", err);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            notify.error(t("sellerShopSetup.enterShopNameNotify"));
            return;
        }

        try {
            setSubmitting(true);
            await sellerStoreApi.setupShop({
                name: formData.name.trim(),
                description: formData.description ? formData.description.trim() : "",
                phone: formData.phone.trim(),
                city: formData.city.trim(),
                district: formData.district.trim(),
                ward: formData.ward.trim(),
                streetAddress: formData.streetAddress.trim(),
            });

            notify.success(t("sellerShopSetup.successNotify"));
            
            setTimeout(() => {
                navigate(ROUTES.SELLER_DASHBOARD, { replace: true });
            }, 1000);
        } catch (err) {
            console.error("Setup shop error:", err);
            const msg = err?.response?.data?.message || err?.message || t("sellerShopSetup.errorNotify");
            notify.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner} />
                    <span>{t("sellerShopSetup.checkingStatus")}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <SEOHead
                title={`${t("sellerShopSetup.title")} | Seller Portal`}
                description={t("sellerShopSetup.subtitle")}
                robots="noindex, nofollow"
            />

            {/* Hero Header Section Reused from Seller Onboarding */}
            <div className={styles.heroSection}>
                <h1 className={styles.title}>{t("sellerShopSetup.title")}</h1>
                <p className={styles.subtitle}>
                    {t("sellerShopSetup.subtitle")}
                </p>
            </div>

            {/* Form Main Section */}
            <form onSubmit={handleSubmit} className={styles.formCard}>
                {/* Section 1: Store Information */}
                <div className={styles.sectionBlock}>
                    <h2 className={styles.sectionTitle}>
                        {t("sellerShopSetup.sectionStore")}
                    </h2>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerShopSetup.shopName")} <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.inputField}
                            placeholder={t("sellerShopSetup.shopNamePlaceholder")}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerShopSetup.description")}
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className={styles.textareaField}
                            placeholder={t("sellerShopSetup.descriptionPlaceholder")}
                        />
                    </div>
                </div>

                {/* Section 2: Warehouse Pickup Address */}
                <div className={styles.sectionBlock}>
                    <h2 className={styles.sectionTitle}>
                        {t("sellerShopSetup.sectionWarehouse")}
                    </h2>

                    <div className={styles.gridTwoCols}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                {t("sellerShopSetup.phone")} <span className={styles.requiredStar}>*</span>
                            </label>
                            <input
                                required
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.inputField}
                                placeholder="0988888888"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                {t("sellerShopSetup.city")} <span className={styles.requiredStar}>*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={styles.inputField}
                                placeholder="Hồ Chí Minh"
                            />
                        </div>
                    </div>

                    <div className={styles.gridTwoCols}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                {t("sellerShopSetup.district")} <span className={styles.requiredStar}>*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className={styles.inputField}
                                placeholder="Quận 1"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                {t("sellerShopSetup.ward")} <span className={styles.requiredStar}>*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                className={styles.inputField}
                                placeholder="Phường Bến Nghé"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {t("sellerShopSetup.streetAddress")} <span className={styles.requiredStar}>*</span>
                        </label>
                        <input
                            required
                            type="text"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            className={styles.inputField}
                            placeholder="123 Nguyễn Huệ"
                        />
                    </div>
                </div>

                {/* Submit Actions */}
                <div className={styles.footerActions}>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={styles.submitBtn}
                    >
                        {submitting ? t("sellerShopSetup.submitting") : t("sellerShopSetup.submitBtn")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SellerShopSetupPage;
