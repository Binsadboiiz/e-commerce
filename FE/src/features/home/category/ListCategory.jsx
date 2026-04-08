import styles from './ListCategory.module.css'

export default function ListCategory() {
    const categoryMock = [
        { id: 1, name: 'Phone' },
        { id: 2, name: 'Laptop' },
        { id: 3, name: 'Headphone' },
        { id: 4, name: 'Camera' },
        { id: 5, name: 'Watch' },
        { id: 6, name: 'Tablet' },
    ]
    return (
        < section className={styles.categorySection} >
            <div className={styles.categoryContainer}>
                <h2 className={styles.sectionTitle}>Categories</h2>

                <div className={styles.categoryGrid}>
                    {categoryMock.map(cat => (
                        <div key={cat.id} className={styles.categoryItem}>
                            {cat.name}
                        </div>
                    ))}
                </div>

            </div>
        </section >
    )
}