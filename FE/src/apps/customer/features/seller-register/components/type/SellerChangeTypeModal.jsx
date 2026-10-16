import React from "react";
import styles from "./SellerChangeTypeModal.module.css";

export default function SellerChangeTypeModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>Xác Nhận Thay Đổi Loại Gian Hàng</h3>
                
                <p className={styles.message}>
                    Thao tác này sẽ thực hiện xóa bỏ:
                </p>
                
                <ul className={styles.list}>
                    <li>Thông tin địa chỉ kho hàng đã nhập</li>
                    <li>Tài khoản ngân hàng nhận thanh toán</li>
                    <li>Thông tin pháp lý doanh nghiệp (nếu có)</li>
                    <li>Toàn bộ chứng từ hình ảnh đã tải lên</li>
                </ul>
                
                <p className={styles.subMessage}>
                    Thao tác này không thể hoàn tác. Bạn có chắc chắn muốn thay đổi không?
                </p>
                
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Hủy Bỏ
                    </button>
                    <button className={styles.confirmBtn} onClick={onConfirm}>
                        Đồng Ý Thay Đổi
                    </button>
                </div>
            </div>
        </div>
    );
}
