import { useStudent } from "@/context/StudentContext";
import { Building2, Calendar, Hash, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const StudentHero = () => {
  const { student } = useStudent();

  const initials = student.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.section 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="py-8"
    >
      <div className="bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 rounded-2xl border-2 border-orange-200 shadow-lg px-8 py-8 flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-white shadow-xl flex items-center justify-center shrink-0 overflow-hidden"
        >
          {student.avatarUrl ? (
            <img 
              src={student.avatarUrl} 
              alt={student.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-primary">{initials}</span>
          )}
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1 min-w-0 text-center sm:text-left"
        >
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{student.name}</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center sm:justify-start gap-1.5">
            <GraduationCap className="w-4 h-4" />
            {student.program}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1 mt-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {student.school}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Year {student.year} &middot; Semester {student.term}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Hash className="w-4 h-4" />
              {student.enrollmentId}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StudentHero;
