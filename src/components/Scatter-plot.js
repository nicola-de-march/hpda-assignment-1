import * as d3 from 'd3';

const COLOR_HOLIDAY = "purple";
const COLOR_NO_HOLIDAY = "green";
const OPACITY = 0.2;

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
      .on('start brush end', this.brushed.bind(this));

    this.svg.append('g')
      .attr('class', 'brush')
      .call(this.brush);

    // Aggiungi gruppi per gli assi
    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`);

    this.svg.append('g')
      .attr('class', 'y-axis');

    // Aggiungi etichette degli assi
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
      .attr('y', -10)
      .attr('transform', 'rotate(-90)')
      .text('Y Axis Label');

    // Aggiungi gruppo per la legenda
    this.legend = this.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 100}, 20)`);
  }

  renderScatterplot(data, xAttribute, yAttribute, controllerMethods) {
    console.log("Rendering scatterplot with data:", data);
    console.log("xAttribute:", xAttribute);
    console.log("yAttribute:", yAttribute);

    // Salva gli attributi come proprietà dell'istanza
    this.xAttribute = xAttribute;
    this.yAttribute = yAttribute;

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
      .range(["blue", "red"]);

    const circles = this.svg.selectAll('circle')
      .data(filteredData, d => d.index);

    // Gestisci l'aggiornamento degli elementi esistenti
    circles
      .attr('cx', d => xScale(d[xAttribute]))
      .attr('cy', d => yScale(d[yAttribute]))
      .attr('r', 3.5)
      .attr('fill-opacity', OPACITY)

    // Gestisci l'inserimento di nuovi elementi
    circles.enter()
      .append('circle')
      .attr('cx', d => xScale(d[xAttribute]))
      .attr('cy', d => yScale(d[yAttribute]))
      .attr('r', 3.5)
      .attr('fill-opacity', OPACITY)
      .on('click', controllerMethods.handleOnClick);

    // Gestisci la rimozione degli elementi non più presenti nei dati
    circles.exit().remove();

    // Aggiungi assi
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    this.svg.select('.x-axis').call(xAxis);
    this.svg.select('.y-axis').call(yAxis);

    this.xScale = xScale; // Salva la scala x per l'uso nel metodo brushed
    this.yScale = yScale; // Salva la scala y per l'uso nel metodo brushed
    this.controllerMethods = controllerMethods;

    // Aggiorna le etichette degli assi
    this.svg.select('.x-axis-label').text(xAttribute);
    this.svg.select('.y-axis-label').text(yAttribute);
  }

  brushed(event) {
    const selection = event.selection;
    if (!selection) {
      this.svg.selectAll('circle').attr('stroke', null);
      this.legend.selectAll('*').remove(); // Rimuovi la legenda
    } else {
      const [[x0, y0], [x1, y1]] = selection;
      this.svg.selectAll('circle')
        .attr('stroke', d => {
          if (x0 <= this.xScale(d[this.xAttribute]) && this.xScale(d[this.xAttribute]) <= x1 &&
              y0 <= this.yScale(d[this.yAttribute]) && this.yScale(d[this.yAttribute]) <= y1) {
            return d.Holiday === "Holiday" ? COLOR_HOLIDAY : COLOR_NO_HOLIDAY;
          } else {
            return 'null';
          }
        });

      // Aggiungi la legenda
      this.legend.selectAll('*').remove(); // Rimuovi la legenda esistente
      this.legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', COLOR_HOLIDAY);
      this.legend.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .text('Holiday');

      this.legend.append('rect')
        .attr('x', 0)
        .attr('y', 24)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', COLOR_NO_HOLIDAY);
      this.legend.append('text')
        .attr('x', 24)
        .attr('y', 33)
        .attr('dy', '0.35em')
        .text('No Holiday');
    }
  }

  clear() {
    this.svg.remove();
  }
}

export default ScatterplotD3;