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
                                        <img src={banner.imageUrl} alt="banner left" width="350" height="120" loading="lazy" decoding="async" />
                                    </a>
                                ) : (
                                    <img src={banner.imageUrl} alt="banner left" width="350" height="120" loading="lazy" decoding="async" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* center banner */}
                    <div className={styles.bannerCenter}>
                        <div className={styles.bannerSlider}>

                            <div className={styles.bannerTrack}>
                                {banners.main.map((banner, index) => (
                                    <div key={banner.id} className={styles.bannerSlide}>
                                        {banner.linkTo ? (
                                            <a href={banner.linkTo}>
                                                <img 
                                                    src={banner.imageUrl} 
                                                    alt="banner main" 
                                                    width="800" 
                                                    height="400" 
                                                    loading={index === 0 ? "eager" : "lazy"} 
                                                    fetchPriority={index === 0 ? "high" : "auto"}
                                                    decoding="async" 
                                                />
                                            </a>
                                        ) : (
                                            <img 
                                                src={banner.imageUrl} 
                                                alt="banner main" 
                                                width="800" 
                                                height="400" 
                                                loading={index === 0 ? "eager" : "lazy"} 
                                                fetchPriority={index === 0 ? "high" : "auto"}
                                                decoding="async" 
                                            />
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
                                        <img src={banner.imageUrl} alt="banner right" width="350" height="120" loading="lazy" decoding="async" />
                                    </a>
                                ) : (
                                    <img src={banner.imageUrl} alt="banner right" width="350" height="120" loading="lazy" decoding="async" />
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}