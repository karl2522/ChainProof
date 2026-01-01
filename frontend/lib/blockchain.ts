import { BrowserProvider } from 'ethers'

// Ethereum Sepolia Chain ID
const SEPOLIA_CHAIN_ID = '0xaa36a7' // 11155111 in hex

/**
 * Connect to MetaMask wallet
 * @returns Promise resolving to the connected wallet address
 */
export async function connectWallet(): Promise<string> {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this feature.')
    }

    try {
        // Request account access
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])

        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Please unlock MetaMask.')
        }

        // Check if user is on Sepolia network
        const network = await provider.getNetwork()
        if (network.chainId !== BigInt(11155111)) {
            // Request network switch to Sepolia
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: SEPOLIA_CHAIN_ID }],
                })
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    throw new Error('Please add Ethereum Sepolia network to MetaMask.')
                }
                throw switchError
            }
        }

        return accounts[0]
    } catch (error: any) {
        console.error('Wallet connection error:', error)
        throw new Error(error.message || 'Failed to connect wallet')
    }
}

/**
 * Get the current connected wallet address
 * @returns Promise resolving to wallet address or null if not connected
 */
export async function getConnectedWallet(): Promise<string | null> {
    if (typeof window.ethereum === 'undefined') {
        return null
    }

    try {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_accounts', [])
        return accounts && accounts.length > 0 ? accounts[0] : null
    } catch (error) {
        console.error('Error getting connected wallet:', error)
        return null
    }
}

/**
 * Submit file hash to blockchain via ChainProof smart contract
 * @param hash - SHA-256 hash of the file (hex string without 0x prefix)
 * @returns Promise resolving to transaction hash
 */
export async function submitHashToBlockchain(hash: string): Promise<string> {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed')
    }

    try {
        const { Contract } = await import('ethers')
        const { CHAINPROOF_ABI, CONTRACT_ADDRESS } = await import('./contract-abi')

        if (!CONTRACT_ADDRESS) {
            throw new Error('Contract address not configured. Please deploy the contract first.')
        }

        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        // Create contract instance
        const contract = new Contract(CONTRACT_ADDRESS, CHAINPROOF_ABI, signer)

        // Convert hex hash to bytes32 format (add 0x prefix)
        const hashBytes32 = '0x' + hash

        // Call anchor function on contract
        const tx = await contract.anchor(hashBytes32)

        // Wait for transaction to be mined
        await tx.wait()

        return tx.hash
    } catch (error: any) {
        console.error('Blockchain submission error:', error)

        // Handle user rejection
        if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
            throw new Error('Transaction rejected by user')
        }

        throw new Error(error.message || 'Failed to submit hash to blockchain')
    }
}

/**
 * Retrieve hash from blockchain transaction
 * @param txHash - Transaction hash
 * @returns Promise resolving to the file hash stored in transaction data
 */
export async function getStoredHash(txHash: string): Promise<string> {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed')
    }

    try {
        const provider = new BrowserProvider(window.ethereum)
        const tx = await provider.getTransaction(txHash)

        if (!tx) {
            throw new Error('Transaction not found')
        }

        // Extract hash from transaction data (remove '0x' prefix)
        const hash = tx.data.slice(2)

        if (!hash || hash.length !== 64) {
            throw new Error('Invalid hash in transaction data')
        }

        return hash
    } catch (error: any) {
        console.error('Error retrieving hash from blockchain:', error)
        throw new Error(error.message || 'Failed to retrieve hash from blockchain')
    }
}

/**
 * Format wallet address for display (truncated)
 * @param address - Full wallet address
 * @returns Truncated address (e.g., "0x1234...5678")
 */
export function formatAddress(address: string): string {
    if (!address || address.length < 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Type declaration for window.ethereum
declare global {
    interface Window {
        ethereum?: any
    }
}
