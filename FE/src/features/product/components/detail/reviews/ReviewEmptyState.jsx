import styles from './ReviewEmptyState.module.css';
import { IoChatbubblesOutline } from 'react-icons/io5';

/* Empty state shown when a product has no reviews yet */
export default function ReviewEmptyState() {
    return (
        <div className={styles.wrapper}>
            <IoChatbubblesOutline className={styles.icon} aria-hidden="true" />
            <p className={styles.title}>No reviews yet</p>
            <p className={styles.sub}>
                Be the first to share your experience with this product.
            </p>
        </div>
    );
}
