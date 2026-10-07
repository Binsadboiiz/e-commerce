import React, { useState, useRef } from "react";
import { UploadCloud, Star, Trash2, Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { sellerProductApi } from "../api/sellerProductApi";
import { notify } from "@/shared/utils/Notify";
import styles from "./CloudinaryImageUploader.module.css";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function CloudinaryImageUploader({
    images = [],
    onChange,
    maxImages = 10
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef(null);

    const handleFilesUpload = async (files) => {
        if (!files || files.length === 0) return;

        const validFiles = [];
        for (const file of files) {
            if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
                notify.error(`File "${file.name}" is not a valid format. Only JPG, PNG, WebP allowed.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                notify.error(`File "${file.name}" exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        if (images.length + validFiles.length > maxImages) {
            notify.error(`You can only upload a maximum of ${maxImages} images.`);
            return;
        }

        try {
            setIsUploading(true);
            const res = await sellerProductApi.uploadImages(validFiles);
            const newUrls = res?.urls || (res?.url ? [res.url] : (Array.isArray(res) ? res : []));
            
            if (newUrls && newUrls.length > 0) {
                const updated = [...images, ...newUrls];
                onChange(updated);
                notify.success(`Uploaded ${newUrls.length} image(s) to Cloudinary successfully!`);
            } else {
                notify.error("Upload succeeded but no image URLs were returned.");
            }
        } catch (err) {
            console.error("Cloudinary upload failed:", err);
            const msg = err?.response?.data?.message || err?.message || "Failed to upload images to Cloudinary.";
            notify.error(msg);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleFileChange = (e) => {
        handleFilesUpload(Array.from(e.target.files));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesUpload(Array.from(e.dataTransfer.files));
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        const updated = images.filter((_, idx) => idx !== indexToRemove);
        onChange(updated);
    };

    const handleSetPrimary = (indexToPrimary) => {
        if (indexToPrimary === 0) return;
        const targetUrl = images[indexToPrimary];
        const remaining = images.filter((_, idx) => idx !== indexToPrimary);
        onChange([targetUrl, ...remaining]);
        notify.success("Set as primary image!");
    };

    const handleAddUrl = () => {
        if (!urlInput.trim()) return;
        if (images.length >= maxImages) {
            notify.error(`Maximum limit of ${maxImages} images reached.`);
            return;
        }
        onChange([...images, urlInput.trim()]);
        setUrlInput("");
        setShowUrlInput(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.uploadHeader}>
                <label className={styles.title}>Product Images * (Cloudinary)</label>
                <span className={styles.countInfo}>{images.length} / {maxImages} images</span>
            </div>

            {/* Drop Zone */}
            <div
                className={`${styles.dropZone} ${isDragOver ? styles.dropZoneActive : ""} ${isUploading || images.length >= maxImages ? styles.dropZoneDisabled : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && images.length < maxImages && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                    disabled={isUploading || images.length >= maxImages}
                />

                {isUploading ? (
                    <div className={styles.loaderOverlay}>
                        <Loader2 className={styles.spinner} size={28} />
                        <span>Uploading images to Cloudinary...</span>
                    </div>
                ) : (
                    <>
                        <UploadCloud className={styles.uploadIcon} />
                        <div className={styles.dropText}>
                            Drag and drop product images here, or <span className={styles.browseLink}>Browse files</span>
                        </div>
                        <div className={styles.dropHint}>
                            Supports JPG, PNG, WebP (Max {MAX_FILE_SIZE_MB}MB each). Up to {maxImages} images.
                        </div>
                    </>
                )}
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className={styles.imageGrid}>
                    {images.map((url, idx) => {
                        const isPrimary = idx === 0;
                        return (
                            <div
                                key={url + idx}
                                className={`${styles.imageCard} ${isPrimary ? styles.primaryCard : ""}`}
                            >
                                <img src={url} alt={`Product ${idx + 1}`} className={styles.thumbnail} />
                                
                                {isPrimary && (
                                    <div className={styles.primaryBadge}>
                                        <Star size={10} fill="#ffffff" /> Primary
                                    </div>
                                )}

                                <div className={styles.cardActions}>
                                    {!isPrimary && (
                                        <button
                                            type="button"
                                            className={styles.actionBtn}
                                            title="Set as Main Image"
                                            onClick={() => handleSetPrimary(idx)}
                                        >
                                            <Star size={16} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        title="Delete Image"
                                        onClick={() => handleRemoveImage(idx)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* URL Fallback option */}
            {!showUrlInput ? (
                <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                    onClick={() => setShowUrlInput(true)}
                >
                    <Plus size={14} /> Or add image by URL
                </button>
            ) : (
                <div className={styles.urlInputRow}>
                    <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className={styles.urlInput}
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <button type="button" className={styles.addUrlBtn} onClick={handleAddUrl}>
                        Add URL
                    </button>
                    <button type="button" className={styles.addUrlBtn} onClick={() => setShowUrlInput(false)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
