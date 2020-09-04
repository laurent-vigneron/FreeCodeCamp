import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import './index.css';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataset: [] }
  }
  componentDidMount() {
    document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      .then(response => response.json())
      .then(data => { 
        data.forEach(item => item.Time = new Date('1970-01-01T12:' + item.Time + 'Z'));
        this.setState({ dataset: data });
        this.drawChart(); 
      });
    });
  }
  drawChart() {
    const w = 750;
    const h = 500;
    const padding = 60;
    
    const xScale = d3.scaleLinear()
                    .domain([d3.min(this.state.dataset, (d) => d.Year), d3.max(this.state.dataset, (d) => d.Year)])
                    .range([padding + 10, w - padding - 10]);
    const yScale = d3.scaleTime()
                    .domain([d3.min(this.state.dataset, (d) => d.Time), d3.max(this.state.dataset, (d) => d.Time)])
                    .range([padding, h - padding]);

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
      .append('circle')
      .attr('cx', (d) => xScale(d.Year))
      .attr('cy', (d) => yScale(d.Time)) //- (h - padding - yScale(d.Seconds)))
      .attr('r', 5)
      .attr('class', 'dot')
      .attr('data-xvalue', (d) => d.Year)
      .attr('data-yvalue', (d) => d.Time)
      .attr('fill', (d) => (d.Doping!=='')? 'blue' : 'orange')
      .on("mouseover", function(d) {
        let mins = Math.floor(d.Seconds/60);
        let secs = ("0" + (d.Seconds - mins*60)).slice(-2);
        toolTip.style("opacity", 1).text('Date: '+d.Year+' | Ascension time: '+mins+':'+secs)
                .attr('data-year', d.Year)})
      .on('mousemove', function() {
        toolTip.style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px") })
      .on('mouseout', function() {
          toolTip.style("opacity", 0) })
    
    const xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat(d3.format(".0f"));
    const yAxis = d3.axisLeft(yScale);
    yAxis.tickFormat(d3.timeFormat("%M:%S"));
    svg.append('g').attr('transform', 'translate(0,'+ (h-padding) +')').attr('id', 'x-axis').call(xAxis).selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    svg.append('g').attr('transform', 'translate(' + padding + ',0)').attr('id', 'y-axis').call(yAxis);
    
    // Label of the Y axis
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", -h/2+60)
    .text("Ascension Time")
    
    // Lavel of the X axis
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", w/2+50)
    .attr("y", h-10)
    .text("Year of the Race");
    
    // Legend
    svg.append('rect').attr('x', w-245).attr('y', 85).attr('width', 200).attr('height', 50).attr('fill', 'rgb(247, 244, 249)').attr('stroke', 'rgb(0,0,0)').attr('id', 'legend')
    svg.append("circle").attr("cx",w-230).attr("cy",100).attr("r", 5).style("fill", "blue")
    svg.append("circle").attr("cx",w-230).attr("cy",120).attr("r", 5).style("fill", "orange")
    svg.append("text").attr("x", w-220).attr("y", 103).text("Involves Doping").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", w-220).attr("y", 123).text("No Doping Allegations").style("font-size", "15px").attr("alignment-baseline","middle")
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
        <div id="title" className='card-body text-center'><strong>35 Fastest times up Alpe d'Huez - Doping within Cycling</strong></div>
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

