import styles from './Skeleton.module.css';

/**
 * Shared skeleton primitive – dùng chung cho toàn project.
 *
 * @param {object}  props
 * @param {string|number} [props.width]        - CSS width (vd: "100%", 200)
 * @param {string|number} [props.height]       - CSS height (vd: 16, "1em")
 * @param {string|number} [props.borderRadius] - CSS border-radius (vd: "50%", 8)
 * @param {string}        [props.className]    - Class bổ sung từ module CSS cha
 * @param {object}        [props.style]        - Inline style bổ sung
 */
export default function Skeleton({ width, height, borderRadius, className = '', style = {} }) {
    const inlineStyle = {
        ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
        ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
        ...(borderRadius !== undefined && {
            borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        }),
        ...style,
    };

    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={inlineStyle}
            aria-hidden="true"
        />
    );
}
