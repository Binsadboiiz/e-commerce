import styles from "./RatingSummary.module.css";
import StarRating from "./components/StarRating";

export default function RatingSummary({ data }) {

    return (
        <div className={styles.summary}>

            <div className={styles.avg}>
                <span className={styles.value}>
                    {(data.ratingAverage ?? 0).toFixed(1)}
                </span>

                <StarRating value={Math.round(data.ratingAverage ?? 0)} />
            </div>

            <div className={styles.total}>
                {data.totalReviews} reviews
            </div>

        </div>
    );
}