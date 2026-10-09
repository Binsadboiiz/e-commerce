import { Link } from 'react-router-dom';
import { 
    FiFacebook, 
    FiYoutube, 
    FiMail 
} from 'react-icons/fi';
import styles from './Footer.module.css';
import { useLanguage } from '@/shared/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footerContainer}>
            {/* Main Columns Grid Footer */}
            <div className={styles.mainFooter}>
                <div className={styles.mainFooterInner}>
                    {/* Col 1: Customer Support */}
                    <div className={styles.colLink}>
                        <h4 className={styles.colTitle}>{t('footer.colCustomerSupport')}</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#help">{t('footer.helpCenter')}</a></li>
                            <li><a href="#guide">{t('footer.buyingGuide')}</a></li>
                            <li><a href="#shipping">{t('footer.shippingPolicy')}</a></li>
                            <li><a href="#return">{t('footer.returnPolicy')}</a></li>
                            <li><a href="#warranty">{t('footer.warrantyPolicy')}</a></li>
                            <li><a href="#voucher">{t('footer.voucherGuide')}</a></li>
                        </ul>
                    </div>

                    {/* Col 2: About PolarisX & Sellers */}
                    <div className={styles.colLink}>
                        <h4 className={styles.colTitle}>{t('footer.colAboutUs')}</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#about">{t('footer.aboutUs')}</a></li>
                            <li><a href="#careers">{t('footer.careers')}</a></li>
                            <li><a href="#terms">{t('footer.termsOfUse')}</a></li>
                            <li><Link to="/seller/register">{t('footer.sellerRegisterLink')}</Link></li>
                            <li><a href="#privacy">{t('footer.privacyPolicyInfo')}</a></li>
                            <li><a href="#affiliate">{t('footer.affiliateProgram')}</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Follow Us */}
                    <div className={styles.colLink}>
                        <h4 className={styles.colTitle}>{t('footer.followUs')}</h4>
                        <ul className={styles.socialList}>
                            <li>
                                <a href="https://www.facebook.com/profile.php?id=61594877923736" target="_blank" rel="noopener noreferrer">
                                    <FiFacebook size={16} />
                                    <span>Facebook</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/@polarisx.studio" target="_blank" rel="noopener noreferrer">
                                    <FiYoutube size={16} />
                                    <span>Youtube</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:polarisxstudio@gmail.com">
                                    <FiMail size={16} />
                                    <span>Email</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Newsletter */}
                    <div className={styles.colNewsletter}>
                        <h4 className={styles.colTitle}>{t('footer.colNewsletter')}</h4>
                        <p className={styles.newsletterDesc}>
                            {t('footer.subscribeDesc')}
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className={styles.subscribeForm}>
                            <div className={styles.inputGroup}>
                                <input 
                                    type="email" 
                                    placeholder={t('footer.emailPlaceholder')} 
                                    className={styles.emailInput} 
                                    required 
                                />
                                <button type="submit" className={styles.subscribeBtn}>
                                    {t('footer.subscribeBtn')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Bar - Centered copyright only */}
            <div className={styles.bottomBar}>
                <div className={styles.bottomBarInner}>
                    <div className={styles.copyright}>
                        © 2026 <strong>Polaris<span className={styles.highlightX}>X</span> Mall</strong>. {t('footer.rightsReserved')}
                    </div>
                </div>
            </div>
        </footer>
    );
}

