import randomInteger from './randomInteger.js';

const VERTEX_RADIUS = 30;

// Generates a random graph for test purpose
export function generateGraph(size) {
  
  const MIN_EDGES = 1;
  const MAX_EDGES = 5;
  const MIN_FORCE = 1;
  const MAX_FORCE = 5;
  
  let vertices = {}, edges = [];
  let name, description, verticesNames, parents, nextParent;
  
  vertices['0'] = {
    name: '0',
    description: 'This is the first vertex ever'
  };
  
  for (let i = 1; i < size; i++) {
    
    // Vertex definition
    name = (Math.random() + 1).toString(36).substring(2, 7);
    description = `description for ${name}`;
    
    // Parents selection
    parents = [];
    verticesNames = Object.keys(vertices);
    for (let i = 0, j = randomInteger(MIN_EDGES, MAX_EDGES); i < j; i++) {
      nextParent = verticesNames[randomInteger(0, verticesNames.length - 1)];
      if (parents.indexOf(nextParent) === -1) parents.push(nextParent);
    }
    
    parents.forEach(parent => {
      edges.push({
        parent,
        child: name,
        force: randomInteger(MIN_FORCE, MAX_FORCE)
      });
    });
    
    // Vertex creation
    vertices[name] = ({name, description});
  }
  
  return({vertices, edges});
}

// Draws the graph on a provided SVG DOM element
export function drawGraph(svg, vertices, edges) {
  
  // console.log(svg);
  // console.log(vertices);
  // console.log(edges);
  
  initializeGraph(svg, vertices, edges);
  
  const svgWidth = svg.node.clientWidth;
  const svgHeight = svg.node.clientHeight;
  const size = Object.keys(vertices).length;
  const K = Math.sqrt(svgWidth * svgHeight / size);
  
}

// Places vertices at random
function initializeGraph(svg, vertices, edges) {
  console.log('initializeGraph');
  // console.log(svg);
  // console.log(vertices);
  // console.log(edges);
  
  const svgWidth = svg.node.clientWidth;
  const svgHeight = svg.node.clientHeight;
  let x, y;
  let newVertices = {};
  let newEdges = [];
  
  Object.keys(vertices).forEach(key => {
    x = randomInteger(VERTEX_RADIUS, svgWidth - VERTEX_RADIUS);
    y = randomInteger(VERTEX_RADIUS, svgHeight - VERTEX_RADIUS);
    newVertices[key] = drawVertex(svg, vertices[key], x, y);
  });
  // console.log(newVertices['0'].getBBox());
  edges.forEach(edge => {
    drawEdge(svg, edge, newVertices);
  });
  
}

// Draws a given vertex at a given position
function drawVertex(svg, vertex, x, y) {
  console.log('drawVertex');
  const circle = svg.circle(x, y, VERTEX_RADIUS);
  const text = svg.text();
  circle.attr({
    fill: '#2FD359'
  });
  text.attr({
    text: vertex.name,
    style: 'font-size: 1.5rem; fill: #fff',
  });
  const {width, height} = text.getBBox();
  text.attr({
    x: x - width / 2,
    y: y + height / 4
  });
  return svg.group(circle, text);
}

function drawEdge(svg, edge, newVertices) {
  const dimParent = newVertices[edge.parent].getBBox();
  const dimChild = newVertices[edge.child].getBBox();
  
  const x1 = dimParent.x + dimParent.width / 2;
  const y1 = dimParent.y + dimParent.height / 2;
  const x2 = dimChild.x + dimChild.width / 2;
  const y2 = dimChild.y + dimChild.height / 2;
  
  const line = svg.line(x1, y1, x2, y2);
  
  line.attr({
    stroke: '#999',
    'stroke-width': 2
  });
  
  return line;
}



