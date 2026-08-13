import styles from './ProductReviews.module.css';

import RatingSummary from './RatingSummary';
import RatingProgress from './RatingProgress';
import ReviewSort from './ReviewSort';
import ReviewList from './ReviewList';
import ReviewPagination from './ReviewPagination';
import ReviewSkeleton from './ReviewSkeleton';

import useProductReviews from '../../../hooks/useProductReviews';

export default function ProductReviews({ productId, shopName }) {

    const {
        data,
        loading,
        page,
        setPage,
        sortBy,
        setSortBy,
    } = useProductReviews(productId);

    if (loading && !data) return <ReviewSkeleton />;
    if (!data) return null;

    return (
        <div className={styles.container}>

            {/* Section heading with review count */}
            <h2 className={styles.heading}>
                Customer Reviews
                <span className={styles.count}>({data.totalReviews})</span>
            </h2>

            {/* Rating overview: big score + star distribution */}
            <div className={styles.ratingHeader}>
                <RatingSummary data={data} />
                <RatingProgress data={data.ratingSummary} />
            </div>

            {/* Sort control */}
            <ReviewSort value={sortBy} onChange={setSortBy} />

            {/* Review cards */}
            <ReviewList reviews={data.reviews} shopName={shopName} />

            {/* Pagination */}
            <ReviewPagination
                page={page}
                totalPages={data.totalPages}
                onChange={setPage}
            />

        </div>
    );
}