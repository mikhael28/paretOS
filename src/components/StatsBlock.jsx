export default function StatsBlock({ statName, score }) {
  return (
    <div className="block stats-block">
      <div
        style={{
          fontSize: 14,
        }}
      >
        {statName}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "end",
          height: "100%",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        {score}
      </div>
    </div>
  );
}
