import CustomEvent from '@ungap/custom-event';

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

const CONNECTED = 'connected';
const DISCONNECTED = 'disconnected';
const EVENT_LISTENER = 'EventListener';

const listener = (node, call, handler) => {
  node[call + EVENT_LISTENER](CONNECTED, handler);
  node[call + EVENT_LISTENER](DISCONNECTED, handler);
};

/**
 * Attach a MutationObserver to a generic node and returns a UConnect instance.
 * @param {Node} root a DOM node to observe for mutations.
 * @param {string} parse the kind of nodes to parse: childNodes, by default, or children.
 * @param {MutationObserver} MO a MutationObserver constructor (polyfilled in SSR).
 * @returns {UConnect} an utility to connect or disconnect nodes to observe.
 */
export const observe = (
  root = document,
  parse = 'childNodes',
  MO = MutationObserver
) => {
  const observed = new WeakMap;

  // these two should be WeakSet but IE11 happens
  const wmin = new WeakMap;
  const wmout = new WeakMap;

  const has = node => observed.has(node);
  const disconnect = node => {
    if (has(node)) {
      listener(node, 'remove', observed.get(node));
      observed.delete(node);
    }
  };
  const connect = (node, handler = {}) => {
    disconnect(node);
    if (!handler.handleEvent)
      handler.handleEvent = handleEvent;
    listener(node, 'add', handler);
    observed.set(node, handler);
  };

  const notifyObserved = (nodes, type, wmin, wmout) => {
    for (let {length} = nodes, i = 0; i < length; i++)
      notifyTarget(nodes[i], type, wmin, wmout);
  };
  
  const notifyTarget = (node, type, wmin, wmout) => {
    if (has(node) && !wmin.has(node)) {
      wmout.delete(node);
      wmin.set(node, 0);
      node.dispatchEvent(new CustomEvent(type));
    }
    notifyObserved(node[parse] || [], type, wmin, wmout);
  };

  const mo = new MO(nodes => {
    for (let {length} = nodes, i = 0; i < length; i++) {
      const {removedNodes, addedNodes} = nodes[i];
      notifyObserved(removedNodes, DISCONNECTED, observed, wmout, wmin);
      notifyObserved(addedNodes, CONNECTED, observed, wmin, wmout);
    }
  });
  mo.observe(root, {subtree: true, childList: true});

  return {has, connect, disconnect, kill() { mo.disconnect(); }};
};

function handleEvent(event) {
  if (event.type in this)
    this[event.type](event);
}
