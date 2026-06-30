import styles from "./ProductShare.module.css";

import {
    FaFacebookF,
    FaTwitter,
    FaPinterestP,
    FaLink
} from "react-icons/fa";

export default function ProductShare() {

    const handleCopyLink = async () => {

        try {

            await navigator.clipboard.writeText(
                window.location.href
            );

            alert("Copied link");

        } catch {
            alert("Copy failed");
        }

    };

    return (
        <div className={styles.wrapper}>

            <div className={styles.left}>

                <span className={styles.label}>
                    Share:
                </span>

                <div className={styles.icons}>

                    <button className={styles.iconBtn} aria-label="Share on Facebook">
                        <FaFacebookF />
                    </button>

                    <button className={styles.iconBtn} aria-label="Share on Twitter">
                        <FaTwitter />
                    </button>

                    <button className={styles.iconBtn} aria-label="Share on Pinterest">
                        <FaPinterestP />
                    </button>

                    <button
                        className={styles.iconBtn}
                        onClick={handleCopyLink}
                        aria-label="Copy link"
                    >
                        <FaLink />
                    </button>

                </div>

            </div>

            <div className={styles.divider} />
        </div>
    );
}