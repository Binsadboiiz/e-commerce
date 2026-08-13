import styles from "./Banner.module.css"

export default function Banner() {
    return (
        <section className={styles.bannerSection}>
            <div className={styles.bannerContainer}>
                <div className={styles.bannerGrid}>

                    {/* left banners */}
                    <div className={styles.bannerLeft}>
                        <div className={styles.bannerItem}>
                            <img src="/banner-left-1.jpg" alt="banner" />
                        </div>
                        <div className={styles.bannerItem}>
                            <img src="/banner-left-2.jpg" alt="banner" />
                        </div>
                    </div>

                    {/* center banner */}
                    <div className={styles.bannerCenter}>
                        <div className={styles.bannerSlider}>

                            <div className={styles.bannerTrack}>
                                <div className={styles.bannerSlide}>
                                    <img src="/banner1.jpg" alt="banner" />
                                </div>
                                <div className={styles.bannerSlide}>
                                    <img src="/banner2.jpg" alt="banner" />
                                </div>
                                <div className={styles.bannerSlide}>
                                    <img src="/banner3.jpg" alt="banner" />
                                </div>
                            </div>

                            {/* dots */}
                            <div className={styles.bannerDots}>
                                <span className={`${styles.dot} ${styles.active}`}></span>
                                <span className={styles.dot}></span>
                                <span className={styles.dot}></span>
                            </div>

                        </div>
                    </div>



                    {/* right banners */}
                    <div className={styles.bannerRight}>
                        <div className={styles.bannerItem}>
                            <img src="/banner-right-1.jpg" alt="banner" />
                        </div>
                        <div className={styles.bannerItem}>
                            <img src="/banner-right-2.jpg" alt="banner" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}