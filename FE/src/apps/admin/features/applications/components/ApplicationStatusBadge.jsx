import React from "react";
import Badge from "@/shared/components/ui/Badge";

import { SELLER_STATUS } from "../constants/applicationConstants";

const STATUS_MAP = {
    [SELLER_STATUS.DRAFT]: { label: "Draft", variant: "neutral" },
    [SELLER_STATUS.PENDING]: { label: "Pending", variant: "warning" },
    [SELLER_STATUS.UNDER_REVIEW]: { label: "Under Review", variant: "info" },
    [SELLER_STATUS.APPROVED]: { label: "Approved", variant: "success" },
    [SELLER_STATUS.REJECTED]: { label: "Rejected", variant: "danger" },
    [SELLER_STATUS.SUSPENDED]: { label: "Suspended", variant: "danger" },
    [SELLER_STATUS.BANNED]: { label: "Banned", variant: "danger" },
    [SELLER_STATUS.CLOSED]: { label: "Closed", variant: "neutral" }
};

/**
 * Standard Status Badge for Admin Seller Applications.
 * Reuses the system shared Badge component and maps backend status codes.
 *
 * @param {Object} props
 * @param {string} props.status - Backend status code (PENDING, APPROVED, REJECTED, etc.)
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.dot=true]
 * @param {string} [props.className='']
 */
export default function ApplicationStatusBadge({
    status,
    size = "md",
    dot = true,
    className = ""
}) {
    if (!status) return null;

    const normalized = String(status).toUpperCase();
    const config = STATUS_MAP[normalized] || {
        label: status,
        variant: "neutral"
    };

    return (
        <Badge
            variant={config.variant}
            size={size}
            dot={dot}
            className={className}
        >
            {config.label}
        </Badge>
    );
}
