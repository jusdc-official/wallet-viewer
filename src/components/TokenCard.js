import {
  Contract,
  formatUnits,
  parseUnits
} from "ethers";

import TokenBadge from "./TokenBadge";

const TOKEN_METADATA = {
  JUSDC: {
    chain: "Ethereum",
    mintable: true,
    uniswap: true,
    logoURI: "https://gateway.pinata.cloud/ipfs/QmaEE6jZ8E8cCQ73yA7cdSyCzAjMHEdy5RgXpgmKQn2kMp"
  },
  wUSDC: {
    chain: "Polygon",
    mintable: false,
    uniswap: true,
    logoURI: "https://gateway.pinata.cloud/ipfs/Qma6PRN6i4rPAPyZ8y8vcPUKcDruWgJvRHEJvcTbsog8t2"
  },
  JUSDT: {
    chain: "Base",
    mintable: true,
    uniswap: false,
    logoURI: "https://gateway.pinata.cloud/ipfs/QmXo5RPRjwb6emszehRREa8Ygq3A8aVqqKzmPxo15ZyRuK"
  },
  wUSDT: {
    chain: "Polygon",
    mintable: false,
    uniswap: false,
    logoURI: "https://gateway.pinata.cloud/ipfs/QmPdhc8QsRmw47bq7m3BrKD2C7wHQdVaCLcvFQJ2GZHJm4"
  }
};

export default function TokenCard({ name, address, signer }) {
  const metadata = TOKEN_METADATA[name] || {};
  const logo = metadata.logoURI || `${window.location.origin}/wallet-viewer/assets/default.png`;

  const fetchBalance = async () => {
    try {
      const contract = new Contract(address, [
        "function balanceOf(address) view returns (uint256)"
      ], signer);

      const user = await signer.getAddress();
      const bal = await contract.balanceOf(user);
      const displayBal = parseFloat(formatUnits(bal, 6)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      alert(`${name} balance: $${displayBal}`);
    } catch (err) {
      console.error("Balance error:", err);
      alert("Failed to fetch balance");
    }
  };

  const importToken = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address,
            symbol: name,
            decimals: 6,
            image: logo
          }
        }
      });
    } catch (err) {
      console.error("Token import error:", err);
      alert("Failed to import token");
    }
  };

  const mintToken = async () => {
    try {
      const contract = new Contract(address, [
        "function mint(address to, uint256 amount)"
      ], signer);

      const user = await signer.getAddress();
      const amount = parseUnits("100", 6);
      const tx = await contract.mint(user, amount);
      await tx.wait();

      alert(`🧪 Minted 100 ${name} successfully`);
    } catch (err) {
      console.error("Mint error:", err);
      alert("Mint failed");
    }
  };

  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "1rem",
      marginBottom: "1rem",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      background: "#fff"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <img
          src={logo}
          alt={`${name} logo`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${window.location.origin}/wallet-viewer/assets/default.png`;
          }}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "10px",
            objectFit: "contain",
            backgroundColor: "#fff",
            boxShadow: "0 0 1px rgba(0,0,0,0.15)"
          }}
        />
        <TokenBadge name={name} logo={logo} />
      </div>

      <p><strong>Contract:</strong> {address}</p>
      <p><strong>Chain:</strong> {metadata.chain || "Unknown"}</p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
        <button onClick={fetchBalance}>💰 View Balance</button>
        <button onClick={importToken}>➕ Add to Wallet</button>
        {metadata.mintable && (
          <button onClick={mintToken}>🧪 Mint 100 {name}</button>
        )}
        {metadata.uniswap && (
          <a
            href={`https://app.uniswap.org/#/swap?outputCurrency=${address}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #bbb",
              borderRadius: "4px",
              textDecoration: "none",
              background: "#f6f6f6",
              color: "#444"
            }}
          >
            🟪 View on Uniswap
          </a>
        )}
      </div>
    </div>
  );
}
