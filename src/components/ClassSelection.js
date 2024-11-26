import React from 'react';
import './Menu.css';

const ClassSelection = ({ selectedClass, onClassChange }) => {
  return (
    <div id="controls">
      <label>
        Select Class:
        <select value={selectedClass} onChange={e => onClassChange(e.target.value)}>
          <option value="Seasons">Seasons</option>
          <option value="FunctioningDay">FunctioningDay</option>
          <option value="Holiday">Holiday</option>
        </select>
      </label>
    </div>
  );
};

export default ClassSelection;