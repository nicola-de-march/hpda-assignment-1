import React, { Component } from 'react';
import ScatterplotD3 from './Scatter-plot';
import { connect } from 'react-redux';
import { updateSelectedItems } from '../redux/DataSetSlice';

class ScatterPlotContainer extends Component {
  constructor(props) {
    super(props);
    this.scatterplot = null;
    this.scatterplotRef = React.createRef();
  }

  componentDidMount() {
    console.log("ScatterPlotContainer mounted");
    this.scatterplot = new ScatterplotD3(this.scatterplotRef.current);
    this.scatterplot.create({ size: { width: 800, height: 600 } });
    this.scatterplot.renderScatterplot(this.props.data, this.props.xAttribute, this.props.yAttribute, {
      handleOnClick: this.handleOnClick,
      handleBrush: this.handleBrush
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.xAttribute !== this.props.xAttribute || prevProps.yAttribute !== this.props.yAttribute) {
      console.log("ScatterPlotContainer updated");
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
    return <div ref={this.scatterplotRef} style={{ width: '800px', height: '600px' }}></div>;
  }
}

const mapDispatchToProps = {
  updateSelectedItems
};

export default connect(null, mapDispatchToProps)(ScatterPlotContainer);