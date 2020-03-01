let focusNode = (nodeId) => {
  document.querySelector(`[data-d-id="${nodeId}"]`).querySelector('textarea').focus();
}

export { focusNode };