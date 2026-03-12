import { motion } from "framer-motion";

interface CreditMeterProps {
  used: number;
  max: number;
  colorKey: string;
  size?: "sm" | "md";
}

const colorMap: Record<string, string> = {
  purple: "#a855f7",
  charcoal: "#6b7280",
  blue: "#3b82f6",
  orange: "#f97316",
  red: "#ef4444",
  yellow: "#eab308",
  navy: "#3b82f6",
  green: "#22c55e",
  teal: "#14b8a6",
  gold: "#f59e0b",
  cyan: "#06b6d4",
  slate: "#64748b",
};

const CreditMeter = ({ used, max, colorKey, size = "sm" }: CreditMeterProps) => {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const barHeight = size === "sm" ? "h-1.5" : "h-2";
  const isFull = pct >= 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {used} / {max} credits
        </span>
        {isFull && (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            FULL
          </span>
        )}
      </div>
      <div className={`w-full ${barHeight} rounded-full bg-secondary overflow-hidden`}>
        <motion.div
          className={`${barHeight} rounded-full`}
          style={{ backgroundColor: colorMap[colorKey] || colorMap.blue }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default CreditMeter;
