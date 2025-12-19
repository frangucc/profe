import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Video, CheckCircle } from 'lucide-react';

function VideoUpload() {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    matchType: 'match',
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadState('uploading');

    setTimeout(() => {
      setUploadState('success');
      setTimeout(() => {
        navigate('/videos');
      }, 2000);
    }, 2000);
  };

  if (uploadState === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="card text-center py-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white" size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your video has been uploaded and is being processed for coach review.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to your videos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <button
        onClick={() => navigate('/videos')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Videos
      </button>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <Upload className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Upload Video</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your match or training footage for coach analysis
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Video File</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
                required
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <Video className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  MP4, MOV, or AVI (max 500MB)
                </p>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Match vs. City Academy - First Half"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                name="matchType"
                value={formData.matchType}
                onChange={handleChange}
                className="input"
              >
                <option value="match">Match</option>
                <option value="training">Training Session</option>
                <option value="drill">Individual Drill</option>
                <option value="highlights">Highlights</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input min-h-32"
              placeholder="Add any context for your coach... What were you working on? Any specific moments you'd like feedback on?"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Tips for Better Feedback:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Include full game footage when possible for context</li>
              <li>• Mention specific skills or situations you want feedback on</li>
              <li>• Note your position and role during the match</li>
              <li>• Add timestamps for key moments in your notes</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploadState === 'uploading'}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {uploadState === 'uploading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Video
                </>
              )}
            </button>
            <Link to="/videos" className="btn-secondary flex-1 text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;
