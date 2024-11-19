import * as d3 from 'd3';

const OPACITY = 0.2;

const colorMaps = {
  Seasons: {
    domain: ["Spring", "Summer", "Fall", "Winter"],
    range: ["green", "yellow", "orange", "blue"]
  },
  Holiday: {
    domain: ["Yes", "No"],
    range: ["red", "blue"]
  },
  FunctioningDay: {
    domain: ["Yes", "No"],
    range: ["gray", "purple"]
  }
  // Aggiungi altre variabili discrete e le loro colormap qui
};

class AlternativeScatterplotD3 {
  constructor(element, onDotClick) {
    this.element = element;
    this.onDotClick = onDotClick;
  }

  create({ size }) {
    console.log("Creating alternative scatterplot with size:", size);

    // Definisci i margini
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
      .attr('y', -40)
      .attr('transform', 'rotate(-90)')
      .text('Y Axis Label');
  }

  renderScatterplot(data, xAttribute, yAttribute, controllerMethods) {
    console.log("Rendering alternative scatterplot with data:", data);
    console.log("xAttribute:", xAttribute);
    console.log("yAttribute:", yAttribute);
    console.log("selectedClass:", controllerMethods.selectedClass);

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

    // Seleziona la colormap corretta in base alla variabile selezionata
    const colorMap = colorMaps[controllerMethods.selectedClass];
    const colorScale = d3.scaleOrdinal()
      .domain(colorMap.domain)
      .range(colorMap.range);

    const circles = this.svg.selectAll('circle')
      .data(filteredData, d => d.index);

    // Gestisci l'aggiornamento degli elementi esistenti
    circles
      .transition()
      .duration(750)
      .attr('cx', d => xScale(d[xAttribute]))
      .attr('cy', d => yScale(d[yAttribute]))
      .attr('r', 3.5)
      .attr('stroke', 'black')
      .attr('fill', d => colorScale(d[controllerMethods.selectedClass]));

    // Gestisci l'inserimento di nuovi elementi
    circles.enter()
      .append('circle')
      .attr('cx', d => xScale(d[xAttribute]))
      .attr('cy', d => yScale(d[yAttribute]))
      .attr('r', 0) // Inizia con raggio 0 per l'animazione
      .attr('stroke', 'black')
      .attr('fill', d => colorScale(d[controllerMethods.selectedClass]))
      .on('click', (event, d) => {
        this.onDotClick(d, event);
      })
      .transition()
      .duration(750)
      .attr('r', 3.5); // Anima il raggio fino a 3.5

    // Gestisci la rimozione degli elementi non più presenti nei dati
    circles.exit()
      .transition()
      .duration(750)
      .attr('r', 0) // Anima il raggio fino a 0
      .remove();

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

  clear() {
    this.svg.remove();
  }
}

export default AlternativeScatterplotD3;