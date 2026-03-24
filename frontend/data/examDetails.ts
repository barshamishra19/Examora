import { Exam } from '@/types/index';

export const examDetails: Record<string, Partial<Exam>> = {
  'jee-main': {
    fullName: 'Joint Entrance Examination (Main)',
    conductingBody: 'National Testing Agency (NTA)',
    examFormat: '3-hour Computer-Based Test (CBT)',
    duration: '3 hours',
    totalQuestions: 75,
    totalMarks: 300,
    negativeMarking: '1 mark for each wrong answer',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    paperStructure: [
      { name: 'Physics', questions: 25, marks: 100, duration: '1 hour' },
      { name: 'Chemistry', questions: 25, marks: 100, duration: '1 hour' },
      { name: 'Mathematics', questions: 25, marks: 100, duration: '1 hour' },
    ],
    syllabus: [
      {
        subject: 'Physics',
        topics: [
          'Mechanics (Kinematics, Laws of Motion, Work & Energy)',
          'Thermodynamics & Waves',
          'Electricity & Magnetism',
          'Optics & Modern Physics',
          'Gravitation',
        ],
        weightage: '25%',
      },
      {
        subject: 'Chemistry',
        topics: [
          'Physical Chemistry (Atomic Structure, Thermodynamics)',
          'Organic Chemistry (Hydrocarbons, Polymers)',
          'Inorganic Chemistry (Periodic Table, Coordination Compounds)',
          'Electrochemistry & Solutions',
        ],
        weightage: '25%',
      },
      {
        subject: 'Mathematics',
        topics: [
          'Algebra (Sets, Relations, Complex Numbers)',
          'Trigonometry & Analytical Geometry',
          'Calculus (Limits, Derivatives, Integration)',
          'Vectors & 3D Geometry',
          'Probability & Statistics',
        ],
        weightage: '25%',
      },
    ],
    keyFeatures: [
      'NCERT-aligned curriculum',
      'Subject-wise progress tracking',
      'Chapter-wise mock tests',
      'Previous-year question analysis',
      'Time management tools',
    ],
    recommendedResources: [
      { name: 'NCERT Textbooks (Physics, Chemistry, Math)', type: 'book' },
      { name: 'JEE Main Mock Tests by NTA', type: 'website' },
      { name: 'Toppers\' Video Solutions', type: 'video' },
    ],
    cutoffTrends: [
      { year: 2023, score: 88, rank: 250000 },
      { year: 2022, score: 86, rank: 250000 },
      { year: 2021, score: 87, rank: 250000 },
    ],
  },

  'jee-advanced': {
    fullName: 'Joint Entrance Examination (Advanced)',
    conductingBody: 'IIT Coordination Committee',
    examFormat: '2 Papers x 3 hours each',
    duration: '3 hours per paper',
    totalQuestions: 18,
    totalMarks: 360,
    negativeMarking: 'Category-wise (positive marks for correct, zero for unattempted)',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    paperStructure: [
      { name: 'Paper 1', questions: 9, marks: 180, duration: '3 hours' },
      { name: 'Paper 2', questions: 9, marks: 180, duration: '3 hours' },
    ],
    syllabus: [
      {
        subject: 'Physics',
        topics: [
          'Advanced Mechanics & Rotational Motion',
          'Electromagnetic Induction',
          'Wave Optics & Quantum Physics',
          'Nuclear Physics',
        ],
        weightage: '33%',
      },
      {
        subject: 'Chemistry',
        topics: [
          'Advanced Organic Reaction Mechanisms',
          'Redox Reactions & Electrochemistry',
          'Thermodynamic Calculations',
          'Spectroscopy',
        ],
        weightage: '33%',
      },
      {
        subject: 'Mathematics',
        topics: [
          'Calculus (Integration by parts, Differential equations)',
          'Analytical Geometry (Conic sections)',
          'Advanced Algebra & Matrices',
          'Trigonometric Equations',
        ],
        weightage: '33%',
      },
    ],
    keyFeatures: [
      'Advanced problem-solving drills',
      'Alternate solution strategies',
      'Conceptual review modules',
      'High-difficulty practice tests',
      'Ranking performance tracker',
    ],
    cutoffTrends: [
      { year: 2023, score: 235, rank: 5000 },
      { year: 2022, score: 230, rank: 5000 },
      { year: 2021, score: 220, rank: 5000 },
    ],
  },

  'bitsat': {
    fullName: 'BITS Admission Test',
    conductingBody: 'Birla Institute of Technology and Science',
    examFormat: '3-hour Computer-Based Test (CBT)',
    duration: '3 hours (180 minutes)',
    totalQuestions: 130,
    totalMarks: 390,
    negativeMarking: '-1 for each wrong, 0 for unattempted',
    subjects: ['Physics', 'Chemistry', 'Logical Reasoning', 'English', 'Mathematics/Biology'],
    paperStructure: [
      { name: 'Physics', questions: 30, marks: 120 },
      { name: 'Chemistry', questions: 30, marks: 120 },
      { name: 'Logical Reasoning', questions: 20, marks: 60 },
      { name: 'English/Comprehension', questions: 10, marks: 30 },
      { name: 'Mathematics (40Q) / Biology (40Q)', questions: 40, marks: 120 },
    ],
    syllabus: [
      {
        subject: 'Physics',
        topics: ['Mechanics', 'Thermodynamics', 'Waves', 'Electricity', 'Modern Physics'],
        weightage: '23%',
      },
      {
        subject: 'Chemistry',
        topics: ['General Chemistry', 'Organic Chemistry', 'Physical Chemistry', 'Inorganic Chemistry'],
        weightage: '23%',
      },
      {
        subject: 'Logical Reasoning',
        topics: ['Puzzles', 'Logical Deduction', 'Analogies', 'Series'],
        weightage: '15%',
      },
    ],
    keyFeatures: [
      'Sectional breakdown tracking',
      'Time management per section',
      'Vocabulary quiz module',
      'Reasoning puzzle drills',
      'Sectional performance graphs',
    ],
    cutoffTrends: [
      { year: 2023, score: 310, rank: 10000 },
      { year: 2022, score: 305, rank: 10000 },
      { year: 2021, score: 300, rank: 10000 },
    ],
  },

  'upsc-cse': {
    fullName: 'UPSC Civil Services Examination',
    conductingBody: 'Union Public Service Commission',
    examFormat: 'Prelims (Objective) + Mains (Subjective) + Interview',
    duration: 'Prelims: 2 papers x 2 hours | Mains: 4 GS papers + 1 Essay + 2 Optional',
    totalQuestions: 100,
    totalMarks: 2025,
    negativeMarking: '0.33 marks for each wrong in Prelims',
    subjects: [
      'History',
      'Polity',
      'Economy',
      'Geography',
      'Science & Technology',
      'Environment',
      'Ethics',
      'Current Affairs',
      'General Knowledge',
    ],
    syllabus: [
      {
        subject: 'General Studies Prelims',
        topics: [
          'Current Events',
          'History of India',
          'Indian Polity',
          'Indian Economics',
          'Physical Geography',
          'World Geography',
          'Science & Technology',
          'Environment & Ecology',
        ],
        weightage: 'Prelims only',
      },
      {
        subject: 'General Studies Mains I',
        topics: [
          'Indian Culture',
          'Modern History (1757-1950)',
          'The Constitution',
          'Social Issues',
        ],
        weightage: '250 marks',
      },
      {
        subject: 'General Studies Mains II',
        topics: [
          'Polity',
          'Constitution',
          'Governance',
          'Social Justice',
        ],
        weightage: '250 marks',
      },
      {
        subject: 'General Studies Mains III',
        topics: [
          'Technology',
          'Economic Development',
          'Food Security',
          'Infrastructure',
          'Disaster Management',
        ],
        weightage: '250 marks',
      },
      {
        subject: 'General Studies Mains IV',
        topics: [
          'Ethics',
          'Integrity',
          'Public Service attitudes',
          'Case Studies',
        ],
        weightage: '250 marks',
      },
    ],
    keyFeatures: [
      'Prelims vs Mains mode separation',
      'Daily Current Affairs feed',
      'Topic-wise trackers for each GS paper',
      'Answer-writing practice templates',
      'Ethics case study modules',
      'Full-length mock tests with analysis',
    ],
    recommendedResources: [
      { name: 'UPSC Previous Year Question Papers', type: 'website' },
      { name: 'The Hindu & Indian Express (News)', type: 'website' },
      { name: 'UPSC Mock Interview Series', type: 'video' },
    ],
    cutoffTrends: [
      { year: 2023, score: 1025, rank: 1000 },
      { year: 2022, score: 1014, rank: 1000 },
      { year: 2021, score: 1034, rank: 1000 },
    ],
  },

  'ssc-cgl': {
    fullName: 'Staff Selection Commission - Combined Graduate Level',
    conductingBody: 'Staff Selection Commission',
    examFormat: 'Tier I (Objective) + Tier II (Objective) + Tier III (Descriptive)',
    duration: 'Tier I: 60 minutes | Tier II: 120 minutes',
    totalQuestions: 200,
    totalMarks: 800,
    negativeMarking: '0.5 mark for each wrong answer',
    subjects: ['Quantitative Aptitude', 'Reasoning', 'General Awareness', 'English Language'],
    paperStructure: [
      { name: 'Quantitative Aptitude', questions: 50, marks: 200, duration: '60 min' },
      { name: 'General Intelligence & Reasoning', questions: 50, marks: 200, duration: '60 min' },
      { name: 'General Awareness', questions: 50, marks: 200, duration: '60 min' },
      { name: 'English Language & Comprehension', questions: 50, marks: 200, duration: '60 min' },
    ],
    syllabus: [
      {
        subject: 'Quantitative Aptitude',
        topics: [
          'Arithmetic',
          'Algebra',
          'Geometry',
          'Trigonometry',
          'Data Interpretation',
        ],
        weightage: '25%',
      },
      {
        subject: 'Reasoning',
        topics: [
          'Analogies',
          'Classification',
          'Series',
          'Coding-Decoding',
          'Puzzles',
        ],
        weightage: '25%',
      },
      {
        subject: 'General Awareness',
        topics: [
          'Static GK (History, Geography, Polity)',
          'Current Events',
          'Science & Technology',
          'Banking & Finance',
        ],
        weightage: '25%',
      },
      {
        subject: 'English',
        topics: [
          'Reading Comprehension',
          'Grammar',
          'Vocabulary',
          'Sentence Correction',
        ],
        weightage: '25%',
      },
    ],
    keyFeatures: [
      'Section-wise accuracy tracking',
      'Daily vocabulary & GA updates',
      'Shortcut techniques for math',
      'Previous-year GA analysis',
      'Mock tests with sectional breakdown',
    ],
    cutoffTrends: [
      { year: 2023, score: 480, rank: 100000 },
      { year: 2022, score: 475, rank: 100000 },
      { year: 2021, score: 485, rank: 100000 },
    ],
  },

  'neet-ug': {
    fullName: 'National Eligibility cum Entrance Test (UG)',
    conductingBody: 'National Testing Agency (NTA)',
    examFormat: '3-hour Pen-Paper Test',
    duration: '3 hours (180 minutes)',
    totalQuestions: 180,
    totalMarks: 720,
    negativeMarking: '1 mark for wrong, 0 for not attempted',
    subjects: ['Physics', 'Chemistry', 'Biology (Botany & Zoology)'],
    paperStructure: [
      { name: 'Physics', questions: 45, marks: 180 },
      { name: 'Chemistry', questions: 45, marks: 180 },
      { name: 'Biology (Botany)', questions: 45, marks: 180 },
      { name: 'Biology (Zoology)', questions: 45, marks: 180 },
    ],
    syllabus: [
      {
        subject: 'Physics',
        topics: [
          'Mechanics',
          'Thermodynamics',
          'Oscillations & Waves',
          'Electromagnetism',
          'Optics',
          'Modern Physics',
          'Nuclear Physics',
        ],
        weightage: '25%',
      },
      {
        subject: 'Chemistry',
        topics: [
          'Atomic Structure',
          'Periodic Table',
          'Chemical Bonding',
          'Thermodynamics',
          'Organic Chemistry',
          'Solutions & Colloids',
        ],
        weightage: '25%',
      },
      {
        subject: 'Biology',
        topics: [
          'Cell Biology',
          'Genetics',
          'Evolution',
          'Ecology',
          'Human Physiology',
          'Botany & Zoology',
        ],
        weightage: '50%',
      },
    ],
    keyFeatures: [
      'Subject-wise progress modules',
      'Formula sheets & diagrams',
      'Chapter-wise difficulty tracking',
      'Previous-year question analysis',
      'Video explanations for tough topics',
    ],
    recommendedResources: [
      { name: 'NCERT Biology (11th & 12th)', type: 'book' },
      { name: 'NTA Official Mock Tests', type: 'website' },
      { name: 'Anatomy Diagrams Library', type: 'app' },
    ],
    cutoffTrends: [
      { year: 2023, score: 680, rank: 100000 },
      { year: 2022, score: 715, rank: 100000 },
      { year: 2021, score: 720, rank: 100000 },
    ],
  },

  'ibps-po': {
    fullName: 'IBPS Probationary Officer (PO) Selection',
    conductingBody: 'Institute of Banking Personnel Selection',
    examFormat: 'Prelims (Objective) + Mains (Objective) + Interview',
    duration: 'Prelims: 60 min | Mains: 180 min',
    totalQuestions: 250,
    totalMarks: 500,
    negativeMarking: '0.25 marks for each wrong',
    subjects: ['Quantitative Aptitude', 'Reasoning', 'English', 'General Awareness'],
    paperStructure: [
      { name: 'Quantitative Aptitude', questions: 35, marks: 35, duration: '20 min' },
      { name: 'Reasoning Ability', questions: 35, marks: 35, duration: '20 min' },
      { name: 'English Language', questions: 30, marks: 30, duration: '20 min' },
    ],
    syllabus: [
      {
        subject: 'Quantitative Aptitude',
        topics: [
          'Arithmetic',
          'Data Interpretation',
          'Simplification',
          'Percentage & Ratio',
        ],
        weightage: '35%',
      },
      {
        subject: 'Reasoning',
        topics: [
          'Seating Arrangement',
          'Puzzles',
          'Coding-Decoding',
          'Inequality',
        ],
        weightage: '35%',
      },
      {
        subject: 'English',
        topics: [
          'Reading Comprehension',
          'Cloze Test',
          'Grammar',
          'Vocabulary',
        ],
        weightage: '30%',
      },
    ],
    keyFeatures: [
      'Prelims vs Mains separation',
      'Sectional performance tracking',
      'Banking & Finance awareness module',
      'Daily current affairs updates',
      'Speed vs accuracy analytics',
      'Interview preparation tips',
    ],
    cutoffTrends: [
      { year: 2023, score: 67, rank: 25000 },
      { year: 2022, score: 65, rank: 25000 },
      { year: 2021, score: 66, rank: 25000 },
    ],
  },

  'clat': {
    fullName: 'Common Law Admission Test',
    conductingBody: 'CLAT Consortium',
    examFormat: '2-hour Computer-Based Test',
    duration: '2 hours (120 minutes)',
    totalQuestions: 120,
    totalMarks: 150,
    negativeMarking: '0.25 marks for wrong',
    subjects: ['English', 'Current Affairs', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Reasoning'],
    paperStructure: [
      { name: 'English Language', questions: 22, marks: 27.5 },
      { name: 'Current Affairs', questions: 24, marks: 30 },
      { name: 'Legal Reasoning', questions: 35, marks: 43.75 },
      { name: 'Logical Reasoning', questions: 28, marks: 35 },
      { name: 'Quantitative Techniques', questions: 11, marks: 13.75 },
    ],
    syllabus: [
      {
        subject: 'English',
        topics: [
          'Reading Comprehension',
          'Synonyms & Antonyms',
          'Grammar',
          'Verbal Analogies',
        ],
        weightage: '18%',
      },
      {
        subject: 'Current Affairs & General Knowledge',
        topics: [
          'Constitutional Law',
          'National & International Events',
          'Science & Technology',
        ],
        weightage: '20%',
      },
      {
        subject: 'Legal Reasoning',
        topics: [
          'Legal Principles',
          'Case Analysis',
          'Statutory Interpretation',
        ],
        weightage: '29%',
      },
      {
        subject: 'Logical Reasoning',
        topics: [
          'Syllogism',
          'Series',
          'Logical Sets',
          'Puzzles',
        ],
        weightage: '23%',
      },
    ],
    keyFeatures: [
      'Extensive reading comprehension texts',
      'GK flashcards for legal topics',
      'LR puzzle & logic set drills',
      'Recent GK updates feed',
      'Case summary quizzes',
      'Sectional mock tests',
    ],
    cutoffTrends: [
      { year: 2023, score: 115, rank: 5000 },
      { year: 2022, score: 113, rank: 5000 },
      { year: 2021, score: 118, rank: 5000 },
    ],
  },

  'rrb-ntpc': {
    fullName: 'Railway Recruitment Board - Non-Technical Popular Categories',
    conductingBody: 'Railway Recruitment Board',
    examFormat: 'CBT 1 (100Q) + CBT 2 (120Q) + Skill Test',
    duration: 'CBT 1: 90 min | CBT 2: 90 min',
    totalQuestions: 220,
    totalMarks: 320,
    negativeMarking: '0.33 marks for wrong',
    subjects: ['Mathematics', 'General Intelligence & Reasoning', 'General Awareness'],
    paperStructure: [
      { name: 'CBT Stage 1', questions: 100, marks: 100, duration: '90 min' },
      { name: 'CBT Stage 2', questions: 120, marks: 120, duration: '90 min' },
    ],
    syllabus: [
      {
        subject: 'Mathematics',
        topics: [
          'Number Systems',
          'Arithmetic',
          'Algebra',
          'Geometry',
          'Trigonometry',
        ],
        weightage: '27%',
      },
      {
        subject: 'General Intelligence & Reasoning',
        topics: [
          'Analogies',
          'Puzzles',
          'Series',
          'Coding-Decoding',
          'Classification',
        ],
        weightage: '27%',
      },
      {
        subject: 'General Awareness',
        topics: [
          'Static GK',
          'Current Events',
          'Indian Railways',
          'Science & Technology',
        ],
        weightage: '46%',
      },
    ],
    keyFeatures: [
      'Section-wise skill drills',
      'Static & current GK quizzes',
      'Puzzle & reasoning sets',
      'Stage 1 vs Stage 2 tracking',
      'Career progression info',
      'Typing test interface (for applicable posts)',
    ],
    cutoffTrends: [
      { year: 2023, score: 85, rank: 500000 },
      { year: 2022, score: 83, rank: 500000 },
      { year: 2021, score: 84, rank: 500000 },
    ],
  },

  'nda': {
    fullName: 'National Defence Academy',
    conductingBody: 'Union Public Service Commission',
    examFormat: 'Written Test (Mathematics + GAT) + SSB Interview',
    duration: 'Mathematics: 2.5 hours | GAT: 2.5 hours',
    totalQuestions: 270,
    totalMarks: 900,
    negativeMarking: '0.25 marks per wrong',
    subjects: ['Mathematics', 'English', 'General Knowledge', 'Physics', 'Biology', 'Geography', 'History', 'Polity'],
    paperStructure: [
      { name: 'Mathematics Paper', questions: 120, marks: 300, duration: '2.5 hours' },
      { name: 'General Ability Test (GAT)', questions: 150, marks: 600, duration: '2.5 hours' },
    ],
    syllabus: [
      {
        subject: 'Mathematics',
        topics: [
          'Algebra',
          'Trigonometry',
          'Geometry',
          'Calculus',
          'Statistics',
        ],
        weightage: '33%',
      },
      {
        subject: 'General Ability (English)',
        topics: [
          'Comprehension',
          'Grammar',
          'Vocabulary',
          'Synonyms & Antonyms',
        ],
        weightage: '17%',
      },
      {
        subject: 'General Ability (GK)',
        topics: [
          'Indian History',
          'World Geography',
          'Science & Technology',
          'Current Events',
          'Indian Polity',
        ],
        weightage: '50%',
      },
    ],
    keyFeatures: [
      'Mathematics & GAT tabs',
      'Topic-wise practice modules',
      'Daily GK updates',
      'Mock exam simulation with NDA cutoffs',
      'SSB interview preparation',
      'National/International affairs tracker',
    ],
    cutoffTrends: [
      { year: 2023, score: 350, rank: 5000 },
      { year: 2022, score: 345, rank: 5000 },
      { year: 2021, score: 360, rank: 5000 },
    ],
  },
};

export function getExamDetailedInfo(examId: string) {
  return examDetails[examId] || null;
}

export function getExamSyllabus(examId: string) {
  const details = examDetails[examId];
  return details?.syllabus || [];
}

export function getExamPaperStructure(examId: string) {
  const details = examDetails[examId];
  return details?.paperStructure || [];
}

export function getExamFeatures(examId: string) {
  const details = examDetails[examId];
  return details?.keyFeatures || [];
}

export function getExamResources(examId: string) {
  const details = examDetails[examId];
  return details?.recommendedResources || [];
}

export function getExamCutoffs(examId: string) {
  const details = examDetails[examId];
  return details?.cutoffTrends || [];
}
