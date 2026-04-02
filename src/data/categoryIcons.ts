import {
  Code2, Cpu, Calculator, Cloud, Puzzle, BookOpen,
  Rocket, Heart,
} from "lucide-react";

export const categoryIcons: Record<string, typeof Code2> = {
  "cat-1":  Code2,          // Programming Courses
  "cat-2":  Cpu,            // Technology Courses
  "cat-3":  Calculator,     // Basic Science
  "cat-4":  Cloud,          // Engineering Minor (Cloud)
  "cat-5":  Puzzle,         // Open Minor
  "cat-6":  BookOpen,       // Language Courses
  "cat-7":  Rocket,         // Capstone Project
  "cat-8":  Heart,          // Community Project
};
