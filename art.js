/* Doctor Orison — visual engine.
   Everything drawn here is original: the armillary sphere, the archive entrance, the line icons and the engraved plates.
   Plates are SCHEMATIC type-engravings generated from a seed (leaf sprig, flower, root, bark quill, seed, pod, fruit, resin,
   grain, comb, crystal, tree). They show the kind of plant part, not a species-accurate botanical plate. */
(function () {
  'use strict';
  var TAU = Math.PI * 2;

  /* ---------- seeded random ---------- */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var a = hash(seed); return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function f(n) { return Math.round(n * 10) / 10; }
  function roman(n) { var m = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], s = ''; m.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } }); return s; }

  /* ---------- line icons (24px) ---------- */
  var ICON = {
    home: '<path d="M4 21V10a8 8 0 0 1 16 0v11M8 21V11a4 4 0 0 1 8 0v10M2 21h20"/>',
    book: '<path d="M12 6c-2-1.6-5-2-8-1.5v13c3-.5 6-.1 8 1.5 2-1.600 5-2 8-1.500v-13c-3-.5-6-.1-8 1.500zM12 6v13"/>',
    pray: '<path d="M12 3v4M9 5h6M12 21c-3.500 0-6-2-6-5 0-2 1.500-3.500 3-5l3-3 3 3c1.500 1.500 3 3 3 5 0 3-2.500 5-6 5z"/>',
    leaf: '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19c3-5 6-8 11-11"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    search: '<circle cx="10.500" cy="10.500" r="6.500"/><path d="M15.500 15.500L21 21"/>',
    ear: '<path d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H5a1 1 0 0 1-1-1zM20 15h-3v5h2a1 1 0 0 0 1-1z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.500 3.500-7 8-7s8 2.500 8 7"/>',
    more: '<circle cx="5" cy="12" r="1.200"/><circle cx="12" cy="12" r="1.200"/><circle cx="19" cy="12" r="1.200"/>',
    play: '<path d="M7 4l13 8-13 8z"/>', pause: '<path d="M7 4v16M17 4v16"/>', stop: '<rect x="6" y="6" width="12" height="12"/>',
    prev: '<path d="M18 5L8 12l10 7zM6 5v14"/>', next: '<path d="M6 5l10 7-10 7zM18 5v14"/>',
    bm: '<path d="M6 3h12v18l-6-4-6 4z"/>', note: '<path d="M5 3h14v14l-4 4H5zM15 17v4M8 8h8M8 12h8"/>',
    hl: '<path d="M4 20l4-1 11-11-3-3L5 16zM14 6l4 4"/>', share: '<circle cx="6" cy="12" r="2.500"/><circle cx="18" cy="6" r="2.500"/><circle cx="18" cy="18" r="2.500"/><path d="M8.300 10.800l7.400-3.600M8.300 13.200l7.400 3.600"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.600 0l3-3A4 4 0 0 0 13 5.400l-1 1M14 10a4 4 0 0 0-5.600 0l-3 3A4 4 0 0 0 11 18.600l1-1"/>',
    ask: '<circle cx="12" cy="12" r="9"/><path d="M9.500 9.500a2.600 2.600 0 1 1 3.600 2.400c-.7.400-1.100 1-1.100 1.800M12 17v.1"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    check: '<path d="M4 12l5 5L20 6"/>', x: '<path d="M5 5l14 14M19 5L5 19"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900l2.100 2.100M17 17l2.100 2.100M19.100 4.900L17 7M7 17l-2.100 2.100"/>'
  };
  function icon(n, size, cls) { return '<svg class="' + (cls || '') + '" width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[n] || '') + '</svg>'; }
  function diamond() { return '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0l6 6-6 6-6-6z" fill="currentColor"/></svg>'; }

  /* ---------- armillary sphere (canvas) ---------- */
  function armillary(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d'), W = 0, H = 0, dpr = 1, raf = 0, run = false, t0 = performance.now();
    var mx = 0, my = 0, tx = 0, ty = 0;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stars = [], R = rng('orison-stars');
    for (var i = 0; i < 150; i++) stars.push({ a: R() * TAU, b: Math.acos(2 * R() - 1), r: 1.15 + R() * 0.9, s: R() });
    var rings = [{ tilt: 0, roll: 0, k: 1, w: 1.4, tick: 72 }, { tilt: 1.12, roll: .3, k: .9, w: 1.1, tick: 0 }, { tilt: -.9, roll: 1.1, k: .82, w: 1.1, tick: 0 }, { tilt: 1.57, roll: .0, k: .74, w: 1, tick: 36 }, { tilt: .4, roll: 2.1, k: .6, w: 1, tick: 0 }];
    var orbs = [{ ring: 1, a: 0, sp: .5, r: 3.2 }, { ring: 2, a: 2, sp: -.35, r: 2.6 }, { ring: 4, a: 4, sp: .8, r: 2.2 }];
    function size() {
      var r = canvas.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height); canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function proj(x, y, z, ay, ax, cx, cy, S) {
      var c = Math.cos(ay), s = Math.sin(ay), x1 = x * c + z * s, z1 = -x * s + z * c;
      c = Math.cos(ax); s = Math.sin(ax); var y1 = y * c - z1 * s, z2 = y * s + z1 * c;
      var p = 1 / (1 + z2 * .18); return [cx + x1 * S * p, cy + y1 * S * p, z2];
    }
    function ringPt(rg, a, k) { var x = Math.cos(a) * k, y = Math.sin(a) * k, z = 0;
      var ct = Math.cos(rg.tilt), st = Math.sin(rg.tilt); var y1 = y * ct - z * st, z1 = y * st + z * ct;
      var cr = Math.cos(rg.roll), sr = Math.sin(rg.roll); return [x * cr + z1 * sr, y1, -x * sr + z1 * cr]; }
    function col(a) { var l = document.body.classList.contains('theme-parch'); return l ? 'rgba(110,80,30,' + a + ')' : 'rgba(201,168,76,' + a + ')'; }
    function frame(now) {
      var t = (now - t0) / 1000; tx += (mx - tx) * .05; ty += (my - ty) * .05;
      ctx.clearRect(0, 0, W, H);
      var S = Math.min(W, H) * .30, cx = W / 2, cy = H * .46, ay = t * .12 + tx * .5, ax = .35 + ty * .3;
      // stars
      stars.forEach(function (st) { var x = Math.sin(st.b) * Math.cos(st.a), y = Math.cos(st.b), z = Math.sin(st.b) * Math.sin(st.a); var p = proj(x * 2.4, y * 2.4, z * 2.4, ay * .4, ax, cx, cy, S); var a = (.18 + .5 * st.s) * (p[2] < 0 ? .5 : 1) * (.65 + .35 * Math.sin(t * (.5 + st.s) + st.a)); ctx.fillStyle = col(a); ctx.fillRect(p[0], p[1], st.r * .7, st.r * .7); });
      // rings
      rings.forEach(function (rg, ri) {
        var N = 140, prev = null;
        for (var i = 0; i <= N; i++) { var a = i / N * TAU, q = ringPt(rg, a, rg.k), p = proj(q[0], q[1], q[2], ay, ax, cx, cy, S);
          if (prev) { ctx.strokeStyle = col(p[2] > 0 ? .22 : .8); ctx.lineWidth = rg.w; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); } prev = p; }
        if (rg.tick) for (var j = 0; j < rg.tick; j++) { var a2 = j / rg.tick * TAU, q1 = ringPt(rg, a2, rg.k), q2 = ringPt(rg, a2, rg.k * (j % 6 === 0 ? 1.07 : 1.035)); var p1 = proj(q1[0], q1[1], q1[2], ay, ax, cx, cy, S), p2 = proj(q2[0], q2[1], q2[2], ay, ax, cx, cy, S); ctx.strokeStyle = col(p1[2] > 0 ? .2 : .75); ctx.lineWidth = j % 6 === 0 ? 1.4 : .8; ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); }
      });
      // axis
      var a1 = proj(0, -1.18, 0, ay, ax, cx, cy, S), a2 = proj(0, 1.18, 0, ay, ax, cx, cy, S); ctx.strokeStyle = col(.45); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1]); ctx.stroke();
      // core: small bright seed, like a lamp
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * .22); g.addColorStop(0, col(.55)); g.addColorStop(1, col(0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, S * .22, 0, TAU); ctx.fill();
      ctx.fillStyle = col(.95); ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, TAU); ctx.fill();
      // orbs
      orbs.forEach(function (o) { var rg = rings[o.ring], a = o.a + t * o.sp, q = ringPt(rg, a, rg.k), p = proj(q[0], q[1], q[2], ay, ax, cx, cy, S); ctx.fillStyle = col(p[2] > 0 ? .5 : 1); ctx.beginPath(); ctx.arc(p[0], p[1], o.r, 0, TAU); ctx.fill(); });
      if (run) raf = requestAnimationFrame(frame);
    }
    function start() { if (run || reduce) return; run = true; t0 = performance.now() - 0; raf = requestAnimationFrame(frame); }
    function stop() { run = false; cancelAnimationFrame(raf); }
    size(); frame(performance.now());
    var ro = window.ResizeObserver ? new ResizeObserver(function () { size(); if (!run) frame(performance.now()); }) : null; if (ro) ro.observe(canvas);
    var io = new IntersectionObserver(function (es) { es[0].isIntersecting && !document.hidden ? start() : stop(); }); io.observe(canvas);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    canvas.parentNode.addEventListener('pointermove', function (e) { var r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
    return { stop: function () { stop(); io.disconnect(); if (ro) ro.disconnect(); } };
  }

  /* ---------- archive entrance (receding arches, steps, light shaft, inscription ring) ---------- */
  function entrance() {
    var s = '<svg class="arch" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">';
    s += '<defs><linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9A84C" stop-opacity=".22"/><stop offset="1" stop-color="#C9A84C" stop-opacity="0"/></linearGradient>' +
      '<path id="ringtxt" d="M500 350m-262 0a262 262 0 1 1 524 0a262 262 0 1 1-524 0"/></defs>';
    s += '<polygon points="440,0 560,0 760,700 240,700" fill="url(#shaft)"/>';
    var i, w, top, op;
    for (i = 0; i < 6; i++) {
      w = 440 - i * 62; top = 80 + i * 46; op = .55 - i * .07;
      s += '<path d="M' + (500 - w) + ' 700V' + (top + w) + 'A' + w + ' ' + w + ' 0 0 1 ' + (500 + w) + ' ' + (top + w) + 'V700" stroke="#C9A84C" stroke-opacity="' + f(op) + '" stroke-width="' + (i === 0 ? 2 : 1.2) + '"/>';
      if (i < 5) s += '<path d="M' + (500 - w + 8) + ' 700V' + (top + w + 8) + 'A' + (w - 8) + ' ' + (w - 8) + ' 0 0 1 ' + (500 + w - 8) + ' ' + (top + w + 8) + 'V700" stroke="#856B3D" stroke-opacity="' + f(op * .8) + '" stroke-width=".7"/>';
    }
    for (i = 0; i < 14; i++) { var y = 700 - i * 11, hw = 90 + i * 13; s += '<path d="M' + (500 - hw) + ' ' + y + 'H' + (500 + hw) + '" stroke="#C9A84C" stroke-opacity="' + f(.35 - i * .02) + '" stroke-width="1"/>'; }
    [-1, 1].forEach(function (d) { for (var k = 0; k < 4; k++) { var x = 500 + d * (452 + k * 4); s += '<path d="M' + x + ' 700V120" stroke="#856B3D" stroke-opacity=".25"/>'; } });
    s += '<g style="transform-origin:500px 350px;animation:sp 300s linear infinite"><text font-family="Cormorant SC,serif" font-size="13" letter-spacing="6.4" fill="#C9A84C" fill-opacity=".55"><textPath href="#ringtxt" startOffset="0">UNDERSTAND THE WORD · HONOUR THE ROOTS · CULTIVATE THE MIND · BUILD THE FUTURE · </textPath></text></g>';
    s += '</svg>';
    return s;
  }

  /* ---------- engraved plates ---------- */
  function leaf(x, y, len, wid, ang, R) {
    var s = '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(ang) + ')">';
    s += '<path d="M0 0C' + f(wid * .9) + ' ' + f(-len * .25) + ' ' + f(wid) + ' ' + f(-len * .75) + ' 0 ' + f(-len) + 'C' + f(-wid) + ' ' + f(-len * .75) + ' ' + f(-wid * .9) + ' ' + f(-len * .25) + ' 0 0Z" stroke-width="1.2"/>';
    s += '<path d="M0 0V' + f(-len * .96) + '" stroke-width=".9"/>';
    for (var i = 1; i < 7; i++) { var yy = -len * i / 7.3, ww = wid * Math.sin(Math.PI * i / 7.6) * .84; s += '<path d="M0 ' + f(yy) + 'Q' + f(ww * .5) + ' ' + f(yy - len * .03) + ' ' + f(ww) + ' ' + f(yy - len * .09) + 'M0 ' + f(yy) + 'Q' + f(-ww * .5) + ' ' + f(yy - len * .03) + ' ' + f(-ww) + ' ' + f(yy - len * .09) + '" stroke-width=".55" opacity=".8"/>'; }
    for (var j = 0; j < 9; j++) { var y2 = -len * (.12 + j * .09), w2 = wid * Math.sin(Math.PI * (j + 1.2) / 10) * .8; s += '<path d="M' + f(w2 * .25) + ' ' + f(y2) + 'L' + f(w2 * .75) + ' ' + f(y2 - 3) + '" stroke-width=".4" opacity=".55"/>'; }
    return s + '</g>';
  }
  function stem(x0, y0, x1, y1, bend) { var mx = (x0 + x1) / 2 + bend, my = (y0 + y1) / 2; return 'M' + f(x0) + ' ' + f(y0) + 'Q' + f(mx) + ' ' + f(my) + ' ' + f(x1) + ' ' + f(y1); }
  function sprig(R) {
    var s = '<path d="' + stem(120, 282, 122, 54, 16 * (R() - .5)) + '" stroke-width="1.6"/>', n = 5;
    for (var i = 0; i < n; i++) { var t = i / n, y = 262 - t * 190, x = 120 + Math.sin(t * 3) * 6, L = 62 - t * 22, W = 18 - t * 5; s += leaf(x, y, L, W, 52 + R() * 8, R) + leaf(x, y - 12, L * .94, W, -52 - R() * 8, R); }
    return s + leaf(122, 70, 38, 11, 0, R);
  }
  function petal(len, wid) { return '<path d="M0 0C' + f(-wid) + ' ' + f(-len * .5) + ' ' + f(-wid * .6) + ' ' + f(-len) + ' 0 ' + f(-len) + 'C' + f(wid * .6) + ' ' + f(-len) + ' ' + f(wid) + ' ' + f(-len * .5) + ' 0 0Z" stroke-width="1"/><path d="M0 ' + f(-len * .1) + 'V' + f(-len * .85) + '" stroke-width=".5" opacity=".7"/>'; }
  function flower(R, id) {
    var n = id === 'chamomile' || id === 'calendula' ? 14 : id === 'saffron' ? 6 : id === 'rose' ? 8 : 7, s = '<path d="M120 290Q' + f(118 + R() * 8) + ' 215 120 150" stroke-width="1.6"/>';
    s += leaf(120, 250, 56, 16, 55, R) + leaf(120, 222, 46, 13, -58, R);
    var rows = id === 'rose' ? 3 : 1;
    for (var r = 0; r < rows; r++) for (var i = 0; i < n; i++) { var a = i / n * 360 + r * 360 / n / 2; s += '<g transform="translate(120 112) rotate(' + f(a) + ' 0 0) scale(' + f(1 - r * .28) + ')">' + petal(id === 'chamomile' ? 52 : 58, id === 'chamomile' ? 7 : 17) + '</g>'; }
    s += '<circle cx="120" cy="112" r="' + (id === 'chamomile' ? 12 : 9) + '" stroke-width="1.2"/>';
    for (var k = 0; k < 14; k++) { var aa = R() * TAU, rr = R() * 7; s += '<circle cx="' + f(120 + Math.cos(aa) * rr) + '" cy="' + f(112 + Math.sin(aa) * rr) + '" r=".7" fill="currentColor"/>'; }
    return s;
  }
  function root(R) {
    var s = '';
    function piece(x, y, len, th, ang) {
      var g = '<g transform="translate(' + x + ' ' + y + ') rotate(' + ang + ')">';
      g += '<path d="M0 ' + f(-th / 2) + 'C' + f(len * .3) + ' ' + f(-th * .75) + ' ' + f(len * .7) + ' ' + f(-th * .35) + ' ' + f(len) + ' ' + f(-th * .15) + 'C' + f(len + th * .4) + ' 0 ' + f(len + th * .3) + ' ' + f(th * .4) + ' ' + f(len) + ' ' + f(th * .25) + 'C' + f(len * .7) + ' ' + f(th * .7) + ' ' + f(len * .3) + ' ' + f(th * .8) + ' 0 ' + f(th / 2) + 'C' + f(-th * .4) + ' ' + f(th * .3) + ' ' + f(-th * .4) + ' ' + f(-th * .3) + ' 0 ' + f(-th / 2) + 'Z" stroke-width="1.3"/>';
      for (var i = 1; i < len / 12; i++) { var xx = i * 12 + R() * 3; g += '<path d="M' + f(xx) + ' ' + f(-th * .45) + 'Q' + f(xx + 3) + ' 0 ' + f(xx) + ' ' + f(th * .45) + '" stroke-width=".6" opacity=".8"/>'; }
      for (var j = 0; j < len / 8; j++) { var x2 = R() * len; g += '<path d="M' + f(x2) + ' ' + f(th * .1 + R() * th * .3) + 'l' + f(5 + R() * 6) + ' 1" stroke-width=".4" opacity=".5"/>'; }
      return g + '</g>';
    }
    s += piece(28, 178, 140, 30, -6) + piece(110, 150, 70, 22, -52) + piece(70, 205, 90, 22, 18);
    for (var i = 0; i < 14; i++) { var x = 40 + R() * 150, y = 205 + R() * 20; s += '<path d="M' + f(x) + ' ' + f(y) + 'q' + f(R() * 8 - 4) + ' ' + f(20 + R() * 26) + ' ' + f(R() * 18 - 9) + ' ' + f(40 + R() * 20) + '" stroke-width=".6" opacity=".7"/>'; }
    return s;
  }
  function quill(x, y, len, rad, ang) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + ang + ')"><path d="M0 ' + (-rad) + 'H' + len + 'M0 ' + rad + 'H' + len + '" stroke-width="1.3"/><ellipse cx="0" cy="0" rx="' + f(rad * .45) + '" ry="' + rad + '" stroke-width="1.3"/><ellipse cx="0" cy="0" rx="' + f(rad * .22) + '" ry="' + f(rad * .55) + '" stroke-width=".8"/><path d="M0 0c' + f(rad * .1) + ' ' + f(-rad * .5) + ' ' + f(rad * .3) + ' ' + f(-rad * .5) + ' ' + f(rad * .35) + ' 0" stroke-width=".6"/><ellipse cx="' + len + '" cy="0" rx="' + f(rad * .45) + '" ry="' + rad + '" stroke-width="1.3"/><path d="M' + (len * .1) + ' ' + f(-rad * .6) + 'H' + (len * .96) + 'M' + (len * .06) + ' ' + f(-rad * .2) + 'H' + (len * .94) + 'M' + (len * .08) + ' ' + f(rad * .25) + 'H' + (len * .95) + 'M' + (len * .12) + ' ' + f(rad * .62) + 'H' + (len * .9) + '" stroke-width=".5" opacity=".7"/></g>';
  }
  function bark(R) { return quill(24, 120, 175, 17, -10) + quill(38, 168, 150, 14, 6) + quill(52, 214, 170, 12, -4); }
  function seed(R) {
    function one(x, y, rx, ry, a, ridges) { var g = '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(a) + ')"><ellipse rx="' + f(rx) + '" ry="' + f(ry) + '" stroke-width="1.1"/>'; for (var i = -ridges; i <= ridges; i++) { var dx = i / (ridges + .6) * rx; g += '<path d="M' + f(dx) + ' ' + f(-ry * Math.sqrt(Math.max(0, 1 - (dx * dx) / (rx * rx))) * .9) + 'V' + f(ry * Math.sqrt(Math.max(0, 1 - (dx * dx) / (rx * rx))) * .9) + '" stroke-width=".45" opacity=".75"/>'; } return g + '</g>'; }
    var s = one(120, 118, 36, 54, 14, 5);
    for (var i = 0; i < 16; i++) s += one(36 + R() * 168, 196 + R() * 86, 7 + R() * 3, 12 + R() * 4, R() * 180, 2);
    s += '<path d="M70 70l-20-14M170 62l22-14" stroke-width=".7" opacity=".6"/>';
    return s;
  }
  function pod(R, id) {
    var s = '';
    if (id === 'star-anise') {
      for (var i = 0; i < 8; i++) { var a = i * 45; s += '<g transform="translate(120 150) rotate(' + a + ')"><path d="M0 0C-14 -10 -22 -40 0 -78C22 -40 14 -10 0 0Z" stroke-width="1.2"/><path d="M0 -10V-66" stroke-width=".6"/><ellipse cx="0" cy="-48" rx="4" ry="7" stroke-width=".7"/></g>'; }
      return s + '<circle cx="120" cy="150" r="9" stroke-width="1.2"/>';
    }
    for (var k = 0; k < 3; k++) { var x = 70 + k * 50, a = (k - 1) * 18; s += '<g transform="translate(' + x + ' 250) rotate(' + a + ')"><path d="M0 0C-24 -40 -22 -120 0 -190C22 -120 24 -40 0 0Z" stroke-width="1.3"/><path d="M0 0V-186M-9 -30C-10 -90 -8 -140 0 -186M9 -30C10 -90 8 -140 0 -186" stroke-width=".55" opacity=".75"/><path d="M-5 0h10M-3 6h6" stroke-width="1"/></g>'; }
    return s;
  }
  function fruit(R, id) {
    var s = '';
    if (id === 'cayenne') return '<path d="M70 70C110 60 130 120 150 170C165 205 190 230 205 258C150 250 120 215 105 170C95 140 85 100 70 70Z" stroke-width="1.4"/><path d="M70 70c-6-12 4-22 16-20c10 2 12 14 4 20" stroke-width="1.2"/><path d="M82 52c2-10 10-16 18-14" stroke-width="1.2"/><path d="M96 95c14 40 28 90 62 150M118 90c8 36 22 80 48 128" stroke-width=".5" opacity=".7"/>';
    if (id === 'dates') { s = ''; for (var d = 0; d < 3; d++) s += '<g transform="translate(' + (68 + d * 48) + ' ' + (110 + d * 22) + ') rotate(' + (d * 22 - 20) + ')"><ellipse rx="26" ry="50" stroke-width="1.3"/><path d="M-12 -30C-16 -6 -16 18 -10 36M12 -30C16 -6 16 18 10 36M0 -48V48" stroke-width=".5" opacity=".7"/><path d="M-4 -52c-2-7 3-11 8-9" stroke-width="1"/></g>'; return s; }
    if (id === 'coconut') return '<circle cx="105" cy="150" r="66" stroke-width="1.4"/><circle cx="105" cy="150" r="52" stroke-width=".7" opacity=".7"/><path d="M60 110c22 6 40 6 62-2M52 140c30 8 54 8 82-2M54 172c26 6 50 6 74-2" stroke-width=".5" opacity=".7"/><circle cx="92" cy="118" r="4" stroke-width="1"/><circle cx="116" cy="116" r="4" stroke-width="1"/><circle cx="104" cy="132" r="4" stroke-width="1"/><path d="M170 215c18-8 40-6 52 8-16 12-40 10-52-8z" stroke-width="1"/><ellipse cx="195" cy="226" rx="26" ry="14" stroke-width="1"/>';
    s = '<circle cx="105" cy="132" r="62" stroke-width="1.4"/>';
    for (var i = 0; i < 16; i++) { var a = i / 16 * TAU; s += '<path d="M' + f(105 + Math.cos(a) * 24) + ' ' + f(132 + Math.sin(a) * 24) + 'L' + f(105 + Math.cos(a) * 58) + ' ' + f(132 + Math.sin(a) * 58) + '" stroke-width=".4" opacity=".5"/>'; }
    s += '<path d="M92 72q13-12 26 0q-6 8-13 6q-7 2-13-6z" stroke-width="1.2"/><path d="M105 70V52q2-8 10-8" stroke-width="1.2"/>';
    s += '<circle cx="170" cy="222" r="42" stroke-width="1.3"/><circle cx="170" cy="222" r="34" stroke-width=".8"/>';
    if (id === 'pomegranate') { for (var j = 0; j < 40; j++) { var aa = R() * TAU, rr = Math.sqrt(R()) * 30; s += '<circle cx="' + f(170 + Math.cos(aa) * rr) + '" cy="' + f(222 + Math.sin(aa) * rr) + '" r="3.2" stroke-width=".7"/>'; } }
    else { for (var w = 0; w < 8; w++) { var a2 = w / 8 * TAU; s += '<path d="M170 222L' + f(170 + Math.cos(a2) * 34) + ' ' + f(222 + Math.sin(a2) * 34) + '" stroke-width=".7"/><ellipse cx="' + f(170 + Math.cos(a2 + .39) * 20) + '" cy="' + f(222 + Math.sin(a2 + .39) * 20) + '" rx="2" ry="4" transform="rotate(' + f((a2 + .39) * 57.3 + 90) + ' ' + f(170 + Math.cos(a2 + .39) * 20) + ' ' + f(222 + Math.sin(a2 + .39) * 20) + ')" stroke-width=".6"/>'; } }
    return s;
  }
  function resin(R) {
    var s = '';
    function lump(cx, cy, r) { var pts = [], n = 9; for (var i = 0; i < n; i++) { var a = i / n * TAU, rr = r * (.7 + R() * .4); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .8]); } var d = 'M' + f((pts[0][0] + pts[n - 1][0]) / 2) + ' ' + f((pts[0][1] + pts[n - 1][1]) / 2); for (var j = 0; j < n; j++) { var p = pts[j], q = pts[(j + 1) % n]; d += 'Q' + f(p[0]) + ' ' + f(p[1]) + ' ' + f((p[0] + q[0]) / 2) + ' ' + f((p[1] + q[1]) / 2); } var g = '<path d="' + d + 'Z" stroke-width="1.3"/>'; for (var k = 0; k < 5; k++) { var a2 = R() * TAU; g += '<path d="M' + f(cx + Math.cos(a2) * r * .1) + ' ' + f(cy + Math.sin(a2) * r * .1) + 'L' + f(cx + Math.cos(a2) * r * .7) + ' ' + f(cy + Math.sin(a2) * r * .6) + '" stroke-width=".55" opacity=".7"/>'; } return g; }
    s += lump(100, 110, 44) + lump(160, 200, 38) + lump(72, 220, 28) + lump(180, 100, 22);
    s += '<path d="M120 270c-8-14-8-22 0-30c8 8 8 16 0 30z" stroke-width="1.1"/>';
    return s;
  }
  function grain(R, id) {
    var s = '';
    if (id === 'maize') {
      s += '<path d="M120 290V250" stroke-width="1.5"/><ellipse cx="120" cy="150" rx="34" ry="92" stroke-width="1.4"/>';
      for (var r = 0; r < 14; r++) for (var c = -2; c <= 2; c++) s += '<rect x="' + f(120 + c * 11.5 - 4.5) + '" y="' + f(70 + r * 12) + '" width="9" height="10" rx="2.5" stroke-width=".6"/>';
      s += '<path d="M86 240C40 220 30 130 52 70C70 110 80 170 86 240zM154 240C200 220 210 130 188 70C170 110 160 170 154 240z" stroke-width="1.2"/><path d="M60 110c6 40 16 80 26 120M180 110c-6 40-16 80-26 120" stroke-width=".5" opacity=".7"/>';
      return s;
    }
    if (id === 'millet' || id === 'sorghum') {
      s += '<path d="M120 290V150" stroke-width="1.6"/>' + leaf(120, 270, 100, 14, 62, R) + leaf(120, 240, 90, 12, -64, R);
      s += '<ellipse cx="120" cy="96" rx="' + (id === 'millet' ? 22 : 30) + '" ry="74" stroke-width="1.3"/>';
      for (var i = 0; i < 70; i++) { var y = 30 + R() * 130, wv = (id === 'millet' ? 20 : 28) * Math.sqrt(Math.max(0, 1 - Math.pow((y - 96) / 74, 2))), x = 120 + (R() * 2 - 1) * wv; s += '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="3.4" ry="4.6" stroke-width=".55"/>'; }
      return s;
    }
    s += '<path d="M120 290Q118 190 138 90Q150 50 176 40" stroke-width="1.6"/>';
    for (var k = 0; k < 11; k++) { var t = k / 11, x2 = 136 + t * 38 - Math.sin(t * 3) * 6, y2 = 94 - t * 50 + t * t * 20; for (var sd = -1; sd <= 1; sd += 2) s += '<g transform="translate(' + f(x2) + ' ' + f(y2) + ') rotate(' + f(sd * (40 + k * 2)) + ')"><path d="M0 0q5 -2 10 12q-4 4 -10 0q-4 -8 0 -12z" stroke-width=".8" transform="translate(0 0) scale(1.1)"/><path d="M5 12l6 18" stroke-width=".5" opacity=".7"/></g>'; }
    s += leaf(120, 270, 110, 12, 66, R) + leaf(122, 230, 96, 11, -68, R);
    return s;
  }
  function sweet(R, id) {
    var s = '';
    if (id === 'sugar') { for (var i = 0; i < 3; i++) { var x = 80 + i * 40; s += '<path d="M' + x + ' 290V70" stroke-width="12" stroke-opacity=".0"/><rect x="' + (x - 9) + '" y="70" width="18" height="220" stroke-width="1.3"/>'; for (var n = 0; n < 8; n++) s += '<path d="M' + (x - 9) + ' ' + (92 + n * 28) + 'h18" stroke-width="1.2"/><path d="M' + (x - 5) + ' ' + (102 + n * 28) + 'v14M' + (x + 4) + ' ' + (100 + n * 28) + 'v16" stroke-width=".4" opacity=".7"/>'; s += leaf(x, 70, 70, 9, 28 - i * 28, R); } return s; }
    function hex(cx, cy, r) { var d = ''; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * r) + ' ' + f(cy + Math.sin(a) * r); } return '<path d="' + d + 'Z" stroke-width="1.1"/>'; }
    var r = 22, h = r * Math.sqrt(3);
    for (var row = 0; row < 4; row++) for (var col = 0; col < 4; col++) { var cx = 52 + col * r * 1.5, cy = 78 + row * h + (col % 2 ? h / 2 : 0); if (R() > .1) s += hex(cx, cy, r - 1.5); }
    s += '<path d="M200 170c-14 24-22 36-22 50a22 22 0 0 0 44 0c0-14-8-26-22-50z" stroke-width="1.3"/><path d="M190 224c0 8 6 14 14 14" stroke-width=".8" opacity=".8"/>';
    return s;
  }
  function crystal(R) {
    function cube(x, y, s) { var a = s * .87, b = s * .5; return '<path d="M' + x + ' ' + (y - s) + 'l' + f(a) + ' ' + f(b) + 'v' + s + 'l' + f(-a) + ' ' + f(b) + 'l' + f(-a) + ' ' + f(-b) + 'v' + (-s) + 'z" stroke-width="1.3"/><path d="M' + x + ' ' + (y - s) + 'l' + f(a) + ' ' + f(b) + 'l' + f(-a) + ' ' + f(b) + 'l' + f(-a) + ' ' + f(-b) + 'z" stroke-width=".9"/><path d="M' + x + ' ' + f(y) + 'v' + s + '" stroke-width=".9"/><path d="M' + f(x - a * .8) + ' ' + f(y + s * .1) + 'l0 ' + f(s * .6) + 'M' + f(x - a * .5) + ' ' + f(y + s * .3) + 'l0 ' + f(s * .6) + '" stroke-width=".4" opacity=".6"/>'; }
    var s = cube(120, 160, 48) + cube(52, 215, 28) + cube(184, 226, 22) + cube(150, 82, 20) + cube(80, 104, 14);
    for (var i = 0; i < 40; i++) s += '<circle cx="' + f(24 + R() * 190) + '" cy="' + f(256 + R() * 26) + '" r="' + f(.7 + R() * 1.5) + '" fill="currentColor" opacity=".7"/>';
    return s;
  }
  function tree(R, id) {
    var s = '';
    if (id === 'baobab') {
      s += '<path d="M92 284C100 250 84 210 88 170C90 140 92 120 104 104L136 104C148 120 150 140 152 170C156 210 140 250 148 284Z" stroke-width="1.4"/>';
      for (var i = 0; i < 12; i++) { var y = 120 + i * 14; s += '<path d="M' + f(94 + R() * 4) + ' ' + y + 'q' + f(10 + R() * 8) + ' ' + f(-4 + R() * 8) + ' ' + f(22 + R() * 6) + ' 0M' + f(122 + R() * 4) + ' ' + f(y + 6) + 'q' + f(8) + ' ' + f(-3) + ' ' + f(20) + ' 0" stroke-width=".5" opacity=".7"/>'; }
      var br = [[104, 106, 60, 46], [112, 104, 100, 30], [124, 104, 138, 44], [136, 106, 170, 60], [118, 104, 84, 70], [128, 104, 160, 90]];
      br.forEach(function (b) { s += '<path d="M' + b[0] + ' ' + b[1] + 'Q' + f((b[0] + b[2]) / 2) + ' ' + f(b[3] + 16) + ' ' + b[2] + ' ' + b[3] + '" stroke-width="1.2"/>'; for (var k = 0; k < 5; k++) s += '<path d="M' + f(b[2] + R() * 16 - 8) + ' ' + f(b[3] + R() * 6) + 'l' + f(R() * 12 - 6) + ' ' + f(-10 - R() * 8) + '" stroke-width=".5"/>'; });
      s += '<ellipse cx="62" cy="140" rx="7" ry="16" stroke-width="1"/><path d="M62 124v-8" stroke-width=".9"/><ellipse cx="182" cy="150" rx="7" ry="16" stroke-width="1"/><path d="M182 134v-8" stroke-width=".9"/>';
      return s;
    }
    s += '<path d="M112 290C116 240 112 200 120 160C124 140 118 128 108 110M120 160C128 140 140 128 156 112M116 210C98 190 82 176 64 170" stroke-width="1.5"/><path d="M104 290h28" stroke-width="1.4"/>';
    for (var c = 0; c < 22; c++) { var a = R() * Math.PI, rx = 40 + R() * 54, cx = 120 + Math.cos(a) * rx * (R() > .5 ? 1 : -1), cy = 90 - Math.sin(a) * 38 + R() * 24; s += '<path d="M' + f(cx - 14) + ' ' + f(cy) + 'q14 -14 28 0q-14 8 -28 0z" stroke-width=".8" opacity=".9"/>'; }
    s += '<path d="M40 100c20-40 140-50 170-4" stroke-width="1" opacity=".7"/>';
    return s;
  }

  function plate(item, idx) {
    var R = rng(item.id), body = '', a = item.art;
    if (a === 'sprig') body = sprig(R); else if (a === 'flower') body = flower(R, item.id); else if (a === 'root') body = root(R);
    else if (a === 'bark') body = bark(R); else if (a === 'seed') body = seed(R); else if (a === 'pod') body = pod(R, item.id);
    else if (a === 'fruit') body = fruit(R, item.id); else if (a === 'resin') body = resin(R); else if (a === 'grain') body = grain(R, item.id);
    else if (a === 'sweet') body = sweet(R, item.id); else if (a === 'crystal') body = crystal(R); else if (a === 'tree') body = tree(R, item.id); else body = sprig(R);
    var sci = (item.sci || '').split(/[;(]/)[0].trim();
    if (sci.length > 34) sci = sci.slice(0, 33) + '…';
    return '<svg viewBox="0 0 240 300" role="img" aria-label="Schematic engraving of ' + esc(item.n) + ' (' + esc(a) + ' type)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="6" y="6" width="228" height="288" stroke-width="1.2" opacity=".8"/><rect x="11" y="11" width="218" height="278" stroke-width=".5" opacity=".6"/>' +
      '<g transform="translate(0 4)">' + body + '</g>' +
      '<text x="120" y="29" text-anchor="middle" font-family="Cormorant SC,serif" font-size="9" letter-spacing="3" fill="currentColor" stroke="none" opacity=".85">PLATE ' + roman(idx + 1) + '</text>' +
      '<path d="M40 276h160" stroke-width=".5" opacity=".7"/><path d="M40 273v6M80 274v4M120 273v6M160 274v4M200 273v6" stroke-width=".5" opacity=".7"/>' +
      '<text x="120" y="288" text-anchor="middle" font-family="EB Garamond,serif" font-style="italic" font-size="8.5" fill="currentColor" stroke="none" opacity=".85">' + esc(sci) + '</text></svg>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  window.OrisonArt = { icon: icon, diamond: diamond, armillary: armillary, entrance: entrance, plate: plate, hash: hash, rng: rng, roman: roman, esc: esc };
})();
