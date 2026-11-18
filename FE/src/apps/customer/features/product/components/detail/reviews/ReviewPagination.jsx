import styles from './ReviewPagination.module.css';

/* How many page number buttons to show on each side of current page */
const WINDOW = 2;

/* Build visible page numbers with ellipsis markers */
function buildPages(current, total) {
    if (total <= 1) return [];

    const pages = [];
    const start = Math.max(1, current - WINDOW);
    const end = Math.min(total, current + WINDOW);

    if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (end < total) {
        if (end < total - 1) pages.push('...');
        pages.push(total);
    }

    return pages;
}

export default function ReviewPagination({ page, totalPages, onChange }) {

    if (totalPages <= 1) return null;

    const pages = buildPages(page, totalPages);

    return (
        <nav className={styles.pagination} aria-label="Review pages">

            {/* Previous button */}
            <button
                className={styles.arrow}
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
                aria-label="Previous page"
            >
                Prev
            </button>

            {/* Page number buttons with ellipsis */}
            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        className={`${styles.page} ${p === page ? styles.active : ''}`}
                        onClick={() => onChange(p)}
                        aria-current={p === page ? 'page' : undefined}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next button */}
            <button
                className={styles.arrow}
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
                aria-label="Next page"
            >
                Next
            </button>

        </nav>
    );
}