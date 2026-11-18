import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/route.config';

/**
 * Standardized Shared Empty State Component
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] - Icon node (e.g. <FiShoppingCart size={36} />)
 * @param {string} props.title - Main empty state title (20px, font-semibold)
 * @param {string} [props.description] - Description text (14px, leading-relaxed)
 * @param {string} [props.actionText] - Primary CTA button label
 * @param {string} [props.actionLink] - Target link for primary CTA
 * @param {Function} [props.onAction] - Custom click handler for CTA
 * @param {string} [props.className] - Additional wrapper CSS classes
 */
export default function EmptyState({
    icon,
    title,
    description,
    actionText,
    actionLink = ROUTES.PRODUCTS_LIST || '/products',
    onAction,
    className = ''
}) {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-16 px-4 min-h-[360px] ${className}`}>
            {/* Circular Icon Badge Container (80px, circular, soft blue background) */}
            {icon && (
                <div className="w-20 h-20 rounded-full bg-blue-50/90 text-primary flex items-center justify-center mb-5 border border-blue-100/70 shadow-sm flex-shrink-0">
                    {icon}
                </div>
            )}

            {/* Empty State Heading */}
            {title && (
                <h2 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
                    {title}
                </h2>
            )}

            {/* Empty State Description */}
            {description && (
                <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                    {description}
                </p>
            )}

            {/* Primary CTA Button */}
            {actionText && (
                onAction ? (
                    <button
                        type="button"
                        onClick={onAction}
                        className="customerBtnPrimary"
                    >
                        <span>{actionText}</span>
                    </button>
                ) : (
                    <Link
                        to={actionLink}
                        className="customerBtnPrimary"
                    >
                        <span>{actionText}</span>
                    </Link>
                )
            )}
        </div>
    );
}
