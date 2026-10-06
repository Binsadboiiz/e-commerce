import { Link } from 'react-router-dom';
import { 
    FiPhoneCall, 
    FiMail, 
    FiMapPin, 
    FiFacebook, 
    FiInstagram, 
    FiYoutube, 
    FiSend, 
    FiShield, 
    FiTruck, 
    FiRefreshCw, 
    FiHeadphones 
} from 'react-icons/fi';
import styles from './Footer.module.css';
import { useLanguage } from '@/shared/context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footerContainer}>
            {/* Top Value Commitments Bar */}
            <div className={styles.valueBar}>
                <div className={styles.valueBarInner}>
                    <div className={styles.valueItem}>
                        <FiShield size={28} className={styles.valueIcon} />
                        <div>
                            <h5 className={styles.valueTitle}>{t('value1Title')}</h5>
                            <p className={styles.valueDesc}>{t('value1Desc')}</p>
                        </div>
                    </div>
                    <div className={styles.valueItem}>
                        <FiTruck size={28} className={styles.valueIcon} />
                        <div>
                            <h5 className={styles.valueTitle}>{t('value2Title')}</h5>
                            <p className={styles.valueDesc}>{t('value2Desc')}</p>
                        </div>
                    </div>
                    <div className={styles.valueItem}>
                        <FiRefreshCw size={28} className={styles.valueIcon} />
                        <div>
                            <h5 className={styles.valueTitle}>{t('value3Title')}</h5>
                            <p className={styles.valueDesc}>{t('value3Desc')}</p>
                        </div>
                    </div>
                    <div className={styles.valueItem}>
                        <FiHeadphones size={28} className={styles.valueIcon} />
                        <div>
                            <h5 className={styles.valueTitle}>{t('value4Title')}</h5>
                            <p className={styles.valueDesc}>{t('value4Desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Columns Grid Footer */}
            <div className={styles.mainFooter}>
                <div className={styles.mainFooterInner}>
                    {/* Col 1: Brand Info */}
                    <div className={styles.colBrand}>
                        <Link to="/" className={styles.brandLogo}>
                            <img src="/logo.png" alt="PolarisX Mall Logo" className={styles.logoImg} />
                            <span className={styles.brandName}>
                                Polaris<span className={styles.highlightX}>X</span> Mall
                            </span>
                        </Link>
                        <p className={styles.brandDesc}>
                            {t('brandDesc')}
                        </p>
                        <ul className={styles.contactList}>
                            <li>
                                <FiMapPin size={16} />
                                <span>Tòa nhà PolarisX, Phố Công Nghệ, Hà Nội</span>
                            </li>
                            <li>
                                <FiPhoneCall size={16} />
                                <span>Hotline: 1900 8888 (8:00 - 21:00)</span>
                            </li>
                            <li>
                                <FiMail size={16} />
                                <span>Email: support@polarisx.vn</span>
                            </li>
                        </ul>
                        <div className={styles.socialGroup}>
                            <a href="#facebook" aria-label="Facebook" className={styles.socialBtn}><FiFacebook size={18} /></a>
                            <a href="#instagram" aria-label="Instagram" className={styles.socialBtn}><FiInstagram size={18} /></a>
                            <a href="#youtube" aria-label="Youtube" className={styles.socialBtn}><FiYoutube size={18} /></a>
                        </div>
                    </div>

                    {/* Col 2: Customer Support */}
                    <div className={styles.colLink}>
                        <h4 className={styles.colTitle}>{t('colCustomerSupport')}</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#help">Trung Tâm Trợ Giúp</a></li>
                            <li><a href="#guide">Hướng Dẫn Mua Hàng & Thanh Toán</a></li>
                            <li><a href="#shipping">Chính Sách Vận Chuyển</a></li>
                            <li><a href="#return">Chính Sách Đổi Trả & Hoàn Tiền</a></li>
                            <li><a href="#warranty">Chính Sách Bảo Hành</a></li>
                            <li><a href="#voucher">Hướng Dẫn Sử Dụng Voucher</a></li>
                        </ul>
                    </div>

                    {/* Col 3: About PolarisX & Sellers */}
                    <div className={styles.colLink}>
                        <h4 className={styles.colTitle}>{t('colAboutUs')}</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#about">Giới Thiệu Về Chúng Tôi</a></li>
                            <li><a href="#careers">Tuyển Dụng (Careers)</a></li>
                            <li><a href="#terms">Điều Khoản Sử Dụng</a></li>
                            <li><Link to="/seller/register">Đăng Ký Bán Hàng (Seller)</Link></li>
                            <li><a href="#privacy">Chính Sách Bảo Mật Thông Tin</a></li>
                            <li><a href="#affiliate">Chương Trình Tiếp Thị Liên Kết</a></li>
                        </ul>
                    </div>

                    {/* Col 4: Payment & Shipping Partners */}
                    <div className={styles.colLink}>
                        <h4 className={styles.colTitle}>{t('colPaymentShip')}</h4>
                        <div className={styles.badgeSection}>
                            <h5 className={styles.badgeSubtitle}>Phương Thức Thanh Toán</h5>
                            <div className={styles.badgeGrid}>
                                <span className={styles.payBadge}>COD</span>
                                <span className={styles.payBadge}>VISA</span>
                                <span className={styles.payBadge}>MasterCard</span>
                                <span className={styles.payBadge}>MoMo</span>
                                <span className={styles.payBadge}>VNPay</span>
                            </div>
                        </div>
                        <div className={styles.badgeSection}>
                            <h5 className={styles.badgeSubtitle}>Đơn Vị Vận Chuyển</h5>
                            <div className={styles.badgeGrid}>
                                <span className={styles.shipBadge}>GHN</span>
                                <span className={styles.shipBadge}>GHTK</span>
                                <span className={styles.shipBadge}>ViettelPost</span>
                                <span className={styles.shipBadge}>J&T Express</span>
                            </div>
                        </div>
                    </div>

                    {/* Col 5: App Download & Newsletter */}
                    <div className={styles.colNewsletter}>
                        <h4 className={styles.colTitle}>{t('colNewsletter')}</h4>
                        <p className={styles.newsletterDesc}>
                            {t('subscribeDesc')}
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className={styles.subscribeForm}>
                            <input 
                                type="email" 
                                placeholder={t('emailPlaceholder')} 
                                className={styles.emailInput} 
                                required 
                            />
                            <button type="submit" className="btn btn-primary btn-md">
                                <FiSend size={16} />
                                <span>{t('subscribeBtn')}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright & Legal Bar */}
            <div className={styles.bottomBar}>
                <div className={styles.bottomBarInner}>
                    <div className={styles.copyright}>
                        © 2026 <strong>Polaris<span className={styles.highlightX}>X</span> Mall</strong>. {t('rightsReserved')}
                    </div>
                    <div className={styles.legalLinks}>
                        <a href="#privacy">{t('privacyPolicy')}</a>
                        <span>|</span>
                        <a href="#terms">{t('termsOfService')}</a>
                        <span>|</span>
                        <a href="#legal">{t('legalTerms')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
