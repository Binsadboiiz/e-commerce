import styles from "./SortBar.module.css";
import { useLanguage } from "@/shared/context/LanguageContext";

export default function SortBar({ searchParams, setSearchParams }) {
    const { t } = useLanguage();

    const currentSort = searchParams.get("sortBy") || "";

    const handleSort = (sortValue) => {
        const params = new URLSearchParams(searchParams);

        if (sortValue === currentSort) {
            params.delete("sortBy");
        } else {
            params.set("sortBy", sortValue);
        }

        setSearchParams(params);
    };

    return (
        <div className={styles.sortBar}>
            <span className={styles.label}>{t('product.sort')}</span>

            <button
                className={currentSort === "" ? styles.active : ""}
                onClick={() => handleSort("")}
            >
                {t('product.sortNewest')}
            </button>

            <button
                className={currentSort === "price_asc" ? styles.active : ""}
                onClick={() => handleSort("price_asc")}
            >
                {t('product.sortPriceAsc')}
            </button>

            <button
                className={currentSort === "price_desc" ? styles.active : ""}
                onClick={() => handleSort("price_desc")}
            >
                {t('product.sortPriceDesc')}
            </button>

            <button
                className={currentSort === "rating" ? styles.active : ""}
                onClick={() => handleSort("rating")}
            >
                {t('product.sortTopSell')}
            </button>
        </div>
    );
}