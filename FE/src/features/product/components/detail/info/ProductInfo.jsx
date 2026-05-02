import { IoStar } from 'react-icons/io5';
import styles from './ProductInfo.module.css'
import formatPrice from '@/features/product/utils/formatPrice';

export default function ProductInfo({ product }) {
    if (!product) return null;

    const {
        name,
        price,
        discountPrice,
        ratingAvg,
        ratingCount,
        brandName,
        categoryName
    } = product;

    const finalPrice = discountPrice ?? price;

    return (
        <div className={styles.wrapper}>
            <div className={styles.name}>
                {name}
            </div>

            <div className={styles.price}>
                {discountPrice ? (
                    <div>
                        <span className={styles.finalPrice}>
                            {formatPrice(finalPrice)}
                        </span>
                        <span className={styles.originalPrice}>
                            {formatPrice(price)}
                        </span>
                    </div>
                ) : (
                    <span className={styles.finalPrice}>
                        {formatPrice(finalPrice)}
                    </span>
                )}
            </div>

            <div className={styles.rating}>
                <IoStar />
                <span>{ratingAvg || 0}</span>
                <span>({ratingCount || 0} reviews)</span>
            </div>

        </div>
    )
}