import styles from './ReviewImages.module.css';

export default function ReviewImages({ images }) {

    if (!images?.length) return null;

    return (
        <div className={styles.images}>
            {images.map(img => (
                <img
                    key={img.reviewImageId}
                    src={img.imageUrl}
                    alt={`Review photo ${img.reviewImageId}`}
                    className={styles.thumb}
                />
            ))}
        </div>
    );
}