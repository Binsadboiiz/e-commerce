export function buildCloudinaryUrl(url, options = {}) {
    if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
        return url;
    }

    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const uploadIndex = pathParts.findIndex(p => p === 'upload');

        if (uploadIndex === -1) return url;

        const { width, height, crop = 'scale', q_auto = true, f_auto = true } = options;

        const transforms = [];
        if (crop) transforms.push(`c_${crop}`);
        if (width) transforms.push(`w_${width}`);
        if (height) transforms.push(`h_${height}`);
        if (q_auto) transforms.push('q_auto');
        if (f_auto) transforms.push('f_auto');

        const transformString = transforms.join(',');

        if (transformString.length === 0) return url;

        // Check if existing transformation exists right after /upload/
        const afterUpload = pathParts[uploadIndex + 1];
        const hasTransform = afterUpload && (afterUpload.includes('c_') || afterUpload.includes('w_') || afterUpload.includes('q_') || afterUpload.includes('f_'));

        if (hasTransform) {
            // Avoid duplicate transformation strings, append if needed, but for safe fallback, just insert if missing.
            // A naive approach is to just keep the URL if it already has transforms, but the prompt says "không duplicate transformation".
            // Since our backend doesn't apply any, it's safe to just inject. If it already has one, we skip.
            return url;
        }

        pathParts.splice(uploadIndex + 1, 0, transformString);
        urlObj.pathname = pathParts.join('/');
        return urlObj.toString();
    } catch (e) {
        return url;
    }
}