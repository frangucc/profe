import React, { useState } from 'react';
import { users, positions, skillLevels } from '../../data/mockData';
import { Shield, UserPlus, Edit2, Trash2, Search, Users, Award, Video } from 'lucide-react';

function AdminPanel() {
  const [allUsers, setAllUsers] = useState(Object.values(users));
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    type: 'player',
    age: '',
    level: 'Beginner',
    primaryPosition: 'Central Midfielder'
  });

  const filteredUsers = allUsers.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e) => {
    e.preventDefault();
    const user = {
      id: Date.now(),
      ...newUser,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.firstName}`
    };
    setAllUsers([...allUsers, user]);
    setShowAddUser(false);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      type: 'player',
      age: '',
      level: 'Beginner',
      primaryPosition: 'Central Midfielder'
    });
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setAllUsers(allUsers.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <Shield className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users, courses, and platform settings
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-primary-600" size={24} />
            <span className="text-2xl font-bold">{allUsers.filter(u => u.type === 'player').length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Players</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-blue-600" size={24} />
            <span className="text-2xl font-bold">{allUsers.filter(u => u.type === 'coach').length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Coaches</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Award className="text-green-600" size={24} />
            <span className="text-2xl font-bold">4</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Courses</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Video className="text-orange-600" size={24} />
            <span className="text-2xl font-bold">3</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Videos Uploaded</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add New User
          </button>
        </div>

        {showAddUser && (
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">User Type</label>
                  <select
                    value={newUser.type}
                    onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                    className="input"
                  >
                    <option value="player">Player</option>
                    <option value="coach">Coach</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {newUser.type === 'player' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Age</label>
                    <input
                      type="number"
                      value={newUser.age}
                      onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                      className="input"
                      min="8"
                      max="99"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Skill Level</label>
                    <select
                      value={newUser.level}
                      onChange={(e) => setNewUser({ ...newUser, level: e.target.value })}
                      className="input"
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Position</label>
                    <select
                      value={newUser.primaryPosition}
                      onChange={(e) => setNewUser({ ...newUser, primaryPosition: e.target.value })}
                      className="input"
                    >
                      {positions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Details</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Joined</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar && (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.type === 'player'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : user.type === 'coach'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {user.type === 'player' && (
                      <div>
                        <div>{user.primaryPosition}</div>
                        <div className="text-xs">{user.level}</div>
                      </div>
                    )}
                    {user.type === 'coach' && (
                      <div className="text-xs">{user.specialization}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {user.joinedDate && new Date(user.joinedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
