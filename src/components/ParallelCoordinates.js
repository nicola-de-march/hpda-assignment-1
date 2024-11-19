import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

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

const ParallelCoordinates = ({ data, dimensions, selectedClass }) => {
  const ref = useRef();

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 30, right: 10, bottom: 10, left: 10 };
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .range([0, width])
      .padding(1)
      .domain(dimensions);

    const y = {};
    for (const dim of dimensions) {
      y[dim] = d3.scaleLinear()
        .domain(d3.extent(data, d => +d[dim]))
        .range([height, 0]);
    }

    const line = d3.line();
    const path = d => line(dimensions.map(p => [x(p), y[p](d[p])]));

    const colorMap = colorMaps[selectedClass];
    const colorScale = d3.scaleOrdinal()
      .domain(colorMap.domain)
      .range(colorMap.range);

    const paths = svg.selectAll('path')
      .data(data, d => d.index);

    // Gestisci l'aggiornamento degli elementi esistenti
    paths
      .transition()
      .duration(750)
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', d => colorScale(d[selectedClass]))
      .style('opacity', 0.5);

    // Gestisci l'inserimento di nuovi elementi
    paths.enter().append('path')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', d => colorScale(d[selectedClass]))
      .style('opacity', 0.1);

    // Gestisci la rimozione degli elementi non più presenti nei dati
    paths.exit()
      .transition()
      .duration(750)
      .style('opacity', 0)
      .remove();

    svg.selectAll('g.axis')
      .data(dimensions)
      .enter().append('g')
      .attr('class', 'axis')
      .attr('transform', d => `translate(${x(d)})`)
      .each(function(d) {
        d3.select(this).call(d3.axisLeft(y[d])); // Mostra i valori sugli assi
      })
      .append('text')
      .style('text-anchor', 'middle')
      .attr('y', -9)
      .text(d => d)
      .style('fill', 'black');

    return () => {
      svg.remove();
    };
  }, [data, dimensions, selectedClass]);

  return <svg ref={ref}></svg>;
};

export default ParallelCoordinates;