import React from 'react';
import Badge from '@/shared/components/ui/Badge';
import { useLanguage } from '@/shared/context/LanguageContext';

/**
 * Standard Status Badge for Seller Registration / Customer Seller Feature.
 * Reflects exact database status codes from Seller_statuses table.
 * Does not display for DRAFT status.
 */
export default function SellerStatusBadge({ status, statusCode, className = '', size = 'md' }) {
    const { t } = useLanguage();
    const code = (statusCode || status || '').toUpperCase();

    // Exclude draft status
    if (!code || code === 'DRAFT') {
        return null;
    }

    let variant = 'neutral';
    let label = status || code;

    switch (code) {
        case 'PENDING':
            variant = 'warning';
            label = t ? t('sellerReview.statusPending') : 'Pending';
            break;
        case 'UNDER_REVIEW':
            variant = 'info';
            label = t ? t('sellerReview.statusUnderReview') : 'Under Review';
            break;
        case 'APPROVED':
            variant = 'success';
            label = t ? t('sellerReview.statusApproved') : 'Approved';
            break;
        case 'REJECTED':
            variant = 'danger';
            label = t ? t('sellerReview.statusRejected') : 'Rejected';
            break;
        case 'SUSPENDED':
            variant = 'danger';
            label = 'Suspended';
            break;
        case 'BANNED':
            variant = 'danger';
            label = 'Banned';
            break;
        case 'CLOSED':
            variant = 'neutral';
            label = 'Closed';
            break;
        default:
            variant = 'neutral';
            label = status || code;
            break;
    }

    return (
        <Badge variant={variant} size={size} className={className}>
            {label}
        </Badge>
    );
}