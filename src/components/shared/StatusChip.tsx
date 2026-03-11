import { type SelectionStatus } from "@/context/StudentContext";

interface StatusChipProps {
  status: SelectionStatus;
}

const StatusChip = ({ status }: StatusChipProps) => {
  if (status === "not_started") return null;

  const styles: Record<string, string> = {
    draft: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
    finalized: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  };

  const labels: Record<string, string> = {
    draft: "Draft",
    finalized: "Finalized",
  };

  return (
    <span className={`inline-flex items-center h-5 px-2 rounded-md text-[11px] font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default StatusChip;
