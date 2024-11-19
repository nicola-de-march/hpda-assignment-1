import React from 'react';
import './Tooltip.css';

const Tooltip = ({ data, position }) => {
  if (!data) return null;

  return (
    <div className="tooltip" style={{ left: position.x, top: position.y }}>
      {Object.keys(data).map(key => (
        <div key={key}>
          <strong>{key}:</strong> {data[key]}
        </div>
      ))}
    </div>
  );
};

export default Tooltip;