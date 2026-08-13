import { useState } from 'react';
import styles from './ProductDescription.module.css';

/* Number of lines to show in collapsed state */
const COLLAPSED_LINES = 6;

export default function ProductDescription({ description }) {

    const [expanded, setExpanded] = useState(false);

    const text = description || 'No description available.';

    // Only show toggle if the text is long enough to need collapsing
    const isLong = text.length > 400;

    return (
        <div className={styles.container}>

            <h2 className={styles.title}>Product Description</h2>

            <div className={`${styles.contentWrapper} ${!expanded && isLong ? styles.collapsed : ''}`}>
                <p className={styles.content}>{text}</p>
            </div>

            {/* Show More / Less toggle — only rendered when text is long */}
            {isLong && (
                <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setExpanded(prev => !prev)}
                    aria-expanded={expanded}
                >
                    {expanded ? 'Show Less' : 'Show More'}
                </button>
            )}

        </div>
    );
}