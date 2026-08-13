import styles from './Home.module.css'
import Banner from './banner/Banner'
import ListCategory from './category/ListCategory'
import FlashSale from './flash-sale/FlashSale'
import TopResearch from './top-research/TopResearch'
import RecommendedProducts from './RecommendedProducts'

export default function HomePage() {

  return (
    <div className={styles.homepageContainer}>

      {/* banner */}
      <Banner />

      {/* category */}
      <ListCategory />

      {/* flash sale */}
      <FlashSale />


      {/* top search */}
      <TopResearch />


      {/* product list */}
      <section className={styles.productSection}>
        <div className={styles.productContainer}>

          <div className={styles.productHeader}>
            <h2 className={styles.sectionTitle}>Products</h2>
          </div>

          <RecommendedProducts />

        </div>
      </section>

    </div>
  )
}

