import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {nodes,defaults,activeEdges,enabled} from '../dist/data.js';
import {layoutDiagram,routeDiagram,artwork,artFiles} from '../dist/diagram.js';
function segments(r){return r.points.slice(1).map((b,i)=>({a:r.points[i],b,id:r.id}))}
function overlap(u,v){if(u.a.y===u.b.y&&v.a.y===v.b.y&&u.a.y===v.a.y)return Math.min(Math.max(u.a.x,u.b.x),Math.max(v.a.x,v.b.x))>Math.max(Math.min(u.a.x,u.b.x),Math.min(v.a.x,v.b.x));if(u.a.x===u.b.x&&v.a.x===v.b.x&&u.a.x===v.a.x)return Math.min(Math.max(u.a.y,u.b.y),Math.max(v.a.y,v.b.y))>Math.max(Math.min(u.a.y,u.b.y),Math.min(v.a.y,v.b.y));return false}
test('Tots els equips tenen una il·lustració SVG local i les famílies principals són diferents',()=>{
 for(const n of nodes){assert.ok(artwork[n.id],n.id);assert.ok(artFiles.includes('./assets/components/'+artwork[n.id]+'.svg'))}
 for(const file of artFiles){const text=fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8');assert.ok(text.startsWith('<svg'));assert.ok(!text.includes('<script'));assert.ok(!text.includes('https://'));}
 const ids=['house','shunt','vhf','bilge','i40','solar','engine','rcd'];assert.equal(new Set(ids.map(id=>artwork[id])).size,ids.length);
});
const seen=new Set();
const profiles={initial:defaults,basic:{...defaults,networkBridge:false,plotter:false},expanded:{...defaults,networkBridge:true,plotter:true},full:{...defaults,vhf:'0183',ais:'external',galvanic:true,transformer:false},direct:{...defaults,transformer:false},modern:{...defaults,vhf:'n2k',ais:'builtin',pilot:false,windlass:false},legacyDirect:{...defaults,vhf:'0183'},modernExternal:{...defaults,vhf:'n2k',ais:'external'},unknownExternal:{...defaults,ais:'external'},windlassOnly:{...defaults,pilot:false},pilotOnly:{...defaults,windlass:false},gasOnly:{...defaults,computer:false},computerOnly:{...defaults,gasAlarm:false},noAux:{...defaults,gasAlarm:false,computer:false}};
for(const [profile,c]of Object.entries(profiles))for(const layer of ['dc','nav','ac']){
 const key=layer+':'+activeEdges(c,layer).map(e=>e.id).join(',');if(seen.has(key))continue;seen.add(key);test(`${profile} / ${layer}: cablejat a 90°, sense passar per equips ni superposar conductors`,()=>{
 const ns=nodes.filter(n=>n.layer===layer&&enabled(n.condition,c)),scene=layoutDiagram(ns),es=activeEdges(c,layer),routes=routeDiagram(scene,es),all=[];
 assert.equal(routes.size,es.length);const ports=new Set();
 for(const e of es){const r=routes.get(e.id);assert.equal(r.shared,false,e.id);assert.ok(!/[CQAL]/.test(r.d),r.d);
  for(const [id,p]of [[e.from,r.a],[e.to,r.b]]){const key=id+':'+p.x+':'+p.y;assert.ok(!ports.has(key),'Terminal duplicat '+key);ports.add(key)}
  for(const {a,b}of segments(r)){assert.ok(a.x===b.x||a.y===b.y,e.id);for(const n of scene.nodes){const crosses=a.x===b.x?a.x>n.x&&a.x<n.x+n.width&&Math.max(a.y,b.y)>n.y&&Math.min(a.y,b.y)<n.y+n.height:a.y>n.y&&a.y<n.y+n.height&&Math.max(a.x,b.x)>n.x&&Math.min(a.x,b.x)<n.x+n.width;assert.ok(!crosses,e.id+' travessa '+n.id)}}
  all.push(...segments(r));
 }
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++)if(all[i].id!==all[j].id)assert.ok(!overlap(all[i],all[j]),'Superposició '+all[i].id+' / '+all[j].id);
});

}
