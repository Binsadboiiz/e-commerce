import styles from './Home.module.css'
import Banner from './banner/Banner'
import ListCategory from './category/ListCategory'
import FlashSale from './flash-sale/FlashSale'
import TopResearch from './top-research/TopResearch'
import RecommendedProducts from './RecommendedProducts'
import SEOHead from '@/shared/components/SEOHead'
import { useLanguage } from '@/shared/context/LanguageContext'

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className={styles.homepageContainer}>
      <SEOHead 
                      title="Trang chủ - E-Commerce Enterprise"
                      description="Khám phá bộ sưu tập sản phẩm đa dạng, chất lượng cao với giá cực tốt tại E-Commerce Enterprise."
                  />

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
            <h2 className={styles.sectionTitle}>{t('home.featuredProducts')}</h2>
          </div>

          <RecommendedProducts />

        </div>
      </section>

    </div>
  )
}

