import React, { useState } from 'react';
import { Circle, Triangle, X } from 'lucide-react';

function ShapesPanel({ isDarkMode }) {
  const [shapeStyles, setShapeStyles] = useState({
    circle: { color: '#22c55e', fill: false },
    triangle: { color: '#22c55e', fill: false }
  });
  const [colorPicker, setColorPicker] = useState(null); // { type: 'circle' | 'triangle' }

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondaryColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  const colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#eab308', '#8b5cf6', '#ec4899', '#000000', '#ffffff'];

  const handleDragStart = (e, shapeType) => {
    const style = shapeStyles[shapeType];
    e.dataTransfer.setData('shapeType', shapeType);
    e.dataTransfer.setData('shapeColor', style.color);
    e.dataTransfer.setData('shapeFill', style.fill);
  };

  const handleDoubleClick = (shapeType) => {
    setColorPicker(shapeType);
  };

  const handleColorSelect = (color) => {
    if (colorPicker) {
      setShapeStyles(prev => ({
        ...prev,
        [colorPicker]: { ...prev[colorPicker], color }
      }));
    }
  };

  const handleStyleToggle = () => {
    if (colorPicker) {
      setShapeStyles(prev => ({
        ...prev,
        [colorPicker]: { ...prev[colorPicker], fill: !prev[colorPicker].fill }
      }));
    }
  };

  return (
    <>
      <div className={`w-20 ${bgColor} flex flex-col border-l ${borderColor}`}>
        {/* Header */}
        <div className={`p-3 border-b ${borderColor}`}>
          <h3 className={`text-xs font-semibold ${textColor} text-center`}>Shapes</h3>
        </div>

        {/* Shapes */}
        <div className="flex flex-col items-center gap-4 p-4">
          {/* Circle */}
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, 'circle')}
            onDoubleClick={() => handleDoubleClick('circle')}
            className="cursor-move hover:opacity-70 transition"
            title="Circle (double-click to customize)"
          >
          <div
            className="w-12 h-12 rounded-full"
            style={{
              backgroundColor: shapeStyles.circle.fill ? shapeStyles.circle.color : 'transparent',
              border: `2px solid ${shapeStyles.circle.color}`
            }}
          ></div>
        </div>

        {/* Triangle */}
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, 'triangle')}
          onDoubleClick={() => handleDoubleClick('triangle')}
          className="cursor-move hover:opacity-70 transition"
          title="Triangle (double-click to customize)"
        >
          <svg width="48" height="48" viewBox="0 0 48 48">
            <polygon
              points="24,8 40,40 8,40"
              fill={shapeStyles.triangle.fill ? shapeStyles.triangle.color : 'none'}
              stroke={shapeStyles.triangle.color}
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>

    {/* Color Picker Modal - Outside container for proper z-index */}
    {colorPicker && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        style={{ zIndex: 9999 }}
        onClick={() => setColorPicker(null)}
      >
        <div
          className={`${bgColor} ${borderColor} border rounded-lg p-4 w-80 shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-3">
              <h4 className={`text-sm font-semibold ${textColor}`}>
                Customize {colorPicker === 'circle' ? 'Circle' : 'Triangle'}
              </h4>
              <button onClick={() => setColorPicker(null)} className={textSecondaryColor}>
                <X size={16} />
              </button>
            </div>

            {/* Style Toggle */}
            <div className="mb-3">
              <label className={`text-xs ${textSecondaryColor} block mb-2`}>Style</label>
              <button
                onClick={handleStyleToggle}
                className={`w-full px-3 py-2 rounded text-xs transition ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                } ${textColor}`}
              >
                {shapeStyles[colorPicker].fill ? 'Solid Fill' : 'Outline Only'}
              </button>
            </div>

            {/* Color Palette */}
            <div>
              <label className={`text-xs ${textSecondaryColor} block mb-2`}>Color</label>
              <div className="grid grid-cols-3 gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded border-2 transition ${
                      shapeStyles[colorPicker].color === color
                        ? 'border-green-500 scale-110'
                        : 'border-gray-400 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShapesPanel;
