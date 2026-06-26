import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { 
  User, 
  Course, 
  LibraryItem, 
  VideoProgress, 
  AttendanceRecord, 
  QuizAttempt, 
  Certificate, 
  LmsNotification, 
  Lesson,
  ChatMessage,
  OfficeHourSlot
} from './src/types.js';
import { getInitialCourses } from './src/data/coursesData.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure database directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

// -----------------------------------------------------
// Initialize Database with Preloaded Seed Data
// -----------------------------------------------------

const initialUsers: User[] = [
  {
    id: 'user_admin_1',
    name: 'Super Admin',
    email: 'admin@university.edu',
    role: 'admin',
    phone: '+1 (555) 0199',
    department: 'Administration',
    password: 'admin123'
  },
  {
    id: 'user_prof_1',
    name: 'Dr. Sarah Jenkins',
    email: 'professor@university.edu',
    role: 'professor',
    phone: '+1 (555) 0244',
    department: 'Computer Science',
    password: 'professor123'
  },
  {
    id: 'user_student_1',
    name: 'Zayn Malik',
    email: 'student@university.edu',
    role: 'student',
    studentId: 'ST-904123',
    phone: '+1 (555) 0366',
    department: 'Computer Science',
    semester: '4th Semester',
    password: 'student123'
  }
];

const initialCourses: Course[] = [
  {
    id: 'course_1',
    title: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Learn the fundamental concepts of computing, programming logic, algorithms, and computational thinking using Python.',
    department: 'Computer Science',
    instructor: 'Dr. Sarah Jenkins',
    isPublished: true,
    modules: [
      {
        id: 'c1_m1',
        title: 'Module 1: Foundations of Computing',
        lessons: [
          {
            id: 'c1_l1',
            title: 'Lesson 1.1: History of Computing & Hardware Architecture',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '09:56',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c1_l2',
            title: 'Lesson 1.2: Reading Material - von Neumann Architecture',
            type: 'pdf',
            pdfUrl: '/documents/cs101_module1.pdf',
            duration: '15 min read',
            completed: false
          },
          {
            id: 'c1_l3',
            title: 'Quiz 1.1: Core Hardware Concepts',
            type: 'quiz',
            quiz: {
              id: 'quiz_c1_m1',
              title: 'Quiz 1.1: Hardware Foundations',
              questions: [
                {
                  id: 'c1_q1',
                  text: 'Which architectural design represents the concept of storing program instructions and data in the same memory space?',
                  options: ['Harvard Architecture', 'von Neumann Architecture', 'RISC Design', 'CISC Processor Paradigm'],
                  correctOptionIndex: 1
                },
                {
                  id: 'c1_q2',
                  text: 'What component of the CPU is responsible for carrying out mathematical operations and bitwise calculations?',
                  options: ['Control Unit (CU)', 'Arithmetic Logic Unit (ALU)', 'L1 Cache', 'Instruction Register (IR)'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c1_m2',
        title: 'Module 2: Basics of Python Programming',
        lessons: [
          {
            id: 'c1_l4',
            title: 'Lesson 2.1: Variables, Types, and Basic Arithmetic',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: '10:53',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c1_l5',
            title: 'Lesson 2.2: Reading Material - Standard Syntax and Keywords',
            type: 'pdf',
            pdfUrl: '/documents/cs101_python_syntax.pdf',
            duration: '12 min read',
            completed: false
          },
          {
            id: 'c1_l6',
            title: 'Quiz 2.1: Python Variables and Expressions',
            type: 'quiz',
            quiz: {
              id: 'quiz_c1_m2',
              title: 'Python Core Variables Evaluation',
              questions: [
                {
                  id: 'c1_q3',
                  text: 'What is the exact output of print(type(3 / 2)) in Python 3?',
                  options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'decimal'>"],
                  correctOptionIndex: 1
                },
                {
                  id: 'c1_q4',
                  text: 'Which of the following is a completely valid variable name in Python?',
                  options: ['class', '3rd_value', 'total_count', 'total-count'],
                  correctOptionIndex: 2
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c1_m3',
        title: 'Module 3: Control Flow & Loop Iterations',
        lessons: [
          {
            id: 'c1_l7',
            title: 'Lesson 3.1: Conditional If-Else and Comparison Operators',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '07:45',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c1_l8',
            title: 'Lesson 3.2: Definite vs Indefinite Loops: For and While',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '11:12',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c1_l9',
            title: 'Quiz 3.1: Core Conditional Loops and Operators',
            type: 'quiz',
            quiz: {
              id: 'quiz_c1_m3',
              title: 'Loop and Flow Control Quiz',
              questions: [
                {
                  id: 'c1_q5',
                  text: 'How do you immediately terminate the execution of the current loop in Python?',
                  options: ['continue', 'break', 'exit()', 'return'],
                  correctOptionIndex: 1
                },
                {
                  id: 'c1_q6',
                  text: 'What is the output of print(list(range(2, 8, 2)))?',
                  options: ['[2, 4, 6, 8]', '[2, 4, 6]', '[3, 5, 7]', '[2, 3, 4, 5, 6, 7]'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 90
            }
          }
        ]
      },
      {
        id: 'c1_m4',
        title: 'Module 4: Functions & Problem Solving',
        lessons: [
          {
            id: 'c1_l10',
            title: 'Lesson 4.1: Custom Function Declarations and Parameters',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '09:20',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c1_l11',
            title: 'Lesson 4.2: Scope of Variables and Global Declarations',
            type: 'pdf',
            pdfUrl: '/documents/cs101_function_scope.pdf',
            duration: '10 min read',
            completed: false
          },
          {
            id: 'c1_l12',
            title: 'Quiz 4.1: Function Parameters and Callbacks',
            type: 'quiz',
            quiz: {
              id: 'quiz_c1_m4',
              title: 'Function Parameters Evaluator',
              questions: [
                {
                  id: 'c1_q7',
                  text: 'In Python, what is the default return value of a custom function that has no explicit return statement?',
                  options: ['0', 'False', 'None', 'Null'],
                  correctOptionIndex: 2
                }
              ],
              timeLimit: 60
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course_2',
    title: 'Data Structures & Algorithms',
    code: 'CS201',
    description: 'Master advanced algorithms, complexity analysis, arrays, lists, queues, stacks, hash tables, trees, and dynamic programming.',
    department: 'Computer Science',
    instructor: 'Dr. Sarah Jenkins',
    isPublished: true,
    modules: [
      {
        id: 'c2_m1',
        title: 'Module 1: Time and Space Complexity',
        lessons: [
          {
            id: 'c2_l1',
            title: 'Lesson 1.1: Big O Notation and Growth of Functions',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '08:15',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c2_l2',
            title: 'Lesson 1.2: Reading Material - Complexity Quick Reference Chart',
            type: 'pdf',
            pdfUrl: '/documents/cs201_complexity_cheat.pdf',
            duration: '10 min read',
            completed: false
          },
          {
            id: 'c2_l3',
            title: 'Module 1 Assessment: Recursion & Complexity',
            type: 'quiz',
            quiz: {
              id: 'quiz_c2_m1',
              title: 'Module 1 Big O Quiz',
              questions: [
                {
                  id: 'c2_q1',
                  text: 'With a balanced Binary Search Tree containing N nodes, what is the worst-case time complexity of an insertion operation?',
                  options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'],
                  correctOptionIndex: 2
                },
                {
                  id: 'c2_q2',
                  text: 'What is the time complexity of the standard Fibonacci recursive calculation without any memoization optimization?',
                  options: ['O(N)', 'O(N log N)', 'O(2^N)', 'O(N^2)'],
                  correctOptionIndex: 2
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c2_m2',
        title: 'Module 2: Linear Structures: Stacks, Queues, Lists',
        lessons: [
          {
            id: 'c2_l4',
            title: 'Lesson 2.1: Array Listings vs Linked Nodes',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '12:45',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c2_l5',
            title: 'Lesson 2.2: Stack & Queue Architectures (LIFO/FIFO)',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '10:15',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c2_l6',
            title: 'Quiz 2.1: Dynamic Node Memory Performance',
            type: 'quiz',
            quiz: {
              id: 'quiz_c2_m2',
              title: 'Linear Structures Evaluator',
              questions: [
                {
                  id: 'c2_q3',
                  text: 'Which list type is ideal if you require frequent O(1) insertions at arbitrary middle indices but do not need fast random lookups?',
                  options: ['Singly Linked List', 'Static Array', 'Dynamic Array List', 'Binary Index Search'],
                  correctOptionIndex: 0
                },
                {
                  id: 'c2_q4',
                  text: 'What operation is used to retrieve but not remove the top element of a LIFO Stack?',
                  options: ['Pop', 'Push', 'Peek', 'Shift'],
                  correctOptionIndex: 2
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c2_m3',
        title: 'Module 3: Trees, Hierarchies, and Hash Tables',
        lessons: [
          {
            id: 'c2_l7',
            title: 'Lesson 3.1: Binary Trees and In-Order/Pre-Order Traversals',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '14:20',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c2_l8',
            title: 'Lesson 3.2: Hash Collisions and Chain Linking Resolutions',
            type: 'pdf',
            pdfUrl: '/documents/cs201_hash_collisions.pdf',
            duration: '18 min read',
            completed: false
          },
          {
            id: 'c2_l9',
            title: 'Quiz 3.1: Tree Hierarchies & Hashing Metrics',
            type: 'quiz',
            quiz: {
              id: 'quiz_c2_m3',
              title: 'Hierarchical Structure Quiz',
              questions: [
                {
                  id: 'c2_q5',
                  text: 'What is the main advantage of utilizing a Hash Map over a standard Binary Search Tree?',
                  options: ['Preserved sorted order of elements', 'O(1) average lookup and insertion speeds', 'Minimized memory footprint', 'Guaranteed worst-case O(1) performance'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 60
            }
          }
        ]
      },
      {
        id: 'c2_m4',
        title: 'Module 4: Sorting & Searching Efficiencies',
        lessons: [
          {
            id: 'c2_l10',
            title: 'Lesson 4.1: Comparative Analysis: Bubble, Selection, & Insertion Sorts',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            duration: '11:05',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c2_l11',
            title: 'Lesson 4.2: Divide and Conquer Paradigm: Merge & Quick Sort',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '15:30',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c2_l12',
            title: 'Quiz 4.1: Algorithm Efficiencies and Run-Times',
            type: 'quiz',
            quiz: {
              id: 'quiz_c2_m4',
              title: 'Sorting Algorithms Evaluator',
              questions: [
                {
                  id: 'c2_q6',
                  text: 'Which sorting algorithm has a guaranteed stable, non-adaptive, O(N log N) worst-case time complexity regardless of initial array sorting status?',
                  options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Selection Sort'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 90
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course_3',
    title: 'Software Engineering Principles',
    code: 'CS301',
    description: 'Learn system design, agile methodologies, SOLID design principles, unified modeling language (UML), and developer best practices.',
    department: 'Computer Science',
    instructor: 'Dr. Sarah Jenkins',
    isPublished: true,
    modules: [
      {
        id: 'c3_m1',
        title: 'Module 1: Agile Software Development',
        lessons: [
          {
            id: 'c3_l1',
            title: 'Lesson 1.1: Managing Sprints and Backlogs',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '07:30',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c3_l2',
            title: 'Lesson 1.2: Reading Material - Scrum Team Roles & Sprint Rituals',
            type: 'pdf',
            pdfUrl: '/documents/cs301_scrum_guide.pdf',
            duration: '15 min read',
            completed: false
          },
          {
            id: 'c3_l3',
            title: 'Quiz 1.1: Core Agile Development Models',
            type: 'quiz',
            quiz: {
              id: 'quiz_c3_m1',
              title: 'Agile & Scrum Best Practices',
              questions: [
                {
                  id: 'c3_q1',
                  text: 'Who owns the absolute prioritization of the Product Backlog in a standard Scrum organization model?',
                  options: ['The Scrum Master', 'The Lead Systems Architect', 'The Product Owner', 'The Lead QA Engineer'],
                  correctOptionIndex: 2
                },
                {
                  id: 'c3_q2',
                  text: 'What are the main output artifacts of a Scrum sprint planning ceremony?',
                  options: ['Sprint Backlog and Sprint Goal', 'Daily Status Log and Burn-down Report', 'Gantt Chart and Project Charter', 'Class Diagrams and Source Repositories'],
                  correctOptionIndex: 0
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c3_m2',
        title: 'Module 2: Object-Oriented Principles (SOLID)',
        lessons: [
          {
            id: 'c3_l4',
            title: 'Lesson 2.1: Single Responsibility & Open-Closed Design Guidelines',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '13:10',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c3_l5',
            title: 'Lesson 2.2: Liskov Substitution, Interface Segregation & Dependency Inversion',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '15:20',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c3_l6',
            title: 'Quiz 2.1: Applying SOLID Design Principles',
            type: 'quiz',
            quiz: {
              id: 'quiz_c3_m2',
              title: 'SOLID Design Patterns Evaluation',
              questions: [
                {
                  id: 'c3_q3',
                  text: 'Which SOLID principle is directly breached when high-level business modules import concrete details from low-level infrastructure modules instead of using abstract interfaces?',
                  options: ['Single Responsibility Principle (SRP)', 'Open/Closed Principle (OCP)', 'Liskov Substitution Principle (LSP)', 'Dependency Inversion Principle (DIP)'],
                  correctOptionIndex: 3
                },
                {
                  id: 'c3_q4',
                  text: 'If class B is a subclass of class A, we should be able to substitute an object of class A with B without modifying correct runtime outcomes. This statement describes:',
                  options: ['Open/Closed Principle', 'Liskov Substitution Principle', 'Interface Segregation Principle', 'Single Responsibility Principle'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c3_m3',
        title: 'Module 3: System Architecture & UML Design',
        lessons: [
          {
            id: 'c3_l7',
            title: 'Lesson 3.1: Monoliths vs Distributed Microservices',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            duration: '11:45',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c3_l8',
            title: 'Lesson 3.2: Unified Modeling Language: Class and Sequence Blueprints',
            type: 'pdf',
            pdfUrl: '/documents/cs301_uml_diagrams.pdf',
            duration: '22 min read',
            completed: false
          },
          {
            id: 'c3_l9',
            title: 'Quiz 3.1: Distributed Systems & UML Annotations',
            type: 'quiz',
            quiz: {
              id: 'quiz_c3_m3',
              title: 'Distributed Architectures Quiz',
              questions: [
                {
                  id: 'c3_q5',
                  text: 'Which UML representation is used to model sequential, logical timeline flow and interaction details between runtime actors and code instances?',
                  options: ['UML Class Diagram', 'UML Sequence Diagram', 'UML Use Case Diagram', 'UML Deployment Diagram'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 90
            }
          }
        ]
      },
      {
        id: 'c3_m4',
        title: 'Module 4: Code Testing & Continuous Integration (CI/CD)',
        lessons: [
          {
            id: 'c3_l10',
            title: 'Lesson 4.1: Unit Testing with Mocking Frameworks',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '14:50',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c3_l11',
            title: 'Lesson 4.2: Automated Integration Pipelines and CD Workflows',
            type: 'pdf',
            pdfUrl: '/documents/cs301_cicd_pipelines.pdf',
            duration: '14 min read',
            completed: false
          },
          {
            id: 'c3_l12',
            title: 'Quiz 4.1: Unit Test Framework Metrics',
            type: 'quiz',
            quiz: {
              id: 'quiz_c3_m4',
              title: 'Testing and DevOps Evaluator',
              questions: [
                {
                  id: 'c3_q6',
                  text: 'What terminology defines isolating a specific function in a test suite by replacing its external, third-party database dependency with lightweight mock objects?',
                  options: ['Refactoring', 'Mocking', 'Smoke Testing', 'Continuous Delivery'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 60
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course_4',
    title: 'Digital Marketing Essentials',
    code: 'MKT101',
    description: 'An overview of digital promotional channels, SEO fundamentals, pay-per-click strategies, conversion marketing, and analytics dashboards.',
    department: 'Business Administration',
    instructor: 'Prof. Marcus Aurelius',
    isPublished: true,
    modules: [
      {
        id: 'c4_m1',
        title: 'Module 1: SEO Ecosystem',
        lessons: [
          {
            id: 'c4_l1',
            title: 'Lesson 1.1: On-Page Optimization Elements',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '05:40',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c4_l2',
            title: 'Lesson 1.2: Reading Material - Comprehensive Off-Page Keyword Link Building',
            type: 'pdf',
            pdfUrl: '/documents/mkt101_seo_guide.pdf',
            duration: '20 min read',
            completed: false
          },
          {
            id: 'c4_l3',
            title: 'Quiz 1.1: Core Crawl & Index Optimization',
            type: 'quiz',
            quiz: {
              id: 'quiz_c4_m1',
              title: 'SEO Crawl & Keyword Essentials',
              questions: [
                {
                  id: 'c4_q1',
                  text: 'Which HTML meta tag indicates to search engines that they should favor a specific canonical version of a URL to avoid duplicate content penalties?',
                  options: ['rel="alternate"', 'rel="canonical"', 'name="robots" content="index"', 'name="viewport"'],
                  correctOptionIndex: 1
                },
                {
                  id: 'c4_q2',
                  text: 'What protocol contains instructions telling search engine crawler bots which web directories or paths they are allowed or forbidden from crawling?',
                  options: ['Sitemap.xml', 'Robots.txt', 'Schema.org metadata', 'Canonical Headers'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c4_m2',
        title: 'Module 2: Search Engine Marketing & PPC Campaigns',
        lessons: [
          {
            id: 'c4_l4',
            title: 'Lesson 2.1: Google Ads Auction bidding models',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '11:15',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c4_l5',
            title: 'Lesson 2.2: Perfecting Landing Page Conversion Copywriting',
            type: 'pdf',
            pdfUrl: '/documents/mkt101_landing_pages.pdf',
            duration: '15 min read',
            completed: false
          },
          {
            id: 'c4_l6',
            title: 'Quiz 2.1: Paid Ad Metric Formulations',
            type: 'quiz',
            quiz: {
              id: 'quiz_c4_m2',
              title: 'PPC Bidding Evaluation',
              questions: [
                {
                  id: 'c4_q3',
                  text: 'How do you formulate Click-Through Rate (CTR) in search campaign analysis?',
                  options: ['(Total Clicks / Total Conversions) * 100', '(Total Conversions / Total Impressions) * 100', '(Total Clicks / Total Impressions) * 100', '(Total Cost / Total Clicks) * 100'],
                  correctOptionIndex: 2
                },
                {
                  id: 'c4_q4',
                  text: 'In Google Ads, what variable impacts CPC prices and Ad Rank besides maximum bidding size?',
                  options: ['Organic SEO Domain Rank', 'Quality Score', 'Bounce Rate of home page', 'Domain Registration Length'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c4_m3',
        title: 'Module 3: Social Media & Brand Awareness',
        lessons: [
          {
            id: 'c4_l7',
            title: 'Lesson 3.1: Visual Storytelling and Content Funnels on Social Media',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            duration: '12:50',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c4_l8',
            title: 'Lesson 3.2: Influencer Outreach Strategy and Compliance Protocols',
            type: 'pdf',
            pdfUrl: '/documents/mkt101_social_branding.pdf',
            duration: '12 min read',
            completed: false
          },
          {
            id: 'c4_l9',
            title: 'Quiz 3.1: Engagement Rate Metrics',
            type: 'quiz',
            quiz: {
              id: 'quiz_c4_m3',
              title: 'Social Media Engagement Quiz',
              questions: [
                {
                  id: 'c4_q5',
                  text: 'What KPI defines the percentage of individual page-view sessions that lead to a product download, register, or transaction?',
                  options: ['CTR', 'Conversion Rate', 'Bounce Rate', 'Click-Share Coefficient'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 90
            }
          }
        ]
      },
      {
        id: 'c4_m4',
        title: 'Module 4: Marketing Analytics & Funnel Tracking',
        lessons: [
          {
            id: 'c4_l10',
            title: 'Lesson 4.1: Analyzing Google Analytics 4 Dashboards',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '14:10',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c4_l11',
            title: 'Lesson 4.2: Setting Up Urchin Tracking Module (UTM) Parameters',
            type: 'pdf',
            pdfUrl: '/documents/mkt101_utm_tracking.pdf',
            duration: '18 min read',
            completed: false
          },
          {
            id: 'c4_l12',
            title: 'Quiz 4.1: Multi-touch Attribution Models',
            type: 'quiz',
            quiz: {
              id: 'quiz_c4_m4',
              title: 'Marketing Analytics Evaluator',
              questions: [
                {
                  id: 'c4_q6',
                  text: 'Which campaign attribution framework distributes equal conversion credits across every touchpoint along the customer journey?',
                  options: ['First Touch Attribution', 'Last Touch Attribution', 'Linear Attribution Model', 'Time Decay Attribution Model'],
                  correctOptionIndex: 2
                }
              ],
              timeLimit: 60
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course_5',
    title: 'Business Communication',
    code: 'BUS102',
    description: 'Develop executive writing, professional persuasion techniques, critical board presentations, and internal communication hierarchies.',
    department: 'Business Administration',
    instructor: 'Prof. Marcus Aurelius',
    isPublished: true,
    modules: [
      {
        id: 'c5_m1',
        title: 'Module 1: Writing for Executives',
        lessons: [
          {
            id: 'c5_l1',
            title: 'Lesson 1.1: Structuring Concise Reports',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '07:02',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c5_l2',
            title: 'Lesson 1.2: Reading Material - The Minto Pyramid Principle in Written Memos',
            type: 'pdf',
            pdfUrl: '/documents/bus102_pyramid_principle.pdf',
            duration: '16 min read',
            completed: false
          },
          {
            id: 'c5_l3',
            title: 'Quiz 1.1: Executive Memos Structure',
            type: 'quiz',
            quiz: {
              id: 'quiz_c5_m1',
              title: 'Executive Summary Core Principles',
              questions: [
                {
                  id: 'c5_q1',
                  text: 'What is the core argument directive of Barbara Minto\'s Pyramid Principle in executive writing?',
                  options: [
                    'Introduce exhaustive background details before revealing your core conclusion',
                    'State your core answer first, followed immediately by logically grouped supporting arguments',
                    'Write chronologically matching the investigation process',
                    'Omit headings entirely to force the executive to read the complete narrative text'
                  ],
                  correctOptionIndex: 1
                },
                {
                  id: 'c5_q2',
                  text: 'Which structural approach ensures that all elements in a supporting group of an executive report are mutually exclusive and collectively exhaustive?',
                  options: ['The SCIP Strategy', 'The MECE Framework', 'The OKR Checklist', 'The SWOT Matrix'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c5_m2',
        title: 'Module 2: Boardroom Presentations & Body Language',
        lessons: [
          {
            id: 'c5_l4',
            title: 'Lesson 2.1: Slide Deck Design Hierarchy & Visual Storytelling',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            duration: '10:50',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c5_l5',
            title: 'Lesson 2.2: Managing Dynamic Voice Pacing and Stage Stances',
            type: 'pdf',
            pdfUrl: '/documents/bus102_stage_presence.pdf',
            duration: '11 min read',
            completed: false
          },
          {
            id: 'c5_l6',
            title: 'Quiz 2.1: Boardroom Q&A Management',
            type: 'quiz',
            quiz: {
              id: 'quiz_c5_m2',
              title: 'Boardroom Presentation Evaluator',
              questions: [
                {
                  id: 'c5_q3',
                  text: 'Which tactic is ideal when dealing with hostile, unsupportive questions from stakeholders during a board presentation?',
                  options: [
                    'Argue aggressively with facts to show they are wrong',
                    'Acknowledge their concern, reframe the premise productively, and respond objectively using data',
                    'Pretend you did not hear the question and continue to the next slide',
                    'Immediately end the session early to prevent conflicts'
                  ],
                  correctOptionIndex: 1
                },
                {
                  id: 'c5_q4',
                  text: 'The 10/20/30 slide presentation guideline created by Guy Kawasaki advises what metrics?',
                  options: ['10 slides, 20 minutes duration, 30pt minimum font size', '10 slides, 20 ideas, 30 columns of details', '10 minutes, 20 slides, 30 illustrations', '10 pages, 20 graphs, 30 seconds per slide'],
                  correctOptionIndex: 0
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c5_m3',
        title: 'Module 3: Internal Communications & Corporate Synergy',
        lessons: [
          {
            id: 'c5_l7',
            title: 'Lesson 3.1: Resolution Tactics for Cross-Department Conflicts',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '11:40',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c5_l8',
            title: 'Lesson 3.2: constructive Feedback Delivery Loops (SBI model)',
            type: 'pdf',
            pdfUrl: '/documents/bus102_feedback_loops.pdf',
            duration: '12 min read',
            completed: false
          },
          {
            id: 'c5_l9',
            title: 'Quiz 3.1: Professional EQ at Work',
            type: 'quiz',
            quiz: {
              id: 'quiz_c5_m3',
              title: 'Corporate Synergy Quiz',
              questions: [
                {
                  id: 'c5_q5',
                  text: 'What does the SBI constructive feedback delivery model stand for?',
                  options: ['Source, Behavior, Impact', 'Situation, Behavior, Impact', 'Standard, Blueprint, Improvement', 'Scenario, Breakthrough, Implementation'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 90
            }
          }
        ]
      },
      {
        id: 'c5_m4',
        title: 'Module 4: Negotiation & Crisis Communications',
        lessons: [
          {
            id: 'c5_l10',
            title: 'Lesson 4.1: Principled Negotiation and Best Alternative to Negotiated Agreement (BATNA)',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            duration: '15:10',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c5_l11',
            title: 'Lesson 4.2: Writing Crisis PR Statements and Action Plans',
            type: 'pdf',
            pdfUrl: '/documents/bus102_crisis_pr.pdf',
            duration: '22 min read',
            completed: false
          },
          {
            id: 'c5_l12',
            title: 'Quiz 4.1: Crisis PR and Negotiation Strategies',
            type: 'quiz',
            quiz: {
              id: 'quiz_c5_m4',
              title: 'Negotiation & Crisis Evaluator',
              questions: [
                {
                  id: 'c5_q6',
                  text: 'In crisis communications, what is the major risk of publishing defensive, late, or vague statements?',
                  options: ['Rapid loss of brand equity and public trust', 'Increased organic web traffic', 'Reduction in PR cost metrics', 'Legal class action nullification'],
                  correctOptionIndex: 0
                }
              ],
              timeLimit: 60
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course_quran',
    title: 'Fehm-ul-Quran (Understanding Quran)',
    code: 'ISL101',
    description: 'A study course dedicated to the complete Translation, Tafseer, Context, and Application of Quranic verses for ethical leadership.',
    department: 'Islamic Studies',
    instructor: 'Dr. Tariq Mahmood',
    isPublished: true,
    isQuran: true,
    modules: [
      {
        id: 'cq_m1',
        title: 'Module 1: Introduction & Structural Context',
        lessons: [
          {
            id: 'cq_l1',
            title: 'Quran Lesson 1.1: Revelation History & Makki/Madani Distinctions',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            duration: '08:34',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'cq_l1_sub',
            title: 'Quran Lesson 1.2: Reading Material - Comprehensive History of Preservation',
            type: 'pdf',
            pdfUrl: '/documents/isl101_preservation_history.pdf',
            duration: '15 min read',
            completed: false
          },
          {
            id: 'cq_l1_q',
            title: 'Quiz 1.1: Foundations of Quranic Revelation',
            type: 'quiz',
            quiz: {
              id: 'quiz_quran_m1',
              title: 'Preservation & Context Evaluation',
              questions: [
                {
                  id: 'q_m1_q1',
                  text: 'What is the key distinguishing thematic characteristic of Makki (revealed in Makkah) Surahs?',
                  options: [
                    'Focus on detail-oriented civil laws and transaction rules',
                    'Focus on basic beliefs, oneness of God (Tawheed), and the Hereafter',
                    'Emphasis on international treaty declarations',
                    'Explicit layouts of modern scientific calculations'
                  ],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'cq_m2',
        title: 'Module 2: Translation Core Basics',
        lessons: [
          {
            id: 'cq_l2',
            title: 'Quran Lesson 2.1: Key Vocabulary and Word-to-Word Meaning',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '12:00',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'cq_l2_sub',
            title: 'Quran Lesson 2.2: Standard Arabic Root Word Identification Rules',
            type: 'pdf',
            pdfUrl: '/documents/isl101_arabic_roots.pdf',
            duration: '18 min read',
            completed: false
          }
        ]
      },
      {
        id: 'cq_m3',
        title: 'Module 3: Tafseer & Historical Context (Asbab al-Nuzul)',
        lessons: [
          {
            id: 'cq_l3',
            title: 'Quran Lesson 3.1: Surah Al-Asr Detailed Exposition',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            duration: '09:12',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'cq_l4',
            title: 'Tafseer Reading Handout: Foundations of Surah Al-Asr',
            type: 'pdf',
            pdfUrl: '/documents/surah_asr_tafseer.pdf',
            duration: '20 min read',
            completed: false
          }
        ]
      },
      {
        id: 'cq_m4',
        title: 'Module 4: Practical Understanding and Code of Conduct',
        lessons: [
          {
            id: 'cq_l5',
            title: 'Quran Lesson 4.1: Deriving Legal & Ethical Norms for Communities',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '11:15',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'cq_l5_sub',
            title: 'Quran Lesson 4.2: Guidelines for Self-Purification (Tazkiyah)',
            type: 'pdf',
            pdfUrl: '/documents/isl101_tazkiyah.pdf',
            duration: '14 min read',
            completed: false
          }
        ]
      },
      {
        id: 'cq_m5',
        title: 'Module 5: Global Assessment & Ethical Certification',
        lessons: [
          {
            id: 'cq_l6',
            title: 'Graded Assessment: Comprehension & Practical Application of Quranic Ethics',
            type: 'quiz',
            quiz: {
              id: 'quiz_quran_m5',
              title: 'Quranic Comprehension Final Evaluator',
              questions: [
                {
                  id: 'q_q1',
                  text: 'According to Surah Al-Asr, which four traits guarantee humanity exemption from loss?',
                  options: [
                    'Sincerity, Prayer, Zakat, and Good character',
                    'Belief, Righteous action, Advising truthful conduct, and Mutual patience',
                    'Knowledge, Wealth, Kinship, and Fortitude',
                    'Migration, Supporting distress assistance, Fasting, and Contemplation'
                  ],
                  correctOptionIndex: 1
                },
                {
                  id: 'q_q2',
                  text: 'What terminology designates the historical circumstances or contextual occurrences surrounding the revelation of verses?',
                  options: ['Tadabbur', 'Asbab al-Nuzul', 'Qira\'at', 'I\'jaz al-Quran'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 180
            }
          }
        ]
      }
    ]
  }
];

const initialLibraryItems: LibraryItem[] = [
  {
    id: 'lib_1',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    category: 'Computer Science',
    fileSize: '34.2 MB',
    downloadsCount: 142
  },
  {
    id: 'lib_2',
    title: 'SOLID Design Patterns & OOP Best Practices',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    fileSize: '8.4 MB',
    downloadsCount: 97
  },
  {
    id: 'lib_3',
    title: 'Surah Al-Asr Tafseer: Comprehensive Exposition',
    author: 'Prof. Muhammad Abu-Nasr',
    category: 'Quranic Studies',
    fileSize: '2.5 MB',
    isBookmarked: true,
    downloadsCount: 220
  },
  {
    id: 'lib_4',
    title: 'The Principles of Digital Brand Growth',
    author: 'Elena Rostova',
    category: 'Marketing',
    fileSize: '12.1 MB',
    downloadsCount: 45
  },
  {
    id: 'lib_5',
    title: 'Research Paper: AI in Adaptive Pedagogy',
    author: 'Dr. Jane Smith et al.',
    category: 'Educational Technology',
    fileSize: '4.8 MB',
    isBookmarked: false,
    downloadsCount: 78
  }
];

const initialNotifications: LmsNotification[] = [
  {
    id: 'not_1',
    title: 'Welcome to the LMS',
    message: 'Your student profile Zayn Malik has been set up for the 4th Semester.',
    type: 'push',
    userId: 'user_student_1',
    sentAt: '2026-06-20T10:00:00Z',
    recipient: 'student@university.edu'
  },
  {
    id: 'not_2',
    title: 'New Quiz Graded',
    message: 'Your Quiz 1.1 Hardware Foundations was graded. Score: 100%. Check the reports panel!',
    type: 'email',
    userId: 'user_student_1',
    sentAt: '2026-06-21T18:30:00Z',
    recipient: 'student@university.edu'
  }
];

const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    courseId: 'course_1',
    senderId: 'user_student_1',
    senderName: 'Zayn Malik',
    senderRole: 'student',
    content: 'Hello Professor, I had a quick question regarding the Module 1 assignment. Should we implement the binary search algorithm recursively or iteratively?',
    timestamp: '2026-06-22T09:30:00.000Z'
  },
  {
    id: 'msg_2',
    courseId: 'course_1',
    senderId: 'user_prof_1',
    senderName: 'Dr. Sarah Jenkins',
    senderRole: 'professor',
    content: 'Hi Zayn! Either implementation is acceptable, but I recommend recursive as it fits our functional paradigm better. Make sure to document your base cases and complexity bounds!',
    timestamp: '2026-06-22T10:15:00.000Z'
  },
  {
    id: 'msg_3',
    courseId: 'course_1',
    senderId: 'user_student_1',
    senderName: 'Zayn Malik',
    senderRole: 'student',
    content: 'That is clear! Thank you so much for the clarification. I will get working on the recursion base case.',
    timestamp: '2026-06-22T10:20:00.000Z'
  }
];

interface DatabaseSchema {
  users: User[];
  courses: Course[];
  libraryItems: LibraryItem[];
  progress: VideoProgress[];
  attendance: AttendanceRecord[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  notifications: LmsNotification[];
  chatMessages: ChatMessage[];
  officeHours: OfficeHourSlot[];
  visaBookings?: any[];
}

const defaultDb: DatabaseSchema = {
  users: initialUsers,
  courses: getInitialCourses(),
  libraryItems: initialLibraryItems,
  progress: [
    {
      userId: 'user_student_1',
      courseId: 'course_1',
      lessonId: 'c1_l1',
      watchPercentage: 90,
      lastPosition: 540,
      completed: true
    },
    {
      userId: 'user_student_1',
      courseId: 'course_1',
      lessonId: 'c1_l4',
      watchPercentage: 85,
      lastPosition: 620,
      completed: true
    },
    {
      userId: 'user_student_1',
      courseId: 'course_quran',
      lessonId: 'cq_l1',
      watchPercentage: 95,
      lastPosition: 480,
      completed: true
    }
  ],
  attendance: [
    {
      userId: 'user_student_1',
      userName: 'Zayn Malik',
      studentId: 'ST-904123',
      courseId: 'course_1',
      courseTitle: 'Introduction to Computer Science',
      lessonId: 'c1_l1',
      lessonTitle: 'Lesson 1.1: History of Computing & Hardware Architecture',
      date: '2026-06-22',
      watchPercentage: 90,
      status: 'Present'
    },
    {
      userId: 'user_student_1',
      userName: 'Zayn Malik',
      studentId: 'ST-904123',
      courseId: 'course_1',
      courseTitle: 'Introduction to Computer Science',
      lessonId: 'c1_l4',
      lessonTitle: 'Lesson 2.1: Variables, Types, and Basic Arithmetic',
      date: '2026-06-23',
      watchPercentage: 85,
      status: 'Present'
    },
    {
      userId: 'user_student_1',
      userName: 'Zayn Malik',
      studentId: 'ST-904123',
      courseId: 'course_quran',
      courseTitle: 'Fehm-ul-Quran (Understanding Quran)',
      lessonId: 'cq_l1',
      lessonTitle: 'Quran Lesson 1.1: Revelation History & Makki/Madani Distinctions',
      date: '2026-06-24',
      watchPercentage: 95,
      status: 'Present'
    }
  ],
  quizAttempts: [
    {
      id: 'attempt_seed_1',
      userId: 'user_student_1',
      userName: 'Zayn Malik',
      courseId: 'course_1',
      quizId: 'quiz_c1_m1',
      quizTitle: 'Quiz 1.1: Hardware Foundations',
      score: 100,
      totalQuestions: 2,
      passed: true,
      date: '2026-06-22'
    }
  ],
  certificates: [],
  notifications: initialNotifications,
  chatMessages: initialChatMessages,
  officeHours: [
    {
      id: 'slot_1',
      courseId: 'course_1',
      professorId: 'user_prof_1',
      professorName: 'Dr. Sarah Jenkins',
      date: '2026-06-25',
      startTime: '10:00',
      endTime: '11:00',
      status: 'available'
    },
    {
      id: 'slot_2',
      courseId: 'course_1',
      professorId: 'user_prof_1',
      professorName: 'Dr. Sarah Jenkins',
      date: '2026-06-26',
      startTime: '14:00',
      endTime: '15:00',
      status: 'available'
    }
  ],
  visaBookings: []
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2));
      return defaultDb;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Auto-migrate database: Ensure our standard demo passwords are set for preloaded users
    let changed = false;
    
    if (!parsed.chatMessages || !Array.isArray(parsed.chatMessages)) {
      parsed.chatMessages = initialChatMessages;
      changed = true;
    }

    if (!parsed.officeHours || !Array.isArray(parsed.officeHours)) {
      parsed.officeHours = defaultDb.officeHours;
      changed = true;
    }

    if (!parsed.visaBookings || !Array.isArray(parsed.visaBookings)) {
      parsed.visaBookings = [];
      changed = true;
    }

    if (!parsed.attendance || !Array.isArray(parsed.attendance) || parsed.attendance.length === 0) {
      parsed.attendance = defaultDb.attendance;
      changed = true;
    }

    if (!parsed.progress || !Array.isArray(parsed.progress) || parsed.progress.length === 0) {
      parsed.progress = defaultDb.progress;
      changed = true;
    }

    if (!parsed.quizAttempts || !Array.isArray(parsed.quizAttempts) || parsed.quizAttempts.length === 0) {
      parsed.quizAttempts = defaultDb.quizAttempts;
      changed = true;
    }

    if (parsed.users && Array.isArray(parsed.users)) {
      parsed.users.forEach((u: any) => {
        if (u.email === 'student@university.edu' && !u.password) {
          u.password = 'student123';
          changed = true;
        } else if (u.email === 'professor@university.edu' && !u.password) {
          u.password = 'professor123';
          changed = true;
        } else if (u.email === 'admin@university.edu' && !u.password) {
          u.password = 'admin123';
          changed = true;
        }
      });
    }

    // Auto-migrate: Ensure preloaded courses have all their enriched modules and lessons
    if (parsed.courses && Array.isArray(parsed.courses)) {
      getInitialCourses().forEach((initCourse) => {
        const existingIdx = parsed.courses.findIndex((c: any) => c.id === initCourse.id);
        if (existingIdx === -1) {
          parsed.courses.push(initCourse);
          changed = true;
        } else {
          const existingCourse = parsed.courses[existingIdx];
          const existingLessonsCount = existingCourse.modules.reduce((sum: number, m: any) => sum + (m.lessons || []).length, 0);
          const initLessonsCount = initCourse.modules.reduce((sum: number, m: any) => sum + (m.lessons || []).length, 0);
          if (existingCourse.modules.length < initCourse.modules.length || existingLessonsCount < initLessonsCount) {
            parsed.courses[existingIdx] = initCourse;
            changed = true;
          }
        }
      });
    }

    if (changed) {
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2));
    }
    
    return parsed;
  } catch (err) {
    console.error('Error reading DB, returning defaultDb', err);
    return defaultDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB', err);
  }
}

// -----------------------------------------------------
// Initialize db file on boot
// -----------------------------------------------------
readDb();

// Setup Gemini Client Server-Side
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;
if (API_KEY && API_KEY !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
  console.log('Gemini API initialized successfully in full-stack backend module.');
} else {
  console.warn('Gemini API Key missing or default. Server will use highly realistic dynamic context fallback for tutor/quizzes.');
}

// -----------------------------------------------------
// REST APIs & Business Logic
// -----------------------------------------------------

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  // Find institutional user
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').trim().toLowerCase());
  if (user) {
    // Determine the expected password (saved value or default fallback)
    const expectedPassword = user.password || (user.role === 'admin' ? 'admin123' : user.role === 'professor' ? 'professor123' : 'student123');
    if ((password || '').trim() !== expectedPassword) {
      return res.status(401).json({ error: `Incorrect password. Hint: Try 'student123' for Student, 'professor123' for Professor, 'admin123' for Admin` });
    }
    return res.json({
      token: `mock-jwt-token-for-${user.id}`,
      user
    });
  }
  return res.status(401).json({ error: 'Invalid institutional credentials or email not found' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, phone, department, semester, studentId, facultyId, employeeId, designation, password } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required fields' });
  }

  const db = readDb();
  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'This email is already registered on our LMS system' });
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    role: role as any,
    phone: phone || '',
    department: department || 'General Education',
    semester: semester || '',
    studentId: role === 'student' ? (studentId || `ST-${Math.floor(100000 + Math.random() * 900000)}`) : undefined,
    facultyId: role === 'professor' ? (facultyId || `FAC-${Math.floor(10000 + Math.random() * 90000)}`) : undefined,
    employeeId: role === 'admin' ? (employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
    designation: designation || '',
    password: password || (role === 'admin' ? 'admin123' : role === 'professor' ? 'professor123' : 'student123')
  };

  db.users.push(newUser);

  // Add a welcome notification
  const newNotif: LmsNotification = {
    id: `not_${Date.now()}`,
    title: 'LMS Profile Provisioned',
    message: `Account set up successfully as ${role}. Access your academic courses immediately.`,
    type: 'push',
    userId: newUser.id,
    sentAt: new Date().toISOString(),
    recipient: newUser.email
  };
  db.notifications.unshift(newNotif);

  writeDb(db);
  res.json({ success: true, token: `mock-jwt-token-for-${newUser.id}`, user: newUser });
});

app.get('/api/auth/users', (req, res) => {
  const db = readDb();
  res.json(db.users);
});

app.delete('/api/auth/users/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.users = db.users.filter(u => u.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Courses API
app.get('/api/courses', (req, res) => {
  const db = readDb();
  res.json(db.courses);
});

app.post('/api/courses', (req, res) => {
  const { title, code, description, department, instructor, isQuran } = req.body;
  if (!title || !code) {
    return res.status(400).json({ error: 'Title and code are required' });
  }
  const db = readDb();
  const isDup = db.courses.some(c => c.code.toLowerCase() === code.toLowerCase());
  if (isDup) {
    return res.status(400).json({ error: 'Course code already exists' });
  }
  const newCourse: Course = {
    id: `course_${Date.now()}`,
    title,
    code,
    description: description || 'No description assigned.',
    department: department || 'General Education',
    instructor: instructor || 'Dr. Dr. Sarah Jenkins',
    isPublished: true,
    isQuran: !!isQuran,
    modules: []
  };
  db.courses.push(newCourse);
  writeDb(db);
  res.json({ success: true, course: newCourse });
});

// Create Module / Lesson
app.post('/api/courses/:courseId/modules', (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Module title required' });
  
  const db = readDb();
  const idx = db.courses.findIndex(c => c.id === courseId);
  if (idx === -1) return res.status(404).json({ error: 'Course not found' });
  
  const newModule = {
    id: `m_${Date.now()}`,
    title,
    lessons: []
  };
  
  db.courses[idx].modules.push(newModule);
  writeDb(db);
  res.json({ success: true, course: db.courses[idx] });
});

// Add Lesson
app.post('/api/courses/:courseId/modules/:moduleId/lessons', (req, res) => {
  const { courseId, moduleId } = req.params;
  const { title, type, duration, pdfUrl, videoUrl, quiz } = req.body;
  if (!title || !type) return res.status(400).json({ error: 'Lesson title and code is required' });

  const db = readDb();
  const cIndex = db.courses.findIndex(c => c.id === courseId);
  if (cIndex === -1) return res.status(404).json({ error: 'Course not found' });

  const mIndex = db.courses[cIndex].modules.findIndex(m => m.id === moduleId);
  if (mIndex === -1) return res.status(404).json({ error: 'Module not found' });

  const newLesson: Lesson = {
    id: `l_${Date.now()}`,
    title,
    type: type as any,
    duration: duration || '10:00',
    pdfUrl: type === 'pdf' ? (pdfUrl || '/documents/sample.pdf') : undefined,
    videoUrl: type === 'video' ? (videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4') : undefined,
    quiz: type === 'quiz' ? (quiz || { id: `quiz_${Date.now()}`, title, questions: [], timeLimit: 120 }) : undefined
  };

  db.courses[cIndex].modules[mIndex].lessons.push(newLesson);

  // Send a Notification to all students enrolled in this department regarding a newly compiled lecture!
  const targetStudents = db.users.filter(u => u.role === 'student');
  targetStudents.forEach(st => {
    db.notifications.push({
      id: `not_lesson_${Date.now()}_${Math.random()}`,
      title: 'New Lecture Uploaded',
      message: `Dr. Sarah Jenkins uploaded "${title}" in "${db.courses[cIndex].title}". Study today!`,
      type: 'push',
      userId: st.id,
      sentAt: new Date().toISOString(),
      recipient: st.email
    });
  });

  writeDb(db);
  res.json({ success: true, lesson: newLesson });
});

// Emulate Video Upload & FFmpeg Adaptive Streaming Compression
app.post('/api/upload/video-process', async (req, res) => {
  const { name, fileSize } = req.body;
  // This route emulates uploading a video and launching a full background FFmpeg transcode 
  // into 360p, 480p, 720p, 1080p generating HLS segments (.m3u8 index file)
  
  const steps = [];
  steps.push({ status: 'Processing original MP4 file...', time: '0.5s' });
  steps.push({ status: 'HLS segment generation started...', time: '1.2s' });
  steps.push({ status: 'FFmpeg spawned transcode stream for 360p...', time: '2.4s' });
  steps.push({ status: 'FFmpeg spawned transcode stream for 480p...', time: '3.6s' });
  steps.push({ status: 'FFmpeg spawned transcode stream for 720p...', time: '5.0s' });
  steps.push({ status: 'FFmpeg spawned transcode stream for 1080p (high intensity)...', time: '6.8s' });
  steps.push({ status: 'Generating .m3u8 adaptive index descriptor manifest files...', time: '8.1s' });
  steps.push({ status: 'Deploying processed static segments to distributed CDN Storage cloud...', time: '9.3s' });
  steps.push({ status: 'Adaptive HLS Streaming URL published with watermark protection.', time: '10.5s' });

  // Wait 1.5 seconds mock latency to simulate server-side background start
  setTimeout(() => {
    res.json({
      success: true,
      filename: name,
      originalSize: fileSize,
      publishedHlsUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      steps,
      watermarkText: 'SECURED_ACADEMIC_STREAM_COPY_PROTECTED'
    });
  }, 1200);
});

// Video Progress & Attendance Tracker (Core Rules: >=80% watch = Present)
app.post('/api/courses/progress', (req, res) => {
  const { userId, courseId, lessonId, watchPercentage, lastPosition } = req.body;
  if (!userId || !courseId || !lessonId) {
    return res.status(400).json({ error: 'Missing required tracking details' });
  }

  const db = readDb();
  let progIndex = db.progress.findIndex(p => p.userId === userId && p.lessonId === lessonId);
  const completed = watchPercentage >= 80;

  const progObj: VideoProgress = {
    userId,
    courseId,
    lessonId,
    watchPercentage,
    lastPosition: lastPosition || 0,
    completed
  };

  if (progIndex > -1) {
    // Merge updates
    const currentProg = db.progress[progIndex];
    progObj.watchPercentage = Math.max(currentProg.watchPercentage, watchPercentage);
    progObj.completed = progObj.watchPercentage >= 80;
    db.progress[progIndex] = progObj;
  } else {
    db.progress.push(progObj);
  }

  // Look up details for Attendance Logging
  const user = db.users.find(u => u.id === userId);
  const course = db.courses.find(c => c.id === courseId);
  
  let lessonTitle = 'Lecture';
  if (course) {
    for (const m of course.modules) {
      const les = m.lessons.find(l => l.id === lessonId);
      if (les) {
        lessonTitle = les.title;
        break;
      }
    }
  }

  if (user && course) {
    // Update or Insert Attendance
    const today = new Date().toISOString().split('T')[0];
    const status = completed ? 'Present' : 'Incomplete';
    
    let attIndex = db.attendance.findIndex(a => a.userId === userId && a.lessonId === lessonId);
    
    const attRecord: AttendanceRecord = {
      userId,
      userName: user.name,
      studentId: user.studentId || 'N/A',
      courseId,
      courseTitle: course.title,
      lessonId,
      lessonTitle,
      date: today,
      watchPercentage: progObj.watchPercentage,
      status
    };

    if (attIndex > -1) {
      db.attendance[attIndex] = attRecord;
    } else {
      db.attendance.push(attRecord);
    }

    // Add push notification on milestone Present status
    if (completed && attIndex === -1) {
      db.notifications.unshift({
        id: `not_att_${Date.now()}`,
        title: 'Attendance marked Present',
        message: `Status for ${lessonTitle} changed to PRESENT (watched over 80%). Keep studying!`,
        type: 'push',
        userId,
        sentAt: new Date().toISOString(),
        recipient: user.email
      });
    }
  }

  writeDb(db);
  res.json({ success: true, progress: progObj });
});

// Fetch progress logs for active student
app.get('/api/courses/progress/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  const prog = db.progress.filter(p => p.userId === userId);
  res.json(prog);
});

// Attendance listing
app.get('/api/attendance', (req, res) => {
  const db = readDb();
  res.json(db.attendance);
});

// Quiz Submission & Auto-Grading & Certificate System
app.post('/api/quiz/submit', (req, res) => {
  const { userId, courseId, quizId, answers } = req.body;
  if (!userId || !courseId || !quizId || !answers) {
    return res.status(400).json({ error: 'Missing details for quiz grading' });
  }

  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  const course = db.courses.find(c => c.id === courseId);
  if (!user || !course) {
    return res.status(404).json({ error: 'User or Course not found' });
  }

  // Find the exact quiz
  let foundQuiz: any = null;
  for (const m of course.modules) {
    const l = m.lessons.find(les => les.type === 'quiz' && les.quiz?.id === quizId);
    if (l && l.quiz) {
      foundQuiz = l.quiz;
      break;
    }
  }

  if (!foundQuiz) {
    return res.status(404).json({ error: 'Quiz not found inside course modules' });
  }

  let correctCount = 0;
  foundQuiz.questions.forEach((q: any) => {
    const studentAnswer = answers[q.id];
    if (studentAnswer !== undefined && Number(studentAnswer) === q.correctOptionIndex) {
      correctCount++;
    }
  });

  const totalQuestions = foundQuiz.questions.length || 1;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= 70; // 70% is pass threshold

  const finalScore = scorePercent;

  const attempt: QuizAttempt = {
    id: `attempt_${Date.now()}`,
    userId,
    userName: user.name,
    courseId,
    quizId,
    quizTitle: foundQuiz.title,
    score: finalScore,
    totalQuestions,
    passed,
    date: new Date().toISOString()
  };

  db.quizAttempts.unshift(attempt);

  // If user passed AND this is course completion or final, issue Certificate!
  let certificate: Certificate | null = null;
  if (passed) {
    // Generate simple Certificate
    const certCode = `CERT-${course.code}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      userId,
      userName: user.name,
      courseId,
      courseTitle: course.title,
      issueDate: new Date().toISOString().split('T')[0],
      certificateCode: certCode
    };
    db.certificates.unshift(newCert);
    certificate = newCert;

    // Send a Notification about scoring success
    db.notifications.unshift({
      id: `not_cert_${Date.now()}`,
      title: 'Academic Certificate Issued!',
      message: `Congratulations! You passed "${foundQuiz.title}" and earned a Certificate in "${course.title}".`,
      type: 'email',
      userId,
      sentAt: new Date().toISOString(),
      recipient: user.email
    });
  }

  writeDb(db);
  res.json({
    success: true,
    score: finalScore,
    correctCount,
    totalQuestions,
    passed,
    certificate
  });
});

app.get('/api/certificates', (req, res) => {
  const db = readDb();
  res.json(db.certificates);
});

app.get('/api/certificates/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  res.json(db.certificates.filter(c => c.userId === userId));
});

app.get('/api/quiz-attempts', (req, res) => {
  const db = readDb();
  res.json(db.quizAttempts);
});

app.get('/api/quiz-attempts/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  res.json(db.quizAttempts.filter(qa => qa.userId === userId));
});

// Library REST Endpoints
app.get('/api/library', (req, res) => {
  const db = readDb();
  res.json(db.libraryItems);
});

app.post('/api/library', (req, res) => {
  const { title, author, category, fileSize } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Title and Author are required.' });
  const db = readDb();
  const newItem: LibraryItem = {
    id: `lib_${Date.now()}`,
    title,
    author,
    category: category || 'Reference Notes',
    fileSize: fileSize || '3.5 MB',
    downloadsCount: 0
  };
  db.libraryItems.push(newItem);
  writeDb(db);
  res.json({ success: true, item: newItem });
});

app.post('/api/library/:id/download', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const idx = db.libraryItems.findIndex(item => item.id === id);
  if (idx > -1) {
    db.libraryItems[idx].downloadsCount++;
    writeDb(db);
    return res.json({ success: true, downloadsCount: db.libraryItems[idx].downloadsCount });
  }
  res.status(404).json({ error: 'Library book not found' });
});

// Notifications REST APIs
app.get('/api/notifications', (req, res) => {
  const db = readDb();
  res.json(db.notifications || []);
});

app.post('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const notif = db.notifications.find(n => n.id === id);
  if (notif) {
    notif.isRead = true;
    writeDb(db);
    return res.json({ success: true, notification: notif });
  }
  res.status(404).json({ error: 'Notification not found' });
});

app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  res.json(db.notifications.filter(n => n.userId === userId || n.userId === 'all'));
});

// Chat Messages REST APIs
app.get('/api/chat-messages/:courseId', (req, res) => {
  const { courseId } = req.params;
  const db = readDb();
  const messages = (db.chatMessages || []).filter(msg => msg.courseId === courseId);
  res.json(messages);
});

app.post('/api/chat-messages', (req, res) => {
  const { courseId, senderId, senderName, senderRole, content } = req.body;
  if (!courseId || !senderId || !senderName || !senderRole || !content) {
    return res.status(400).json({ error: 'Missing required message parameters' });
  }
  const db = readDb();
  if (!db.chatMessages) {
    db.chatMessages = [];
  }
  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    courseId,
    senderId,
    senderName,
    senderRole,
    content,
    timestamp: new Date().toISOString()
  };
  db.chatMessages.push(newMessage);
  writeDb(db);
  res.status(201).json(newMessage);
});

// System Analytics for Dashboard Widgets
app.get('/api/reports', (req, res) => {
  const db = readDb();
  const totalStudents = db.users.filter(u => u.role === 'student').length;
  const totalProfessors = db.users.filter(u => u.role === 'professor').length;
  const totalCourses = db.courses.length;
  
  // Storage size estimation in MB
  const storageUsageMB = 1424.5; // Emulated cloud S3 + transcoding cache
  
  // Attendance status overview
  const totalAtt = db.attendance.length || 1;
  const presents = db.attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = Math.round((presents / totalAtt) * 100);

  // Grade averages grouped by course
  const courseAverages = db.courses.map(c => {
    const attempts = db.quizAttempts.filter(q => q.courseId === c.id);
    const avg = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, current) => sum + current.score, 0) / attempts.length)
      : 82; // Fallback seed
    return {
      courseId: c.id,
      courseCode: c.code,
      title: c.title,
      averageGrade: avg,
      studentsCount: Math.max(3, db.users.filter(u => u.role === 'student' && u.department === c.department).length)
    };
  });

  res.json({
    totalStudents,
    totalProfessors,
    totalCourses,
    storageUsageMB,
    attendanceRate,
    courseAverages,
    activeSessions: 54, // emulated real-time active connections
  });
});

// -----------------------------------------------------
// Server-Side Gemini AI Integration APIs
// -----------------------------------------------------

app.post('/api/ai/chat', async (req, res) => {
  const { message, context, chatHistory } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message field is required for AI interaction' });
  }

  // Create robust educational framing for our AI LMS Assistant
  const systemInstruction = `
    You are an expert server-side AI academic tutor and assistant inside our custom University Learning Management System (LMS).
    
    Current academic context for this student is: ${JSON.stringify(context || {})}.
    
    GUIDELINES:
    1. Respond with high pedagogical quality. Keep answers academically structured, extremely informative, and concise.
    2. Support any learning inquiry related to Computer Science, Digital Marketing, Business Communication, and Surah Al-Asr (islamic ethical course).
    3. Encourage the student and guide them through mathematical or logic problems step-by-step instead of telling them the exact program answer immediately.
    4. Speak elegantly and humbly. Use Markdown directly to highlight key definitions and code pieces (e.g. bolding terms, format code nicely in backticks).
  `;

  // Check if Gemini is enabled, otherwise use smart dynamic fallback
  if (ai) {
    try {
      // Reformat history for @google/genai format
      const formattedHistory = (chatHistory || []).map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));

      // Create a chat session as recommended in SKILL.md
      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction,
          temperature: 0.7
        },
        history: formattedHistory
      });

      const response = await chat.sendMessage({ message });
      return res.json({ text: response.text });
    } catch (e: any) {
      console.error('Gemini call failed, employing structural backup', e);
      // Let it slide to our secondary generator for resilience
    }
  }

  // Resilient Academic Fallback Engine (In case API Key is missing or quota is limited)
  setTimeout(() => {
    let lower = message.toLowerCase();
    let reply = `**Hello there!** I am your **AI Tutor Chatbot**. Inside this academic study platform, I can help summarize lectures, explain hard concepts, and generate custom practice questions for you.\n\n`;

    if (lower.includes('hardware') || lower.includes('computer science') || lower.includes('cpu')) {
      reply += `Let me explain computer architecture for CS101. The instruction cycle runs in the standard **Fetch-Decode-Execute** cycle:\n1. **Fetch**: The Control Unit gets instructions from the RAM based on the Program Counter.\n2. **Decode**: Instructions are converted into signal codes.\n3. **Execute**: The **ALU** registers carry out calculations.\n\nWhat specific part of hardware registers would you like to explore next?`;
    } else if (lower.includes('quran') || lower.includes('surah') || lower.includes('asr') || lower.includes('tafseer')) {
      reply += `In Islamic Studies (ISL101), **Surah Al-Asr** is highly valued for outlining a comprehensive code of ethics in three short verses. \n` +
               `* **Exposition**: It establishes that Human Time is a depleting resource leading to loss, except for individuals possessing four attributes:\n` +
               `  1. *Iman* (Unwavering belief)\n` +
               `  2. *Amal al-Salihat* (Constructive righteous deeds)\n` +
               `  3. *Tawasaw bi al-Haqq* (Mutual counsel of truth)\n` +
               `  4. *Tawasaw bi al-Sabr* (Mutual counsel of steadfast patience)\n\nCould I help prepare a practice evaluation on these Tafseer details?`;
    } else if (lower.includes('solid') || lower.includes('software') || lower.includes('design patterns')) {
      reply += `Inside Software Engineering (CS301), **SOLID design principles** represent 5 rules for object-oriented systems:\n` +
               `* **S**ingle Responsibility: A class should have one reason to change.\n` +
               `* **O**pen/Closed: Open for extension, closed for modification.\n` +
               `* **L**iskov Substitution: Subtypes must be substitutable for base types.\n` +
               `* **I**nterface Segregation: Many client-specific interfaces are better than one general interface.\n` +
               `* **D**ependency Inversion: Depend on abstractions rather than details.\n\nWhich of these would you like to practice?`;
    } else {
      reply += `That's a vital concept. Let's break this down into clear terms. Could you provide a bit more context? Specifically, reference which course lesson you are working on, and I'll generate a custom summaries, quiz, or mathematical step-by-step resolution!`;
    }

    res.json({ text: reply });
  }, 1000);
});

// Dynamic AI Quiz Generator Route
app.post('/api/ai/quiz-generate', async (req, res) => {
  const { topic } = req.body;
  const prompt = `
    Generate an educational evaluation MCQ quiz for the academic topic: "${topic || 'General Science'}".
    Provide EXACTLY 2 high-quality MCQ questions with 4 logical option keys and specify the correct option index (0 to 3).
    Return your response strictly in the following JSON array object format:
    [
      {
        "text": "What is ...?",
        "options": ["A", "B", "C", "D"],
        "correctOptionIndex": 1
      },
      ...
    ]
  `;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY' as any,
            items: {
              type: 'OBJECT' as any,
              properties: {
                text: { type: 'STRING' as any },
                options: {
                  type: 'ARRAY' as any,
                  items: { type: 'STRING' as any }
                },
                correctOptionIndex: { type: 'INTEGER' as any }
              },
              required: ['text', 'options', 'correctOptionIndex']
            }
          }
        }
      });
      const data = JSON.parse(response.text || '[]');
      return res.json({ success: true, questions: data });
    } catch (e) {
      console.error('Failed using Gemini response schema, fallback to static evaluation questions', e);
    }
  }

  // Backup evaluator
  setTimeout(() => {
    res.json({
      success: true,
      questions: [
        {
          id: `ai_q_${Date.now()}_1`,
          text: `Which architectural feature is essential to scale distributed LMS streaming nodes efficiently?`,
          options: [
            'Storing large segments on primary database disks',
            'S3 Object storage matched with CDN distribution and edge-cached HLS segments',
            'Full in-memory RAM caches for 4K video frames',
            'Monolithic single-process web controllers'
          ],
          correctOptionIndex: 1
        },
        {
          id: `ai_q_${Date.now()}_2`,
          text: `Under LMS Attendance rules, what minimum percentage of lecture video must a student watch to earn a 'Present' status?`,
          options: ['50%', '60%', '75%', '80%'],
          correctOptionIndex: 3
        }
      ]
    });
  }, 1000);
});

// -----------------------------------------------------
// Office Hours Scheduling API Endpoints
// -----------------------------------------------------

// Get all office hour slots
app.get('/api/office-hours', (req, res) => {
  const db = readDb();
  res.json(db.officeHours || []);
});

// Create a new office hour slot (by instructor/professor)
app.post('/api/office-hours', (req, res) => {
  const { courseId, professorId, professorName, date, startTime, endTime } = req.body;
  
  if (!courseId || !professorId || !professorName || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required office hour parameters' });
  }

  const db = readDb();
  if (!db.officeHours) {
    db.officeHours = [];
  }

  const newSlot: OfficeHourSlot = {
    id: `slot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    courseId,
    professorId,
    professorName,
    date,
    startTime,
    endTime,
    status: 'available'
  };

  db.officeHours.push(newSlot);
  writeDb(db);
  res.status(201).json(newSlot);
});

// Book an office hour slot (by student)
app.post('/api/office-hours/:id/book', (req, res) => {
  const { id } = req.params;
  const { studentId, studentName, studentEmail, meetingNotes } = req.body;

  if (!studentId || !studentName || !studentEmail) {
    return res.status(400).json({ error: 'Missing student booking details' });
  }

  const db = readDb();
  if (!db.officeHours) {
    db.officeHours = [];
  }

  const slotIndex = db.officeHours.findIndex(s => s.id === id);
  if (slotIndex === -1) {
    return res.status(404).json({ error: 'Office hour slot not found' });
  }

  const slot = db.officeHours[slotIndex];
  if (slot.status === 'booked') {
    return res.status(400).json({ error: 'Office hour slot is already booked' });
  }

  slot.status = 'booked';
  slot.studentId = studentId;
  slot.studentName = studentName;
  slot.studentEmail = studentEmail;
  slot.meetingNotes = meetingNotes || '';

  writeDb(db);
  res.json(slot);
});

// Cancel a booking or slot
app.post('/api/office-hours/:id/cancel', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.officeHours) {
    db.officeHours = [];
  }

  const slotIndex = db.officeHours.findIndex(s => s.id === id);
  if (slotIndex === -1) {
    return res.status(404).json({ error: 'Office hour slot not found' });
  }

  const slot = db.officeHours[slotIndex];
  
  // Revert status to available, clear student booking info
  slot.status = 'available';
  delete slot.studentId;
  delete slot.studentName;
  delete slot.studentEmail;
  delete slot.meetingNotes;

  writeDb(db);
  res.json(slot);
});

// Delete an office hour slot entirely (by professor)
app.delete('/api/office-hours/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.officeHours) {
    db.officeHours = [];
  }

  const slotIndex = db.officeHours.findIndex(s => s.id === id);
  if (slotIndex === -1) {
    return res.status(404).json({ error: 'Office hour slot not found' });
  }

  db.officeHours.splice(slotIndex, 1);
  writeDb(db);
  res.json({ success: true, message: 'Office hour slot deleted successfully' });
});

// -----------------------------------------------------
// Visa & Admissions Counseling APIs (VisaLaga Module)
// -----------------------------------------------------

// Get all visa counseling bookings
app.get('/api/visa-bookings', (req, res) => {
  const db = readDb();
  res.json(db.visaBookings || []);
});

// Create a new visa counseling booking
app.post('/api/visa-bookings', (req, res) => {
  const { studentId, studentName, studentEmail, advisorId, advisorName, date, timeSlot, notes } = req.body;
  
  if (!studentId || !advisorId || !date || !timeSlot) {
    return res.status(400).json({ error: 'Missing required booking parameters' });
  }

  const db = readDb();
  if (!db.visaBookings) {
    db.visaBookings = [];
  }

  // Prevent double booking for same advisor on same date + time slot
  const exists = db.visaBookings.some(b => b.advisorId === advisorId && b.date === date && b.timeSlot === timeSlot);
  if (exists) {
    return res.status(409).json({ error: 'This counselor slot is already reserved.' });
  }

  const newBooking = {
    id: `v_b_${Date.now()}`,
    studentId,
    studentName,
    studentEmail: studentEmail || 'student@university.edu',
    advisorId,
    advisorName,
    date,
    timeSlot,
    notes: notes || ''
  };

  db.visaBookings.push(newBooking);
  writeDb(db);
  res.status(201).json(newBooking);
});

// Cancel a visa booking
app.delete('/api/visa-bookings/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  
  if (!db.visaBookings) {
    db.visaBookings = [];
  }

  const index = db.visaBookings.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Visa booking not found' });
  }

  db.visaBookings.splice(index, 1);
  writeDb(db);
  res.json({ success: true, message: 'Advisory consultation cancelled successfully' });
});

// AI Visa advisory chat route (utilizes server-side Gemini)
app.post('/api/ai/visa-chat', async (req, res) => {
  const { message, context, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Query message is required' });
  }

  const systemInstruction = `
    You are an expert server-side global admissions and visa consultant counselor inside our custom Learning Management System (LMS) powered by the "VisaLaga" education consultancy.
    
    Student details are: ${JSON.stringify(context || {})}.
    
    CRITICAL INSTRUCTIONS & GUIDELINES:
    1. Act as a high-fidelity immigration advisor for students aiming to study in the United Kingdom, United States, Canada, Australia, and Germany.
    2. Provide highly professional, structured, and accurate guidance on:
       - University admissions criteria (GPA, English certificates, recommendations)
       - Fully funded scholarship board deadlines and requirements (Chevening, Fulbright, DAAD)
       - Required student visa bank statements, block accounts (Sperrkonto: €11,208), or financial proof.
       - Statement of Purpose (SOP) formulation advice.
    3. Keep responses structured, professional, exceptionally clear, and encouraging. Use elegant Markdown (bold headings, bullet lists, bolded numbers) directly.
    4. Speak humbly and respectfully. Do not hallucinate or make up visa fees or timelines. Frame estimates clearly.
  `;

  // Try calling Gemini first
  if (ai) {
    try {
      const formattedHistory = (chatHistory || []).map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction,
          temperature: 0.7
        },
        history: formattedHistory
      });

      const response = await chat.sendMessage({ message });
      return res.json({ text: response.text });
    } catch (e: any) {
      console.error('Gemini visa advisory call failed, employing fallback', e);
    }
  }

  // Secure backup local response generator
  setTimeout(() => {
    const lower = message.toLowerCase();
    let reply = `Based on the latest **VisaLaga study abroad rules**, let's analyze your inquiry:\n\n`;

    if (lower.includes('uk') || lower.includes('united kingdom') || lower.includes('cas')) {
      reply += `For the **United Kingdom Student Visa**:\n` +
               `* **CAS (Confirmation of Acceptance)**: You must secure an unconditional offer from an approved licensed sponsor university.\n` +
               `* **Financial Statement**: Show tuition fee balance + annual living cost (£12,006 if in London, or £9,207 outside London). The funds must be held in a regulated financial bank account for exactly **28 consecutive days** without dipping below the required balance.\n` +
               `* **Post-study Work**: Upon graduation, you are eligible for the **2-year Graduate Route post-study work visa**.\n\nWould you like me to book a session with **Sir Imran Ahmed** to review your UK university profile?`;
    } else if (lower.includes('german') || lower.includes('germany') || lower.includes('block') || lower.includes('sperrkonto')) {
      reply += `To secure a student visa for **Germany**:\n` +
               `* **Sperrkonto (Block Account)**: For 2026 entry, you must open a blocked account with €11,208 deposited. It permits monthly payouts of €934 for student living costs.\n` +
               `* **Tuition Fees**: Free in state universities! You only pay about €150-€350 per semester for public transit and campus union administration fees.\n` +
               `* **Language Requirements**: IELTS 6.0 to 6.5 is suitable for English-taught master's courses, though conversational German (A2) helps in daily life.\n\nWould you like to explore German EPOS DAAD scholarships?`;
    } else if (lower.includes('canada') || lower.includes('sds')) {
      reply += `For **Canada (Study Permit)**:\n` +
               `* **Student Direct Stream (SDS)**: Extremely fast processing. Requires upfront payment of first-year tuition, a C$20,635 GIC (Guaranteed Investment Certificate) for living expenses, and an **IELTS score of 6.5** with no single module under 6.0.\n` +
               `* **PGWPP (Post-Graduation Work Permit)**: Outstanding opportunity. Grants up to **3 years of open work rights** depending on study program length.\n\nI recommend utilizing our **Interactive Document Checklist** to monitor your GIC status.`;
    } else if (lower.includes('scholarship') || lower.includes('chevening') || lower.includes('fulbright')) {
      reply += `Our **Scholarships Directory** lists several fully funded options:\n` +
               `1. **Chevening Scholarships (UK)**: Closes in November. Fully funded Masters covering tuition, flight, and £1,200/mo allowance.\n` +
               `2. **Fulbright Program (USA)**: Outstanding postgraduate scholarship including research support, tuition, and medical insurance.\n` +
               `3. **DAAD EPOS (Germany)**: Excellent for professionals from developing nations with at least 2 years of experience.\n\nWhat scholarship criteria fits your current level?`;
    } else if (lower.includes('ielts') || lower.includes('pte') || lower.includes('score')) {
      reply += `**Language Standard Thresholds**:\n` +
               `* **Undergraduate**: Overall IELTS 6.0 (no band below 5.5) or PTE Academic 50.\n` +
               `* **Postgraduate / Masters**: Overall IELTS 6.5 (no band below 6.0) or PTE Academic 58.\n` +
               `* **Ivy-League US**: Often expects IELTS 7.0 or TOEFL iBT 90+.\n\nYou can upload your test report under the **Document Checklist** to initiate our verified status sequence.`;
    } else {
      reply += `That is a vital study abroad question. To succeed with your university application and subsequent visa processing, we recommend checking these parameters:\n` +
               `1. **Pre-requisite Qualifications**: Verify if your degree GPA or grades meet the host institution standards.\n` +
               `2. **English Language Certificate**: IELTS, PTE, or TOEFL report validity.\n` +
               `3. **Proof of Financial Sponsorship**: Bank statements or scholarship letters.\n\nWhich country are you targeting? Select **Target Countries** for direct specifications.`;
    }

    res.json({ text: reply });
  }, 1000);
});

// -----------------------------------------------------
// Vite Dev Server / Production Static Serving
// -----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted successfully on port ' + PORT);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static handler mounted serving: ' + distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LMS Full-Stack Server listening successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
