import styles from "./ProductReviews.module.css";

import RatingSummary from "./RatingSummary";
import RatingProgress from "./RatingProgress";
import ReviewSort from "./ReviewSort";
import ReviewList from "./ReviewList";
import ReviewPagination from "./ReviewPagination";
import ReviewSkeleton from "./ReviewSkeleton";

import useProductReviews from "../../../hooks/useProductReviews";

export default function ProductReviews({ productId }) {

    const {
        data,
        loading,
        page,
        setPage,
        sortBy,
        setSortBy
    } = useProductReviews(productId);

    if (loading && !data) return <ReviewSkeleton />;
    if (!data) return null;

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <RatingSummary data={data} />
                <RatingProgress data={data.ratingSummary} />
            </div>

            <ReviewSort value={sortBy} onChange={setSortBy} />

            <ReviewList reviews={data.reviews} />

            <ReviewPagination
                page={page}
                totalPages={data.totalPages}
                onChange={setPage}
            />

        </div>
    );
}