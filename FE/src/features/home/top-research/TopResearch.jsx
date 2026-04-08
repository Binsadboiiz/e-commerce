import styles from './TopResearch.module.css'

export default function TopResearch() {

    const topResearchMock = [
        {
            id: 1,
            name: 'Quần Ống Rộng Nữ',
            monthlySales: '110k+',
            image: '/img/pants.jpg'
        },
        {
            id: 2,
            name: 'Kẹp Tóc Càng Cua Đơn Giản Cho Nữ',
            monthlySales: '53k+',
            image: '/img/hairclip.jpg'
        },
        {
            id: 3,
            name: 'Găng Tay Chơi Game Chống Mồ Hôi',
            monthlySales: '50k+',
            image: '/img/glove.jpg'
        },
        {
            id: 4,
            name: 'Dép Đi Trong Nhà',
            monthlySales: '57k+',
            image: '/img/slipper.jpg'
        },
        {
            id: 5,
            name: 'Bộ Chăn Ga Gối Cotton',
            monthlySales: '59k+',
            image: '/img/bedding.jpg'
        },
        {
            id: 6,
            name: 'Ô Dù',
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