import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { BookOpen, Clock, Award, Filter } from 'lucide-react';

function CourseList() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [positions, setPositions] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [filterPosition, setFilterPosition] = useState('');
  const [filterAgeGroup, setFilterAgeGroup] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const levels = ['Bronze', 'Silver', 'Gold', 'Elite'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [filterPosition, filterAgeGroup, filterLevel]);

  const loadData = async () => {
    try {
      const [coursesData, positionsData, ageGroupsData] = await Promise.all([
        api.getCourses({}),
        api.getPositions(),
        api.getAgeGroups()
      ]);

      setCourses(coursesData.courses);
      setPositions(positionsData.positions);
      setAgeGroups(ageGroupsData.ageGroups);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const filters = {};
      if (filterPosition) filters.position = filterPosition;
      if (filterAgeGroup) filters.age_group = filterAgeGroup;
      if (filterLevel) filters.level = filterLevel;

      const data = await api.getCourses(filters);
      setCourses(data.courses);
    } catch (error) {
      console.error('Failed to load courses:', error);
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

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="input"
            >
              <option value="">All Positions</option>
              {positions.map(position => (
                <option key={position.id} value={position.id}>{position.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age Group</label>
            <select
              value={filterAgeGroup}
              onChange={(e) => setFilterAgeGroup(e.target.value)}
              className="input"
            >
              <option value="">All Ages</option>
              {ageGroups.map(ag => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.age_min}-{ag.age_max})
                </option>
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
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {(filterPosition || filterAgeGroup || filterLevel) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterPosition('');
                  setFilterAgeGroup('');
                  setFilterLevel('');
                }}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`} className="card hover:shadow-lg transition-shadow">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  course.level === 'Elite' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                  course.level === 'Gold' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                  course.level === 'Silver' ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                  'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                }`}>
                  {course.level}
                </span>
                {course.enrolled && (
                  <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                    Enrolled
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{course.title}</h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span>{course.modules} modules</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{course.duration_weeks} weeks</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{course.position_name}</span>
                {course.age_group_name && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {course.age_group_name}
                  </span>
                )}
              </div>

              {course.enrolled && course.progress > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-bold mb-2">No courses found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters or check back later for new content
          </p>
          {(filterPosition || filterAgeGroup || filterLevel) && (
            <button
              onClick={() => {
                setFilterPosition('');
                setFilterAgeGroup('');
                setFilterLevel('');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseList;
