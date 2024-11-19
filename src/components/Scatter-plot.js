import * as d3 from 'd3';

const COLOR_HOLIDAY = "purple";
const COLOR_NO_HOLIDAT = "green";
const OPACITY = 0.2;

class ScatterplotD3 {
  constructor(element, onBrush, onDotClick) {
    this.element = element;
    this.onBrush = onBrush;
    this.onDotClick = onDotClick;
  }

  create({ size }) {

    const margin = { top: 20, right: 40, bottom: 40, left: 80 };
    const width = size.width - margin.left - margin.right;
    const height = size.height - margin.top - margin.bottom;

    this.width = width;
    this.height = height;

    this.svg = d3.select(this.element)
      .append('svg')
      .attr('width', size.width)
      .attr('height', size.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.brush = d3.brush()
      .extent([[0, 0], [width, height]])
      .on('start brush end', this.brushed.bind(this));

    this.svg.append('g')
      .attr('class', 'brush')
      .call(this.brush);

    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`);

    this.svg.append('g')
      .attr('class', 'y-axis');

    this.svg.append('text')
      .attr('class', 'x-axis-label')
      .attr('text-anchor', 'end')
      .attr('x', width)
      .attr('y', height + margin.bottom - 5)
      .text('X Axis Label');

    this.svg.append('text')
      .attr('class', 'y-axis-label')
      .attr('text-anchor', 'end')
      .attr('x', -margin.left + 5)
      .attr('y', -40)
      .attr('transform', 'rotate(-90)')
      .text('Y Axis Label');
  }

  renderScatterplot(data, xAttribute, yAttribute, controllerMethods) {

    this.xAttribute = xAttribute;
    this.yAttribute = yAttribute;

    const filteredData = data.filter(d => d && d[xAttribute] != null && d[yAttribute] != null);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[xAttribute]))
      .range([0, this.width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[yAttribute]))
      .range([this.height, 0]);

    const circles = this.svg.selectAll('circle')
      .data(filteredData, d => d.index);

    circles
      .transition()
      .duration(750)
      .attr('cx', d => xScale(d[xAttribute]))
      .attr('cy', d => yScale(d[yAttribute]))
      .attr('r', 3.5)
      .attr('fill-opacity', OPACITY)

    circles.enter()
      .append('circle')
      .attr('cx', d => xScale(d[xAttribute]))
      .attr('cy', d => yScale(d[yAttribute]))
      .attr('r', 0) 
      .attr('fill-opacity', OPACITY)
      .on('click', (event, d) => {
        this.onDotClick(d, event);
      })
      .transition()
      .duration(750)
      .attr('r', 3.5); 

    circles.exit()
      .transition()
      .duration(750)
      .attr('r', 0)
      .remove();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    this.svg.select('.x-axis').call(xAxis);
    this.svg.select('.y-axis').call(yAxis);

    this.xScale = xScale; 
    this.yScale = yScale;
    this.controllerMethods = controllerMethods;

    this.svg.select('.x-axis-label').text(xAttribute);
    this.svg.select('.y-axis-label').text(yAttribute);
  }

  brushed(event) {
    const selection = event.selection;
    if (!selection) {
      this.svg.selectAll('circle').attr('stroke', null);
      d3.select(this.legendElement).selectAll('*').remove(); 
      this.onBrush([]); 
    } else {
      const [[x0, y0], [x1, y1]] = selection;
      const selectedData = [];
      this.svg.selectAll('circle')
        .attr('stroke', d => {
          if (x0 <= this.xScale(d[this.xAttribute]) && this.xScale(d[this.xAttribute]) <= x1 &&
              y0 <= this.yScale(d[this.yAttribute]) && this.yScale(d[this.yAttribute]) <= y1) {
            selectedData.push(d);
            return "red";
          } else {
            return null;
          }
        });

      d3.select(this.legendElement).selectAll('*').remove(); // Rimuovi la legenda esistente
      d3.select(this.legendElement).append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', COLOR_HOLIDAY);
      d3.select(this.legendElement).append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .text('Holiday');

      d3.select(this.legendElement).append('rect')
        .attr('x', 0)
        .attr('y', 24)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', COLOR_NO_HOLIDAT);
      d3.select(this.legendElement).append('text')
        .attr('x', 24)
        .attr('y', 33)
        .attr('dy', '0.35em')
        .text('No Holiday');

      this.onBrush(selectedData); 
    }
  }

  clearBrush() {
    this.svg.select('.brush').call(this.brush.move, null);
    this.svg.selectAll('circle').attr('stroke', null);
    d3.select(this.legendElement).selectAll('*').remove(); 
  }

  clear() {
    this.svg.remove();
  }
}

export default ScatterplotD3;