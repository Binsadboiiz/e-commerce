import styles from "./ProductGallery.module.css";
import { useState } from "react";
import MainImageSlider from "./MainImageSlider.jsx";
import ThumbnailSlider from "./ThumbnailSlider.jsx";

export default function ProductGallery({ images = [] }) {

    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!images.length) {
        return (
            <div className={styles.empty}>
                No Image
            </div>
        )
    }

    return (
        <div className={styles.gallery}>
            <MainImageSlider
                images={images}
                activeImageIndex={activeImageIndex}
                onChangeImageIndex={setActiveImageIndex}
            />
            <ThumbnailSlider
                images={images}
                activeImageIndex={activeImageIndex}
                onChangeImageIndex={setActiveImageIndex}
            />
        </div>
    )
}