import { loadGraph, saveGraph } from './sync.js';
import { focusNode } from './focus.js';
import { resizeNode } from './graph.js';
import { getNodeElement } from './nodes.js';
import { uuid } from './uuid.js';
import { Draw } from './draw.js';

let userId = '696969';

// Data - Starting data graph
let data = {};
let setData = d => data = d;
let getData = _ => data;
let graphId = 123;

// Data - create new node data structure
let createNewTextNode = () => {
  return {
    content: "Start writing!",
    type: "text",
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    size: {
      x: 20,
      y: 3,
      z: 1
    },
    nodeId: uuid(),
    userId: '696969',
    updated: new Date(),
  }
}

// Event - Add new node
let addNode = () => {
  let n = createNewTextNode();
  data.nodes.push(n);
  data.graph.nodes.push(n.nodeId);
  render(_ => focusNode(n.nodeId));
  save(data);
}
window.addNode = addNode;

// View - Load and clear templates
let templates = {};
let loadTemplates = () => {
  document
    .querySelectorAll('[data-template]')
    .forEach(template => {
      templates[template.getAttribute('data-template')] = template;
      template.remove();
  })
}
loadTemplates();

// View - Renders/updates app view
let render = callback => {
  let app = document.querySelector('#app');
  data.graph.nodes.forEach(nodeId => {
    let node = data.nodes.find(n => n.nodeId == nodeId);

    // Update existing nodes
    let n = app.querySelector(`[data-d-id="${node.nodeId}"]`);
    let c;
    if (n !== null) {
      c = n.querySelector('[data-d-content]');
      if (c.value !== node.content) {
        c.value = node.content;
      }
    } else {
      // Add nodes that don't exist
      n = templates[node.type].cloneNode(true);
      n.style.width = node.size.x + 'rem';
      n.style.height = node.size.y + 'rem';
      app.appendChild(n);
      n.setAttribute('data-d-id', node.nodeId);
      n.setAttribute('data-d-type', node.type);
      
      c = n.querySelector('[data-d-content]');
      switch (node.type) {
        case "text":
          c.value = node.content;
          c.addEventListener('keyup', event => saveContent(event.target, node.nodeId));
          c.addEventListener('mouseup', event => resizeNode(event.target, node.nodeId, data, setData, render, save))
          c.style.width = '100%';
          c.style.height = '100%';
          break;
        case "sketch":
          // TODO: not manually multiply by 16
          // TODO: load strokes if it exists from node.content
          // TODO: save strokes if it exists to node.content, on mouseup
          const draw = new Draw(c, node.size.x * 16, node.size.y * 16);
      }
    }
  });

  if (callback) callback();
}

// Event - Autosave
let saveTimeout;
let saveContent = (contentNode, nodeId) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    // Find the node in data, diff & update it
    let nodeIndex = data.nodes.findIndex(node =>
      node.nodeId == nodeId);
    if (data.nodes[nodeIndex].content !== contentNode.value) {
      data.nodes[nodeIndex].content = contentNode.value;
      data.nodes[nodeIndex].updated = new Date();
    }

    let lastUpdatedNode = data.nodes.reduce((newest, node) => (newest.updated || 0) > node.updated ? newest : node, data.graph.updated);
    data.graph.updated = lastUpdatedNode.updated;

    save(data);
  }, 1000);
}

let save = data => {
  saveGraph(data).then(response => {
    if (response.status == 200) {
      showStatus('Saved!');
    } else {
      showStatus('Error: ' + response);
    }
  });
}


// ---

loadGraph(userId, graphId).then(d => {
  data = d;
  render();
});

// ---

// Helpers
let statusTimeout;
let showStatus = (msg) => {
  clearTimeout(statusTimeout);
  document.querySelector('#status').innerHTML = msg;
  statusTimeout = setTimeout(() => {
    document.querySelector('#status').innerHTML = "";
  }, 5000);
}