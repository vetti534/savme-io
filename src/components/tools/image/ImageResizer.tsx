'use client';

import { useState, useRef } from 'react';
import styles from './ImageResizer.module.css';

export default function ImageResizer() {
    const [image, setImage] = useState<string | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [aspectRatio, setAspectRatio] = useState<number>(0);
    const [lockAspect, setLockAspect] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setWidth(img.width);
                    setHeight(img.height);
                    setAspectRatio(img.width / img.height);
                    setImage(event.target?.result as string);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = Number(e.target.value);
        setWidth(newWidth);
        if (lockAspect && aspectRatio) {
            setHeight(Math.round(newWidth / aspectRatio));
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = Number(e.target.value);
        setHeight(newHeight);
        if (lockAspect && aspectRatio) {
            setWidth(Math.round(newHeight * aspectRatio));
        }
    };

    const handleResize = () => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            const resizedImage = canvas.toDataURL('image/jpeg', 0.9);

            // Trigger download
            const link = document.createElement('a');
            link.download = 'resized-image.jpg';
            link.href = resizedImage;
            link.click();
        };
        img.src = image;
    };

    return (
        <div className={styles.container}>
            <div className={styles.uploadArea}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="btn btn-primary">
                    {image ? 'Change Image' : 'Upload Image'}
                </label>
            </div>

            {image && (
                <div className={styles.editor}>
                    <div className={styles.preview}>
                        <img src={image} alt="Preview" className={styles.previewImage} />
                    </div>

                    <div className={styles.controls}>
                        <div className={styles.controlGroup}>
                            <label>Width (px)</label>
                            <input
                                type="number"
                                className="input"
                                value={width}
                                onChange={handleWidthChange}
                            />
                        </div>

                        <div className={styles.controlGroup}>
                            <label>Height (px)</label>
                            <input
                                type="number"
                                className="input"
                                value={height}
                                onChange={handleHeightChange}
                            />
                        </div>

                        <div className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={lockAspect}
                                onChange={(e) => setLockAspect(e.target.checked)}
                                id="lock-aspect"
                            />
                            <label htmlFor="lock-aspect">Lock Aspect Ratio</label>
                        </div>

                        <button className="btn btn-primary" onClick={handleResize}>
                            Resize & Download
                        </button>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
}
