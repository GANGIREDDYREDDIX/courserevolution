import { useStudent } from "@/context/StudentContext";

const greetingByHour = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const StudentHero = () => {
  const { student } = useStudent();

  return (
    <section className="py-12 px-1">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground text-balance">
        {greetingByHour()}, {student.firstName}.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Map your courses for this semester. Select courses by category and finalize when ready.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[student.program, `Year ${student.year}`, `Semester ${student.term}`].map((label) => (
          <span
            key={label}
            className="inline-flex items-center h-6 px-2.5 rounded-md bg-secondary text-xs font-medium text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
};

export default StudentHero;
