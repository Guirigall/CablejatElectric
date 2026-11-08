#!/usr/bin/env python3
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
required=json.loads((root/'locale/required.json').read_text());catalog={}
for idx in json.loads((root/'locale/invariant-ids.json').read_text()):
 s=required[idx]['text'];catalog[s]={'es':s,'en':s}
for line in (root/'locale/data.tsv').read_text().splitlines():
 if not line:continue
 idx,es,en=line.split('\t');catalog[required[int(idx)]['text']]={'es':es,'en':en}
for name in ['ui.tsv','hardware.tsv','graphics.tsv']:
 p=root/'locale'/name
 if not p.exists():continue
 for line in p.read_text().splitlines():
  if not line:continue
  ca,es,en=line.split('\t');catalog[ca]={'es':es,'en':en}
(root/'dist/translations.js').write_text('export default '+json.dumps(catalog,ensure_ascii=False,indent=1)+';\n')
print(f'{len(catalog)} entrades · català, espanyol i anglès')
