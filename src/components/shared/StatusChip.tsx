import { type SelectionStatus } from "@/context/StudentContext";
import { Circle, CheckCircle2 } from "lucide-react";

interface StatusChipProps {
  status: SelectionStatus;
}

const StatusChip = ({ status }: StatusChipProps) => {
  if (status === "not_started") return null;

  const config = {
    draft: {
      bg: "bg-amber-50 border-amber-200/60",
      text: "text-amber-700",
      icon: Circle,
      label: "Draft",
    },
    finalized: {
      bg: "bg-emerald-50 border-emerald-200/60",
      text: "text-emerald-700",
      icon: CheckCircle2,
      label: "Finalized",
    },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-semibold border ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
};

export default StatusChip;
