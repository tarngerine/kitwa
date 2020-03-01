import { loadGraph, saveGraph } from './sync.js';
import { focusNode } from './focus.js';
import { uuid } from './uuid.js';

let userId = '696969';

// Data - Starting data graph
let data = {};
let setData = d => data = d;
let getData = _ => data;
let graphId = 123;

// Data - create new node data structure
let createNewNode = () => {
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
  let n = createNewNode();
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
    if (n !== null) {
      let c = n.querySelector('[data-d-content]');
      if (c.value !== node.content) {
        c.value = node.content;
      }
      return;
    }

    // Add nodes that don't exist
    let t = templates[node.type].cloneNode(true);
    t.setAttribute('data-d-id', node.nodeId);
    t.setAttribute('data-d-type', node.type);
    let content = t.querySelector('[data-d-content]');
    content.value = node.content;
    content.addEventListener('keyup', event => saveContent(event.target, node.nodeId, getData, setData));
    app.appendChild(t);

    if (callback) callback();
  });
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