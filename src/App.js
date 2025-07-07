import { useEffect, useState } from "react";
import { CONTRACTS_BY_CHAIN } from "./constants/contracts";
import { BrowserProvider } from "ethers";
import TokenCard from "./components/TokenCard";

export default function App() {
  const [signer, setSigner] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const setup = async () => {
      try {
        if (!window.ethereum) {
          alert("No wallet detected. Please install MetaMask.");
          return;
        }

        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signerInstance = await provider.getSigner();
        setSigner(signerInstance);

        const { chainId } = await provider.getNetwork();
        console.log("✅ Detected Chain ID:", chainId);

        const cfg = CONTRACTS_BY_CHAIN[chainId];
        if (!cfg) {
          alert(`Unsupported chain ID: ${chainId}`);
          return;
        }

        setConfig(cfg);
      } catch (err) {
        console.error("Connection error:", err);
        alert("Failed to connect wallet.");
      }
    };

    setup();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🪙 JUSD Wallet — Sam Technology</h1>
      {!config || !signer ? (
        <p>⏳ Connecting wallet and detecting network...</p>
      ) : (
        <>
          <p>🌐 Connected to <strong>{config.name}</strong></p>
          {Object.entries(config.tokens).map(([name, address]) => (
            <TokenCard key={name} name={name} address={address} signer={signer} />
          ))}
        </>
      )}
    </div>
  );
}
