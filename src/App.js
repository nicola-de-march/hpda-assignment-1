import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSeoulBikeData } from './redux/DataSetSlice';
import ScatterPlotContainer from './components/ScatterplotContainer';
import Menu from './components/Menu';

function App() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.dataSet.data);

  const [xAttribute, setXAttribute] = useState('Temperature');
  const [yAttribute, setYAttribute] = useState('Humidity');

  useEffect(() => {
    dispatch(getSeoulBikeData());
  }, [dispatch]);

  useEffect(() => {
    console.log("Data loaded:", data);
  }, [data]);

  const handlePlot = (xAttr, yAttr) => {
    setXAttribute(xAttr);
    setYAttribute(yAttr);
  };

  return (
    <div className="App">
      <Menu onPlot={handlePlot} />
      <div id="view-container" className="row">
        <ScatterPlotContainer data={data} xAttribute={xAttribute} yAttribute={yAttribute} />
      </div>
    </div>
  );
}

export default App;