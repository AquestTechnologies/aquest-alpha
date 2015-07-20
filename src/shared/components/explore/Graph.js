/* global d3 */

import React from 'react';
import {generateGraphForD3} from '../../utils/graphGenerator';

// http://arxiv.org/pdf/1201.3011v1.pdf
// http://www.cs.arizona.edu/~kobourov/fdl.pdf
// http://arxiv.org/pdf/1209.0748v1.pdf
export default class Graph extends React.Component {
  
  constructor() {
    super();
    this.graphSize = 20;
  }
  
  componentDidMount() {
    const urls = [
      'http://marvl.infotech.monash.edu/webcola/cola.v3.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.js'
    ];
    Promise.all(urls.map(url => this.loadScript(url))).then(() => this.renderGraph());
  }
  
  loadScript(source) {
    return new Promise((resolve, reject) => {
      console.log('.C. Graph.loadScript');
      const scripts = document.getElementsByTagName('script');
      // Vérifie si le script à déjà été loadé
      if ([].slice.call(scripts).every(script => script.src !== source)) {
        // Code copié depuis stackoverflow
        let newElement    = document.createElement('script');
        let scriptElement = scripts[0];
        newElement.src    = source;
        newElement.onload = newElement.onreadystatechange = () => {
          if (!this.readyState || this.readyState === 'complete') resolve();
        };
        scriptElement.parentNode.insertBefore(newElement, scriptElement);
      } else {
        resolve();
      }
    });
  }
  
  renderGraph() {
    let {vertices, edges} = generateGraphForD3(400);
    let width = 1920,
    height = 750;
    
    let color = d3.scale.category20();
    
    let force = d3.layout.force()
      .charge(-150)
      .linkDistance(20)
      .gravity(0.15)
      // .friction(0.9)
      .size([width, height]);
    
    let svg = d3.select("#graphArea").append("svg")
      .attr("id", 'svg')
      .attr("width", width)
      .attr("height", height);
     
    
    force
      .nodes(vertices)
      .links(edges)
      .start();
    
    let link = svg.selectAll(".link")
      .data(edges)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", d => Math.sqrt(d.value));
    
    let node = svg.selectAll(".node")
      .data(vertices)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", d => color(d.group));
      // .call(force.drag);
    
    node.append("title")
      .text(d => d.name);
    
    force.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .each(collide(1)); //Added 
    });
    
    var padding = 1, // separation between circles
    radius=8;
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(vertices);
      return function(d) {
        var rb = 2*radius + padding,
            nx1 = d.x - rb,
            nx2 = d.x + rb,
            ny1 = d.y - rb,
            ny2 = d.y + rb;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y);
              if (l < rb) {
              l = (l - rb) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
  }
  
  again() {
    const graphArea = document.getElementById('graphArea');
    if (graphArea.hasChildNodes()) graphArea.removeChild(document.getElementById('svg'));
    this.renderGraph();
  }
  
  render() {
    const nodeStyle = {
      fill: '#ccc',
      stroke: '#fff',
      strokeWidth: 2,
    };
    const edgeStyle = {
      stroke: '#777',
      strokeWidth: 2,
    };
    
    return(
      <div>
        <style>
          {'.node { stroke: #fff; stroke-width: 1.5px;}.link {  stroke: #999;  stroke-opacity: .6;'}
        </style>
        <button type="button" onClick={this.again.bind(this)}>render</button>
        <div id='graphArea'/>
      </div>
    );
  }
}
