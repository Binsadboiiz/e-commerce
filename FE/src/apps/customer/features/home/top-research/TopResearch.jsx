import styles from './TopResearch.module.css';
import TopResearchSkeleton from './TopResearchSkeleton';

/**
 * @param {boolean} [loading=false] - Truyền vào khi section kết nối API thực
 */
export default function TopResearch({ loading = false }) {

    if (loading) return <TopResearchSkeleton count={6} />;

    const topResearchMock = [
        {
            id: 1,
            name: 'Women Wide Leg Pants',
            monthlySales: '110k+',
            image: '/img/pants.jpg'
        },
        {
            id: 2,
            name: 'Simple Claw Hair Clip for Women',
            monthlySales: '53k+',
            image: '/img/hairclip.jpg'
        },
        {
            id: 3,
            name: 'Anti-Sweat Gaming Gloves',
            monthlySales: '50k+',
            image: '/img/glove.jpg'
        },
        {
            id: 4,
            name: 'Indoor Slippers',
            monthlySales: '57k+',
            image: '/img/slipper.jpg'
        },
        {
            id: 5,
            name: 'Cotton Bedding Set',
            monthlySales: '59k+',
            image: '/img/bedding.jpg'
        },
        {
            id: 6,
            name: 'Umbrella',
            monthlySales: '49k+',
            image: '/img/umbrella.jpg'
        }
    ]

    return (
        <section className={styles.topResearchSection}>
            <div className={styles.topResearchContainer}>
                <h2 className={styles.sectionTitle}>Top Research</h2>

                <div className={styles.topResearchList}>
                    {topResearchMock.map(item => (
                        <div key={item.id} className={styles.topResearchItem}>

                            {/* top badge */}
                            <span className={styles.topBadge}>TOP</span>

                            {/* image */}
                            <div className={styles.topResearchImage}>
                                <img src={item.image} alt='img' />
                                <span className={styles.monthlySales}>
                                    Monthly Sales {item.monthlySales}
                                </span>
                            </div>

                            {/* name */}
                            <p className={styles.topResearchName}>{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}