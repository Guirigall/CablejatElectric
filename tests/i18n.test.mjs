import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import dictionary from '../dist/translations.js';
import {translate,setLanguage,translateDOM,initLanguages} from '../dist/i18n.js';
import {nodes,edges,defaults,powerState,activeEdges,layers,connectors,sources,transducers,modelNodes,cableSpec} from '../dist/data.js';
import {artFiles} from '../dist/diagram.js';
test('Catàleg complet en les tres llengües, incloses totes les fitxes tècniques',()=>{
 const required=JSON.parse(fs.readFileSync(new URL('../locale/required.json',import.meta.url),'utf8'));
 assert.ok(Object.keys(dictionary).length>900);
 const live=[...edges.flatMap(e=>Object.values(cableSpec(e))),...modelNodes(defaults).flatMap(n=>[n.name,n.sub,n.detail,...n.ports]),...activeEdges(defaults).flatMap(e=>[e.label,e.a,e.b,e.cable,e.connector,e.protection]),...nodes.flatMap(n=>[n.name,n.sub,n.detail,...n.ports]),...edges.flatMap(e=>[e.label,e.a,e.b,e.cable,e.connector,e.protection]),...connectors.flatMap(c=>[c.name,c.family,c.desc,c.check]),...Object.values(layers).flatMap(l=>[l.name,l.title,l.sub]),...Object.values(sources).map(s=>s.name),...Object.values(transducers).flat(2)];
 for(const text of live)assert.ok(dictionary[text],text);
 for(const {text}of required)for(const lang of ['es','en'])assert.equal(translate(text,lang),dictionary[text][lang],text+' / '+lang);
 assert.equal(translate('Sensor de gas GLP','en'),'LPG gas sensor');
 assert.equal(translate('Raspberry Pi + dues webcams USB','es'),'Raspberry Pi + dos webcams USB');
 assert.equal(translate('Bomba de sentina','en'),'Bilge pump');
});
test('Tots els dibuixos i manifests tenen versió local per idioma',()=>{
 for(const file of artFiles)for(const lang of ['es','en'])assert.ok(fs.existsSync(new URL('../dist/'+file.replace('components/','components/'+lang+'/'),import.meta.url)));
 const gas=fs.readFileSync(new URL('../dist/assets/components/en/gas-alarm.svg',import.meta.url),'utf8');assert.ok(gas.includes('LPG'));assert.ok(!gas.includes('>GLP<'));
 for(const lang of ['ca','es','en']){const m=JSON.parse(fs.readFileSync(new URL('../dist/manifest'+(lang==='ca'?'':'.'+lang)+'.webmanifest',import.meta.url),'utf8'));assert.equal(m.lang,lang)}
 const md=fs.readFileSync(new URL('../README.md',import.meta.url),'utf8');for(const heading of ['## Català','## Español','## English'])assert.ok(md.includes(heading));
});
test('Alarma independent del general i Raspberry amb convertidor + hub autoalimentat',()=>{
 const c={...defaults,main:false};assert.equal(powerState(c).gasAvailable,true);assert.equal(powerState(c).computer,false);
 const es=activeEdges(c),gas=es.filter(e=>e.id.startsWith('g'));assert.ok(gas.some(e=>e.from==='house'&&e.to==='gasfuse'));assert.ok(!gas.some(e=>e.from==='panel'||e.from==='raspberry'));
 assert.equal(edges.find(e=>e.id==='p3').to,'raspberry');assert.equal(edges.find(e=>e.id==='p3').type,'fivevolt');
 for(const id of ['camera1','camera2'])assert.ok(es.some(e=>e.from==='usbhub'&&e.to===id&&e.type==='usbdata'));
 assert.equal(nodes.filter(n=>n.role==='camera').length,2);
 const without=activeEdges({...c,gasAlarm:false,computer:false});assert.ok(!without.some(e=>/^g\d|^p\d/.test(e.id)));
});
class El{
 constructor(tag,attrs={}){this.tagName=tag;this.attrs=attrs;this.parentElement=null;this.value=''}
 hasAttribute(k){return Object.hasOwn(this.attrs,k)}getAttribute(k){return this.attrs[k]}setAttribute(k,v){this.attrs[k]=v}
}
test('Canvi reversible de llengua, accessibilitat, marcadors i dades de l’usuari',()=>{
 const root=new El('HTML'),plain=new El('P'),user=new El('SPAN',{'data-user-text':''}),input=new El('INPUT',{placeholder:'Nom del veler',value:'Bateria de serveis'}),image=new El('IMG',{alt:'Dibuix orientatiu de Bomba de sentina'}),picker=new El('SELECT'),manifest=new El('LINK');
 const a={nodeType:3,nodeValue:'Bateria de serveis',parentElement:plain},b={nodeType:3,nodeValue:'Bateria de serveis',parentElement:user};
 const doc={documentElement:root,querySelector:s=>s==='#language'?picker:s==='link[rel=manifest]'?manifest:null,querySelectorAll:()=>[input,image],createTreeWalker(){let i=0;return {nextNode:()=>[a,b][i++]||null}}};
 globalThis.document=doc;Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem(){return null},setItem(){}}});
 initLanguages();setLanguage('en');assert.equal(a.nodeValue,'House battery');assert.equal(b.nodeValue,'Bateria de serveis');assert.equal(input.attrs.placeholder,'Boat name');assert.equal(input.attrs.value,'Bateria de serveis');assert.equal(image.attrs.alt,'Illustrative drawing of Bilge pump');assert.equal(root.lang,'en');assert.equal(manifest.attrs.href,'./manifest.en.webmanifest');
 setLanguage('es');assert.equal(a.nodeValue,'Batería de servicios');assert.equal(input.attrs.placeholder,'Nombre del velero');
 setLanguage('ca');assert.equal(a.nodeValue,'Bateria de serveis');assert.equal(input.attrs.placeholder,'Nom del veler');
});
test('Tema clar/fosc persistent i seguiment de la preferència del dispositiu',async()=>{
 const attrs={},picker={value:''},storage=new Map(),media={matches:true,addEventListener(_,fn){this.onchange=fn}};
 globalThis.document={documentElement:{setAttribute:(k,v)=>attrs[k]=v},querySelector:s=>s==='#theme'?picker:null};
 globalThis.matchMedia=()=>media;Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});
 const {initTheme,setTheme,getEffectiveTheme}=await import('../dist/theme.js');initTheme();assert.equal(attrs['data-theme'],'dark');setTheme('light');assert.equal(attrs['data-theme'],'light');assert.equal(storage.get('bord-theme'),'light');setTheme('dark');assert.equal(getEffectiveTheme(),'dark');setTheme('system');media.matches=false;media.onchange();assert.equal(attrs['data-theme'],'light');
});
test('Contrast del text al diagrama fosc',()=>{
 const css=fs.readFileSync(new URL('../dist/style.css',import.meta.url),'utf8'),block=css.match(/:root\[data-theme=dark\]\{([^}]+)\}/)[1];
 const vars=Object.fromEntries([...block.matchAll(/(--[\w-]+):(#[\da-f]+)/g)].map(m=>[m[1],m[2]]));
 const luminance=hex=>{const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
 for(const name of ['--node-title','--node-sub','--wire-label']){const a=luminance(vars[name]),b=luminance(vars['--diagram-bg']);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,name)}
});
