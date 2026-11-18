import styles from './TrustBadges.module.css';
import { IoShieldCheckmarkOutline, IoRefreshOutline, IoLockClosedOutline } from 'react-icons/io5';

import { useLanguage } from '@/shared/context/LanguageContext';

export default function TrustBadges() {
    const { t } = useLanguage();

    const BADGES = [
        {
            id: 'shipping',
            icon: IoShieldCheckmarkOutline,
            title: t('trust.shipping.title') || 'Free Shipping',
            sub: t('trust.shipping.sub') || 'On orders over $50',
        },
        {
            id: 'returns',
            icon: IoRefreshOutline,
            title: t('trust.returns.title') || '15-Day Returns',
            sub: t('trust.returns.sub') || 'Hassle-free policy',
        },
        {
            id: 'secure',
            icon: IoLockClosedOutline,
            title: t('trust.secure.title') || 'Secure Payment',
            sub: t('trust.secure.sub') || '100% protected',
        },
    ];

    return (
        <div className={styles.wrapper}>
            {BADGES.map(({ id, icon: Icon, title, sub }) => (
                <div key={id} className={styles.badge}>
                    <Icon className={styles.icon} aria-hidden="true" />
                    <div className={styles.text}>
                        <span className={styles.title}>{title}</span>
                        <span className={styles.sub}>{sub}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
