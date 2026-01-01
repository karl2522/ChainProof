# ChainProof

**Immutable file integrity powered by distributed ledgers.**

ChainProof is a decentralized application that leverages blockchain technology to provide cryptographic proof of file authenticity and integrity. By anchoring file hashes to the Ethereum blockchain, ChainProof creates an immutable, timestamped record that can verify whether a file has been tampered with or modified.

## 🎯 Goal

The primary goal of ChainProof is to provide a trustless, decentralized solution for file verification. In an era where data integrity is paramount, ChainProof ensures that documents, contracts, media files, and other digital assets can be verified with cryptographic certainty. Whether you're a legal professional needing to prove document authenticity, a content creator protecting intellectual property, or an organization maintaining compliance records, ChainProof offers an immutable audit trail that cannot be altered or disputed.

## ✨ Features

### 🔐 File Hash Anchoring
- **Upload & Store**: Securely anchor your file's SHA-256 hash to the Ethereum Sepolia blockchain
- **Cryptographic Hashing**: Client-side SHA-256 hashing using the Web Crypto API ensures file contents never leave your device
- **Smart Contract Integration**: Utilizes a custom ChainProof smart contract to emit `HashAnchored` events on-chain
- **MetaMask Integration**: Seamless wallet connection and transaction signing through MetaMask
- **Transaction Proof**: Every anchored file receives a transaction hash that can be verified on Etherscan

### ✅ File Verification
- **Integrity Checking**: Verify if a file matches its blockchain record by comparing SHA-256 hashes
- **Tamper Detection**: Instantly detect if a file has been modified, corrupted, or altered in any way
- **Historical Records**: Access complete history of all anchored files with timestamps and transaction details
- **Public Ledger View**: Transparent verification through the public blockchain ledger

### 🌐 Modern Web Interface
- **Responsive Design**: Beautiful, modern UI built with Next.js 16 and React 19
- **Real-time Feedback**: Toast notifications and loading states for all blockchain operations
- **Dark Mode Support**: Elegant dark theme with glassmorphism effects
- **Mobile Friendly**: Fully responsive design that works on all devices

### 🔗 Blockchain Features
- **Ethereum Sepolia Network**: Deployed on Ethereum's Sepolia testnet for reliable testing and demonstration
- **Automatic Network Switching**: Prompts users to switch to Sepolia if on the wrong network
- **Transaction Tracking**: Direct links to Etherscan for full transaction transparency
- **Immutable Records**: Once anchored, file hashes cannot be altered or deleted

### 📊 Backend & Database
- **RESTful API**: Built with NestJS for robust, scalable backend operations
- **PostgreSQL Database**: Prisma ORM for efficient data management and querying
- **Upload History**: Complete record of all file anchoring operations
- **Hash Verification Endpoint**: Fast lookup to verify file authenticity
- **CORS Support**: Secure cross-origin resource sharing for frontend-backend communication

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 with custom design system
- **UI Components**: Radix UI primitives for accessible, composable components
- **Blockchain Library**: Ethers.js v6 for Ethereum interactions
- **State Management**: React hooks for local state
- **Notifications**: Sonner for toast notifications

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful endpoints for upload logging and verification
- **Validation**: Class-validator for DTO validation

### Smart Contract
- **Language**: Solidity
- **Network**: Ethereum Sepolia Testnet
- **Function**: `anchor(bytes32 hash)` - Stores file hash on-chain
- **Event**: `HashAnchored` - Emitted when a hash is successfully anchored

## 🚀 How It Works

1. **Upload Flow**:
   - User selects a file through the web interface
   - SHA-256 hash is computed client-side (file never uploaded)
   - User connects MetaMask wallet
   - Hash is submitted to the ChainProof smart contract on Sepolia
   - Transaction is confirmed and hash is anchored on-chain
   - Backend logs the upload with filename, hash, and transaction details

2. **Verification Flow**:
   - User selects a file to verify
   - SHA-256 hash is computed client-side
   - Hash is checked against the backend database
   - If found, file is verified as authentic with original upload details
   - If not found, file is flagged as unverified or potentially tampered

## 📝 Use Cases

- **Legal Documents**: Prove the authenticity and timestamp of contracts, agreements, and legal filings
- **Intellectual Property**: Protect creative works with immutable proof of creation date
- **Compliance Records**: Maintain tamper-proof audit trails for regulatory compliance
- **Academic Credentials**: Verify the authenticity of certificates and diplomas
- **Software Releases**: Ensure software packages haven't been modified or compromised
- **Medical Records**: Verify the integrity of sensitive healthcare documents
- **Supply Chain**: Track and verify document authenticity across supply chains

## 🛡️ Security

- **Client-Side Hashing**: Files are never uploaded to any server; only hashes are stored
- **Blockchain Immutability**: Once anchored, records cannot be altered or deleted
- **Cryptographic Proof**: SHA-256 provides collision-resistant hashing
- **Decentralized Verification**: Anyone can verify file authenticity using the blockchain
- **No Central Authority**: Trust is established through cryptography, not intermediaries

## 🌟 Why ChainProof?

Traditional file verification methods rely on centralized authorities or trusted third parties. ChainProof eliminates this need by leveraging the immutable, transparent nature of blockchain technology. With ChainProof:

- **No Trust Required**: Cryptographic proof replaces the need for trusted intermediaries
- **Permanent Records**: Blockchain ensures your proof of authenticity lasts forever
- **Global Accessibility**: Anyone, anywhere can verify file authenticity
- **Cost-Effective**: Minimal gas fees on Sepolia testnet (free for testing)
- **Privacy-Preserving**: Only file hashes are stored, not the files themselves

---

**Built for the decentralized web** • Developed by Jared Omen • © 2025 ChainProof Protocol
