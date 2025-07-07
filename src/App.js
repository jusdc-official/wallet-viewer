import { useEffect, useState } from "react";
import { CONTRACTS_BY_CHAIN } from "./constants/contracts";
import { ethers } from "ethers";
import TokenCard from "./components/TokenCard";

export default function App() {
  const [signer, setSigner] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const setup = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);

      const { chainId } = await provider.getNetwork();
      const cfg = CONTRACTS_BY_CHAIN[chainId];
      if (!cfg) return alert("Unsupported chain");
      setConfig(cfg);
    };
    setup();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🪙 JUSD Wallet Sam Technology</h1>
      {!config ? <p>⏳ Detecting chain...</p> : (
        <>
          <p>🌐 Connected to: {config.name}</p>
          {Object.entries(config.tokens).map(([name, addr]) => (
            <TokenCard key={name} name={name} address={addr} signer={signer} />
          ))}
        </>
      )}
    </div>
  );
}
