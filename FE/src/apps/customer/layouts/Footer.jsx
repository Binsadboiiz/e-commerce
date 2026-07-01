import styles from "./Footer.module.css"

function Footer() {
  return (
    <footer className={styles.footer}>

      <div className={styles.footerTop}>
        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Get to Know Shop</h4>
          <ul className={styles.footerList}>
            <li className={styles.footerItem}>About Shop</li>
            <li className={styles.footerItem}>Careers</li>
            <li className={styles.footerItem}>Press Releases</li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Make Money with Shop</h4>
          <ul className={styles.footerList}>
            <li className={styles.footerItem}>Sell on Shop</li>
            <li className={styles.footerItem}>Affiliate Program</li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Shop Payment Products</h4>
          <ul className={styles.footerList}>
            <li className={styles.footerItem}>Shop Pay</li>
            <li className={styles.footerItem}>Gift Cards</li>
          </ul>
        </div>
      </div>

      <div className={styles.footerLogoWrap}>
        <img src="/logo.png" alt="Shop Logo" className={styles.footerLogo} />
      </div>

      <div className={styles.footerBottom}>
        © 2026 Shop. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer
