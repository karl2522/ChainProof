// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ChainProof
 * @dev Lightweight contract for anchoring file hashes to the blockchain
 */
contract ChainProof {
    event HashAnchored(
        bytes32 indexed hash,
        address indexed sender,
        uint256 timestamp
    );

    /**
     * @dev Anchor a file hash to the blockchain
     * @param hash The SHA-256 hash of the file
     */
    function anchor(bytes32 hash) external {
        emit HashAnchored(hash, msg.sender, block.timestamp);
    }
}
