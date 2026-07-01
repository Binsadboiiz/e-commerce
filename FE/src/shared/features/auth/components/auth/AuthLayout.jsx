import styles from './AuthLayout.module.css';

export default function AuthLayout({ children }) {
    return (
        <div className={styles.pageWrapper}>
            {/* Main Container */}
            <div className={styles.container}>
                
                {/* Left Section: Branding & Typography */}
                <div className={styles.leftPanel}>
                    <div>
                        <span className={styles.brandName}>
                            VeloraMall
                        </span>
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