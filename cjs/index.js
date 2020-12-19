'use strict';
/**
 * @typedef {Object} Handler an object that handle events.
 * @property {(event: Event) => void} connected an optional method triggered when node is connected.
 * @property {(event: Event) => void} disconnected an optional method triggered when node is disconnected.
 */

/**
 * @typedef {Object} UConnect an utility to connect or disconnect nodes to observe.
 * @property {(node: Node, handler?: Handler) => void} connect a method to start observing a generic Node.
 * @property {(node: Node) => void} disconnect a method to stop observing a generic Node.
 * @property {() => void} kill a method to kill/disconnect the MutationObserver.
 */

/**
 * Attach a MutationObserver to a generic node and returns a UConnect instance.
 * @param {Node} root a DOM node to observe for mutations.
 * @param {string} parse the kind of nodes to parse: children, by default, or childNodes.
 * @param {Event} CE an Event/CustomEvent constructor (polyfilled in SSR).
 * @param {MutationObserver} MO a MutationObserver constructor (polyfilled in SSR).
 * @returns {UConnect} an utility to connect or disconnect nodes to observe.
 */
const observe = (root, parse, CE, MO) => {
  const observed = new WeakMap;

  // these two should be WeakSet but IE11 happens
  const wmin = new WeakMap;
  const wmout = new WeakMap;

  const has = node => observed.has(node);
  const disconnect = node => {
    if (has(node)) {
      listener(node, node.removeEventListener, observed.get(node));
      observed.delete(node);
    }
  };
  const connect = (node, handler) => {
    disconnect(node);
    if (!(handler || (handler = {})).handleEvent)
      handler.handleEvent = handleEvent;
    listener(node, node.addEventListener, handler);
    observed.set(node, handler);
  };

  const listener = (node, method, handler) => {
    method.call(node, 'disconnected', handler);
    method.call(node, 'connected', handler);
  };

  const notifyObserved = (nodes, type, wmin, wmout) => {
    for (let {length} = nodes, i = 0; i < length; i++)
      notifyTarget(nodes[i], type, wmin, wmout);
  };

  const notifyTarget = (node, type, wmin, wmout) => {
    if (has(node) && !wmin.has(node)) {
      wmout.delete(node);
      wmin.set(node, 0);
      node.dispatchEvent(new (CE || CustomEvent)(type));
    }
    notifyObserved(node[parse || 'children'] || [], type, wmin, wmout);
  };

  const mo = new (MO || MutationObserver)(nodes => {
    for (let {length} = nodes, i = 0; i < length; i++) {
      const {removedNodes, addedNodes} = nodes[i];
      notifyObserved(removedNodes, 'disconnected', wmout, wmin);
      notifyObserved(addedNodes, 'connected', wmin, wmout);
    }
  });
  mo.observe(root || document, {subtree: true, childList: true});

  return {has, connect, disconnect, kill() { mo.disconnect(); }};
};
exports.observe = observe;

function handleEvent(event) {
  if (event.type in this)
    this[event.type](event);
}
