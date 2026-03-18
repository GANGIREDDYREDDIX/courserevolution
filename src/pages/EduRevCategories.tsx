import { EDU_REV_OPTIONS } from "@/data/eduRevTypes";

const EduRevCategories = () => {
  const optionCards = Object.values(EDU_REV_OPTIONS);

  return (
    <div className="py-10 md:py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-orange-500 mb-4">
            Explore EDU-Revolution Categories
          </h1>
          <a
            href="#"
            className="text-sm text-blue-700 underline hover:text-blue-800 transition-colors"
          >
            Click here to view criteria for getting Academic Benefits.
          </a>
          <p className="mt-4 text-lg text-muted-foreground">
            Select the category for which you want to fill your nomination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {optionCards.map((option) => (
            <div
              key={option.label}
              className="rounded-2xl border border-orange-100 bg-white px-6 py-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div className="text-center">
                <div className="text-4xl mb-3" aria-hidden>
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight">
                  {option.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EduRevCategories;
