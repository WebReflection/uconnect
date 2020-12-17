# <em>µ</em>connect

<sup>**Social Media Photo by [JOHN TOWNER](https://unsplash.com/@heytowner) on [Unsplash](https://unsplash.com/)**</sup>

A modern take at [disconnected](https://github.com/WebReflection/disconnected#readme) module, dropping IE < 11 support and providing a much better API.

**[Live demo](https://codepen.io/WebReflection/pen/zYKwbgR?editors=0011)**

```js
import {observe} from 'uconnect';

const observer = observe(
  root = document,      // the default root node to observe
  parse = 'children',   // the kind of nodes to parse: children or childNodes
  CE = CustomEvent,     // the default Event/CustomEvent constructor to use
  MO = MutationObserver // the default MutationObserver constructor to use
);

const node = document.createElement('button');

observer.connect(node, {
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

  setTimeout(() => {
    // will stop observing this specific node
    // after removing connecetd/disconnected listeners
    observer.disconnect(node);

    // will stop observing all nodes
    // and disconnect the MutationObserver
    observer.kill();
  });
});
```
