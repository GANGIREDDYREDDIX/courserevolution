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

  return (
    <motion.button
      onClick={() => navigate(`/category/${category.id}`)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative group w-full text-left bg-card rounded-lg overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all duration-200 border border-border hover:border-primary/30 hover:shadow-card-hover"
    >
      <div className="p-5">
        {/* Top row: icon + status */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgMap[category.colorKey]}`}>
            <Icon className={`w-5 h-5 ${textMap[category.colorKey]}`} />
          </div>
          <div className="flex items-center gap-1.5">
            {isFinalized && <Lock className="w-3 h-3 text-emerald-600" />}
            <StatusChip status={status} />
          </div>
        </div>

        {/* Course info */}
        <h3 className="text-sm font-semibold tracking-tight text-foreground leading-snug mb-1">
          {category.name}
        </h3>
        <p className="text-xs text-muted-foreground font-mono tracking-tight">
          {category.code} · {category.courses.length} courses
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
