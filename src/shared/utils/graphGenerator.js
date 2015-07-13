import randomInteger from './randomInteger.js';

const VERTEX_RADIUS = 30;
const MARGIN = 30;
const FORCE_CORRECTOR = 1;

// Generates a random graph for test purpose
export function generateGraphForD3(size) {
  
  const MIN_EDGES = 1;
  const MAX_EDGES = 5;
  const MIN_FORCE = 1;
  const MAX_FORCE = 5;
  
  let vertices = [{name: 'first', description: 'first'}];
  let edges = [];
  let name, description, parents, nextParent;
  
  for (let i = 0; i < size; i++) {
    
    // Vertex definition
    name = (Math.random() + 1).toString(36).substring(2, 7);
    description = `description for ${name}`;
    
    // Parents selection
    parents = [];
    for (let i = 0, j = randomInteger(MIN_EDGES, MAX_EDGES); i < j; i++) {
      nextParent = vertices[randomInteger(0, vertices.length - 1)];
      if (parents.indexOf(nextParent) === -1) parents.push(nextParent);
    }
    
    parents.forEach(parent => {
      edges.push({
        source: parent,
        target: name,
        value: randomInteger(MIN_FORCE, MAX_FORCE)
      });
    });
    
    // Vertex creation
    vertices.push({name, description});
  }
  
  return({vertices, edges});
}

// Generates a random graph for test purpose
export function generateGraph(size) {
  
  const MIN_EDGES = 1;
  const MAX_EDGES = 1;
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
  
  const K_CORRECTOR = 10;
  const ITERATIONS = 50;
  
  const svgVertices = initializeGraph(svg, vertices, edges);
  const keys = Object.keys(svgVertices);
  
  const svgWidth = svg.node.clientWidth;
  const svgHeight = svg.node.clientHeight;
  const K = Math.sqrt(svgWidth * svgHeight / keys.length) / K_CORRECTOR;
  
  const originalTemperature = svgWidth / 10;
  let temperature = originalTemperature;
  
  // Main algorithm
  for (let i = 0; i < ITERATIONS; i++) {
    
    keys.forEach(key => {
      const v = svgVertices[key];
      // Displacement vector
      v.displacement = {
        x: 0,
        y: 0
      };
      
      keys.forEach(key2 => {
        if (key2 !== key) {
          const u = svgVertices[key2];
          // The distance between the two vertices
          const delta = {
            x: u.x - v.x,
            y: u.y - v.y
          };
          let distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
          distance = distance ? distance : 0.1;
          const frResult = fr(distance, K) / distance;
          v.displacement.x += frResult * delta.x;
          v.displacement.y += frResult * delta.y;
        }
      });
    });
    
    edges.forEach(edge => {
      const v = svgVertices[edge.parent];
      const u = svgVertices[edge.child];
      const delta = {
        x: u.x - v.x,
        y: u.y - v.y
      };
      let distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
      distance = distance ? distance : 0.1;
      const faResult = fa(distance, K) / distance;
      v.displacement.x -= faResult * delta.x;
      v.displacement.y -= faResult * delta.y;
      u.displacement.x -= faResult * delta.x;
      u.displacement.y -= faResult * delta.y;
    });
    
    keys.forEach(key => {
      const v = svgVertices[key];
      const delta = v.displacement;
      let distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
      distance = distance ? distance : 0.1;
      v.x += delta.x * Math.min(delta.x, temperature) / distance;
      v.y += delta.y * Math.min(delta.y, temperature) / distance;
      v.x = Math.min(svgWidth - VERTEX_RADIUS - MARGIN, Math.max(0 + VERTEX_RADIUS + MARGIN, v.x));
      v.y = Math.min(svgHeight - VERTEX_RADIUS - MARGIN, Math.max(0 + VERTEX_RADIUS + MARGIN, v.y));
    });
    
    correctPosition(svgVertices, svgWidth, svgHeight);
    
    temperature = temperature - originalTemperature / ITERATIONS;
  }
  
  // Draws graph
  edges.forEach(edge => drawEdge(svg, svgVertices[edge.parent], svgVertices[edge.child]));
  keys.forEach(key => drawVertex(svg, svgVertices[key]));
}

// Not part of the original algorithm
function correctPosition(svgVertices, svgWidth, svgHeight) {
  const keys = Object.keys(svgVertices);
  // Strong assomption that te first vertex is the graph center
  const {x, y} = svgVertices[keys[0]];
  const delta = {
    x: svgWidth / 2 - x,
    y: svgHeight / 2 - y
  };
  keys.forEach(key => {
    const v = svgVertices[key];
    v.x += delta.x;
    v.y += delta.y;
      v.x = Math.min(svgWidth - VERTEX_RADIUS - MARGIN, Math.max(0 + VERTEX_RADIUS + MARGIN, v.x));
      v.y = Math.min(svgHeight - VERTEX_RADIUS - MARGIN, Math.max(0 + VERTEX_RADIUS + MARGIN, v.y));
  });
}

// Places vertices at random
function initializeGraph(svg, vertices, edges) {
  console.log('initializeGraph');
  
  const svgWidth = svg.node.clientWidth;
  const svgHeight = svg.node.clientHeight;
  let x, y;
  let svgVertices = {};
  
  Object.keys(vertices).forEach(key => {
    svgVertices[key] = {};
    svgVertices[key].data = vertices[key];
    svgVertices[key].x = randomInteger(VERTEX_RADIUS, svgWidth - VERTEX_RADIUS);
    svgVertices[key].y = randomInteger(VERTEX_RADIUS, svgHeight - VERTEX_RADIUS);
  });
  // edges.forEach(edge => drawEdge(svg, svgVertices[edge.parent], svgVertices[edge.child]));
  // Object.keys(svgVertices).forEach(key => drawVertex(svg, svgVertices[key]));
  
  return svgVertices;
}

// Draws a given vertex at a given position
function drawVertex(svg, svgVertex) {
  console.log('drawVertex');
  const {x, y} = svgVertex;
  const circle = svg.circle(x, y, VERTEX_RADIUS);
  const text = svg.text();
  circle.attr({
    fill: '#2FD359'
  });
  text.attr({
    text: svgVertex.data.name,
    style: 'font-size: 1.5rem; fill: #fff',
  });
  const {width, height} = text.getBBox();
  text.attr({
    x: x - width / 2,
    y: y + height / 4
  });
  
  svgVertex.element = svg.group(circle, text);
}

function drawEdge(svg, parent, child) {
  console.log('drawEdge');
  const line = svg.line(parent.x, parent.y, child.x, child.y);
  
  line.attr({
    stroke: '#bbb',
    'stroke-width': 2
  });
}

// Repulsive force
function fr(x, k) {
  return (k * k / x) * FORCE_CORRECTOR;
}

// Attractive force
function fa(x, k) {
  return (x * x / k) * FORCE_CORRECTOR;
}

