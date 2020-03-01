import { getNodeIndexFromData, getNodeElement } from './nodes.js';

let resizeNode = (target, nodeId, data, setData, render,save) => {
  // get size
  let w = target.style.width;
  let h = target.style.height;
  // compare if changed
  if (w == '100%' && h == '100%') return;
  let nId = getNodeIndexFromData(nodeId, data);
  // snap to em
  // set new size data
  data.nodes[nId].size.x = Math.round(parseInt(w)/parseFloat(getComputedStyle(target).fontSize));
  data.nodes[nId].size.y = Math.round(parseInt(h)/parseFloat(getComputedStyle(target).fontSize));
  let el = getNodeElement(nodeId);

  setData(data);
  render();
  save(data); // TODO: is passing save around the best option?
}

export { resizeNode };