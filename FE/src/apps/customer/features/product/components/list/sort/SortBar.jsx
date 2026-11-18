import styles from "./SortBar.module.css";


export default function SortBar({ searchParams, setSearchParams }) {

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
            <span className={styles.label}>Sort by:</span>

            <button
                className={currentSort === "" ? styles.active : ""}
                onClick={() => handleSort("")}
            >
                Newest
            </button>

            <button
                className={currentSort === "price_asc" ? styles.active : ""}
                onClick={() => handleSort("price_asc")}
            >
                Price ↑
            </button>

            <button
                className={currentSort === "price_desc" ? styles.active : ""}
                onClick={() => handleSort("price_desc")}
            >
                Price ↓
            </button>

            <button
                className={currentSort === "rating" ? styles.active : ""}
                onClick={() => handleSort("rating")}
            >
                Top Rated
            </button>
        </div>
    );
}