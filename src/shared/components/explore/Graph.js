import React from 'react';
import generateGraph from '../../utils/graphGenerator';

// http://arxiv.org/pdf/1201.3011v1.pdf
// http://www.cs.arizona.edu/~kobourov/fdl.pdf
// http://arxiv.org/pdf/1209.0748v1.pdf
export default class Graph extends React.Component {
  render() {
    const graph = generateGraph(3);
    const nodeStyle = {
      fill: '#ccc',
      stroke: '#fff',
      strokeWidth: 2,
    };
    const edgeStyle = {
      stroke: '#777',
      strokeWidth: 2
    };
    return(
      <div>
        <h1>Graph</h1>
        <h3>Nodes</h3>
        <div>{JSON.stringify(graph.nodes)}</div>
        <br/>
        <h3>Edges</h3>
        <div>{JSON.stringify(graph.edges)}</div>
      </div>
    );
  }
}
