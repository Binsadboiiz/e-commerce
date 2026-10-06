import { X, Trash2 } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import styles from "./ProductFormModal.module.css";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, product, isSubmitting }) {
    if (!isOpen || !product) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Confirm Deletion</h2>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
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
                    <Button 
                        variant="outline" 
                        onClick={onClose} 
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={onConfirm} 
                        isLoading={isSubmitting}
                        icon={<Trash2 size={18} />}
                    >
                        Delete Product
                    </Button>
                </div>
            </div>
        </div>
    );
}
