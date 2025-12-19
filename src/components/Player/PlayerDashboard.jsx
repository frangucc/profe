import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../App';
import api from '../../utils/api';
import { BookOpen, Video, Target, TrendingUp, Award, Flame, Clock, CheckCircle } from 'lucide-react';

function PlayerDashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    videosUploaded: 0,
    currentStreak: 0,
    skillsImproved: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load enrolled courses
      const coursesData = await api.getCourses({});
      const enrolled = coursesData.courses.filter(c => c.enrolled);
      setEnrolledCourses(enrolled);

      // Load earned badges
      const badgesData = await api.getEarnedBadges();
      setBadges(badgesData.badges.slice(0, 3)); // Get last 3 badges

      // Update stats from data
      setStats({
        coursesEnrolled: enrolled.length,
        videosUploaded: 0, // TODO: Implement when videos are dynamic
        currentStreak: currentUser?.current_streak_days || 0,
        skillsImproved: currentUser?.total_badges_earned || 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser?.first_name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and continue your soccer journey
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="text-primary-600" size={24} />
            <span className="text-2xl font-bold">{stats.coursesEnrolled}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Courses</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Video className="text-blue-600" size={24} />
            <span className="text-2xl font-bold">{stats.videosUploaded}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Flame className="text-orange-500" size={24} />
            <span className="text-2xl font-bold">{stats.currentStreak}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-green-600" size={24} />
            <span className="text-2xl font-bold">{stats.skillsImproved}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Skills Improved</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Current Courses</h2>
            <Link to="/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="space-y-4">
              {enrolledCourses.map(course => (
                <Link key={course.id} to={`/courses/${course.id}`} className="block">
                  <div className="flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate">{course.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {course.position}
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {course.progress}% complete
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No courses enrolled yet
              </p>
              <Link to="/courses" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Videos</h2>
            <Link to="/videos" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentVideos.map(video => (
              <Link key={video.id} to={`/videos/${video.id}`} className="block">
                <div className="flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate">{video.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Clock size={14} />
                      <span>{video.duration}</span>
                    </div>
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      video.status === 'analyzed'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {video.status === 'analyzed' ? 'Analyzed' : 'Pending Review'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <Link to="/videos/upload" className="btn-secondary w-full">
              Upload New Video
            </Link>
          </div>
        </div>
      </div>

      {activeTraining && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold">This Week's Training Plan</h2>
            </div>
            <Link to="/training" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View Details
            </Link>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">{activeTraining.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Week starting {activeTraining.weekStarting}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeTraining.focus.map((focus, idx) => (
                <span key={idx} className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-3 py-1 rounded-full">
                  {focus}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {activeTraining.sessions.map((session, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{session.day}</span>
                  {session.completed && <CheckCircle className="text-green-600" size={18} />}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{session.type}</p>
                <ul className="text-xs space-y-1">
                  {session.exercises.map((exercise, idx) => (
                    <li key={idx} className="text-gray-500 dark:text-gray-400">{exercise}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-yellow-600" size={24} />
          <h2 className="text-xl font-bold">Recent Achievements</h2>
        </div>

        {badges.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {badges.map(badge => {
              const tierColors = {
                Bronze: 'from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30',
                Silver: 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600',
                Gold: 'from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30',
                Elite: 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30'
              };

              return (
                <div key={badge.id} className={`bg-gradient-to-br ${tierColors[badge.tier] || tierColors.Bronze} p-4 rounded-lg`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Award className="text-yellow-900" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                        {badge.tier}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="mx-auto mb-3 text-gray-400" size={48} />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No achievements yet
            </p>
            <p className="text-sm text-gray-500">
              Complete courses and challenges to earn badges!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerDashboard;
