import styles from "./filters.module.css";
import { useState, useEffect } from "react";
import { productsService } from "@/apps/customer/features/product/services/productService";
import { parseQuery } from "../utils/parseQuery";

export default function ColorFilter({ data = [], searchParams, setSearchParams }) {

    const [colors, setColors] = useState([]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const params = parseQuery(searchParams);
                const meta = await productsService.getFilterMeta(params);
                setColors(meta.data?.colors || []);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
    }, [searchParams]);

    const selectedColors = searchParams.getAll("attributeValueIds").map(String);

    const handleColorToggle = (id) => {
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

    if (data.length === 0) return null;

    return (
        <div className={styles.section}>
            <p className={styles.label}>Color</p>

            <div className={styles.colorList}>
                {colors.map(color => {
                    const idStr = String(color.id);
                    const isActive = selectedColors.includes(idStr);

                    return (
                        <div
                            key={color.id}
                            className={`${styles.colorItem} ${isActive ? styles.active : ""}`}
                            style={{ backgroundColor: color.name.toLowerCase() }}
                            onClick={() => handleColorToggle(color.id)}
                            title={`${color.name} (${color.count})`}
                        />
                    );
                })}
            </div>
        </div>
    );
}