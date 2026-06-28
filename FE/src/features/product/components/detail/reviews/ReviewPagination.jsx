import styles from "./ReviewPagination.module.css";

export default function ReviewPagination({ page, totalPages, onChange }) {

    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>

            <button
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
            >
                Prev
            </button>

            <span>{page} / {totalPages}</span>

            <button
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
            >
                Next
            </button>

        </div>
    );
}