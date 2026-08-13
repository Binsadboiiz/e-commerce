import styles from './ReviewCard.module.css';

import StarRating from './components/StarRating';
import ReviewImages from './ReviewImages';
import SellerReply from './SellerReply';

export default function ReviewCard({ review, shopName }) {

    const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className={styles.card}>

            {/* Reviewer header — avatar, name, stars, date */}
            <div className={styles.header}>
                <img
                    src={
                        review.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName ?? 'U')}&background=random`
                    }
                    alt={`${review.userName ?? 'User'} avatar`}
                    className={styles.avatar}
                    onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName ?? 'U')}&background=random`;
                    }}
                />

                <div className={styles.headerInfo}>
                    <div className={styles.nameRow}>
                        <span className={styles.name}>{review.userName}</span>
                        {/* Verified badge — shown when backend flags purchase */}
                        {review.isVerifiedPurchase && (
                            <span className={styles.verifiedBadge}>
                                Verified Purchase
                            </span>
                        )}
                    </div>

                    <div className={styles.meta}>
                        <StarRating value={review.rating} />
                        <span className={styles.date}>{formattedDate}</span>
                    </div>

                    {/* Variant purchased — e.g. "Color: Red / Size: M" */}
                    {review.variantLabel && (
                        <span className={styles.variantLabel}>
                            {review.variantLabel}
                        </span>
                    )}
                </div>
            </div>

            {/* Review text */}
            <p className={styles.content}>{review.content}</p>

            {/* Review photo thumbnails */}
            <ReviewImages images={review.images} />

            {/* Seller reply if present */}
            <SellerReply reply={review.sellerReply} shopName={shopName} />

        </div>
    );
}