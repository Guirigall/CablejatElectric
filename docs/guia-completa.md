[← README](../README.md)

> Guia tècnica detallada / Detailed technical guide. Les ordres referides al projecte font només són aplicables si aquests fitxers hi són; el README descriu els fitxers i les ordres d’aquest repositori.

# Cablejat elèctric / Cableado eléctrico / Electrical wiring

[Català](#català) · [Español](#español) · [English](#english)

## Català

PWA **v1.7** per explorar i documentar la instal·lació elèctrica d’un veler de creuer de 32 peus. Interfície, fitxes, dibuixos, avisos i CSV en català, espanyol i anglès. Tema clar, fosc o automàtic segons el dispositiu; tema i llengua es recorden en aquest navegador. No necessita compte, API ni compilació.

Perfil inicial: **Standard Horizon GX2400E** amb GPS i receptor AIS integrats; **Raymarine i40 Bidata** (profunditat i corredera) i **i40 Wind** amb Rotavecta. Els i40 comparteixen SeaTalk 1 amb una única alimentació; la velocitat de corredera permet calcular el vent real. No mostren blancs AIS. La VHF usa una sola antena VHF/AIS, sense splitter ni GPS extern per defecte. Ara inclou **Axiom+**, E22158 i xarxa SeaTalkng/NMEA 2000 amb dos terminadors i una única alimentació. La pantalla rep les dades dels sensors a través dels i40 i els blancs AIS de la GX2400E. Té ramal propi de 12 V, positiu amb fusible i retorn a SYSTEM MINUS. El connector DeviceNet de l’arnès requereix un spur/adaptador SeaTalkng compatible. La mida 7/9/12 i la variant RV queden per confirmar: no es pressuposa un transductor de sonar addicional. El botó de perfil confirmat recupera aquests equips sense esborrar notes ni cables.

### Equips i circuits

- **12 V:** bancs separats de serveis i motor, generals, fusibles, alternador, arrencada, DC–DC, plaques, MPPT, shunt, barra de negatius i consumidors.
- **Serveis:** navegació, fondeig, interior, banyera, nevera, aigua, sentina, molinet amb contactor, pilot, música i USB.
- **Gas:** central autònoma GLP amb sonda remota i alimentació permanent amb fusible, abans del general. No depèn de Raspberry ni d’internet. GLP i CO requereixen detecció específica; no són intercanviables. Model, ubicació, fusible i proves segons fabricant. Aquesta web no detecta gas ni certifica l’alarma.
- **Raspberry Pi i dues webcams USB:** ramal DC propi, convertidor regulat 12→5 V, alimentació USB-C adequada i hub USB autoalimentat que aporta dades i energia a les càmeres. Verificar corrent, negociació USB-C, consum dels perifèrics, amplada de banda, llargada i protecció ambiental. El hub no ha de realimentar la Pi. Mai 12 V a USB/GPIO. Les càmeres IP/PoE necessiten un altre esquema; l’app no activa càmeres reals.
- **Dades/RF:** i40 Depth/Speed/Bidata/Wind, transductors, SeaTalk 1, E22158, SeaTalkng/NMEA 2000, GNSS, VHF, AIS i splitter actiu opcional.
- **230 V:** entrada de port, L/N i PE, proteccions, carregador, endolls i termo. Opció de transformador marí o connexió directa amb aïllador galvànic opcional. No inclou inversor.

### Fitxes de cablejat

Cada connexió mostra el tipus de cable, la secció o criteri de calibre i les terminacions A/B. Les referències exactes de cable i connectors es poden anotar i exportar en JSON/CSV. La llista de connexions inclou les especificacions. Els cables SeaTalk, NMEA, USB, coaxials i de sensors conserven els requisits dels fabricants; no es dimensionen com un cable DC genèric. L’acoblament del transformador no es considera un cable.

Per a DC, introdueix llargada d’anada, corrent, tensió i percentatge màxim de caiguda. Es calcula el mínim teòric amb coure a 20 °C i la següent secció comercial, sense aplicar-la automàticament. Exemple: 10 m, 5 A, 12 V i 3 % donen 4,86 mm² → 6 mm² només per caiguda. Cal contrastar ampacitat, temperatura, agrupament, arrencada i fusible. Les seccions desconegudes queden pendents; no hi ha un calibre universal per al vaixell.

### Com fer-lo servir

Desplega **El teu equipament** i tria els equips. Obre una xarxa i toca un component o cable: la fitxa mostra els dos extrems, els connectors, les proteccions i un espai per anotar el teu muntatge. Els dibuixos SVG són orientatius, sense escala ni pinout. Els cables són horitzontals/verticals; els encreuaments amb tall no són unions. El traç discontinu del transformador és acoblament magnètic, no cable.

Segueix els recorreguts guiats, cerca equips en qualsevol de les tres llengües o selecciona’ls a la llista accessible. En mòbil pots desplaçar l’esquema i ampliar-lo. **Atenua cables no seleccionats** ajuda a seguir un ramal. La prova de lògica mostra alimentacions disponibles; no simula corrents, SOC, detecció de gas ni imatges de càmeres.

L’i40 comparteix instrumentació, no aporta posició GPS a DSC. Requereix conversió activa per integrar SeaTalk 1 amb SeaTalkng. VHF, AIS i plotter tenen alimentacions pròpies. Connectors físics, sentències i PGN depenen del model. El negatiu del banc de serveis només connecta a BATTERY MINUS; càrregues i carregadors connecten a SYSTEM MINUS. El corrent d’arrencada del banc de motor no passa pel shunt de serveis.

Amb transformador a flotació, el PE de port queda separat del de bord; el secundari té referència N′–PE al costat font i diferencial de sortida segons manual. La carcassa i l’ús en varador requereixen seguir el manual específic. El soft-start limita el corrent d’encesa propi, no garanteix protecció contra pics de tensió. SPD i tall per sobretensions sostingudes requereixen disseny específic. Un autotransformador no proporciona aquest aïllament.

### Obrir, instal·lar i desar

```bash
bash Obre-Bord.sh
```

O bé, des de la carpeta: `python3 serve.py --open`. Normalment obre `http://localhost:8082`. Reutilitza una instància existent d’aquest projecte o tria un port següent lliure. `--port 8090` fixa el primer port a provar. Només escolta a l’ordinador local; el mòbil necessita una URL HTTPS accessible.

Publica **el contingut de `dist/`** en allotjament estàtic HTTPS, incloent totes les carpetes d’icones i dibuixos. A Android, obre’l amb Chrome, espera **Disponible fora de línia** i tria **Instal·la l’aplicació**. A iPhone: Safari → Comparteix → Afegeix a la pantalla d’inici. No instal·lis des de `file://`. Els manuals externs necessiten internet.

Les notes, el perfil i les mides es desen localment. **JSON** conserva el projecte complet; importar-lo substitueix el perfil actual. **CSV** exporta connexions en la llengua seleccionada. Les notes i noms escrits per tu no es tradueixen. Canviar de dispositiu, domini o port canvia el magatzem local: exporta JSON abans. La manca d’espai o el mode privat poden impedir la persistència.

### Límits i verificació

Atles funcional de referència, no plànol de muntatge certificat. Models, química/BMS, corrents, llargades, ampacitat, fusibles, poder de tall i unions PE/DC requereixen projecte nàutic. Una línia pot agrupar conductors; no és una llista de compra amb quantitats definitives.

El càlcul `ΔV = 2 × L × I × 0,0175 / S` assumeix coure a 20 °C i anada/tornada iguals. No inclou terminals, ampacitat, pics d’arrencada ni selecció automàtica de fusibles. Cal revisar el disseny complet amb un instal·lador nàutic abans del muntatge.

Executa `npm test` i `python3 -m unittest discover -s tests -p test_server.py`. Les proves cobreixen topologia, traçats, gas/USB, importació, idiomes, tema, interaccions en DOM simulat i memòria cau. No substitueixen una prova visual en navegador ni una instal·lació Android real.

## Español

PWA **v1.7** para explorar y documentar la instalación eléctrica de un velero de crucero de 32 pies. Interfaz, fichas, dibujos, avisos y CSV en catalán, español e inglés. Tema claro, oscuro o automático según el dispositivo; idioma y tema se recuerdan en este navegador. No necesita cuenta, API ni compilación.

Perfil inicial: **Standard Horizon GX2400E** con GPS y receptor AIS integrados; **Raymarine i40 Bidata** (profundidad y corredera) e **i40 Wind** con Rotavecta. Los i40 comparten SeaTalk 1 con una sola alimentación; la velocidad de corredera permite calcular el viento real. No muestran blancos AIS. La VHF utiliza una sola antena VHF/AIS, sin splitter ni GPS externo por defecto. Ahora incluye **Axiom+**, E22158 y red SeaTalkng/NMEA 2000 con dos terminadores y una sola alimentación. Recibe datos de sensores mediante los i40 y blancos AIS de la GX2400E. Tiene ramal propio de 12 V, positivo con fusible y retorno a SYSTEM MINUS. El DeviceNet del arnés requiere un spur/adaptador SeaTalkng compatible. Tamaño 7/9/12 y variante RV por confirmar; no se presupone un transductor de sonar adicional. El botón del perfil confirmado restaura estos equipos sin borrar notas ni cables.

### Equipos y circuitos

- **12 V:** bancos separados de servicios y motor, generales, fusibles, alternador, arranque, DC–DC, placas, MPPT, shunt, barra de negativos y consumidores.
- **Servicios:** navegación, fondeo, interior, bañera, nevera, agua, sentina, molinete con contactor, piloto, música y USB.
- **Gas:** central autónoma GLP con sonda remota y alimentación permanente con fusible, antes del general. No depende de Raspberry ni internet. GLP y CO requieren sensores específicos, no intercambiables. Modelo, ubicación, fusible y pruebas según fabricante. Esta web no detecta gas ni certifica la alarma.
- **Raspberry Pi y dos webcams USB:** ramal DC propio, convertidor regulado 12→5 V, alimentación USB-C adecuada y hub USB autoalimentado que aporta datos y energía a las cámaras. Verificar corriente, negociación USB-C, consumo de periféricos, ancho de banda, longitud y protección ambiental. El hub no debe realimentar la Pi. Nunca 12 V a USB/GPIO. Las cámaras IP/PoE necesitan otro esquema; la app no activa cámaras reales.
- **Datos/RF:** i40 Depth/Speed/Bidata/Wind, transductores, SeaTalk 1, E22158, SeaTalkng/NMEA 2000, GNSS, VHF, AIS y splitter activo opcional.
- **230 V:** entrada de puerto, L/N y PE, protecciones, cargador, tomas y termo. Opción de transformador marino o conexión directa con aislador galvánico opcional. No incluye inversor.

### Fichas de cableado

Cada conexión muestra tipo de cable, sección o criterio de calibre y terminaciones A/B. Se pueden guardar referencias exactas y exportarlas a JSON/CSV. La lista incluye las especificaciones. SeaTalk, NMEA, USB, coaxiales y sensores conservan los requisitos del fabricante; no se dimensionan como DC genérico. El acoplamiento del transformador no es un cable.

Para DC, introduce longitud de ida, corriente, tensión y porcentaje máximo de caída. Se calcula el mínimo con cobre a 20 °C y la siguiente sección comercial sin aplicarla automáticamente. Ejemplo: 10 m, 5 A, 12 V y 3 % dan 4,86 mm² → 6 mm² solo por caída. Hay que comprobar ampacidad, temperatura, agrupamiento, arranque y fusible. Las secciones desconocidas quedan pendientes.

### Cómo utilizarlo

Despliega **Tu equipamiento** y elige los equipos. Abre una red y toca un componente o cable: la ficha muestra ambos extremos, conectores, protecciones y notas de tu montaje. Los dibujos SVG son orientativos, sin escala ni pinout. Los cables son horizontales/verticales; los cruces con corte no son uniones. El trazo discontinuo del transformador representa acoplamiento magnético, no cable.

Sigue los recorridos, busca equipos en cualquiera de los tres idiomas o selecciónalos en la lista accesible. En móvil puedes desplazar y ampliar el esquema. **Atenúa cables no seleccionados** ayuda a seguir un ramal. La prueba lógica muestra alimentaciones disponibles; no simula corrientes, SOC, detección de gas ni imágenes de cámaras.

El i40 comparte instrumentación, no proporciona posición GPS para DSC. Necesita conversión activa para integrar SeaTalk 1 con SeaTalkng. VHF, AIS y plotter tienen alimentaciones propias. Conectores físicos, sentencias y PGN según modelo. El negativo del banco de servicios solo conecta a BATTERY MINUS; cargas y cargadores a SYSTEM MINUS. La corriente de arranque del banco de motor no atraviesa el shunt de servicios.

Con transformador a flote, PE de puerto y barco quedan separados; el secundario tiene referencia N′–PE del lado de fuente y diferencial de salida según manual. Carcasa y uso en varadero requieren el manual específico. Soft-start limita la corriente de encendido propia, no garantiza protección contra picos de tensión. SPD y corte por sobretensiones sostenidas requieren diseño específico. Un autotransformador no proporciona este aislamiento.

### Abrir, instalar y guardar

```bash
bash Obre-Bord.sh
```

O desde la carpeta: `python3 serve.py --open`. Normalmente abre `http://localhost:8082`. Reutiliza una instancia del mismo proyecto o elige el siguiente puerto libre. `--port 8090` fija el primer puerto a probar. Solo escucha en el ordenador local; el móvil necesita una URL HTTPS accesible.

Publica **el contenido de `dist/`** en alojamiento estático HTTPS con todas las carpetas de iconos y dibujos. En Android, abre con Chrome, espera **Disponible sin conexión** y elige **Instalar aplicación**. En iPhone: Safari → Compartir → Añadir a pantalla de inicio. No instalar desde `file://`. Los manuales externos necesitan internet.

Notas, perfil y medidas se guardan localmente. **JSON** conserva todo el proyecto; importarlo sustituye el perfil actual. **CSV** exporta conexiones en el idioma seleccionado. Los nombres y notas escritos por ti no se traducen. Cambiar dispositivo, dominio o puerto cambia el almacenamiento: exporta JSON antes. Falta de espacio o modo privado pueden impedir la persistencia.

### Límites y verificación

Atlas funcional de referencia, no plano de montaje certificado. Modelos, química/BMS, corrientes, longitudes, ampacidad, fusibles, capacidad de corte y uniones PE/DC requieren proyecto náutico. Una línea puede agrupar conductores; no es una lista de compra definitiva.

`ΔV = 2 × L × I × 0,0175 / S` supone cobre a 20 °C e ida/vuelta iguales. No incluye terminales, ampacidad, arranque ni selección automática de fusibles. Revisar el diseño con un instalador náutico antes del montaje.

Ejecuta `npm test` y `python3 -m unittest discover -s tests -p test_server.py`. Las pruebas cubren topología, trazado, gas/USB, importación, idiomas, tema, interacción en DOM simulado y caché. No sustituyen revisión visual en navegador ni instalación Android real.

## English

**v1.7** PWA for exploring and documenting the electrical installation of a 32-foot cruising yacht. Interface, equipment details, drawings, warnings and CSV are available in Catalan, Spanish and English. Light, dark or device-controlled automatic appearance; language and theme are remembered in this browser. No account, API or build step is required.

Initial profile: **Standard Horizon GX2400E** with built-in GPS and AIS receiver; **Raymarine i40 Bidata** (depth and speed through water) and **i40 Wind** with Rotavecta. The i40 instruments share SeaTalk 1 with a single power feed; boat speed enables true-wind calculation. They cannot display AIS targets. The radio uses one VHF/AIS antenna, without an external splitter or GPS by default. Now includes **Axiom+**, E22158 and a SeaTalkng/NMEA 2000 network with two terminators and one power feed. Sensor data arrives through the i40 displays and AIS targets from the GX2400E. The display has its own 12 V branch, fused positive and SYSTEM MINUS return. Its harness DeviceNet connector requires a compatible SeaTalkng spur/adapter. The 7/9/12 display size and RV variant remain unspecified; no additional sonar transducer is assumed. The confirmed-profile button restores this equipment without deleting notes or cable settings.

### Equipment and circuits

- **12 V:** separate house and engine banks, main switches, fuses, alternator, starting, DC–DC charging, solar panels, MPPT, shunt, negative busbar and loads.
- **Services:** running, anchor, interior and cockpit lights, fridge, water, bilge, windlass with contactor, autopilot, stereo and USB.
- **Gas:** independent LPG alarm with remote probe and permanent fused supply upstream of the main switch. Independent of Raspberry Pi and internet. LPG and CO require specific sensors; they are not interchangeable. Model, location, fuse and testing follow the manufacturer. This website does not detect gas or certify the alarm.
- **Raspberry Pi and two USB webcams:** dedicated DC branch, regulated 12→5 V converter, appropriate USB-C supply and self-powered USB hub supplying camera data and power. Check current, USB-C negotiation, peripheral load, bandwidth, cable length and weather protection. The hub must not backfeed the Pi. Never apply 12 V to USB/GPIO. IP/PoE cameras need another design; the app does not activate real cameras.
- **Data/RF:** i40 Depth/Speed/Bidata/Wind, transducers, SeaTalk 1, E22158, SeaTalkng/NMEA 2000, GNSS, VHF, AIS and optional active splitter.
- **230 V:** shore inlet, L/N and PE, protection, charger, outlets and water heater. Marine isolation transformer option or direct connection with optional galvanic isolator. No inverter included.

### Cable specifications

Each connection shows cable type, cross-section or gauge criteria, and end A/B terminations. Exact selected cable and connector references can be saved and exported in JSON/CSV. The connection list includes the specifications. SeaTalk, NMEA, USB, coax and sensor cables retain manufacturer requirements rather than generic DC sizing. Transformer coupling is not a wire.

For DC, enter one-way length, current, voltage and voltage-drop limit. The app calculates a theoretical minimum for copper at 20 °C and the next standard cross-section without applying it automatically. Example: 10 m, 5 A, 12 V and 3% give 4.86 mm² → 6 mm² for voltage drop only. Check ampacity, temperature, bundling, starting current and fuse. Unknown sizes remain pending.

### Using the atlas

Expand **Your equipment** and select the installed devices. Open a network and tap a component or cable: its details show both ends, connectors, protection and installation notes. SVG drawings are illustrative, not to scale or a pinout. Wiring is horizontal/vertical; crossings with a gap are not junctions. The transformer's dashed link represents magnetic coupling, not wire.

Follow guided routes, search equipment in any supported language or use the accessible equipment list. On phones, scroll and zoom the diagram. **Dim unselected wires** helps follow a branch. The logic check shows available supplies; it does not simulate currents, SOC, gas detection or camera footage.

The i40 shares instrument data, not GPS position for DSC. Active conversion is needed between SeaTalk 1 and SeaTalkng. VHF, AIS and chartplotter have separate power feeds. Physical connectors, sentences and PGNs depend on the model. Only the house bank negative connects to BATTERY MINUS; loads and chargers connect to SYSTEM MINUS. Engine bank starting current does not pass through the house shunt.

With an isolation transformer afloat, shore PE and vessel PE are separate; the secondary has its source-side N′–PE reference and output RCD as specified by the manual. Follow the specific manual for enclosure earthing and use ashore. Soft-start limits the transformer's own inrush; it does not guarantee voltage surge protection. An SPD and sustained-overvoltage disconnect need specific design. An autotransformer does not provide this isolation.

### Open, install and save

```bash
bash Obre-Bord.sh
```

Or run `python3 serve.py --open` from the project folder. Normally opens `http://localhost:8082`. Reuses an existing instance of this project or selects the next free port. `--port 8090` sets the first port to try. Listens only on the local computer; a phone needs a reachable HTTPS URL.

Publish **the contents of `dist/`** to static HTTPS hosting, including every icon and drawing directory. On Android, open in Chrome, wait for **Available offline** and choose **Install app**. On iPhone: Safari → Share → Add to Home Screen. Do not install from `file://`. External manuals need internet.

Notes, profile and cable dimensions are stored locally. **JSON** preserves the whole project; importing replaces the current profile. **CSV** exports connections in the selected language. Your own names and notes are not translated. Changing device, domain or port changes local storage: export JSON first. Low storage or private browsing may prevent persistence.

### Limits and verification

A functional reference atlas, not a certified installation drawing. Equipment models, chemistry/BMS, currents, cable lengths, ampacity, fuses, interrupt capacity and PE/DC bonding require a marine electrical design. One line may group conductors; this is not a final bill of materials.

`ΔV = 2 × L × I × 0.0175 / S` assumes copper at 20 °C and equal outgoing/return conductors. It excludes terminals, ampacity, starting current and automatic fuse selection. Have a marine installer review the design before assembly.

Run `npm test` and `python3 -m unittest discover -s tests -p test_server.py`. Tests cover topology, routing, gas/USB, import, languages, theme, simulated DOM interactions and offline caching. They do not replace visual browser checks or actual Android installation.

## Fitxers · Archivos · Files

- `dist/index.html`, `style.css`, `app.js`: UI.
- `dist/data.js`, `project.js`, `diagram.js`: equipment / connections / project validation / routing.
- `dist/i18n.js`, `translations.js`, `theme.js`, `preferences.js`: languages / appearance.
- `dist/assets/components/`: SVG, Català + `es/` + `en/`.
- `dist/sw.js`, `manifest*.webmanifest`, `assets/icon*`: PWA.
- `locale/`: translation sources. `python3 scripts/build-translations.py` → `python3 scripts/localize-art.py`.
- `scripts/draw-components.py`: original SVG generation; regenerate translations afterwards.
- `serve.py`, `Obre-Bord.sh`: local launcher.
- `tests/`: Node + Python, no external dependencies.

## Fonts · Fuentes · Sources

2026-11-06 · Manuals require internet / Los manuales necesitan internet / Els manuals necessiten internet.

- [Raymarine i40 · 81340-2](https://www.raymarine-shop.nl/wp-content/uploads/Raymarine-shop_i40-Installation-and-operation-instructions-81340-2-EN.pdf)
- [Raymarine SeaTalk → SeaTalkng · 87255-1](https://rowlandsmarine.co.uk/content/raymarine-seatalk-to-seatalkng-converter-installation-guide.pdf)
- [Raymarine Ray53/Ray63/Ray73 · 81381](https://docs.raymarine.com/81381/en-US/latest/index.html)
- [Raymarine AIS · NMEA 0183 · 87326](https://docs.raymarine.com/87326/en-US/latest/NMEA0183Connection-17B6437D.html)
- [Victron SmartShunt](https://www.victronenergy.com/media/pg/SmartShunt/en/installation.html)
- [Victron Wiring Unlimited · DC](https://www.victronenergy.com/media/pg/The_Wiring_Unlimited_book/en/dc-wiring.html)
- [Victron Wiring Unlimited · AC](https://www.victronenergy.com/media/pg/The_Wiring_Unlimited_book/en/ac-wiring.html)
- [Xylem Rule](https://www.xylem.com/siteassets/brand/rule/resources/manual/bilge-pump-standard-360-1100-gph.pdf)
- [Victron · isolation transformer installation](https://www.victronenergy.com/media/pg/Isolation_Transformer_2500W/en/installation.html)
- [Victron · isolation transformer features](https://www.victronenergy.com/media/pg/Isolation_Transformer_8000W/en/features.html)
- [Phoenix Contact · surge protection](https://www.phoenixcontact.com/en-us/products/surge-protection/surge-protection-for-power-supplies)
- [Raspberry Pi · hardware and power](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html)
- [Nereus · marine gas alarm](https://www.nereusalarms.co.uk/WG300-LLC_Manual_-_A4.pdf)

- [Standard Horizon GX2400E · manual](https://www.standardhorizon.com/Files/7B72F1ED-1018-01AF-FA2014D9F850EE8A/GX2400_E_OM_ENG_EM067N201_2005M-BC-2.pdf)

- [Raymarine Axiom+ · installation](https://docs.raymarine.com/87414/en-US/latest/index.html)

- [Blue Sea Systems · conductor sizing](https://www.bluesea.com/support/reference/535/Voltage_Drop_in_Conductor_-_Wire_Sizing_Chart)

## GitHub Pages

**Català:** el flux `.github/workflows/pages.yml` executa les proves en cada proposta de canvi i actualització de `main`. Només publica `dist/` després que passin les proves de `main`. Al repositori, configura **Settings → Pages → Source → GitHub Actions**. L’adreça publicada apareix a l’entorn `github-pages` i permet instal·lar el PWA amb HTTPS. Les dades personals del muntatge continuen desades al navegador; els JSON exportats no s’han d’afegir al repositori.

**Español:** el flujo ejecuta las pruebas en cada propuesta de cambio y actualización de `main`. Solo publica `dist/` después de superar las pruebas de `main`. Configura **Settings → Pages → Source → GitHub Actions**. La dirección publicada aparece en el entorno `github-pages` y permite instalar el PWA por HTTPS. Los datos del montaje permanecen en el navegador; no añadas los JSON exportados al repositorio.

**English:** the workflow runs tests on pull requests and updates to `main`. It publishes only `dist/`, after the tests on `main` pass. Set **Settings → Pages → Source → GitHub Actions**. The published URL appears in the `github-pages` environment and supports PWA installation over HTTPS. Installation notes remain in the browser; do not commit exported project JSON files.
