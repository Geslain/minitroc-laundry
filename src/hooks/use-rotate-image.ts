import { useCallback, useState } from "react";

export type ImageMime = "image/jpeg" | "image/png" | "image/webp";

export interface RotateOptions {
    angle?: 0 | 90 | 180 | 270;     // défaut: 90
    mimeType?: ImageMime;           // défaut: "image/jpeg"
    quality?: number;               // 0..1 (JPEG/WebP), défaut: 0.95
}

/**
 * Pivote un Blob d'image et retourne un nouveau Blob réellement pivoté.
 */
export async function rotateImageBlob(
    blob: Blob,
    opts: RotateOptions = {}
): Promise<Blob> {
    const { angle = 90, mimeType = "image/jpeg", quality = 0.95 } = opts;

    // 1) Charger l'image depuis le Blob
    const url = URL.createObjectURL(blob);
    try {
        const img = await loadImage(url);

        // 2) Préparer le canvas (inversion LxH si 90°/270°)
        const canvas = document.createElement("canvas");
        const needsSwap = angle % 180 !== 0;
        canvas.width  = needsSwap ? img.height : img.width;
        canvas.height = needsSwap ? img.width  : img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D context unavailable");

        // 3) Transformer et dessiner
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // 4) Exporter un nouveau Blob
        const out = await canvasToBlob(canvas, mimeType, quality);
        if (!out) throw new Error("Failed to export canvas to Blob");
        return out;
    } finally {
        URL.revokeObjectURL(url);
    }
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = src;
    });
}

function canvasToBlob(
    canvas: HTMLCanvasElement,
    type: ImageMime,
    quality?: number
): Promise<Blob | null> {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export function useRotateImage() {
    const [rotating, setRotating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const rotate = useCallback(
        async (blob: Blob, opts?: RotateOptions) => {
            setRotating(true);
            setError(null);
            try {
                const out = await rotateImageBlob(blob, opts);
                return out;
            } catch (e) {
                const err = e instanceof Error ? e : new Error(String(e));
                setError(err);
                throw err;
            } finally {
                setRotating(false);
            }
        },
        []
    );

    return { rotate, rotating, error };
}