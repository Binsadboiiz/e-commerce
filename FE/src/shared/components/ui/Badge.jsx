import React from 'react';
import styles from './Badge.module.css';

/**
 * Standard Reusable Badge Component for customer and shared applications.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content / label
 * @param {'warning'|'success'|'danger'|'info'|'neutral'|'primary'} [props.variant='neutral']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.dot=true] - Whether to show the colored status dot
 * @param {React.ReactNode} [props.icon] - Optional custom icon
 * @param {string} [props.className='']
 */
export default function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    dot = true,
    icon = null,
    className = '',
    ...props
}) {
    const variantClass = styles[variant] || styles.neutral;
    const sizeClass = styles[size] || styles.md;

    return (
        <span
            className={`${styles.badge} ${variantClass} ${sizeClass} ${className}`.trim()}
            {...props}
        >
            {icon ? (
                <span className={styles.icon}>{icon}</span>
            ) : dot ? (
                <span className={styles.dot} />
            ) : null}
            {children}
        </span>
    );
}
