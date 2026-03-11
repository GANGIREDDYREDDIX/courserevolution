import AppShell from "@/components/layout/AppShell";
import StudentHero from "@/components/layout/StudentHero";
import CategoryGrid from "@/components/categories/CategoryGrid";

const Home = () => {
  return (
    <AppShell>
      <StudentHero />
      <CategoryGrid />
    </AppShell>
  );
};

export default Home;
