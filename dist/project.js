import {defaults,nodes,edges} from './data.js';
export function validateProject(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('El projecte ha de ser un objecte JSON.');
 const c=structuredClone(defaults);
 for(const [key,allowed] of Object.entries({vhf:['unknown','ray','n2k','0183','gx2400'],instrument:['Bidata','Depth','Speed','Wind','BidataWind'],ais:['none','builtin','external'],bilgeMode:['auto','off','manual']})){
  if(input[key]!==undefined&&!allowed.includes(input[key]))throw Error('Opció no vàlida: '+key);if(input[key]!==undefined)c[key]=input[key];
 }
 for(const key of ['windlass','pilot','galvanic','transformer','gasAlarm','computer','networkBridge','plotter','main','engine','shore','solar','water']){if(input[key]!==undefined&&typeof input[key]!=='boolean')throw Error('Valor booleà no vàlid: '+key);if(input[key]!==undefined)c[key]=input[key];}
 if(c.vhf==='gx2400')c.ais='builtin';
 if(c.instrument==='BidataWind'&&c.plotter)c.networkBridge=true;
 if(input.transformer===undefined&&input.galvanic===true)c.transformer=false;
 if(c.transformer&&c.galvanic)throw Error('Tria transformador d’aïllament o aïllador galvànic: no tots dos en aquest esquema.');
 if(input.profile!==undefined){if(typeof input.profile!=='string')throw Error('Nom de projecte no vàlid.');c.profile=input.profile.slice(0,80);}
 for(const [key,value] of Object.entries(input.notes||{})){if(nodes.some(n=>n.id===key)||edges.some(e=>e.id===key))c.notes[key]=String(value).slice(0,4000);}
 for(const [id,value] of Object.entries(input.cables||{})){if(!edges.some(e=>e.id===id)||!value||typeof value!=='object')continue;const r={};for(const key of ['length','current','area','voltage','percent']){const raw=value[key];if(raw===undefined||raw==='')continue;const n=Number(raw);if(!Number.isFinite(n)||n<0||n>100000||(key==='area'||key==='voltage'||key==='percent')&&n===0)throw Error('Valor de cable no vàlid: '+id);r[key]=n;}if(r.percent>100)throw Error('Valor de cable no vàlid: '+id);for(const key of ['wireType','gauge','connectorA','connectorB'])if(value[key]!==undefined)r[key]=String(value[key]).slice(0,240);r.fuse=String(value.fuse||'').slice(0,120);c.cables[id]=r;}
 return c;
}
