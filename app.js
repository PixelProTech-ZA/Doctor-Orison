/* Doctor Orison — application shell, router and the general screens
   (home, search, listen, daily path, my archive, account, about). Department screens live in
   views-bible.js, views-prayer.js, views-archive.js and cms.js. */
(function () {
  'use strict';
  var O = window.Orison, A = window.OrisonArt, Store = O.Store, Bible = O.Bible, Voice = O.Voice, Cloud = O.Cloud, h = O.esc;
  var BK = window.OrisonBooks, PR = window.OrisonPrayers, IG = window.OrisonIngredients;
  var ic = A.icon;
  var App = { routes: {}, acts: {}, el: null, cms: [], cmsLoaded: false, cur: '' };
  window.App = App;
  App.route = function (n, fn) { App.routes[n] = fn; };
  App.act = function (n, fn) { App.acts[n] = fn; };
  var SIZES = ['1rem', '1.12rem', '1.25rem', '1.45rem', '1.7rem'];

  /* ---------- helpers ---------- */
  App.rule = function (t) { return '<div class="rule">' + A.diamond() + '<span>' + h(t) + '</span>' + A.diamond() + '</div>'; };
  App.loading = function (t) { return '<div class="loading" role="status"><div class="spin"></div><span>' + h(t || 'Opening the archive…') + '</span></div>'; };
  App.empty = function (t, sub) { return '<div class="empty">' + ic('book', 56) + '<p><b>' + h(t) + '</b></p>' + (sub ? '<p class="small">' + sub + '</p>' : '') + '</div>'; };
  App.error = function (msg, retry) { return '<div class="notice warn" role="alert"><b class="t">Something went wrong</b>' + h(msg) + (retry ? '<p><button class="btn sm" data-act="reload">Try again</button></p>' : '') + '</div>'; };
  App.announce = function (m) { var l = document.getElementById('live'); if (l) { l.textContent = ''; setTimeout(function () { l.textContent = m; }, 40); } };
  App.toast = function (m) { var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = m; document.body.appendChild(t); App.announce(m); setTimeout(function () { t.remove(); }, 2400); };
  App.modal = function (html, opt) {
    opt = opt || {}; App.closeModal(); var m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
    m.innerHTML = '<div class="mbox" role="dialog" aria-modal="true" aria-label="' + h(opt.label || 'Dialog') + '"><button class="btn sm x" data-act="closeModal" aria-label="Close">' + ic('x', 16) + '</button>' + html + '</div>';
    m.addEventListener('mousedown', function (e) { if (e.target === m) App.closeModal(); }); document.body.appendChild(m);
    App.prevFocus = document.activeElement; var f = m.querySelector('input,button.pri,button:not(.x),a'); (f || m.querySelector('.x')).focus(); return m;
  };
  App.closeModal = function () { var m = document.getElementById('modal'); if (m) { m.remove(); if (App.prevFocus && App.prevFocus.focus) try { App.prevFocus.focus(); } catch (e) { } } };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (document.getElementById('modal')) { App.closeModal(); return; } var s = document.getElementById('sheet'); if (s && App.acts.clearSel) App.acts.clearSel(); } });
  App.download = function (name, text, type) { var b = new Blob([text], { type: type || 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
  App.copy = function (text) { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { App.toast('Copied'); }, function () { App.toast('Copy was blocked by the browser'); }); var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); App.toast('Copied'); } catch (e) { App.toast('Copy is not available'); } t.remove(); return Promise.resolve(); };
  App.listenBtn = function (label, key, persona, small) { return '<button class="btn' + (small ? ' sm' : '') + '" data-act="listen" data-key="' + h(key) + '" data-persona="' + (persona || 'guide') + '">' + ic('play', 14) + ' ' + h(label || 'Listen') + '</button>'; };
  App.audioSrc = {}; /* key -> {title,text,persona} registered by views */
  App.regAudio = function (key, title, text, persona) { App.audioSrc[key] = { title: title, text: text, persona: persona }; return key; };
  App.fmtDate = function (t) { return new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); };
  App.quote = function (ref, max) { var vs = Bible.verses(ref); if (!vs.length) return ''; var more = max && vs.length > max; if (more) vs = vs.slice(0, max); return '<div class="scripture"><p>' + vs.map(function (v) { return (vs.length > 1 ? '<sup class="small">' + v.n + '</sup> ' : '') + h(v.t); }).join(' ') + (more ? ' …' : '') + '</p><span class="attrib"><a href="#/bible/' + ref.split('.')[0] + '/' + ref.split('.')[1] + '">' + h(Bible.label(ref)) + '</a></span></div>'; };
  App.withBible = function (el, fn) {
    el.innerHTML = App.loading('Opening the Bible Vault…');
    return Bible.load().then(function () { if (App.el !== el) return; fn(); }).catch(function (e) { el.innerHTML = '<h1>The Bible Vault</h1>' + App.error(e.message, true); });
  };
  var TAGS = { BIB: ['BIBLICAL', 'bib'], AFR: ['AFRICAN TRADITIONAL', 'afr'], WLD: ['WORLD TRADITIONS', 'wld'], HIS: ['HISTORICAL', 'his'], SCI: ['MODERN SCIENTIFIC KNOWLEDGE', 'sci'] };
  App.TAGS = TAGS;
  App.tagChips = function (arr) { return arr.map(function (k) { return '<span class="chip ' + TAGS[k][1] + '">' + TAGS[k][0] + '</span>'; }).join(' '); };
  var AFRIDS = { hibiscus: 1, millet: 1, sorghum: 1, maize: 1, sesame: 1, cloves: 0 };
  App.ingTags = function (i) { var t = []; if (i.bible && i.bible.refs.length) t.push('BIB'); if (i.cat === 'African botanicals' || AFRIDS[i.id]) t.push('AFR'); if (i.culture && i.culture.length && i.cat !== 'African botanicals') t.push('WLD'); if (i.hist) t.push('HIS'); if (i.ev) t.push('SCI'); return t; };
  App.dailyPick = function (arr, off) { return arr[(O.dayIndex() + (off || 0)) % arr.length]; };

  /* ---------- preferences applied to the page ---------- */
  App.applyPrefs = function () {
    var p = Store.s.prefs, b = document.body.classList;
    b.toggle('theme-parch', p.theme === 'parch'); b.toggle('hc', !!p.hc); b.toggle('dys', !!p.dys); b.toggle('nomo', !!p.nomo);
    document.documentElement.style.setProperty('--read', SIZES[Math.max(0, Math.min(4, p.size))]);
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = p.theme === 'parch' ? '#E8DDC4' : '#101010';
  };

  /* ---------- player ---------- */
  function drawPlayer() {
    var el = document.getElementById('player'); if (!el) return; var active = Voice.state === 'playing' || Voice.state === 'paused';
    document.body.classList.toggle('hasplayer', active || !!Voice.err);
    if (!active && !Voice.err) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;
    var url = Voice.mode === 'url' && Voice.audio, max = url ? (Voice.audio.duration || 0) : Math.max(0, Voice.q.length - 1), val = url ? Voice.audio.currentTime : Voice.i;
    var prev = el.querySelector('input[type=range]'); if (prev && document.activeElement === prev) { return; }
    el.innerHTML =
      '<div class="row"><button class="btn ico" data-act="vprev" aria-label="Previous">' + ic('prev', 18) + '</button><button class="btn pri ico" data-act="vtoggle" aria-label="' + (Voice.state === 'playing' ? 'Pause' : 'Play') + '">' + ic(Voice.state === 'playing' ? 'pause' : 'play', 18) + '</button><button class="btn ico" data-act="vnext" aria-label="Next">' + ic('next', 18) + '</button></div>' +
      '<div class="ti"><b>' + h(Voice.title) + '</b>' + (Voice.err ? '<span class="small" style="color:var(--danger)">' + h(Voice.err) + '</span>' : '<span class="synth">' + (Voice.synthetic() ? 'Synthetic voice · not a human recording · ' + h((O.PERSONAS[Voice.persona] || {}).name || '') : 'Recorded audio') + '</span>') + '<input type="range" min="0" max="' + max + '" step="' + (url ? .5 : 1) + '" value="' + val + '" aria-label="Seek" data-act="vseek"></div>' +
      '<div class="row extra"><label class="sr" for="vrate">Speed</label><select id="vrate" data-act="vrate" style="width:auto"><option value="0.75">0.75×</option><option value="0.9">0.9×</option><option value="1">1×</option><option value="1.1">1.1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select><button class="btn sm" data-act="vstop">' + ic('stop', 12) + ' Stop</button></div>';
    var sel = el.querySelector('#vrate'); if (sel) sel.value = String(Store.s.prefs.rate);
    if (sel && !sel.value) sel.value = '1';
  }
  Voice.onstate.push(drawPlayer);
  App.acts.vtoggle = function () { Voice.toggle(); }; App.acts.vprev = function () { Voice.skip(-1); }; App.acts.vnext = function () { Voice.skip(1); }; App.acts.vstop = function () { Voice.stop(); Voice.err = ''; drawPlayer(); };
  App.acts.vseek = function (el) { Voice.seek(+el.value); }; App.acts.vrate = function (el) { Voice.rate(+el.value); };
  App.acts.listen = function (el) {
    var src = App.audioSrc[el.dataset.key]; if (!src) { App.toast('Nothing to read here yet'); return; }
    Store.touch(); var segs = Array.isArray(src.text) ? src.text : [{ id: 'a', text: src.text }]; Voice.play(src.title, segs, { persona: src.persona || el.dataset.persona });
  };

  /* ---------- router ---------- */
  function parse() { var hsh = location.hash.replace(/^#\/?/, ''), q = hsh.split('?'), parts = q[0].split('/').filter(Boolean).map(decodeURIComponent), qs = {}; (q[1] || '').split('&').forEach(function (kv) { if (kv) { var p = kv.split('='); qs[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' ')); } }); return { parts: parts, qs: qs }; }
  App.go = function (path) { location.hash = '#/' + path; };
  App.render = function () {
    var r = parse(), name = r.parts[0] || 'home', fn = App.routes[name];
    if (Bible.stopHome) { try { Bible.stopHome(); } catch (e) { } Bible.stopHome = null; }
    App.cur = name; var el = App.el = document.getElementById('app'); el.innerHTML = '';
    if (!fn) { el.innerHTML = '<h1>Not found</h1><p>That page is not in the archive.</p><a class="btn" href="#/">Return home</a>'; document.title = 'Not found · Doctor Orison'; setNav(); return; }
    try { fn(el, r.parts.slice(1), r.qs); } catch (e) { console.error(e); el.innerHTML = '<h1>Error</h1>' + App.error('This page failed to draw: ' + e.message, true); }
    setNav(); window.scrollTo(0, 0); var hh = el.querySelector('h1'); if (hh) { hh.setAttribute('tabindex', '-1'); document.title = hh.textContent.replace(/\s+/g, ' ').trim() + ' · Doctor Orison'; if (name !== 'home') hh.focus({ preventScroll: true }); } else document.title = 'Doctor Orison';
    var sh = document.getElementById('sheet'); if (sh) sh.remove();
  };
  var NAV = [['home', 'Home', 'home', ''], ['bible', 'Bible Vault', 'book', 'I'], ['prayer', 'Prayer Chamber', 'pray', 'II'], ['archive', 'Botanical Archive', 'leaf', 'IV'], ['daily', 'Daily Path', 'sun', 'X'], ['-'], ['search', 'Search', 'search', ''], ['listen', 'Listen', 'ear', ''], ['me', 'My Archive', 'user', ''], ['account', 'Account', 'shield', ''], ['cms', 'Editors', 'gear', ''], ['about', 'About & Sources', 'book', '']];
  function navHTML() {
    return NAV.filter(function (n) { return n[0] !== 'cms' || (Cloud.role && Cloud.role !== 'user'); }).map(function (n) { if (n[0] === '-') return '<hr>'; return '<a href="#/' + (n[0] === 'home' ? '' : n[0]) + '" data-nav="' + n[0] + '"><span class="no">' + (n[3] || ic(n[2], 16)) + '</span><span>' + n[1] + '</span></a>'; }).join('');
  }
  function setNav() { document.querySelectorAll('[data-nav]').forEach(function (a) { if (a.dataset.nav === App.cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }
  function buildShell() {
    document.getElementById('nav').innerHTML = navHTML();
    document.getElementById('tabbar').innerHTML = [['home', 'Home', 'home'], ['bible', 'Bible', 'book'], ['prayer', 'Prayer', 'pray'], ['archive', 'Botanical', 'leaf']].map(function (n) { return '<a href="#/' + (n[0] === 'home' ? '' : n[0]) + '" data-nav="' + n[0] + '">' + ic(n[2], 20) + '<span>' + n[1] + '</span></a>'; }).join('') + '<a href="#" data-act="more" role="button">' + ic('more', 20) + '<span>More</span></a>';
    setNav();
  }
  App.acts.more = function (el, e) { e.preventDefault(); App.modal('<h2>More</h2><div class="nav" style="gap:.3rem">' + navHTML().replace(/<a /g, '<a data-act="closeModal" ') + '</div>', { label: 'More' }); };
  App.acts.closeModal = function () { App.closeModal(); }; App.acts.reload = function () { Bible.loading = null; App.render(); };
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return; var fn = App.acts[t.dataset.act]; if (fn) { if (t.tagName === 'A' && t.dataset.act !== 'closeModal') e.preventDefault(); fn(t, e); }
  });
  document.addEventListener('change', function (e) { var t = e.target.closest('[data-chg]'); if (t && App.acts[t.dataset.chg]) App.acts[t.dataset.chg](t, e); var r = e.target.closest('select[data-act],input[data-act][type=range]'); if (r && App.acts[r.dataset.act]) App.acts[r.dataset.act](r, e); });
  document.addEventListener('submit', function (e) { var f = e.target.closest('form[data-submit]'); if (f) { e.preventDefault(); var fn = App.acts[f.dataset.submit]; if (fn) fn(f, e); } });

  /* ================= HOME ================= */
  App.route('home', function (el) {
    var s = Store.s, ch = Object.keys(s.completed).length, pct = Math.round(ch / Bible.totalChapters * 100), st = Store.streak();
    var ref = App.dailyPick(PR.DAILY.scripture), refl = App.dailyPick(PR.DAILY.reflection), pr = App.dailyPick(PR.PRAYER_LIBRARY), lessonsDone = Object.keys(s.lessonsDone).length;
    var last = s.lastRead; var notes = Object.keys(s.notes).length, bms = s.bookmarks.length;
    el.innerHTML =
      '<section class="hero" aria-label="The archive entrance">' + A.entrance() + '<canvas aria-hidden="true"></canvas>' +
      '<div class="txt"><img src="orison-icon.svg" alt="" width="64" height="64" style="margin-bottom:.5rem"><div class="kick">The Archive of Spiritual Knowledge</div><h1>Doctor Orison</h1><div class="sub">Understand · Honour · Cultivate · Build</div><p class="creed">Understand the Word. Honour the roots. Cultivate the mind. Build the future.</p>' +
      '<form class="sbox" role="search" data-submit="gsearch"><label class="sr" for="hs">Search everything</label><input id="hs" type="search" placeholder="Search verses, prayers, ingredients, lessons…" autocomplete="off"><button type="submit" aria-label="Search">' + ic('search', 18) + '</button></form></div></section>' +
      '<div class="grid g2">' +
      '<article class="card"><div class="eyebrow">Daily scripture</div><div id="ds">' + App.loading('Loading today’s verse…') + '</div></article>' +
      '<article class="card"><div class="eyebrow">Daily reflection</div><p class="verse-q" style="font-style:italic">' + h(refl) + '</p><a class="btn sm" href="#/daily">Open the Daily Path</a></article>' +
      '<article class="card"><div class="eyebrow">Daily prayer · ' + h(pr.t) + '</div><p>' + h(pr.text) + '</p><div class="row">' + App.listenBtn('Listen', App.regAudio('hp', pr.t, pr.text, 'prayer'), 'prayer', true) + '<a class="btn sm" href="#/prayer/library">More prayers</a></div></article>' +
      '<article class="card"><div class="eyebrow">Continue reading</div>' + (last ? '<h3>' + h(Bible.label(last.ref)) + '</h3><p class="small">Last read ' + App.fmtDate(last.at) + '</p><a class="btn pri sm" href="#/bible/' + last.ref.split('.')[0] + '/' + last.ref.split('.')[1] + '">Continue</a>' : '<h3>Begin with the Gospel of John</h3><p class="small">A good first book: the story of Jesus, told as a witness account.</p><a class="btn pri sm" href="#/bible/john/1">Start reading</a>') + '</article>' +
      '<article class="card"><div class="eyebrow">Your spiritual journey</div><div class="row" style="flex-wrap:nowrap"><div class="ring" style="--p:' + pct + '"><i>' + pct + '%</i></div><div><div class="small">' + ch + ' of ' + Bible.totalChapters + ' chapters read</div><div class="small">' + lessonsDone + ' lessons completed</div><div class="small">' + st.last30 + ' of the last 30 days visited</div></div></div></article>' +
      '<article class="card"><div class="eyebrow">Audio listening</div><p class="small">Natural-sounding narration by The Guide, The Scripture Reader and The Prayer Companion. Synthetic voices are labelled as such.</p><div class="row">' + App.listenBtn('Play today’s scripture', 'hs', 'reader', true) + '<a class="btn sm" href="#/listen">Listening room</a></div></article></div>' +
      App.rule('Explore the knowledge archives') +
      '<div class="grid g2">' + [['bible', 'I', 'The Bible Vault', 'All 66 books of the World English Bible, with search, notes, highlights, cross-references and a companion.'], ['prayer', 'II', 'The Prayer Chamber', 'Learn to pray from the first word, with lessons, a prayer library, your own prayers and recording.'], ['archive', 'IV', 'The Botanical Archive', IG.ITEMS.length + ' ingredient profiles with safety, sources and clearly labelled belief.'], ['daily', 'X', 'The Daily Path', 'Morning scripture, intention, evening reflection, gratitude journal and gentle streaks.']].map(function (d) { return '<a class="card" href="#/' + d[0] + '"><div class="eyebrow">Department ' + d[1] + '</div><h3>' + d[2] + '</h3><p class="small">' + d[3] + '</p></a>'; }).join('') + '</div>' +
      App.rule('Saved lessons and personal notes') +
      '<div class="card"><div class="row sp"><div><span class="stat">' + bms + '</span> <span class="small">bookmarked verses</span> · <span class="stat">' + notes + '</span> <span class="small">notes</span> · <span class="stat">' + (s.savedIng.length + s.savedPrayers.length) + '</span> <span class="small">saved ingredients and prayers</span></div><a class="btn sm" href="#/me/saved">Open my archive</a></div></div>';
    Bible.load().then(function () { var d = document.getElementById('ds'); if (d && App.el === el) { d.innerHTML = '<p class="verse-q">' + h(Bible.text(ref)) + '</p><div class="row sp"><span class="attrib">' + h(Bible.label(ref)) + ' · WEB</span>' + App.listenBtn('Listen', App.regAudio('hs', 'Daily scripture: ' + Bible.label(ref), Bible.text(ref), 'reader'), 'reader', true) + '</div>'; } }).catch(function (e) { var d = document.getElementById('ds'); if (d) d.innerHTML = '<p class="small">' + h(e.message) + '</p>'; });
    Bible.stopHome = A.armillary(el.querySelector('canvas')).stop;
  });
  App.acts.gsearch = function (f) { var q = f.querySelector('input').value.trim(); if (q) App.go('search?q=' + encodeURIComponent(q)); };

  /* ================= SEARCH ================= */
  var SRCSET = {};
  App.route('search', function (el, a, qs) {
    var q = (qs.q || '').trim(), types = qs.t || 'all', active = (qs.s || '').split(',').filter(Boolean);
    el.innerHTML = '<h1>Search everything</h1><form class="sbox" role="search" data-submit="gsearch2"><label class="sr" for="sq">Search</label><input id="sq" type="search" value="' + h(q) + '" placeholder="Try: anxiety, John 3:16, cinnamon, gratitude, honey" autocomplete="off"><button type="submit" aria-label="Search">' + ic('search', 18) + '</button></form>' +
      '<div class="row" style="margin:.8rem 0"><span class="small">Knowledge source:</span>' + Object.keys(TAGS).map(function (k) { return '<button class="chip ' + TAGS[k][1] + '" aria-pressed="' + (active.indexOf(k) > -1) + '" data-act="stag" data-k="' + k + '">' + TAGS[k][0] + '</button>'; }).join('') + '</div>' +
      '<div class="row" style="margin-bottom:1rem"><span class="small">Type:</span>' + [['all', 'All'], ['bible', 'Bible'], ['prayer', 'Prayers & lessons'], ['plant', 'Ingredients'], ['ref', 'Dictionary & topics']].map(function (t) { return '<button class="chip" aria-pressed="' + (types === t[0]) + '" data-act="stype" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="res">' + (q ? App.loading('Searching…') : '<p class="small">Type a word, a Bible reference like <b>Psalm 23</b>, an ingredient, or a feeling such as <b>worry</b>.</p>') + '</div>';
    SRCSET = { q: q, t: types, s: active };
    if (!q) return;
    Bible.load().then(function () { if (App.el !== el) return; doSearch(q, types, active, el.querySelector('#res')); }).catch(function (e) { el.querySelector('#res').innerHTML = App.error(e.message, true); });
  });
  App.acts.gsearch2 = function (f) { var q = f.querySelector('input').value.trim(); App.go('search?q=' + encodeURIComponent(q) + (SRCSET.t && SRCSET.t !== 'all' ? '&t=' + SRCSET.t : '') + (SRCSET.s && SRCSET.s.length ? '&s=' + SRCSET.s.join(',') : '')); };
  function setQS(o) { var m = Object.assign({}, SRCSET, o); var u = 'search?q=' + encodeURIComponent(m.q || ''); if (m.t && m.t !== 'all') u += '&t=' + m.t; if (m.s && m.s.length) u += '&s=' + m.s.join(','); App.go(u); }
  App.acts.stag = function (el) { var k = el.dataset.k, s = SRCSET.s.slice(), i = s.indexOf(k); i > -1 ? s.splice(i, 1) : s.push(k); setQS({ s: s }); };
  App.acts.stype = function (el) { setQS({ t: el.dataset.t }); };
  function mark(text, toks) { var s = h(text); toks.forEach(function (t) { if (t.length > 1) s = s.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark style="background:rgba(201,168,76,.35);color:inherit">$1</mark>'); }); return s; }
  function passes(tags, active) { return !active.length || tags.some(function (t) { return active.indexOf(t) > -1; }); }
  function doSearch(q, types, active, out) {
    var toks = q.toLowerCase().split(/\s+/).filter(Boolean), groups = [], ql = q.toLowerCase();
    function has(txt) { txt = txt.toLowerCase(); return toks.every(function (t) { return txt.indexOf(t) > -1; }); }
    var ref = Bible.parse(q); if (ref && (types === 'all' || types === 'bible') && passes(['BIB'], active)) { var p = Bible.split(ref); groups.push(['Go to passage', '<a class="card" href="#/bible/' + p.book + '/' + p.ch + (p.v1 ? '?v=' + p.v1 : '') + '"><h3>' + h(Bible.label(ref)) + '</h3>' + App.quote(ref, 3) + '</a>']); }
    if (types === 'all' || types === 'bible') {
      if (passes(['BIB'], active)) {
        var topicHits = BK.TOPICS.filter(function (t) { return has(t.t) || t.k.some(function (k) { return ql.indexOf(k) > -1 || k.indexOf(ql) > -1; }); });
        topicHits.forEach(function (t) { groups.push(['Bible topic', '<a class="card" href="#/bible/topics/' + t.id + '"><h3>Passages about: ' + h(t.t) + '</h3><p class="small">' + t.refs.length + ' curated passages</p></a>']); });
        var idx = Bible.buildIndex(), hits = [], all = 0; for (var i = 0; i < idx.length; i++) { var v = idx[i]; if (toks.every(function (t) { return v.l.indexOf(t) > -1; })) { all++; if (hits.length < 40) hits.push(v); } }
        if (hits.length) groups.push(['Bible verses · ' + all + ' found' + (all > 40 ? ' (showing 40)' : ''), hits.map(function (v) { var r = v.b + '.' + v.c + '.' + v.v; return '<a class="card" href="#/bible/' + v.b + '/' + v.c + '?v=' + v.v + '"><div class="attrib">' + h(Bible.label(r)) + '</div><p style="margin:.2rem 0 0">' + mark(v.t, toks) + '</p></a>'; }).join('')]);
        var bk = Bible.books.filter(function (b) { return b.name.toLowerCase().indexOf(ql) > -1; }); if (bk.length) groups.push(['Books', bk.map(function (b) { return '<a class="card" href="#/bible/' + b.id + '/1"><h3>' + h(b.name) + '</h3><p class="small">' + b.c.length + ' chapters · ' + (b.t === 'OT' ? 'Old' : 'New') + ' Testament</p></a>'; }).join('')]);
        var comm = Object.keys(BK.COMMENTARY).filter(function (k) { var c = BK.COMMENTARY[k]; return has(c.title + ' ' + c.mean + ' ' + c.learn + ' ' + c.why); }); if (comm.length) groups.push(['Commentary (interpretation)', comm.map(function (k) { var c = BK.COMMENTARY[k], p = Bible.split(k); return '<a class="card" href="#/bible/' + p.book + '/' + p.ch + '"><h3>' + h(c.title) + '</h3><p class="small">' + mark(c.mean, toks) + '</p></a>'; }).join('')]);
      }
    }
    if (types === 'all' || types === 'ref') {
      var d = BK.DICTIONARY.filter(function (x) { return has(x.t + ' ' + x.d); }); if (d.length && passes(['BIB', 'HIS'], active)) groups.push(['Biblical dictionary', d.map(function (x) { return '<div class="card"><h3>' + mark(x.t, toks) + '</h3><p class="small" style="color:var(--ink2)">' + mark(x.d, toks) + '</p></div>'; }).join('')]);
    }
    if (types === 'all' || types === 'prayer') {
      var pl = PR.PRAYER_LIBRARY.filter(function (x) { return has(x.t + ' ' + x.text + ' ' + x.cat); }); if (pl.length && passes(['BIB'], active)) groups.push(['Prayers', pl.map(function (x) { return '<a class="card" href="#/prayer/library?c=' + encodeURIComponent(x.cat) + '"><div class="eyebrow">' + h(x.cat) + '</div><h3>' + mark(x.t, toks) + '</h3><p class="small">' + mark(x.text.slice(0, 140), toks) + '…</p></a>'; }).join('')]);
      var ls = PR.LESSONS.filter(function (x) { return has(x.t + ' ' + x.intro + ' ' + x.steps.map(function (s) { return s.join(' '); }).join(' ')); }); if (ls.length && passes(['BIB'], active)) groups.push(['Spiritual lessons', ls.map(function (x) { return '<a class="card" href="#/prayer/lesson/' + x.id + '"><div class="eyebrow">Lesson · ' + x.time + '</div><h3>' + mark(x.t, toks) + '</h3><p class="small">' + mark(x.intro.slice(0, 150), toks) + '…</p></a>'; }).join('')]);
      var dl = PR.LESSONS_DAILY.filter(function (x) { return has(x.t + ' ' + x.b); }); if (dl.length && passes(['BIB'], active)) groups.push(['Daily teachings', dl.map(function (x) { return '<div class="card"><h3>' + mark(x.t, toks) + '</h3><p class="small">' + mark(x.b, toks) + '</p></div>'; }).join('')]);
    }
    if (types === 'all' || types === 'plant') {
      var ing = IG.ITEMS.filter(function (i) { var blob = [i.n, i.sci, i.cat, i.part, i.where, i.buy, i.cook, i.hist, i.prep, i.idn, i.ev && i.ev[1], i.tox, (i.names || []).map(function (n) { return n.join(' '); }).join(' '), (i.culture || []).map(function (c) { return c[1]; }).join(' ')].join(' '); return has(blob) && passes(App.ingTags(i), active); });
      if (ing.length) groups.push(['Ingredients, plants and trees · ' + ing.length, ing.slice(0, 40).map(function (i) { return App.ingCard(i); }).join('')]);
    }
    if (App.cms.length && types === 'all') { var cr = App.cms.filter(function (r) { return has(r.title + ' ' + (r.description || '')) && passes([r.source], active); }); if (cr.length) groups.push(['Reviewed additions', cr.map(function (r) { return '<a class="card" href="#/archive/rec/' + r.id + '"><div class="eyebrow">' + h(r.type) + '</div><h3>' + h(r.title) + '</h3><p class="small">' + h((r.description || '').slice(0, 140)) + '</p></a>'; }).join('')]); }
    if (!groups.length) { out.innerHTML = App.empty('Nothing found for “' + q + '”', 'Try a simpler word, remove a source filter, or search a Bible reference such as <b>Romans 8</b>.'); return; }
    out.innerHTML = groups.map(function (g) { return App.rule(g[0]) + '<div class="grid g2">' + g[1] + '</div>'; }).join(''); App.announce(groups.length + ' result groups');
  }
  App.ingCard = function (i) { var idx = IG.ITEMS.indexOf(i); return '<a class="card" href="#/archive/' + i.id + '"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div style="width:76px;flex:none" class="plate" aria-hidden="true">' + A.plate(i, idx) + '</div><div><div class="eyebrow">' + i.cat + '</div><h3><span class="emo" aria-hidden="true">' + i.e + '</span> ' + h(i.n) + '</h3><p class="small" style="font-style:italic;margin:0">' + h(i.sci.split(/[;(]/)[0]) + '</p><div style="margin-top:.4rem">' + App.tagChips(App.ingTags(i).slice(0, 3)) + '</div></div></div></a>'; };

  /* ================= LISTEN ================= */
  App.route('listen', function (el) {
    var P = O.PERSONAS, q = Voice.quality(), L = Store.s.listening.slice(0, 12), cfg = O.CFG.audio && O.CFG.audio.chapterUrlTemplate;
    el.innerHTML = '<h1>The Listening Room</h1><div class="notice"><b class="t">Disclosure</b>Narration here is <b>synthetic speech</b> generated by your device or browser. It is not a human recording. ' + (cfg ? 'Chapter audio is streamed from the recorded-audio source configured by the administrator.' : 'Professionally recorded human narration can be plugged in later (see the About page for the architecture).') + '</div>' +
      '<div class="notice ' + (q === 'none' ? 'warn' : '') + '"><b class="t">Voice quality on this device</b>' + (q === 'neural' ? 'A neural / natural voice is available, so narration should sound human.' : q === 'basic' ? 'Only standard system voices were found. They work, but sound more mechanical. Installing a natural voice in your device or browser settings improves this a lot (for example, “Natural” voices in Microsoft Edge, or Enhanced voices on iOS and macOS).' : 'No speech voices were found on this device yet. They may still be loading, or this browser does not support speech.') + '</div>' +
      '<div class="grid g3">' + Object.keys(P).map(function (k) { var p = P[k], sample = k === 'reader' ? 'The Lord is my shepherd; I shall not want.' : k === 'prayer' ? 'God, thank you for this day. Give me what I need, and a quiet heart. Amen.' : 'Welcome to the archive. Take your time. There is no hurry here.'; return '<div class="card"><div class="eyebrow">Voice</div><h3>' + p.name + '</h3><p class="small">' + p.desc + '</p>' + App.listenBtn('Hear a sample', App.regAudio('smp' + k, p.name, sample, k), k, true) + '</div>'; }).join('') + '</div>' +
      App.rule('Play something') + '<div class="grid g3">' +
      [['Daily scripture', 'dsr'], ['Morning prayer', 'mp'], ['Evening prayer', 'ep'], ['A prayer for peace', 'pp']].map(function (b) {
        return '<div class="card"><h3>' + b[0] + '</h3><div id="lb-' + b[1] + '">' + App.loading('…') + '</div></div>';
      }).join('') + '</div>' + App.rule('Listening history') + (L.length ? '<div class="card"><table class="t"><tbody>' + L.map(function (x) { return '<tr><td>' + h(x.t) + '</td><td class="small">' + new Date(x.at).toLocaleString() + '</td></tr>'; }).join('') + '</tbody></table></div>' : App.empty('Nothing played yet', 'Your listening history stays on this device.'));
    Bible.load().then(function () {
      if (App.el !== el) return; var ref = App.dailyPick(PR.DAILY.scripture);
      var items = { dsr: ['Daily scripture: ' + Bible.label(ref), Bible.text(ref), 'reader'], mp: ['Morning prayer', PR.LESSONS.filter(function (l) { return l.id === 'morning'; })[0].prayer, 'prayer'], ep: ['Evening prayer', PR.LESSONS.filter(function (l) { return l.id === 'evening'; })[0].prayer, 'prayer'], pp: ['A prayer for peace', PR.PRAYER_LIBRARY.filter(function (p) { return p.id === 'p-peace'; })[0].text, 'prayer'] };
      Object.keys(items).forEach(function (k) { var d = el.querySelector('#lb-' + k); if (d) d.innerHTML = App.listenBtn('Play', App.regAudio('lb' + k, items[k][0], items[k][1], items[k][2]), items[k][2], true); });
    }).catch(function () { ['dsr', 'mp', 'ep', 'pp'].forEach(function (k) { var d = el.querySelector('#lb-' + k); if (d) d.innerHTML = '<span class="small">Unavailable until the Bible text loads.</span>'; }); });
  });

  /* ================= DAILY PATH ================= */
  App.route('daily', function (el) {
    var s = Store.s, t = O.today(), ref = App.dailyPick(PR.DAILY.scripture), pr = PR.PRAYER_LIBRARY.filter(function (p) { return p.id === 'p-morning'; })[0], les = App.dailyPick(PR.LESSONS_DAILY), refl = App.dailyPick(PR.DAILY.reflection), bot = App.dailyPick(IG.ITEMS, 3), st = Store.streak();
    var intent = s.intention[t] || '', jr = s.journal[t] || {}, grat = s.gratitude.filter(function (g) { return g.date === t; });
    Store.touch();
    el.innerHTML = '<h1>The Daily Path</h1><p class="small">' + new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) + ' · No streak is ever taken away. Pick up wherever you are.</p>' +
      '<div class="grid g3"><div class="card"><div class="stat">' + st.current + '</div><div class="small">days in a row</div></div><div class="card"><div class="stat">' + st.last30 + '/30</div><div class="small">days visited in the last 30</div></div><div class="card"><div class="stat">' + st.best + '</div><div class="small">longest run</div></div></div>' +
      App.rule('Morning') + '<div class="grid g2"><article class="card"><div class="eyebrow">Morning scripture</div><div id="dpv">' + App.loading('…') + '</div></article>' +
      '<article class="card"><div class="eyebrow">Morning prayer</div><p>' + h(pr.text) + '</p>' + App.listenBtn('Listen', App.regAudio('dmp', 'Morning prayer', pr.text, 'prayer'), 'prayer', true) + '</article>' +
      '<article class="card"><div class="eyebrow">Daily intention</div><div class="row" style="margin-bottom:.5rem">' + PR.DAILY.intentions.map(function (i) { return '<button class="chip" aria-pressed="' + (intent === i) + '" data-act="intent" data-i="' + i + '">' + i + '</button>'; }).join('') + '</div><form class="row" data-submit="intentOwn" style="flex-wrap:nowrap"><label class="sr" for="io">Your own intention</label><input id="io" type="text" maxlength="60" placeholder="Or write your own" value="' + (PR.DAILY.intentions.indexOf(intent) < 0 ? h(intent) : '') + '"><button class="btn sm">Set</button></form>' + (intent ? '<p class="small" style="margin-top:.5rem">Today: <b>' + h(intent) + '</b></p>' : '') + '</article>' +
      '<article class="card"><div class="eyebrow">Botanical of the day</div><a href="#/archive/' + bot.id + '"><h3><span class="emo">' + bot.e + '</span> ' + h(bot.n) + '</h3></a><p class="small">' + h(bot.hist) + '</p></article>' +
      '<article class="card"><div class="eyebrow">Spiritual lesson of the day</div><h3>' + h(les.t) + '</h3><p>' + h(les.b) + '</p></article>' +
      '<article class="card"><div class="eyebrow">Personal routine</div><div id="rt"></div></article></div>' +
      App.rule('Evening') + '<div class="grid g2"><article class="card"><div class="eyebrow">Evening reflection</div><p class="verse-q" style="font-style:italic">' + h(refl) + '</p><form data-submit="saveJournal"><label for="jr">Your reflection (private, saved on this device)</label><textarea id="jr" placeholder="Write as much or as little as you like.">' + h(jr.text || '') + '</textarea><p><button class="btn pri sm">Save reflection</button></p></form></article>' +
      '<article class="card"><div class="eyebrow">Gratitude journal</div><form data-submit="addGrat" class="row" style="flex-wrap:nowrap"><label class="sr" for="gi">Something I am grateful for</label><input id="gi" type="text" maxlength="160" placeholder="Today I am grateful for…" required><button class="btn sm">Add</button></form><ul id="gl" style="padding-left:1.1rem">' + grat.map(function (g) { return '<li>' + h(g.text) + ' <button class="btn sm ico" data-act="delGrat" data-id="' + g.id + '" aria-label="Delete">' + ic('x', 12) + '</button></li>'; }).join('') + '</ul><a class="small" href="#/me/notes">See earlier entries</a></article></div>' +
      App.rule('Reminders') + '<div class="card" id="rem"></div>';
    renderRoutine(el); renderReminders(el);
    Bible.load().then(function () { var d = el.querySelector('#dpv'); if (d && App.el === el) d.innerHTML = '<p class="verse-q">' + h(Bible.text(ref)) + '</p><div class="row sp"><span class="attrib">' + h(Bible.label(ref)) + '</span>' + App.listenBtn('Listen', App.regAudio('dsc', 'Morning scripture: ' + Bible.label(ref), Bible.text(ref), 'reader'), 'reader', true) + '</div>'; }).catch(function (e) { var d = el.querySelector('#dpv'); if (d) d.innerHTML = '<p class="small">' + h(e.message) + '</p>'; });
  });
  function renderRoutine(el) {
    var s = Store.s, t = O.today(), log = s.routineLog[t] || {}, box = el.querySelector('#rt'); if (!box) return;
    box.innerHTML = (s.routines.length ? '<ul style="list-style:none;padding:0;margin:0 0 .6rem">' + s.routines.map(function (r) { return '<li class="row" style="margin:.25rem 0"><label style="display:flex;gap:.5rem;align-items:center;margin:0;text-transform:none;letter-spacing:0;font:inherit;color:inherit"><input type="checkbox" data-chg="rtog" data-id="' + r.id + '"' + (log[r.id] ? ' checked' : '') + '> ' + h(r.text) + '</label><button class="btn sm ico" data-act="delRt" data-id="' + r.id + '" aria-label="Remove ' + h(r.text) + '">' + ic('x', 12) + '</button></li>'; }).join('') + '</ul>' : '<p class="small">Add the small things you want to do each day, such as “Read one chapter” or “Call my mother”.</p>') + '<form class="row" data-submit="addRt" style="flex-wrap:nowrap"><label class="sr" for="rti">New routine</label><input id="rti" type="text" maxlength="80" placeholder="Add a routine" required><button class="btn sm">Add</button></form>';
  }
  App.acts.intent = function (b) { var s = Store.s, t = O.today(); s.intention[t] = s.intention[t] === b.dataset.i ? '' : b.dataset.i; Store.save(); App.render(); };
  App.acts.intentOwn = function (f) { var v = f.querySelector('input').value.trim(); Store.s.intention[O.today()] = v; Store.save(); App.render(); };
  App.acts.saveJournal = function (f) { var s = Store.s; s.journal[O.today()] = { text: f.querySelector('textarea').value, at: Date.now() }; Store.save(); App.toast('Reflection saved'); };
  App.acts.addGrat = function (f) { var i = f.querySelector('input'), v = i.value.trim(); if (!v) return; Store.s.gratitude.unshift({ id: O.uid(), date: O.today(), text: v, at: Date.now() }); Store.save(); App.render(); };
  App.acts.delGrat = function (b) { var s = Store.s; s.gratitude = s.gratitude.filter(function (g) { return g.id !== b.dataset.id; }); Store.save(); App.render(); };
  App.acts.addRt = function (f) { var v = f.querySelector('input').value.trim(); if (!v) return; Store.s.routines.push({ id: O.uid(), text: v }); Store.save(); renderRoutine(App.el); };
  App.acts.delRt = function (b) { var s = Store.s; s.routines = s.routines.filter(function (r) { return r.id !== b.dataset.id; }); Store.save(); renderRoutine(App.el); };
  App.acts.rtog = function (c) { var s = Store.s, t = O.today(); s.routineLog[t] = s.routineLog[t] || {}; s.routineLog[t][c.dataset.id] = c.checked ? 1 : 0; Store.save(); };
  function renderReminders(el) {
    var r = Store.s.prefs.remind, box = el.querySelector('#rem'); if (!box) return; var sup = 'Notification' in window;
    box.innerHTML = '<p class="small">Optional gentle reminders. They appear while the app is open or installed and running. True background reminders on a closed phone need a push server, which this build does not include.</p>' + (sup ? '<div class="row"><label style="display:flex;gap:.5rem;align-items:center;margin:0;text-transform:none;letter-spacing:0;font:inherit;color:inherit"><input type="checkbox" data-chg="remtog"' + (r.on ? ' checked' : '') + '> Remind me</label><label class="sr" for="rm1">Morning time</label><input id="rm1" type="time" value="' + r.morning + '" data-chg="remtime" data-k="morning" style="width:auto"><label class="sr" for="rm2">Evening time</label><input id="rm2" type="time" value="' + r.evening + '" data-chg="remtime" data-k="evening" style="width:auto"></div>' + (r.on && Notification.permission === 'denied' ? '<p class="small" style="color:var(--danger)">Notifications are blocked in your browser settings.</p>' : '') : '<p class="small">This browser does not support notifications.</p>');
  }
  App.acts.remtog = function (c) { var r = Store.s.prefs.remind; if (c.checked && 'Notification' in window && Notification.permission !== 'granted') { Notification.requestPermission().then(function (p) { r.on = p === 'granted'; Store.save('prefs'); renderReminders(App.el); if (!r.on) App.toast('Notifications were not allowed'); }); return; } r.on = c.checked; Store.save('prefs'); };
  App.acts.remtime = function (i) { Store.s.prefs.remind[i.dataset.k] = i.value; Store.save('prefs'); };
  var fired = {};
  setInterval(function () { var r = Store.s.prefs.remind; if (!r.on || !('Notification' in window) || Notification.permission !== 'granted') return; var d = new Date(), hm = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2), t = O.today(); ['morning', 'evening'].forEach(function (k) { if (r[k] === hm && !fired[t + k]) { fired[t + k] = 1; try { new Notification('Doctor Orison', { body: k === 'morning' ? 'A quiet moment for today’s scripture and prayer.' : 'A quiet moment to reflect on your day.', icon: 'icon-192.png' }); } catch (e) { } } }); }, 30000);

  /* ================= MY ARCHIVE ================= */
  App.route('me', function (el, a) {
    var tab = a[0] || 'progress', s = Store.s;
    var tabs = [['progress', 'Progress'], ['saved', 'Saved'], ['notes', 'Notes & journal'], ['history', 'History'], ['settings', 'Settings & privacy']];
    el.innerHTML = '<h1>My Archive</h1><div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button role="tab" aria-selected="' + (t[0] === tab) + '" data-act="metab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="mb"></div>';
    var box = el.querySelector('#mb');
    if (tab === 'settings') return meSettings(box);
    Bible.load().then(function () { if (App.el !== el) return; ({ progress: meProgress, saved: meSaved, notes: meNotes, history: meHistory }[tab] || meProgress)(box); }).catch(function (e) { box.innerHTML = App.error(e.message, true); });
  });
  App.acts.metab = function (b) { App.go('me/' + b.dataset.t); };
  function meProgress(box) {
    var s = Store.s, st = Store.streak(), ch = Object.keys(s.completed).length, ot = 0, nt = 0;
    Object.keys(s.completed).forEach(function (k) { var b = Bible.byId[k.split('.')[0]]; if (b) b.t === 'OT' ? ot++ : nt++; });
    var otT = 0, ntT = 0; Bible.books.forEach(function (b) { b.t === 'OT' ? otT += b.c.length : ntT += b.c.length; });
    box.innerHTML = '<div class="grid g3"><div class="card"><div class="ring" style="--p:' + Math.round(ch / 1189 * 100) + '"><i>' + Math.round(ch / 1189 * 100) + '%</i></div><p class="small">' + ch + ' of 1,189 chapters</p></div><div class="card"><div class="stat">' + ot + '<span class="small"> / ' + otT + '</span></div><div class="small">Old Testament chapters</div></div><div class="card"><div class="stat">' + nt + '<span class="small"> / ' + ntT + '</span></div><div class="small">New Testament chapters</div></div><div class="card"><div class="stat">' + st.current + '</div><div class="small">current run · best ' + st.best + '</div></div><div class="card"><div class="stat">' + Object.keys(s.lessonsDone).length + '<span class="small"> / ' + PR.LESSONS.length + '</span></div><div class="small">prayer lessons completed</div></div><div class="card"><div class="stat">' + st.total + '</div><div class="small">days you have visited in all</div></div></div>' +
      App.rule('Profile') + '<form class="card" data-submit="saveName"><label for="nm">Your name (optional, stays on this device unless you sign in and sync)</label><input id="nm" type="text" value="' + h(s.prefs.name) + '" maxlength="40"><p><button class="btn sm pri">Save</button></p></form>';
  }
  App.acts.saveName = function (f) { Store.s.prefs.name = f.querySelector('input').value.trim(); Store.save('prefs'); App.toast('Saved'); };
  function meSaved(box) {
    var s = Store.s, hl = Object.keys(s.highlights);
    box.innerHTML = App.rule('Bookmarked verses') + (s.bookmarks.length ? '<div class="grid g2">' + s.bookmarks.map(function (r) { var p = Bible.split(r); return '<div class="card"><div class="attrib"><a href="#/bible/' + p.book + '/' + p.ch + '?v=' + p.v1 + '">' + h(Bible.label(r)) + '</a></div><p>' + h(Bible.text(r)) + '</p><button class="btn sm" data-act="unbm" data-r="' + r + '">Remove</button></div>'; }).join('') + '</div>' : App.empty('No bookmarks yet', 'Open any chapter in the Bible Vault, tap a verse and choose Bookmark.')) +
      App.rule('Highlights') + (hl.length ? '<div class="grid g2">' + hl.slice(0, 60).map(function (r) { var p = Bible.split(r); return '<div class="card"><div class="attrib"><a href="#/bible/' + p.book + '/' + p.ch + '?v=' + p.v1 + '">' + h(Bible.label(r)) + '</a></div><p><span style="background:var(--hl' + s.highlights[r] + ')">' + h(Bible.text(r)) + '</span></p></div>'; }).join('') + '</div>' : '<p class="small">No highlights yet.</p>') +
      App.rule('Saved ingredients') + (s.savedIng.length ? '<div class="grid g2">' + s.savedIng.map(function (id) { var i = IG.ITEMS.filter(function (x) { return x.id === id; })[0]; return i ? App.ingCard(i) : ''; }).join('') + '</div>' : '<p class="small">Open an ingredient profile and choose Save.</p>') +
      App.rule('Saved prayers') + (s.savedPrayers.length ? '<div class="grid g2">' + s.savedPrayers.map(function (id) { var p = PR.PRAYER_LIBRARY.filter(function (x) { return x.id === id; })[0]; return p ? '<div class="card"><h3>' + h(p.t) + '</h3><p>' + h(p.text) + '</p>' + App.listenBtn('Listen', App.regAudio('sp' + p.id, p.t, p.text, 'prayer'), 'prayer', true) + '</div>' : ''; }).join('') + '</div>' : '<p class="small">Save prayers from the Prayer Chamber library.</p>') +
      App.rule('Completed lessons') + (Object.keys(s.lessonsDone).length ? '<div class="row">' + Object.keys(s.lessonsDone).map(function (id) { var l = PR.LESSONS.filter(function (x) { return x.id === id; })[0]; return l ? '<a class="chip" href="#/prayer/lesson/' + id + '">' + h(l.t) + '</a>' : ''; }).join('') + '</div>' : '<p class="small">None yet.</p>');
  }
  App.acts.unbm = function (b) { var s = Store.s; s.bookmarks = s.bookmarks.filter(function (r) { return r !== b.dataset.r; }); Store.save(); App.render(); };
  function meNotes(box) {
    var s = Store.s, nk = Object.keys(s.notes), jk = Object.keys(s.journal).sort().reverse(), gr = s.gratitude.slice(0, 40);
    box.innerHTML = App.rule('Verse notes') + (nk.length ? '<div class="grid g2">' + nk.map(function (r) { var p = Bible.split(r); return '<div class="card"><div class="attrib"><a href="#/bible/' + p.book + '/' + p.ch + '?v=' + p.v1 + '">' + h(Bible.label(r)) + '</a></div><p style="white-space:pre-wrap">' + h(s.notes[r]) + '</p><button class="btn sm danger" data-act="delnote" data-r="' + r + '">Delete</button></div>'; }).join('') + '</div>' : App.empty('No notes yet', 'Tap a verse in the reader and choose Note.')) +
      App.rule('Evening reflections') + (jk.length ? jk.map(function (d) { return '<div class="card" style="margin-bottom:.6rem"><div class="attrib">' + d + '</div><p style="white-space:pre-wrap">' + h(s.journal[d].text) + '</p></div>'; }).join('') : '<p class="small">No reflections yet.</p>') +
      App.rule('Gratitude journal') + (gr.length ? '<div class="card"><ul>' + gr.map(function (g) { return '<li><span class="small">' + g.date + '</span> ' + h(g.text) + '</li>'; }).join('') + '</ul></div>' : '<p class="small">No entries yet.</p>');
  }
  App.acts.delnote = function (b) { delete Store.s.notes[b.dataset.r]; Store.save(); App.render(); };
  function meHistory(box) {
    var s = Store.s; box.innerHTML = App.rule('Reading history') + (s.history.length ? '<div class="card"><table class="t"><tbody>' + s.history.slice(0, 50).map(function (x) { var p = Bible.split(x.ref); return '<tr><td><a href="#/bible/' + p.book + '/' + p.ch + '">' + h(Bible.label(x.ref)) + '</a></td><td class="small">' + new Date(x.at).toLocaleString() + '</td><td class="small">' + (s.completed[x.ref] ? 'completed' : '') + '</td></tr>'; }).join('') + '</tbody></table></div>' : App.empty('No reading history yet')) +
      App.rule('Listening history') + (s.listening.length ? '<div class="card"><table class="t"><tbody>' + s.listening.slice(0, 30).map(function (x) { return '<tr><td>' + h(x.t) + '</td><td class="small">' + new Date(x.at).toLocaleString() + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="small">Nothing played yet.</p>');
  }
  function meSettings(box) {
    var p = Store.s.prefs, v = Voice.english(), P = O.PERSONAS;
    var opt = function (cur) { return '<option value="">Automatic (best available)</option>' + v.map(function (x) { return '<option value="' + h(x.voiceURI) + '"' + (cur === x.voiceURI ? ' selected' : '') + '>' + h(x.name) + ' (' + h(x.lang) + ')</option>'; }).join(''); };
    var chk = function (k, label) { return '<label style="display:flex;gap:.5rem;align-items:center;text-transform:none;letter-spacing:0;font:inherit;color:inherit"><input type="checkbox" data-chg="pref" data-k="' + k + '"' + (p[k] ? ' checked' : '') + '> ' + label + '</label>'; };
    box.innerHTML = '<div class="grid g2"><div class="card"><h3>Reading and accessibility</h3><label for="th">Reading mode</label><select id="th" data-chg="pref" data-k="theme"><option value="dark"' + (p.theme === 'dark' ? ' selected' : '') + '>Dark (obsidian)</option><option value="parch"' + (p.theme === 'parch' ? ' selected' : '') + '>Parchment</option></select><label for="sz">Text size</label><input id="sz" type="range" min="0" max="4" value="' + p.size + '" data-chg="pref" data-k="size" style="padding:0"><p>' + chk('hc', 'High contrast') + chk('dys', 'Wider letter and line spacing (easier reading)') + chk('nomo', 'Turn off animation') + chk('vpl', 'Show one verse per line') + '</p><p class="small">The app also follows your device’s “reduce motion” setting. It works with screen readers and the keyboard.</p></div>' +
      '<div class="card"><h3>Language and voice</h3><label for="lg">Language</label><select id="lg" disabled><option>English (World English Bible)</option></select><p class="small">Additional language packs and other licensed translations can be added by the administrator (see README). None are installed.</p><label for="ac">Accent preference</label><select id="ac" data-chg="pref" data-k="accent">' + [['auto', 'Automatic'], ['african', 'African English (South Africa, Nigeria, Kenya…)'], ['gb', 'British'], ['us', 'American'], ['au', 'Australian']].map(function (o) { return '<option value="' + o[0] + '"' + (p.accent === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' +
      ['guide', 'reader', 'prayer'].map(function (k) { return '<label for="vo-' + k + '">' + P[k].name + '</label><select id="vo-' + k + '" data-chg="pvoice" data-k="' + k + '">' + opt(p.voices[k]) + '</select>'; }).join('') + '<p class="small">' + (v.length ? v.length + ' English voices found on this device.' : 'No voices found yet.') + ' If no African English voice is listed, your device does not have one installed; the app uses the closest available.</p><p>' + App.listenBtn('Test voice', App.regAudio('vt', 'Voice test', 'Peace be with you. This is how I will read to you.', 'reader'), 'reader', true) + '</p></div>' +
      '<div class="card"><h3>Privacy and your data</h3><p class="small">Your notes, bookmarks, progress and journal are stored in this browser. ' + (Cloud.configured ? (Cloud.user ? 'You are signed in, so they are also saved to your account.' : 'If you sign in, they can sync to your account.') : 'No account service is configured on this installation, so nothing leaves this device.') + '</p>' + (Cloud.configured ? chk('sync', 'Sync my data to my account when signed in') : '') + '<div class="row"><button class="btn sm" data-act="export">Download my data (JSON)</button><button class="btn sm danger" data-act="wipe">Delete all data on this device</button></div><p class="small">Voice recordings are stored only in this browser. Deleting data also removes them.</p></div>' +
      '<div class="card"><h3>Install</h3><p class="small">Install Doctor Orison as an app on your phone or computer.</p><button class="btn sm" data-act="install">Install app</button></div></div>';
  }
  App.acts.pref = function (el) { var p = Store.s.prefs, k = el.dataset.k; p[k] = el.type === 'checkbox' ? el.checked : (k === 'size' ? +el.value : el.value); Store.save('prefs'); App.applyPrefs(); if (k === 'accent') { } };
  App.acts.pvoice = function (el) { Store.s.prefs.voices[el.dataset.k] = el.value; Store.save('prefs'); };
  App.acts.export = function () { App.download('doctor-orison-data-' + O.today() + '.json', Store.exportJSON()); };
  App.acts.wipe = function () { App.modal('<h2>Delete all data on this device?</h2><p>This removes your notes, bookmarks, highlights, progress, journal and settings from this browser, and your saved voice recordings. It cannot be undone. Download your data first if you may want it.</p><div class="row"><button class="btn danger" data-act="wipeGo">Delete everything</button><button class="btn" data-act="closeModal">Cancel</button></div>', { label: 'Confirm delete' }); };
  App.acts.wipeGo = function () { Store.wipe(); if (App.idb) { try { indexedDB.deleteDatabase('orison-media'); } catch (e) { } } App.closeModal(); App.applyPrefs(); App.toast('All local data deleted'); App.go(''); };
  var deferred = null; window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  App.acts.install = function () { if (deferred) { deferred.prompt(); deferred = null; } else App.modal('<h2>Install</h2><p>If your browser does not show an install prompt: on iPhone or iPad use Share → Add to Home Screen. On Android Chrome use the menu → Install app. On desktop Chrome or Edge use the install icon in the address bar.</p>'); };

  /* ================= ACCOUNT ================= */
  App.route('account', function (el) {
    var draw = function () {
      if (App.el !== el) return;
      if (!Cloud.configured) { el.innerHTML = '<h1>Account</h1><div class="notice"><b class="t">Local mode</b>This installation has no account service configured, so Doctor Orison runs fully on this device: nothing is uploaded. To enable sign-in, sync and the editors’ area, the administrator adds Supabase keys to <b>config.js</b> (see README).</div><div class="row"><a class="btn" href="#/me/settings">Privacy and data export</a></div>'; return; }
      if (!Cloud.client) { el.innerHTML = '<h1>Account</h1>' + App.loading('Connecting to the account service…') + (Cloud.msg ? '<p class="small">' + h(Cloud.msg) + '</p>' : ''); return; }
      if (Cloud.user) { el.innerHTML = '<h1>Account</h1><div class="card"><p>Signed in as <b>' + h(Cloud.user.email) + '</b>' + (Cloud.role !== 'user' ? ' · role: ' + h(Cloud.role) : '') + '</p><p class="small">' + h(Cloud.msg || '') + '</p><div class="row"><button class="btn" data-act="syncNow">Sync now</button><button class="btn" data-act="signout">Sign out</button><a class="btn" href="#/me/settings">Data export</a></div></div>' + App.rule('Delete my account') + '<div class="card"><p class="small">This permanently deletes your account and the copy stored in the cloud. Data on this device is kept unless you also delete it in settings.</p><button class="btn danger" data-act="delAcct">Delete my account</button></div>'; return; }
      el.innerHTML = '<h1>Account</h1><p class="small">An account is optional. It lets you keep your notes, bookmarks and progress across devices.</p><div class="grid g2"><form class="card" data-submit="signin"><h3>Sign in</h3><label for="e1">Email</label><input id="e1" type="email" required autocomplete="email"><label for="p1">Password</label><input id="p1" type="password" required autocomplete="current-password"><p><button class="btn pri">Sign in</button> <button type="button" class="btn sm" data-act="resetpw">Forgot password</button></p></form><form class="card" data-submit="signup"><h3>Create account</h3><label for="e2">Email</label><input id="e2" type="email" required autocomplete="email"><label for="p2">Password (8+ characters)</label><input id="p2" type="password" minlength="8" required autocomplete="new-password"><p><button class="btn pri">Create account</button></p></form></div><div id="am"></div>';
    };
    draw(); Cloud.onchange = [function () { if (App.cur === 'account') draw(); }];
  });
  App.acts.signin = function (f) { var m = document.getElementById('am'); Cloud.signIn(f.querySelector('#e1').value, f.querySelector('#p1').value).then(function (r) { if (r.error) m.innerHTML = App.error(r.error.message); else App.toast('Signed in'); }); };
  App.acts.signup = function (f) { var m = document.getElementById('am'); Cloud.signUp(f.querySelector('#e2').value, f.querySelector('#p2').value).then(function (r) { if (r.error) m.innerHTML = App.error(r.error.message); else m.innerHTML = '<div class="notice"><b class="t">Check your email</b>If email confirmation is enabled, open the link we sent to finish creating your account.</div>'; }); };
  App.acts.resetpw = function () { var e = document.getElementById('e1').value; if (!e) { App.toast('Enter your email first'); return; } Cloud.reset(e).then(function (r) { App.toast(r.error ? r.error.message : 'Reset link sent if the email exists'); }); };
  App.acts.signout = function () { Cloud.signOut().then(function () { App.toast('Signed out'); }); };
  App.acts.syncNow = function () { Cloud.pull().then(function () { App.toast(Cloud.msg); }); };
  App.acts.delAcct = function () { App.modal('<h2>Delete your account?</h2><p>This cannot be undone.</p><div class="row"><button class="btn danger" data-act="delAcctGo">Delete permanently</button><button class="btn" data-act="closeModal">Cancel</button></div>'); };
  App.acts.delAcctGo = function () { Cloud.deleteAccount().then(function () { App.closeModal(); App.toast('Account deleted'); }).catch(function (e) { App.closeModal(); App.toast('Could not delete: ' + e.message); }); };

  /* ================= ABOUT ================= */
  App.route('about', function (el) {
    el.innerHTML = '<h1>About, sources and safety</h1><p>Doctor Orison is an independent educational and spiritual knowledge archive. It is not affiliated with any other company or brand. <em>Understand the Word. Honour the roots. Cultivate the mind. Build the future.</em></p>' +
      '<div class="notice warn"><b class="t">Safety notice</b>Nothing here is medical advice. Never eat, drink or apply an unidentified plant. Do not burn materials in closed rooms. Check with a pharmacist or doctor before using any plant if you are pregnant, take medicine, or have a condition. Nothing in this app claims that a prayer, ingredient or ritual guarantees money, luck, protection or the removal of a curse, and no one should charge you for that.</div>' +
      App.rule('How content is labelled') + '<div class="grid g2"><div class="card"><div class="eyebrow">Scripture</div><p class="small">Quoted live from the World English Bible, a public-domain translation (ebible.org/web). Shown in a gold-ruled block.</p></div><div class="card"><div class="eyebrow">Commentary</div><p class="small">Interpretation written for this app. Shown in a dashed block and always marked as not scripture. Other readings exist.</p></div><div class="card"><div class="eyebrow">Cultural belief</div><p class="small">What a culture believes, marked “Belief”, never presented as fact or as a promise.</p></div><div class="card"><div class="eyebrow">Documented history and science</div><p class="small">Marked “Documented” or “Modern science” with caveats. Ingredient records are author drafts awaiting botanist and cultural review.</p></div></div>' +
      App.rule('What this build includes') + '<div class="card"><p><b>Open now:</b> Bible Vault (department I), Prayer Chamber (II), Botanical Archive (IV, ' + IG.ITEMS.length + ' ingredients), Daily Path (X), global search, listening room, personal archive, optional accounts and an editors’ area.</p><p><b>Opening in later phases:</b> Phase 2 — Ancestral Archive (III), Ritual and Cleansing Chamber (V), Fortune Archive (VI), Wealth Doctrine (VII), Protection and Peace Library (VIII). Phase 3 — Trials of Life (IX) with the Situation-to-Guidance engine, plant identification from photos, advanced audio and personal journeys. These are not in the navigation because they are not built yet.</p></div>' +
      App.rule('Photographs and illustrations') + '<div class="card"><p>Each ingredient shows an original engraved <b>schematic plate</b> that illustrates the type of plant part (leaf sprig, flower, root, bark, seed, pod, fruit, resin, grain, tree). It is not a species-accurate botanical plate. A real photograph appears only when an editor attaches a verified, licensed image through the editors’ area. Until then the slot says so plainly. Wild plants must never be identified from a picture alone.</p></div>' +
      App.rule('Voice') + '<div class="card"><p>Audio uses the speech voices built into your device or browser and is always labelled synthetic. Biblical names get a best-effort pronunciation respelling. Three voice personalities (The Guide, The Scripture Reader, The Prayer Companion) differ in pace, pitch and pauses, and you can choose a different installed voice for each. The architecture accepts recorded human narration: set a chapter audio URL template in config.js and the player streams recordings with seek and speed control instead of speech.</p></div>' +
      App.rule('Licences') + '<div class="card"><p>World English Bible: public domain. Other translations are not included and may only be added with the required permission. All prayers, lessons and commentary are original to this app. Ingredient safety statements follow the references listed in each profile (Kew Plants of the World Online, NIH NCCIH and LiverTox, European Medicines Agency herbal monographs, SANBI, WHO).</p></div>' +
      '<p class="small">Free: Bible reading, prayers, safety information and introductory lessons. Nothing in this app is sold as a way to remove a curse, guarantee luck or receive protection.</p>';
  });

  /* ================= boot ================= */
  App.boot = function () {
    App.applyPrefs(); buildShell(); Voice.init();
    Cloud.onchange.push(function () { buildShell(); });
    Cloud.init().then(function () { if (Cloud.configured) buildShell(); });
    window.addEventListener('hashchange', App.render);
    if (Cloud.configured) Cloud.records('published').then(function (r) { if (r && r.data) App.cms = r.data; }).catch(function () { });
    if (!Store.ok) App.toast('Browser storage is blocked: your progress will not be saved');
    App.render();
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(function () { });
  };
})();
