import styles from "./ProductShippingInfo.module.css";

export default function ProductShippingInfo() {

    return (
        <div className={styles.wrapper}>

            <div className={styles.item}>
                <span className={styles.label}>
                    Shipping
                </span>

                <div className={styles.content}>
                    Guaranteed to get by 16 Jan - 18 Jan
                </div>
            </div>

            <div className={styles.item}>
                <span className={styles.label}>
                    Shopping Guarantee
                </span>

                <div className={styles.content}>
                    15-Day Free Returns
                </div>
            </div>

        </div>
    );
}