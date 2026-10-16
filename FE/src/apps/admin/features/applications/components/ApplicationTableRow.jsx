import React from "react";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import ApplicationActions from "./ApplicationActions";

/**
 * ApplicationTableRow Component
 * Displays a single row in the seller applications table.
 *
 * @param {Object} props
 * @param {Object} props.app - The application record
 * @param {Function} props.onView - Callback when View is clicked
 * @param {Function} props.onApprove - Callback when Approve is clicked
 * @param {Function} props.onReject - Callback when Reject is clicked
 */
/**
 * Safely format date handling UTC ISO strings (with or without 'Z'), Date objects, and local timezone.
 */
function formatApplicationDate(dateVal) {
    if (!dateVal) return "-";

    let date;
    if (typeof dateVal === "string") {
        const hasTimezone = dateVal.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(dateVal);
        const normalized = (!hasTimezone && dateVal.includes("T")) ? `${dateVal}Z` : dateVal;
        date = new Date(normalized);
        if (isNaN(date.getTime())) {
            date = new Date(dateVal);
        }
    } else {
        date = new Date(dateVal);
    }

    if (isNaN(date.getTime())) return "-";

    const datePart = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const timePart = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    return `${datePart} ${timePart}`;
}

export default function ApplicationTableRow({
    app,
    onView,
    onStartReview,
    onApprove,
    onReject
}) {
    if (!app) return null;

    // Use submission/update date if available, fallback to creation date
    const rawDate = app.submittedAt || app.updatedAt || app.createdAt;
    const formattedDate = formatApplicationDate(rawDate);

    return (
        <tr>
            <td>
                <div><strong>{app.representative || "N/A"}</strong></div>
                {app.email && <div style={{ fontSize: "12px", color: "#64748b" }}>{app.email}</div>}
                {app.phone && <div style={{ fontSize: "12px", color: "#64748b" }}>{app.phone}</div>}
            </td>
            <td>
                <div><strong>{app.companyName || "N/A"}</strong></div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Tax: {app.taxCode || "N/A"}
                </div>
                {app.licenseNumber && (
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                        License: {app.licenseNumber}
                    </div>
                )}
            </td>
            <td>
                <span style={{ fontSize: "13px", color: "#475569" }}>{app.sellerType || "-"}</span>
            </td>
            <td>
                <ApplicationStatusBadge status={app.status} />
            </td>
            <td>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{formattedDate}</span>
            </td>
            <td style={{ textAlign: "center" }}>
                <ApplicationActions
                    app={app}
                    onView={onView}
                    onStartReview={onStartReview}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            </td>
        </tr>
    );
}
