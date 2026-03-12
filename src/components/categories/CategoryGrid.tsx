import { useStudent } from "@/context/StudentContext";
import CategoryCard from "./CategoryCard";
import { motion } from "framer-motion";

const CategoryGrid = () => {
  const { categories } = useStudent();

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-5"
      >
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Course Categories</h2>
        <span className="text-xs text-muted-foreground font-mono">{categories.length} categories</span>
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
    </div>
  );
};

export default CategoryGrid;
