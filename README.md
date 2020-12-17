# <em>µ</em>connect

A modern take at [disconnected](https://github.com/WebReflection/disconnected#readme) module, dropping IE < 11 support and providing a much better API.

```js
import {observe} from 'uconnect';

const observer = observe(
  root = document,      // the default root node to observe
  parse = 'childNodes', // the kind of nodes to parse: childNodes/children
  CE = CustomEvent      // the default Event/CustomEvent constructor to use
  MO = MutationObserver // the default MutationObserver constructor to use
);

observe.connect(node, {
  connected(event) {
    // node is connected
    console.log(`node is ${event.type}`);
  },
  disconnected(event) {
    // node is disconnected
    console.log(`node is ${event.type}`);
  }
});

// will trigger connected(event)
document.body.appendChild(node);

setTimeout(() => {
  // will trigger disconnect(event)
  node.remove();

  // will stop observing this specific node
  // after removing connecetd/disconnected listeners
  observer.disconnect(node);

  // will stop observing all nodes
  // and disconnect the MutationObserver
  observer.kill();
});

```
