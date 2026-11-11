// Traçat de cables en segon pla (vegeu prewarm a app.js).
import {routeDiagram} from './diagram.js';
self.onmessage=event=>{const {key,scene,edges}=event.data;self.postMessage({key,geometry:routeDiagram(scene,edges)})};
