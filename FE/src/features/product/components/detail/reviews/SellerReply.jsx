import styles from './SellerReply.module.css';
import { IoStorefrontOutline } from 'react-icons/io5';

/* Seller reply block rendered inside a ReviewCard */
export default function SellerReply({ reply, shopName }) {

    if (!reply) return null;

    const displayName = shopName || 'Seller';

    return (
        <div className={styles.reply}>
            <div className={styles.header}>
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=16a34a&color=fff`}
                    alt={`${displayName} avatar`}
                    className={styles.avatar}
                />
                <span className={styles.label}>{displayName} Reply</span>
            </div>
            <p className={styles.content}>{reply.content}</p>
        </div>
    );
}