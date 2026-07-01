import styles from './Button.module.css';

export default function Button({children, className = '', disabled, ...props}) {
    return (
        <button
            className={`${styles.button} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}