import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        // Build the path without using path.join
        const pathSegments = (await params).path;
        const filePath = `${UPLOAD_DIR}/${pathSegments.join('/')}`;

        // Check that the path is secure (no directory traversal).
        const normalizedPath = filePath.replace(/\.\./g, ''); // Simple protection
        if (!normalizedPath.startsWith(UPLOAD_DIR)) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        // Lire le fichier
        const fileBuffer = new Uint8Array(await fs.readFile(normalizedPath)).buffer;

        // Determine the MIME type based on the extension
        const getExtension = (filename: string) => {
            const lastDotIndex = filename.lastIndexOf('.');
            return lastDotIndex !== -1 ? filename.slice(lastDotIndex).toLowerCase() : '';
        };

        const extension = getExtension(normalizedPath);
        const mimeTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };

        const mimeType = mimeTypes[extension] || 'application/octet-stream';

        return new NextResponse(new Blob([fileBuffer]), {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000', // Cache 1 an
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Error reading the file:', error);
        return new NextResponse('File not found', { status: 404 });
    }
}