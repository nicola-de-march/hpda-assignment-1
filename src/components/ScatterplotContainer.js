import React, { Component } from 'react';
import ScatterplotD3 from './Scatter-plot';
import { connect } from 'react-redux';
import { updateSelectedItems } from '../redux/DataSetSlice';
const WIDTH = 1000
const HEIGHT = 600
class ScatterPlotContainer extends Component {
  constructor(props) {
    super(props);
    this.scatterplot = null;
    this.scatterplotRef = React.createRef();
  }

  componentDidMount() {
    console.log("ScatterPlotContainer mounted");
    this.scatterplot = new ScatterplotD3(this.scatterplotRef.current);
    this.scatterplot.create({ size: { width: WIDTH, height: HEIGHT } });
    this.scatterplot.renderScatterplot(this.props.data, this.props.xAttribute, this.props.yAttribute, {
      handleOnClick: this.handleOnClick,
      handleBrush: this.handleBrush
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.xAttribute !== this.props.xAttribute || prevProps.yAttribute !== this.props.yAttribute) {
      console.log("ScatterPlotContainer updated");
      console.log("xAttribute:", this.props.xAttribute);
      console.log("yAttribute:", this.props.yAttribute);
      this.scatterplot.renderScatterplot(this.props.data, this.props.xAttribute, this.props.yAttribute, {
        handleOnClick: this.handleOnClick,
        handleBrush: this.handleBrush
      });
    }
  }

  handleOnClick = (itemData) => {
    if (this.props.onDotClick) {
      this.props.onDotClick(itemData);
    }
  }

  handleBrush = (selectedItems) => {
    this.props.updateSelectedItems(selectedItems);
  }

  componentWillUnmount() {
    this.scatterplot.clear();
  }

  render() {
    return <div ref={this.scatterplotRef} style={{ width: toString(WIDTH) +'px', height: toString(HEIGHT)+'px' }}></div>;
  }
}

const mapDispatchToProps = {
  updateSelectedItems
};

export default connect(null, mapDispatchToProps)(ScatterPlotContainer);