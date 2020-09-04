import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import './index.css';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataset: [] }
  }
  componentDidMount() {
    document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => response.json())
      .then(data => { 
        this.setState({ dataset: data.data });
                      this.drawChart(); 
                    });
    });
  }
  drawChart() {
    const w = 750;
    const h = 500;
    const padding = 60;
    
    const xScale = d3.scaleTime()
                    .domain([d3.min(this.state.dataset, (d) => new Date(d[0])), d3.max(this.state.dataset, (d) => new Date(d[0]))])
                    .range([padding, w - padding]);
    const yScale = d3.scaleLinear()
                    .domain([d3.max(this.state.dataset, (d) => d[1]), 0])
                    .range([padding, h - padding]);

    // create a tooltip
    var toolTip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("border-radius", "5px")
      .style("padding", "5px")
  
    const svg = d3.select('#chart').append('svg').attr('width', w).attr('height', h);
    svg.selectAll('rect')
      .data(this.state.dataset)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(new Date(d[0])))
      .attr('y', (d) => yScale(0) - (h - padding - yScale(d[1])))
      .attr('width', 2)
      .attr('height', (d) => h - padding - yScale(d[1]))
      .attr('class', 'bar')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .attr('fill', 'blue')
      .on("mouseover", function(d) {
        toolTip.style("opacity", 1).text('Date: '+d[0]+' GDP: '+d[1]) 
          .attr('data-date', d[0])})
      .on('mousemove', function() {
        toolTip.style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px") })
      .on('mouseout', function() {
        toolTip.style("opacity", 0) })
    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg.append('g').attr('transform', 'translate(0,'+ (h-padding) +')').attr('id', 'x-axis').call(xAxis)
    svg.append('g').attr('transform', 'translate(' + padding + ',0)').attr('id', 'y-axis').call(yAxis);
  }
  render() {
    return (
      <div id='chart' className='text-center'>
      </div>
    );
  }
}

class BarChart extends React.Component {
  render() {
    return (
      <div>
        <div id="title" className='card-body text-center'><strong>Evolution of the US GDP</strong></div>
        <Chart />
        <h6 className='text-center'><em>Technologies used in this project: React, d3, API calls</em></h6>
      </div>
  );
  }
}

ReactDOM.render(
  <div className="card border-info">
    <BarChart />
  </div>,
  document.getElementById("root")
);

