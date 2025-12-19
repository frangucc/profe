import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courses } from '../../data/mockData';
import { ArrowLeft, BookOpen, Clock, Award, CheckCircle, Circle, Play, FileText, Dumbbell } from 'lucide-react';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === parseInt(id));
  const [enrolled, setEnrolled] = useState(course?.enrolled || false);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <Link to="/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    setEnrolled(true);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play size={18} />;
      case 'interactive':
        return <FileText size={18} />;
      case 'drill':
        return <Dumbbell size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Courses
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div className="card mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm px-3 py-1 rounded">
                {course.position}
              </span>
              <span className={`text-sm px-3 py-1 rounded ${
                course.level === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                course.level === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}>
                {course.level}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Clock size={20} />
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {course.duration.split(' ')[0]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weeks</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <BookOpen size={20} />
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {course.modules}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Modules</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Award size={20} />
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {enrolled ? course.progress : 0}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Instructor:</span> {course.instructor}
              </p>
            </div>
          </div>

          {course.lessons && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>

              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      enrolled
                        ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                        : 'opacity-60'
                    } ${lesson.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}
                  >
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle className="text-green-600" size={24} />
                      ) : (
                        <Circle className="text-gray-400" size={24} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-500 dark:text-gray-400">
                          {getLessonIcon(lesson.type)}
                        </span>
                        <h3 className="font-semibold">
                          {index + 1}. {lesson.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>{lesson.duration}</span>
                        <span className="capitalize">{lesson.type}</span>
                      </div>
                    </div>

                    {enrolled && !lesson.completed && (
                      <button className="btn-primary text-sm">Start</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            {enrolled ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <button className="btn-primary w-full mb-3">
                  Continue Learning
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="font-semibold mb-3">Course Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Lessons Completed</span>
                      <span className="font-semibold">
                        {course.lessons?.filter(l => l.completed).length || 0} / {course.lessons?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time Invested</span>
                      <span className="font-semibold">2.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Activity</span>
                      <span className="font-semibold">2 days ago</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Ready to Start?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Enroll in this course to begin your journey and unlock all lessons.
                </p>

                <button onClick={handleEnroll} className="btn-primary w-full mb-4">
                  Enroll Now
                </button>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>{course.modules} comprehensive modules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Video lessons & drills</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Interactive exercises</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Progress tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
