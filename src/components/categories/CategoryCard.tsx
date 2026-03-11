import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { categoryIcons } from "@/data/categoryIcons";
import CreditMeter from "@/components/shared/CreditMeter";
import StatusChip from "@/components/shared/StatusChip";
import type { Category } from "@/data/mockCategories";
import { Lock } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

const bgMap: Record<string, string> = {
  purple: "bg-[hsl(270,60%,50%,0.1)]",
  charcoal: "bg-[hsl(240,5%,26%,0.1)]",
  blue: "bg-[hsl(210,80%,50%,0.1)]",
  orange: "bg-[hsl(25,95%,53%,0.1)]",
  red: "bg-[hsl(0,72%,51%,0.1)]",
  yellow: "bg-[hsl(45,93%,47%,0.1)]",
  navy: "bg-[hsl(224,64%,33%,0.1)]",
  green: "bg-[hsl(142,71%,45%,0.1)]",
  teal: "bg-[hsl(173,80%,40%,0.1)]",
  gold: "bg-[hsl(36,72%,50%,0.1)]",
  cyan: "bg-[hsl(190,75%,42%,0.1)]",
  slate: "bg-[hsl(215,16%,47%,0.1)]",
};

const textMap: Record<string, string> = {
  purple: "text-cat-purple",
  charcoal: "text-cat-charcoal",
  blue: "text-cat-blue",
  orange: "text-cat-orange",
  red: "text-cat-red",
  yellow: "text-cat-yellow",
  navy: "text-cat-navy",
  green: "text-cat-green",
  teal: "text-cat-teal",
  gold: "text-cat-gold",
  cyan: "text-cat-cyan",
  slate: "text-cat-slate",
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
      className="relative w-full text-left bg-card rounded-2xl p-6 shadow-card cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
      whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)", transition: spring }}
      whileTap={{ scale: 0.985 }}
    >
      {/* Status chip */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        {isFinalized && <Lock className="w-3 h-3 text-emerald-600" />}
        <StatusChip status={status} />
      </div>

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgMap[category.colorKey]}`}>
        <Icon className={`w-5 h-5 ${textMap[category.colorKey]}`} />
      </div>

      {/* Info */}
      <div className="mt-4">
        <h3 className="text-lg font-medium tracking-tight text-foreground leading-tight">
          {category.name}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground font-mono tracking-tight">
          {category.code} · {category.courses.length} courses
        </p>
      </div>

      {/* Meter */}
      <div className="mt-4">
        <CreditMeter used={creditsUsed} max={category.maxCredits} colorKey={category.colorKey} />
      </div>
    </motion.button>
  );
};

export default CategoryCard;
