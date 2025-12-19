import React, { useState } from 'react';
import { useAuth } from '../../App';
import { positions, skillLevels } from '../../data/mockData';
import { User, MapPin, TrendingUp, Calendar, Edit2, Save, X } from 'lucide-react';

function PlayerProfile() {
  const { currentUser, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentUser });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSecondaryPositionsChange = (position) => {
    const current = formData.secondaryPositions || [];
    if (current.includes(position)) {
      setFormData({
        ...formData,
        secondaryPositions: current.filter(p => p !== position)
      });
    } else {
      setFormData({
        ...formData,
        secondaryPositions: [...current, position]
      });
    }
  };

  const handleSave = () => {
    login(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...currentUser });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {currentUser?.firstName} {currentUser?.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentUser?.type === 'player' ? 'Player' : currentUser?.type === 'coach' ? 'Coach' : 'Admin'}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center gap-2">
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save size={16} />
                Save
              </button>
              <button onClick={handleCancel} className="btn-secondary flex items-center gap-2">
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {currentUser?.type === 'player' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <User size={16} className="inline mr-2" />
                Personal Information
              </label>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">First Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input mt-1"
                    />
                  ) : (
                    <p className="font-medium">{currentUser?.firstName}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input mt-1"
                    />
                  ) : (
                    <p className="font-medium">{currentUser?.lastName}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Age</span>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="input mt-1"
                      min="8"
                      max="99"
                    />
                  ) : (
                    <p className="font-medium">{currentUser?.age} years old</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={14} className="inline mr-1" />
                    Member Since
                  </span>
                  <p className="font-medium">{new Date(currentUser?.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <TrendingUp size={16} className="inline mr-2" />
                Playing Information
              </label>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Skill Level</span>
                  {isEditing ? (
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="input mt-1"
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium">{currentUser?.level}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="inline mr-1" />
                    Primary Position
                  </span>
                  {isEditing ? (
                    <select
                      name="primaryPosition"
                      value={formData.primaryPosition}
                      onChange={handleChange}
                      className="input mt-1"
                    >
                      {positions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium">{currentUser?.primaryPosition}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    Learning Positions
                  </span>
                  {isEditing ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {positions.filter(p => p !== formData.primaryPosition).map(position => (
                        <label key={position} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(formData.secondaryPositions || []).includes(position)}
                            onChange={() => handleSecondaryPositionsChange(position)}
                            className="rounded"
                          />
                          <span className="text-sm">{position}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {currentUser?.secondaryPositions && currentUser.secondaryPositions.length > 0 ? (
                        currentUser.secondaryPositions.map(position => (
                          <span key={position} className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-3 py-1 rounded-full">
                            {position}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No additional positions selected</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentUser?.type === 'coach' && (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Specialization</span>
              <p className="font-medium">{currentUser?.specialization}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Years of Experience</span>
              <p className="font-medium">{currentUser?.yearsExperience} years</p>
            </div>
          </div>
        )}
      </div>

      {currentUser?.type === 'player' && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-1">2</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Courses</p>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Videos Uploaded</p>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">8</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerProfile;
