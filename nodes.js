let getNodeElement = nodeId => {
  return document.querySelector(`[data-d-id="${nodeId}"]`);
}

let getNodeIndexFromData = (nodeId, data) => {
  return data.nodes.findIndex(node => node.nodeId == nodeId);
}

export { getNodeIndexFromData, getNodeElement }