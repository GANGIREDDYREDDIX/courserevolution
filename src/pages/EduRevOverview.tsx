import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { motion } from "framer-motion";
import { 
  Lightbulb,
  BookOpen,
  Briefcase, 
  Award, 
  Code, 
  TrendingUp,
  ArrowRight,
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
  const [selectedTerm, setSelectedTerm] = useState<number>(1);

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

  const selectedTermDetails = termDetails[selectedTerm] || { inClass: [], outClass: [] };

  return (
    <div className="py-8 max-w-6xl mx-auto animate-fade-in">
      <motion.div
        key="overview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
            <div className="mb-10 rounded-2xl border border-slate-700 bg-[#07090f] text-white p-6 md:p-8 shadow-2xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">Course Overview</p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Master Concepts Inside
                <br />
                And Outside the Classroom
              </h1>

              {/* Term tabs style */}
              <div className="rounded-xl bg-[#11141d] border border-slate-800 p-1 mb-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((term) => {
                  const hasContent = terms.includes(term);
                  return (
                    <button
                      key={term}
                      onClick={() => setSelectedTerm(term)}
                      className={`h-10 rounded-lg text-sm font-semibold transition-all ${
                        selectedTerm === term
                          ? "bg-[#1b2233] text-[#b6f25e]"
                          : "text-slate-300 hover:bg-[#1b2233] hover:text-white"
                      } ${!hasContent ? "opacity-60" : ""}`}
                    >
                      Term {term}
                    </button>
                  );
                })}
              </div>

              {/* In Class + Out Class dark cards */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3">In Class</h3>
                  <div className="rounded-xl border border-slate-800 bg-[#11141d] p-4 md:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-200">
                      {selectedTermDetails.inClass.map((course) => (
                        <div key={course.code} className="flex gap-2">
                          <span className="text-slate-500">•</span>
                          <span>{course.title}</span>
                        </div>
                      ))}
                      {selectedTermDetails.inClass.length === 0 && (
                        <p className="text-slate-400">No selected in-class courses yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">Out Class</h3>
                  <div className="rounded-xl border border-slate-800 bg-[#11141d] p-4 md:p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-200">
                      {selectedTermDetails.outClass.map((activity) => (
                        <div key={activity.title} className="flex gap-2">
                          <span className="text-slate-500">•</span>
                          <span>{activity.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
    </div>
  );
};

export default EduRevOverview;
