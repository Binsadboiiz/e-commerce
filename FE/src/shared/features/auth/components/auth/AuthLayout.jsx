import styles from './AuthLayout.module.css';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
    return (
        <div className={styles.pageWrapper}>
            {/* Main Container */}
            <div className={styles.container}>
                
                {/* Left Section: Branding & Typography */}
                <div className={styles.leftPanel}>
                    <div>
                        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            <img src="/logo.png" alt="PolarisX Mall Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                            <span className={styles.brandName} style={{ fontSize: '18px', textTransform: 'none', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
                                Polaris<span style={{ color: '#2563eb', fontWeight: 900, fontSize: '20px', margin: '0 1px' }}>X</span> Mall
                            </span>
                        </Link>

                        <h1 className={styles.heroTitle}>
                            Secure<br />
                            Access<br />
                            Portal.
                        </h1>
                    </div>
                    
                    <div className={styles.quoteSection}>
                        <p className={styles.quoteText}>
                            "Simplicity is the ultimate sophistication."
                        </p>
                        <div className={styles.quoteLine}></div>
                    </div>
                </div>

                {/* Right Section: Form area */}
                <div className={styles.rightPanel}>
                    <div className={styles.formContainer}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}