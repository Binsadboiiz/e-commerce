import { X, Trash2 } from "lucide-react";
import styles from "./ProductFormModal.module.css";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, product, isSubmitting }) {
    if (!isOpen || !product) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Confirm Deletion</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.deleteIconWrapper}>
                        <Trash2 size={28} />
                    </div>
                    <p className={styles.deleteText}>
                        Are you sure you want to delete product <strong>"{product.name}"</strong>? 
                        <br/><br/>
                        The product will be moved to deleted status and will no longer be visible on the store.
                    </p>
                </div>

                <div className={styles.modalFooter} style={{ justifyContent: 'center' }}>
                    <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="button" className={styles.deleteBtn} onClick={onConfirm} disabled={isSubmitting}>
                        <Trash2 size={18} />
                        {isSubmitting ? "Deleting..." : "Delete Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}
