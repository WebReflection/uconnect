self.uconnect=function(e){"use strict";
/*! (c) Andrea Giammarchi - ISC */var n={};n.CustomEvent="function"==typeof CustomEvent?CustomEvent:function(e){return n[e]=new n("").constructor[e],n;function n(e,n){n||(n={});var t=document.createEvent("CustomEvent");return t.initCustomEvent(e,!!n.bubbles,!!n.cancelable,n.detail),t}}("prototype");var t=n.CustomEvent,o="connected",c="disconnected",i="EventListener",r=function(e,n,t){e[n+i](o,t),e[n+i](c,t)};function u(e){e.type in this&&this[e.type](e)}return e.observe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"childNodes",i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:MutationObserver,s=new WeakMap,d=new WeakMap,v=new WeakMap,a=function(e){return s.has(e)},l=function(e){a(e)&&(r(e,"remove",s.get(e)),s.delete(e))},f=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};l(e),n.handleEvent||(n.handleEvent=u),r(e,"add",n),s.set(e,n)},h=function(e,n,t,o){for(var c=e.length,i=0;i<c;i++)E(e[i],n,t,o)},E=function(e,o,c,i){a(e)&&!c.has(e)&&(i.delete(e),c.set(e,0),e.dispatchEvent(new t(o))),h(e[n]||[],o,c,i)},m=new i((function(e){for(var n=e.length,t=0;t<n;t++){var i=e[t],r=i.removedNodes,u=i.addedNodes;h(r,c,s,v),h(u,o,s,d)}}));return m.observe(e,{subtree:!0,childList:!0}),{has:a,connect:f,disconnect:l,kill:function(){m.disconnect()}}},Object.defineProperty(e,"__esModule",{value:!0}),e}({});