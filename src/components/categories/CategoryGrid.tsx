import { useStudent } from "@/context/StudentContext";
import CategoryCard from "./CategoryCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { categories, areAllCategoriesSelected } = useStudent();
  const allCategoriesSelected = areAllCategoriesSelected();

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gradient-to-r from-orange-300 to-blue-300"
      >
        <h2 className="text-xl font-bold text-foreground tracking-tight bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">Course Categories</h2>
        <span className="text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-blue-500 px-3 py-1.5 rounded-full shadow-md">{categories.length} categories</span>
      </motion.div>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {categories.map((cat) => (
          <motion.div 
            key={cat.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <CategoryCard category={cat} />
          </motion.div>
        ))}
      </motion.div>

      {allCategoriesSelected && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/review")}
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-white text-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Review Selected Courses
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
