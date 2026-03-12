import { useStudent } from "@/context/StudentContext";
import CategoryCard from "./CategoryCard";

const CategoryGrid = () => {
  const { categories } = useStudent();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Course Categories</h2>
        <span className="text-xs text-muted-foreground font-mono">{categories.length} categories</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <div key={cat.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
