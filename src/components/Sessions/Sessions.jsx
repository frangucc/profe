import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, ZoomIn, ZoomOut, RotateCw, Square, ChevronUp, ChevronDown, Grid3x3 } from 'lucide-react';
import SessionsHeader from './SessionsHeader';
import { FullPitch, AttackHalf, DefenseHalf, TrainingGrid } from './PitchLayouts';
import ShapesPanel from './ShapesPanel';

function Sessions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [shapes, setShapes] = useState([]);
  const [draggedShape, setDraggedShape] = useState(null);
  const [gridSize] = useState(20); // 20px grid for snapping
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

    // Save shapes to URL (encode as JSON)
    if (shapes.length > 0) {
      params.set('shapes', JSON.stringify(shapes));
    }

    setSearchParams(params, { replace: true });
  }, [pitchType, rotation, zoom, shapes, setSearchParams]);

  // Load shapes from URL on mount
  useEffect(() => {
    const shapesParam = searchParams.get('shapes');
    if (shapesParam) {
      try {
        const loadedShapes = JSON.parse(shapesParam);
        setShapes(loadedShapes);
      } catch (e) {
        console.error('Failed to load shapes from URL:', e);
      }
    }
  }, []); // Only run once on mount

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const rotatePitch = () => setRotation(prev => (prev + 90) % 360);

  const snapToGrid = (value) => {
    return Math.round(value / gridSize) * gridSize;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData('shapeType');

    if (shapeType) {
      // Dropping a NEW shape from the panel
      const shapeColor = e.dataTransfer.getData('shapeColor');
      const shapeFill = e.dataTransfer.getData('shapeFill') === 'true';

      // Get the pitch container bounds
      const pitchContainer = e.currentTarget;
      const rect = pitchContainer.getBoundingClientRect();

      // Calculate position relative to pitch (accounting for zoom)
      let x = ((e.clientX - rect.left) / zoom) - (rect.width / (2 * zoom));
      let y = ((e.clientY - rect.top) / zoom) - (rect.height / (2 * zoom));

      // Snap to grid
      x = snapToGrid(x);
      y = snapToGrid(y);

      // Add new shape
      setShapes(prev => [...prev, {
        id: Date.now(),
        type: shapeType,
        color: shapeColor,
        fill: shapeFill,
        rotation: 0, // Default to pointing up (cones)
        x,
        y
      }]);
    } else if (draggedShape) {
      // Moving an EXISTING shape on the pitch
      const pitchContainer = e.currentTarget;
      const rect = pitchContainer.getBoundingClientRect();

      let x = ((e.clientX - rect.left) / zoom) - (rect.width / (2 * zoom));
      let y = ((e.clientY - rect.top) / zoom) - (rect.height / (2 * zoom));

      // Snap to grid
      x = snapToGrid(x);
      y = snapToGrid(y);

      // Update shape position
      setShapes(prev => prev.map(shape =>
        shape.id === draggedShape ? { ...shape, x, y } : shape
      ));
      setDraggedShape(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleShapeDragStart = (e, shapeId) => {
    setDraggedShape(shapeId);
  };

  const handleShapeClick = (shapeId) => {
    // Future: Could add selection/editing functionality here
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to UI
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    // Add to conversation history for Claude
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];
    setConversationHistory(newHistory);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_URL}/api/sessions/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newHistory })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude');
      }

      const data = await response.json();
      console.log('Response from server:', data);

      // Handle tool execution response
      if (data.type === 'tool_execution') {
        // Execute each tool call
        for (const toolCall of data.toolCalls) {
          console.log('Executing tool from response:', toolCall.name, toolCall.input);

          // Execute tool directly (result already computed on backend)
          const toolResult = data.toolResults.find(r => r.tool_use_id === toolCall.id);
          if (toolResult) {
            const result = JSON.parse(toolResult.content);

            // Apply the results to our state
            if (result.shapes === 'CLEAR') {
              setShapes([]);
            } else if (result.shapes && result.shapes.length > 0) {
              setShapes(prev => [...prev, ...result.shapes]);
            }

            if (result.pitchType) {
              setPitchType(result.pitchType);
            }
          }
        }

        // Add assistant message if there is one
        if (data.assistantMessage) {
          setMessages(prev => [...prev, { text: data.assistantMessage, sender: 'assistant' }]);
          setConversationHistory(prev => [
            ...prev,
            { role: 'assistant', content: data.assistantMessage }
          ]);
        }
      } else if (data.type === 'text_only') {
        // Just a text response, no tools
        setMessages(prev => [...prev, { text: data.content, sender: 'assistant' }]);
        setConversationHistory(prev => [
          ...prev,
          { role: 'assistant', content: data.content }
        ]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant'
      }]);
      setIsLoading(false);
    }
  };

  const executeToolCall = async (toolName, toolInput) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_URL}/api/sessions/execute-tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolName, toolInput })
      });

      if (!response.ok) {
        throw new Error('Failed to execute tool');
      }

      const result = await response.json();

      // Apply the results to our state
      if (result.shapes === 'CLEAR') {
        setShapes([]);
      } else if (result.shapes && result.shapes.length > 0) {
        setShapes(prev => [...prev, ...result.shapes]);
      }

      if (result.pitchType) {
        setPitchType(result.pitchType);
      }
    } catch (error) {
      console.error('Tool execution error:', error);
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
          {shapes.length > 0 && (
            <button
              onClick={() => setShapes([])}
              className={`mt-2 w-full text-xs px-2 py-1 rounded transition ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } ${textSecondaryColor}`}
            >
              Clear Field ({shapes.length} items)
            </button>
          )}
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
          {isLoading && (
            <div className={`p-3 rounded-lg mr-4 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${chatBorderColor}`}>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Try: 'Set up a 4-3-3 formation' or 'Create a passing drill for U12 players'..."
              className={`flex-1 ${inputBgColor} ${textColor} rounded-lg p-3 resize-none focus:outline-none focus:ring-2 ${inputFocusRing}`}
              rows="3"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`rounded-lg px-4 flex items-center justify-center transition ${
                isLoading || !input.trim()
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Shapes Panel - Between chat and field */}
      <ShapesPanel isDarkMode={isDarkMode} />

      {/* Soccer Field - flex-1 to take remaining space */}
      <div className={`flex-1 ${bgColor} relative`}>
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
        <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-auto">
          <div
            className="relative"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
              width: pitchType === 'training' ? '900px' : '600px',
              height: pitchType === 'full' ? '900px' : pitchType === 'training' ? '600px' : '500px'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Render appropriate pitch type */}
            {pitchType === 'full' && <FullPitch fieldBgColor={fieldBgColor} fieldLineColor={fieldLineColor} />}
            {pitchType === 'attack' && <AttackHalf fieldBgColor={fieldBgColor} fieldLineColor={fieldLineColor} />}
            {pitchType === 'defense' && <DefenseHalf fieldBgColor={fieldBgColor} fieldLineColor={fieldLineColor} />}
            {pitchType === 'training' && <TrainingGrid fieldBgColor={fieldBgColor} fieldLineColor={fieldLineColor} />}

            {/* Render shapes */}
            {shapes.map(shape => (
              <div
                key={shape.id}
                draggable
                onDragStart={(e) => handleShapeDragStart(e, shape.id)}
                onClick={() => handleShapeClick(shape.id)}
                className="absolute cursor-move hover:opacity-80 transition"
                style={{
                  left: `calc(50% + ${shape.x}px)`,
                  top: `calc(50% + ${shape.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                title="Drag to move"
              >
                {shape.type === 'circle' && (
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{
                      backgroundColor: shape.fill ? shape.color : 'transparent',
                      border: `2px solid ${shape.color}`
                    }}
                  ></div>
                )}
                {shape.type === 'triangle' && (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    style={{ transform: `rotate(${shape.rotation || 0}deg)` }}
                  >
                    <polygon
                      points="16,6 26,26 6,26"
                      fill={shape.fill ? shape.color : 'none'}
                      stroke={shape.color}
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
          {/* Label - always horizontal and outside the rotation */}
          <div className={`mt-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {pitchType === 'full' && 'Full Field'}
            {pitchType === 'attack' && 'Attack'}
            {pitchType === 'defense' && 'Defense'}
            {pitchType === 'training' && 'Training Field'}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Sessions;
