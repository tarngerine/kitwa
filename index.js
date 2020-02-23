let userId = '696969';

// Data - Default graph data structure
let dataGraph = {
  id: '1',
  nodes: [],
  userId: userId,
}

let dataNodes = [];

// Data - create new node data structure
let newNode = () => {
  return {
    content: "Start writing!",
    type: "text",
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    id: uuidv4(),
    userId: '696969',
  }
}

// Event - Add new node
let addNode = () => {
  let n = newNode();
  dataNodes.push(n);
  dataGraph.nodes.push(n.id);
  render(dataGraph);
}

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
let render = (graph) => {
  let app = document.querySelector('#app');
  graph.nodes.forEach(nodeId => {
    let node = dataNodes.find(n => n.id == nodeId);
    // Update existing nodes
    let n = app.querySelector(`[data-d-id="${node.id}"]`);
    if (n !== null) {
      let c = n.querySelector('[data-d-content]');
      if (c.value !== node.content) {
        c.value = node.content;
      }
      return;
    }

    // Add nodes that don't exist
    let t = templates[node.type].cloneNode(true);
    t.setAttribute('data-d-id', node.id);
    t.setAttribute('data-d-type', node.type);
    t.querySelector('[data-d-content]').value = node.content;
    app.appendChild(t);
  });
}
render(dataGraph);

// Event - Autosave
let saveTimeout;
let save = target => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    let n = target.parentNode;
    // Get parent-most node which has ID
    while (n.attributes['data-d-id'] == null) {
      n = n.parentNode;
    }
    // Find the node in data, diff & update it
    let oldIndex = dataNodes.findIndex(node =>
      node.id == n.attributes['data-d-id'].value);
    if (dataNodes[oldIndex].content !== target.value) {
      dataNodes[oldIndex].content = target.value
    }
    showStatus('Saved!');
    console.log(dataGraph)
  }, 1000);
}

// Backend
let sync = () => {

}

// Helpers
let statusTimeout;
let showStatus = (msg) => {
  clearTimeout(statusTimeout);
  document.querySelector('#status').innerHTML = msg;
  statusTimeout = setTimeout(() => {
    document.querySelector('#status').innerHTML = "";
  }, 5000);
}

// Helpers from the web

let uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}