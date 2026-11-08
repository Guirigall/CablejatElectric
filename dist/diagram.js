// Geometria visual independent de la topologia elèctrica.
export const artwork={gasfuse:'fuse-small',gasalarm:'gas-alarm',gasprobe:'gas-probe',piconverter:'pi-converter',raspberry:'raspberry',usbhub:'usb-hub',camera1:'webcam',camera2:'webcam',transformer:'isolation-transformer',primaryBreaker:'primary-breaker',secondary:'secondary-terminals',house:'battery',starter:'starter-battery',fmain:'fuse',main:'switch',panel:'panel',shunt:'shunt',minus:'busbar',lights:'navlights',cabin:'cabinlights',motor:'engine',dcdc:'dcdc',fridge:'fridge',solar:'solar',mppt:'mppt',water:'water-pump',electronics:'electronics',bilgefuse:'fuse-small',bilgeswitch:'bilge-switch',bilge:'bilge',windlass:'windlass',usb:'usb',autopilot:'pilot',antenna:'antenna',deck:'deck',splitter:'splitter',vhf:'vhf-gx2400',aisunit:'ais',gps:'gps',transducer:'transducer',i40:'i40-bidata',i40Wind:'i40-wind',windTransducer:'rotavecta',st1bus:'seatalk-junction',st1power:'seatalk-power',converter:'converter',backbone:'backbone',term1:'terminator',term2:'terminator',plotter:'plotter',netpower:'netpower',gateway:'gateway',aisgps:'gps',navdc:'panel',shore:'shore',inlet:'inlet',rcd:'rcd',acpanel:'acpanel',galvanic:'galvanic',pe:'pebar',charger:'charger',sockets:'socket',heater:'heater',dccharge:'charge-bank'};
export const artFiles=[...new Set([...Object.values(artwork),'i40','vhf'])].map(name=>'./assets/components/'+name+'.svg');
export const componentSize={width:280,height:180};
export function layoutDiagram(nodes){
 const xs=[...new Set(nodes.map(n=>n.x))].sort((a,b)=>a-b),ys=[...new Set(nodes.map(n=>n.y))].sort((a,b)=>a-b);
 const boxes=nodes.map(n=>({...n,x:80+xs.indexOf(n.x)*400,y:60+ys.indexOf(n.y)*270,width:280,height:180}));
 return {nodes:boxes,width:xs.length*400+80,height:ys.length*270+50};
}
const segmentKey=(a,b)=>a<b?a+':'+b:b+':'+a;
class Heap{
 constructor(){this.items=[]}
 push(item){const a=this.items;a.push(item);let i=a.length-1;while(i){const p=(i-1)>>1;if(a[p].score<=item.score)break;a[i]=a[p];i=p}a[i]=item}
 pop(){const a=this.items,first=a[0],last=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let child=i*2+1;if(child+1<a.length&&a[child+1].score<a[child].score)child++;if(a[child].score>=last.score)break;a[i]=a[child];i=child}a[i]=last}return first}
 get length(){return this.items.length}
}
function simplify(points){return points.filter((p,i)=>!i||i===points.length-1||!((points[i-1].x===p.x&&p.x===points[i+1].x)||(points[i-1].y===p.y&&p.y===points[i+1].y)))}
export function routeDiagram(scene,edges){
 const grid=5,cols=Math.floor(scene.width/grid)+1,rows=Math.floor(scene.height/grid)+1,count=cols*rows,blocked=new Uint8Array(count),used=new Set(),occupied=new Uint16Array(count),positions=new Map(scene.nodes.map(n=>[n.id,n]));
 for(const n of scene.nodes){for(let y=(n.y-0)/grid;y<=(n.y+n.height)/grid;y++)for(let x=n.x/grid;x<=(n.x+n.width)/grid;x++)blocked[y*cols+x]=1;}
 const ports=new Map(),sides=new Map();
 for(const e of edges){const a=positions.get(e.from),b=positions.get(e.to);if(!a||!b)throw Error('Extrem de connexió absent: '+e.id);
  const sideA=b.x<a.x?'left':'right',sideB=a.x<b.x?'left':'right';
  for(const [n,side,other,end]of [[a,sideA,b,'a'],[b,sideB,a,'b']]){const key=n.id+':'+side;if(!sides.has(key))sides.set(key,[]);sides.get(key).push({e,n,other,side,end})}
 }
 for(const entries of sides.values()){
  entries.sort((a,b)=>a.other.y-b.other.y||a.other.x-b.other.x||a.e.id.localeCompare(b.e.id));
  if(entries.length>16)throw Error('Massa terminals en un costat del component.');
  const top=Math.round((220-(entries.length-1)*5)/10)*5;
  entries.forEach((entry,i)=>{const p={x:entry.n.x+(entry.side==='right'?280:0),y:entry.n.y+top+i*5,side:entry.side};ports.set(entry.e.id+entry.end,p)})
 }
 // Reserva els últims 20 mm de dibuix de tots els terminals abans de traçar,
 // perquè una ruta anterior no ocupi l'entrada d'un cable encara no dibuixat.
 for(const p of ports.values())for(let offset=0;offset<20;offset+=grid){const sign=p.side==='right'?1:-1,a=p.y/grid*cols+(p.x+sign*offset)/grid,b=p.y/grid*cols+(p.x+sign*(offset+grid))/grid;used.add(segmentKey(a,b))}
 function search(start,end,strict){
  const source=start.y/grid*cols+start.x/grid,target=end.y/grid*cols+end.x/grid;
  const dist=new Float64Array(count*2);dist.fill(Infinity);const prev=new Int32Array(count*2);prev.fill(-1);const heap=new Heap();
  for(let dir=0;dir<2;dir++){dist[source*2+dir]=0;heap.push({id:source*2+dir,score:0,cost:0})}
  let found=-1;
  while(heap.length){const cur=heap.pop(),idx=cur.id>>1;if(cur.cost!==dist[cur.id])continue;if(idx===target){found=cur.id;break}const x=idx%cols,y=Math.floor(idx/cols),oldDir=cur.id&1;
   for(const [dx,dy,dir]of [[1,0,0],[-1,0,0],[0,1,1],[0,-1,1]]){const nx=x+dx,ny=y+dy;if(nx<1||ny<1||nx>=cols-1||ny>=rows-1)continue;const ni=ny*cols+nx;if(blocked[ni])continue;const key=segmentKey(idx,ni),shared=used.has(key);if(strict&&shared)continue;
    const next=ni*2+dir,cost=cur.cost+1+(dir!==oldDir?3:0)+(shared?120:0)+(occupied[ni]?5:0);
    if(cost>=dist[next])continue;dist[next]=cost;prev[next]=cur.id;const h=Math.abs(nx-end.x/grid)+Math.abs(ny-end.y/grid);heap.push({id:next,cost,score:cost+h});
   }
  }
  if(found<0)return null;const result=[];for(let id=found;id>=0;id=prev[id]){const index=id>>1;result.push({x:index%cols*grid,y:Math.floor(index/cols)*grid})}return result.reverse();
 }
 const sorted=[...edges].sort((a,b)=>{const length=e=>{const x=positions.get(e.from),y=positions.get(e.to);return Math.abs(x.x-y.x)+Math.abs(x.y-y.y)};return length(a)-length(b)||a.id.localeCompare(b.id)}),routes=new Map();
 for(const e of sorted){const a=ports.get(e.id+'a'),b=ports.get(e.id+'b'),start={x:a.x+(a.side==='right'?20:-20),y:a.y},end={x:b.x+(b.side==='right'?20:-20),y:b.y};
  let path=search(start,end,true),shared=false;if(!path){path=search(start,end,false);shared=true}if(!path)throw Error('No hi ha passadís disponible: '+e.id);
  const points=[0,5,10,15].map(offset=>({x:a.x+(a.side==='right'?offset:-offset),y:a.y})).concat(path,[15,10,5,0].map(offset=>({x:b.x+(b.side==='right'?offset:-offset),y:b.y})));
  for(let i=1;i<points.length;i++){const p=points[i-1],q=points[i],pi=p.y/grid*cols+p.x/grid,qi=q.y/grid*cols+q.x/grid;used.add(segmentKey(pi,qi));occupied[qi]++}
  const simplified=simplify(points);let longest={length:0,x:0,y:0,horizontal:false};for(let i=1;i<simplified.length;i++){const p=simplified[i-1],q=simplified[i],length=Math.abs(q.x-p.x)+Math.abs(q.y-p.y),horizontal=p.y===q.y;if((horizontal&&length>longest.length)||!longest.length)longest={length,x:(p.x+q.x)/2,y:(p.y+q.y)/2,horizontal}}
  const d=simplified.map((p,i)=>i?((p.y===simplified[i-1].y?'H'+p.x:'V'+p.y)):'M'+p.x+' '+p.y).join(' ');
  routes.set(e.id,{id:e.id,d,points:simplified,a,b,label:longest,shared});
 }
 return routes;
}
