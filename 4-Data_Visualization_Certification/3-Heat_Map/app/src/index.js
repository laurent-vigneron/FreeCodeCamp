import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';

import './index.css';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { baseTemperature: 0,
                  dataset: [] }
  }
  componentDidMount() {
    document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(response => response.json())
      .then(data => { 
        data.monthlyVariance.forEach(item => {
          item.temp = data.baseTemperature + item.variance;
          item.month = item.month - 1;
        });
        this.setState({
          baseTemperature: data.baseTemperature,
          dataset: data.monthlyVariance })
      this.drawChart(); 
      });
    });
  }
  drawChart() {
    const w = 1200;
    const h = 700;
    const padding = 150;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const xScale = d3.scaleLinear()
                    .domain([d3.min(this.state.dataset, (d) => d.year), d3.max(this.state.dataset, (d) => d.year)])
                    .range([padding + 10, w - padding - 10])
    const yScale = d3.scaleLinear()
                    .domain([d3.min(this.state.dataset, (d) => d.month), d3.max(this.state.dataset, (d) => d.month)])
                    .range([padding, h - padding]);
    const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([d3.max(this.state.dataset, (d) => d.temp), d3.min(this.state.dataset, (d) => d.temp)])   
    
    // create a tooltip
    var toolTip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("id", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
  
    const svg = d3.select('#chart').append('svg').attr('width', w).attr('height', h);
    svg.selectAll('rect')
      .data(this.state.dataset)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.year))
      .attr('y', (d) => yScale(d.month) - (h-padding)/12 - 100)
      .attr('width', 5)
      .attr('height', (h-padding)/12)
      .attr('class', 'cell')
      .attr('data-year', (d) => d.year)
      .attr('data-month', (d) => d.month)
      .attr('data-temp', (d) => d.temp)
      .attr('fill', (d) => colorScale(d.temp))
      .on("mouseover", function(d) {
          toolTip.style("opacity", 1)
                .text('Date: '+months[d.month]+' '+d.year+' | Temperature: '+ d.temp) 
                .attr('data-year', d.year)})
      .on('mousemove', function() {
          toolTip.style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px") })
      .on('mouseout', function() {
          toolTip.style("opacity", 0) })
    
    const xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat(d3.format(".0f"));
    const yAxis = d3.axisLeft(yScale);
    yAxis.tickFormat((d) => months[d]);
    svg.append('g').attr('transform', 'translate(0,'+ (h-padding-100) +')')
      .attr('id', 'x-axis').call(xAxis).selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
    svg.append('g').attr('transform', 'translate(' + padding + ', -130)')
      .attr('id', 'y-axis').call(yAxis);
    
    // Label of the Y axis
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", padding/2)
    .attr("x", -h/2+150)
    .text("Months")
    
    // Label of the X axis
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", w/2+30)
    .attr("y", h-padding/2-125)
    .text("Years");
    
    // Legend
    var legend = legendColor()
      .scale(colorScale).orient('horizontal').ascending(true)
      .shapeWidth(25).shapeHeight(25).shapePadding(5).labelAlign('middle')
    
    svg.append('rect').attr('x', w/2-70).attr('y', h-padding-30).attr('width', 170)
      .attr('height', 70).attr('fill', 'rgb(247, 244, 249)')
      .attr('stroke', 'rgb(0,0,0)')  
    svg.append("g")
      .attr("transform", "translate(" + (w/2-60) + ", "+ (h-padding-20) +")")
      .attr('id', 'legend')
      .call(legend);
    
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
        <div id="title" className='card-body text-center'><h3><strong>Monthly Global Land-Surface Temperature</strong></h3><h5 id='description'>1753 - 2015: base temperature 8.66℃</h5></div>
        <Chart />
        <h6 className='card-footer text-center'><em>Technologies used in this project: React, d3, API calls</em></h6>
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