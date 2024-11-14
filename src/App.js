import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSeoulBikeData } from './redux/DataSetSlice';
import ScatterPlotContainer from './components/ScatterplotContainer';

function App() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.dataSet.data);

  useEffect(() => {
    dispatch(getSeoulBikeData());
  }, [dispatch]);

  useEffect(() => {
    console.log("Data loaded:", data);
  }, [data]);

  return (
    <div className="App">
      <div id="view-container" className="row">
        <ScatterPlotContainer data={data} xAttribute="Temperature" yAttribute="Humidity" />
      </div>
    </div>
  );
}

export default App;