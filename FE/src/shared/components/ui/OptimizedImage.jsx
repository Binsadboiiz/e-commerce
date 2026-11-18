import { buildCloudinaryUrl } from '@/shared/utils/cloudinary';

export default function OptimizedImage({
    src,
    alt = '',
    className = '',
    priority = false,
    widths = [],
    sizes = '',
    crop = 'scale',
    width,
    height,
    ...props
}) {
    // Generate base src
    const baseSrc = buildCloudinaryUrl(src, { width, height, crop });

    // Generate srcset
    let srcSet = undefined;
    if (src && src.includes('res.cloudinary.com') && widths.length > 0) {
        srcSet = widths
            .map(w => `${buildCloudinaryUrl(src, { width: w, crop })} ${w}w`)
            .join(', ');
    }

    return (
        <img
            src={baseSrc}
            srcSet={srcSet}
            sizes={srcSet && sizes ? sizes : undefined}
            alt={alt}
            className={className}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            width={width}
            height={height}
            {...props}
        />
    );
}
