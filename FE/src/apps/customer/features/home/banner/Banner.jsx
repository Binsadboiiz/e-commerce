import styles from "./Banner.module.css";
import { banners } from "./bannerConfig";

export default function Banner() {
    return (
        <section className={styles.bannerSection}>
            <div className={styles.bannerContainer}>
                <div className={styles.bannerGrid}>

                    {/* left banners */}
                    <div className={styles.bannerLeft}>
                        {banners.left.map(banner => (
                            <div key={banner.id} className={styles.bannerItem}>
                                {banner.linkTo ? (
                                    <a href={banner.linkTo}>
                                        <img src={banner.imageUrl} alt="banner left" />
                                    </a>
                                ) : (
                                    <img src={banner.imageUrl} alt="banner left" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* center banner */}
                    <div className={styles.bannerCenter}>
                        <div className={styles.bannerSlider}>

                            <div className={styles.bannerTrack}>
                                {banners.main.map(banner => (
                                    <div key={banner.id} className={styles.bannerSlide}>
                                        {banner.linkTo ? (
                                            <a href={banner.linkTo}>
                                                <img src={banner.imageUrl} alt="banner main" />
                                            </a>
                                        ) : (
                                            <img src={banner.imageUrl} alt="banner main" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* dots */}
                            <div className={styles.bannerDots}>
                                {banners.main.map((banner, index) => (
                                    <span 
                                        key={banner.id} 
                                        className={`${styles.dot} ${index === 0 ? styles.active : ''}`}
                                    ></span>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* right banners */}
                    <div className={styles.bannerRight}>
                        {banners.right.map(banner => (
                            <div key={banner.id} className={styles.bannerItem}>
                                {banner.linkTo ? (
                                    <a href={banner.linkTo}>
                                        <img src={banner.imageUrl} alt="banner right" />
                                    </a>
                                ) : (
                                    <img src={banner.imageUrl} alt="banner right" />
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}