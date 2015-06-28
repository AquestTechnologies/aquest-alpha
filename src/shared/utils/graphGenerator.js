import log from './logTailor.js';

export default function generateGraph(size) {
  
  //Théorie générale, avantages
  // https://en.wikipedia.org/wiki/Force-directed_graph_drawing
  
  // Force-directed
  // http://arxiv.org/pdf/1201.3011v1.pdf
  
  // Encore mieux, social gravity
  // http://arxiv.org/pdf/1209.0748v1.pdf
  log('generateGraph ' + size);
  const MIN_EDGES = 1;
  const MAX_EDGES = 5;
  const MIN_FORCE = 1;
  const MAX_FORCE = 5;
  
  let node, adj;
  let nodes = [], edges = [];
  
  nodes.push({
    name: 'First node',
    index: 0
  });
  
  for (let i = 1; i < size; i++) {
    log('___for loop ' + i);
    adj = selectAdjacents(nodes, MIN_EDGES, MAX_EDGES);
    log('adj are :');
    log(adj);
    node = {
      index: i,
      name: (Math.random() + 1).toString(36).substring(2 ,5)
    };
    nodes.push(node);
    adj.forEach(function(a) {
      edges.push({
        begin: node.index,
        end: a.index,
        force: randomNumber(MIN_FORCE, MAX_FORCE)
      });
    });
  }
  
  return({
    nodes: nodes,
    edges: edges
  });
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectAdjacents(nodes, min, max) {
  log('selectAdjacents');
  let queue;
  let selected = [];
  let l = nodes.length;
  let alreadySelected = false;
  
  for (let i = randomNumber(min, max); i--;) {
    queue = nodes[randomNumber(0, l-1)];
    log('queue is :');
    log(queue);
    selected.forEach(function(s) {
      if (s === queue) alreadySelected = true;
    });
    if (alreadySelected === false) selected.push(queue);
  }
  
  log('selectAdjacents returned ' + selected.length + ' nodes');
  return selected;
} 