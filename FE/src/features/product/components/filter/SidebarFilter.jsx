import styles from "./SidebarFilter.module.css";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { categoryService } from "../../services/categoryService";

export default function SidebarFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

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

    const handlePriceChange = (type, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (value) {
            newParams.set(type, value);
        } else {
            newParams.delete(type);
        }

        setSearchParams(newParams);
    };

    const handleCategoryToggle = (id) => {
        const newParams = new URLSearchParams(searchParams);
        const current = newParams.getAll("categoryIds");

        if (current.includes(id.toString())) {
            const filtered = current.filter(x => x !== id.toString());
            newParams.delete("categoryIds");
            filtered.forEach(x => newParams.append("categoryIds", x));
        } else {
            newParams.append("categoryIds", id);
        }

        setSearchParams(newParams);
    };

    const selectedCategories = searchParams.getAll("categoryIds");

    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.title}>Filter</h3>

            {/* CATEGORY */}
            <div className={styles.section}>
                <p className={styles.label}>Category</p>
                {categories.map(category => (
                    <label key={category.id} className={styles.option}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id.toString())}
                            onChange={() => handleCategoryToggle(category.id)}
                        />
                        {category.type}
                    </label>
                ))}
            </div>

            {/* PRICE */}
            <div className={styles.section}>
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
        </aside>
    );
}