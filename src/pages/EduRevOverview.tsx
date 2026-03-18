import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Lightbulb, 
  BookOpen, 
  Briefcase, 
  Award, 
  Code, 
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  DollarSign,
  FileText,
  Globe,
  Laptop,
  Network
} from "lucide-react";

// Dummy data for each term
const termDetails: Record<number, {
  inClass: Array<{ title: string; code: string; description: string; ltp: string; credits: number }>;
  outClass: Array<{ category: string; title: string; description: string; icon: any; color: string }>;
}> = {
  1: {
    inClass: [
      {
        title: "Computer Programming",
        code: "CSE111",
        description: "Introduction to programming fundamentals with hands-on coding exercises",
        ltp: "L:3 T:0 P:2",
        credits: 4
      },
      {
        title: "Applied Chemistry",
        code: "CHE110",
        description: "Chemical principles and their applications in engineering",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Linux Setup & Git Portfolio",
        description: "Learn Linux command line, version control with Git, and create your personal portfolio website",
        icon: Code,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Certifications",
        title: "PCEP - Python Institute",
        description: "Entry-level Python programming certification recognized globally",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      },
      {
        category: "Internship",
        title: "Tech Company Internship Prep",
        description: "Resume building, interview preparation, and company application guidance",
        icon: Briefcase,
        color: "from-purple-500 to-purple-600"
      }
    ]
  },
  2: {
    inClass: [
      {
        title: "Data Structures & Algorithms",
        code: "CSE202",
        description: "Core concepts of data structures and algorithmic problem solving",
        ltp: "L:3 T:0 P:2",
        credits: 4
      },
      {
        title: "Database Management Systems",
        code: "INT306",
        description: "Relational databases, SQL, and database design principles",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Full-Stack Web Application",
        description: "Build a complete web application using React, Node.js, and MongoDB",
        icon: Globe,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Revenue Generation",
        title: "Freelance Project Work",
        description: "Take on real client projects through platforms like Upwork and Fiverr",
        icon: DollarSign,
        color: "from-orange-500 to-orange-600"
      },
      {
        category: "Certifications",
        title: "AWS Cloud Practitioner",
        description: "Foundational cloud computing certification from Amazon Web Services",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      }
    ]
  },
  3: {
    inClass: [
      {
        title: "Machine Learning",
        code: "CSE333",
        description: "Introduction to ML algorithms, neural networks, and practical applications",
        ltp: "L:2 T:0 P:2",
        credits: 3
      },
      {
        title: "Computer Networks",
        code: "CSE306",
        description: "Network protocols, architecture, and communication systems",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "AI/ML Model Development",
        description: "Create and deploy machine learning models for real-world problems",
        icon: Network,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Certifications",
        title: "Google Data Analytics Professional",
        description: "Professional certificate in data analytics and visualization",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      },
      {
        category: "Internship",
        title: "Summer Internship",
        description: "3-month internship with partner companies in your domain",
        icon: Briefcase,
        color: "from-purple-500 to-purple-600"
      }
    ]
  },
  4: {
    inClass: [
      {
        title: "Cloud Computing Fundamentals",
        code: "INT335",
        description: "Cloud architecture, services, and deployment models",
        ltp: "L:2 T:0 P:2",
        credits: 3
      },
      {
        title: "Operating Systems",
        code: "CSE316",
        description: "OS concepts, process management, memory management, and file systems",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Cloud-Native Application",
        description: "Deploy scalable applications on AWS/Azure with CI/CD pipelines",
        icon: Laptop,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Revenue Generation",
        title: "SaaS Product Development",
        description: "Build and monetize your own software-as-a-service product",
        icon: DollarSign,
        color: "from-orange-500 to-orange-600"
      },
      {
        category: "Certifications",
        title: "Microsoft Azure Fundamentals",
        description: "Entry-level certification for Azure cloud services",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      }
    ]
  },
  5: {
    inClass: [
      {
        title: "Software Engineering",
        code: "CSE320",
        description: "Software development lifecycle, agile methodologies, and best practices",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Open Source Contribution",
        description: "Contribute to major open-source projects and build your GitHub profile",
        icon: Code,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Internship",
        title: "Industry Internship",
        description: "Full-time internship opportunity with leading tech companies",
        icon: Briefcase,
        color: "from-purple-500 to-purple-600"
      }
    ]
  },
  6: {
    inClass: [
      {
        title: "DevOps Engineering",
        code: "INT364",
        description: "CI/CD, containerization, orchestration, and automation",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "DevOps Pipeline Implementation",
        description: "Set up complete DevOps infrastructure with Docker, Kubernetes, Jenkins",
        icon: Network,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Certifications",
        title: "Docker Certified Associate",
        description: "Professional certification for containerization expertise",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      }
    ]
  },
  7: {
    inClass: [
      {
        title: "Capstone Project I",
        code: "CSE339",
        description: "First phase of major final year project",
        ltp: "L:0 T:0 P:4",
        credits: 2
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Final Year Project",
        description: "Work on innovative solutions to real-world problems",
        icon: FileText,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Revenue Generation",
        title: "Startup Development",
        description: "Develop your startup idea with mentorship and funding support",
        icon: DollarSign,
        color: "from-orange-500 to-orange-600"
      }
    ]
  },
  8: {
    inClass: [
      {
        title: "Capstone Project II",
        code: "CSE439",
        description: "Final phase and presentation of major project",
        ltp: "L:0 T:0 P:16",
        credits: 8
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Project Publication",
        description: "Present and publish your research in conferences and journals",
        icon: FileText,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Internship",
        title: "Pre-Placement Offers",
        description: "Full-time job offers and placement assistance",
        icon: Briefcase,
        color: "from-purple-500 to-purple-600"
      }
    ]
  }
};

const EduRevOverview = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, selections, areAllCategoriesSelected, getUnselectedCategoryNames } = useStudent();
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);

  const category = categoryId ? categories.find((c) => c.id === categoryId) : null;
  const selectedCourses = category
    ? category.courses.filter((c) => selections[category.id]?.selectedCourseIds?.includes(c.id))
    : categories.flatMap((cat) =>
        cat.courses.filter((course) => selections[cat.id]?.selectedCourseIds?.includes(course.id))
      );

  if (categoryId && !category) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground mb-4">Category not found.</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const allCategoriesSelected = areAllCategoriesSelected();
  const remainingCategories = getUnselectedCategoryNames();
  const proceedTarget = categoryId ? `/edurev/${categoryId}` : "/";

  if (!allCategoriesSelected) {
    return (
      <div className="py-20 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Complete all categories first</h1>
        <p className="text-muted-foreground mb-4">
          You can access the term initiatives only after selecting all course categories.
        </p>
        {remainingCategories.length > 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5">
            Remaining: {remainingCategories.slice(0, 5).join(", ")}
            {remainingCategories.length > 5 ? ` +${remainingCategories.length - 5} more` : ""}
          </p>
        )}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  // Group courses by term
  const coursesByTerm: Record<number, typeof selectedCourses> = {};
  for (const course of selectedCourses) {
    (coursesByTerm[course.term] ||= []).push(course);
  }
  const terms = Object.keys(coursesByTerm).map(Number).sort((a, b) => a - b);

  const outsideClassActivities = [
    {
      icon: TrendingUp,
      title: "Revenue Generation",
      description: "Real-world business projects that generate revenue",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      icon: Code,
      title: "Projects",
      description: "Hands-on practical projects to build your portfolio",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Industry-recognized certifications to boost your resume",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      icon: Briefcase,
      title: "Internships",
      description: "Professional internship opportunities with top companies",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  return (
    <div className="py-8 max-w-6xl mx-auto animate-fade-in">
      <AnimatePresence mode="wait">
        {!selectedTerm ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Explore Your Learning Journey
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Master concepts both <span className="font-semibold text-foreground">inside</span> and{" "}
                <span className="font-semibold text-foreground">outside</span> the classroom through our comprehensive Edu Rev initiatives
              </p>
            </div>

            {/* Main Banner */}
            <div className="mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">Click on Terms to View EDU-Rev Initiatives</h2>
              </div>
              <p className="text-blue-100 text-sm max-w-2xl">
                Each term combines structured in-class learning with experiential outside-class activities to give you a holistic educational experience
              </p>
            </div>

            {/* Terms Grid */}
            <div className="mb-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((term) => {
                  const hasContent = terms.includes(term);
                  const gradients = [
                    "from-purple-500 to-purple-600",
                    "from-blue-500 to-blue-600",
                    "from-teal-500 to-teal-600",
                    "from-orange-500 to-orange-600",
                    "from-pink-500 to-pink-600",
                    "from-amber-500 to-amber-600",
                    "from-gray-700 to-gray-800",
                    "from-cyan-500 to-cyan-600"
                  ];
                  
                  return (
                    <motion.button
                      key={term}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: term * 0.05 }}
                      onClick={() => setSelectedTerm(term)}
                      className={`relative h-32 rounded-xl bg-gradient-to-br ${gradients[term - 1]} p-6 text-white font-bold text-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 ${
                        !hasContent ? "opacity-60" : ""
                      }`}
                    >
                      <span className="relative z-10">TERM {term}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Two Column Layout - In Class & Outside Class */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* In Class */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">In Class</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                  Structured curriculum with comprehensive coverage of core concepts and technologies
                </p>

                {/* Sample courses from selected */}
                <div className="space-y-3">
                  {selectedCourses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-lg bg-white border border-blue-100 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground mb-1">{course.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">{course.courseCode}</span>
                            <span>•</span>
                            <span>{course.yearLabel}</span>
                            <span>•</span>
                            <span>{course.credits} Credits</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedCourses.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{selectedCourses.length - 3} more courses
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Outside Class */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Outside Class</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Experiential learning through real-world projects, certifications, and professional opportunities
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {outsideClassActivities.map((activity, idx) => (
                    <motion.div
                      key={activity.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className={`${activity.bgColor} border border-current/20 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center mb-3`}>
                        <activity.icon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className={`font-bold text-sm ${activity.textColor} mb-1`}>{activity.title}</h4>
                      <p className="text-xs text-muted-foreground leading-snug">{activity.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Ready to Choose Your Benefits?</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll now select specific Edu Rev benefits for each of your courses. Choose options that align with your learning goals and career aspirations.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <div className="flex justify-center">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => navigate(proceedTarget)}
                className="inline-flex items-center gap-3 h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-base font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                Proceed to Select Edu Rev Categories
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <TermDetailView 
            term={selectedTerm} 
            onBack={() => setSelectedTerm(null)}
            onProceed={() => navigate(proceedTarget)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface TermDetailViewProps {
  term: number;
  onBack: () => void;
  onProceed: () => void;
}

const TermDetailView = ({ term, onBack, onProceed }: TermDetailViewProps) => {
  const details = termDetails[term] || { inClass: [], outClass: [] };
  
  const gradients = [
    "from-purple-500 to-purple-600",
    "from-blue-500 to-blue-600",
    "from-teal-500 to-teal-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
    "from-amber-500 to-amber-600",
    "from-gray-700 to-gray-800",
    "from-cyan-500 to-cyan-600"
  ];

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Terms
        </button>
        
        <div className={`rounded-2xl bg-gradient-to-br ${gradients[term - 1]} p-8 text-white shadow-xl mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Term {term}</h1>
              <p className="text-white/90">Year {Math.ceil(term / 2)} • Semester {term % 2 === 1 ? 1 : 2}</p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* In Class Section */}
        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">In Class</h2>
          </div>

          <div className="space-y-4">
            {details.inClass.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl bg-white border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-sm text-foreground">{course.title}</h3>
                  <span className="text-xs font-bold text-primary shrink-0">{course.credits} Credits</span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-2">{course.code}</p>
                <p className="text-xs text-muted-foreground mb-3">{course.description}</p>
                <div className="flex items-center gap-2">
                  {course.ltp.split(' ').map((part, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
                      {part}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Outside Class Section */}
        <div className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Outside Class</h2>
          </div>

          <div className="space-y-4">
            {details.outClass.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-white border border-teal-100 hover:border-teal-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        {activity.category}
                      </div>
                      <h3 className="font-bold text-sm text-foreground mb-2">{activity.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={onProceed}
          className="inline-flex items-center gap-3 h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-base font-bold hover:shadow-xl hover:scale-105 transition-all"
        >
          Proceed to Select Edu Rev Categories
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default EduRevOverview;
