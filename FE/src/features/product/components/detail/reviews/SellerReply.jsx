import styles from "./SellerReply.module.css";

export default function SellerReply({ reply }) {

    if (!reply) return null;

    return (
        <div className={styles.reply}>

            <strong>Seller</strong>

            <div>{reply.content}</div>

        </div>
    );
}