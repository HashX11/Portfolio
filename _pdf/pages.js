/* =====================================================================
   MOHAMAD HASHEM DANKAR — SELECTED WORKS
   The PAGES array below IS the document: one entry, one A4-landscape
   page, `t` naming the layout that draws it.

   Two rules run through the whole file.

   1. NOTHING FINDS ITS OWN HEIGHT. A page is a fixed canvas. Text that
      grows has nowhere to grow into, so every box is declared, every
      grid row is computed from the space actually left, and audit() at
      the foot of this file walks the finished document and reports any
      element that has escaped. The build refuses to ship a document
      that reports one.

   2. A PICTURE IS EITHER CROPPED OR MOUNTED, never accidentally
      letterboxed. `cover` fills and crops — photography, renders, film.
      `plt` mounts: contained, centred, on its own ground inside a
      hairline — drawings, sheets, boards, certificates, anything that
      would be lying if it were cropped.

   And one about which picture goes where: the archive holds several
   renders exported more than once under different names, and the last
   document printed three copies of one Abu Dhabi marina on three
   different pages. Every picture below is checked against every other
   by perceptual hash before it ships.
   ===================================================================== */

const RAW = new URLSearchParams(location.search).get('src') === 'raw';
const IMG = RAW ? '../assets/img/' : 'img/';
/* a handful of frames are stills pulled from the films, and live beside them
   in assets/video. Only the raw pass has to know that — imgprep writes every
   picture into img/ under one name. */
const FALLBACK = RAW
  ? ` onerror="if(!this.dataset.r){this.dataset.r=1;this.src='../assets/video/'+this.src.split('/').pop()}"`
  : '';

const F = (src, cap, cls) =>
  `<figure class="${cls || ''}"><img src="${IMG}${src}" alt=""${FALLBACK}>` +
  `${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;

/* page geometry, in mm — the same numbers print.html is built on */
const PW = 297, PH = 210, M = 14, GAP = 3.4;
const CW = PW - 2 * M;                 /* 269 mm of measure */
const BODY_TOP = 22.5, BODY_TOP_LOW = 39, BODY_BOT = 12;
const bodyH = lead => (PH - (lead ? BODY_TOP_LOW : BODY_TOP) - BODY_BOT);

const PAGES = [

/* ============================================================== FRONT */
{t:'cover'},
{t:'stm'},
{t:'toc'},
{t:'prof'},

/* ========================================================= CHAPTER 01 */
{t:'ch', img:'auh_cluster.jpg', num:'01', tocCode:'P·01',
 code:'Chapter one · Flagship', title:'UAE Digital<br>Twin', toc:'UAE Digital Twin',
 lede:'A national-scale digital twin of the United Arab Emirates, running in real time in <b>Unreal Engine</b>. I build the cities themselves — modelled in 3ds Max, textured in Substance, delivered through Datasmith, geolocated against GIS.',
 strip:['Client <b>UAE Ministry of Interior</b>','Employer <b>Tahaluf Al Emarat</b>','Scope <b>Seven emirates · national scale</b>','Status <b>In active development</b>']},

{t:'pipe', code:'1.1', title:'The pipeline', toc:'The pipeline',
 rt:'Satellite → GIS → 3ds Max → Datasmith → Unreal'},

{t:'ft', img:'auh_hero.jpg', code:'1.2', title:'Abu Dhabi', toc:'Abu Dhabi · Reem Island',
 tags:['Unreal Engine','3ds Max','Datasmith','GIS'],
 text:['One island, delivered like a specimen archive. Reem Island\'s fabric was built <b>building by building</b> — each one modelled, textured, named, tagged and collision-ready — from Repton School to Reem Mall to the mosque on the corner.',
       'Every block is pinned to its real latitude, so the twin can be flown, driven and simulated against the city it copies.'],
 spec:[['Delivered','117 buildings · Reem Island'],['LOD','100 — 200'],['Layers','Dashboards · events · assets']],
 cap:'Abu Dhabi from the air · in engine'},

{t:'grid', code:'1.2', title:'The island, block by block', toc:'Abu Dhabi · in engine',
 lead:'The same disciplined route runs under every city in the twin: footprint extraction, low-poly massing, UV and texture, Datasmith delivery, then geolocation and blueprints in engine. What comes out is not a fly-through — it is a place with coordinates.',
 cols:2, dark:true,
 items:[['auh_tw7.jpg','Reem Island from the west'],
        ['auh_street.jpg','Street level · the Reem Mall frontage'],
        ['auh_maryah.jpg','Al Maryah Island'],
        ['auh_grid.jpg','The whole grid, from altitude']]},

{t:'vault', code:'◆', title:'The asset vault', toc:'The asset vault · Reem Island',
 lead:'All eighteen named Reem Island buildings, pulled straight from the delivery archive. Each one is a real engine asset — materials, night lights, collision, pivot and tag — not a massing block standing in for one.',
 items:[['reem_c01.jpg','Al Wifaq Tower'],['reem_c19.jpg','Amaya Towers'],['reem_c03.jpg','Shams Meera Towers'],
        ['reem_c04.jpg','The Kite Residences'],['reem_c20.jpg','Marina Rise Tower'],['reem_c06.jpg','Hydra Towers'],
        ['reem_c07.jpg','Mangrove Place'],['reem_c08.jpg','Reem Hospital'],['reem_c10.jpg','Sigma Omega Towers'],
        ['reem_c11.jpg','Al Reem Bay Towers'],['reem_c12.jpg','DAMAC Marina Bay'],['reem_c13.jpg','Reem Mosque'],
        ['reem_c21.jpg','Paragon Bay Mall'],['reem_c15.jpg','Reem Mall'],['reem_c16.jpg','Sorbonne University'],
        ['reem_c17.jpg','Y Tower'],['reem_c18.jpg','ADNOC Station'],['reem_c22.jpg','Repton School · Rose Campus']]},

{t:'ft', img:'ajm_hero.jpg', code:'1.3', title:'Ajman', toc:'Ajman',
 tags:['Reality capture','Traffic splines','Interiors'],
 text:['The northern city rebuilt from the corniche inland — <b>same buildings, same signage lines, same kerb geometry</b>, now simulation-ready with traffic splines and asset markers.',
       'Deeper than façades: the museum fort and its heritage souk are walkable spaces in the twin, and the post office is modelled inside as well as out.'],
 spec:[['Depth','Exteriors + interiors'],['Layers','Traffic simulation · asset markers'],['Extent','Corniche → market district']],
 cap:'Ajman from the air · in engine'},

{t:'plate', img:'moi_realtwin.jpg', code:'1.3', toc:'Reality | digital twin', held:true,
 title:'One seam apart',
 sub:'Ajman, UAE · the photographed street and the same street in engine, split down the middle'},

{t:'es', code:'1.3', title:'Nothing approximated', toc:'Ajman · reality and twin',
 rt:'Photo survey → 3ds Max → Datasmith → Unreal',
 text:['The proof sits in a single frame. On one side of that seam is the real Ajman corner; on the other, the same corner inside the engine. The tower spacing, the shop signage, the kerb radius and the palm line all carry through.',
       'That is the whole test of a twin. A fly-through only has to look right from one camera. A simulation has to hold up when a vehicle turns the corner, when a crowd is routed down the pavement, when an incident is placed on the roundabout and the model has to answer for it.',
       'So the city is built to be walked into, not admired from altitude — dhow monument, market blocks, marina quarter, each one carrying its real position.'],
 spec:[['Method','Photo survey · georeferenced'],['Output','Simulation-ready street'],['Depth','Exterior and interior']],
 plates:[{f:1, cols:1, items:[['ajm_dhow.jpg','The dhow monument · rebuilt where it stands']]},
         {f:1, cols:1, items:[['ajm_resort.jpg','The resort and marina quarter · in engine']]}]},

{t:'trio', code:'1.3', title:'One building, three ways', toc:'Ajman · the rebuild sheet',
 dark:true,
 lead:'A municipality building on a street in Ajman, taken through the whole route in one sheet: the photograph, the massing, the textured asset. Put the three states beside each other and <b>any drift shows immediately</b> — a window band in the wrong place, a parapet a storey too high, a colour that never stood on the street.',
 sheet:['moi_muni.jpg','The rebuild sheet · before &amp; after','pltd'],
 pair:[['ajm_muni_real.jpg','Reality · photographed on the street'],
       ['ajm_muni.jpg','The twin · standing in engine']]},

{t:'grid', code:'1.3', title:'Inside the twin', toc:'Ajman · interiors &amp; the souk',
 lead:'Where it matters, the twin goes indoors. The post office is modelled inside as well as out, and the museum fort and its heritage souk are walkable rooms rather than façades with nothing behind them.',
 cols:2, dark:true,
 items:[['moi_post_street.jpg','Ajman Post Office · traffic simulation layer'],
        ['moi_post_int.jpg','…and inside it — interiors are in the twin too'],
        ['twin_ajm_souk_poster.jpg','The heritage souk · walked in engine'],
        ['twin_ajm_museum_poster.jpg','Ajman Museum · the fort in engine']]},

{t:'ft', img:'rak_hero.jpg', code:'1.4', title:'Ras Al<br>Khaimah', toc:'Ras Al Khaimah',
 tags:['GIS footprints','Coastal strip','Lagoon'],
 text:['The northern emirate, rebuilt from the mountains to the lagoon. <b>The corniche, the market district and the coastal strip</b> — every block extracted from GIS footprints, massed, textured and pinned to its real latitude.'],
 spec:[['Extent','Creek · lagoon · corniche'],['Source','GIS footprints + imagery']],
 cap:'Ras Al Khaimah · the creek from the air',
 film:[['rak_high.jpg','The high-altitude pass'],['rak_corniche.jpg','The corniche · waterfront row'],['rak_lagoon.jpg','The lagoon, at water level']]},

{t:'ft', img:'fjr_hero.jpg', code:'1.5', title:'Fujairah', toc:'Fujairah',
 tags:['Hajar foothills','Grand Mosque axis','Port'],
 text:['The east-coast emirate, from the Hajar foothills to the port. <b>The Grand Mosque axis, the Hamad Bin Abdullah boulevard and the oil terminal</b> — modelled, textured and running in the same national world.'],
 spec:[['Axis','Grand Mosque → city centre'],['Industry','Oil terminal · tank farm']],
 cap:'Fujairah · the boulevard in engine',
 film:[['fjr_mosque.jpg','Grand Mosque · the plaza'],['fjr_center.jpg','City centre · in engine'],['fjr_port.jpg','The oil terminal']]},

{t:'grid', code:'1.6', title:'The layer on top', toc:'The dashboard layer',
 lead:'The cities are the substrate. On top of them sits an <b>Arabic-first readiness dashboard</b>: the twin is not a fly-through but a working operational picture, with live data pinned into real geography.',
 cols:2, dark:true,
 items:[['moi_dash_ad.jpg','Readiness dashboard · Abu Dhabi'],
        ['moi_dash_coast.jpg','Readiness dashboard · the coast'],
        ['moi_dash_rak.jpg','Readiness dashboard · Ras Al Khaimah'],
        ['moi_city2.jpg','Massing and materials, live in the editor']]},

/* ========================================================= CHAPTER 02 */
{t:'ch', img:'fx_gug_model2.jpg', num:'02', tocCode:'P·02',
 code:'Chapter two · Flagship', title:'Museums,<br>fabricated', toc:'Museums, Fabricated',
 lede:'Three Saadiyat museums taken from design surface to cast panel at <b>Fibrex Construction Group</b> — production 3D, GRC panel drawings, steel shop sheets and point verification, then onto the factory floor.',
 strip:['Employer <b>Fibrex Construction Group</b>','Site <b>Saadiyat Island · Abu Dhabi</b>','Years <b>2022 — 23</b>','Scope <b>Production 3D · GRC · shop drawings</b>']},

{t:'ft', img:'fx_zayed_done.jpg', code:'2.1', title:'Zayed National<br>Museum', toc:'Zayed National Museum',
 tags:['Production 3D','Steel wings','GRC','Shop drawings'],
 text:['The museum\'s falcon-wing towers pass through the factory as thousands of unique elements. I produced the <b>production 3D models, panel breakdowns and steel shop-drawing sheets</b> — the geometry that lets a curved monument be cast flat, tracked, trucked and re-assembled on site.',
       'The museum opened on Saadiyat in 2025.'],
 spec:[['Architect','Foster + Partners'],['Employer','Fibrex Construction Group'],['Status','Built · open']],
 cap:'Standing on Saadiyat · the finished museum'},

{t:'es', code:'2.1', title:'The geometry behind the wing', toc:'Zayed · production geometry',
 text:['A wing is not drawn once. It is broken into steel ribs, panel families and fixing points, each carrying its own sheet, its own number and its own tolerance.',
       'The wing steel is modelled as it will be welded, not as it is drawn in the design model. Panels are mapped across the whole fabric so that no two neighbours share a number, and every bracket is detailed to the bolt.',
       'Get one sheet wrong and a piece arrives on Saadiyat that fits nothing. The discipline is the deliverable.'],
 spec:[['Deliverable','Production 3D · panel breakdowns'],['Sheets','Steel shop drawings, per element'],['Scale','Thousands of unique elements']],
 plates:[{f:1.25, cols:2, items:[['fx_zayed_struct.jpg','Wing steel · production model','pltd'],
                                 ['fx_zayed_all.jpg','Panel mapping · full fabric','pltd']]},
         {f:1, cols:2, items:[['fx_zayed_dwg.jpg','Steel shop sheet · Z8-018','plt'],
                              ['fx_zayed_brack.jpg','The bracket system','pltd']]}]},

{t:'grid', code:'2.1', title:'Down the line', toc:'Zayed · the factory floor',
 lead:'From the numbered layout to the saw, to the anchor, to the finished faceted stone — the same panel followed all the way through the works.',
 cols:3,
 items:[['fx_zayed_layout.jpg','The panel layout'],
        ['fx_zayed_rows.jpg','Racked in rows'],
        ['fx_zayed_anchor.jpg','Anchor sizing · marked in review'],
        ['fx_zayed_cnc.jpg','The mould, cut on the CNC bed'],
        ['fx_zayed_panel.jpg','A finished faceted panel'],
        ['fx_zayed_fact1.jpg','Wing assemblies, ready for delivery']]},

{t:'es', code:'2.2', title:'Guggenheim Abu Dhabi', toc:'Guggenheim Abu Dhabi',
 text:['For Gehry\'s colliding cones I prepared <b>panel production models and point-cloud verification geometry</b> — the survey-grade 3D that proves each cast GRC panel matches the design surface before it leaves the yard.',
       'A GRC panel is cast against a mould, not against the building. The verification geometry closes that gap: every fixing point is carried as a coordinate, checked against the cast piece in the yard, and signed off before it is loaded.',
       'By the time a panel reaches the crane, its position on the design surface has been proved twice — once in the production model, once on the survey table.'],
 spec:[['Architect','Gehry Partners'],['Scope','GRC panel production · verification'],['Site','Saadiyat Island · Abu Dhabi']],
 plates:[{f:1, cols:1, items:[['fx_gug_model.jpg','The colliding cones · presentation model','plt']]},
         {f:1.35, cols:2, items:[['fx_gug_panel.jpg','Panel families · colour-coded','pltp'],
                                 ['fx_gug_prod5.jpg','Panel production geometry','pltd']]}]},

{t:'grid', code:'2.2', title:'The paperwork behind one panel', toc:'Guggenheim · one panel',
 lead:'Behind a single cast piece sit the GRC sheet, its steel sub-frame, the fixing-point layout and the survey table that proves the panel lands exactly where the design surface says it should.',
 cols:2, cls:'plt',
 items:[['fx_gug_dwg_grc.jpg','GRC panel sheet'],
        ['fx_gug_dwg_steel.jpg','Steel sub-frame · shop drawing'],
        ['fx_gug_dwg_points.jpg','Fixing-point layout'],
        ['fx_gug_dwg_table.jpg','Survey coordinate table']]},

{t:'ft', img:'fx_nhm_render.jpg', code:'2.3', title:'Natural History<br>Museum', toc:'Natural History Museum',
 tags:['GRC production','Panel drawings','Mecanoo'],
 text:['Mecanoo\'s crystalline museum, taken through the mill panel by panel. I worked on the <b>production 3D models and GRC panel drawing sheets</b> behind the faceted, rock-like fabric, then followed the panels onto the factory floor: moulds, demoulding, checking, shipping.'],
 spec:[['Architect','Mecanoo'],['Scope','Production 3D · GRC panel sheets'],['Site','Saadiyat Island']],
 cap:'The museum on its point · from the water'},

{t:'grid', code:'2.3', title:'Mould, demould, check, ship', toc:'Natural History Museum · production',
 lead:'The faceted fabric is cast piece by piece. Every panel is drawn, moulded, demoulded, checked in the yard and shipped — and the photograph from the site is the same geometry, standing.',
 cols:4,
 items:[['fx_nhm_f2.jpg','Moulds in production'],['fx_nhm_f1.jpg','Demoulded panel'],
        ['fx_nhm_f3.jpg','Casting works'],['fx_nhm_f4.jpg','Checked in the yard'],
        ['fx_nhm_3.jpg','Production model of the faceted geometry','pltp'],
        ['fx_nhm_dwg.jpg','GRC panel production sheet','plt'],
        ['fx_nhm_1.jpg','On site · the museum going up'],
        ['fx_nhm_hero.jpg','From the water · the stepped terraces']]},

{t:'es', code:'2.4', title:'Amaala Red Sea Village', toc:'Amaala Red Sea Village',
 text:['On the Red Sea coast, a village of cellular pods. A <b>Grasshopper definition drives the cluster</b> from design surface to castable production units, so every pod can vary while staying buildable from the same family of moulds.',
       'The definition is the deliverable as much as the render: change the shoreline and the village re-packs itself, and the pods stay castable.',
       'That is the point of driving it parametrically. A hand-drawn cluster of a hundred cells would take a week to revise and would quietly drift out of the mould family. A definition revises in an afternoon and cannot.'],
 spec:[['Site','Amaala · Red Sea coast · KSA'],['Tooling','Grasshopper · Rhino · 3ds Max'],['Logic','One mould family, many pods'],['Output','Castable production units']],
 plates:[{f:1.5, cols:1, items:[['fx_amala_1.jpg','The pod cluster','pltd']]},
         {f:1, cols:2, items:[['fx_amala_v1.jpg','Shoreline aerial'],
                              ['fx_amala_gh.jpg','The Grasshopper definition','plt']]}]},

/* ========================================================= CHAPTER 03 */
{t:'ch', img:'tk_main.jpg', num:'03', tocCode:'P·03',
 code:'Chapter three · Independent', title:'Freelance<br>practice', toc:'Freelance Practice',
 lede:'Design and visualisation commissions carried alone from brief to final image — each with its own client, its own site and its own character.',
 strip:['Clients <b>Design-build · private</b>','Role <b>Design · visualisation</b>','Stage <b>Concept → client presentation</b>','Places <b>Rize · Tripoli · Beirut</b>']},

{t:'ft', img:'rz_bung_night.jpg', code:'3.1', title:'Bungalow Resort<br>Rize, Türkiye', toc:'Bungalow Resort — Rize',
 tags:['Hospitality','Mountain site','Concept → client'],
 text:['A mountain resort on a working tea plantation above Rize, drawn entirely from the tea service it sits in. The main lodge is a <b>teapot</b>; every guest unit is <b>a Turkish tea glass cut in half lengthwise and laid on its side</b>, its curved shell stepped along the terraced slope so each roof reads as another contour of the hillside.',
       'Developed from drone site survey through concept alternatives and eight client submissions to full presentation visuals.'],
 spec:[['Site','Tea terraces · Rize, Türkiye'],['Program','Teacup bungalows · teapot lodge · workshop'],['Stage','Concept → client presentation']],
 cap:'The guest unit at night · on the tea terrace'},

{t:'es', code:'3.1', title:'The hillside, twice', toc:'Rize · the site',
 text:['The plot was flown before it was drawn. The drone survey set the terrace lines, and the units were plotted straight onto the frame that recorded them.',
       'What the ground gave, the scheme kept: no terrace was cut flat to suit a building. The units sit along the contour lines the tea already follows, which is why the roofs read as another row of the plantation rather than as objects dropped on it.',
       'The hand studies came first and stayed useful — the site strategy and the schematic master plan were what the client actually argued with, across eight submissions.'],
 spec:[['Survey','Drone photogrammetry'],['Method','Units plotted on the real frame'],['Submissions','Eight, to the client']],
 plates:[{f:1.15, cols:2, items:[['tk_1.jpg','The site as found'],
                                 ['rz_top.jpg','Units plotted onto it','pltp']]},
         {f:1, cols:2, items:[['rz_sketch.jpg','Master plan · hand study','plt'],
                              ['rz_master.jpg','The schematic sketch','plt']]}]},

{t:'grid', code:'3.1', title:'Teapot and teacup', toc:'Rize · the concept drawings',
 lead:'The concept is literal and it is drawn that way. The lodge is a teapot, cut open floor by floor; the guest unit is a tea glass halved lengthwise and laid down, its curved shell carrying a green roof into the slope.',
 cols:2, cls:'plt',
 items:[['rz_teapot_3d.jpg','The teapot lodge · sectional cutaway','pltd'],
        ['tk_5.jpg','Design concept · the teapot lodge'],
        ['rz_main2.jpg','Teahouse restaurant · spatial concept'],
        ['tk_6.jpg','Design concept · the teacup unit']]},

{t:'es', code:'3.1', title:'The unit itself', toc:'Rize · the guest unit',
 dark:true,
 text:['Cut a Turkish tea glass in half down its length, lay it on its side, and you have the unit: a curved shell that is widest at the window wall and narrows to the back of the plan.',
       'The plan keeps the glass silhouette too — the waisted <b>hourglass</b> outline of an <i>ince belli</i> glass, drawn out at 5.99 × 8.42 m for the compact unit and 6.47 × 10.03 m for the family one.',
       'The shell is reinforced concrete under a green roof, so the unit carries the plantation over itself rather than interrupting it.'],
 spec:[['Units','Compact + family'],['Roof','Green roof over curved shell'],['Structure','Reinforced concrete shell']],
 plates:[{f:1.25, cols:2, items:[['rz_bung_form.jpg','The unit form · a half tea glass on its side','pltd'],
                                 ['rz_bungalow.jpg','The shell, from the back','pltd']]},
         {f:1, cols:2, items:[['tk_plan1.jpg','Unit plan · 5.99 × 8.42 m','plt'],
                              ['tk_plan2.jpg','Unit plan · 6.47 × 10.03 m','plt']]}]},

{t:'grid', code:'3.1', title:'The workshop and the terraces', toc:'Rize · workshop &amp; terraces',
 lead:'The tea workshop sits lowest, on the river terrace, where the leaf comes off the slope. Above it the lodge and the units step up the plantation.',
 cols:2, dark:true,
 items:[['rz_workshop.jpg','Tea workshop · on the river terrace'],
        ['tk_3.jpg','The workshop · from the water'],
        ['rz_updated.jpg','The resort on the terraces · aerial'],
        ['tk_7.jpg','The valley · perspective study','pltd']]},

{t:'grid', code:'3.2 — 3.4', title:'Cinema, library, interiors', toc:'Cinema, Library &amp; Interiors',
 lead:'Three smaller commissions, each carried alone from brief to final image. A cinema drum whose glowing crown does the marketing; a winter library in two structural characters, a cantilevered entry against a pitched reading hall; and two living-room interiors.',
 cols:2, dark:true,
 items:[['fr_cinema1.jpg','Cinema · the night crown'],['fr_cinema2.jpg','Cinema · from the boulevard'],
        ['fr_lib3.jpg','Library · the cantilever entry'],['fr_lib1.jpg','Library · the reading hall'],
        ['fr_int_eur.jpg','Living · European'],['fr_int_min.jpg','Living · minimal']]},

/* ========================================================= CHAPTER 04 */
{t:'ch', img:'at_4.jpg', num:'04', tocCode:'P·04',
 code:'Chapter four · Practice years', title:'Practice<br>years', toc:'Practice Years',
 lede:'Before the Gulf: architectural engineer at <b>LDRS Chehab &amp; Partners</b>, and the university flagships that pointed straight at real time — regeneration for UNDP, heritage diagnosis, competitions for Erbil, and a virtual-reality complex before VR was the job.',
 strip:['Practice <b>LDRS Chehab &amp; Partners</b>','Places <b>Tripoli · Beirut · Erbil</b>','Work <b>Regeneration · heritage · competitions</b>','Years <b>2016 — 2021</b>']},

{t:'ft', img:'sky_court.jpg', code:'4.1', title:'Skyfall Pavilion', toc:'Skyfall Pavilion — Erbil',
 tags:['Competition','VVIP palace','Perforated canopy'],
 text:['A VVIP palace beneath a single perforated canopy — <b>“a waterfall of sky”</b> — filtering Kurdistan\'s light into a palm court. Sixteen boards carried the philosophy, the sun studies, the terraced gardens and the plans; the court render is the argument in one image.'],
 spec:[['Concept','شلال السماء · a waterfall of sky'],['Program','Palace · gardens · reception']],
 cap:'The court · light through the canopy',
 film:[['sky_pano.jpg','The pavilion · wide panorama'],['sky_lawn.jpg','Across the lawn'],['sky_dark.jpg','Night aerial']]},

{t:'ft', img:'rm_hero.jpg', code:'4.2', title:'Royal Complex<br>Erbil', toc:'Royal Complex — Erbil',
 tags:['Competition','44-page book','Retail + towers'],
 text:['A lakeside “eyelid” mall crowned by a cable-stayed canopy, paired with <b>twin perforated towers holding a suspended sphere</b> — delivered as a full 44-page competition book: masterplan, programme acts, structure studies and the renders.'],
 spec:[['Client','Iraq Head of Ministry'],['Deliverable','Competition book · visuals']],
 cap:'Across the lake · dusk',
 film:[['rm_esc.jpg','Atrium · under the canopy'],['rm_roof.jpg','The roof garden'],['rm_towers.jpg','The twin towers · night']]},

{t:'ft', img:'at_1.jpg', code:'4.3', title:'Al Tall<br>Regeneration', toc:'Al Tall Regeneration — UNDP',
 tags:['3ds Max','Corona','Ladybug / Honeybee','Photogrammetry'],
 text:['A UNDP-backed regeneration of the Ottoman clock-tower square at the heart of Tripoli. I authored the <b>full 3D reconstruction and every visualisation</b>, then ran the science underneath: solar comfort, wind, shadow and pedestrian simulations that decided where people would actually sit, walk and stay.'],
 spec:[['Client','UNDP · Municipality of Tripoli'],['Practice','LDRS Architects'],['Role','Full 3D · visualisation · analysis']],
 cap:'The square, regenerated · the clock-tower axis'},

{t:'grid', code:'4.3', title:'The square at eye level', toc:'Al Tall · the square',
 lead:'The scheme was delivered as a full walkthrough film — the square the way a Tuesday afternoon would actually feel. These are frames from it, and from the render set beside it.',
 cols:2, dark:true,
 items:[['at_3.jpg','The fountain colonnade'],['at_2.jpg','The heritage frontage'],
        ['at_6.jpg','The terraced gardens'],['at_5.jpg','The promenade'],
        ['at_7.jpg','The clock tower from the water garden'],['tall_street_poster.jpg','Down the relaid tram street']]},

{t:'plate', img:'at_x.jpg', code:'4.3', toc:'Al Tall · the district',
 title:'The whole district, rebuilt',
 sub:'Tripoli · the Ottoman core reconstructed from photogrammetry, then regenerated',
 light:true},

{t:'grid', code:'4.3', title:'The evidence layer', toc:'Al Tall · the evidence layer',
 lead:'Design decisions argued with data — comfort zones, solstice shadows, wind velocity, pedestrian stay-places, commercial heat, and <b>algorithmically placed café locations</b> scored against the comfort map. Some layers were walked and counted by hand; others simulated in Grasshopper.',
 cols:4, cls:'plt', noteH:22,
 note:['<b>Comfort.</b> Annual and solstice comfort maps set where a person can actually stand still in July. The planting, the colonnade and the water were placed against those maps, not against a plan drawing.',
       '<b>Wind and shade.</b> Velocity and pressure across the square, and shadow-hour counts at the solstices, decided the depth of the arcade and the height of the tree canopy.',
       '<b>People and trade.</b> Stay-places were walked, counted and mapped by hand; the commercial-to-residential heatmap came from the same field notes. Café positions were then generated against the comfort surface rather than chosen.'],
 items:[['at_comfort.jpg','Comfort zones · summer'],['at_annual.jpg','Annual comfort'],
        ['at_wind.jpg','Wind velocity'],['at_shadow.jpg','Shadow hours · solstice'],
        ['at_ped.jpg','Pedestrian stay-places'],['at_cafe.jpg','Auto-placed cafés'],
        ['at_heat.jpg','Commercial heatmap'],['at_massplan.jpg','Photogrammetry base · the real district']]},

{t:'es', code:'4.4 / 4.5', title:'Heritage: two records', toc:'Mawlawiya &amp; Mar Semaan',
 text:['<b>Al Mawlawiya and the old souks.</b> Rehabilitation of the Mevlevi lodge gardens and the old souk edge in Tripoli — stone terraces, water channels and planting brought back around the historic tekke. Worked from the drawings to the ground: detailed design, bills of quantities, and supervision of the works on site.',
       '<b>Mar Semaan Monastery, 1878.</b> A field diagnosis in Zghorta — walking the vaults and walls to document cracks, settlement, water infiltration and fire damage, then mapping the pathologies and recommending anchoring and tie-rod interventions to hold the stone together.'],
 spec:[['Practice','LDRS Chehab &amp; Partners'],['Scope','Drawings · BOQ · supervision'],['Method','On-foot survey · photo record']],
 plates:[{f:1, cols:3, items:[['mw_1.jpg','Mawlawiya · the garden, restoration study'],
                              ['mw_3.jpg','Mawlawiya · the garden court'],
                              ['mw_2.jpg','Mawlawiya · terraces, study view']]},
         {f:1, cols:3, items:[['ms_1.jpg','Mar Semaan · the monastery'],
                              ['ms_5.jpg','Masonry record'],
                              ['ms_3.jpg','Interior survey']]}]},

{t:'ft', img:'y5_th1.jpg', code:'4.6', title:'Virtual Reality<br>Complex', toc:'Virtual Reality Complex',
 tags:['ARCH540','Mixed use','Data-driven','97 pages'],
 text:['A VR entertainment and education complex — <b>the first of its scale proposed in the region</b> — argued with a sixty-person survey, demographic infographics and programme analysis before a line was drawn, then delivered as a full urban set-piece with towers, an arena ring and a public realm.'],
 spec:[['Course','ARCH540 · Senior Project'],['Method','Survey · data · then design'],['Extras','Animation · research booklet']],
 cap:'The complex · the boulevard at dusk',
 film:[['y5_th3.jpg','The arena bowl'],['y5_brown.jpg','The complex on the shore'],['y5_th2.jpg','Street approach']]},

{t:'es', code:'4.6', title:'Argued on paper first', toc:'VR Complex · the boards',
 text:['Ninety-seven pages of survey, demographics and programme analysis sat under the design before a line was drawn.',
       'A sixty-person survey set the programme: what people in the region would actually come to a virtual-reality complex to do, how often, and at what price. The demographic infographics decided the mix; the mix decided the massing.',
       'The whole argument — research, programme, plans, structure and the renders — was then delivered as a single presentation board, with the research carried alongside it as a bound booklet.'],
 spec:[['Course','ARCH540 · Senior Project'],['Research','97 pages · 60-person survey'],['Delivered','One board · one booklet']],
 plates:[{f:1.25, tmpl:'1fr 0.46fr', items:[['y5_poster.jpg','The full presentation board','plt'],
                                            ['y5_bposter.jpg','The research booklet','plt']]},
         {f:1, tmpl:'1fr 1fr 0.34fr', items:[['y5_braer.jpg','The perforated towers'],
                                             ['y5_th4.jpg','The boulevard · dusk'],
                                             ['y5_plans.jpg','Plans · basement → fourth floor','plt']]}]},

{t:'es', code:'4.7 / 4.8', title:'Two university flagships', toc:'Antalya Skyscraper &amp; Green Mosque',
 text:['<b>Antalya skyscraper — the cliff edge.</b> Antalya\'s cliffs, missing their marker. The tower fuses a sky tower and a sea tower into one stratified monolith grown out of the rock face — anchored horizontally back into the cliff, and drawn to 1:800 below the waterline in sea elevation and sea section.',
       '<b>Green Mosque.</b> A mosque folded into a green star on the El Mina corniche — prayer hall, amphitheatre plaza and landscape terraces resolved in one faceted ground between the road and the sea.'],
 spec:[['Antalya','ARCH432 · Design VI'],['Mosque','ARCH431 · Design V'],['Sites','Düden cliffs · El Mina, Tripoli']],
 plates:[{f:1.2, cols:2, items:[['y4_sky_hero.jpg','Antalya · in site, the Düden cliffs'],
                                ['y4_mosque_hero.jpg','Green Mosque · the star on the corniche']]},
         {f:1, cols:2, items:[['y4_sky_persp.jpg','Antalya · the two perspectives','plt'],
                              ['y4_mosqueposter.jpg','Green Mosque · the full board','plt']]}]},

{t:'grid', code:'4.9', title:'Algoritm Rome', toc:'Algoritm Rome — kinetic façade',
 lead:'Two weeks at Sapienza University of Rome: forty hours of Algorithmic-Aided Design under <b>Arturo Tedeschi</b>, then forty hours designing and physically fabricating a smart kinetic façade — the first contact with the computational tools that now anchor the national twin.',
 cols:2,
 items:[['rome_1.jpg','The studio'],['rome_2.jpg','Fabricating the façade'],
        ['rome_3.jpg','Prototype assembly'],['rome_4.jpg','The final jury']]},

{t:'grid', code:'4.10', title:'The paper trail', toc:'The paper trail',
 lead:'Verifiable, dated, signed — the documents behind the curriculum vitae.',
 cols:5, cls:'plt', ar:0.80,
 items:[['cert_riba.jpg','RIBA · Part 1 statement'],['cert_bau.jpg','BAU · B.Arch certificate'],
        ['cert_fibrex.jpg','Fibrex · experience certificate'],['cert_ldrs.jpg','LDRS · employment reference'],
        ['cert_rome.jpg','Sapienza Rome · parametric programme'],
        ['cert_max.jpg','Autodesk · 3ds Max'],['cert_acad.jpg','Autodesk · AutoCAD'],
        ['cert_ic3.jpg','IC3 GS5 · digital literacy'],['cert_rhino.jpg','Rhino 7 · course'],
        ['cert_ourcity.jpg','Our City Our Way · design-build']]},

{t:'back'}
];

/* ================================================================ atoms */
const tagRow  = t => t ? `<div class="tags">${t.map(x => `<span>${x}</span>`).join('')}</div>` : '';
const specDl  = s => s ? `<dl>${s.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : '';
const headRow = p => `<div class="hd"><span class="cd">${p.code || ''}</span><h2>${p.title}</h2>` +
                     `<span class="ln"></span>${p.rt ? `<span class="rt">${p.rt}</span>` : ''}</div>`;
const leadRow = p => p.lead ? `<p class="lead">${p.lead}</p>` : '';

/* Fit n cells into a box. The row height is whatever is left over after the
   gaps, so a grid always finishes exactly on the bottom of its box — never
   short of it, never past it. `ar` asks for a shape instead, and is only
   honoured while it still fits. */
function fitRows(n, cols, availH, ar, availW) {
  const rows = Math.ceil(n / cols);
  const cw = ((availW || CW) - (cols - 1) * GAP) / cols;
  let ch = (availH - (rows - 1) * GAP) / rows;
  if (ar) ch = Math.min(ch, cw / ar);
  return {rows, cw, ch};
}

/* ================================================================ pages */
const R = {};

R.cover = () => `
  <div class="art">
    <img src="${IMG}auh_tw1.jpg" alt="">
    <div class="fade"></div>
  </div>
  <div class="kick"><i></i>Selected works · 2016 — 2026</div>
  <div class="edge">N 24.4539° &nbsp;E 54.3773°</div>
  <div class="band">
    <div class="bin">
      <h1 class="disp">Mohamad Hashem<br><b>Dankar</b></h1>
      <div class="rt">
        <p class="role">Architect · VR &amp; digital twin specialist<br>
          <em>An architect who builds cities twice.</em></p>
      </div>
    </div>
    <div class="meta">
      <span><b>Based</b>Abu Dhabi<br>United Arab Emirates</span>
      <span><b>Currently</b>VR Content Creator<br>UAE Ministry of Interior</span>
      <span><b>Previously</b>Fibrex Construction Group<br>LDRS Chehab &amp; Partners</span>
      <span><b>Contact</b>hashemx98@gmail.com<br>+971 50 970 2011</span>
    </div>
  </div>`;

R.stm = () => `
  <div class="kick"><i></i>Statement</div>
  <div class="in">
    <h1 class="disp">One city gets built in concrete.<br>
      The other gets built in <em>an engine.</em><br>I do both.</h1>
  </div>
  <div class="rule"></div>
  <div class="cols">
    <p>Six years across design practice, museum fabrication and government simulation. On Saadiyat Island I took three museums from design surface to cast panel — production 3D, GRC sheets, steel shop drawings, then the factory floor. A curved monument has to be cast flat, tracked, trucked and re-assembled true, and that is a geometry problem before it is anything else.</p>
    <p style="margin-top:3.4mm">In Abu Dhabi I build the <b>UAE's national digital twin</b>: seven emirates modelled, textured, geolocated and running in real time in Unreal Engine, with an Arabic-first operational layer sitting on top of them. Not a fly-through — a working picture of a country, accurate enough to be simulated against.</p>
    <p style="margin-top:3.4mm">Before the Gulf: regeneration for UNDP in Tripoli, heritage diagnosis on an 1878 monastery, competitions for Erbil, and a virtual-reality complex argued from a survey before a line was drawn. The through-line is the same at every scale — <b>build it accurately enough that it can be tested, not just admired.</b></p>
  </div>
  <div class="tally">
    ${[['22','Projects'],['07','Emirates in engine'],['03','Saadiyat museums'],
       ['117','Buildings · Reem Island'],['6+','Years in practice']]
      .map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}
  </div>`;

R.toc = (p, i, all) => {
  const groups = []; let cur = null;
  all.forEach((pg, n) => {
    if (!pg.toc) return;
    if (pg.t === 'ch') { cur = {name: pg.toc, code: pg.tocCode, page: n + 1, items: []}; groups.push(cur); }
    else if (cur) cur.items.push({n: pg.code, t: pg.toc, p: n + 1});
  });
  const half = Math.ceil(groups.length / 2);
  const col = g => g.map(gr =>
    `<h3><span>${gr.code} · ${gr.name}</span><span>${gr.page}</span></h3>` +
    gr.items.map(it => `<div class="row"><span class="n">${it.n}</span>` +
      `<span class="t">${it.t}</span><span class="p">${it.p}</span></div>`).join('')
  ).join('');
  return `
  <div class="art">
    <figure><img src="${IMG}auh_tw7.jpg" alt=""></figure>
    <div class="fade"></div>
    <div class="cap">Reem Island in engine · one hundred and seventeen buildings,<br>
      modelled, textured and pinned to their real latitude</div>
  </div>
  <div class="hd"><span class="cd">◆</span><h2>Contents</h2><span class="ln"></span>
    <span class="rt">Four chapters · twenty-two projects</span></div>
  <div class="bd toc">
    <div class="cols"><div>${col(groups.slice(0, half))}</div><div>${col(groups.slice(half))}</div></div>
  </div>`;
};

R.prof = () => `
  <div class="hd"><span class="cd">◆</span><h2>Profile &amp; credentials</h2><span class="ln"></span>
    <span class="rt">Abu Dhabi · United Arab Emirates</span></div>
  <div class="bd prof">
    <p class="big">Mohamad Hashem Dankar — architect (BAU, RIBA Part I), based in Abu Dhabi. <b>Six years across design practice, museum fabrication and government simulation</b>, working in English and Arabic, at every scale from a GRC bracket to a national twin.</p>
    <div class="two">
      <dl>
        <div><dt>Current</dt><dd>VR Content Creator — UAE Ministry of Interior (Tahaluf Al Emarat), Abu Dhabi</dd></div>
        <div><dt>Previously</dt><dd>Fibrex Construction Group, Saadiyat museums · LDRS Chehab &amp; Partners, Beirut–Tripoli · independent practice</dd></div>
        <div><dt>Education</dt><dd>B.Arch, Beirut Arab University — validated at RIBA Part 1 level</dd></div>
        <div><dt>Credentials</dt><dd>Autodesk Certified User, 3ds Max &amp; AutoCAD · IC3 GS5 · Sapienza Rome parametric programme</dd></div>
        <div><dt>Languages</dt><dd>Arabic · English · French</dd></div>
        <div><dt>Contact</dt><dd>hashemx98@gmail.com · +971 50 970 2011</dd></div>
      </dl>
      <div>
        <div class="kk">Toolchain</div>
        <div class="chips">${['Unreal Engine','3ds Max','Datasmith','Substance','Rhino + Grasshopper','Revit','AutoCAD','Corona / V-Ray','Twinmotion','Unity','Ladybug / Honeybee','Photoshop','GIS workflows'].map(c => `<span>${c}</span>`).join('')}</div>
        <div class="stats">
          <div><b>03</b><span>Saadiyat museums</span></div>
          <div><b>07</b><span>Emirates in engine</span></div>
          <div><b>117</b><span>Buildings · Reem Island</span></div>
          <div><b>6+</b><span>Years in practice</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="band">
    ${F('auh_cluster.jpg', 'P·01 · UAE Digital Twin')}
    ${F('fx_gug_model2.jpg', 'P·02 · Museums, fabricated')}
    ${F('tk_main.jpg', 'P·03 · Freelance practice')}
    ${F('at_4.jpg', 'P·04 · Practice years')}
  </div>`;

R.ch = p => `
  <div class="bleed">${F(p.img)}</div>
  <div class="veil" style="background:
    linear-gradient(90deg,rgba(8,11,14,.96) 0%,rgba(8,11,14,.86) 40%,rgba(8,11,14,.14) 78%,rgba(8,11,14,.30) 100%),
    linear-gradient(0deg,rgba(8,11,14,.92) 0%,rgba(8,11,14,.40) 15%,rgba(8,11,14,0) 30%)"></div>
  <div class="num">${p.num}</div>
  <div class="in">
    <div class="cd"><i></i>${p.code}</div>
    <h2 class="disp">${p.title}</h2>
    <p>${p.lede}</p>
  </div>
  <div class="strip">${p.strip.map(s => `<span>${s}</span>`).join('')}</div>`;

R.ft = p => `
  <div class="bleed">${F(p.img)}</div>
  <div class="veil" style="background:
    linear-gradient(90deg,rgba(8,11,14,.62) 0%,rgba(8,11,14,.12) 44%,rgba(8,11,14,0) 72%),
    linear-gradient(0deg,rgba(8,11,14,.66) 0%,rgba(8,11,14,0) 32%)"></div>
  ${p.cap ? `<div class="bcap">${p.cap}</div>` : ''}
  <div class="panel">
    <div class="cd"><i></i>${p.code}</div>
    <h2>${p.title}</h2>
    ${tagRow(p.tags)}
    ${p.text.map(t => `<p>${t}</p>`).join('')}
    ${specDl(p.spec)}
  </div>
  ${p.film ? `<div class="film" style="grid-template-columns:repeat(${p.film.length},44mm);height:27mm">
      ${p.film.map(f => F(f[0], f[1])).join('')}</div>` : ''}`;

R.plate = p => (p.held ? `
  <div class="hold"><img src="${IMG}${p.img}" alt=""${FALLBACK}></div>
  <div class="veil"></div>` : `
  <div class="bleed">${F(p.img)}</div>
  <div class="veil" style="background:
    linear-gradient(0deg,rgba(8,11,14,${p.light ? '.90' : '.82'}) 0%,rgba(8,11,14,.28) 24%,rgba(8,11,14,0) 48%),
    linear-gradient(180deg,rgba(8,11,14,.52) 0%,rgba(8,11,14,0) 18%)"></div>`) + `
  <div class="cd">${p.code}</div>
  <div class="cap"><div class="t disp">${p.title}</div><div class="s">${p.sub}</div></div>`;

R.grid = p => {
  const noteH = p.note ? (p.noteH || 22) : 0;
  const avail = bodyH(!!p.lead) - noteH - (noteH ? 4 : 0);
  const {ch} = fitRows(p.items.length, p.cols, avail, p.ar);
  return `
  ${headRow(p)}
  ${leadRow(p)}
  <div class="bd${p.lead ? ' low' : ''}">
    <div class="gr" style="grid-template-columns:repeat(${p.cols},minmax(0,1fr));
         grid-auto-rows:${ch.toFixed(2)}mm;height:${avail.toFixed(2)}mm">
      ${p.items.map(it => F(it[0], it[1], it[2] || p.cls || '')).join('')}
    </div>
    ${p.note ? `<div class="note" style="margin-top:4mm;column-count:${p.note.length}">
        ${p.note.map(t => `<p>${t}</p>`).join('')}</div>` : ''}
  </div>`;
};

R.vault = p => {
  const cols = 6, LBL = 5.2;
  const avail = bodyH(true);
  const rows = Math.ceil(p.items.length / cols);
  const cell = (avail - (rows - 1) * GAP) / rows;
  const pic = cell - LBL;
  return `
  ${headRow(p)}
  ${leadRow(p)}
  <div class="bd low">
    <div class="gr" style="grid-template-columns:repeat(${cols},minmax(0,1fr));
         grid-auto-rows:${cell.toFixed(2)}mm">
      ${p.items.map(it => `<div style="min-width:0">
          <figure class="pltd" style="height:${pic.toFixed(2)}mm">
            <img src="${IMG}${it[0]}" alt=""></figure>
          <div class="ucap" style="padding-top:1.2mm;font-size:5pt">${it[1]}</div>
        </div>`).join('')}
    </div>
  </div>`;
};

R.es = p => {
  const avail = bodyH(false);
  const tot = p.plates.reduce((a, r) => a + r.f, 0);
  const free = avail - (p.plates.length - 1) * GAP;
  const tmpl = p.plates.map(r => (free * r.f / tot).toFixed(2) + 'mm').join(' ');
  /* `tmpl` when the cells in a row are deliberately unequal — a plan drawn
     694 px wide and 2600 tall has no business in the same width as a render */
  const rows = p.plates.map(r =>
    `<div style="display:grid;gap:${GAP}mm;min-height:0;grid-template-columns:${
       r.tmpl || `repeat(${r.cols || 1},minmax(0,1fr))`}">
      ${r.items.map(it => F(it[0], it[1], it[2] || '')).join('')}</div>`).join('');
  return `
  ${headRow(p)}
  <div class="bd">
    <div class="es">
      <div class="col">
        ${p.kk ? `<div class="kk">${p.kk}</div>` : ''}
        ${p.text.map(t => `<p>${t}</p>`).join('')}
        ${specDl(p.spec)}
      </div>
      <div class="st" style="grid-template-rows:${tmpl}">${rows}</div>
    </div>
  </div>`;
};

/* One tall sheet and two frames beside it, all three the same height.
   The sheet is a portrait drawing, so it is given a column wide enough to
   nearly fill that height — anything narrower floats a 1244 px drawing in
   the middle of a black field — and the argument moves to the standfirst
   to buy the width back. */
R.trio = p => `
  ${headRow(p)}
  ${leadRow(p)}
  <div class="bd low">
    <div class="gr" style="grid-template-columns:112mm minmax(0,1fr);
         grid-template-rows:minmax(0,1fr);height:100%;align-content:stretch">
      ${F(p.sheet[0], p.sheet[1], p.sheet[2])}
      <div style="display:grid;grid-template-rows:repeat(2,minmax(0,1fr));gap:${GAP}mm;min-height:0">
        ${p.pair.map(x => F(x[0], x[1], x[2] || '')).join('')}
      </div>
    </div>
  </div>`;

R.pipe = p => {
  const STEPS = [
    ['01','Satellite / GIS','Imagery and footprints, georeferenced to the real coordinate frame'],
    ['02','2D extraction','Clean building outlines, district by district'],
    ['03','3D low-poly','LOD 100–200 massing, modelled in 3ds Max'],
    ['04','UV + texture','Box mapping · custom and emissive maps in Substance'],
    ['05','Datasmith','Pivots, naming, tags and collision, ready for engine'],
    ['06','Unreal Engine','Geolocation · blueprints · events · the dashboard layer']
  ];
  return `
  ${headRow(p)}
  <p class="lead one">Every city in the twin goes through the same disciplined route, built for <b>speed, consistency and real-time performance</b> at urban scale. When a landmark matters it is rebuilt properly: grey massing to fully textured, night-lit asset.</p>
  <div class="bd low">
    <div class="pipe">
      ${STEPS.map(([n, h, t]) => `<div class="st"><span class="n">${n}</span><h5>${h}</h5><p>${t}</p></div>`).join('')}
    </div>
    <div style="margin-top:9mm;font-family:'Space Mono',monospace;font-size:5.2pt;letter-spacing:.2em;
                text-transform:uppercase;color:var(--sig-d);padding-bottom:2.4mm;
                border-bottom:.25mm solid var(--rule-p)">
      The same building, twice — grey massing to night-lit asset</div>
    <div class="gr" style="grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:113mm;margin-top:4mm">
      ${F('moi_sigma.jpg', 'Sigma &amp; Omega towers · massing → textured night asset', 'pltd')}
      ${F('moi_mangroove.jpg', 'Mangrove complex · exploded texture set → assembled', 'pltd')}
    </div>
  </div>`;
};

R.back = () => `
  <div class="bleed">${F('auh_gate.jpg')}</div>
  <div class="veil" style="background:
    linear-gradient(0deg,rgba(8,11,14,.96) 10%,rgba(8,11,14,.80) 50%,rgba(8,11,14,.92) 100%)"></div>
  <div class="in">
    <div class="top">
      <div style="font-family:'Space Mono',monospace;font-size:5.8pt;letter-spacing:.34em;
                  text-transform:uppercase;color:var(--sig);margin-bottom:9mm">◆ &nbsp;Contact</div>
      <h2 class="disp">Let's build it <em>twice.</em></h2>
      <div class="links">
        <div><span class="k">Email</span><span class="v">hashemx98@gmail.com</span></div>
        <div><span class="k">Phone / WhatsApp</span><span class="v">+971 50 970 2011</span></div>
        <div><span class="k">Base</span><span class="v">Abu Dhabi<br>United Arab Emirates</span></div>
        <div><span class="k">Portfolio</span><span class="v">The live build runs<br>the same work in 3D</span></div>
      </div>
    </div>
    <div class="note2">
      The live portfolio runs this work in the browser — walkthrough film, a scroll-driven photogrammetry<br>
      capture, and <b>real engine assets you can orbit in 3D</b>.<br><br>
      © 2026 Mohamad Hashem Dankar &nbsp;·&nbsp; Real · Twin · N 24.4539° E 54.3773°
    </div>
  </div>`;

/* ================================================================ build */
const CHAP = {};
{
  let cur = '';
  PAGES.forEach((p, i) => {
    p.__n = i + 1;
    if (p.t === 'ch') cur = p.tocCode + ' · ' + p.toc;
    if (p.t === 'cover' || p.t === 'stm' || p.t === 'toc' || p.t === 'prof')
      cur = 'Mohamad Hashem Dankar · Architect';
    CHAP[i] = cur;
  });
}

const DARK = new Set(['cover', 'stm', 'ch', 'ft', 'plate', 'back']);
const OVER = new Set(['ft', 'ch', 'plate']);
const NOFOOT = new Set(['cover', 'back']);

const doc = document.getElementById('doc');
PAGES.forEach((p, i) => {
  const el = document.createElement('div');
  el.className = 'pg ly-' + p.t + ((DARK.has(p.t) || p.dark) ? ' dk' : '') + (p.held ? ' held' : '');
  el.innerHTML = R[p.t](p, i, PAGES);
  if (!NOFOOT.has(p.t)) {
    const f = document.createElement('div');
    f.className = 'foot' + (OVER.has(p.t) ? ' over' : '');
    /* on a feature the foot lives inside the panel, so it never straddles
       the seam between the dark panel and the picture beside it */
    if (p.t === 'ft') f.style.cssText = 'right:auto;width:102mm';
    if (p.t === 'toc') f.style.cssText = 'right:96mm';
    f.innerHTML = `<span>${CHAP[i]}</span><span class="pn">${String(i + 1).padStart(2, '0')}</span>`;
    el.appendChild(f);
  }
  doc.appendChild(el);
});
document.documentElement.dataset.pages = PAGES.length;

/* ================================================================ audit
   Every complaint the last document earned was a box that was allowed to
   grow past its page: a contents list running under a band of pictures, a
   folio printed across a panel of type. So the document checks itself.
   mkpdf.py reads window.__audit() and refuses to render a document that
   returns anything. */
window.__audit = () => {
  const bad = [];
  const mm = px => px / (96 / 25.4);
  document.querySelectorAll('.pg').forEach((pg, i) => {
    const pr = pg.getBoundingClientRect();
    const n = i + 1, t = PAGES[i].t;

    /* 1. content that has grown out of a box with a declared height */
    /* .ly-cover .bin is not on this list on purpose: Archivo at .85 line-height
       sets its ascenders outside the line box, so scrollHeight always reports a
       few px it is not in fact losing. The off-page check below still covers it. */
    pg.querySelectorAll('.bd,.lead,.es>.col,.toc .cols,.ly-ft .panel,.ly-ch .in,' +
                        '.ly-stm .cols,.note,.prof dd,.hd').forEach(el => {
      if (el.scrollHeight > el.clientHeight + 2)
        bad.push(`p${n} ${t}: .${(el.className || el.tagName).split(' ')[0]} clipped ` +
                 `(${el.scrollHeight - el.clientHeight}px over)`);
      if (el.scrollWidth > el.clientWidth + 2)
        bad.push(`p${n} ${t}: .${(el.className || el.tagName).split(' ')[0]} too wide ` +
                 `(${el.scrollWidth - el.clientWidth}px over)`);
    });

    /* 2. anything at all that has left the page. The layers that are meant
          to bleed — the picture behind a chapter opener, the veil over it,
          the band on the cover — are the exception, and only they. */
    const BLED = '.bleed,.veil,.art,.band';
    pg.querySelectorAll('*').forEach(el => {
      if (el.matches(BLED) || el.closest(BLED)) return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      if (r.bottom > pr.bottom + 1 || r.top < pr.top - 1 ||
          r.right > pr.right + 1 || r.left < pr.left - 1)
        bad.push(`p${n} ${t}: .${(el.className || el.tagName).split(' ')[0]} off page ` +
                 `(${mm(r.bottom - pr.bottom).toFixed(1)}mm below / ` +
                 `${mm(r.right - pr.right).toFixed(1)}mm right)`);
    });

    /* 3. the foot lane must be empty of everything but the foot.
          A feature's folio deliberately sits inside its dark panel — that
          is how it stays off the seam — so the panel itself is exempt and
          the things printed inside it are checked instead. */
    const foot = pg.querySelector('.foot');
    if (foot) {
      const fr = foot.getBoundingClientRect();
      pg.querySelectorAll('.hd,.lead,.gr,.note,.panel p,.panel dl,.panel h2,.panel .tags,' +
                          '.strip,.cap,.tally,.es .col,.toc .cols,.film,.ucap')
        .forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.bottom > fr.top + 1 && r.top < fr.bottom - 1 &&
              r.right > fr.left + 1 && r.left < fr.right - 1)
            bad.push(`p${n} ${t}: .${(el.className || el.tagName).split(' ')[0]} overlaps the folio`);
        });
    }
  });
  return bad;
};

/* every picture the document asks for, with the box it is drawn into —
   imgprep.py sizes each file to the box it actually occupies rather than
   to one number for the whole document */
window.__boxes = () => {
  const out = {};
  document.querySelectorAll('#doc img').forEach(im => {
    const name = im.getAttribute('src').split('/').pop();
    const r = im.getBoundingClientRect();
    const w = r.width / (96 / 25.4), h = r.height / (96 / 25.4);   /* mm */
    const fit = getComputedStyle(im).objectFit === 'contain';
    /* which plate it is mounted on: only a dark one may be matted out to the
       box, or a render with a black ground lands as a black rectangle in the
       middle of a white sheet */
    const fig = im.closest('figure');
    const cls = fig ? fig.className : '';
    const prev = out[name];
    /* a picture used twice is sized for the larger of its two boxes */
    if (!prev || w * h > prev.w * prev.h)
      out[name] = {w: +w.toFixed(2), h: +h.toFixed(2), fit: !!fit, cls: cls};
  });
  return out;
};
