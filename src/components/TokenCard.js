import { ethers } from "ethers";

export default function TokenCard({ name, address, signer }) {
  const fetchBalance = async () => {
    const contract = new ethers.Contract(address, [
      "function balanceOf(address) view returns (uint256)"
    ], signer);
    const user = await signer.getAddress();
    const bal = await contract.balanceOf(user);
    alert(`${name} balance: ${ethers.utils.formatUnits(bal, 6)}`);
  };

  const importToken = async () => {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          symbol: name,
          decimals: 6,
          image: "https://jusdc-official.github.io/assets/" + name + ".png"
        }
      }
    });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h3>{name}</h3>
      <p>{address}</p>
      <button onClick={fetchBalance}>💰 View Balance</button>
      <button onClick={importToken}>➕ Add to Wallet</button>
    </div>
  );
}
