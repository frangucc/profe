import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { courses, positions, skillLevels } from '../../data/mockData';
import { BookOpen, Clock, Award, Filter } from 'lucide-react';

function CourseList() {
  const [filterPosition, setFilterPosition] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterEnrolled, setFilterEnrolled] = useState('All');

  const filteredCourses = courses.filter(course => {
    if (filterPosition !== 'All' && course.position !== filterPosition) return false;
    if (filterLevel !== 'All' && course.level !== filterLevel) return false;
    if (filterEnrolled === 'Enrolled' && !course.enrolled) return false;
    if (filterEnrolled === 'Available' && course.enrolled) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Library</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse position-specific courses to improve your game
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="font-semibold">Filters</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="input"
            >
              <option value="All">All Positions</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="input"
            >
              <option value="All">All Levels</option>
              {skillLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filterEnrolled}
              onChange={(e) => setFilterEnrolled(e.target.value)}
              className="input"
            >
              <option value="All">All Courses</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Available">Available</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <div className="card h-full hover:shadow-lg transition-shadow">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-2 py-1 rounded">
                      {course.position}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      course.level === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}>
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>{course.modules} modules</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Instructor: {course.instructor}
                  </p>

                  {course.enrolled && (
                    <>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {course.progress}% complete
                      </p>
                    </>
                  )}
                </div>

                <button className={course.enrolled ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  {course.enrolled ? 'Continue Learning' : 'Enroll Now'}
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters to see more courses
          </p>
          <button
            onClick={() => {
              setFilterPosition('All');
              setFilterLevel('All');
              setFilterEnrolled('All');
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseList;
