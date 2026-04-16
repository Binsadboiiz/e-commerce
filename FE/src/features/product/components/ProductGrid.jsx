import styles from './ProductGrid.module.css';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onBuy }) {
    return (
        <div className={styles.grid}>
            {products.map((p) => (
                <ProductCard key={p.id} product={p} onBuy={onBuy} />
            ))}
        </div>
    );
}