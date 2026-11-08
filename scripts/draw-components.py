#!/usr/bin/env python3
"""Il·lustracions SVG originals: siluetes orientatives, sense pinouts."""
from pathlib import Path
import re
out=Path(__file__).resolve().parents[1]/'dist/assets/components'
out.mkdir(parents=True,exist_ok=True)
ink='#254751';metal='#a8b6b8';cream='#f2f1e8';red='#d56b53';green='#658a75';blue='#4f92b2'
def rect(x,y,w,h,fill,rx=4,stroke=ink):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def path(d,fill='none',stroke=ink,width=2):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
def circle(x,y,r,fill,stroke=ink):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def text(x,y,t,size=10,fill=ink):return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="DejaVu Sans,sans-serif" font-size="{size}" fill="{fill}">{t}</text>'
def screw(x,y):return circle(x,y,4,'#cbd5d1')+path(f'M{x-2} {y}h4',width=1)
def case(label,body=blue):return rect(41,22,158,101,body,10)+rect(52,35,136,63,ink,4)+text(120,62,label,14,'#edf2e9')+path('M64 112h112',stroke='#d8e5de')
a={}
a['battery']=rect(45,38,150,88,'#384f58',9)+rect(41,30,158,20,'#627e82',3)+rect(61,18,24,13,red,2)+rect(155,18,24,13,metal,2)+path('M90 33v-9q30-16 60 0v9',width=5)+rect(57,65,125,43,cream,3)+text(120,84,'SERVEIS',11)+text(120,101,'12 V',14)+text(73,28,'+',10,'white')+text(166,28,'−',10)
a['starter-battery']=a['battery'].replace('SERVEIS','MOTOR').replace('#384f58','#344d43')
a['fuse']=rect(36,48,168,55,'#4d5c5e',7)+rect(62,38,116,48,'#cad9ce',7)+rect(86,50,68,23,'#a6b3ab',3)+path('M48 68h42l8-8 10 16 10-16 10 16 10-8h54',stroke='#bc975a',width=6)+screw(49,69)+screw(191,69)+text(120,119,'FUSIBLE DC',9)
a['fuse-small']=path('M15 75h55m100 0h55',stroke=red,width=8)+rect(64,40,112,62,'#485b5f',10)+rect(88,49,64,45,'#c96a50',5)+rect(103,58,35,15,'#e7b47a',2)+text(120,123,'PORTAFUSIBLE',9)
a['switch']=rect(56,18,128,112,cream,16)+circle(120,74,43,'#344d55')+circle(120,74,31,red)+path('M114 83l26-33',stroke=cream,width=11)+text(120,31,'OFF',9)+text(162,83,'ON',8,'white')+screw(69,31)+screw(171,117)
a['panel']=rect(48,13,144,124,'#354e55',8)+text(120,30,'QUADRE DC',10,'#dbe9df')+''.join(circle(72,y,4,red)+rect(91,y-7,23,14,'#172f38',2)+path(f'M96 {y}h11',stroke='#bad49a')+path(f'M130 {y}h40',stroke='#94a9a8') for y in [48,70,92,114])
a['shunt']=rect(30,43,180,71,'#274b5b',8)+rect(57,22,37,49,'#ba9b60',2)+rect(147,22,37,49,'#ba9b60',2)+''.join(path(f'M94 {y}h53',stroke='#c2b798',width=4) for y in [41,47,53,59])+circle(75,38,10,'#d8dcd0')+circle(165,38,10,'#d8dcd0')+text(120,88,'SHUNT',13,'#dbe9df')+text(120,103,'BAT −  |  SYS −',8,'#afc3c8')
a['busbar']=rect(28,44,184,70,'#44565a',6)+rect(36,53,168,36,'#b3996a',4)+''.join(screw(x,70) for x in [51,79,107,135,163,191])+text(120,108,'RETORNS DC',9,'#dce5df')
a['navlights']=path('M120 20v112M63 64h114',width=4)+rect(40,49,44,52,'#354d54',12)+rect(44,62,36,23,red,8)+rect(155,49,44,52,'#354d54',12)+rect(159,62,36,23,'#61a989',8)+circle(120,31,14,'#344c54')+circle(120,31,9,'#f4e1ab')
a['cabinlights']=path('M47 39h146l-30 36H77Z',cream)+path('M78 76h84',stroke='#e2bd63',width=6)+path('M80 92l-9 20m48-20v24m38-24 9 20',stroke='#ddb95f')
a['engine']=rect(54,47,121,69,'#648b80',7)+rect(60,28,94,25,'#5a7b73',4)+rect(31,69,34,44,'#8d9c9c',5)+circle(177,91,27,'#344f57')+circle(177,91,16,'#93a7a2')+path('M69 29v-11h27m58 18h25v20h20',width=6)+''.join(path(f'M{x} 62v37',stroke='#42675f',width=4) for x in [83,102,121])+text(115,130,'MOTOR + ALTERNADOR',8)
a['dcdc']=case('DC → DC')+''.join(path(f'M{x} 23v99',stroke='#346a80',width=1) for x in [47,193])+circle(68,111,3,'#b9d590')+text(120,85,'CÀRREGA ENTRE BANCS',7,'#cbded9')
a['mppt']=case('MPPT')+text(120,85,'SOLAR → BATERIA',8,'#cbded9')+path('M90 122v12m60-12v12',stroke=red,width=5)
a['charger']=case('AC → DC')+text(120,85,'CARREGADOR DE PORT',7,'#cbded9')+path('M90 122v12m60-12v12',stroke=red,width=5)
a['fridge']=rect(68,9,104,127,'#dbe2da',10)+rect(76,17,88,109,cream,6)+path('M77 54h86',stroke='#a9b7b2')+rect(146,65,6,31,'#718b8c',2)+path('M116 83v24m-10-18 20 12m-20 0 20-12',stroke=blue)+path('M83 137v4m75-4v4',width=4)
a['solar']=path('M33 110l21-91h144l17 91Z','#344f65')+''.join(path(f'M{x} 22l{(x-120)*.16:.1f} 85',stroke='#9ebdc5',width=1) for x in [62,87,112,137,162,187])+''.join(path(f'M{49-(y-20)*.2:.1f} {y}H{199+(y-20)*.18:.1f}',stroke='#9ebdc5',width=1) for y in [40,62,84,105])+path('M58 112v17m132-17v17',stroke='#667e84',width=4)
a['water-pump']=rect(58,59,103,55,'#394d55',20)+rect(138,52,54,68,'#cfd9d0',11)+path('M45 76h17m129 0h22',stroke='#7f9a9e',width=11)+rect(140,29,46,24,'#3f565b',5)+path('M87 59V35h38',stroke=red,width=3)+text(107,92,'PUMP',9,'#d5e2dc')
a['electronics']=rect(37,15,166,121,cream,8)+''.join(rect(x,y,58,42,'#2e4b55',4)+rect(x+7,y+6,44,19,'#b9d3bf',2)+circle(x+46,y+33,3,'#cbd5cd') for x,y in [(52,29),(131,29),(52,83),(131,83)])
a['bilge-switch']=rect(52,23,136,103,'#364c55',8)+text(120,44,'SENTINA',12,'#e0eadf')+text(120,64,'AUTO  OFF  MAN',9,'#c5d3c7')+circle(120,91,18,'#c8d4cf')+path('M120 91l-17-12',stroke=ink,width=6)+circle(75,111,3,green)+circle(165,111,3,red)
a['bilge']=rect(67,111,108,19,'#294d65',5)+rect(73,50,96,67,'#d4e2dc',14)+path('M76 82h90',stroke='#a2b3ad')+path('M93 53q28-29 54 0',cream)+rect(95,32,47,27,red,6)+path('M168 76h38v21h-38',fill='#d5ded8')+''.join(path(f'M{x} 118v10',stroke='#6b8da0') for x in range(79,165,12))+path('M91 36V20H42',stroke='#af725b',width=3)+path('M99 35V13H50',stroke=ink,width=3)
a['windlass']=path('M45 108h154l-15 17H61Z','#829697')+circle(107,79,37,'#a8bab5')+circle(107,79,23,'#dbe3d9')+circle(107,79,9,'#658283')+rect(137,57,54,53,'#829d9a',12)+rect(72,23,72,39,'#d7e0d9',10)+path('M158 57V29',width=7)+path('M30 110l22-11 21 5',stroke='#b39763',width=4)
a['usb']=rect(30,33,126,81,'#344e59',9)+rect(41,44,74,35,'#bfd2b9',4)+text(78,65,'MÚSICA',10)+circle(134,62,12,'#16313c')+''.join(circle(x,97,4,'#a3bdb2') for x in [53,78,103,128])+rect(178,31,37,88,'#4b6971',9)+rect(186,44,21,15,'#d5e0ce',2)+rect(186,70,21,15,'#d5e0ce',2)+text(197,105,'USB',8,'#dce8d5')
a['pilot']=path('M29 83h136',stroke='#8d9d9f',width=11)+rect(54,60,83,47,'#d6e0d9',7)+rect(165,58,45,51,'#3a535c',9)+circle(39,83,11,'#526c72')+circle(196,119,6,'#8caaa6')+text(95,88,'PILOT',10)
a['antenna']=path('M114 130V13',stroke='#75949a',width=6)+path('M114 17l5-12',stroke='#526e76')+rect(103,107,22,26,'#b8c7c0',3)+path('M104 120H80m45 0h22',width=4)+path('M149 28q21 16 0 32m14-45q37 30 0 60',stroke='#80a59e',width=2)
a['deck']=path('M24 101h192',stroke='#96b6b3',width=5)+path('M47 101V78h146v23',fill='#a9bdb4')+rect(84,48,72,48,'#b1beb8',12)+rect(94,29,52,26,'#3d5a62',4)+path('M120 29V9m0 87v47',stroke='#4b5a5d',width=8)+screw(65,89)+screw(176,89)
a['splitter']=rect(51,31,138,84,'#374e56',8)+text(120,66,'VHF / AIS',15,'#e7eee4')+text(120,84,'SPLITTER ACTIU',8,'#bfcdc6')+''.join(rect(x,17,18,18,'#b2a77f',2) for x in [71,112,153])+path('M85 115v17m70-17v17',stroke=red,width=3)
a['vhf']=rect(26,38,167,81,'#344b55',10)+rect(37,51,89,40,'#c1d2b7',4)+text(80,75,'VHF · DSC',11)+circle(150,72,13,'#172e36')+circle(174,99,7,'#a1b3af')+''.join(path(f'M{42+i*13} 105v5',stroke='#a1b3af',width=4) for i in range(6))+rect(201,58,26,49,'#394f58',8)+path('M204 106q-30 45-42 10',stroke='#415d64',width=4)+''.join(path(f'M207 {y}h14',stroke='#9aaead',width=1) for y in [67,72,77])+path('M36 119v10h139v-10',width=3)
a['ais']=case('AIS',body='#4d6970')+text(120,84,'TRANSCEPTOR',9,'#d4e3da')+rect(70,122,17,12,'#b5a77a',2)+rect(154,122,17,12,'#b5a77a',2)
a['gps']=path('M67 94q-17-64 53-64t53 64Z',cream)+path('M67 93h106v15H67Z','#b9c9c1')+text(120,79,'GNSS',11)+path('M120 108v32',stroke='#6d8b8c',width=4)
a['transducer']=path('M48 98h46l-6 25H55Z','#876f4e')+rect(52,52,37,49,'#b09a68',5)+rect(47,43,47,15,'#c1af88',4)+path('M71 44V17h42',stroke='#4b656d',width=3)+circle(167,91,27,'#354f57')+rect(156,38,23,46,'#465e63',3)+path('M167 38V13h-34',stroke='#48636a',width=3)+path('M145 91h44m-22-22v44',stroke='#91a59a',width=4)
a['i40']=rect(65,12,110,125,'#344c56',8)+text(120,30,'i40',12,'#e7ece1')+rect(76,41,88,66,'#cbd7bf',4)+text(120,62,'RAYMARINE',7)+text(120,88,'—.—',23)+''.join(circle(x,120,5,'#98aca9') for x in [91,120,149])
a['converter']=rect(25,48,190,53,'#303e47',8)+text(120,80,'SeaTalk ↔ ng',12,'#e2e8df')+''.join(rect(x,30,22,24,c,4)+circle(x+11,33,5,'#203941') for x,c in [(35,blue),(72,cream),(109,'#e0b94c'),(146,cream),(183,blue)])
a['backbone']=rect(25,47,190,49,'#35464d',8)+''.join(rect(x,27,22,28,c,4)+circle(x+11,31,5,'#263f47') for x,c in [(35,blue),(72,cream),(109,cream),(146,cream),(183,blue)])+text(120,82,'SeaTalkng',11,'#e5eee0')
a['terminator']=rect(83,43,74,57,blue,8)+rect(104,26,33,23,'#357a9a',4)+circle(120,35,10,'#29556c')+path('M96 54v34m10-34v34m29-34v34m10-34v34',stroke='#a7c7cd',width=1)+text(120,122,'TERMINADOR',9)
a['plotter']=rect(31,17,178,112,'#2c4854',10)+rect(43,29,144,83,'#c5ded3',3)+path('M45 31l38 15-8 22 38 12-11 31H45Z','#a7ba88',stroke='#a7ba88')+path('M139 35l-7 24 23 20-9 28',stroke='#89afa4')+path('M88 94l46-30 28 19',stroke='#b16c56',width=2)+path('M129 59l5 10 5-10Z',red)+circle(197,80,5,'#91aba9')+path('M103 130v9h35v-9',width=4)+text(119,124,'AXIOM+',8,'#edf2e9')
a['netpower']=path('M13 38h75v25m-75 44h75V83',stroke=red,width=5)+path('M17 116h91v-22',stroke='#344c55',width=5)+rect(91,44,86,56,'#e0e7db',8)+rect(176,51,28,42,'#e9e9db',5)+circle(197,72,12,'#364f59')+text(131,76,'12 V',12)
a['gateway']=case('NMEA 0183',body='#607b76')+text(120,84,'TX+ / TX−',10,'#cbded9')+rect(73,122,94,14,'#9baf9e',2)
a['shore']=rect(76,12,89,127,'#d3dfd8',7)+path('M76 42h89',stroke='#9aafa8')+rect(95,60,49,56,'#5d98b4',5)+circle(120,88,14,'#b8d6dd')+text(120,30,'PORT',11)+path('M120 110v32',stroke='#526b73',width=6)
a['inlet']=rect(63,29,114,94,cream,9)+circle(120,76,35,blue)+circle(120,76,25,'#d5e1dc')+path('M108 65v9m24-9v9m-12 6v10',stroke=ink,width=4)+screw(75,41)+screw(165,111)
a['rcd']=rect(73,14,94,125,cream,6)+path('M120 17v120',stroke='#bcc9bf')+rect(85,54,70,38,'#355968',4)+path('M95 63h50v17H95Z',blue)+circle(145,109,9,'#c6d3cb')+text(144,112,'T',8)+text(111,36,'AC',9)+path('M86 17v-9m26 9v-9m24 9v-9m20 9v-9',stroke='#9ca9a4',width=3)
a['acpanel']=a['panel'].replace('QUADRE DC','QUADRE AC').replace(red,'#9e82b1')
a['galvanic']=rect(44,35,153,78,'#8fa9a3',10)+text(120,64,'AÏLLADOR',12)+text(120,84,'GALVÀNIC · PE',10)+path('M14 72h30m153 0h29',stroke='#9eac4a',width=6)
a['pebar']=a['busbar'].replace('#b3996a','#a0ad67').replace('RETORNS DC','PROTECCIÓ PE')
a['socket']=rect(65,17,110,120,cream,10)+circle(120,77,36,'#d2dbd1')+circle(106,76,5,ink)+circle(134,76,5,ink)+path('M120 42v10m0 50v10',stroke='#9e9a74',width=3)+screw(77,29)+screw(163,125)
a['heater']=rect(64,37,111,78,'#becbc6',22)+path('M73 59h92m-92 35h92',stroke='#99ada7')+circle(175,76,31,'#dce3d9')+circle(175,76,20,'#a3b9b4')+text(106,81,'TERMO',10)+path('M84 113v22m55-22v22',stroke=blue,width=6)+path('M141 113v22',stroke=red,width=6)
a['charge-bank']=a['battery'].replace('SERVEIS','BANC SERVEIS')+path('M213 32v32h-17m17-32-8 11m8-11 8 11',stroke=green,width=4)
a['isolation-transformer']=rect(43,16,154,118,'#43637b',10)+rect(58,33,124,77,'#d7dfd2',5)+path('M102 43v57m32-57v57',stroke='#829995',width=5)+path('M77 46q24 6 0 13q24 6 0 13q24 6 0 13q24 6 0 13',stroke='#bb8a50',width=3)+path('M161 46q-24 6 0 13q-24 6 0 13q-24 6 0 13q-24 6 0 13',stroke='#bb8a50',width=3)+text(120,29,'AÏLLAMENT',9,'#e3ecdf')+text(120,124,'PRIMARI  ≈  SECUNDARI',7,'#dce8df')
a['primary-breaker']=rect(78,17,84,119,cream,7)+rect(89,48,62,40,'#3b5865',4)+path('M99 59h42v18H99Z',blue)+text(120,36,'PRIMARI',9)+text(120,112,'I / O',11)
a['secondary-terminals']=rect(37,29,166,91,'#667d7a',7)+text(120,46,'SECUNDARI DEL TRAFO',8,'#edf2e7')+''.join(rect(x,64,38,34,'#d2dccb',4)+screw(x+19,80) for x in [52,102,152])+text(71,114,'L′',9,'#edf2e7')+text(121,114,'N′',9,'#edf2e7')+text(171,114,'PE',9,'#edf2e7')+path('M122 58h49',stroke='#a9b865',width=4)
a['gas-alarm']=rect(51,24,138,103,cream,10)+text(120,43,'GLP',12)+circle(83,65,5,green)+circle(120,65,5,'#ddad4c')+circle(157,65,5,red)+''.join(path(f'M{x} 82v18',stroke='#607c77') for x in range(78,166,10))+circle(120,114,5,'#abc1b3')
a['gas-probe']=path('M120 12v29',stroke='#466d75',width=4)+rect(85,41,70,79,'#668a83',17)+''.join(path(f'M98 {y}h44',stroke='#d6dfce',width=3) for y in [66,76,86,96,106])+text(120,137,'GLP',10)
a['pi-converter']=case('12 V → 5 V')+text(120,84,'USB-C',10,'#cbded9')
a['raspberry']=rect(62,17,116,120,'#58856a',6)+rect(96,48,42,42,ink,3)+rect(146,29,27,18,'#a8b3ac',3)+rect(146,55,27,18,'#a8b3ac',3)+rect(146,81,27,18,'#a8b3ac',3)+''.join(rect(67,y,14,6,'#c4bb8f',0) for y in range(27,120,12))+rect(104,122,27,13,'#afc2bb',3)+text(117,111,'Raspberry Pi',8,'#e1ebd9')
a['usb-hub']=rect(43,43,154,62,'#3c5a64',9)+''.join(rect(x,51,22,12,'#adc8b3',2) for x in [53,88,123,158])+text(120,91,'USB HUB · 5 V',11,'#e2ecdf')+path('M43 74H13m184 0h30',stroke='#67867e',width=5)
a['webcam']=rect(53,28,133,70,'#3b5961',20)+circle(120,63,26,'#223b49')+circle(120,63,15,'#658c9d')+circle(114,57,5,'#b4ced0')+circle(174,63,3,green)+path('M109 99v20h-31m42 0h43',stroke='#59797a',width=6)+path('M184 75h30v52',stroke='#5c7978',width=4)
a['i40-bidata']=rect(65,12,110,125,'#344c56',8)+text(120,30,'i40 BIDATA',10,'#e7ece1')+rect(76,41,88,66,'#cbd7bf',4)+text(94,54,'DEPTH',6)+text(133,67,'—.—',17)+path('M82 74h76',stroke='#718c76',width=1)+text(94,86,'SPEED',6)+text(133,100,'—.—',17)+''.join(circle(x,120,5,'#98aca9') for x in [91,120,149])
a['i40-wind']=rect(65,12,110,125,'#344c56',8)+text(120,30,'i40 WIND',10,'#e7ece1')+rect(76,41,88,66,'#cbd7bf',4)+path('M90 72a30 27 0 0 1 60 0M120 46v7m-25 7 5 4m45-4-5 4',stroke='#627c6c',width=1)+path('M120 77l17-22-10 26Z','#546e67')+text(120,100,'—.—',16)+''.join(circle(x,120,5,'#98aca9') for x in [91,120,149])
a['rotavecta']=path('M120 132V65m0 0-46-20m46 20 44-23m-44 23v35',stroke='#75969c',width=5)+path('M58 34q17-18 33 1v20H58Z','#d6e2db')+path('M148 28q17-18 33 1v20h-33Z','#c8d8d1')+path('M105 91q17-18 33 1v20h-33Z','#b9cec7')+rect(108,119,24,17,'#59777d',3)
a['seatalk-junction']=rect(58,42,124,66,'#35484d',16)+''.join(path(f'M{x} 43V25',stroke='#253f49',width=14) for x in [83,120,157])+text(120,77,'SeaTalk 1',13,'#e4eadd')+text(120,96,'D244',8,'#adcbc4')
a['seatalk-power']=a['netpower'].replace('12 V','SeaTalk 1')
a['vhf-gx2400']=rect(27,30,167,92,'#344b55',10)+rect(38,43,94,60,'#c1d2b7',4)+text(85,53,'GX2400E',8)+circle(85,78,17,'#c1d2b7',stroke='#688477')+path('M69 78h32m-16-16v32',stroke='#688477',width=1)+circle(76,72,2,'#465f52')+circle(94,81,2,'#465f52')+text(152,47,'GPS',7,'#e3eadc')+text(152,58,'AIS RX',7,'#e3eadc')+circle(162,84,15,'#172e36')+rect(203,53,24,48,'#394f58',8)+path('M205 104q-30 42-44 12',stroke='#415d64',width=4)
for name,body in a.items():
 # Etiquetes petites sobre placa clara: llegibles també al tema fosc.
 def caption(match):
  tag=match[0];y=float(re.search(r'y="([^"]+)"',tag)[1])
  if y<118:return tag
  x=float(re.search(r'x="([^"]+)"',tag)[1]);size=float(re.search(r'font-size="([^"]+)"',tag)[1]);label=re.sub('<[^>]+>','',tag);w=min(220,len(label)*size*.62+10)
  plate=f'<rect x="{x-w/2:.1f}" y="{y-size:.1f}" width="{w:.1f}" height="{size+5:.1f}" rx="3" fill="#eef2e8"/>'
  return plate+re.sub(r'fill="[^"]+"',f'fill="{ink}"',tag)
 body=re.sub(r'<text\b[^>]*>[^<]*</text>',caption,body)
 title=name.replace('-',' ')
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="150" viewBox="0 0 240 150" role="img"><title>{title} · dibuix orientatiu</title><ellipse cx="120" cy="139" rx="86" ry="5" fill="#d3dfd4" opacity=".55"/>{body}</svg>'
 (out/f'{name}.svg').write_text(svg)
print(f'{len(a)} il·lustracions originals creades a {out}')
