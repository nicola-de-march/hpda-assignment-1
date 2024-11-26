import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';

const OPACITY = 0.2;

const colorMaps = {
  Seasons: {
    domain: ["Spring", "Summer", "Fall", "Winter"],
    range: ["green", "orange", "yellow", "blue"]
  },
  Holiday: {
    domain: ["Yes", "No"],
    range: ["red", "blue"]
  },
  FunctioningDay: {
    domain: ["Yes", "No"],
    range: ["gray", "purple"]
  }
};

const ParallelCoordinates = ({ data, dimensions, selectedClass }) => {
  const ref = useRef();
  const [currentDimensions, setCurrentDimensions] = useState(dimensions);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 30, right: 10, bottom: 10, left: 10 };
    const width = 800 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .range([0, width])
      .padding(1)
      .domain(currentDimensions);

    const y = {};
    for (const dim of currentDimensions) {
      y[dim] = d3.scaleLinear()
        .domain(d3.extent(data, d => +d[dim]))
        .range([height, 0]);
    }

    const line = d3.line();
    const path = d => line(currentDimensions.map(p => [x(p), y[p](d[p])]));

    const colorMap = colorMaps[selectedClass];
    const colorScale = d3.scaleOrdinal()
      .domain(colorMap.domain)
      .range(colorMap.range);

    const paths = svg.selectAll('path')
      .data(data, d => d.index);

    paths
      .transition()
      .duration(500)
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', d => colorScale(d[selectedClass]))
      .style('opacity', OPACITY);

    paths.enter().append('path')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', d => colorScale(d[selectedClass]))
      .style('opacity', OPACITY)
      .on('mouseover', function(event, d) {
        if (svg.selectAll('.brush').filter(function() { return d3.brushSelection(this); }).empty()) {
          d3.select(this)
            .style('stroke-width', '3px')
            .style('opacity', 1);
        }
      })
      .on('mouseout', function(event, d) {
        if (svg.selectAll('.brush').filter(function() { return d3.brushSelection(this); }).empty()) {
          d3.select(this)
            .style('stroke-width', '1.5px')
            .style('opacity', OPACITY);
        }
      });

    paths.exit()
      .transition()
      .duration(750)
      .style('opacity', 0)
      .remove();

    const axis = svg.selectAll('g.axis')
      .data(currentDimensions)
      .enter().append('g')
      .attr('class', 'axis')
      .attr('transform', d => `translate(${x(d)})`)
      .each(function(d) {
        d3.select(this).call(d3.axisLeft(y[d])); 
      })
      .append('text')
      .style('text-anchor', 'middle')
      .attr('y', -9)
      .text(d => d)
      .style('fill', 'black');

    // Brush functionality
    const brush = d3.brushY()
      .extent([[-10, 0], [10, height]]) 
      .on("start brush end", brushed);

    svg.selectAll('.axis')
      .append('g')
      .attr('class', 'brush')
      .each(function(d) {
        d3.select(this).call(brush);
    });
    
    function brushed(event) {
      const actives = [];
      svg.selectAll('.brush')
        .filter(function(d) {
          return d3.brushSelection(this);
        })
        .each(function(d) {
          actives.push({
            dimension: d,
            extent: d3.brushSelection(this)
          });
        });

      const selected = data.filter(d => {
        return actives.every(active => {
          const dim = active.dimension;
          return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
        });
      });

      svg.selectAll('path')
        .style('opacity', d => selected.includes(d) ? 0.6 : 0.02);
    }

    // Drag and drop functionality for reordering axes
    const drag = d3.drag()
      .on('start', function(event, d) {
        d3.select(this).raise().classed('active', true);
      })
      .on('drag', function(event, d) {
        const xPos = d3.pointer(event)[0];
        d3.select(this).attr('transform', `translate(${xPos},0)`);
      })
      .on('end', function(event, d) {
        d3.select(this).classed('active', false);
        const xPos = d3.pointer(event)[0];
        const newOrder = [...currentDimensions];
        const oldIndex = newOrder.indexOf(d);
        const newIndex = Math.round(xPos / (width / (newOrder.length - 1)));
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, d);
        setCurrentDimensions(newOrder);
      });

    axis.call(drag);

    return () => {
      svg.remove();
    };
  }, [data, currentDimensions, selectedClass]);

  return <svg ref={ref}></svg>;
};

export default ParallelCoordinates;