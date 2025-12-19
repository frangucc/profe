import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { videos } from '../../data/mockData';
import { ArrowLeft, Clock, MessageSquare, CheckCircle, ThumbsUp, Lightbulb, Save, Edit2 } from 'lucide-react';

function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const video = videos.find(v => v.id === parseInt(id));
  const [acknowledged, setAcknowledged] = useState(video?.acknowledged || false);
  const [playerNotes, setPlayerNotes] = useState(video?.playerNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!video) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
          <Link to="/videos" className="btn-primary">
            Back to Videos
          </Link>
        </div>
      </div>
    );
  }

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <button
        onClick={() => navigate('/videos')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Videos
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="relative mb-4">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary-600 border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-3">{video.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Uploaded {video.uploadDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{video.duration}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                video.status === 'analyzed'
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
              }`}>
                {video.status === 'analyzed' ? 'Analyzed' : 'Pending Review'}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">My Notes</h2>
                {!isEditingNotes && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div>
                  <textarea
                    value={playerNotes}
                    onChange={(e) => setPlayerNotes(e.target.value)}
                    className="input min-h-24 mb-2"
                    placeholder="Add your notes about this video..."
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveNotes} className="btn-primary text-sm flex items-center gap-1">
                      <Save size={14} />
                      Save Notes
                    </button>
                    <button
                      onClick={() => {
                        setPlayerNotes(video.playerNotes || '');
                        setIsEditingNotes(false);
                      }}
                      className="btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {playerNotes || 'No notes added yet'}
                </p>
              )}
            </div>
          </div>

          {video.coachComments && video.coachComments.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare size={24} />
                  Coach Feedback ({video.coachComments.length})
                </h2>

                {!acknowledged && (
                  <button
                    onClick={handleAcknowledge}
                    className="btn-primary text-sm flex items-center gap-1"
                  >
                    <CheckCircle size={14} />
                    Mark as Reviewed
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {video.coachComments.map(comment => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      comment.type === 'positive'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {comment.type === 'positive' ? (
                        <ThumbsUp className="text-green-600 mt-1" size={18} />
                      ) : (
                        <Lightbulb className="text-blue-600 mt-1" size={18} />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{comment.coach}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            @ {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {video.status === 'pending' && (
            <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <Clock className="text-yellow-600 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Pending Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your video is in the queue for coach review. You'll receive a notification when feedback is available.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h3 className="font-bold mb-4">Video Stats</h3>

            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <p className="font-semibold">
                  {video.status === 'analyzed' ? 'Analysis Complete' : 'Pending Review'}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Upload Date</span>
                <p className="font-semibold">{video.uploadDate}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                <p className="font-semibold">{video.duration}</p>
              </div>

              {video.coachComments && (
                <>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Coach Comments</span>
                    <p className="font-semibold">{video.coachComments.length}</p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Feedback Status</span>
                    <p className="font-semibold">
                      {acknowledged ? 'Reviewed' : 'New Feedback Available'}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              <h4 className="font-semibold mb-3">Actions</h4>
              <div className="space-y-2">
                <button className="btn-secondary w-full text-sm">
                  Download Video
                </button>
                <button className="btn-secondary w-full text-sm">
                  Share with Coach
                </button>
                <button className="btn-secondary w-full text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Delete Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoDetail;
