import * as d3 from 'd3';

class ScatterplotD3 {
  constructor(element) {
    this.element = element;
  }

  create({ size }) {
    console.log("Creating scatterplot with size:", size);

    // Definisci i margini
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
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
      .on('brush end', this.brushed.bind(this));

    this.svg.append('g')
      .attr('class', 'brush')
      .call(this.brush);

    // Aggiungi gruppi per gli assi
    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`);

    this.svg.append('g')
      .attr('class', 'y-axis');
  }

  renderScatterplot(data, xAttribute, yAttribute, controllerMethods) {
    console.log("Rendering scatterplot with data:", data);

    // Filtra i dati nulli
    const filteredData = data.filter(d => d && d[xAttribute] != null && d[yAttribute] != null);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[xAttribute]))
      .range([0, this.width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[yAttribute]))
      .range([this.height, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain(["Holiday", "No Holiday"])
      .range(["red", "orange"]);

    const circles = this.svg.selectAll('circle')
      .data(filteredData, d => d.index);

    circles.enter()
      .append('circle')
      .attr('cx', d => xScale(d[xAttribute]))
      .attr('cy', d => yScale(d[yAttribute]))
      .attr('r', 5) // Dimensione dei cerchi
      .attr('fill', d => colorScale(d.Holiday))
      .merge(circles)
      .on('click', controllerMethods.handleOnClick);

    circles.exit().remove();

    // Aggiungi assi
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    this.svg.select('.x-axis').call(xAxis);
    this.svg.select('.y-axis').call(yAxis);

    this.controllerMethods = controllerMethods;
  }

  brushed(event) {
    if (event.selection) {
      const [[x0, y0], [x1, y1]] = event.selection;
      const selectedItems = this.svg.selectAll('circle')
        .filter(d => x0 <= d.x && d.x <= x1 && y0 <= d.y && d.y <= y1)
        .data();
      this.controllerMethods.handleBrush(selectedItems);
    }
  }

  clear() {
    this.svg.remove();
  }
}

export default ScatterplotD3;