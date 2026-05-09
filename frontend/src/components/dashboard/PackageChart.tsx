import { PackageBar } from "../../types/PackageBar";

const W = 900;
const BAR_H = 320;
const PAD_L = 70;
const PAD_R = 40;
const PAD_T = 50;
const PAD_B = 60;

function yTicks(max: number) {
  if (max <= 20) return [0, 5, 10, 15, 20];
  let step = 10;
  if (max <= 50) step = 10;
  else if (max <= 100) step = 20;
  else if (max <= 200) step = 50;
  else if (max <= 500) step = 100;
  else step = Math.ceil(max / 5 / 100) * 100;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step; v += step) ticks.push(v);
  return ticks;
}

export default function PackageChart({ data }: { data: PackageBar[] }) {
  const maxVal = Math.max(
    ...data.flatMap((d) => [d.normalViews, d.packageViews]),
    1,
  );
  const ticks = yTicks(maxVal);
  const topTick = ticks[ticks.length - 1];
  const chartH = BAR_H - PAD_T - PAD_B;

  return (
    <svg viewBox={`0 0 ${W} ${BAR_H}`} className="chart-svg">
      <text x={20} y={25} className="chart-small-label">
        Lượt xem
      </text>

      {ticks.map((tick) => {
        const y = PAD_T + chartH - (tick / topTick) * chartH;
        return (
          <g key={tick}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y}
              y2={y}
              className="chart-grid-line"
            />
            <text
              x={PAD_L - 12}
              y={y + 4}
              textAnchor="end"
              className="axis-label"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* Y axis */}
      <line
        x1={PAD_L}
        x2={PAD_L}
        y1={PAD_T}
        y2={PAD_T + chartH}
        className="chart-axis"
      />
      {/* X axis */}
      <line
        x1={PAD_L}
        x2={W - PAD_R}
        y1={PAD_T + chartH}
        y2={PAD_T + chartH}
        className="chart-axis"
      />

      {/* Y arrow */}
      <line
        x1={PAD_L}
        x2={PAD_L - 5}
        y1={PAD_T}
        y2={PAD_T + 6}
        className="chart-axis"
      />
      <line
        x1={PAD_L}
        x2={PAD_L + 5}
        y1={PAD_T}
        y2={PAD_T + 6}
        className="chart-axis"
      />

      {/* X arrow */}
      <line
        x1={W - PAD_R}
        x2={W - PAD_R - 6}
        y1={PAD_T + chartH}
        y2={PAD_T + chartH - 5}
        className="chart-axis"
      />
      <line
        x1={W - PAD_R}
        x2={W - PAD_R - 6}
        y1={PAD_T + chartH}
        y2={PAD_T + chartH + 5}
        className="chart-axis"
      />

      {data.map((item, index) => {
        const baseX = 120 + index * 120;
        const normalHeight = (item.normalViews / topTick) * chartH;
        const packageHeight = (item.packageViews / topTick) * chartH;

        return (
          <g key={item.category}>
            <rect
              x={baseX}
              y={PAD_T + chartH - normalHeight}
              width={32}
              height={normalHeight}
              fill="#e7f0ea"
              rx={4}
            />

            <rect
              x={baseX + 40}
              y={PAD_T + chartH - packageHeight}
              width={32}
              height={packageHeight}
              fill="#006b2d"
              rx={4}
            />

            <text
              x={baseX + 36}
              y={BAR_H - 18}
              textAnchor="middle"
              className="bottom-label"
            >
              {item.category}
            </text>
          </g>
        );
      })}

      <text
        x={W - PAD_R - 2}
        y={BAR_H - 18}
        textAnchor="end"
        className="bottom-label"
      >
        Danh mục
      </text>
    </svg>
  );
}

export type { PackageBar };
