import { motion } from "framer-motion";

interface CreditMeterProps {
  used: number;
  max: number;
  colorKey: string;
  size?: "sm" | "md";
}

const colorMap: Record<string, string> = {
  purple: "hsl(var(--cat-purple))",
  charcoal: "hsl(var(--cat-charcoal))",
  blue: "hsl(var(--cat-blue))",
  orange: "hsl(var(--cat-orange))",
  red: "hsl(var(--cat-red))",
  yellow: "hsl(var(--cat-yellow))",
  navy: "hsl(var(--cat-navy))",
  green: "hsl(var(--cat-green))",
  teal: "hsl(var(--cat-teal))",
  gold: "hsl(var(--cat-gold))",
  cyan: "hsl(var(--cat-cyan))",
  slate: "hsl(var(--cat-slate))",
};

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

const CreditMeter = ({ used, max, colorKey, size = "sm" }: CreditMeterProps) => {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const barHeight = size === "sm" ? "h-1" : "h-2";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {used} / {max} Credits
        </span>
      </div>
      <div className={`w-full ${barHeight} rounded-full bg-secondary overflow-hidden`}>
        <motion.div
          className={`${barHeight} rounded-full`}
          style={{ backgroundColor: colorMap[colorKey] || colorMap.blue }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={spring}
          layout
        />
      </div>
    </div>
  );
};

export default CreditMeter;
