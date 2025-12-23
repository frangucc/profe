import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, ZoomIn, ZoomOut, RotateCw, Square, ChevronUp, ChevronDown, Grid3x3 } from 'lucide-react';
import SessionsHeader from './SessionsHeader';
import { FullPitch, AttackHalf, DefenseHalf, TrainingGrid } from './PitchLayouts';

function Sessions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize state from URL params
  const [zoom, setZoom] = useState(() => {
    const urlZoom = searchParams.get('zoom');
    return urlZoom ? parseFloat(urlZoom) : 1;
  });

  const [pitchType, setPitchType] = useState(() => {
    const urlPitch = searchParams.get('pitch');
    return ['full', 'attack', 'defense', 'training'].includes(urlPitch) ? urlPitch : 'full';
  });

  const [rotation, setRotation] = useState(() => {
    const urlRotation = searchParams.get('rotation');
    return urlRotation ? parseInt(urlRotation) : 0;
  });

  // Update URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('pitch', pitchType);
    params.set('rotation', rotation.toString());
    params.set('zoom', zoom.toFixed(1));
    setSearchParams(params, { replace: true });
  }, [pitchType, rotation, zoom, setSearchParams]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const rotatePitch = () => setRotation(prev => (prev + 90) % 360);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Theme colors
  const fieldBgColor = isDarkMode ? '#2d5016' : '#ffffff';
  const fieldLineColor = isDarkMode ? 'white' : '#000000';
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const chatBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const chatBorderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondaryColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  const inputFocusRing = isDarkMode ? 'focus:ring-green-500' : 'focus:ring-green-600';

  return (
    <div className={`flex flex-col h-screen ${bgColor}`}>
      <SessionsHeader isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-1 overflow-hidden">
      {/* Chat Panel - 20% width */}
      <div className={`w-1/5 ${chatBgColor} flex flex-col`}>
        {/* Chat Header */}
        <div className={`p-4 border-b ${chatBorderColor}`}>
          <h2 className={`text-xl font-bold ${textColor}`}>Session Builder</h2>
          <p className={`text-sm ${textSecondaryColor}`}>Design your playbook</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-green-600 text-white ml-4'
                  : `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} mr-4`
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${chatBorderColor}`}>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your session..."
              className={`flex-1 ${inputBgColor} ${textColor} rounded-lg p-3 resize-none focus:outline-none focus:ring-2 ${inputFocusRing}`}
              rows="3"
            />
            <button
              onClick={handleSend}
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 flex items-center justify-center transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Soccer Field - 80% width */}
      <div className={`w-4/5 ${bgColor} relative`}>
        {/* Zoom Controls - Upper Right */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={zoomIn}
            className={`p-3 rounded-lg transition ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
            }`}
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={zoomOut}
            className={`p-3 rounded-lg transition ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
            }`}
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </button>
          <div className={`text-center text-xs font-medium px-2 py-1 rounded ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-lg'
          }`}>
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={rotatePitch}
            className={`p-3 rounded-lg transition ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
            }`}
            aria-label="Rotate pitch"
          >
            <RotateCw size={20} />
          </button>
        </div>

        {/* Pitch Type Controls - Lower Right */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setPitchType('full')}
            className={`p-3 rounded-lg transition ${
              pitchType === 'full'
                ? 'bg-green-600 text-white'
                : isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
            }`}
            aria-label="Full field"
            title="Full Field"
          >
            <Square size={20} />
          </button>
          <button
            onClick={() => setPitchType('attack')}
            className={`p-3 rounded-lg transition ${
              pitchType === 'attack'
                ? 'bg-green-600 text-white'
                : isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
            }`}
            aria-label="Attack half"
            title="Attack Half"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={() => setPitchType('defense')}
            className={`p-3 rounded-lg transition ${
              pitchType === 'defense'
                ? 'bg-green-600 text-white'
                : isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
            }`}
            aria-label="Defense half"
            title="Defense Half"
          >
            <ChevronDown size={20} />
          </button>
          <button
            onClick={() => setPitchType('training')}
            className={`p-3 rounded-lg transition ${
              pitchType === 'training'
                ? 'bg-green-600 text-white'
                : isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900 shadow-lg'
            }`}
            aria-label="Training grid"
            title="Training Grid"
          >
            <Grid3x3 size={20} />
          </button>
        </div>

        {/* Field Container */}
        <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
          <div
            className="relative"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
              width: pitchType === 'training' ? '900px' : '600px',
              height: pitchType === 'full' ? '920px' : pitchType === 'training' ? '620px' : '520px'
            }}
          >
            {/* Render appropriate pitch type */}
            {pitchType === 'full' && <FullPitch fieldBgColor={fieldBgColor} fieldLineColor={fieldLineColor} />}
            {pitchType === 'attack' && <AttackHalf fieldBgColor={fieldBgColor} fieldLineColor={fieldLineColor} />}
            {pitchType === 'defense' && <DefenseHalf fieldBgColor={fieldBgColor} fieldLineColor={fieldLineColor} />}
            {pitchType === 'training' && <TrainingGrid fieldBgColor={fieldBgColor} fieldLineColor={fieldLineColor} />}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Sessions;
