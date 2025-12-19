import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { videos } from '../../data/mockData';
import { Video, Upload, Clock, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

function VideoList() {
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredVideos = videos.filter(video => {
    if (filterStatus === 'All') return true;
    return video.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Videos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload and review your match footage with coach feedback
          </p>
        </div>

        <Link to="/videos/upload" className="btn-primary flex items-center gap-2 mt-4 md:mt-0">
          <Upload size={20} />
          Upload New Video
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <label className="font-medium">Filter by Status:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('All')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'All'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('analyzed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'analyzed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Analyzed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {filteredVideos.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Link key={video.id} to={`/videos/${video.id}`}>
              <div className="card h-full hover:shadow-lg transition-shadow">
                <div className="relative mb-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    {video.status === 'analyzed' ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle size={12} />
                        Analyzed
                      </span>
                    ) : (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <AlertCircle size={12} />
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                <h3 className="font-bold mb-2">{video.title}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{video.uploadDate}</span>
                  </div>
                  {video.coachComments && (
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      <span>{video.coachComments.length} comments</span>
                    </div>
                  )}
                </div>

                {video.playerNotes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {video.playerNotes}
                  </p>
                )}

                {!video.acknowledged && video.status === 'analyzed' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-2 rounded">
                    New feedback available
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Video className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold mb-2">No videos found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filterStatus === 'All'
              ? "Upload your first video to get started"
              : `No ${filterStatus} videos`}
          </p>
          <Link to="/videos/upload" className="btn-primary">
            Upload Video
          </Link>
        </div>
      )}
    </div>
  );
}

export default VideoList;
