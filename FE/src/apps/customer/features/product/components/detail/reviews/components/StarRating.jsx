import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./StarRating.module.css";

export default function StarRating({ value = 0 }) {

    return (
        <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) =>
                i < value ? (
                    <FaStar key={i} className={styles.filled} />
                ) : (
                    <FaRegStar key={i} className={styles.empty} />
                )
            )}
        </div>
    );
}