import styles from './ReviewEmptyState.module.css';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { useLanguage } from '@/shared/context/LanguageContext';

/* Empty state shown when a product has no reviews yet */
export default function ReviewEmptyState() {
    const { t } = useLanguage();
    return (
        <div className={styles.wrapper}>
            <IoChatbubblesOutline className={styles.icon} aria-hidden="true" />
            <p className={styles.title}>{t('productDetail.noReviewsYet') || 'No reviews yet'}</p>
            <p className={styles.sub}>
                {t('productDetail.beTheFirstToReview') || 'Be the first to share your experience with this product.'}
            </p>
        </div>
    );
}
