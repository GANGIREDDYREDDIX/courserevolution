import type { EduRevOptionType } from "@/data/eduRevTypes";

interface EduRevOptionCardProps {
  type: EduRevOptionType;
  label: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

const colorMap: Record<EduRevOptionType, { bg: string; border: string; iconBg: string }> = {
  revenue_generation: { bg: "bg-purple-50", border: "border-purple-300", iconBg: "bg-purple-100" },
  projects: { bg: "bg-blue-50", border: "border-blue-300", iconBg: "bg-blue-100" },
  social_media: { bg: "bg-pink-50", border: "border-pink-300", iconBg: "bg-pink-100" },
  rpl: { bg: "bg-orange-50", border: "border-orange-300", iconBg: "bg-orange-100" },
  nptel_moocs: { bg: "bg-amber-50", border: "border-amber-300", iconBg: "bg-amber-100" },
  grade_upgrade: { bg: "bg-emerald-50", border: "border-emerald-300", iconBg: "bg-emerald-100" },
  internship: { bg: "bg-teal-50", border: "border-teal-300", iconBg: "bg-teal-100" },
  cocurricular: { bg: "bg-cyan-50", border: "border-cyan-300", iconBg: "bg-cyan-100" },
  community_service: { bg: "bg-violet-50", border: "border-violet-300", iconBg: "bg-violet-100" },
};

const EduRevOptionCard = ({
  type,
  label,
  description,
  icon,
  isSelected,
  onClick,
}: EduRevOptionCardProps) => {
  const colors = colorMap[type] || colorMap.projects;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? `${colors.bg} ${colors.border}`
          : "border-border bg-card hover:bg-secondary/30"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.iconBg}`}>
          <span className="text-lg leading-none">{icon}</span>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          isSelected ? "border-primary" : "border-border"
        }`}>
          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
      </div>
      <h3 className="font-semibold text-foreground text-sm">{label}</h3>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{description}</p>
    </button>
  );
};

export default EduRevOptionCard;
