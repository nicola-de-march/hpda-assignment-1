import React, { Component } from 'react';
import ScatterplotD3 from './Scatter-plot';
import AlternativeScatterplotD3 from './AlternativeScatterplotD3';
import Menu from './Menu';
import ClassSelection from './ClassSelection';
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
      selectedClass: 'Seasons' // Variabile per la colorazione o la forma dei punti
    };
  }

  componentDidMount() {
    console.log("ScatterPlotContainer mounted");
    this.scatterplot1 = new ScatterplotD3(this.scatterplotRef1.current, this.handleBrush);
    this.scatterplot1.create({ size: { width: WIDTH, height: HEIGHT } });
    this.scatterplot1.renderScatterplot(this.props.data, this.props.xAttribute, this.props.yAttribute, {
      handleOnClick: this.handleOnClick,
      handleBrush: this.handleBrush
    });

    this.scatterplot2 = new AlternativeScatterplotD3(this.scatterplotRef2.current);
    this.scatterplot2.create({ size: { width: WIDTH, height: HEIGHT } });
    this.scatterplot2.renderScatterplot(this.state.selectedData, this.props.xAttribute, this.props.yAttribute, {
      handleOnClick: this.handleOnClick,
      handleBrush: this.handleBrush,
      selectedClass: this.state.selectedClass
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data || prevProps.xAttribute !== this.props.xAttribute || prevProps.yAttribute !== this.props.yAttribute) {
      console.log("ScatterPlotContainer updated");
      console.log("xAttribute:", this.props.xAttribute);
      console.log("yAttribute:", this.props.yAttribute);
      this.scatterplot1.renderScatterplot(this.props.data, this.props.xAttribute, this.props.yAttribute, {
        handleOnClick: this.handleOnClick,
        handleBrush: this.handleBrush
      });
      this.scatterplot2.renderScatterplot(this.state.selectedData, this.props.xAttribute, this.props.yAttribute, {
        handleOnClick: this.handleOnClick,
        handleBrush: this.handleBrush,
        selectedClass: this.state.selectedClass
      });
    }

    if (prevState.selectedData !== this.state.selectedData || prevState.selectedClass !== this.state.selectedClass) {
      console.log("Selected data or class updated:", this.state.selectedData, this.state.selectedClass);
      this.scatterplot2.renderScatterplot(this.state.selectedData, this.props.xAttribute, this.props.yAttribute, {
        handleOnClick: this.handleOnClick,
        handleBrush: this.handleBrush,
        selectedClass: this.state.selectedClass
      });
    }
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

  componentWillUnmount() {
    this.scatterplot1.clear();
    this.scatterplot2.clear();
  }

  render() {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Menu onPlot={(x, y) => {
            this.props.updateSelectedItems([]);
            this.scatterplot1.renderScatterplot(this.props.data, x, y, {
              handleOnClick: this.handleOnClick,
              handleBrush: this.handleBrush
            });
            this.scatterplot2.renderScatterplot(this.state.selectedData, x, y, {
              handleOnClick: this.handleOnClick,
              handleBrush: this.handleBrush,
              selectedClass: this.state.selectedClass
            });
          }} />
          <div ref={this.scatterplotRef1} style={{ width: '100%', height: '100%' }}></div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ClassSelection selectedClass={this.state.selectedClass} onClassChange={this.handleClassChange} />
          <div ref={this.scatterplotRef2} style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateSelectedItems
};

export default connect(null, mapDispatchToProps)(ScatterPlotContainer);