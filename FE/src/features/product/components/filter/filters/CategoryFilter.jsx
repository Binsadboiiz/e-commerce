import styles from "./filters.module.css";
import { useState, useEffect } from "react";
import { categoryService } from "@/features/product/services/categoryService";

export default function CategoryFilter({ searchParams, setSearchParams }) {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

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
                        {category.type}
                    </label>
                );
            })}
        </div>
    );
}