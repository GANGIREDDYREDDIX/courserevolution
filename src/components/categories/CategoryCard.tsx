import { useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { categoryIcons } from "@/data/categoryIcons";
import CreditMeter from "@/components/shared/CreditMeter";
import StatusChip from "@/components/shared/StatusChip";
import type { Category } from "@/data/mockCategories";
import { Lock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const bgMap: Record<string, string> = {
  purple: "bg-purple-50",
  charcoal: "bg-gray-100",
  blue: "bg-blue-50",
  orange: "bg-orange-50",
  red: "bg-red-50",
  yellow: "bg-amber-50",
  navy: "bg-indigo-50",
  green: "bg-emerald-50",
  teal: "bg-teal-50",
  gold: "bg-amber-50",
  cyan: "bg-cyan-50",
  slate: "bg-slate-100",
  rose: "bg-rose-50",
  lime: "bg-lime-50",
};

const gradientMap: Record<string, string> = {
  purple: "from-purple-500/10 to-purple-600/5",
  charcoal: "from-gray-500/10 to-gray-600/5",
  blue: "from-blue-500/10 to-blue-600/5",
  orange: "from-orange-500/10 to-orange-600/5",
  red: "from-red-500/10 to-red-600/5",
  yellow: "from-amber-500/10 to-amber-600/5",
  navy: "from-indigo-500/10 to-indigo-700/5",
  green: "from-emerald-500/10 to-emerald-600/5",
  teal: "from-teal-500/10 to-teal-600/5",
  gold: "from-amber-500/10 to-amber-600/5",
  cyan: "from-cyan-500/10 to-cyan-600/5",
  slate: "from-slate-500/10 to-slate-600/5",
  rose: "from-rose-500/10 to-rose-600/5",
  lime: "from-lime-500/10 to-lime-600/5",
};

const borderMap: Record<string, string> = {
  purple: "border-purple-200",
  charcoal: "border-gray-300",
  blue: "border-blue-200",
  orange: "border-orange-200",
  red: "border-red-200",
  yellow: "border-amber-200",
  navy: "border-indigo-300",
  green: "border-emerald-200",
  teal: "border-teal-200",
  gold: "border-amber-200",
  cyan: "border-cyan-200",
  slate: "border-slate-300",
  rose: "border-rose-200",
  lime: "border-lime-200",
};

const textMap: Record<string, string> = {
  purple: "text-purple-600",
  charcoal: "text-gray-600",
  blue: "text-blue-600",
  orange: "text-orange-600",
  red: "text-red-600",
  yellow: "text-amber-600",
  navy: "text-indigo-700",
  green: "text-emerald-600",
  teal: "text-teal-600",
  gold: "text-amber-600",
  cyan: "text-cyan-600",
  slate: "text-slate-600",
  rose: "text-rose-600",
  lime: "text-lime-600",
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const navigate = useNavigate();
  const { getCreditsUsed, getStatus } = useStudent();
  const Icon = categoryIcons[category.id] || categoryIcons["cat-1"];
  const status = getStatus(category.id);
  const creditsUsed = getCreditsUsed(category.id);
  const isFinalized = status === "finalized";
  const itemCountLabel = category.id === "cat-4" ? "6 pathways" : `${category.courses.length} courses`;
  const gradient = gradientMap[category.colorKey] || gradientMap.blue;
  const borderColor = borderMap[category.colorKey] || borderMap.blue;

  return (
    <motion.button
      onClick={() => navigate(`/category/${category.id}`)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative group w-full text-left bg-gradient-to-br ${gradient} rounded-xl overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all duration-200 border-2 ${borderColor} hover:shadow-lg`}
    >
      <div className="p-5">
        {/* Top row: icon + status */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border-2 ${borderColor}`}>
            <Icon className={`w-6 h-6 ${textMap[category.colorKey]}`} />
          </div>
          <div className="flex items-center gap-1.5">
            {isFinalized && <Lock className="w-3 h-3 text-emerald-600" />}
            <StatusChip status={status} />
          </div>
        </div>

        {/* Course info */}
        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground leading-snug">
            {category.name}
          </h3>
          {category.isElective ? (
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md">
              Elective
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
              Mandatory
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono tracking-tight">
          {category.code} · {itemCountLabel}
        </p>

        {/* Meter */}
        <div className="mt-4">
          <CreditMeter used={creditsUsed} max={category.maxCredits} colorKey={category.colorKey} />
        </div>

        {/* Hover arrow indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.button>
  );
};

export default CategoryCard;
