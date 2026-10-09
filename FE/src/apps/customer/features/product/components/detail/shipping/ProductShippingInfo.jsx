import styles from "./ProductShippingInfo.module.css";
import { useLanguage } from '@/shared/context/LanguageContext';

export default function ProductShippingInfo() {
    const { t } = useLanguage();

    return (
        <div className={styles.wrapper}>

            <div className={styles.item}>
                <span className={styles.label}>
                    {t('productDetail.shippingInfo') || 'Shipping'}
                </span>

                <div className={styles.content}>
                    {t('productDetail.guaranteedBy') || 'Guaranteed to get by 16 Jan - 18 Jan'}
                </div>
            </div>

            <div className={styles.item}>
                <span className={styles.label}>
                    {t('productDetail.shoppingGuarantee') || 'Shopping Guarantee'}
                </span>

                <div className={styles.content}>
                    {t('productDetail.freeReturns15Days') || '15-Day Free Returns'}
                </div>
            </div>

        </div>
    );
}