import styles from './Home.module.css'
import Banner from '../../features/home/banner/Banner'
import ListCategory from '../../features/home/category/ListCategory'
import FlashSale from '../../features/home/flash-sale/FlashSale'
import TopResearch from '../../features/home/top-research/TopResearch'
import ProductList from '../../features/product/pages/ProductList'

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

          <ProductList />

        </div>
      </section>

    </div>
  )
}

