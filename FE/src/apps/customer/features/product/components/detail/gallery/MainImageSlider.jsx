import styles from "./MainImageSlider.module.css";
import { useEffect, useRef } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

export default function MainImageSlider({ images, activeImageIndex, onChangeImageIndex }) {
    // REFS
    const sliderRef = useRef(null);
    //lưu vị trí bắt đầu drag
    const startXRef = useRef(0);
    //flag đang drag
    const isDraggingRef = useRef(false);

    // NAV BUTTON
    const handlePrevImage = (e) => {
        e.stopPropagation();

        if (activeImageIndex > 0) {
            onChangeImageIndex(activeImageIndex - 1);
        }
    };

    const handleNextImage = (e) => {
        e.stopPropagation();

        if (activeImageIndex < images.length - 1) {
            onChangeImageIndex(activeImageIndex + 1);
        }
    };

    // SCROLL CONTROL
    const scrollToActiveIndex = (index) => {
        const container = sliderRef.current;
        if (!container) return;

        const width = container.clientWidth;

        container.scrollTo({
            left: index * width,
            behavior: "auto"
        });
    };

    // DRAG
    const handleMouseDown = (e) => {
        startXRef.current = e.clientX;
        isDraggingRef.current = true;
    };

    const handleMouseUp = (e) => {
        if (!isDraggingRef.current) return;

        const container = sliderRef.current;
        if (!container) return;

        const width = container.clientWidth;

        // vị trí scroll hiện tại
        const currentScroll = container.scrollLeft;

        // index thực tế (float)
        const rawIndex = currentScroll / width;

        // phần thập phân
        const decimal = rawIndex - Math.floor(rawIndex);

        let newIndex = activeImageIndex;

        if (decimal > 0.5 && activeImageIndex < images.length - 1) {
            newIndex = Math.floor(rawIndex) + 1;
        } else {
            newIndex = Math.floor(rawIndex);
        }

        // clamp
        newIndex = Math.max(0, Math.min(newIndex, images.length - 1));

        onChangeImageIndex(newIndex);

        container.scrollTo({
            left: newIndex * width,
            behavior: "auto"
        });

        isDraggingRef.current = false;
    };

    const handleMouseLeave = () => {
        isDraggingRef.current = false;
    };

    // SYNC IMAGE 
    useEffect(() => {
        scrollToActiveIndex(activeImageIndex);
    }, [activeImageIndex]);

    // HANDLE RESIZE
    useEffect(() => {
        const handleResize = () => {
            scrollToActiveIndex(activeImageIndex);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [activeImageIndex]);

    // ================= RENDER =================
    return (
        <div className={styles.wrapper}>

            <div
                className={styles.container}
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={(e) => handleMouseDown(e.touches[0])}
                onTouchEnd={(e) => handleMouseUp(e.changedTouches[0])}
            >
                {images.map((img) => (
                    <div key={img.imageId} className={styles.slide}>
                        <img
                            src={img.imageUrl}
                            className={styles.image}
                            draggable={false}
                            alt=""
                        />
                    </div>
                ))}
            </div>

            {/* Navigation arrows */}
            <button
                className={styles.btnPrev}
                onClick={handlePrevImage}
                aria-label="Previous image"
            >
                <FaCaretLeft />
            </button>

            <button
                className={styles.btnNext}
                onClick={handleNextImage}
                aria-label="Next image"
            >
                <FaCaretRight />
            </button>

        </div>
    );
}