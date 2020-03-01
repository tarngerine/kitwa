import { getNodeElement } from './nodes.js';

let focusNode = (nodeId) => {
  getNodeElement(nodeId).querySelector('textarea').focus();
}

export { focusNode };