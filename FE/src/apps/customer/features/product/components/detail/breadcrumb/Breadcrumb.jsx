import { Link } from 'react-router-dom';
import { IoChevronForward } from 'react-icons/io5';
import styles from './Breadcrumb.module.css';
import { ROUTES } from '@/config/route.config';

/**
 * Breadcrumb navigation for Product Detail.
 * Renders: Home > Products > {category} > {productName}
 */
export default function Breadcrumb({ categoryName, productName }) {
    return (
        <nav className={styles.nav} aria-label="Breadcrumb">
            <ol className={styles.list}>

                <li className={styles.item}>
                    <Link to={ROUTES.HOME} className={styles.link}>
                        Home
                    </Link>
                    <IoChevronForward className={styles.sep} aria-hidden="true" />
                </li>

                <li className={styles.item}>
                    <Link to={ROUTES.PRODUCTS_LIST} className={styles.link}>
                        Products
                    </Link>
                    <IoChevronForward className={styles.sep} aria-hidden="true" />
                </li>

                {categoryName && (
                    <li className={styles.item}>
                        <Link
                            to={`${ROUTES.PRODUCTS_LIST}?category=${encodeURIComponent(categoryName)}`}
                            className={styles.link}
                        >
                            {categoryName}
                        </Link>
                        <IoChevronForward className={styles.sep} aria-hidden="true" />
                    </li>
                )}

                {/* Current page — not a link, aria-current for a11y */}
                <li className={styles.item}>
                    <span
                        className={styles.current}
                        aria-current="page"
                    >
                        {productName}
                    </span>
                </li>

            </ol>
        </nav>
    );
}
