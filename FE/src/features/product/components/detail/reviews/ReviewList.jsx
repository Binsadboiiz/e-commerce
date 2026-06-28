import styles from "./ReviewList.module.css";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ reviews }) {

    if (!Array.isArray(reviews) || reviews.length === 0) {
        return <p style={{ color: '#888', textAlign: 'center', padding: '24px 0' }}>No reviews yet.</p>;
    }

    return (
        <div className={styles.list}>
            {reviews.map(r => (
                <ReviewCard key={r.reviewId} review={r} />
            ))}
        </div>
    );
}