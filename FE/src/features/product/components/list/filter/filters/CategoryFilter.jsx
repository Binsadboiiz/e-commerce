import styles from "./filters.module.css";
import { useState, useEffect } from "react";
import { productsService } from "@/features/product/services/productService";
import { parseQuery } from "../utils/parseQuery";

export default function CategoryFilter({ searchParams, setSearchParams }) {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const params = parseQuery(searchParams);

                const meta = await productsService.getFilterMeta(params);

                setCategories(meta.data?.categories || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [searchParams]);

    const selectedCategories = searchParams.getAll("categoryIds").map(String);

    const handleCategoryToggle = (id) => {
        const newParams = new URLSearchParams(searchParams);

        const idStr = String(id);
        const current = newParams.getAll("categoryIds");

        if (current.includes(idStr)) {
            const filtered = current.filter(x => x !== idStr);
            newParams.delete("categoryIds");
            filtered.forEach(x => newParams.append("categoryIds", x));
        } else {
            newParams.append("categoryIds", idStr);
        }

        setSearchParams(newParams);
    };

    if (!categories.length) return null;

    return (
        <div className={styles.section}>
            <p className={styles.label}>Category</p>

            {categories.map(category => {
                const idStr = String(category.id);

                return (
                    <label key={category.id} className={styles.option}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(idStr)}
                            onChange={() => handleCategoryToggle(category.id)}
                        />
                        {category.name} ({category.count})
                    </label>
                );
            })}
        </div>
    );
}