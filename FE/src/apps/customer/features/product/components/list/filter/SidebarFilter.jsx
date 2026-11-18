import styles from "./SidebarFilter.module.css";
import PriceFilter from "./filters/PriceFilter";
import CategoryFilter from "./filters/CategoryFilter";
import RatingFilter from "./filters/RatingFilter";
import ColorFilter from "./filters/ColorFilter";
import SizeFilter from "./filters/SizeFilter";
import MaterialFilter from "./filters/MaterialFilter";
import { useSearchParams } from "react-router-dom";

export default function SidebarFilter({ filterMeta }) {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.title}>Filter</h3>

            {/* CATEGORY */}
            <CategoryFilter
                data={filterMeta?.categories || []}
                searchParams={searchParams}
                setSearchParams={setSearchParams} />

            {/* PRICE */}
            <PriceFilter
                searchParams={searchParams}
                setSearchParams={setSearchParams} />

            {/* RATING */}
            <RatingFilter
                data={filterMeta?.ratings || []}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />

            {/* COLOR */}
            {
                filterMeta?.colors?.length > 0 && (
                    <ColorFilter
                        data={filterMeta.colors}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                    />
                )
            }

            {/* SIZE */}
            {
                filterMeta?.sizes?.length > 0 && (
                    <SizeFilter
                        data={filterMeta.sizes}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                    />
                )
            }

            {/* MATERIAL */}
            {
                filterMeta?.materials?.length > 0 && (
                    <MaterialFilter
                        data={filterMeta.materials}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                    />
                )
            }
        </aside>
    );
}