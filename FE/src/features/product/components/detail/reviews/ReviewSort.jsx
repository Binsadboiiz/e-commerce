import styles from "./ReviewSort.module.css";

export default function ReviewSort({ value, onChange }) {

    return (
        <div className={styles.sort}>

            <select value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
            </select>

        </div>
    );
}