import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import './index.css';

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#data")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json", function(data) {

  var root = d3.hierarchy(data).sum(function(d){ return d.value}) 

  d3.treemap()
    .size([width, height])
    .padding(2)
  (root)
  
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

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .on("mouseover", function(d) {
        toolTip.style("opacity", 1)
        .text('Movie Title: '+d.data.name+'  | Box-Office Numbers: '+d3.format(",")(d.data.value)+' USD') 
        .attr('data-value', d.data.value)})
    .on('mousemove', function() {
        toolTip.style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + "px") })
    .on('mouseout', function() {
        toolTip.style("opacity", 0) })
    .attr('class', 'tile')
    .attr('data-name', function (d) { return d.data.name; })
    .attr('data-category', function (d) { return d.data.category; })
    .attr('data-value', function (d) { return d.data.value; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", function(d) { while (d.depth > 1) d = d.parent; return color(d.data.name); })
    
 // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function(d){ return d.x0+5})
    .attr("y", function(d){ return d.y0+20})
    .text(function(d){ return d.data.name })
    .attr("font-size", "12px")
    .attr("fill", "white")
    .attr('x1', function(d) { return d.x1 })
    .call(wrap)

  // Legend
  var legend = legendColor()
  .scale(color).orient('horizontal').ascending(false)
  .shapeWidth(25).shapeHeight(25).shapePadding(50).labelAlign('middle')

  var bottom = d3.select('#legend')
    .append('svg').attr("width", '540').attr("height", '200')
    .style('margin','auto')
  
  bottom.append('rect').attr('x', '0').attr('y', '0').attr('width', '540')
    .attr('height', '70').attr('fill', 'rgb(247, 244, 249)')
    .attr('stroke', 'rgb(0,0,0)')  
  
  bottom.append("g")
    .attr("transform", "translate(30,10)")
    .attr('id', 'legend')
    .call(legend)
    .selectAll('rect')
    .attr('class', 'legend-item')
  
})

function wrap(text) {
  text.each(function () {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, 
        x = text.attr("x"),
        y = text.attr("y"),
        x1 = text.attr("x1"),
        dy = 0,
        width = parseInt(x1) - parseInt(x),
        tspan = text.text(null)
    .append("tspan")
    .attr("x", x)
    .attr("y", y)
    .attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}