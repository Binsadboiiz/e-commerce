import { IoStar } from 'react-icons/io5';
import styles from './ProductInfo.module.css';
import formatPrice from '@/apps/customer/features/product/utils/formatPrice';

/* Tính % giảm giá từ giá gốc và giá sale */
function calcDiscountPercent(original, sale) {
    if (!original || !sale || sale >= original) return 0;
    return Math.round(((original - sale) / original) * 100);
}

/* Render stock status label + class tùy theo số lượng tồn */
function StockStatus({ variant }) {
    if (!variant) return null;

    const stock = variant.availableStock ?? 0;
    const available = variant.isAvailable && stock > 0;

    if (!available) {
        return <span className={styles.stockOut}>Out of Stock</span>;
    }

    if (stock <= 5) {
        return (
            <span className={styles.stockLow}>
                Only {stock} left
            </span>
        );
    }

    return <span className={styles.stockIn}>In Stock</span>;
}

export default function ProductInfo({ product, selectedVariant }) {
    if (!product) return null;

    const {
        name,
        price,
        discountPrice,
        ratingAvg,
        ratingCount,
        brandName,
        categoryName,
    } = product;

    /* Giá hiển thị: ưu tiên giá variant → discount → gốc */
    const finalPrice = selectedVariant?.price ?? discountPrice ?? price;
    const discountPercent = calcDiscountPercent(price, finalPrice);

    return (
        <div className={styles.wrapper}>

            {/* Brand + category breadcrumb phía trên tên */}
            {(brandName || categoryName) && (
                <div className={styles.meta}>
                    {categoryName && (
                        <span className={styles.category}>{categoryName}</span>
                    )}
                    {brandName && categoryName && (
                        <span className={styles.metaDot}>/</span>
                    )}
                    {brandName && (
                        <span className={styles.brand}>{brandName}</span>
                    )}
                </div>
            )}

            {/* Tên sản phẩm */}
            <h1 className={styles.name}>{name}</h1>

            {/* Rating row */}
            <div className={styles.rating}>
                <IoStar className={styles.starIcon} />
                <span className={styles.ratingValue}>
                    {ratingAvg || 0}
                </span>
                <span className={styles.ratingCount}>
                    ({ratingCount || 0} reviews)
                </span>
            </div>

            {/* Price block */}
            <div className={styles.priceBlock}>
                <div className={styles.priceRow}>
                    <span className={`${styles.finalPrice} ${discountPrice ? styles.salePrice : ''}`}>
                        {formatPrice(finalPrice)}
                    </span>

                    {discountPrice && (
                        <span className={styles.originalPrice}>
                            {formatPrice(price)}
                        </span>
                    )}

                    {discountPercent > 0 && (
                        <span className={styles.discountBadge}>
                            -{discountPercent}%
                        </span>
                    )}
                </div>

                {/* Stock indicator */}
                <StockStatus variant={selectedVariant} />
            </div>

        </div>
    );
}