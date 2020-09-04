import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import './index.css';

class Choropleth extends React.Component {
  constructor(props) {
    super(props);
    this.state = { county: ''}
  }
  componentDidMount() {
    var promises = [
      d3.json("https://d3js.org/us-10m.v1.json"),
      d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    ]

    Promise.all(promises).then(values => this.ready(values)) 
  }
  
  ready(us) {   
    var svg = d3.select("svg");
    
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
    
    var path = d3.geoPath();

    var x = d3.scaleLinear()
    .domain([2, 80])
    .rangeRound([600, 860]);

    var color = d3.scaleThreshold()
    .domain(d3.range(2, 80, 10))
    .range(d3.schemeYlGnBu[9]);

    var g = svg.append("g")
    .attr("class", "key")
    .attr('id', 'legend')
    .attr("transform", "translate(0,40)");

    g.selectAll("rect")
      .data(color.range().map(function(d) {
        d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
      .enter().append("rect")
      .attr("height", 8)
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .attr("fill", function(d) { return color(d[0]); });

    g.append("text")
      .attr("class", "caption")
      .attr("x", x.range()[0])
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")

    g.call(d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(function(x) { return x + '%'; })
            .tickValues(color.domain()))
      .select(".domain")
      .remove();


    svg.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(us[0], us[0].objects.counties).features)
      .enter().append("path")
      .attr('class', 'county')
      .attr('data-fips', (d) => { 
        const id = us[1].filter(item => item.fips == d.id);
        return id[0].fips; })
      .attr('data-education', (d) => {
        const id = us[1].filter(item => item.fips == d.id);
        return id[0].bachelorsOrHigher; })
      .attr("fill", (d) => { 
        const id = us[1].filter(item => item.fips == d.id);
        return color(id[0].bachelorsOrHigher); })  
      .on("mouseover", function(d) {
        const id = us[1].filter(item => item.fips == d.id);
        toolTip.style("opacity", 1)
          .text(`County: ${id[0].area_name} (${id[0].state}) | Higher Education: ${id[0].bachelorsOrHigher}%`)
          .attr('data-education', () => { 
        const id = us[1].filter(item => item.fips == d.id);
        return id[0].bachelorsOrHigher; }) })
      .on('mousemove', function() {
        toolTip.style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px") })
      .on('mouseout', function() {
        toolTip.style("opacity", 0) })
      .attr("d", path)
    
    svg.append("path")
      .datum(topojson.mesh(us[0], us[0].objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
  }
  
  render() {
    return (
      <div className='text-center'>
        <div id="title" className='card-body text-center'><h3><strong>Education within the United States</strong></h3><h5 id='description'>Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</h5></div>
        <svg id="my_dataviz" width="960" height="600"></svg>
        <h6 className='card-footer text-center'><em>Technologies used in this project: React, d3, API calls</em></h6>
      </div>
  );
  }
}

ReactDOM.render(<div className="card border-info"><Choropleth /></div>, document.getElementById("root"));
