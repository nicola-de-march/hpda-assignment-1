import React, { useRef, useEffect } from 'react';
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

const AlternativeScatterplotD3 = ({ data, xAttribute, yAttribute, selectedClass, onDotClick }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 40, bottom: 40, left: 80 };
    const width = 700 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[xAttribute]))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[yAttribute]))
      .range([height, 0]);

    const colorMap = colorMaps[selectedClass];
    const colorScale = d3.scaleOrdinal()
      .domain(colorMap.domain)
      .range(colorMap.range);

    svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx', d => xScale(d[xAttribute]))
      .attr('cy', d => yScale(d[yAttribute]))
      .attr('r', 3.5)
      .attr('fill', d => colorScale(d[selectedClass]))
      .on('click', onDotClick);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Aggiorna le etichette degli assi
    svg.append('text')
      .attr('class', 'x-axis-label')
      .attr('text-anchor', 'end')
      .attr('x', width)
      .attr('y', height + margin.bottom - 5)
      .text(xAttribute);

    svg.append('text')
      .attr('class', 'y-axis-label')
      .attr('text-anchor', 'end')
      .attr('x', -margin.left + 5)
      .attr('y', -30)
      .attr('transform', 'rotate(-90)')
      .text(yAttribute);

    return () => {
      svg.remove();
    };
  }, [data, xAttribute, yAttribute, selectedClass, onDotClick]);

  return <svg ref={ref}></svg>;
};

export default AlternativeScatterplotD3;