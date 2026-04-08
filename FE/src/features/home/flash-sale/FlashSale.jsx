import styles from './FlashSale.module.css'

export default function FlashSale() {

    const flashSaleMock = [
        { id: 1, soldPercent: 80 },
        { id: 2, soldPercent: 45 },
        { id: 3, soldPercent: 65 },
        { id: 4, soldPercent: 30 },
        { id: 5, soldPercent: 90 },
        { id: 6, soldPercent: 55 },
        { id: 7, soldPercent: 70 },
        { id: 8, soldPercent: 20 },
    ]

    return (
        <section className={styles.flashSaleSection}>
            <div className={styles.flashSaleContainer}>

                <div className={styles.flashSaleHeader}>
                    <h2 className={styles.sectionTitle}>Flash Sale</h2>
                    <div className={styles.flashSaleTimer}>02 : 15 : 30</div>
                </div>

                <div className={styles.flashSaleList}>
                    {flashSaleMock.map(item => (
                        <div
                            key={item.id}
                            className={styles.flashSaleItem}
                        >
                            <div className={styles.flashSaleImage} />

                            <div className={styles.flashSaleProgress}>
                                <span className={styles.flashSaleProgressLabel}>
                                    Selling fast
                                </span>

                                <div className={styles.flashSaleProgressTrack}>
                                    <div
                                        className={styles.flashSaleProgressFill}
                                        style={{ width: `${item.soldPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
