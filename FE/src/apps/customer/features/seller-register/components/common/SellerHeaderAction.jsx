import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerHeader } from '../../hooks/useSellerHeader';
import { SELLER_HEADER_ACTION } from '../../constants/sellerHeaderAction';
import { ROUTES } from '@/config/route.config';

export default function SellerHeaderAction() {
    const { action } = useSellerHeader();
    const navigate = useNavigate();

    const handleClick = () => {
        if (action === SELLER_HEADER_ACTION.REGISTER) {
            navigate(ROUTES.SELLER_REGISTRATION);
        } else if (action === SELLER_HEADER_ACTION.SELLER_CENTER) {
            navigate(ROUTES.SELLER_DASHBOARD);
        }
    };

    switch (action) {
        case SELLER_HEADER_ACTION.REGISTER:
            return (
                <span onClick={handleClick} style={{ cursor: 'pointer', marginRight: '15px' }}>
                    Register as Seller
                </span>
            );
        case SELLER_HEADER_ACTION.SELLER_CENTER:
            return (
                <span onClick={handleClick} style={{ cursor: 'pointer', marginRight: '15px' }}>
                    Seller Center
                </span>
            );
        default:
            return null;
    }
}