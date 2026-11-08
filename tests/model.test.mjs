import test from 'node:test';
import assert from 'node:assert/strict';
import {nodes,edges,activeEdges,enabled,defaults,powerState,voltageDrop,networkStatus,layers,connectors,transducers,modelNodes,cableSpec,minimumSection} from '../dist/data.js';
import {validateProject} from '../dist/project.js';
const fresh=()=>({...structuredClone(defaults),vhf:'unknown',instrument:'Bidata',ais:'none',networkBridge:true,plotter:true});
function connected(es,start,end){const visited=new Set([start]),queue=[start];while(queue.length){const n=queue.shift();for(const e of es){const next=e.from===n?e.to:e.to===n?e.from:null;if(next===end)return true;if(next&&!visited.has(next)){visited.add(next);queue.push(next);}}}return visited.has(end)}
test('Equips i connexions únics; ports i fonts definits, extrems a la mateixa capa',()=>{
 assert.equal(new Set(nodes.map(n=>n.id)).size,nodes.length);assert.equal(new Set(edges.map(e=>e.id)).size,edges.length);
 for(const e of edges){const a=nodes.find(n=>n.id===e.from),b=nodes.find(n=>n.id===e.to);assert.ok(a&&b,e.id);assert.equal(a.layer,e.layer);assert.equal(b.layer,e.layer);assert.ok(e.a&&e.b&&e.cable&&e.connector&&e.protection);}
 for(const n of nodes){assert.ok(layers[n.layer]);assert.ok(n.x+270<=layers[n.layer].width);assert.ok(n.y+96<=layers[n.layer].height)}
 assert.equal(connectors.length,10);assert.equal(transducers.Depth.length,3);assert.equal(transducers.Speed.length,5);
});
test('192 perfils: sense arestes a equips absents; RF i dades seleccionades correctament',()=>{
 let count=0;
 for(const vhf of ['unknown','ray','n2k','0183'])for(const ais of ['none','builtin','external'])for(const windlass of [true,false])for(const pilot of [true,false])for(const galvanic of [true,false])for(const transformer of [true,false]){
 const c={...fresh(),vhf,ais,windlass,pilot,galvanic,transformer},es=activeEdges(c),ids=new Set(es.map(e=>e.id));
 for(const e of es)for(const id of [e.from,e.to])assert.equal(enabled(nodes.find(n=>n.id===id).condition,c),true,e.id);
 assert.equal(ids.has('r2'),ais!=='external');assert.equal(ids.has('r3'),ais==='external');assert.equal(ids.has('n4'),['ray','n2k'].includes(vhf));assert.equal(ids.has('n12'),vhf==='0183');
 const trunk=es.filter(e=>e.type==='network');assert.ok(connected(trunk,'term1','term2'));assert.equal(es.filter(e=>e.to==='term1'||e.to==='term2').length,2);
 const earth=es.filter(e=>e.type==='earth');for(const load of ['charger','heater','sockets'])assert.equal(connected(earth,'shore',load),!transformer);
 if(transformer){assert.ok(connected(earth,'shore','transformer'));assert.ok(connected(earth,'secondary','charger'));assert.ok(!ids.has('a2'));assert.ok(!ids.has('a4'));assert.ok(!ids.has('a5'));assert.ok(ids.has('tmag'));}else assert.ok(ids.has('a2'));
 count++;}assert.equal(count,192);
});
test('Retorns serveis i carregadors no bypass del shunt; motor fora del shunt',()=>{
 const negative=edges.filter(e=>e.type==='negative');
 assert.deepEqual(negative.filter(e=>e.to==='house'||e.from==='house').map(e=>e.id),['d4']);
 for(const id of ['fridge','bilge','mppt','dcdc'])assert.ok(connected(negative.filter(e=>e.id!=='d4'),id,'minus'));
 assert.ok(connected(negative.filter(e=>e.from!=='shunt'&&e.to!=='shunt'),'motor','starter'));
 assert.ok(edges.find(e=>e.id==='dsense').protection.includes('fusible'));
});
test('Sentina funciona amb general OFF; OFF manteniment guanya a aigua, MANUAL a sensor',()=>{
 const c={...fresh(),main:false,water:true};assert.equal(powerState(c).services,false);assert.equal(powerState(c).bilge,true);
 c.bilgeMode='off';assert.equal(powerState(c).bilge,false);c.water=false;c.bilgeMode='manual';assert.equal(powerState(c).bilge,true);
 c.engine=true;c.shore=true;c.solar=true;assert.equal(powerState(c).charging.length,3);
 assert.ok(!connected(edges.filter(e=>['d21','d22','d23'].includes(e.id)),'main','bilge'));
});
test('Caiguda DC amb recorregut anada/tornada, zeros i rebuig de dades invàlides',()=>{
 const r=voltageDrop({length:10,current:5,area:2.5});assert.ok(Math.abs(r.drop-.7)<1e-10);assert.ok(Math.abs(r.percent-5.8333333)<1e-5);
 assert.equal(voltageDrop({length:10,current:0,area:2.5}).drop,0);
 for(const patch of [{area:0},{current:-1},{voltage:0},{length:NaN}])assert.throws(()=>voltageDrop({length:10,current:5,area:2.5,...patch}));
});
test('Importacions validades, notes preservades com a dades i camps desconeguts ignorats',()=>{
 const p=validateProject({vhf:'0183',notes:{i40:'<script>alert(1)</script>',unknown:'x'},cables:{d1:{length:4,current:10,area:2.5,voltage:12,fuse:'Per confirmar'}}});
 assert.equal(p.notes.i40,'<script>alert(1)</script>');assert.ok(!('unknown'in p.notes));assert.equal(p.cables.d1.area,2.5);assert.deepEqual(validateProject(JSON.parse(JSON.stringify(p))),p);
 for(const input of [null,[],{vhf:'fake'},{ais:'fake'},{main:'true'},{cables:{d1:{area:0}}},{cables:{d1:{current:Infinity}}}])assert.throws(()=>validateProject(input));
 assert.ok(networkStatus(fresh()).some(s=>s.includes('model de VHF')));assert.ok(networkStatus({...fresh(),vhf:'ray',ais:'builtin'}).some(s=>s.includes('Ray73')));
});

test('Transformador: migració compatible i opcions exclusives',()=>{
 assert.equal(validateProject({galvanic:true}).transformer,false);
 assert.equal(validateProject({transformer:true}).galvanic,false);
 assert.throws(()=>validateProject({transformer:true,galvanic:true}));
 const es=activeEdges({...fresh(),transformer:true});
 const conductive=es.filter(e=>e.layer==='ac'&&e.type!=='isolation'&&e.type!=='charge');
 assert.ok(!connected(conductive,'shore','secondary'));
 assert.ok(connected(conductive,'secondary','charger'));
 assert.equal(es.find(e=>e.id==='tmag').type,'isolation');
});

test('GX2400E i dos i40: SeaTalk directe o ampliació, sense equips redundants',()=>{
 const c={...structuredClone(defaults),networkBridge:false,plotter:false}, ns=modelNodes(c).filter(n=>enabled(n.condition,c)), ids=new Set(ns.map(n=>n.id)), es=activeEdges(c), ei=new Set(es.map(e=>e.id));
 assert.equal(c.vhf,'gx2400');assert.equal(c.instrument,'BidataWind');
 for(const id of ['vhf','i40','i40Wind','windTransducer','st1bus','st1power'])assert.ok(ids.has(id),id);
 for(const id of ['gps','converter','backbone','plotter','splitter'])assert.ok(!ids.has(id),id);
 for(const id of ['windSensor','st-bidata','st-wind','st-feed','r2'])assert.ok(ei.has(id),id);
 const expanded=activeEdges({...c,networkBridge:true,plotter:true});const xi=new Set(expanded.map(e=>e.id));
 for(const id of ['st-converter','gxn2k','n6'])assert.ok(xi.has(id),id);
 assert.ok(!xi.has('st-feed'));assert.ok(!xi.has('n5'));
 assert.equal(validateProject({vhf:'gx2400',ais:'external'}).ais,'builtin');
 assert.equal(validateProject({instrument:'BidataWind',plotter:true}).networkBridge,true);
});

test('Axiom+ instal·lat: dades via convertidor, AIS i ramal DC propi',()=>{
 const es=activeEdges(defaults), ids=new Set(es.map(e=>e.id));
 for(const id of ['n6','npower1','gxn2k','st-converter','n3','n8','n9','n10'])assert.ok(ids.has(id),id);
 assert.ok(!ids.has('st-feed'));assert.ok(modelNodes(defaults).find(n=>n.id==='plotter').name.includes('Axiom+'));
 assert.ok(es.find(e=>e.id==='npower1').connector.includes('SYSTEM MINUS'));
 assert.ok(es.find(e=>e.id==='n6').connector.includes('DeviceNet'));
 assert.ok(!es.some(e=>['transducer','windTransducer'].includes(e.from)&&e.to==='plotter'));
});

test('Fitxes de tots els cables i mínim DC sense inventar ampacitat',()=>{
 for(const e of edges){const s=cableSpec(e);for(const field of ['type','size','connectorA','connectorB'])assert.ok(typeof s[field]==='string'&&s[field].length,e.id+' '+field);}
 assert.ok(cableSpec(edges.find(e=>e.id==='tmag')).type.includes('no hi ha cable'));
 assert.ok(cableSpec(edges.find(e=>e.id==='r2')).size.includes('50 Ω'));
 assert.ok(cableSpec(edges.find(e=>e.id==='n6')).type.includes('premuntat'));
 assert.ok(cableSpec(edges.find(e=>e.id==='p4')).type.includes('5 V'));
 assert.deepEqual(minimumSection({length:10,current:5,voltage:12,percent:3}),{minimum:4.861111111111112,standard:6});
 assert.equal(minimumSection({length:0,current:0}).minimum,0);
 assert.equal(minimumSection({length:100,current:1000}).standard,null);
 for(const patch of [{length:-1},{current:NaN},{percent:0},{percent:101},{voltage:0}])assert.throws(()=>minimumSection({length:10,current:5,...patch}));
 const c=validateProject({cables:{d1:{wireType:'H07V-K',gauge:'16 mm²',connectorA:'M8',connectorB:'M10',percent:3}}});
 assert.equal(c.cables.d1.connectorA,'M8');assert.equal(c.cables.d1.gauge,'16 mm²');assert.deepEqual(validateProject(c),c);
 assert.throws(()=>validateProject({cables:{d1:{percent:101}}}));
});
