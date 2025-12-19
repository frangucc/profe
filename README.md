# ProFe - Soccer Mentorship Platform

A mobile-first web application for soccer player development, featuring course management, video analysis, and personalized training plans.

## Features

### For Players
- **Dashboard** - Track progress, view stats, and manage your soccer journey
- **Profile Management** - Set your position, skill level, and learning goals
- **Course Library** - Browse position-specific courses from beginner to advanced
- **Video Analysis** - Upload match/training footage and receive coach feedback with timestamps
- **Training Plans** - Follow personalized weekly training programs
- **Progress Tracking** - Monitor your improvement with streaks, achievements, and completed courses

### For Coaches
- **Video Review** - Analyze player videos and provide timestamped feedback
- **Course Creation** - Build position-specific curriculum and lessons
- **Training Plans** - Create personalized weekly training programs

### For Admins
- **User Management** - Add, edit, and manage players, coaches, and admins
- **Platform Overview** - View statistics and monitor platform activity

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with mobile-first approach
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **LocalStorage** - Client-side data persistence

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone git@github.com:frangucc/profe.git
cd profe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:4000`

## Demo Accounts

**Player Account:**
- Email: player@profe.com
- Password: player123

**Coach Account:**
- Email: coach@profe.com
- Password: coach123

**Admin Account:**
- Email: admin@profe.com
- Password: admin123

## Project Structure

```
profe/
├── src/
│   ├── components/
│   │   ├── Admin/          # Admin panel components
│   │   ├── Auth/           # Login & registration
│   │   ├── Courses/        # Course list & detail views
│   │   ├── Player/         # Player dashboard & profile
│   │   ├── Shared/         # Navigation & shared components
│   │   ├── Training/       # Training plan management
│   │   └── Videos/         # Video upload, list & analysis
│   ├── data/
│   │   └── mockData.js     # Demo data
│   ├── App.jsx             # Main app with routing & context
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Features in Detail

### Dark/Light Mode
Toggle between dark and light themes with persistent preference storage.

### Learning Management System (LMS)
- Course enrollment and progress tracking
- Lesson completion tracking
- Interactive exercises and drills
- Position-specific content

### Video Analysis System
- Upload match and training footage
- Coach feedback with timestamps
- Positive highlights and improvement suggestions
- Player notes and acknowledgments

### Training Plans
- Weekly training schedules
- Session tracking and completion
- Focus areas and exercises
- Coach notes and guidance

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Future Enhancements

- Backend API integration
- Real video playback
- Live coach-player chat
- Mobile native apps
- Social features and player community
- Performance analytics and statistics
- Integration with wearable devices

## License

MIT

## Author

Built with [Claude Code](https://claude.com/claude-code)
