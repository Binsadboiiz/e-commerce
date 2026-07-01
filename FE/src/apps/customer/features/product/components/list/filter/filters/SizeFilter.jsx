import styles from "./filters.module.css";
import { useState, useEffect } from "react";
import { productsService } from "@/apps/customer/features/product/services/productService";
import { parseQuery } from "../utils/parseQuery";

export default function SizeFilter({ data = [], searchParams, setSearchParams }) {

    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const params = parseQuery(searchParams);
                const meta = await productsService.getFilterMeta(params);
                setSizes(meta.data?.sizes || []);
            } catch (error) {
                console.error("Error fetching sizes:", error);
            }
        };
        fetchSizes();
    }, [searchParams]);

    const selectedSizes = searchParams.getAll("attributeValueIds").map(String);

    const handleSizeToggle = (id) => {
        const newParams = new URLSearchParams(searchParams);

        const idStr = String(id);
        const current = newParams.getAll("attributeValueIds");

        if (current.includes(idStr)) {
            const filtered = current.filter(x => x !== idStr);
            newParams.delete("attributeValueIds");
            filtered.forEach(x => newParams.append("attributeValueIds", x));
        } else {
            newParams.append("attributeValueIds", idStr);
        }

        setSearchParams(newParams);
    };

    if (!data.length) return null;

    return (
        <div className={styles.section}>
            <p className={styles.label}>Size</p>

            {sizes.map(size => {
                const idStr = String(size.id);

                return (
                    <label key={size.id} className={styles.option}>
                        <input
                            type="checkbox"
                            checked={selectedSizes.includes(idStr)}
                            onChange={() => handleSizeToggle(size.id)}
                        />
                        {size.name} ({size.count})
                    </label>
                );
            })}
        </div>
    );
}
