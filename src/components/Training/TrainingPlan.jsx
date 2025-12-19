import React, { useState } from 'react';
import { trainingPlans } from '../../data/mockData';
import { Target, CheckCircle, Circle, Calendar, TrendingUp } from 'lucide-react';

function TrainingPlan() {
  const [plans] = useState(trainingPlans);
  const activePlan = plans.find(p => p.status === 'active');

  const toggleSessionComplete = (sessionIdx) => {
    console.log('Toggle session', sessionIdx);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Training Plans</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized training programs designed by your coaches
        </p>
      </div>

      {activePlan ? (
        <>
          <div className="card mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Target className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{activePlan.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <Calendar size={14} />
                    <span>Week starting {activePlan.weekStarting}</span>
                  </div>
                </div>
              </div>

              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                Focus Areas This Week
              </h3>
              <div className="flex flex-wrap gap-2">
                {activePlan.focus.map((focus, idx) => (
                  <span
                    key={idx}
                    className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Weekly Progress</h3>
                <span className="text-sm font-medium">
                  {activePlan.sessions.filter(s => s.completed).length} / {activePlan.sessions.length} sessions
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${(activePlan.sessions.filter(s => s.completed).length / activePlan.sessions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {activePlan.sessions.map((session, idx) => (
              <div key={idx} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{session.day}</h3>
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {session.type}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSessionComplete(idx)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {session.completed ? (
                      <CheckCircle className="text-green-600" size={28} />
                    ) : (
                      <Circle className="text-gray-400" size={28} />
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Exercises:
                    </h4>
                    <ul className="space-y-2">
                      {session.exercises.map((exercise, exIdx) => (
                        <li
                          key={exIdx}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                        >
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{exercise}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {!session.completed && (
                  <button
                    onClick={() => toggleSessionComplete(idx)}
                    className="btn-primary w-full mt-4"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="font-bold mb-4">Coach Notes</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                Great progress this week! Focus on maintaining consistency with your scanning technique.
                In the next training session, we'll work on applying this under pressure situations.
                Remember to track your meals and recovery - it's just as important as the training itself.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <Target className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold mb-2">No Active Training Plan</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your coach will create a personalized training plan based on your progress and goals.
          </p>
          <button className="btn-primary">
            Request Training Plan
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-1">12</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</p>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">18.5</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hours Trained</p>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">8</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Week Streak</p>
        </div>
      </div>
    </div>
  );
}

export default TrainingPlan;
