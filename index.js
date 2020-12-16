self.uconnect = (function (exports) {
  'use strict';

  /*! (c) Andrea Giammarchi - ISC */
  var self = {};
  self.CustomEvent = typeof CustomEvent === 'function' ? CustomEvent : function (__p__) {
    CustomEvent[__p__] = new CustomEvent('').constructor[__p__];
    return CustomEvent;

    function CustomEvent(type, init) {
      if (!init) init = {};
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, !!init.bubbles, !!init.cancelable, init.detail);
      return e;
    }
  }('prototype');
  var CustomEvent$1 = self.CustomEvent;

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

  var CONNECTED = 'connected';
  var DISCONNECTED = 'disconnected';
  var EVENT_LISTENER = 'EventListener';

  var listener = function listener(node, call, handler) {
    node[call + EVENT_LISTENER](CONNECTED, handler);
    node[call + EVENT_LISTENER](DISCONNECTED, handler);
  };

  var notifyObserved = function notifyObserved(nodes, type, wmin, wmout) {
    for (var length = nodes.length, i = 0; i < length; i++) {
      notifyTarget(nodes[i], type, wmin, wmout);
    }
  };

  var notifyTarget = function notifyTarget(node, type, wmin, wmout) {
    if (observed.has(node) && !wmin.has(node)) {
      wmout["delete"](node);
      wmin.set(node, 0);
      node.dispatchEvent(new CustomEvent$1(type));
    }

    notifyObserved(node.children || [], type, wmin, wmout);
  };
  /**
   * Attach a MutationObserver to a generic node and returns a UConnect instance.
   * @param {Node} root a DOM node to observe for mutations
   * @param {MutationObserver} MO a MutationObserver constructor (polyfilled in SSR)
   * @returns {UConnect} an utility to connect or disconnect nodes to observe.
   */


  var observe = function observe() {
    var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    var MO = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MutationObserver;
    var observed = new WeakMap(); // these two should be WeakSet but IE11 happens

    var wmin = new WeakMap();
    var wmout = new WeakMap();
    var mo = new MO(function (nodes) {
      for (var length = nodes.length, i = 0; i < length; i++) {
        var _nodes$i = nodes[i],
            removedNodes = _nodes$i.removedNodes,
            addedNodes = _nodes$i.addedNodes;
        notifyObserved(removedNodes, DISCONNECTED, wmout, wmin);
        notifyObserved(addedNodes, CONNECTED, wmin, wmout);
      }
    });
    mo.observe(root, {
      subtree: true,
      childList: true
    });
    return {
      connect: function connect(node) {
        var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (!handler.handleEvent) handler.handleEvent = handleEvent;
        listener(node, 'add', handler);
        observed.set(node, handler);
      },
      disconnect: function disconnect(node) {
        if (observed.has(node)) {
          listener(node, 'remove', observed.get(node));
          observed["delete"](node);
        }
      },
      kill: function kill() {
        mo.disconnect();
      }
    };
  };

  function handleEvent(event) {
    if (event.type in this) this[event.type](event);
  }

  exports.observe = observe;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
