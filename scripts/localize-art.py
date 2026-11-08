#!/usr/bin/env python3
import json,re
from pathlib import Path
import xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
s=(root/'dist/translations.js').read_text();catalog=json.loads(s[len('export default '):].rstrip(';\n'))
keys=sorted((k for k,v in catalog.items() if v['es']!=k or v['en']!=k),key=len,reverse=True)
pattern=re.compile('|'.join(map(re.escape,keys)))
ET.register_namespace('','http://www.w3.org/2000/svg')
for lang in ['es','en']:
 dest=root/'dist/assets/components'/lang;dest.mkdir(exist_ok=True)
 for p in (root/'dist/assets/components').glob('*.svg'):
  tree=ET.parse(p)
  for e in tree.iter():
   if e.tag.split('}')[-1] in ['text','title'] and e.text:
    e.text=pattern.sub(lambda m:catalog[m[0]][lang],e.text)
  tree.write(dest/p.name,encoding='unicode')
print('Il·lustracions traduïdes a espanyol i anglès.')
