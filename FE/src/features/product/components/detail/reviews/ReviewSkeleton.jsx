import styles from "./ReviewSkeleton.module.css";

export default function ReviewSkeleton() {

    return (
        <div className={styles.skeleton}>
            Loading reviews...
        </div>
    );
}