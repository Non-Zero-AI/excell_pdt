// Mock course data for development
export const mockCourses = [
  {
    id: '1',
    title: 'Professional Driving Excellence and Adverse Weather Operations',
    category: 'commercial',
    description: 'Comprehensive training for commercial drivers covering advanced driving techniques and adverse weather operations.',
    price: 299.99,
    duration: 1200, // minutes
    instructor: 'John Smith',
    level: 'intermediate',
    thumbnail: '/placeholder-course.jpg',
    chapters: [
      { 
        id: '1-1', 
        title: 'Module 1: Introduction', 
        duration: 45,
        content: 'This module introduces the fundamentals of professional driving...',
      },
      { 
        id: '1-2', 
        title: 'Module 2: Basic Techniques', 
        duration: 60,
        content: 'Learn the basic techniques for safe commercial driving...',
        quiz: {
          id: 'quiz-1-2',
          title: 'Knowledge Check: Basic Techniques',
          description: 'Test your understanding of the basic techniques covered in this module.',
          passingScore: 70,
          questions: [
            {
              id: 'q1',
              question: 'What is the recommended following distance for commercial vehicles?',
              answers: [
                { id: 'a1', text: '2 seconds' },
                { id: 'a2', text: '4 seconds' },
                { id: 'a3', text: '6 seconds', correct: true },
                { id: 'a4', text: '8 seconds' },
              ],
              correctAnswer: 'a3',
              explanation: 'Commercial vehicles require a minimum of 6 seconds following distance due to their increased weight and stopping distance.',
            },
            {
              id: 'q2',
              question: 'When should you check your mirrors while driving?',
              answers: [
                { id: 'a1', text: 'Every 5-8 seconds', correct: true },
                { id: 'a2', text: 'Every 30 seconds' },
                { id: 'a3', text: 'Only when changing lanes' },
                { id: 'a4', text: 'Once per minute' },
              ],
              correctAnswer: 'a1',
              explanation: 'Professional drivers should check mirrors every 5-8 seconds to maintain situational awareness.',
            },
          ],
        },
      },
      { 
        id: '1-3', 
        title: 'Module 3: Advanced Maneuvers', 
        duration: 75,
        content: 'Master advanced driving maneuvers for challenging situations...',
      },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Load Securement for Open Deck Loads',
    category: 'commercial',
    description: 'Learn proper techniques for securing loads on open deck vehicles to ensure safety and compliance.',
    price: 249.99,
    duration: 900,
    instructor: 'Jane Doe',
    level: 'beginner',
    thumbnail: '/placeholder-course.jpg',
    chapters: [
      { id: '2-1', title: 'Module 1: Fundamentals', duration: 50 },
      { id: '2-2', title: 'Module 2: Equipment', duration: 55 },
      { id: '2-3', title: 'Module 3: Best Practices', duration: 60 },
    ],
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Oversized Load Operations',
    category: 'commercial',
    description: 'Master the skills needed to safely transport oversized and overweight loads.',
    price: 349.99,
    duration: 1500,
    instructor: 'Mike Johnson',
    level: 'advanced',
    thumbnail: '/placeholder-course.jpg',
    chapters: [
      { id: '3-1', title: 'Module 1: Regulations', duration: 90 },
      { id: '3-2', title: 'Module 2: Planning', duration: 100 },
      { id: '3-3', title: 'Module 3: Execution', duration: 110 },
    ],
    createdAt: '2024-02-01',
  },
]

