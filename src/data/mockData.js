export const positions = [
  'Goalkeeper',
  'Center Back',
  'Full Back',
  'Wing Back',
  'Defensive Midfielder',
  'Central Midfielder',
  'Attacking Midfielder',
  'Winger',
  'Striker'
];

export const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

export const users = {
  player: {
    id: 1,
    type: 'player',
    email: 'player@profe.com',
    password: 'player123',
    firstName: 'Marcus',
    lastName: 'Silva',
    age: 16,
    level: 'Intermediate',
    primaryPosition: 'Central Midfielder',
    secondaryPositions: ['Attacking Midfielder', 'Defensive Midfielder'],
    joinedDate: '2024-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
  },
  coach: {
    id: 2,
    type: 'coach',
    email: 'coach@profe.com',
    password: 'coach123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialization: 'Midfield Play',
    yearsExperience: 12,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  admin: {
    id: 3,
    type: 'admin',
    email: 'admin@profe.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User'
  }
};

export const courses = [
  {
    id: 1,
    title: 'Midfield Fundamentals',
    position: 'Central Midfielder',
    level: 'Beginner',
    description: 'Master the basics of central midfield play including positioning, passing, and vision.',
    duration: '4 weeks',
    modules: 12,
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    progress: 65,
    enrolled: true,
    instructor: 'Sarah Johnson',
    lessons: [
      { id: 1, title: 'Introduction to Central Midfield', duration: '15 min', completed: true, type: 'video' },
      { id: 2, title: 'Positioning Between Lines', duration: '20 min', completed: true, type: 'video' },
      { id: 3, title: 'First Touch & Ball Control', duration: '25 min', completed: true, type: 'interactive' },
      { id: 4, title: 'Scanning the Field', duration: '18 min', completed: false, type: 'video' },
      { id: 5, title: 'Short Passing Patterns', duration: '22 min', completed: false, type: 'drill' }
    ]
  },
  {
    id: 2,
    title: 'Advanced Pressing Techniques',
    position: 'Central Midfielder',
    level: 'Advanced',
    description: 'Learn how to press effectively as a midfielder and win the ball back in dangerous areas.',
    duration: '3 weeks',
    modules: 10,
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    progress: 0,
    enrolled: false,
    instructor: 'Carlos Rodriguez'
  },
  {
    id: 3,
    title: 'Attacking Midfielder Playmaking',
    position: 'Attacking Midfielder',
    level: 'Intermediate',
    description: 'Develop your creativity and decision-making in the final third.',
    duration: '5 weeks',
    modules: 15,
    thumbnail: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400',
    progress: 30,
    enrolled: true,
    instructor: 'Maria Santos',
    lessons: [
      { id: 1, title: 'Finding Space in the Hole', duration: '20 min', completed: true, type: 'video' },
      { id: 2, title: 'Through Ball Timing', duration: '25 min', completed: false, type: 'drill' }
    ]
  },
  {
    id: 4,
    title: 'Defensive Awareness for Midfielders',
    position: 'Defensive Midfielder',
    level: 'Beginner',
    description: 'Understand your defensive responsibilities and how to shield the backline.',
    duration: '4 weeks',
    modules: 11,
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    progress: 0,
    enrolled: false,
    instructor: 'James Miller'
  }
];

export const videos = [
  {
    id: 1,
    title: 'Match vs. City Academy - First Half',
    uploadDate: '2024-12-10',
    status: 'analyzed',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    duration: '45:00',
    coachComments: [
      {
        id: 1,
        coach: 'Sarah Johnson',
        timestamp: '12:34',
        comment: 'Great vision here! You spotted the runner early and played the pass at the perfect moment.',
        type: 'positive'
      },
      {
        id: 2,
        coach: 'Sarah Johnson',
        timestamp: '28:15',
        comment: 'Work on checking your shoulder before receiving. You were caught unaware of the pressing player.',
        type: 'improvement'
      }
    ],
    playerNotes: 'Felt good about my positioning today. Need to work on turning under pressure.',
    acknowledged: true
  },
  {
    id: 2,
    title: 'Training Session - Passing Drills',
    uploadDate: '2024-12-15',
    status: 'pending',
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    duration: '12:30',
    playerNotes: 'Working on my weak foot passing',
    acknowledged: false
  },
  {
    id: 3,
    title: 'Match Highlights - League Game',
    uploadDate: '2024-12-08',
    status: 'analyzed',
    thumbnail: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400',
    duration: '8:45',
    coachComments: [
      {
        id: 3,
        coach: 'Carlos Rodriguez',
        timestamp: '03:22',
        comment: 'Excellent recovery run! This shows great fitness and tactical awareness.',
        type: 'positive'
      }
    ],
    acknowledged: false
  }
];

export const trainingPlans = [
  {
    id: 1,
    title: 'Weekly Development Plan - Week 12',
    weekStarting: '2024-12-16',
    status: 'active',
    focus: ['First touch improvement', 'Scanning technique', 'Weak foot passing'],
    sessions: [
      {
        day: 'Monday',
        type: 'Technical',
        exercises: ['Ball mastery - 20 min', 'Passing with weak foot - 25 min'],
        completed: true
      },
      {
        day: 'Wednesday',
        type: 'Tactical',
        exercises: ['Positioning drills - 30 min', 'Small-sided games - 20 min'],
        completed: true
      },
      {
        day: 'Friday',
        type: 'Match Prep',
        exercises: ['Set piece practice - 15 min', 'Full field scrimmage - 45 min'],
        completed: false
      }
    ]
  }
];

export const achievements = [
  { id: 1, title: 'First Course Completed', date: '2024-11-20', icon: 'award' },
  { id: 2, title: '10 Videos Uploaded', date: '2024-12-01', icon: 'video' },
  { id: 3, title: '30-Day Streak', date: '2024-12-15', icon: 'flame' }
];

export const stats = {
  coursesEnrolled: 2,
  coursesCompleted: 0,
  videosUploaded: 3,
  totalWatchTime: '4.5 hours',
  currentStreak: 8,
  skillsImproved: 12
};
