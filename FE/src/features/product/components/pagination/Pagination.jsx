import styles from "./Pagination.module.css";
import { useSearchParams } from "react-router-dom";

export default function Pagination({ page, pageSize, total }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const totalPages = Math.ceil(total / pageSize);

    // ❗ FIX: đúng condition
    if (!totalPages || totalPages <= 1) return null;

    const handleChangePage = (newPage) => {
        const params = new URLSearchParams(searchParams);

        params.set("page", String(newPage));

        setSearchParams(params);
    };

    const generatePageNumbers = () => {
        const pages = [];

        const maxVisible = 5;

        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, page + 2);

        if (startPage === 1) {
            endPage = Math.min(totalPages, maxVisible);
        }

        if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className={styles.container}>

            <button
                className={styles.btn}
                disabled={page <= 1}
                onClick={() => handleChangePage(page - 1)}
            >
                Prev
            </button>

            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    onClick={() => handleChangePage(pageNumber)}
                    className={`${styles.btn} ${pageNumber === page ? styles.active : ""}`}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                className={styles.btn}
                disabled={page >= totalPages}
                onClick={() => handleChangePage(page + 1)}
            >
                Next
            </button>

        </div>
    );
}