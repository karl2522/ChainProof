const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Deploying ChainProof contract to Sepolia...");

    const ChainProof = await hre.ethers.getContractFactory("ChainProof");
    const chainProof = await ChainProof.deploy();

    await chainProof.waitForDeployment();

    const address = await chainProof.getAddress();

    console.log("✅ ChainProof deployed to:", address);

    // Save contract address to file for frontend
    const deploymentInfo = {
        address: address,
        network: "sepolia",
        deployedAt: new Date().toISOString(),
    };

    const outputPath = path.join(__dirname, "../deployment.json");
    fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));

    console.log("📝 Deployment info saved to deployment.json");
    console.log("\n🔗 View on Etherscan:");
    console.log(`https://sepolia.etherscan.io/address/${address}`);
    console.log("\n⚠️  Add this address to frontend/.env.local:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
