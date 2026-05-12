import styles from "./ProductGallery.module.css";
import { useState } from "react";
import MainImageSlider from "./MainImageSlider.jsx";
import ThumbnailSlider from "./ThumbnailSlider.jsx";

export default function ProductGallery({ images = [], selectedImage, onSelectImage }) {

    if (!images?.length) {
        return (
            <div className={styles.empty}>
                No Images
            </div>
        )
    }

    const activeImageIndex = images.findIndex(
        (img) => img.imageUrl === selectedImage
    );

    return (
        <div className={styles.gallery}>
            <MainImageSlider
                images={images}
                activeImageIndex={activeImageIndex >= 0 ? activeImageIndex : 0}
                onChangeImage={(index) => onSelectImage(images[index].imageUrl)

                }
            />
            <ThumbnailSlider
                images={images}
                activeImageIndex={activeImageIndex >= 0 ? activeImageIndex : 0}
                onChangeImageIndex={(index) => onSelectImage(images[index].imageUrl)}
            />
        </div>
    )
}