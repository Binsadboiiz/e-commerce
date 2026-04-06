import styles from './ProductGrid.module.css'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, onBuy }) {
    if (!products || products.length === 0) {
        return <p>No products found</p>;
    }

    return (
        <div className={styles.grid}>
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onBuy={onBuy}
                />
            ))}
        </div>
    )
}