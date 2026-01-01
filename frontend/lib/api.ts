const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export interface UploadRecord {
    id: string
    fileName: string
    fileHash: string
    transactionHash: string
    createdAt: string
}

/**
 * Log file upload to backend
 * @param fileName - Name of the uploaded file
 * @param fileHash - SHA-256 hash of the file
 * @param transactionHash - Blockchain transaction hash
 */
export async function logUpload(
    fileName: string,
    fileHash: string,
    transactionHash: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileName,
                fileHash,
                transactionHash,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to log upload')
        }
    } catch (error: any) {
        console.error('API error (logUpload):', error)
        throw new Error(error.message || 'Failed to log upload to backend')
    }
}

/**
 * Fetch upload history from backend
 * @returns Promise resolving to array of upload records
 */
export async function fetchHistory(): Promise<UploadRecord[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/history`)

        if (!response.ok) {
            throw new Error('Failed to fetch history')
        }

        const data = await response.json()
        return data
    } catch (error: any) {
        console.error('API error (fetchHistory):', error)
        throw new Error(error.message || 'Failed to fetch upload history')
    }
}

/**
 * Verify if a file hash exists in the database
 * @param hash - SHA-256 hash to verify
 * @returns Promise resolving to upload record if found, null otherwise
 */
export async function verifyHash(hash: string): Promise<UploadRecord | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/verify/${hash}`)

        if (response.status === 404) {
            return null
        }

        if (!response.ok) {
            throw new Error('Failed to verify hash')
        }

        const data = await response.json()
        return data
    } catch (error: any) {
        console.error('API error (verifyHash):', error)
        throw new Error(error.message || 'Failed to verify hash')
    }
}
