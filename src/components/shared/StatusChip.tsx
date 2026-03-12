import { type SelectionStatus } from "@/context/StudentContext";
import { Circle, CheckCircle2 } from "lucide-react";

interface StatusChipProps {
  status: SelectionStatus;
}

const StatusChip = ({ status }: StatusChipProps) => {
  if (status === "not_started") return null;

  const config = {
    draft: {
      bg: "bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300",
      text: "text-amber-800",
      icon: Circle,
      label: "Draft",
    },
    finalized: {
      bg: "bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300",
      text: "text-emerald-800",
      icon: CheckCircle2,
      label: "Full",
    },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[11px] font-bold border-2 shadow-sm ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
};

export default StatusChip;
