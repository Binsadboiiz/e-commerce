import styles from './TrustBadges.module.css';
import { IoShieldCheckmarkOutline, IoRefreshOutline, IoLockClosedOutline } from 'react-icons/io5';

/* Trust signal items — static, no API needed */
const BADGES = [
    {
        id: 'shipping',
        icon: IoShieldCheckmarkOutline,
        title: 'Free Shipping',
        sub: 'On orders over $50',
    },
    {
        id: 'returns',
        icon: IoRefreshOutline,
        title: '15-Day Returns',
        sub: 'Hassle-free policy',
    },
    {
        id: 'secure',
        icon: IoLockClosedOutline,
        title: 'Secure Payment',
        sub: '100% protected',
    },
];

export default function TrustBadges() {
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
