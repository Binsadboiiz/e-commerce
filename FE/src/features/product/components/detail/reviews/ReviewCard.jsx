import styles from "./ReviewCard.module.css";

import StarRating from "./components/StarRating";
import ReviewImages from "./ReviewImages";
import SellerReply from "./SellerReply";

export default function ReviewCard({ review }) {

    return (
        <div className={styles.card}>

            <div className={styles.header}>

                <img
                    src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName ?? 'U')}&background=random`}
                    alt={review.userName ?? 'User avatar'}
                    className={styles.avatar}
                    onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName ?? 'U')}&background=random`;
                    }}
                />

                <div>

                    <div className={styles.name}>
                        {review.userName}
                    </div>

                    <div className={styles.meta}>

                        <StarRating value={review.rating} />

                        <span className={styles.date}>
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>

                    </div>

                </div>
            </div>

            <div className={styles.content}>
                {review.content}
            </div>

            <ReviewImages images={review.images} />

            <SellerReply reply={review.sellerReply} />

        </div>
    );
}