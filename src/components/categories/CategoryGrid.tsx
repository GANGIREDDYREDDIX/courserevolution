import { useStudent } from "@/context/StudentContext";
import CategoryCard from "./CategoryCard";

const CategoryGrid = () => {
  const { categories } = useStudent();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
};

export default CategoryGrid;
