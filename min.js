self.uconnect=function(e){"use strict";
/*! (c) Andrea Giammarchi - ISC */var n={};n.CustomEvent="function"==typeof CustomEvent?CustomEvent:function(e){return n[e]=new n("").constructor[e],n;function n(e,n){n||(n={});var t=document.createEvent("CustomEvent");return t.initCustomEvent(e,!!n.bubbles,!!n.cancelable,n.detail),t}}("prototype");var t=n.CustomEvent,o="connected",c="disconnected",i="EventListener",r=function(e,n,t){e[n+i](o,t),e[n+i](c,t)},u=function(e,n,t,o,c){for(var i=e.length,r=0;r<i;r++)s(e[r],n,t,o,c)},s=function(e,n,o,c,i){o.has(e)&&!c.has(e)&&(i.delete(e),c.set(e,0),e.dispatchEvent(new t(n))),u(e.children||[],n,o,c,i)};function a(e){e.type in this&&this[e.type](e)}return e.observe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:MutationObserver,t=new WeakMap,i=new WeakMap,s=new WeakMap,d=new n((function(e){for(var n=e.length,r=0;r<n;r++){var a=e[r],d=a.removedNodes,v=a.addedNodes;u(d,c,t,s,i),u(v,o,t,i,s)}}));return d.observe(e,{subtree:!0,childList:!0}),{connect:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};n.handleEvent||(n.handleEvent=a),r(e,"add",n),t.set(e,n)},disconnect:function(e){t.has(e)&&(r(e,"remove",t.get(e)),t.delete(e))},kill:function(){d.disconnect()}}},Object.defineProperty(e,"__esModule",{value:!0}),e}({});