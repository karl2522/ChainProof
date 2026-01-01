/**
 * Compute SHA-256 hash of a file using Web Crypto API
 * @param file - File to hash
 * @returns Promise resolving to hex string of the hash
 */
export async function computeFileHash(file: File): Promise<string> {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Compute SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return hashHex
}
