export default function TokenBadge({ name, logo }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.3rem 0.6rem",
      backgroundColor: "#f1f3f5",
      borderRadius: "999px",
      fontSize: "0.85rem",
      fontWeight: 500,
      color: "#333"
    }}>
      <img
        src={logo}
        alt={`${name} badge`}
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />
      {name}
    </div>
  );
}
