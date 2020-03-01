
let createNewData = () => {
  return {
    graph: {
      graphId: uuidv4(),
      nodes: [],
      userId: userId,
      updated: new Date(),
    },
    nodes: []
  };
}

// Backend - Load data from server or provide default
let loadGraph = (userId, graphId) => {
  return fetch('https://julius-kitwa.builtwithdark.com/load', {
    method: 'post',
    body: JSON.stringify({
      userId: userId,
      graphId: graphId
    })
  }).then(response => response.json())
    .then(d => {
      if (d.status !== 200) { throw (d.status) }
      return d;
    })
    .catch(err => {
      console.log('error code: ' + err);
      return createNewData();
    });
}

// Backend - sync data upwards
let saveGraph = data => {
  // Send latest update, allow server to resolve conflicts, and send back the latest

  // OR send latest operation(s), and get a confirm back when an operation has been processed

  // OR lock by node, maintain lock list on server, dont allow edit on client until it's confirmed that you have ownership
  // when do you decide to unlock it? inactivity after x minutes (replicate that on clientside? last edit time!
  // if last edit time > 5 minutes, re-request lock)

  return fetch('https://julius-kitwa.builtwithdark.com/save', {
    method: 'post',
    body: JSON.stringify(data)
  }).then(response => response.json())
    .catch(err => {
      console.log(err)
      return err;
    });
}

export { loadGraph, saveGraph };