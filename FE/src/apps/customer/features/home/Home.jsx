import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import styles from './Home.module.css'
import SEOHead from '@/shared/components/SEOHead'
import { useLanguage } from '@/shared/context/LanguageContext'
import { ROUTES } from '@/config/route.config'
import useProducts from '@/apps/customer/features/product/hooks/useProducts'
import ProductGrid from '@/apps/customer/features/product/components/shared/ProductGrid'
import ProductCard from '@/apps/customer/features/product/components/shared/ProductCard'
import ProductSkeleton from '@/apps/customer/features/product/components/shared/ProductSkeleton'
import Button from '@/shared/components/ui/Button'

const discountOf = (p) => (p.price && p.discountPrice && p.price > p.discountPrice ? (p.price - p.discountPrice) / p.price : 0)

export default function HomePage() {
  const { t } = useLanguage()
  const { products, meta, loading } = useProducts({ pageSize: 40 })

  const inStock = products.filter((p) => (p.availableStock ?? p.stock ?? 1) > 0)
  const heroImages = inStock.filter((p) => p.imageUrl).slice(0, 3)
  const onSale = [...inStock].filter((p) => discountOf(p) > 0).sort((a, b) => discountOf(b) - discountOf(a)).slice(0, 8)
  const onSaleIds = new Set(onSale.map((p) => p.id))
  const featured = inStock.filter((p) => !onSaleIds.has(p.id)).slice(0, 20)
  const categories = meta?.categories ?? []

  return (
    <div className={styles.page}>
      <SEOHead title="Trang chủ - PolarisX Mall" description="PolarisX Mall: sàn nhiều cửa hàng, một giỏ hàng. Mỗi cửa hàng được xét duyệt trước khi bán." />

      {/* 1. Hero: navy text block + product photos, both with the 45° cut */}
      <section className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.kicker}><span className="dot" aria-hidden="true" />{t('home.heroKicker')}</p>
            <h1 className={styles.heroTitle}>
              {t('home.heroHeadline')}<br />{t('home.heroHeadline2')}
            </h1>
            <p className={styles.heroSub}>{t('home.heroSub')}</p>
            <div className={styles.heroActions}>
              <Link to={ROUTES.PRODUCTS_LIST}>
                <Button size="lg" iconRight={<ArrowRight size={18} />}>{t('home.browse')}</Button>
              </Link>
              <Link to={ROUTES.SELLER_REGISTRATION} className={styles.heroLink}>{t('home.sellWithUs')}</Link>
            </div>
          </div>

          <div className={styles.heroMedia}>
            {heroImages.map((p, i) => (
              <Link key={p.id} to={ROUTES.PRODUCT_DETAIL.replace(':slug', p.slug)} className={`${styles.heroPhoto} ${styles['photo' + i]}`} aria-label={p.name}>
                <img src={p.imageUrl} alt="" loading={i === 0 ? 'eager' : 'lazy'} width="400" height="400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Category index: editorial text list, not cards */}
      {categories.length > 0 && (
        <section className={styles.container}>
          <h2 className="section-title">{t('home.shopByCategory')}</h2>
          <ul className={styles.catList}>
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`${ROUTES.PRODUCTS_LIST}?categoryIds=${c.id}`} className={styles.catLink}>
                  <span>{c.name}</span>
                  <sup>{c.count}</sup>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. On sale: horizontal rail, the one place amber appears */}
      {onSale.length > 0 && (
        <section className={styles.band}>
          <div className={styles.container}>
            <div className={styles.bandHead}>
              <div>
                <h2 className="section-title">{t('home.onSale')}</h2>
                <p className={styles.bandSub}>{t('home.onSaleSub')}</p>
              </div>
              <Link to={ROUTES.PRODUCTS_LIST} className={styles.viewAll}>{t('home.viewAll')} <ArrowRight size={16} /></Link>
            </div>
            <div className={styles.rail}>
              {onSale.map((p) => (
                <div key={p.id} className={styles.railItem}><ProductCard product={p} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Featured grid */}
      <section className={styles.container}>
        <h2 className="section-title">{t('home.featuredProducts')}</h2>
        {loading ? <ProductSkeleton count={20} /> : <ProductGrid products={featured} />}
      </section>
    </div>
  )
}
