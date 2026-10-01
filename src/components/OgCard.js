const LETTERS = [
  ["d", "#4568FF"],
  ["r", "#F84D4E"],
  ["e", "#E0B400"],
  ["w", "#4568FF"],
  [" ", "#ffffff"],
  ["d", "#4DAC2C"],
  ["e", "#E0B400"],
  ["l", "#4568FF"],
  ["l", "#4DAC2C"],
  ["a", "#F84D4E"],
];

export default function OgCard({ title, sub, kicker = "Drew Della" }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        padding: "72px 80px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 54, fontWeight: 500 }}>
        {LETTERS.map(([letter, color], index) => (
          <span key={`${letter}-${index}`} style={{ color, display: "flex" }}>
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 28, color: "#70757a", marginBottom: 12 }}>{kicker}</div>
        <div
          style={{
            fontSize: title.length > 28 ? 56 : 72,
            color: "#202124",
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        {sub ? (
          <div style={{ fontSize: 30, color: "#3c4043", marginTop: 18 }}>{sub}</div>
        ) : null}
      </div>
    </div>
  );
}
