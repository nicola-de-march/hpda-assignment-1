import React, { Component } from 'react';
import ScatterplotD3 from './Scatter-plot';
import AlternativeScatterplotD3 from './AlternativeScatterplotD3';
import Menu from './Menu';
import ClassSelection from './ClassSelection';
import Tooltip from './Tooltip';
import { connect } from 'react-redux';
import { updateSelectedItems } from '../redux/DataSetSlice';

const WIDTH = 700;
const HEIGHT = 600;

class ScatterPlotContainer extends Component {
  constructor(props) {
    super(props);
    this.scatterplot1 = null;
    this.scatterplot2 = null;
    this.scatterplotRef1 = React.createRef();
    this.scatterplotRef2 = React.createRef();
    this.legendRef = React.createRef();
    this.state = {
      selectedData: [],
      selectedClass: 'Seasons', // Variabile per la colorazione o la forma dei punti
      tooltipData: null,
      tooltipPosition: { x: 0, y: 0 },
      xAttribute: 'Temperature', // Attributo iniziale per l'asse X
      yAttribute: 'Humidity' // Attributo iniziale per l'asse Y
    };
  }

  componentDidMount() {
    console.log("ScatterPlotContainer mounted");
    this.scatterplot1 = new ScatterplotD3(this.scatterplotRef1.current, this.handleBrush, this.handleDotClick);
    this.scatterplot1.create({ size: { width: WIDTH, height: HEIGHT } });
    this.scatterplot1.renderScatterplot(this.props.data, this.state.xAttribute, this.state.yAttribute, {
      handleOnClick: this.handleDotClick,
      handleBrush: this.handleBrush
    });

    this.scatterplot2 = new AlternativeScatterplotD3(this.scatterplotRef2.current, this.handleDotClick);
    this.scatterplot2.create({ size: { width: WIDTH, height: HEIGHT } });
    this.scatterplot2.renderScatterplot(this.state.selectedData, this.state.xAttribute, this.state.yAttribute, {
      handleOnClick: this.handleDotClick,
      handleBrush: this.handleBrush,
      selectedClass: this.state.selectedClass
    });

    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data || prevState.xAttribute !== this.state.xAttribute || prevState.yAttribute !== this.state.yAttribute) {
      console.log("ScatterPlotContainer updated");
      console.log("xAttribute:", this.state.xAttribute);
      console.log("yAttribute:", this.state.yAttribute);
      this.scatterplot1.clearBrush(); // Resetta la selezione e rimuovi la finestra di brush
      this.scatterplot1.renderScatterplot(this.props.data, this.state.xAttribute, this.state.yAttribute, {
        handleOnClick: this.handleDotClick,
        handleBrush: this.handleBrush
      });
      this.scatterplot2.renderScatterplot(this.state.selectedData, this.state.xAttribute, this.state.yAttribute, {
        handleOnClick: this.handleDotClick,
        handleBrush: this.handleBrush,
        selectedClass: this.state.selectedClass
      });
    }

    if (prevState.selectedData !== this.state.selectedData || prevState.selectedClass !== this.state.selectedClass) {
      console.log("Selected data or class updated:", this.state.selectedData, this.state.selectedClass);
      this.scatterplot2.renderScatterplot(this.state.selectedData, this.state.xAttribute, this.state.yAttribute, {
        handleOnClick: this.handleDotClick,
        handleBrush: this.handleBrush,
        selectedClass: this.state.selectedClass
      });
    }
  }

  componentWillUnmount() {
    this.scatterplot1.clear();
    this.scatterplot2.clear();
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleDotClick = (itemData, event) => {
    this.setState({
      tooltipData: itemData,
      tooltipPosition: { x: event.pageX, y: event.pageY }
    });
  }

  handleOnClick = (itemData) => {
    if (this.props.onDotClick) {
      this.props.onDotClick(itemData);
    }
  }

  handleBrush = (selectedItems) => {
    console.log("Brush selected items:", selectedItems);
    this.setState({ selectedData: selectedItems });
    this.props.updateSelectedItems(selectedItems);
  }

  handleClassChange = (selectedClass) => {
    this.setState({ selectedClass });
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.setState({ tooltipData: null });
    }
  }

  handlePlot = (xAttribute, yAttribute) => {
    this.setState({ xAttribute, yAttribute });
  }

  render() {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100vh', position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Menu onPlot={this.handlePlot} />
          <div ref={this.scatterplotRef1} style={{ width: '100%', height: '100%' }}></div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ClassSelection selectedClass={this.state.selectedClass} onClassChange={this.handleClassChange} />
          <div ref={this.scatterplotRef2} style={{ width: '100%', height: '100%' }}></div>
        </div>
        <Tooltip data={this.state.tooltipData} position={this.state.tooltipPosition} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateSelectedItems
};

export default connect(null, mapDispatchToProps)(ScatterPlotContainer);