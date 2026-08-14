/* Regenerates the service-area map inside src/partials/footer.html.
   Run with:  node scripts/make-area-map.js   (writes scripts/area-map.svg,
   then paste it over the <svg class="areaband__map"> block in the partial
   and rebuild with `node build.js`).

   Emits the service-area map SVG. Coordinates are a real equirectangular
   projection centred on Pearl River, so every dot/road sits where it
   actually is on the ground. */
const lat0 = 41.0587, lon0 = -74.0218, K = 1035;
const KX = K * Math.cos(lat0 * Math.PI / 180);
const CX = 250, CY = 200;
const P = (lat, lon) => [CX + (lon - lon0) * KX, CY - (lat - lat0) * K];
const p = (lat, lon) => P(lat, lon).map(v => +v.toFixed(1)).join(",");
const R10 = 10 / 69.05 * K;                  // 10 miles in px

/* ---- view box ---- */
const VX = 30, VY = 8, VW = 440, VH = 384;

/* ---- water: Hudson (west bank N->S, east bank S->N) ---- */
const westBank = [[41.26,-73.9640],[41.20,-73.9505],[41.15,-73.9300],[41.12,-73.9285],
                  [41.09,-73.9195],[41.06,-73.9165],[41.04,-73.9152],[41.00,-73.9050],
                  [40.95,-73.9210],[40.90,-73.9390],[40.86,-73.9490]];
const eastBank = [[40.86,-73.9110],[40.90,-73.9010],[40.95,-73.8940],[41.00,-73.8770],
                  [41.04,-73.8690],[41.08,-73.8610],[41.12,-73.8580],[41.15,-73.8620],
                  [41.20,-73.8660],[41.26,-73.8830]];
const hudson = "M" + westBank.map(a => p(...a)).join(" L") + " L" + eastBank.map(a => p(...a)).join(" L") + " Z";

/* ---- reservoirs ---- */
const blob = (pts) => "M" + pts.map(a => p(...a)).join(" L") + " Z";
const lakeTappan = blob([[41.0215,-73.9800],[41.0175,-73.9735],[41.0060,-73.9675],
                         [40.9880,-73.9640],[40.9860,-73.9690],[41.0030,-73.9730],
                         [41.0140,-73.9790],[41.0185,-73.9845]]);
const woodcliff  = blob([[41.0330,-74.0560],[41.0300,-74.0490],[41.0130,-74.0430],
                         [41.0110,-74.0480],[41.0270,-74.0545]]);
const deforest   = blob([[41.1610,-73.9920],[41.1560,-73.9855],[41.1250,-73.9840],
                         [41.1225,-73.9895],[41.1520,-73.9920]]);

/* ---- parks ---- */
const parks = [
  /* Blauvelt / Tallman Mountain State Park along the ridge */
  blob([[41.0900,-73.9330],[41.0700,-73.9250],[41.0420,-73.9230],[41.0300,-73.9260],
        [41.0290,-73.9370],[41.0500,-73.9390],[41.0720,-73.9420],[41.0880,-73.9450]]),
  /* Palisades Interstate Park, NJ side */
  blob([[41.0000,-73.9080],[40.9400,-73.9250],[40.8800,-73.9440],[40.8600,-73.9520],
        [40.8600,-73.9640],[40.8900,-73.9560],[40.9500,-73.9370],[41.0000,-73.9210]]),
  /* Rockland Lake State Park */
  blob([[41.1700,-73.9420],[41.1560,-73.9280],[41.1350,-73.9310],[41.1330,-73.9490],
        [41.1520,-73.9560]]),
  /* Ramapo / Harriman uplands, north-west corner */
  blob([[41.2600,-74.2000],[41.2600,-74.0900],[41.2000,-74.0850],[41.1500,-74.1300],
        [41.1000,-74.2000],[41.0800,-74.3400],[41.2000,-74.3400]]),
];

/* ---- roads (lat/lon polylines) ---- */
const line = (pts) => "M" + pts.map(a => p(...a)).join(" L");
const motorways = {
  "Palisades Pkwy": line([[40.8600,-73.9600],[40.9000,-73.9490],[40.9500,-73.9420],
                          [41.0000,-73.9330],[41.0300,-73.9450],[41.0600,-73.9550],
                          [41.0900,-73.9620],[41.1200,-73.9620],[41.1500,-73.9580],
                          [41.2000,-73.9720],[41.2600,-73.9850]]),
  "NY Thruway":     line([[41.1250,-74.2050],[41.1150,-74.1490],[41.1080,-74.0850],
                          [41.1000,-74.0100],[41.0930,-73.9720],[41.0880,-73.9330],
                          [41.0760,-73.8760],[41.0740,-73.8300],[41.0700,-73.7500]]),
  "Garden State Pkwy": line([[40.8600,-74.0640],[40.9200,-74.0590],[40.9800,-74.0530],
                          [41.0200,-74.0480],[41.0480,-74.0510],[41.0700,-74.0680],
                          [41.0950,-74.0900],[41.1080,-74.1000]]),
  "Rte 17":         line([[40.8600,-74.0580],[40.9450,-74.0750],[40.9980,-74.1000],
                          [41.0300,-74.1230],[41.0570,-74.1410],[41.0900,-74.1440],
                          [41.1150,-74.1520]]),
};
const arterials = [
  /* NY 303 */ line([[41.0100,-73.9490],[41.0230,-73.9482],[41.0473,-73.9482],
                     [41.0670,-73.9557],[41.0951,-73.9707],[41.1300,-73.9540],[41.1600,-73.9450]]),
  /* NY 59  */ line([[41.1130,-74.1450],[41.1130,-74.0450],[41.1000,-74.0130],
                     [41.0930,-73.9800],[41.0930,-73.9300]]),
  /* NY 304 */ line([[41.0400,-74.0180],[41.0850,-74.0080],[41.1400,-73.9980]]),
  /* Kinderkamack Rd */ line([[40.8800,-74.0330],[40.9500,-74.0300],[41.0100,-74.0180],[41.0480,-74.0250]]),
  /* Western Hwy / CR-33 */ line([[41.0100,-74.0000],[41.0400,-73.9950],[41.0700,-73.9880],[41.1000,-73.9880]]),
  /* Chestnut Ridge Rd / Grand Ave */ line([[41.0300,-74.0500],[41.0650,-74.0570],[41.1000,-74.0500]]),
  /* Piermont Ave / 9W */ line([[40.9900,-73.9200],[41.0250,-73.9230],[41.0600,-73.9200],[41.1000,-73.9230],[41.1400,-73.9250]]),
];
const locals = [
  line([[41.0590,-74.0640],[41.0587,-74.0218],[41.0560,-73.9850]]),      // Middletown Rd
  line([[41.0900,-74.0300],[41.0587,-74.0218],[41.0280,-74.0150]]),      // Central Ave
  line([[41.0400,-74.0600],[41.0450,-74.0180],[41.0430,-73.9800]]),
  line([[41.0750,-74.0500],[41.0700,-74.0100],[41.0800,-73.9800]]),
  line([[41.0000,-74.0600],[41.0050,-74.0100],[40.9950,-73.9700]]),
  line([[41.1150,-74.0700],[41.0900,-74.0600],[41.0600,-74.0700]]),
];

/* ---- towns ---- */
const PRIMARY = [
  ["Nanuet", 41.0887, -74.0135], ["Blauvelt", 41.0670, -73.9557],
  ["Orangeburg", 41.0473, -73.9482], ["Tappan", 41.0223, -73.9482],
  ["Montvale", 41.0490, -74.0454], ["River Vale", 41.0090, -74.0140],
];
const SECONDARY = [
  ["Nyack", 41.0909, -73.9179], ["Piermont", 41.0409, -73.9182],
  ["Spring Valley", 41.1132, -74.0437], ["New City", 41.1476, -73.9893],
  ["Suffern", 41.1148, -74.1496], ["Park Ridge", 41.0384, -74.0407],
  ["Old Tappan", 41.0126, -73.9899], ["Northvale", 40.9954, -73.9490],
  ["Westwood", 40.9915, -74.0326], ["Hillsdale", 41.0043, -74.0404],
  ["Congers", 41.1490, -73.9463], ["West Nyack", 41.0951, -73.9707],
  ["Closter", 40.9726, -73.9613], ["Norwood", 40.9932, -73.9596],
  ["Valley Cottage", 41.1170, -73.9457], ["Chestnut Ridge", 41.0645, -74.0568],
  ["Emerson", 40.9762, -74.0262], ["Sparkill", 41.0362, -73.9285],
  ["Woodcliff Lake", 41.0240, -74.0679], ["Bardonia", 41.1032, -73.9946],
];

/* ---- label placement: first candidate box that hits nothing wins ---- */
const boxes = [];
const hits = (b, soft) => boxes.some(o => (soft || !o.soft) &&
  !(b.x2 < o.x1 || b.x1 > o.x2 || b.y2 < o.y1 || b.y1 > o.y2));
const push = (b) => boxes.push(b);
function place(x, y, text, size, gap, must) {
  const w = text.length * size * 0.56, h = size * 0.98;
  // Nearest ring of positions first; within a ring, keep off the water if we
  // can, otherwise take the close spot and let the label's halo carry it.
  const cands = [];
  for (const d of [gap, gap * 1.9, gap * 3.1]) {
    const ring = [[x + d, y + size * .34, "start"], [x - d, y + size * .34, "end"],
                  [x, y - d - size * .12, "middle"], [x, y + d + size * .8, "middle"],
                  [x + d * .8, y - d * .7, "start"], [x - d * .8, y - d * .7, "end"],
                  [x + d * .8, y + d * .9 + size * .5, "start"], [x - d * .8, y + d * .9 + size * .5, "end"]];
    cands.push(ring.map(c => [...c, false]), ring.map(c => [...c, true]));
  }
  for (const ring of cands) {
    for (const [tx, ty, anchor, over] of ring) {
      const x1 = anchor === "start" ? tx : anchor === "end" ? tx - w : tx - w / 2;
      const b = { x1: x1 - 2, x2: x1 + w + 2, y1: ty - h - 2, y2: ty + 2 };
      if (b.x1 < VX + 4 || b.x2 > VX + VW - 4 || b.y1 < VY + 4 || b.y2 > VY + VH - 4) continue;
      if (hits(b, !over)) continue;
      push(b);
      return { tx: +tx.toFixed(1), ty: +ty.toFixed(1), anchor, leader: Math.hypot(tx - x, ty - y) > gap * 2.4 };
    }
  }
  if (!must) return null;
  const [tx, ty, anchor] = cands[0][0];
  const x1 = tx;
  push({ x1: x1 - 2, x2: x1 + w + 2, y1: ty - h - 2, y2: ty + 2 });
  return { tx: +tx.toFixed(1), ty: +ty.toFixed(1), anchor, leader: false };
}

/* keep labels off the Hudson - a column of boxes standing in for the river */
for (let la = 40.86; la < 41.27; la += 0.02) {
  const [wx, wy] = P(la, la > 41.06 ? -73.918 : -73.910);
  const [ex] = P(la, -73.872);
  boxes.push({ soft: true, x1: wx + 4, x2: ex, y1: wy - 11, y2: wy + 11 });
}

/* reserve the pin + its label first */
const [px, py] = P(41.0587, -74.0218);
push({ x1: px - 12, x2: px + 12, y1: py - 36, y2: py + 4 });

/* the pin's own label belongs directly under it - reserve that before the
   neighbours start competing for the space */
const homeLbl = { tx: px, ty: py + 21, anchor: "middle" };
push({ x1: px - 46, x2: px + 46, y1: py + 7, y2: py + 24 });

const out = [];
for (const [name, la, lo] of PRIMARY) {
  const [x, y] = P(la, lo);
  push({ x1: x - 5, x2: x + 5, y1: y - 5, y2: y + 5 });
  const l = place(x, y, name, 13, 9, true);
  out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" class="areamap__dot"/>`);
  if (l.leader) out.push(`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${l.tx}" y2="${(l.ty - 4).toFixed(1)}" class="areamap__leader"/>`);
  out.push(`<text x="${l.tx}" y="${l.ty}" text-anchor="${l.anchor}" class="areamap__t1">${name}</text>`);
}
const sec = [];
for (const [name, la, lo] of SECONDARY) {
  const [x, y] = P(la, lo);
  const l = place(x, y, name, 10, 6.5, false);
  if (!l) continue;
  push({ x1: x - 3, x2: x + 3, y1: y - 3, y2: y + 3 });
  sec.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.3" class="areamap__dot2"/>`);
  sec.push(`<text x="${l.tx}" y="${l.ty}" text-anchor="${l.anchor}" class="areamap__t2">${name}</text>`);
}

const f = (n) => +n.toFixed(1);
const svg = `        <svg class="areaband__map" viewBox="${VX} ${VY} ${VW} ${VH}" role="img"
             aria-label="Map of the Simply Spotless service area: roughly ten miles around Pearl River, New York, covering Rockland County and the nearby Bergen County, New Jersey towns.">
          <defs>
            <clipPath id="areamapClip"><rect x="${VX}" y="${VY}" width="${VW}" height="${VH}" rx="16"/></clipPath>
          </defs>
          <g clip-path="url(#areamapClip)">
            <rect x="${VX}" y="${VY}" width="${VW}" height="${VH}" fill="#f3f1ec"/>
${parks.map(d => `            <path d="${d}" fill="#d5e9c6"/>`).join("\n")}
            <path d="${hudson}" fill="#a9d9f4"/>
            <path d="${lakeTappan}" fill="#a9d9f4"/>
            <path d="${woodcliff}" fill="#a9d9f4"/>
            <path d="${deforest}" fill="#a9d9f4"/>

            <!-- NY / NJ state line -->
            <path d="${line([[41.0000,-74.4000],[41.0000,-73.8900]])}" stroke="#c2b8a8" stroke-width="1.6" stroke-dasharray="6 4" fill="none"/>
            <text x="${f(VX + 12)}" y="${f(P(41.0, -74)[1] - 8)}" class="areamap__state">NEW YORK</text>
            <text x="${f(VX + 12)}" y="${f(P(41.0, -74)[1] + 16)}" class="areamap__state">NEW JERSEY</text>

            <!-- roads: casing first, then the core, the way maps stack them -->
            <g fill="none" stroke-linecap="round" stroke-linejoin="round">
${locals.map(d => `              <path d="${d}" stroke="#e6e1d8" stroke-width="3"/>`).join("\n")}
${locals.map(d => `              <path d="${d}" stroke="#ffffff" stroke-width="1.7"/>`).join("\n")}
${arterials.map(d => `              <path d="${d}" stroke="#ded8ce" stroke-width="5"/>`).join("\n")}
${arterials.map(d => `              <path d="${d}" stroke="#ffffff" stroke-width="3.2"/>`).join("\n")}
${Object.values(motorways).map(d => `              <path d="${d}" stroke="#dfae5c" stroke-width="6.4"/>`).join("\n")}
${Object.values(motorways).map(d => `              <path d="${d}" stroke="#fad68f" stroke-width="4.2"/>`).join("\n")}
            </g>

            <text class="areamap__water" transform="translate(${f(P(41.005,-73.893)[0])} ${f(P(41.005,-73.893)[1])}) rotate(-84)">Hudson River</text>

            <!-- the ten-mile ring -->
            <circle cx="${CX}" cy="${CY}" r="${f(R10)}" fill="rgba(20,143,215,.10)" stroke="#148fd7" stroke-width="2.4" stroke-dasharray="9 7"/>
${sec.map(t => "            " + t.trim()).join("\n")}
${out.map(t => "            " + t).join("\n")}

            <!-- Pearl River -->
            <ellipse cx="${f(px)}" cy="${f(py + 1.5)}" rx="7" ry="2.6" fill="rgba(0,27,45,.22)"/>
            <path transform="translate(${f(px)} ${f(py)})" d="M0 0c-6.4-9.4-9.8-13.4-9.8-17.9a9.8 9.8 0 1 1 19.6 0C9.8-13.4 6.4-9.4 0 0z" fill="#ffb400" stroke="#00243c" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="${f(px)}" cy="${f(py - 17.9)}" r="3.6" fill="#00243c"/>
            <text x="${f(homeLbl.tx)}" y="${f(homeLbl.ty)}" text-anchor="${homeLbl.anchor}" class="areamap__home">Pearl River</text>

            <text x="${CX}" y="${f(CY + R10 - 12)}" text-anchor="middle" class="areamap__ring">10-mile service radius</text>
          </g>
          <rect x="${VX + 0.75}" y="${VY + 0.75}" width="${VW - 1.5}" height="${VH - 1.5}" rx="15.5" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.5"/>
        </svg>`;
require("fs").writeFileSync(__dirname + "/area-map.svg", svg + "\n");
console.log(svg.split("\n").length, "lines written");
