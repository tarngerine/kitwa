import { uuid } from './uuid.js';

class SketchNode {
  constructor() {
    this.data = this.createNewSketchNode();
  }

  get getData() {
    return this.data;
  }

  // TODO: is there a better way to default than a static size here? how can i make this the size of the browser?
  createNewSketchNode (size = {
    x: 100,
    y: 100,
    z: 1
  }) {
    return {
      content: [],
      type: "sketch",
      pos: {
        x: 0,
        y: 0,
        z: 0
      },
      size: {
        x: size.x,
        y: size.y,
        z: size.z,
      },
      nodeId: uuid(),
      userId: '696969',
      updated: new Date(),
    }
  }

  static render() {

  }
}

export {SketchNode}