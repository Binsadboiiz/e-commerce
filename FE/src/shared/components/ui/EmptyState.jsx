import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/route.config';
import Button from '@/shared/components/ui/Button';

/**
 * Shared empty state: cut-corner icon tile, display title, one clear action.
 *
 * @param {React.ReactNode} [props.icon] - Icon node (e.g. <FiShoppingCart size={36} />)
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.actionText] - Primary CTA label
 * @param {string} [props.actionLink] - Target for the CTA (default: product list)
 * @param {Function} [props.onAction] - Click handler instead of a link
 * @param {string} [props.className]
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
            {icon && (
                <div
                    className="w-20 h-20 bg-[var(--color-primary-light)] text-[var(--color-secondary)] flex items-center justify-center mb-6 flex-shrink-0"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}
                    aria-hidden="true"
                >
                    {icon}
                </div>
            )}

            {title && (
                <h2 className="text-xl text-slate-900 mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                    {title}
                </h2>
            )}

            {description && (
                <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                    {description}
                </p>
            )}

            {actionText && (
                onAction ? (
                    <Button onClick={onAction}>{actionText}</Button>
                ) : (
                    <Link to={actionLink}><Button>{actionText}</Button></Link>
                )
            )}
        </div>
    );
}
