import styles from "./filters.module.css";

export default function PriceFilter({ searchParams, setSearchParams }) {

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
        <div>
            <p className={styles.label}>Price</p>
            <input
                type="number"
                placeholder="Min"
                onChange={(e) =>
                    handlePriceChange("minPrice", e.target.value)
                }
            />
            <input
                type="number"
                placeholder="Max"
                onChange={(e) =>
                    handlePriceChange("maxPrice", e.target.value)
                }
            />
        </div>
    );
}