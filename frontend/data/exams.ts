import { Exam, Category, ExamCategory } from '@/types/index';

export const exams: Exam[] = [
  // Engineering Exams
  {
    id: 'jee-main',
    name: 'JEE Main',
    category: 'engineering',
    description: 'Joint Entrance Examination for engineering admission across India',
    totalSubjects: 3,
    totalTopics: 45,
    estimatedHours: 300,
    difficulty: 'advanced',
  },
  {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    category: 'engineering',
    description: 'Advanced level engineering entrance exam for IIT admission',
    totalSubjects: 3,
    totalTopics: 50,
    estimatedHours: 400,
    difficulty: 'advanced',
  },
  {
    id: 'bitsat',
    name: 'BITSAT',
    category: 'engineering',
    description: 'BITS Pilani Admission Test for engineering studies',
    totalSubjects: 4,
    totalTopics: 40,
    estimatedHours: 280,
    difficulty: 'advanced',
  },

  // Civil Services Exams
  {
    id: 'upsc-cse',
    name: 'UPSC CSE',
    category: 'civil-services',
    description: 'Union Public Service Commission Civil Services Examination',
    totalSubjects: 9,
    totalTopics: 120,
    estimatedHours: 1000,
    difficulty: 'advanced',
  },
  {
    id: 'state-pcs',
    name: 'State PCS',
    category: 'civil-services',
    description: 'State Public Service Commission Examinations',
    totalSubjects: 8,
    totalTopics: 100,
    estimatedHours: 800,
    difficulty: 'advanced',
  },

  // Banking Exams
  {
    id: 'ibps-po',
    name: 'IBPS PO',
    category: 'banking',
    description: 'Institute of Banking Personnel Selection - Probationary Officer',
    totalSubjects: 4,
    totalTopics: 35,
    estimatedHours: 200,
    difficulty: 'intermediate',
  },
  {
    id: 'sbi-po',
    name: 'SBI PO',
    category: 'banking',
    description: 'State Bank of India - Probationary Officer Selection',
    totalSubjects: 4,
    totalTopics: 35,
    estimatedHours: 200,
    difficulty: 'intermediate',
  },
  {
    id: 'ibps-clerk',
    name: 'IBPS Clerk',
    category: 'banking',
    description: 'IBPS Common Recruitment Process for Clerical cadre',
    totalSubjects: 4,
    totalTopics: 30,
    estimatedHours: 150,
    difficulty: 'beginner',
  },

  // Medical Exams
  {
    id: 'neet-ug',
    name: 'NEET-UG',
    category: 'medical',
    description: 'National Eligibility cum Entrance Test for undergraduate medical programs',
    totalSubjects: 3,
    totalTopics: 40,
    estimatedHours: 300,
    difficulty: 'advanced',
  },
  {
    id: 'neet-pg',
    name: 'NEET-PG',
    category: 'medical',
    description: 'NEET for postgraduate medical programs',
    totalSubjects: 11,
    totalTopics: 100,
    estimatedHours: 600,
    difficulty: 'advanced',
  },
  {
    id: 'aiims',
    name: 'AIIMS',
    category: 'medical',
    description: 'All India Institute of Medical Sciences entrance examination',
    totalSubjects: 3,
    totalTopics: 42,
    estimatedHours: 320,
    difficulty: 'advanced',
  },

  // Law Exams
  {
    id: 'clat',
    name: 'CLAT',
    category: 'law',
    description: 'Common Law Admission Test for law programs in India',
    totalSubjects: 4,
    totalTopics: 25,
    estimatedHours: 150,
    difficulty: 'intermediate',
  },
  {
    id: 'ailet',
    name: 'AILET',
    category: 'law',
    description: 'All India Law Entrance Test by Delhi University',
    totalSubjects: 4,
    totalTopics: 25,
    estimatedHours: 150,
    difficulty: 'intermediate',
  },

  // Railway/Defence Exams
  {
    id: 'rrb-ntpc',
    name: 'RRB NTPC',
    category: 'railway',
    description: 'Railway Recruitment Board - Non-Technical Popular Categories',
    totalSubjects: 4,
    totalTopics: 30,
    estimatedHours: 120,
    difficulty: 'beginner',
  },
  {
    id: 'ssc-cgl',
    name: 'SSC CGL',
    category: 'railway',
    description: 'Staff Selection Commission - Combined Graduate Level Exam',
    totalSubjects: 4,
    totalTopics: 35,
    estimatedHours: 150,
    difficulty: 'intermediate',
  },
  {
    id: 'nda',
    name: 'NDA',
    category: 'railway',
    description: 'National Defence Academy entrance examination',
    totalSubjects: 3,
    totalTopics: 28,
    estimatedHours: 180,
    difficulty: 'intermediate',
  },

  // School Level Exams
  {
    id: 'class-12-cbse',
    name: 'Class 12 (CBSE)',
    category: 'school',
    description: 'CBSE Class 12 Board examination preparation',
    totalSubjects: 6,
    totalTopics: 80,
    estimatedHours: 400,
    difficulty: 'intermediate',
  },
  {
    id: 'iit-foundation',
    name: 'IIT Foundation',
    category: 'school',
    description: 'Foundation course for Class 8-10 students preparing for JEE',
    totalSubjects: 3,
    totalTopics: 45,
    estimatedHours: 200,
    difficulty: 'intermediate',
  },
];

export const categories: Category[] = [
  {
    id: 'engineering',
    name: 'Engineering Entrance',
    description: 'Prepare for engineering entrance exams like JEE, BITSAT, and more',
    exams: exams.filter((exam) => exam.category === 'engineering'),
  },
  {
    id: 'civil-services',
    name: 'Civil Services',
    description: 'Comprehensive preparation for UPSC CSE and State PCS exams',
    exams: exams.filter((exam) => exam.category === 'civil-services'),
  },
  {
    id: 'banking',
    name: 'Banking & Finance',
    description: 'Master banking exams with focused IBPS and SBI preparation',
    exams: exams.filter((exam) => exam.category === 'banking'),
  },
  {
    id: 'medical',
    name: 'Medical Entrance',
    description: 'Excel in NEET-UG, NEET-PG, and AIIMS examinations',
    exams: exams.filter((exam) => exam.category === 'medical'),
  },
  {
    id: 'law',
    name: 'Law & Management',
    description: 'Prepare for law entrance exams and management courses',
    exams: exams.filter((exam) => exam.category === 'law'),
  },
  {
    id: 'railway',
    name: 'Railway, Defence & Others',
    description: 'Train for railway, defense, and government service exams',
    exams: exams.filter((exam) => exam.category === 'railway'),
  },
  {
    id: 'school',
    name: 'School Level',
    description: 'Build foundation and score high in board exams and competitive tests',
    exams: exams.filter((exam) => exam.category === 'school'),
  },
];

// Helper function to get exam by ID
export function getExamById(examId: string): Exam | undefined {
  return exams.find((exam) => exam.id === examId);
}

// Helper function to get exams by category
export function getExamsByCategory(category: ExamCategory): Exam[] {
  return exams.filter((exam) => exam.category === category);
}

// Helper function to get category by ID
export function getCategoryById(categoryId: ExamCategory): Category | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

// Search exams
export function searchExams(query: string): Exam[] {
  const lowerQuery = query.toLowerCase();
  return exams.filter((exam) =>
    exam.name.toLowerCase().includes(lowerQuery) ||
    exam.description.toLowerCase().includes(lowerQuery)
  );
}
