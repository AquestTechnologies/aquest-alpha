/* global Snap */

import React from 'react';
import {drawGraph} from '../../utils/graphGenerator';

// http://arxiv.org/pdf/1201.3011v1.pdf
// http://www.cs.arizona.edu/~kobourov/fdl.pdf
// http://arxiv.org/pdf/1209.0748v1.pdf
export default class Graph extends React.Component {
  
  componentDidMount() {
    this.loadSVG();
  }
  
  loadSVG() {
    console.log('.C. Graph.loadSVG');
    const source = 'http://130.211.68.244:8080/img/snap.svg.js';
    const scripts = document.getElementsByTagName('script');
    // Vérifie si le script à déjà été loadé
    if ([].slice.call(scripts).every(script => script.src !== source)) {
      // Code copié depuis stackoverflow
      let newElement    = document.createElement('script');
      let scriptElement = scripts[0];
      newElement.src    = source;
      newElement.onload = newElement.onreadystatechange = () => {
        if (!this.readyState || this.readyState === 'complete') this.renderGraph();
      };
      scriptElement.parentNode.insertBefore(newElement, scriptElement);
    } else {
      this.renderGraph();
    }
  }
  
  renderGraph() {
    console.log('.C. Graph.renderGraph');
    const svg = Snap('100%', 600);
    const {vertices, edges} = this.props;
    document.getElementById('graphArea').appendChild(svg.node);
    drawGraph(svg, vertices, edges);
  }
  
  render() {
    const {vertices, edges} = this.props;
    
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
        <h1>Graph</h1>
        <div id='graphArea'/>
        <h3>Vertices</h3>
        <div>{JSON.stringify(vertices)}</div>
        <h3>Edges</h3>
        <div>{JSON.stringify(edges)}</div>
      </div>
    );
  }
}
