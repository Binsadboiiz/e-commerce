import styles from "./filters.module.css";
import { useLanguage } from "@/shared/context/LanguageContext";

export default function PriceFilter({ searchParams, setSearchParams }) {
    const { t } = useLanguage();

    const handlePriceChange = (type, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (value) {
            newParams.set(type, value);
        } else {
            newParams.delete(type);
        }

        setSearchParams(newParams);
    }

    return (
        <div className={styles.section}>
            <span className={styles.label}>{t('product.priceRange')}</span>

            <div className={styles.priceInputsContainer}>
                <input
                    type="number"
                    placeholder={t('product.minPricePlaceholder') || "$ Min"}
                    className={styles.priceInput}
                    value={searchParams.get("minPrice") || ""}
                    onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                />
                <span className={styles.priceSeparator}>-</span>
                <input
                    type="number"
                    placeholder={t('product.maxPricePlaceholder') || "$ Max"}
                    className={styles.priceInput}
                    value={searchParams.get("maxPrice") || ""}
                    onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                />
            </div>
        </div>
    );
}