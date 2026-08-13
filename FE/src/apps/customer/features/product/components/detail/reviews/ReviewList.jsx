import styles from './ReviewList.module.css';
import ReviewCard from './ReviewCard';
import ReviewEmptyState from './ReviewEmptyState';

export default function ReviewList({ reviews, shopName }) {

    if (!Array.isArray(reviews) || reviews.length === 0) {
        return <ReviewEmptyState />;
    }

    return (
        <div className={styles.list}>
            {reviews.map(r => (
                <ReviewCard key={r.reviewId} review={r} shopName={shopName} />
            ))}
        </div>
    );
}