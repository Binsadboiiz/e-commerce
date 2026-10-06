import React from 'react';

/**
 * Standard Reusable System Button
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'outline'|'outline-primary'|'danger'|'success'|'warning'|'ghost'|'link'} [props.variant='primary']
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {boolean} [props.fullWidth=false]
 * @param {boolean} [props.iconOnly=false]
 * @param {React.ReactNode} [props.icon] - Left icon
 * @param {React.ReactNode} [props.iconRight] - Right icon
 * @param {boolean} [props.isLoading=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className='']
 * @param {string} [props.type='button']
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconOnly = false,
  icon = null,
  iconRight = null,
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const fullWidthClass = fullWidth ? 'btn-full' : '';
  const iconOnlyClass = iconOnly ? 'btn-icon' : '';

  const combinedClasses = [
    'btn',
    variantClass,
    sizeClass,
    fullWidthClass,
    iconOnlyClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin"
            style={{ width: '1em', height: '1em', color: 'currentColor' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon-left">{icon}</span>}
          {children && <span>{children}</span>}
          {iconRight && <span className="btn-icon-right">{iconRight}</span>}
        </>
      )}
    </button>
  );
}
