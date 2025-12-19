import React, { useState } from 'react';
import { useAuth } from '../../App';
import { positions, skillLevels } from '../../data/mockData';
import { User, MapPin, TrendingUp, Calendar, Edit2, Save, X } from 'lucide-react';
import api from '../../utils/api';

function PlayerProfile() {
  const { currentUser, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentUser });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSecondaryPositionsChange = (position) => {
    const current = formData.secondary_positions || [];
    if (current.includes(position)) {
      setFormData({
        ...formData,
        secondary_positions: current.filter(p => p !== position)
      });
    } else {
      setFormData({
        ...formData,
        secondary_positions: [...current, position]
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updatedProfile = await api.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: parseInt(formData.age),
        primary_position: formData.primary_position,
        skill_level: formData.skill_level,
        secondary_positions: formData.secondary_positions || []
      });

      // Fetch fresh user data
      const { user } = await api.getCurrentUser();
      login(user);
      setFormData(user);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...currentUser });
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="card mb-6">
        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {currentUser?.first_name} {currentUser?.last_name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentUser?.user_type === 'player' ? 'Player' : currentUser?.user_type === 'coach' ? 'Coach' : 'Admin'}
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
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCancel} disabled={saving} className="btn-secondary flex items-center gap-2 disabled:opacity-50">
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {currentUser?.user_type === 'player' && (
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
                      name="first_name"
                      value={formData.first_name || ''}
                      onChange={handleChange}
                      className="input mt-1"
                    />
                  ) : (
                    <p className="font-medium">{currentUser?.first_name}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Name</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name || ''}
                      onChange={handleChange}
                      className="input mt-1"
                    />
                  ) : (
                    <p className="font-medium">{currentUser?.last_name}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Age</span>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ''}
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
                  <p className="font-medium">{currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}</p>
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
                      name="skill_level"
                      value={formData.skill_level || 'Beginner'}
                      onChange={handleChange}
                      className="input mt-1"
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium">{currentUser?.skill_level}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="inline mr-1" />
                    Primary Position
                  </span>
                  {isEditing ? (
                    <select
                      name="primary_position"
                      value={formData.primary_position || 'Central Midfielder'}
                      onChange={handleChange}
                      className="input mt-1"
                    >
                      {positions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium">{currentUser?.primary_position}</p>
                  )}
                </div>

                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    Learning Positions
                  </span>
                  {isEditing ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {positions.filter(p => p !== formData.primary_position).map(position => (
                        <label key={position} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(formData.secondary_positions || []).includes(position)}
                            onChange={() => handleSecondaryPositionsChange(position)}
                            className="rounded"
                          />
                          <span className="text-sm">{position}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {currentUser?.secondary_positions && currentUser.secondary_positions.length > 0 ? (
                        currentUser.secondary_positions.map(position => (
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
