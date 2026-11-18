import styles from "./filters.module.css";
import { useState, useEffect } from "react";
import { productsService } from "@/apps/customer/features/product/services/productService";
import { parseQuery } from "../utils/parseQuery";

export default function MaterialFilter({ data = [], searchParams, setSearchParams }) {

    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const params = parseQuery(searchParams);
                const meta = await productsService.getFilterMeta(params);
                setMaterials(meta.data?.materials || []);
            } catch (error) {
                console.error("Error fetching materials:", error);
            }
        };
        fetchMaterials();
    }, [searchParams]);

    const selectedMaterials = searchParams.getAll("attributeValueIds").map(String);

    const handleMaterialToggle = (id) => {
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
            <p className={styles.label}>Material</p>

            {materials.map(material => {
                const idStr = String(material.id);

                return (
                    <label key={material.id} className={styles.option}>
                        <input
                            type="checkbox"
                            checked={selectedMaterials.includes(idStr)}
                            onChange={() => handleMaterialToggle(material.id)}
                        />
                        {material.name} ({material.count})
                    </label>
                );
            })}
        </div>
    );
}
