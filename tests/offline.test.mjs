import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {artFiles} from '../dist/diagram.js';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
test('Instal·lació completa, cache pròpia, recuperació offline i confirmació verificable',async()=>{
 const events={},messages=[],scope='https://example.test/veler/',store=new Map(),deleted=[];
 const cache={async addAll(files){for(const f of files){const file=f==='./'?'index.html':f.slice(2);assert.ok(fs.existsSync(path.join(root,file)),f);store.set(f,new Response(fs.readFileSync(path.join(root,file))))}},async match(key){return store.get(key)?.clone()},async put(key,r){store.set(key,r.clone())}};
 const context={self:{registration:{scope},addEventListener:(n,fn)=>events[n]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>cache,keys:async()=>['another-app',`bord:${scope}:old`,`bord:${scope}:${sw.match(/const VERSION='([^']+)'/)[1]}`],delete:async k=>deleted.push(k)},URL,Response,fetch:async()=>{throw Error('offline')}};
 vm.createContext(context);vm.runInContext(sw,context);
 async function run(name,extra={}){let promise;events[name]({waitUntil:p=>promise=p,...extra});await promise;}
 await run('install');assert.equal(store.size,18+3*artFiles.length);
 await run('activate');assert.deepEqual(deleted,[`bord:${scope}:old`]);
 await run('message',{data:'VERIFY_OFFLINE',source:{postMessage:m=>messages.push(m)}});assert.deepEqual(messages,['OFFLINE_READY']);
 let promise;events.fetch({request:{url:scope+'app.js',method:'GET',mode:'cors'},respondWith:p=>promise=p});assert.ok((await (await promise).text()).includes('showDetail'));
 promise=null;events.fetch({request:{url:'https://external.test/manual.pdf',method:'GET',mode:'cors'},respondWith:p=>promise=p});assert.equal(promise,null);
 store.delete('./data.js');messages.length=0;await run('message',{data:'VERIFY_OFFLINE',source:{postMessage:m=>messages.push(m)}});assert.equal(messages.length,0);
});
test('Manifest coherent, PNG de mida declarada i README publicable igual a l’original',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.lang,'ca');
 for(const icon of manifest.icons){const buf=fs.readFileSync(path.join(root,icon.src));assert.equal(buf.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(`${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`,icon.sizes)}
 assert.equal(fs.readFileSync(path.join(root,'README.md'),'utf8'),fs.readFileSync(path.join(root,'../README.md'),'utf8'));
});
