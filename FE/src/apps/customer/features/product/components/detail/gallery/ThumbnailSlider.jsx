import styles from "./ThumbnailSlider.module.css";

export default function ThumbnailSlider({ images, activeImageIndex, onChangeImageIndex }) {
    return (
        <div>
            <div className={styles.row}>
                {images.map((img, index) => (
                    <img
                        key={img.imageId}
                        src={img.imageUrl}
                        className={`${styles.thumb} 
                            ${index === activeImageIndex ? styles.active : ""}`}
                        onClick={() => onChangeImageIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}