// Update this page (the content is just a fallback if you fail to update the page)

import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-6">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground">Course Mapper</h1>
        <p className="text-lg text-muted-foreground">Start building your academic journey here.</p>
      </div>
    </div>
  );
};

export default Index;
