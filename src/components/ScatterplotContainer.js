import React, { Component } from 'react';
import ScatterplotD3 from './Scatter-plot';
import AlternativeScatterplotD3 from './AlternativeScatterplotD3';
import { connect } from 'react-redux';
import { updateSelectedItems } from '../redux/DataSetSlice';

const WIDTH = 500;
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
      selectedData: []
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
      handleBrush: this.handleBrush
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
    }

    if (prevState.selectedData !== this.state.selectedData) {
      console.log("Selected data updated:", this.state.selectedData);
      this.scatterplot2.renderScatterplot(this.state.selectedData, this.props.xAttribute, this.props.yAttribute, {
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
    console.log("Brush selected items:", selectedItems);
    this.setState({ selectedData: selectedItems });
    this.props.updateSelectedItems(selectedItems);
  }

  componentWillUnmount() {
    this.scatterplot1.clear();
    this.scatterplot2.clear();
  }

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <div ref={this.scatterplotRef1} style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }}></div>
        <div ref={this.scatterplotRef2} style={{ width: `${WIDTH}px`, height: `${HEIGHT}px`, marginLeft: '20px' }}></div>
        <div ref={this.legendRef} style={{ marginLeft: '20px' }}></div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateSelectedItems
};

export default connect(null, mapDispatchToProps)(ScatterPlotContainer);