import styles from "./FilterSection.module.css";

export default function FilterSection({ title, children }) {
    return (
        <div className={styles.section}>
            <p className={styles.title}>{title}</p>
            {children}
        </div>
    );
}