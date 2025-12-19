import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Sparkles, Target, Trophy } from 'lucide-react';

function OnboardingSurvey() {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await api.getSurveyQuestions();
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load survey questions:', error);
      setLoading(false);
    }
  };

  const handleChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleMultiSelect = (questionId, option) => {
    const current = responses[questionId] || [];
    if (current.includes(option)) {
      setResponses({
        ...responses,
        [questionId]: current.filter(item => item !== option)
      });
    } else {
      setResponses({
        ...responses,
        [questionId]: [...current, option]
      });
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.submitSurvey(responses);
      navigate('/');
    } catch (error) {
      console.error('Failed to submit survey:', error);
      alert('Failed to submit survey. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const isAnswered = responses[currentQuestion?.id] !== undefined && responses[currentQuestion?.id] !== '';
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to ProFe!</h1>
          <p className="text-primary-100 text-lg">Let's get to know you better</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white font-medium">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm text-white font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-primary-300 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          {currentQuestion?.id === 'goals_ambitions' && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg mb-6 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <Trophy className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Dream Big! 🌟
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    This is your moment to share your true ambitions. Your coaches and mentors want to understand what drives you and help you achieve your goals!
                  </p>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6">{currentQuestion?.question}</h2>

          {/* Answer Input */}
          <div className="space-y-3">
            {currentQuestion?.type === 'number' && (
              <input
                type="number"
                className="input text-lg"
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer"
                autoFocus
              />
            )}

            {currentQuestion?.type === 'select' && (
              <select
                className="input text-lg"
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                autoFocus
              >
                <option value="">Select an option...</option>
                {currentQuestion.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {currentQuestion?.type === 'multiselect' && (
              <div className="space-y-2">
                {currentQuestion.options
                  .filter(option => option !== responses.primary_position)
                  .map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(responses[currentQuestion.id] || []).includes(option)}
                        onChange={() => handleMultiSelect(currentQuestion.id, option)}
                        className="rounded"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
              </div>
            )}

            {currentQuestion?.type === 'textarea' && (
              <div>
                <textarea
                  className="input text-lg min-h-48"
                  value={responses[currentQuestion.id] || ''}
                  onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  rows={currentQuestion.rows || 4}
                  autoFocus
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {responses[currentQuestion.id]?.length || 0} characters
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!isAnswered || submitting}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                {isLastQuestion ? 'Complete' : 'Next'}
                {isLastQuestion && <Target size={20} />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingSurvey;
