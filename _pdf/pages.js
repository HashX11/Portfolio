/* =====================================================================
   Mohamad Hashem Dankar — portfolio PDF
   The PAGES array below IS the document. Each entry is one A4-landscape
   page; `t` picks the layout. Cell aspect ratios (`ar`) are chosen to
   match the source images so nothing is letterboxed or badly cropped.
   ===================================================================== */
const IMG = 'img/';
const F = (src, cap, cls) =>
  `<figure class="${cls || ''}"><img src="${IMG}${src}" alt="">${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;

const PAGES = [

/* ---------------------------------------------------------------- front */
{t:'cover'},
{t:'stm'},
{t:'prof'},
{t:'toc'},

/* ============================== P·01 ============================== */
{t:'div', img:'moi_dash_ad.jpg', num:'01', code:'Chapter P·01 · Flagship', tocCode:'P·01',
 title:'UAE Digital<br>Twin', toc:'UAE Digital Twin',
 lede:'A national-scale digital twin of the United Arab Emirates, running in real time in <b>Unreal Engine</b>. I build the cities themselves — modelled in 3ds Max, textured in Substance, delivered through Datasmith, geolocated with GIS data.',
 strip:['Client <b>UAE Ministry of Interior</b>','Employer <b>Tahaluf Al Emarat</b>','Scope <b>7 Emirates · national scale</b>','Status <b>In active development</b>']},

{t:'pipe', code:'1.1', title:'The pipeline', toc:'The pipeline',
 rt:'Satellite → GIS → 3ds Max → Datasmith → Unreal'},

{t:'hero', img:'auh_hero.jpg', code:'1.2', title:'Abu Dhabi', toc:'Abu Dhabi · Reem Island',
 tags:['Unreal Engine','3ds Max','Datasmith','GIS'],
 text:['One island, delivered like a specimen archive. Reem Island\'s fabric was built <b>building by building</b> — each one modelled, textured, named, tagged and collision-ready — from Repton School to Reem Mall to the mosque on the corner.',
       'Every block is pinned to its real latitude, so the twin can be flown, driven and simulated against the city it copies.'],
 spec:[['Delivered','117 buildings · Reem Island'],['LOD','100 — 200'],['Layers','Dashboards · events · assets']],
 cap:'Abu Dhabi from the air · in engine'},

{t:'grid', code:'1.2', title:'The island, block by block', toc:'Abu Dhabi · from the air',
 lead:'The same disciplined route runs under every city in the twin: footprint extraction, low-poly massing, UV and texture, Datasmith delivery, then geolocation and blueprints in engine.',
 cols:2, ar:1.64, dark:true,
 items:[['reem_ue1.jpg','The island in engine · Gate Towers quarter'],
        ['auh_gate.jpg','The headland quarter · in engine'],
        ['auh_cluster.jpg','Tower cluster on the channel'],
        ['auh_maryah.jpg','Al Maryah island · in engine']]},

{t:'grid', code:'◆', title:'The asset vault', toc:'The asset vault · Reem Island',
 lead:'All eighteen named Reem Island buildings, pulled straight from the delivery archive — each one a real engine asset with materials, night lights and collision, not a massing block.',
 cols:6, ar:0.80, dark:true, cls:'fitd',
 items:[['reem_c01.jpg','Al Wifaq Tower'],['reem_c19.jpg','Amaya Towers'],['reem_c03.jpg','Shams Meera Towers'],
        ['reem_c04.jpg','The Kite Residences'],['reem_c20.jpg','Marina Rise Tower'],['reem_c06.jpg','Hydra Towers'],
        ['reem_c07.jpg','Mangrove Place'],['reem_c08.jpg','Reem Hospital'],['reem_c10.jpg','Sigma Omega Towers'],
        ['reem_c11.jpg','Al Reem Bay Towers'],['reem_c12.jpg','DAMAC Marina Bay'],['reem_c13.jpg','Reem Mosque'],
        ['reem_c21.jpg','Paragon Bay Mall'],['reem_c15.jpg','Reem Mall'],['reem_c16.jpg','Sorbonne University'],
        ['reem_c17.jpg','Y Tower'],['reem_c18.jpg','ADNOC Station'],['reem_c22.jpg','Repton School · Rose Campus']]},

{t:'hero', img:'ajm_hero.jpg', code:'1.3', title:'Ajman', toc:'Ajman',
 tags:['Reality capture','Traffic splines','Interiors'],
 text:['The northern city rebuilt from the corniche inland — <b>same buildings, same signage lines, same curb geometry</b>, now simulation-ready with traffic splines and asset markers.',
       'Deeper than façades: the Ajman Museum fort and its heritage souk are walkable spaces in the twin, and the post office is modelled inside as well as out.'],
 spec:[['Depth','Exteriors + interiors'],['Layers','Traffic simulation · asset markers']],
 cap:'Ajman from the air · in engine'},

{t:'tp', code:'1.3', title:'One seam apart', toc:'Ajman · reality and twin',
 text:['The proof sits in a single frame: the real Ajman corner on the left, the same corner inside the engine on the right, split down the middle.',
       'Nothing is approximated across that seam — the tower spacing, the shop signage, the kerb radius and the palm line all carry through.',
       'That is the whole test of a twin. A fly-through only has to look right from one camera; a simulation has to hold up when a vehicle turns the corner, when a crowd is routed down the pavement, when an incident is placed on the roundabout and the model has to answer for it.',
       'So the city is built to be walked into, not admired from altitude — dhow monument, market blocks, marina quarter, each one carrying its real position.'],
 spec:[['Method','Photo survey → 3ds Max → Datasmith'],['Output','Simulation-ready street'],['Extent','Corniche → market district']],
 plates:[{h:'86mm', items:[['moi_realtwin.jpg','Reality | digital twin · one seam apart','fitp']]},
         {h:'auto', cols:3, items:[['ajm_dhow.jpg','Dhow monument · street level'],
                                   ['ajm_ba.jpg','The market blocks · in engine'],
                                   ['ajm_resort.jpg','Resort &amp; marina quarter']]}]},

{t:'trio', code:'1.3', title:'One building, three ways', toc:'Ajman · the rebuild sheet',
 lead:'The same municipality building as a before-and-after rebuild sheet, as it really stands on the street, and as a finished asset inside the twin.',
 sheet:['moi_muni.jpg','The rebuild sheet · before &amp; after','sheet'],
 pair:[['ajm_muni_real.jpg','Reality · photographed on the street'],
       ['ajm_muni.jpg','The twin · standing in engine']]},

{t:'grid', code:'1.3', title:'Inside the twin', toc:'Ajman · interiors &amp; the souk',
 lead:'Where it matters, the twin goes indoors. The post office is modelled inside as well as out, and the museum fort and its heritage souk are walkable rooms, not façades.',
 cols:2, ar:1.64, dark:true,
 items:[['moi_post_street.jpg','Ajman Post Office · traffic simulation layer'],
        ['moi_post_int.jpg','…and inside it — interiors are in the twin too'],
        ['twin_ajm_souk_poster.jpg','The heritage souk · walked in engine'],
        ['twin_ajm_museum_poster.jpg','Ajman Museum · the fort in engine']]},

{t:'hero', img:'rak_hero.jpg', code:'1.4', title:'Ras Al Khaimah', toc:'Ras Al Khaimah',
 tags:['GIS footprints','Coastal strip','Lagoon'],
 text:['The northern emirate, rebuilt from the mountains to the lagoon. <b>The corniche, the market district and the coastal strip</b> — every block extracted from GIS footprints, massed, textured and pinned to its real latitude.'],
 spec:[['Extent','Creek · lagoon · corniche'],['Source','GIS footprints + imagery']],
 cap:'Ras Al Khaimah · the creek from the air',
 film:[['rak_tw9.jpg','High-altitude pass'],['rak_corniche.jpg','The corniche · waterfront row'],['rak_tw2.jpg','The peninsula · creek &amp; Gulf']]},

{t:'hero', img:'fjr_hero.jpg', code:'1.5', title:'Fujairah', toc:'Fujairah',
 tags:['Hajar foothills','Grand Mosque axis','Port'],
 text:['The east-coast emirate, from the Hajar foothills to the port. <b>The Grand Mosque axis, the Hamad Bin Abdullah boulevard and the oil terminal</b> — modelled, textured and running in the same national world.'],
 spec:[['Axis','Grand Mosque → city centre'],['Industry','Oil terminal · tank farm']],
 cap:'Fujairah · the boulevard in engine',
 film:[['fjr_mosque.jpg','Grand Mosque · the plaza'],['fjr_center.jpg','City centre · in engine'],['fjr_port.jpg','The oil terminal']]},

{t:'grid', code:'1.6', title:'The layer on top', toc:'The dashboard layer',
 lead:'The cities are the substrate. On top of them sits an <b>Arabic-first readiness dashboard</b> — the twin is not a fly-through, it is a working operational picture with live data pinned into real geography.',
 cols:2, ar:1.64, dark:true,
 items:[['moi_dash_coast.jpg','Readiness dashboard · the coast'],
        ['moi_dash_pen.jpg','Readiness dashboard · the peninsula'],
        ['moi_dash_rak.jpg','Readiness dashboard · Ras Al Khaimah'],
        ['moi_city2.jpg','Massing and materials, live in the editor']]},

/* ============================== P·02 ============================== */
{t:'div', img:'museum-track_poster.jpg', num:'02', code:'Chapter P·02 · Flagship', tocCode:'P·02',
 title:'Museums,<br>fabricated', toc:'Museums, Fabricated',
 lede:'Three Saadiyat museums taken from design surface to cast panel at <b>Fibrex Construction Group</b> — production 3D, GRC panel drawings, steel shop sheets and point verification, then onto the factory floor.',
 strip:['Employer <b>Fibrex Construction Group</b>','Site <b>Saadiyat Island · Abu Dhabi</b>','Years <b>2022 — 23</b>','Scope <b>Production 3D · GRC · shop drawings</b>']},

{t:'hero', img:'fx_zayed_done.jpg', code:'2.1', title:'Zayed National<br>Museum', toc:'Zayed National Museum',
 tags:['Production 3D','Steel wings','GRC','Shop drawings'],
 text:['The museum\'s falcon-wing towers pass through the factory as thousands of unique elements. I produced the <b>production 3D models, panel breakdowns and steel shop-drawing sheets</b> — the geometry that lets a curved monument be cast flat, tracked, trucked and re-assembled on site.',
       'The museum opened on Saadiyat in 2025.'],
 spec:[['Architect','Foster + Partners'],['Employer','Fibrex Construction Group'],['Status','Built · open']],
 cap:'Standing on Saadiyat · the finished museum'},

{t:'tp', code:'2.1', title:'The geometry behind the wing', toc:'Zayed · the production geometry',
 text:['A wing is not drawn once. It is broken into steel ribs, panel families and fixing points, each carrying its own sheet, its own number and its own tolerance.',
       'That paperwork is what lets a curved monument be cast flat and re-assembled true on site.',
       'The wing steel is modelled as it will be welded, not as it is drawn in the design model. Panels are mapped across the whole fabric so that no two neighbours share a number, and every bracket is detailed to the bolt.',
       'Get one sheet wrong and a piece arrives on Saadiyat that fits nothing. The discipline is the deliverable.'],
 spec:[['Deliverable','Production 3D · panel breakdowns'],['Sheets','Steel shop drawings per element'],['Scale','Thousands of unique elements']],
 plates:[{h:'92mm', cols:2, items:[['fx_zayed_struct.jpg','Wing steel · production model'],
                                   ['fx_zayed_all.jpg','Panel mapping · full fabric']]},
         {h:'auto', cols:2, items:[['fx_zayed_dwg.jpg','Steel shop sheet · Z8-018','fit'],
                                   ['fx_zayed_brack.jpg','Bracket system']]}]},

{t:'grid', code:'2.1', title:'Down the line', toc:'Zayed · the factory floor',
 lead:'From the numbered layout to the saw, to the anchor, to the finished faceted stone — the same panel followed all the way through the works.',
 cols:3, ar:1.15,
 items:[['fx_zayed_layout.jpg','The panel layout'],
        ['fx_zayed_rows.jpg','Racked in rows'],
        ['fx_zayed_anchor.jpg','Anchor sizing · marked in review'],
        ['fx_zayed_fact1.jpg','Factory · wing assemblies'],
        ['fx_zayed_fact2.jpg','Steel assembly'],
        ['fx_zayed_fact3.jpg','Ready for delivery','fitp']]},

{t:'hero', img:'fx_gug_model3.jpg', code:'2.2', title:'Guggenheim<br>Abu Dhabi', toc:'Guggenheim Abu Dhabi',
 tags:['GRC panels','Point verification','Production 3D'],
 text:['For Gehry\'s colliding cones I prepared <b>panel production models and point-cloud verification geometry</b> — the survey-grade 3D that proves each cast GRC panel matches the design surface before it leaves the yard.'],
 spec:[['Architect','Gehry Partners'],['Scope','GRC panel production · verification']],
 cap:'The museum on the point · presentation model'},

{t:'grid', code:'2.2', title:'The paperwork behind one panel', toc:'Guggenheim · one panel',
 lead:'Behind a single cast piece sit the GRC sheet, its steel sub-frame, the fixing points and the survey table that proves the panel lands exactly where the design surface says it should.',
 cols:3, ar:1.35,
 after:'<div style="margin-top:6mm;padding-top:4mm;border-top:.3mm solid var(--line);column-count:2;column-gap:9mm;font-size:7.4pt;line-height:1.5;color:var(--mut)"><p style="margin-bottom:2.6mm"><b style="color:var(--tx);font-weight:500">Why the survey table matters.</b> A GRC panel is cast against a mold, not against the building. The verification geometry closes that gap: every fixing point is carried as a coordinate, checked against the cast piece in the yard, and signed off before it is loaded.</p><p>By the time a panel reaches the crane its position on the design surface has already been proved twice — once in the production model, once on the survey table.</p></div>',
 items:[['fx_gug_model.jpg','Gehry\'s colliding cones · the presentation model','fitp'],
        ['fx_gug_3d1.jpg','Production massing'],
        ['fx_gug_prod5.jpg','Panel production geometry'],
        ['fx_gug_panel.jpg','Panel families · colour-coded','fitp'],
        ['fx_gug_dwg_grc.jpg','GRC panel sheet','fit'],
        ['fx_gug_dwg_steel.jpg','Steel sub-frame · shop drawing','fit']]},

{t:'hero', img:'fx_nhm_hero.jpg', code:'2.3', title:'Natural History<br>Museum', toc:'Natural History Museum Abu Dhabi',
 tags:['GRC production','Panel drawings','Mecanoo'],
 text:['Mecanoo\'s crystalline museum, taken through the mill panel by panel. I worked on the <b>production 3D models and GRC panel drawing sheets</b> behind the faceted rock-like fabric, then followed the panels onto the factory floor: molds, demolding, checking, shipping.'],
 spec:[['Architect','Mecanoo'],['Scope','Production 3D · GRC panel sheets'],['Site','Saadiyat Island']],
 cap:'The museum on its point · from the water'},

{t:'grid', code:'2.3', title:'Mold, demold, check, ship', toc:'Natural History Museum · production',
 lead:'The faceted fabric is cast piece by piece. Every panel is drawn, molded, demolded, checked in the yard and shipped — and the site photograph is the same geometry, standing.',
 cols:4, ar:0.90,
 items:[['fx_nhm_f2.jpg','Molds in production'],['fx_nhm_f1.jpg','Demolded panel'],
        ['fx_nhm_f3.jpg','Casting works'],['fx_nhm_f4.jpg','Checked in the yard'],
        ['fx_nhm_3.jpg','Production model of the faceted geometry','fitp'],
        ['fx_nhm_dwg.jpg','GRC panel production sheet','fit'],
        ['fx_nhm_1.jpg','On site · the museum going up'],
        ['fx_nhm_render.jpg','From the water · the stepped terraces','fitp']]},

{t:'tp', code:'2.4', title:'Amaala Red Sea Village', toc:'Amaala Red Sea Village',
 text:['On the Red Sea coast, a village of cellular pods. A <b>Grasshopper definition drives the cluster</b> from design surface to castable production units, so every pod can vary while staying buildable from the same family of molds.',
       'The definition is the deliverable as much as the render: change the shoreline and the village re-packs itself, and the pods stay castable.',
       'That is the point of driving it parametrically. A hand-drawn cluster of a hundred cells would take a week to revise and would quietly drift out of the mold family; a definition revises in an afternoon and cannot.'],
 spec:[['Site','Amaala · Red Sea coast · KSA'],['Tooling','Grasshopper · Rhino · 3ds Max'],['Logic','One mold family, many pods'],['Output','Castable production units']],
 plates:[{h:'96mm', items:[['fx_amala_1.jpg','The pod cluster']]},
         {h:'auto', cols:2, items:[['fx_amala_v1.jpg','Shoreline aerial'],
                                   ['fx_amala_gh.jpg','The Grasshopper definition','fit']]}]},

/* ============================== P·03 ============================== */
{t:'div', img:'rz_fix.jpg', num:'03', code:'Chapter P·03 · Independent', tocCode:'P·03',
 title:'Freelance<br>practice', toc:'Freelance Practice',
 lede:'Design and visualisation commissions carried alone from brief to final image — each with its own client, site and character.',
 strip:['Clients <b>Design-build · private</b>','Role <b>Design · visualisation</b>','Stage <b>Concept → client presentation</b>']},

{t:'hero', img:'tk_main.jpg', code:'3.1', title:'Bungalow Resort<br>Rize, Türkiye', toc:'Bungalow Resort — Rize, Türkiye',
 tags:['Hospitality','Mountain site','Concept → client'],
 text:['A mountain resort on a working tea plantation above Rize, drawn entirely from the tea service it sits in. The main lodge is a <b>teapot</b>; every guest unit is <b>a Turkish teacup cut in half lengthwise and laid on its side</b> — not a barrel — its curved shell stepped along the terraced slope so each roof reads as another contour of the hillside.',
       'Developed from drone site survey through concept alternatives and eight client submissions to full presentation visuals.'],
 spec:[['Site','Tea terraces · Rize, Türkiye'],['Program','Teacup bungalows · teapot lodge · tea workshop'],['Stage','Concept → client presentation']],
 cap:'The resort · on the tea terraces'},

{t:'tp', code:'3.1', title:'The hillside, twice', toc:'Rize · the site',
 text:['The plot was flown before it was drawn. The drone survey set the terrace lines, and the units were plotted straight onto the frame that recorded them.',
       'What the ground gave, the scheme kept: no terrace was cut flat to suit a building. The units sit along the contour lines the tea already follows, which is why the roofs read as another row of the plantation rather than as objects dropped on it.',
       'The hand studies came first and stayed useful — the site strategy and the schematic sketch were what the client actually argued with across eight submissions.'],
 spec:[['Survey','Drone photogrammetry'],['Method','Units plotted onto the real frame'],['Submissions','Eight, to the client']],
 plates:[{h:'82mm', cols:2, items:[['tk_1.jpg','The site as found'],['rz_top.jpg','Units plotted on it']]},
         {h:'auto', cols:2, items:[['rz_sketch.jpg','Site strategy · hand study','fit'],
                                   ['rz_master.jpg','The schematic sketch','fit']]}]},

{t:'grid', code:'3.1', title:'Teapot and teacup', toc:'Rize · the concept drawings',
 lead:'The concept is literal and it is drawn that way. The lodge is a teapot in axonometric; the guest unit is a teacup halved lengthwise and laid down, its curved shell carrying a green roof into the slope.',
 cols:2, ar:1.64, cls:'fit',
 items:[['tk_5.jpg','Design concept · the teapot lodge'],
        ['tk_6.jpg','Design concept · the teacup unit'],
        ['rz_main2.jpg','Teahouse · architectural spatial concept'],
        ['rz_main1.jpg','Teahouse restaurant · floor plan &amp; terrace layout']]},

{t:'tp', code:'3.1', title:'The unit itself', toc:'Rize · the guest unit',
 text:['Cut a Turkish tea glass in half down its length, lay it on its side, and you have the unit: a curved shell that is widest at the window wall and narrows to the back of the plan.',
       'The plan keeps the glass silhouette too — the waisted <b>hourglass</b> outline of an ince belli glass, drawn out at 5.99 × 8.42 m and 6.47 × 10.03 m.'],
 spec:[['Units','Compact + family'],['Roof','Green roof over curved shell'],['Structure','Reinforced concrete shell']],
 plates:[{h:'88mm', cols:2, items:[['rz_bung_form.jpg','The unit form · a half teacup on its side','fitd'],
                                   ['rz_bung_night.jpg','The unit at night','fitp']]},
         {h:'auto', cols:2, items:[['tk_plan1.jpg','Unit plan · 5.99 × 8.42 m','fit'],
                                   ['tk_plan2.jpg','Unit plan · 6.47 × 10.03 m','fit']]}]},

{t:'grid', code:'3.1', title:'The workshop and the terraces', toc:'Rize · workshop &amp; terraces',
 lead:'The tea workshop sits lowest, on the river terrace, where the leaf comes off the slope. Above it the lodge and the units step up the plantation.',
 cols:2, ar:1.64, dark:true,
 items:[['rz_workshop.jpg','Tea workshop · on the river terrace'],
        ['tk_3.jpg','The workshop · from the water'],
        ['rz_updated.jpg','The resort on the terraces · aerial'],
        ['tk_7.jpg','The valley · perspective study','fit']]},

{t:'grid', code:'3.2 — 3.4', title:'Cinema, library, interiors', toc:'Cinema, Library &amp; Interiors',
 lead:'Three smaller commissions, each carried alone from brief to final image. A cinema drum with a glowing crown — the night identity does the marketing. A winter library in two structural characters, a cantilevered entry against a pitched reading hall. And interiors: two living-room characters and a mall atrium.',
 cols:2, ar:2.50, dark:true,
 items:[['fr_cinema1.jpg','Cinema · night crown'],['fr_cinema2.jpg','Cinema · from the boulevard'],
        ['fr_lib2.jpg','Library · cantilever entry'],['fr_lib3.jpg','Library · across the lawn'],
        ['fr_int_eur.jpg','Living · European'],['fr_int_mall.jpg','Retail atrium']]},

/* ============================== P·04 ============================== */
{t:'div', img:'at_x.jpg', num:'04', code:'Chapter P·04 · Practice years', tocCode:'P·04',
 title:'Practice<br>years', toc:'Practice Years',
 lede:'Before the Gulf: architectural engineer at <b>LDRS Chehab &amp; Partners</b>, and the university flagships that pointed straight at real time — regeneration for UNDP, heritage diagnosis, competitions for Erbil, and a virtual-reality complex before VR was the job.',
 strip:['Practice <b>LDRS Chehab &amp; Partners</b>','Place <b>Tripoli · Beirut · Erbil</b>','Work <b>Regeneration · heritage · competitions</b>']},

{t:'hero', img:'sky_court.jpg', code:'4.1', title:'Skyfall Pavilion', toc:'Skyfall Pavilion — Erbil',
 tags:['Competition','VVIP palace','Perforated canopy'],
 text:['A VVIP palace beneath a single perforated canopy — <b>“a waterfall of sky”</b> — filtering Kurdistan\'s light into a palm court. Sixteen boards carried the philosophy, sun studies, terraced gardens and plans; the court render is the argument in one image.'],
 spec:[['Concept','شلال السماء · waterfall of sky'],['Program','Palace · gardens · reception']],
 cap:'The court · light through the canopy',
 film:[['sky_ext.jpg','The palm court · under the canopy'],['sky_lawn.jpg','Across the lawn'],['sky_dark.jpg','Night aerial']]},

{t:'hero', img:'rm_hero.jpg', code:'4.2', title:'Royal Complex<br>Erbil', toc:'Royal Complex — mall &amp; twin towers',
 tags:['Competition','44-page book','Retail + towers'],
 text:['A lakeside “eyelid” mall crowned by a cable-stayed canopy, paired with <b>twin perforated towers holding a suspended sphere</b> — delivered as a full 44-page competition book: masterplan, program acts, structure studies and the renders.'],
 spec:[['Client','Iraq Head of Ministry'],['Deliverable','Competition book · visuals']],
 cap:'Across the lake · dusk',
 film:[['rm_esc.jpg','Atrium · under the canopy'],['rm_roof.jpg','Roof garden'],['rm_towers.jpg','The twin towers · night']]},

{t:'hero', img:'at_1.jpg', code:'4.3', title:'Al Tall<br>Regeneration', toc:'Al Tall Regeneration — UNDP',
 tags:['3ds Max','Corona','Ladybug / Honeybee','Photogrammetry'],
 text:['A UNDP-backed regeneration of the Ottoman clock-tower square at the heart of Tripoli. I authored the <b>full 3D reconstruction and every visualisation</b>, then ran the science underneath: solar comfort, wind, shadow and pedestrian simulations that shaped where people would actually sit, walk and stay.'],
 spec:[['Client','UNDP · Municipality of Tripoli'],['Practice','LDRS Architects'],['Role','Full 3D · visualisation · analysis']],
 cap:'The square, regenerated · clock-tower axis'},

{t:'grid', code:'4.3', title:'The square at eye level', toc:'Al Tall · the square',
 lead:'The scheme was delivered as a full walkthrough film — the square the way a Tuesday afternoon would actually feel. These are frames from it and from the render set beside it.',
 cols:2, ar:2.50, dark:true,
 items:[['at_3.jpg','Fountain colonnade'],['at_2.jpg','Heritage frontage'],['at_6.jpg','Terraced gardens'],
        ['at_5.jpg','Promenade'],['at_4.jpg','The square at night'],['tall_street_poster.jpg','Down the relaid tram street']]},

{t:'grid', code:'4.3', title:'The evidence layer', toc:'Al Tall · the evidence layer',
 lead:'Design decisions argued with data — annual comfort zones, solstice shadows, wind velocity, pedestrian stay-places and commercial heat, down to <b>algorithmically placed café locations</b> scored against the comfort map. Some layers were walked and counted by hand; others were simulated in Grasshopper with Ladybug and Honeybee.',
 cols:4, ar:1.495, cls:'fit',
 after:'<div style="margin-top:6mm;padding-top:4mm;border-top:.3mm solid var(--line);column-count:3;column-gap:9mm;font-size:7.4pt;line-height:1.5;color:var(--mut)"><p style="margin-bottom:2.6mm"><b style="color:var(--tx);font-weight:500">Comfort.</b> Annual and solstice comfort maps set where a person can actually stand still in July. The planting, the colonnade and the water were placed against those maps, not against a plan drawing.</p><p style="margin-bottom:2.6mm"><b style="color:var(--tx);font-weight:500">Wind and shade.</b> Velocity and pressure across the square, and shadow-hour counts at the solstices, decided the depth of the arcade and the height of the tree canopy.</p><p><b style="color:var(--tx);font-weight:500">People and trade.</b> Stay-places were walked, counted and mapped by hand; the commercial-to-residential heatmap came from the same field notes. Café positions were then generated against the comfort surface rather than chosen.</p></div>',
 items:[['at_comfort.jpg','Comfort zones · summer'],['at_annual.jpg','Annual comfort'],
        ['at_wind.jpg','Wind velocity'],['at_shadow.jpg','Shadow hours · solstice'],
        ['at_ped.jpg','Pedestrian stay-places'],['at_cafe.jpg','Auto-placed cafés'],
        ['at_heat.jpg','Commercial heatmap'],['at_massplan.jpg','Photogrammetry base · the real district']]},

{t:'tp', code:'4.4 / 4.5', title:'Heritage: two records', toc:'Mawlawiya &amp; Mar Semaan',
 text:['<b>Al Mawlawiya &amp; the old souks.</b> Rehabilitation of the Mevlevi lodge gardens and the old souk edge in Tripoli — stone terraces, water channels and planting brought back around the historic tekke. Worked from drawings to the ground: detailed design, BOQs and supervision of the works on site.',
       '<b>Mar Semaan Monastery, 1878.</b> A field diagnosis in Zghorta — walking the vaults and walls to document cracks, settlement, water infiltration and fire damage, then mapping the pathologies and recommending anchoring and tie-rod interventions to hold the stone together.'],
 spec:[['Practice','LDRS Chehab &amp; Partners'],['Scope','Drawings · BOQ · supervision'],['Method','On-foot survey · photo record']],
 plates:[{h:'82mm', cols:3, items:[['mw_1.jpg','Mawlawiya · the garden, restoration study'],
                                   ['mw_3.jpg','Mawlawiya · the garden court'],
                                   ['mw_2.jpg','Mawlawiya · terraces, study view']]},
         {h:'auto', cols:3, items:[['ms_1.jpg','Mar Semaan · the monastery','fitp'],
                                   ['ms_3.jpg','Masonry record','fitp'],
                                   ['ms_5.jpg','Interior survey']]}]},

{t:'hero', img:'y5_th1.jpg', code:'4.6', title:'Virtual Reality<br>Complex', toc:'Virtual Reality Complex — senior project',
 tags:['ARCH540','Mixed use','Data-driven','97 pages'],
 text:['A VR entertainment and education complex — <b>the first of its scale proposed in the region</b> — argued with a 60-person survey, demographic infographics and program analysis before a line was drawn, then delivered as a full urban set-piece with towers, arena ring and public realm.'],
 spec:[['Course','ARCH540 · Senior Project'],['Method','Survey · data · then design'],['Extras','Animation · research booklet']],
 cap:'The complex · night aerial',
 film:[['y5_th3.jpg','The arena bowl'],['y5_brown.jpg','The complex on the shore'],['y5_th2.jpg','Street approach · dusk']]},

{t:'grid', code:'4.6', title:'Argued on paper first', toc:'VR Complex · the boards',
 lead:'Ninety-seven pages of survey, demographics and program analysis sat under the design, and the whole argument was delivered as a single presentation board.',
 cols:3, ar:1.15,
 items:[['y5_poster.jpg','The full presentation board','fitp'],
        ['y5_braer.jpg','The perforated towers'],
        ['y5_brown2.jpg','Façade study'],
        ['y5_th4.jpg','Boulevard · dusk'],
        ['y5_plans.jpg','Plans · basement → fourth floor','fit'],
        ['y5_bposter.jpg','The research booklet','fit']]},

{t:'tp', code:'4.7 / 4.8', title:'Two university flagships', toc:'Antalya Skyscraper &amp; Green Mosque',
 text:['<b>Antalya skyscraper — the cliff edge.</b> Antalya\'s cliffs, missing their marker. The tower fuses a sky tower and a sea tower into one stratified monolith grown out of the rock face — anchored horizontally back into the cliff, drawn to 1/800 below the waterline in sea elevation and sea section.',
       '<b>Green Mosque.</b> A mosque folded into a green star on the El Mina corniche — prayer hall, amphitheatre plaza and landscape terraces resolved in one faceted ground between the road and the sea.'],
 spec:[['Antalya','ARCH432 · Design VI'],['Mosque','ARCH431 · Design V'],['Sites','Düden cliffs · El Mina, Tripoli']],
 plates:[{h:'92mm', cols:2, items:[['y4_sky_hero.jpg','Antalya · in site, the Düden cliffs','fitp'],
                                   ['y4_mosque_hero.jpg','Green Mosque · the star on the corniche']]},
         {h:'auto', cols:2, items:[['y4_sky_persp.jpg','Antalya · the two perspectives','fitp'],
                                   ['y4_mosqueposter.jpg','Green Mosque · the full board','fit']]}]},

{t:'grid', code:'4.9', title:'Algoritm Rome', toc:'Algoritm Rome — kinetic façade lab',
 lead:'Two weeks at Sapienza University of Rome: forty hours of Algorithmic-Aided Design under <b>Arturo Tedeschi</b>, then forty hours designing and physically fabricating a smart kinetic façade — the first contact with the computational tools that now anchor the national twin.',
 cols:2, ar:1.64,
 items:[['rome_1.jpg','The studio'],['rome_2.jpg','Fabricating the façade'],
        ['rome_3.jpg','Prototype assembly'],['rome_4.jpg','Final jury']]},

{t:'grid', code:'4.10', title:'The paper trail', toc:'The paper trail',
 lead:'Verifiable, dated, signed — the documents behind the CV.',
 cols:5, ar:0.72, cls:'fit',
 items:[['cert_riba.jpg','RIBA · Part 1 statement'],['cert_bau.jpg','BAU · B.Arch certificate'],
        ['cert_fibrex.jpg','Fibrex · experience certificate'],['cert_ldrs.jpg','LDRS · employment reference'],
        ['cert_rome.jpg','Sapienza Rome · parametric program'],
        ['cert_max.jpg','Autodesk · 3ds Max'],['cert_acad.jpg','Autodesk · AutoCAD'],
        ['cert_ic3.jpg','IC3 GS5 · digital literacy'],['cert_rhino.jpg','Rhino 7 · course'],
        ['cert_ourcity.jpg','Our City Our Way · design-build']]},

{t:'back'}
];

/* ================================================================= render */
const R = {};

R.cover = () => `
  <div class="bleed">${F('hero_main.jpg')}</div>
  <div class="veil" style="background:linear-gradient(180deg,rgba(12,17,20,.86) 0%,rgba(12,17,20,.24) 24%,rgba(12,17,20,.34) 44%,rgba(12,17,20,.86) 76%,rgba(12,17,20,.97) 100%)"></div>
  <div class="in">
    <div class="kick"><i></i>Portfolio · selected works 2016 — 2026</div>
    <div style="margin-top:auto;margin-bottom:8mm">
      <h1 class="disp">Mohamad Hashem<br><b>Dankar</b></h1>
      <p class="role">Architect · VR &amp; digital twin specialist — <em>an architect who builds cities twice.</em></p>
    </div>
    <div class="meta">
      <span><b>Abu Dhabi · UAE</b>hashemx98@gmail.com<br>+971 50 970 2011</span>
      <span><b>Currently</b>VR Content Creator<br>UAE Ministry of Interior</span>
      <span><b>Previously</b>Fibrex Construction Group<br>LDRS Chehab &amp; Partners</span>
    </div>
  </div>`;

R.stm = () => `
  <div class="in">
    <h1 class="disp">One city gets built in concrete.<br>The other gets built in <em>an engine.</em><br>I do both.</h1>
    <p>Six years across design practice, museum fabrication and government simulation. On Saadiyat Island I took three museums from design surface to cast panel — production 3D, GRC sheets, steel shop drawings, then the factory floor. In Abu Dhabi I build the <b>UAE's national digital twin</b>: seven emirates modelled, textured, geolocated and running in real time in Unreal Engine.
    <br><br>Before the Gulf: regeneration for UNDP in Tripoli, heritage diagnosis on an 1878 monastery, competitions for Erbil, and a virtual-reality complex argued from a survey before a line was drawn. The through-line is the same at every scale — <b>build it accurately enough that it can be tested, not just admired.</b></p>
  </div>
  <div class="band">
    ${F('moi_realtwin.jpg','P·01 · Reality | digital twin, one seam apart')}
    ${F('fx_zayed_done.jpg','P·02 · Zayed National Museum, cast and standing')}
    ${F('tk_main.jpg','P·03 · Bungalow resort on the tea terraces, Rize')}
    ${F('at_1.jpg','P·04 · Al Tall square regenerated, Tripoli')}
  </div>`;

R.prof = () => `
  <div class="hd"><span class="cd">◆</span><h2>Profile &amp; credentials</h2><span class="ln"></span>
    <span class="rt">Abu Dhabi · United Arab Emirates</span></div>
  <div class="bd prof">
    <p class="big">Mohamad Hashem Dankar — architect (BAU, RIBA Part I), based in Abu Dhabi. <b>Six years across design practice, museum fabrication and government simulation</b>, working in English and Arabic, at every scale from a GRC bracket to a national twin.</p>
    <div class="two">
      <dl>
        <div><dt>Current</dt><dd>VR Content Creator — UAE Ministry of Interior (Tahaluf Al Emarat), Abu Dhabi</dd></div>
        <div><dt>Previously</dt><dd>Fibrex Construction Group (Saadiyat museums) · LDRS Chehab &amp; Partners, Beirut–Tripoli · freelance practice</dd></div>
        <div><dt>Education</dt><dd>B.Arch, Beirut Arab University — validated at RIBA Part 1 level</dd></div>
        <div><dt>Credentials</dt><dd>Autodesk Certified User — 3ds Max &amp; AutoCAD · IC3 GS5 · Sapienza Rome parametric program</dd></div>
        <div><dt>Languages</dt><dd>Arabic · English · French</dd></div>
        <div><dt>Contact</dt><dd>hashemx98@gmail.com · +971 50 970 2011</dd></div>
      </dl>
      <div>
        <div class="kk">Toolchain</div>
        <div class="chips">${['Unreal Engine','3ds Max','Datasmith','Substance','Rhino + Grasshopper','Revit','AutoCAD','Corona / V-Ray','Twinmotion','Unity','Ladybug / Honeybee','Photoshop','GIS workflows'].map(c=>`<span>${c}</span>`).join('')}</div>
        <div class="stats">
          <div><b>03</b><span>Saadiyat museums</span></div>
          <div><b>07</b><span>Emirates in engine</span></div>
          <div><b>117</b><span>Buildings · Reem Island</span></div>
          <div><b>6+</b><span>Years in practice</span></div>
        </div>
      </div>
    </div>
    <div class="band">
      ${F('auh_hero.jpg','Abu Dhabi in engine')}
      ${F('fx_gug_model3.jpg','Guggenheim Abu Dhabi · presentation model')}
      ${F('rz_bung_night.jpg','Rize · the teacup unit at night','fitp')}
      ${F('rm_hero.jpg','Royal Complex, Erbil · across the lake')}
    </div>
  </div>`;

R.toc = (p, i, all) => {
  const groups = []; let cur = null;
  all.forEach((pg, n) => {
    if (!pg.toc) return;
    if (pg.t === 'div') { cur = {name: pg.toc, code: pg.tocCode, img: pg.img, page: n + 1, items: []}; groups.push(cur); }
    else if (cur) cur.items.push({n: pg.code, t: pg.toc, p: n + 1});
  });
  const half = Math.ceil(groups.length / 2);
  const col = g => g.map(gr =>
      `<h3><span>${gr.code} · ${gr.name}</span><span>${gr.page}</span></h3>` +
      gr.items.map(it => `<div class="row"><span class="n">${it.n}</span><span class="t">${it.t}</span><span class="p">${it.p}</span></div>`).join('')
    ).join('');
  return `
  <div class="hd"><span class="cd">◆</span><h2>Contents</h2><span class="ln"></span>
    <span class="rt">Four chapters · twenty-two projects</span></div>
  <div class="bd toc">
    <div class="cols"><div>${col(groups.slice(0, half))}</div><div>${col(groups.slice(half))}</div></div>
    <div class="band">${groups.map(gr =>
      `<figure><img src="${IMG}${gr.img}" alt=""><span class="lbl"><b>${gr.code}</b>${gr.name}</span></figure>`).join('')}</div>
  </div>`;
};

R.div = p => `
  <div class="bleed">${F(p.img)}</div>
  <div class="veil" style="background:
    linear-gradient(90deg,rgba(12,17,20,.97) 0%,rgba(12,17,20,.88) 42%,rgba(12,17,20,.22) 100%),
    linear-gradient(0deg,rgba(12,17,20,.92) 0%,rgba(12,17,20,.45) 13%,rgba(12,17,20,0) 27%)"></div>
  <div class="in">
    <div class="num">${p.num}</div>
    <div class="cd"><i></i>${p.code}</div>
    <h2 class="disp">${p.title}</h2>
    <p>${p.lede}</p>
  </div>
  <div class="strip">${p.strip.map(s => `<span>${s}</span>`).join('')}<span class="pn">${String(p.__n).padStart(2, '0')}</span></div>`;

R.hero = p => `
  <div class="bleed">${F(p.img)}</div>
  <div class="veil" style="background:
    linear-gradient(90deg,rgba(12,17,20,.55) 0%,rgba(12,17,20,.10) 46%,rgba(12,17,20,0) 100%),
    linear-gradient(0deg,rgba(12,17,20,.62) 0%,rgba(12,17,20,0) 34%)"></div>
  ${p.cap ? `<span style="position:absolute;right:var(--M);top:12mm;z-index:3;font-family:'Space Mono',monospace;
      font-size:5pt;letter-spacing:.18em;text-transform:uppercase;color:#DCE6E9;text-shadow:0 0 3mm rgba(0,0,0,.95)">${p.cap}</span>` : ''}
  <div class="panel">
    <div class="cd"><i></i>${p.code}</div>
    <h2>${p.title}</h2>
    ${p.tags ? `<div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>` : ''}
    ${p.text.map(t => `<p>${t}</p>`).join('')}
    ${p.spec ? `<dl>${p.spec.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
  </div>
  ${p.film ? `<div class="filmstrip" style="grid-template-columns:repeat(${p.film.length},46mm);height:29mm">
      ${p.film.map(f => F(f[0], f[1])).join('')}</div>` : ''}`;

const CW = 271; /* content width in mm */
R.grid = p => {
  const cw = (CW - (p.cols - 1) * 3) / p.cols;
  const ch = cw / p.ar;
  return `
  <div class="hd"><span class="cd">${p.code}</span><h2>${p.title}</h2><span class="ln"></span>
    ${p.rt ? `<span class="rt">${p.rt}</span>` : ''}</div>
  ${p.lead ? `<p class="lead">${p.lead}</p>` : ''}
  <div class="bd${p.lead ? ' low' : ''}">
    <div class="gr" style="grid-template-columns:repeat(${p.cols},minmax(0,1fr));grid-auto-rows:${ch.toFixed(2)}mm">
      ${p.items.map(it => F(it[0], it[1], it[2] || p.cls || '')).join('')}
    </div>
    ${p.after || ''}
  </div>`;
};

R.tp = p => {
  const rows = p.plates.map(r => {
    const cols = r.cols || 1;
    return `<div style="display:grid;gap:3mm;min-height:0;grid-template-columns:repeat(${cols},minmax(0,1fr))${r.h !== 'auto' ? `;height:${r.h}` : ''}">
      ${r.items.map(it => F(it[0], it[1], it[2] || '')).join('')}</div>`;
  }).join('');
  const tmpl = p.plates.map(r => r.h === 'auto' ? 'minmax(0,1fr)' : r.h).join(' ');
  return `
  <div class="hd"><span class="cd">${p.code}</span><h2>${p.title}</h2><span class="ln"></span>
    ${p.rt ? `<span class="rt">${p.rt}</span>` : ''}</div>
  <div class="bd">
    <div class="tp">
      <div class="col">
        ${p.text.map(t => `<p>${t}</p>`).join('')}
        ${p.spec ? `<dl>${p.spec.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
      </div>
      <div class="st" style="grid-template-rows:${tmpl}">${rows}</div>
    </div>
  </div>`;
};

R.trio = p => `
  <div class="hd"><span class="cd">${p.code}</span><h2>${p.title}</h2><span class="ln"></span></div>
  <p class="lead">${p.lead}</p>
  <div class="bd low">
    <div class="gr" style="grid-template-columns:120mm minmax(0,1fr);grid-template-rows:minmax(0,1fr)">
      ${F(p.sheet[0], p.sheet[1], p.sheet[2])}
      <div style="display:grid;grid-template-rows:repeat(2,minmax(0,1fr));gap:3mm;min-height:0">
        ${p.pair.map(x => F(x[0], x[1], x[2] || '')).join('')}
      </div>
    </div>
  </div>`;

R.pipe = p => `
  <div class="hd"><span class="cd">${p.code}</span><h2>${p.title}</h2><span class="ln"></span>
    <span class="rt">${p.rt}</span></div>
  <p class="lead">Every city in the twin goes through the same disciplined route — built for <b>speed, consistency and real-time performance</b> at urban scale. When a landmark matters it is rebuilt properly: grey massing to fully textured, night-lit asset.</p>
  <div class="bd low">
    <div class="pipe">
      ${[['01','Satellite / GIS','Imagery + footprints, georeferenced'],
         ['02','2D extraction','Clean building outlines per district'],
         ['03','3D low-poly','LOD 100–200 massing in 3ds Max'],
         ['04','UV + texture','Box mapping · custom + emissive maps'],
         ['05','Datasmith','Pivots, naming, tags, collisions'],
         ['06','Unreal Engine','Geolocation · blueprints · events']]
        .map(([n, h, t]) => `<div class="st"><span class="n">${n}</span><h5>${h}</h5><p>${t}</p></div>`).join('')}
    </div>
    <div class="gr" style="grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:84mm;margin-top:5mm">
      ${F('moi_sigma.jpg','Sigma &amp; Omega towers · massing → textured night asset','fitd')}
      ${F('moi_mangroove.jpg','Mangrove complex · exploded texture set → assembled','fitd')}
    </div>
    <div style="margin-top:5mm;font-family:'Space Mono',monospace;font-size:5.2pt;letter-spacing:.18em;
                text-transform:uppercase;color:var(--sig);padding-bottom:2.2mm;border-bottom:.3mm solid var(--line)">
      The same route, emirate after emirate</div>
    <div class="gr" style="grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:34mm;margin-top:3mm">
      ${F('auh_tw4.jpg','Abu Dhabi · marina quarter')}
      ${F('ajm_tw3.jpg','Ajman · resort &amp; marina quarter')}
      ${F('fjr_center.jpg','Fujairah · city centre, in engine')}
    </div>
  </div>`;

R.back = () => `
  <div class="in">
    <div>
      <div style="font-family:'Space Mono',monospace;font-size:6pt;letter-spacing:.32em;text-transform:uppercase;color:var(--br);margin-bottom:8mm">◆ &nbsp;Contact</div>
      <h2 class="disp">Let's build it <em>twice.</em></h2>
      <div class="links">
        <div><span class="k">Email</span><span class="v">hashemx98@gmail.com</span></div>
        <div><span class="k">Phone / WhatsApp</span><span class="v">+971 50 970 2011</span></div>
        <div><span class="k">Base</span><span class="v">Abu Dhabi · UAE</span></div>
      </div>
    </div>
    <div class="note">
      The live portfolio runs the same work in the browser — walkthrough film, scroll-driven photogrammetry<br>
      and <b>real engine assets you can orbit in 3D</b>.<br><br>
      © 2026 Mohamad Hashem Dankar &nbsp;·&nbsp; Real · Twin · N 24.4539° E 54.3773°
    </div>
  </div>`;

/* ================================================================= build */
const doc = document.getElementById('doc');
PAGES.forEach((p, i) => { p.__n = i + 1; });
PAGES.forEach((p, i) => {
  const el = document.createElement('div');
  const bleed = p.t === 'cover' || p.t === 'div' || p.t === 'hero' || p.t === 'back' || p.t === 'stm';
  el.className = 'pg ly-' + p.t + ((bleed || p.dark) ? ' dk' : '');
  el.innerHTML = R[p.t](p, i, PAGES);
  if (p.t !== 'cover' && p.t !== 'back' && p.t !== 'div') {
    const f = document.createElement('div');
    f.className = 'foot' + (p.t === 'hero' || p.t === 'stm' ? ' over' : '');
    f.innerHTML = `<span>Mohamad Hashem Dankar · Architect · Portfolio 2026</span><span class="pn">${String(i + 1).padStart(2, '0')}</span>`;
    el.appendChild(f);
  }
  doc.appendChild(el);
});
document.documentElement.dataset.pages = PAGES.length;
