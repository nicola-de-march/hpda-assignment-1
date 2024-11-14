import React, { useState } from 'react';
import './Menu.css';

const Menu = ({ onPlot }) => {
  const [xAttribute, setXAttribute] = useState('Temperature');
  const [yAttribute, setYAttribute] = useState('Humidity');

  const handlePlotClick = () => {
    onPlot(xAttribute, yAttribute);
  };

  return (
    <div id="controls">
      <label>
        X Axis 
        <select value={xAttribute} onChange={e => setXAttribute(e.target.value)}>
          <option value="Temperature">Temperature</option>
          <option value="Humidity">Humidity</option>
          <option value="WindSpeed">WindSpeed</option>
          <option value="Visibility">Visibility</option>
          <option value="DewPointTemperature">DewPointTemperature</option>
        </select>
      </label>
      <label>
        Y Axis 
        <select value={yAttribute} onChange={e => setYAttribute(e.target.value)}>
          <option value="Temperature">Temperature</option>
          <option value="Humidity">Humidity</option>
          <option value="WindSpeed">WindSpeed</option>
          <option value="Visibility">Visibility</option>
          <option value="DewPointTemperature">DewPointTemperature</option>
        </select>
      </label>
      <button onClick={handlePlotClick}>Plot</button>
    </div>
  );
};

export default Menu;