import React, { useState } from "react";
import styles from "./DocumentViewer.module.css";

/**
 * DocumentViewer Component
 * Full-screen lightbox viewer for uploaded verification documents with zoom controls.
 *
 * @param {Object} props
 * @param {string} props.fileUrl - Document image URL
 * @param {string} props.title - Document type / title
 * @param {Function} props.onClose - Close viewer callback
 */
export default function DocumentViewer({ fileUrl, title, onClose }) {
    const [zoom, setZoom] = useState(1);

    if (!fileUrl) return null;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
    const handleResetZoom = () => setZoom(1);

    return (
        <div className={styles.viewerOverlay} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.viewerContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.viewerHeader}>
                    <span className={styles.viewerTitle}>{title || "Document View"}</span>
                    <div className={styles.viewerControls}>
                        <button
                            type="button"
                            className={styles.controlBtn}
                            onClick={handleZoomOut}
                            title="Zoom out"
                        >
                            -
                        </button>
                        <button
                            type="button"
                            className={styles.controlBtn}
                            onClick={handleResetZoom}
                            title="Reset zoom"
                        >
                            {Math.round(zoom * 100)}%
                        </button>
                        <button
                            type="button"
                            className={styles.controlBtn}
                            onClick={handleZoomIn}
                            title="Zoom in"
                        >
                            +
                        </button>
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.controlBtn}
                            title="Open in new tab"
                        >
                            ↗ Open Tab
                        </a>
                        <button
                            type="button"
                            className={styles.controlBtn}
                            onClick={onClose}
                            title="Close"
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>

                <div className={styles.imageFrame}>
                    <img
                        src={fileUrl}
                        alt={title || "Document"}
                        className={styles.fullImage}
                        style={{ transform: `scale(${zoom})` }}
                    />
                </div>
            </div>
        </div>
    );
}
