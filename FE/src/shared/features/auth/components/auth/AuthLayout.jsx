import styles from './AuthLayout.module.css';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.leftPanel}>
                    <Link to="/" className={styles.brandLink}>
                        <span className={styles.logoBox}>
                            <img src="/logo.png" alt="PolarisX Mall" />
                        </span>
                        <span className={styles.brandName}>
                            Polaris<span className={styles.brandX}>X</span> Mall
                        </span>
                    </Link>

                    <div className={styles.hero}>
                        <h1 className={styles.heroTitle}>Mua sắm thông minh,<br />giao hàng nhanh chóng.</h1>
                        <ul className={styles.perks}>
                            <li>Hàng chính hãng, giá tốt mỗi ngày</li>
                            <li>Theo dõi đơn hàng theo thời gian thực</li>
                            <li>Thanh toán an toàn, đổi trả dễ dàng</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.formContainer}>{children}</div>
                </div>
            </div>
        </div>
    );
}
