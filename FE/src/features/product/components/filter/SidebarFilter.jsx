import styles from "./SidebarFilter.module.css";
import PriceFilter from "./filters/PriceFilter";
import CategoryFilter from "./filters/CategoryFilter";
import RatingFilter from "./filters/RatingFilter";
import { useSearchParams } from "react-router-dom";

export default function SidebarFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.title}>Filter</h3>

            {/* CATEGORY */}
            <CategoryFilter
                searchParams={searchParams}
                setSearchParams={setSearchParams} />

            {/* PRICE */}
            <PriceFilter
                searchParams={searchParams}
                setSearchParams={setSearchParams} />

            {/* RATING */}
            <RatingFilter
                searchParams={searchParams}
                setSearchParams={setSearchParams} />
        </aside>
    );
}