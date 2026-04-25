import { useEffect, useState } from 'react';
import styles from './ProductGrid.module.css';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], onBuy }) {

    const [visible, setVisible] = useState([]);

    useEffect(() => {
        setVisible([]);

        if (!products.length) return;

        let i = 0;

        const timer = setInterval(() => {
            setVisible(prev => [...prev, products[i]]);
            i++;

            if (i >= products.length) {
                clearInterval(timer);
            }
        }, 40);

        return () => clearInterval(timer);
    }, [products]);

    return (
        <div className={styles.grid}>
            {products
                .filter(Boolean)
                .map((p) => (
                    <ProductCard key={p.id} product={p} onBuy={onBuy} />
                ))
            }
        </div>
    );
}