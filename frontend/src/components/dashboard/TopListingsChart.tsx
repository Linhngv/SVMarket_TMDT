import type { TopListingResponse } from "../../types/TopListingResponse";

export default function TopListingsChart({ data }: { data: TopListingResponse[] }) {
  const chartWidth = 900;
  const chartHeight = data.length * 65 + 80;
  const leftSpace = 220;
  const rightSpace = 70;
  const topSpace = 30;
  const rowGap = 65;
  const barHeight = 18;
  const maxVal = Math.max(...data.map((d) => d.viewCount), 1);
  const chartAreaWidth = chartWidth - leftSpace - rightSpace;
  const ticks = [0, 20, 40, 60, 80, 100];

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="chart-svg">
      {/* Axis */}
      <line x1={leftSpace} x2={leftSpace} y1={topSpace} y2={chartHeight - 35} className="chart-axis" />
      <line x1={leftSpace} x2={chartWidth - 35} y1={chartHeight - 35} y2={chartHeight - 35} className="chart-axis" />

      {/* X arrow */}
      <line x1={chartWidth - 35} x2={chartWidth - 42} y1={chartHeight - 35} y2={chartHeight - 40} className="chart-axis" />
      <line x1={chartWidth - 35} x2={chartWidth - 42} y1={chartHeight - 35} y2={chartHeight - 30} className="chart-axis" />

      {/* Ticks */}
      {ticks.map((tick) => {
        const x = leftSpace + (tick / 100) * chartAreaWidth;
        return (
          <g key={tick}>
            <text x={x} y={chartHeight - 10} textAnchor="middle" className="axis-label">
              {tick}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((item, index) => {
        const y = topSpace + index * rowGap;
        const width = (item.viewCount / 100) * chartAreaWidth;
        return (
          <g key={item.id}>
            <text x={15} y={y + 10} className="top-chart-label">{item.title}</text>
            <text x={15} y={y + 30} className="top-chart-type">{item.type}</text>
            {/* Bar - chỉ bo góc bên phải */}
            <path
              d={`M ${leftSpace},${y} h ${Math.max(width - 4, 0)} a 4,4 0 0 1 4,4 v ${barHeight - 8} a 4,4 0 0 1 -4,4 h ${-Math.max(width - 4, 0)} z`}
              fill={item.type === "Gói tin" ? "#22c55e" : "#f59e0b"}
            />
            <text x={leftSpace + width + 12} y={y + 14} className="top-chart-value">
              {item.viewCount}
            </text>
          </g>
        );
      })}
    </svg>
  );
}