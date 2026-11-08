// Proves d'interacció sobre DOM simulat; no substitueixen navegador ni Android.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const ids=new Map();
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.attributes={};this.dataset={};this.style={};this.listeners={};this._value='';this.hidden=false;this.checked=false;this.type='';this._html='';this.textContent='';}
 set value(v){this._value=String(v)}get value(){return this._value}
 get selectedOptions(){return [{textContent:this.value}]}
 set innerHTML(text){for(const n of this.querySelectorAll('*')){if(n.id)ids.delete(n.id)}this.children=[];this._html=text;parse(text,this)}get innerHTML(){return this._html}
 setAttribute(key,value){this.attributes[key]=String(value);if(key==='id'){this.id=value;ids.set(value,this)}if(key==='class')this.className=value;if(key==='value')this.value=value;if(key==='type')this.type=value;if(key==='checked')this.checked=true;if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;}
 getAttribute(k){return this.attributes[k]}
 removeAttribute(k){delete this.attributes[k]}
 append(...els){this.children.push(...els);for(const e of els)e.parentElement=this}
 replaceChildren(...els){for(const n of this.querySelectorAll('*')){if(n.id)ids.delete(n.id)}this.children=[];this.append(...els)}
 addEventListener(name,fn){this.listeners[name]=fn}
 querySelectorAll(selector){const all=this.children.flatMap(c=>[c,...c.querySelectorAll('*')]);return all.filter(e=>matches(e,selector))}
 scrollIntoView(){}click(){this.onclick?.()}
}
function matches(e,s){if(s==='*')return true;if(s.startsWith('#'))return e.id===s.slice(1);if(s.startsWith('.'))return (e.className||'').split(' ').includes(s.slice(1));if(s.startsWith('[')){const [key,val]=s.slice(1,-1).split('=');return e.attributes[key]!==undefined&&(val===undefined||e.attributes[key]===val.replace(/["']/g,''))}return e.tagName===s}
function parse(text,parent){for(const m of text.matchAll(/<([a-zA-Z][\w-]*)(\s[^<>]*?)?\s*\/?>/g)){const e=new Element(m[1]);for(const a of (m[2]||'').matchAll(/([\w-]+)(?:="([^"]*)"|='([^']*)')?/g)){e.setAttribute(a[1],a[2]??a[3]??'')}parent.append(e)}}
const root=new Element('body');parse(fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),root);
const queryAll=s=>{const spaced=s.indexOf(' ');if(spaced>0){const parent=ids.get(s.slice(1,spaced));return parent?.querySelectorAll(s.slice(spaced+1))||[]}return root.querySelectorAll(s)};
globalThis.document={querySelector:s=>s.startsWith('#')?ids.get(s.slice(1)):queryAll(s)[0],querySelectorAll:queryAll,createElementNS:(_,t)=>new Element(t),createElement:t=>new Element(t)};
globalThis.window={addEventListener(){},print(){}};globalThis.matchMedia=()=>({matches:false});Object.defineProperty(globalThis,'navigator',{value:{},configurable:true});
const store=new Map();Object.defineProperty(globalThis,'localStorage',{value:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},configurable:true});
await import('../dist/app.js');
const get=id=>{const e=ids.get(id);assert.ok(e,'Element absent: '+id);return e};
function change(id,value){const e=get(id);if(e.type==='checkbox')e.checked=value;else e.value=value;e.listeners.change?.();e.onchange?.()}
test('Inici amb i40, dades i connexions inspeccionables; canvis de perfil alteren ruta GPS',()=>{
 assert.ok(get('detail').innerHTML.includes('Raymarine i40'));
 assert.ok(get('diagram').children.length>15);
 const images=get('diagram').querySelectorAll('image');assert.ok(images.length>=9);assert.ok(images.some(n=>n.getAttribute('href')==='./assets/components/i40-bidata.svg'));
 const wires=get('diagram').querySelectorAll('path').filter(p=>(p.className||'').includes('edge-visible'));assert.ok(wires.length>0);assert.ok(wires.every(p=>!/[CQAL]/.test(p.getAttribute('d'))));
 assert.ok(get('detail').innerHTML.includes('assets/components/i40-bidata.svg'));
 change('vhf','0183');change('route','gps');get('next').onclick();get('next').onclick();
 assert.ok(get('detail').innerHTML.includes('CONNEXIÓ n12'));assert.ok(get('detail').innerHTML.includes('TX+ / TX−'));
 change('vhf','ray');assert.ok(!get('detail').innerHTML.includes('CONNEXIÓ n12'));
});
test('Recorregut sentina, controls, anotacions i calculadora DC',()=>{
 change('route','bilge');change('main',false);change('water',true);
 assert.ok(get('scenarioResult').innerHTML.includes('funciona amb el general OFF'));
 get('elementNote').value='<b>Model per confirmar</b>';get('elementNote').oninput();
 const stored=JSON.parse(store.get('bord-project-v1'));assert.equal(stored.notes.d21,'<b>Model per confirmar</b>');
 const inputs=get('detail').querySelectorAll('[data-cable]');
 for(const [key,value]of Object.entries({length:10,current:5,area:2.5})){const e=inputs.find(e=>e.dataset.cable===key);e.value=value;e.oninput()}
 assert.ok(get('calcResult').textContent.includes('0.700 V'));
 get('next').onclick();get('previous').onclick();assert.ok(get('detail').innerHTML.includes('&lt;b&gt;Model per confirmar&lt;/b&gt;'));
 change('bilgeMode','off');assert.ok(get('scenarioResult').innerHTML.includes('aturada'));
});
test('Biblioteca, llista de connexions, navegació i zoom',()=>{
 assert.equal(get('connectorGrid').querySelectorAll('article').length,10);
 const listButton=queryAll('[data-page]').find(b=>b.dataset.page==='list');listButton.onclick();
 assert.ok(!get('list').hidden);assert.ok(get('connectionRows').innerHTML.includes('PL-259'));
 get('connectionRows').querySelectorAll('[data-open-edge]')[0].onclick();assert.equal(get('atlas').hidden,false);
 const width=get('diagram').style.width;get('zoomIn').onclick();assert.notEqual(get('diagram').style.width,width);get('zoomReset').onclick();assert.equal(get('diagram').style.width,'100%');
});

test('Transformador i aïllador exclusius; recorregut per primari i secundari',()=>{
 change('transformer',true);change('route','shore');
 get('next').onclick();get('next').onclick();get('next').onclick();
 assert.ok(get('detail').innerHTML.includes('CONNEXIÓ tmag'));
 assert.ok(get('detail').innerHTML.includes('No és un cable'));
 assert.ok(get('isolationSummary').textContent.includes('no substitueix un SPD'));
 change('galvanic',true);assert.equal(get('transformer').checked,false);
 assert.equal(get('galvanic').checked,true);
 change('transformer',true);assert.equal(get('galvanic').checked,false);
});

test('Tema i llengua no esborren el muntatge i carreguen els dibuixos traduïts',()=>{
 const old=store.get('bord-project-v1');
 get('theme').value='dark';get('theme').onchange();assert.equal(store.get('bord-theme'),'dark');
 get('language').value='en';get('language').onchange();
 assert.ok(get('diagram').querySelectorAll('image').every(e=>e.getAttribute('href').includes('/en/')));
 assert.equal(store.get('bord-project-v1'),old);
 get('language').value='es';get('language').onchange();assert.ok(get('diagram').querySelectorAll('image').every(e=>e.getAttribute('href').includes('/es/')));
 get('language').value='ca';get('language').onchange();
 change('route','gas');get('next').onclick();assert.ok(get('detail').innerHTML.includes('CONNEXIÓ g2'));
 change('gasAlarm',false);assert.equal(get('route').value,'');assert.ok(!get('diagram').querySelectorAll('image').some(e=>e.getAttribute('href').includes('gas-alarm')));
});

test('Fitxa de cable: càlcul de secció, persistència de terminals i llista',()=>{
 change('route','bilge');
 let fields=get('detail').querySelectorAll('[data-cable]');
 for(const [key,value] of Object.entries({length:10,current:5,voltage:12,percent:3,wireType:'Marí escollit',gauge:'6 mm²',connectorA:'M8 confirmat',connectorB:'M6 confirmat'})){
  const input=fields.find(e=>e.dataset.cable===key);assert.ok(input,key);input.value=value;input.oninput();
 }
 assert.ok(get('sectionResult').textContent.includes('4.86 mm²'));
 assert.ok(get('sectionResult').textContent.includes('6 mm²'));
 const saved=JSON.parse(store.get('bord-project-v1')).cables.d21;assert.equal(saved.connectorB,'M6 confirmat');
 get('next').onclick();get('previous').onclick();
 fields=get('detail').querySelectorAll('[data-cable]');assert.equal(fields.find(e=>e.dataset.cable==='wireType').value,'Marí escollit');
 const listButton=queryAll('[data-page]').find(b=>b.dataset.page==='list');listButton.onclick();
 assert.ok(get('connectionRows').innerHTML.includes('M8 confirmat'));
});
