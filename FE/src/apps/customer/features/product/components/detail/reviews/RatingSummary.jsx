import styles from "./RatingSummary.module.css";
import StarRating from "./components/StarRating";
import { useLanguage } from '@/shared/context/LanguageContext';

export default function RatingSummary({ data }) {
    const { t } = useLanguage();

    return (
        <div className={styles.summary}>

            <div className={styles.avg}>
                <span className={styles.value}>
                    {(data.ratingAverage ?? 0).toFixed(1)}
                </span>

                <StarRating value={Math.round(data.ratingAverage ?? 0)} />
            </div>

            <div className={styles.total}>
                {data.totalReviews} {t('productDetail.reviewsCount') || 'reviews'}
            </div>

        </div>
    );
}