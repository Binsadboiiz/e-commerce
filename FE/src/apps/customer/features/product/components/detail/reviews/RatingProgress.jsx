import styles from "./RatingProgress.module.css";
import { FaStar } from "react-icons/fa";

export default function RatingProgress({ data }) {

    if (!Array.isArray(data) || data.length === 0) return null;

    return (
        <div className={styles.wrapper}>

            {data.map(item => (
                <div key={item.rating} className={styles.row}>

                    <div className={styles.label}>
                        <FaStar className={styles.starIcon} />
                        <span>{item.rating}</span>
                    </div>

                    <div className={styles.bar}>
                        <div
                            className={styles.fill}
                            style={{ width: `${item.percentage}%` }}
                        />
                    </div>

                    <span className={styles.count}>
                        {item.count}
                    </span>

                </div>
            ))}
        </div>
    );
}