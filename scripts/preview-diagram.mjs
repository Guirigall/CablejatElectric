// Exporta una vista SVG estàtica per revisar dibuixos i geometria, no captura de navegador.
import fs from 'node:fs';
import {translate} from '../dist/i18n.js';
import {modelNodes,activeEdges,defaults,enabled} from '../dist/data.js';
import {layoutDiagram,routeDiagram,artwork} from '../dist/diagram.js';
const c={...defaults};
const dark=process.argv[4]==='dark',lang=process.argv[5]||'ca',bg=dark?'#10232b':'#f8f9f5',title=dark?'#dfebe2':'#193c45',muted=dark?'#a5bfbb':'#64797d';
const layer=process.argv[2]||'nav',dest=process.argv[3]||'/tmp/bord-preview.svg';
const ns=modelNodes(c).filter(n=>n.layer===layer&&enabled(n.condition,c)),scene=layoutDiagram(ns),es=activeEdges(c,layer),routes=routeDiagram(scene,es);
const colors={positive:'#ce644d',negative:'#617784',charge:'#45877d',network:'#4b8db0',seatalk:'#be9c2a',sensor:'#8c75ad',rf:'#ad7950',gnss:'#508e8f',ac:'#9569a3',earth:'#78913b',solar:'#ba922f',permanent:'#be7641',nmea0183:'#4c80a0',isolation:'#6b8198',fivevolt:'#b68642',usbdata:'#709778'};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
let content=`<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}"><rect width="100%" height="100%" fill="${bg}"/>`;
for(const e of es){const r=routes.get(e.id);content+=`<path d="${r.d}" fill="none" stroke="${bg}" stroke-width="6"/><path d="${r.d}" fill="none" stroke="${colors[e.type]}" stroke-width="2" ${e.type==='isolation'?'stroke-dasharray="7 6"':''}/>`;}
for(const n of scene.nodes){const raw=fs.readFileSync(new URL('../dist/assets/components/'+(lang==='ca'?'':lang+'/')+artwork[n.id]+'.svg',import.meta.url),'utf8').replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');content+=`<g transform="translate(${n.x} ${n.y})"><text x="140" y="18" text-anchor="middle" font-family="DejaVu Sans" font-size="13" font-weight="bold" fill="${title}">${esc(translate(n.name,lang))}</text><text x="140" y="36" text-anchor="middle" font-family="DejaVu Sans" font-size="9" fill="${muted}">${esc(translate(n.sub,lang))}</text>`;
for(const e of es.filter(e=>e.from===n.id||e.to===n.id)){const r=routes.get(e.id),p=e.from===n.id?r.a:r.b;content+=`<path d="M${p.x-n.x} ${p.y-n.y} H140" fill="none" stroke="${colors[e.type]}" stroke-width="1.8"/>`;}
content+=`<svg x="30" y="43" width="220" height="125" viewBox="0 0 240 150">${raw}</svg></g>`;}
fs.writeFileSync(dest,content+'</svg>');
