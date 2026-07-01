import styles from './AuthInput.module.css';

export default function AuthInput({label, type, placeholder, value, onChange, name}) {
    return (
        <div className={styles.inputGroup}>
            <label htmlFor={name} className={styles.label}>
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={styles.input}
                required
            />
        </div>
    );
}