let userId = '696969';


// Data - Starting data graph
let data = {};

let load = (renderCallback) => {
  fetch('https://julius-kitwa.builtwithdark.com/load', {
    method: 'post',
    body: JSON.stringify({
      userId: userId
    })
  }).then(response => response.json())
  .then(d => {
    console.log(d)
    if (d.status !== 200) { throw(d.status) }
    data = d;
    renderCallback(data.graph);
  })
  .catch(err => {
    console.log('error code: ' + err);
    data = {
      graph: {
        graphId: uuidv4(),
        nodes: [],
        userId: userId,
        updated: new Date(),
      },
      nodes: []
    };
    renderCallback(data.graph);
  });
}

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
    nodeId: uuidv4(),
    userId: '696969',
    updated: new Date(),
  }
}

// Event - Add new node
let addNode = () => {
  let n = newNode();
  data.nodes.push(n);
  data.graph.nodes.push(n.nodeId);
  render(data.graph);
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
    let node = data.nodes.find(n => n.nodeId == nodeId);
    console.log(data.nodes)

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
    t.querySelector('[data-d-content]').value = node.content;
    app.appendChild(t);
  });
}

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
    let nodeIndex = data.nodes.findIndex(node =>
      node.nodeId == n.attributes['data-d-id'].value);
    if (data.nodes[nodeIndex].content !== target.value) {
      data.nodes[nodeIndex].content = target.value;
      data.nodes[nodeIndex].updated = new Date();
    }

    let lastUpdatedNode = data.nodes.reduce((newest, node) => (newest.updated || 0) > node.updated ? newest : node, data.graph.updated);
    data.graph.updated = lastUpdatedNode.updated;

    sync((response) => {
      if (response.status == 200) {
        showStatus('Saved!');
      }
    });
  }, 1000);
}

// Backend - sync data upwards
let sync = (callback) => {
  // Send latest update, allow server to resolve conflicts, and send back the latest

  // OR send latest operation(s), and get a confirm back when an operation has been processed

  // OR lock by node, maintain lock list on server, dont allow edit on client until it's confirmed that you have ownership
  // when do you decide to unlock it? inactivity after x minutes (replicate that on clientside? last edit time!
  // if last edit time > 5 minutes, re-request lock)

  fetch('https://julius-kitwa.builtwithdark.com/save', {
    method: 'post',
    body: JSON.stringify(data)
  }).then(response => response.json())
  .then(d => {
    console.log('response:')
    console.log(d)
    callback(d)
  })
  .catch(err => console.log(err));
}

// ---

load(render);

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

// Helpers from the web

let uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}