import styles from './Home.module.css'

function HomePage() {
    //demo
    const categoryMock = [
    { id: 1, name: 'Phone' },
    { id: 2, name: 'Laptop' },
    { id: 3, name: 'Headphone' },
    { id: 4, name: 'Camera' },
    { id: 5, name: 'Watch' },
    { id: 6, name: 'Tablet' },
    ]

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

        const productMock = [
        {
            id: 1,
            name: 'Áo Thun Cotton Unisex Form Rộng',
            image: '/img/products/tshirt.jpg',
            rating: 4.8,
            price: 129000,
            sold: 23500
        },
        {
            id: 2,
            name: 'Tai Nghe Bluetooth Không Dây',
            image: '/img/products/earbuds.jpg',
            rating: 4.7,
            price: 349000,
            sold: 18400
        },
        {
            id: 3,
            name: 'Quần Jean Nữ Lưng Cao',
            image: '/img/products/jeans.jpg',
            rating: 4.6,
            price: 259000,
            sold: 16200
        },
        {
            id: 4,
            name: 'Chuột Không Dây Pin Sạc',
            image: '/img/products/mouse.jpg',
            rating: 4.5,
            price: 189000,
            sold: 14100
        },
        {
            id: 5,
            name: 'Bình Giữ Nhiệt Inox 500ml',
            image: '/img/products/bottle.jpg',
            rating: 4.9,
            price: 219000,
            sold: 32800
        },
        {
            id: 6,
            name: 'Dép Đi Trong Nhà Chống Trượt',
            image: '/img/products/slipper.jpg',
            rating: 4.4,
            price: 79000,
            sold: 41200
        },
        {
            id: 7,
            name: 'Sạc Nhanh Type-C 20W',
            image: '/img/products/charger.jpg',
            rating: 4.7,
            price: 149000,
            sold: 28700
        },
        {
            id: 8,
            name: 'Balo Laptop Chống Nước',
            image: '/img/products/backpack.jpg',
            rating: 4.6,
            price: 399000,
            sold: 9800
        }
        ]




  return (
    <div className={styles.homepageContainer}>

      {/* banner */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          <div className={styles.bannerGrid}>

            {/* left banners */}
            <div className={styles.bannerLeft}>
              <div className={styles.bannerItem}>
                <img src="/banner-left-1.jpg" alt="banner" />
              </div>
              <div className={styles.bannerItem}>
                <img src="/banner-left-2.jpg" alt="banner" />
              </div>
            </div>

            {/* center banner */}
            <div className={styles.bannerCenter}>
                <div className={styles.bannerSlider}>

                    <div className={styles.bannerTrack}>
                    <div className={styles.bannerSlide}>
                        <img src="/banner1.jpg" alt="banner" />
                    </div>
                    <div className={styles.bannerSlide}>
                        <img src="/banner2.jpg" alt="banner" />
                    </div>
                    <div className={styles.bannerSlide}>
                        <img src="/banner3.jpg" alt="banner" />
                    </div>
                    </div>

                    {/* dots */}
                    <div className={styles.bannerDots}>
                    <span className={`${styles.dot} ${styles.active}`}></span>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                    </div>

                </div>
            </div>



            {/* right banners */}
            <div className={styles.bannerRight}>
              <div className={styles.bannerItem}>
                <img src="/banner-right-1.jpg" alt="banner" />
              </div>
              <div className={styles.bannerItem}>
                <img src="/banner-right-2.jpg" alt="banner" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* category */}
      <section className={styles.categorySection}>
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
      </section>

      {/* flash sale */}
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


      {/* top search */}
        <section className={styles.topResearchSection}>
            <div class={styles.topResearchContainer}>
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


      {/* product list */}
      <section className={styles.productSection}>
        <div className={styles.productContainer}>

          <div className={styles.productHeader}>
            <h2 className={styles.sectionTitle}>Products</h2>
            <div className={styles.productFilter}></div>
          </div>

          <div className={styles.productGrid}>
            <div className={styles.productItem}></div>
            <div className={styles.productItem}></div>
            <div className={styles.productItem}></div>
            <div className={styles.productItem}></div>
          </div>

        </div>
      </section>

    </div>
  )
}

export default HomePage
