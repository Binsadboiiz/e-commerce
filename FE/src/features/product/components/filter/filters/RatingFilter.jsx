import styles from "./filters.module.css";
import { IoStar, IoStarHalf } from "react-icons/io5";

const ratings = [
    { label: "", value: 5 },
    { label: "& up", value: 4 },
    { label: "& up", value: 3 },
    { label: "& up", value: 2 },
    { label: "& up", value: 1 },
];

export default function RatingFilter({ searchParams, setSearchParams }) {
    const selected = Number(searchParams.get("minRating")) || null;

    const handleSelect = (value) => {
        const params = new URLSearchParams(searchParams);

        if (selected == value) {
            params.delete("minRating");
        } else {
            params.set("minRating", value);
        }

        setSearchParams(params);
    }

    return (
        <div className={styles.section}>
            <p className={styles.label}>Rating</p>

            {ratings.map((r) => (
                <label key={r.value} className={styles.option}>
                    <input
                        type="radio"
                        checked={selected === r.value}
                        onChange={() => handleSelect(r.value)}
                    />

                    <span className={styles.ratingRow}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <IoStar
                                key={i}
                                className={
                                    i < r.value
                                        ? styles.starActive
                                        : styles.starInactive
                                }
                            />
                        ))}
                        <span className={styles.ratingText}>
                            &nbsp;{r.label}
                        </span>
                    </span>
                </label>
            ))}
        </div>
    );
}