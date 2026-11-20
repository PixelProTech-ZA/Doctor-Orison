/* Doctor Orison — core services: storage, Bible data, voice engine, cloud sync.
   Local-first: everything works with no account. Cloud sync only runs when config.js has Supabase keys and the user signs in. */
(function () {
  'use strict';
  var CFG = window.ORISON_CONFIG || {};
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function today(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayIndex(d) { d = d || new Date(); return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 864e5); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* ================= Store ================= */
  var KEY = 'orison.v1';
  function defaults() {
    return {
      v: 1, updated: 0,
      prefs: { theme: 'dark', size: 2, hc: false, dys: false, nomo: false, persona: 'reader', rate: 1, voices: { guide: '', reader: '', prayer: '' }, accent: 'auto', name: '', remind: { on: false, morning: '07:00', evening: '20:00' }, sync: true, vpl: false, updated: 0 },
      bookmarks: [], highlights: {}, notes: {}, history: [], completed: {}, plans: {}, savedIng: [], savedPrayers: [], myPrayers: [],
      journal: {}, gratitude: [], routines: [], routineLog: {}, lessonsDone: {}, listening: [], activity: {}, intention: {}, lastRead: null
    };
  }
  var state = defaults(), listeners = [], saveTimer = 0, lsOK = true;
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw), d = defaults(); for (var k in d) if (o[k] === undefined) o[k] = d[k]; for (var p in d.prefs) if (o.prefs[p] === undefined) o.prefs[p] = d.prefs[p]; state = o; } } catch (e) { lsOK = false; }
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { lsOK = false; } }
  var Store = {
    get s() { return state; }, get ok() { return lsOK; },
    on: function (fn) { listeners.push(fn); },
    save: function (what) {
      state.updated = Date.now(); if (what === 'prefs') state.prefs.updated = state.updated;
      persist(); listeners.forEach(function (f) { try { f(what); } catch (e) { } });
      clearTimeout(saveTimer); saveTimer = setTimeout(function () { Cloud.push(); }, 2500);
    },
    touch: function () { var t = today(); if (!state.activity[t]) { state.activity[t] = 1; Store.save(); } },
    replace: function (o) { state = o; persist(); },
    wipe: function () { try { localStorage.removeItem(KEY); } catch (e) { } state = defaults(); },
    exportJSON: function () { return JSON.stringify({ app: 'Doctor Orison', exported: new Date().toISOString(), data: state }, null, 2); },
    streak: function () {
      var a = state.activity, d = new Date(), n = 0; if (!a[today(d)]) d.setDate(d.getDate() - 1);
      while (a[today(d)]) { n++; d.setDate(d.getDate() - 1); }
      var days = Object.keys(a).sort(), best = 0, run = 0, prev = null;
      days.forEach(function (k) { var t = new Date(k + 'T00:00:00'); if (prev && Math.round((t - prev) / 864e5) === 1) run++; else run = 1; best = Math.max(best, run); prev = t; });
      var last30 = 0, c = new Date(); for (var i = 0; i < 30; i++) { if (a[today(c)]) last30++; c.setDate(c.getDate() - 1); }
      return { current: n, best: best, last30: last30, total: days.length };
    }
  };
  load();

  /* ================= Bible ================= */
  var Bible = {
    data: null, books: [], byId: {}, idx: null, loading: null,
    load: function () {
      if (Bible.data) return Promise.resolve(Bible.data);
      if (Bible.loading) return Bible.loading;
      if (location.protocol === 'file:') return Promise.reject(new Error('The Bible text is loaded from a file, so the app must be served over http(s) (for example GitHub Pages or a local server), not opened as a plain file.'));
      Bible.loading = fetch('bible-web.json').then(function (r) { if (!r.ok) throw new Error('Could not load bible-web.json (HTTP ' + r.status + ').'); return r.json(); }).then(function (j) {
        Bible.data = j; Bible.books = j.books; j.books.forEach(function (b, i) { b.i = i; Bible.byId[b.id] = b; });
        return j;
      }).catch(function (e) { Bible.loading = null; throw e; });
      return Bible.loading;
    },
    buildIndex: function () {
      if (Bible.idx) return Bible.idx; var out = [];
      Bible.books.forEach(function (b) { b.c.forEach(function (ch, ci) { ch.forEach(function (t, vi) { out.push({ b: b.id, c: ci + 1, v: vi + 1, t: t, l: t.toLowerCase() }); }); }); });
      Bible.idx = out; return out;
    },
    /* parse 'john 3:16', 'jn 3', '1 cor 13:4-7', 'psalm 23' -> ref 'john.3.16' */
    parse: function (q) {
      q = q.trim().toLowerCase().replace(/\./g, ' ').replace(/\s+/g, ' ');
      var m = q.match(/^((?:[123]\s?)?[a-z]+(?:\s+(?:of|the)\s+[a-z]+)?)\s+(\d+)(?:\s*[:.]\s*(\d+)(?:\s*-\s*(\d+))?)?$/);
      if (!m) return null; var book = Bible.findBook(m[1]); if (!book) return null;
      var ch = +m[2]; if (ch < 1 || ch > book.c.length) return null;
      var ref = book.id + '.' + ch; if (m[3]) { ref += '.' + m[3]; if (m[4]) ref += '-' + m[4]; } return ref;
    },
    findBook: function (name) {
      name = name.replace(/\s+/g, ' ').trim(); var n = name.replace(/\s/g, '');
      if (n === 'psalm' || n === 'ps' || n === 'psa') n = 'psalms'; if (n === 'songofsongs' || n === 'song' || n === 'sos') n = 'songofsolomon';
      var alias = { gen: 'genesis', ex: 'exodus', exod: 'exodus', lev: 'leviticus', num: 'numbers', deut: 'deuteronomy', dt: 'deuteronomy', josh: 'joshua', judg: 'judges', '1sam': '1samuel', '2sam': '2samuel', '1kgs': '1kings', '2kgs': '2kings', '1chr': '1chronicles', '2chr': '2chronicles', neh: 'nehemiah', est: 'esther', prov: 'proverbs', pr: 'proverbs', eccl: 'ecclesiastes', ecc: 'ecclesiastes', isa: 'isaiah', jer: 'jeremiah', lam: 'lamentations', ezek: 'ezekiel', dan: 'daniel', hos: 'hosea', obad: 'obadiah', mic: 'micah', nah: 'nahum', hab: 'habakkuk', zeph: 'zephaniah', hag: 'haggai', zech: 'zechariah', mal: 'malachi', matt: 'matthew', mt: 'matthew', mk: 'mark', lk: 'luke', jn: 'john', rom: 'romans', '1cor': '1corinthians', '2cor': '2corinthians', gal: 'galatians', eph: 'ephesians', phil: 'philippians', col: 'colossians', '1thess': '1thessalonians', '2thess': '2thessalonians', '1tim': '1timothy', '2tim': '2timothy', tit: 'titus', phm: 'philemon', heb: 'hebrews', jas: 'james', '1pet': '1peter', '2pet': '2peter', '1jn': '1john', '2jn': '2john', '3jn': '3john', rev: 'revelation' };
      if (alias[n]) n = alias[n]; if (Bible.byId[n]) return Bible.byId[n];
      var hit = null; Bible.books.forEach(function (b) { if (!hit && (b.name.toLowerCase().replace(/\s/g, '') === n || (n.length >= 3 && b.id.indexOf(n) === 0))) hit = b; }); return hit;
    },
    split: function (ref) { var m = ref.match(/^([a-z0-9]+)\.(\d+)(?:\.(\d+)(?:-(\d+))?)?$/); if (!m) return null; return { book: m[1], ch: +m[2], v1: m[3] ? +m[3] : null, v2: m[4] ? +m[4] : (m[3] ? +m[3] : null) }; },
    label: function (ref) { var p = Bible.split(ref); if (!p) return ref; var b = Bible.byId[p.book]; var n = b ? b.name : p.book; var s = n + ' ' + p.ch; if (p.v1) { s += ':' + p.v1; if (p.v2 && p.v2 !== p.v1) s += '–' + p.v2; } return s; },
    verses: function (ref) {
      var p = Bible.split(ref); if (!p || !Bible.byId[p.book]) return []; var ch = Bible.byId[p.book].c[p.ch - 1]; if (!ch) return [];
      var a = p.v1 || 1, z = p.v1 ? p.v2 : ch.length, out = []; for (var i = a; i <= z && i <= ch.length; i++) out.push({ n: i, t: ch[i - 1], ref: p.book + '.' + p.ch + '.' + i }); return out;
    },
    text: function (ref) { return Bible.verses(ref).map(function (v) { return v.t; }).join(' '); },
    attribution: function (ref) { return Bible.label(ref) + ', World English Bible (public domain)'; },
    totalChapters: 1189
  };

  /* ================= Voice engine ================= */
  var PERSONAS = {
    guide: { name: 'The Guide', desc: 'Warm, mature, composed narration for lessons and guidance.', rate: .95, pitch: .95, pause: 350 },
    reader: { name: 'The Scripture Reader', desc: 'Measured, respectful reading of Scripture with pauses between verses.', rate: .9, pitch: .92, pause: 520 },
    prayer: { name: 'The Prayer Companion', desc: 'Gentle, slower delivery for prayers and reflection.', rate: .85, pitch: 1, pause: 800 }
  };
  /* Best-effort respellings so synthetic voices say Bible names sensibly. Display text is never changed. */
  var PRON = [[/\bYahweh\b/g, 'Yah-way'], [/\bMelchizedek\b/g, 'Mel-kiz-eh-dek'], [/\bNebuchadnezzar\b/g, 'Neb-uh-kud-nez-er'], [/\bHabakkuk\b/g, 'Hab-ak-kuk'], [/\bZephaniah\b/g, 'Zeff-uh-nye-uh'], [/\bZechariah\b/g, 'Zek-uh-rye-uh'], [/\bHaggai\b/g, 'Hag-eye'], [/\bObadiah\b/g, 'Oh-buh-dye-uh'], [/\bMalachi\b/g, 'Mal-uh-kye'], [/\bIsaiah\b/g, 'Eye-zay-uh'], [/\bJeremiah\b/g, 'Jair-uh-my-uh'], [/\bEzekiel\b/g, 'Ee-zee-kee-el'], [/\bNehemiah\b/g, 'Nee-uh-my-uh'], [/\bBathsheba\b/g, 'Bath-shee-buh'], [/\bBeelzebul\b/g, 'Bee-el-zeh-bul'], [/\bCapernaum\b/g, 'Kuh-per-nay-um'], [/\bGethsemane\b/g, 'Geth-sem-uh-nee'], [/\bGolgotha\b/g, 'Gol-guh-thuh'], [/\bPhilippians\b/g, 'Fih-lip-ee-unz'], [/\bColossians\b/g, 'Kuh-losh-unz'], [/\bThessalonians\b/g, 'Thess-uh-lone-ee-unz'], [/\bPhilemon\b/g, 'Fih-lee-mon'], [/\bTimothy\b/g, 'Tim-oh-thee'], [/\bEphesians\b/g, 'Ee-fee-zhunz'], [/\bGalatians\b/g, 'Guh-lay-shunz'], [/\bHebrews\b/g, 'Hee-brooz'], [/\bLeviticus\b/g, 'Leh-vit-ih-kus'], [/\bDeuteronomy\b/g, 'Doo-ter-ON-uh-mee'], [/\bEcclesiastes\b/g, 'Ih-klee-zee-AS-teez'], [/\bAbimelech\b/g, 'Ah-bim-eh-lek'], [/\bJehoshaphat\b/g, 'Jeh-hosh-uh-fat'], [/\bMephibosheth\b/g, 'Meh-fib-oh-sheth'], [/\bNazareth\b/g, 'Naz-uh-reth'], [/\bSamaritan\b/g, 'Suh-mair-ih-tun'], [/\bHallelujah\b/g, 'Hal-eh-loo-yah'], [/\bSelah\b/g, 'See-luh'], [/\bPsalms?\b/g, function (m) { return m === 'Psalms' ? 'Sahms' : 'Sahm'; }], [/\bAmen\b/g, 'Ah-men'], [/‘|’/g, "'"], [/“|”/g, '"'], [/—/g, ', ']];
  function pron(t) { PRON.forEach(function (p) { t = t.replace(p[0], p[1]); }); return t; }
  function chunk(text, max) {
    max = max || 230; var out = [], parts = text.replace(/\s+/g, ' ').match(/[^.!?;:]+[.!?;:]*["'”’]*\s*/g) || [text], cur = '';
    parts.forEach(function (p) { if ((cur + p).length > max && cur) { out.push(cur.trim()); cur = p; } else cur += p; }); if (cur.trim()) out.push(cur.trim()); return out;
  }
  var AFR = /^en[-_](ZA|NG|KE|GH|TZ|UG|ZW|ZM|BW|NA)/i;
  var Voice = {
    ok: 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    voices: [], q: [], i: 0, state: 'idle', title: '', persona: 'reader', mode: 'tts', audio: null, onseg: null, onstate: [], timer: 0, token: 0, err: '',
    init: function () {
      if (!Voice.ok) return; var go = function () { Voice.voices = speechSynthesis.getVoices() || []; Voice.emit(); };
      go(); if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', go); else speechSynthesis.onvoiceschanged = go;
    },
    english: function () { return Voice.voices.filter(function (v) { return /^en/i.test(v.lang); }); },
    score: function (v) {
      var s = 0, a = Store.s.prefs.accent, n = v.name || '';
      if (/^en/i.test(v.lang)) s += 10;
      if (a === 'african' && AFR.test(v.lang)) s += 12; else if (a === 'gb' && /^en[-_]GB/i.test(v.lang)) s += 12; else if (a === 'us' && /^en[-_]US/i.test(v.lang)) s += 12; else if (a === 'au' && /^en[-_]AU/i.test(v.lang)) s += 12;
      else if (a === 'auto' && AFR.test(v.lang)) s += 3;
      if (/natural|neural|online|premium|enhanced|studio|wavenet/i.test(n)) s += 8; if (/google/i.test(n)) s += 3; if (/espeak|compact/i.test(n)) s -= 6; if (v.localService === false) s += 1;
      return s;
    },
    pick: function (persona) {
      var want = Store.s.prefs.voices[persona]; if (want) { var m = Voice.voices.filter(function (v) { return v.voiceURI === want; })[0]; if (m) return m; }
      var list = Voice.english().slice().sort(function (a, b) { return Voice.score(b) - Voice.score(a); }); return list[0] || null;
    },
    quality: function () { var v = Voice.pick(Voice.persona); if (!v) return 'none'; return /natural|neural|online|premium|enhanced|wavenet|studio/i.test(v.name) ? 'neural' : 'basic'; },
    emit: function () { Voice.onstate.forEach(function (f) { try { f(Voice); } catch (e) { } }); },
    set: function (st) { Voice.state = st; Voice.emit(); },
    /* segments: [{id,text}] */
    play: function (title, segments, opt) {
      opt = opt || {}; Voice.stop(true);
      var url = opt.url; Voice.title = title; Voice.persona = opt.persona || 'reader'; Voice.onseg = opt.onseg || null; Voice.err = '';
      if (url) { Voice.mode = 'url'; var a = Voice.audio = new Audio(url); a.playbackRate = Store.s.prefs.rate; a.addEventListener('ended', function () { Voice.set('idle'); if (opt.onend) opt.onend(); }); a.addEventListener('timeupdate', Voice.emit); a.addEventListener('error', function () { Voice.err = 'The audio file could not be loaded.'; Voice.set('idle'); }); a.play().then(function () { Voice.set('playing'); }).catch(function () { Voice.err = 'Playback was blocked or the file is missing.'; Voice.set('idle'); }); Voice.media(); Voice.log(title); return true; }
      if (!Voice.ok) { Voice.err = 'This browser has no speech synthesis. Try Chrome, Edge, Safari or Firefox, or add recorded audio (see README).'; Voice.set('idle'); return false; }
      Voice.mode = 'tts'; Voice.q = []; segments.forEach(function (s) { chunk(s.text).forEach(function (c, k) { Voice.q.push({ id: s.id, text: c, first: k === 0 }); }); });
      Voice.i = opt.start || 0; Voice.onend = opt.onend || null; Voice.log(title); Voice.speak(); Voice.media(); return true;
    },
    speak: function () {
      clearTimeout(Voice.timer); var my = ++Voice.token;
      if (Voice.i >= Voice.q.length) { Voice.set('idle'); if (Voice.onseg) Voice.onseg(null); if (Voice.onend) Voice.onend(); return; }
      var seg = Voice.q[Voice.i], P = PERSONAS[Voice.persona] || PERSONAS.guide, u = new SpeechSynthesisUtterance(pron(seg.text)), v = Voice.pick(Voice.persona);
      if (v) { u.voice = v; u.lang = v.lang; } u.rate = Math.max(.5, Math.min(2, P.rate * Store.s.prefs.rate)); u.pitch = P.pitch;
      u.onstart = function () { if (my !== Voice.token) return; Voice.set('playing'); if (Voice.onseg) Voice.onseg(seg.id); };
      u.onend = function () { if (my !== Voice.token || Voice.state === 'paused') return; Voice.i++; var last = Voice.q[Voice.i]; var gap = (last && last.first) ? P.pause : 120; Voice.timer = setTimeout(function () { if (my === Voice.token) Voice.speak(); }, gap); };
      u.onerror = function (e) { if (my !== Voice.token) return; if (e.error === 'canceled' || e.error === 'interrupted') return; Voice.err = 'Speech failed (' + e.error + '). Check the device voice settings.'; Voice.set('idle'); };
      try { speechSynthesis.cancel(); speechSynthesis.speak(u); Voice.set('playing'); } catch (e) { Voice.err = 'Speech could not start.'; Voice.set('idle'); }
    },
    pause: function () { if (Voice.mode === 'url' && Voice.audio) { Voice.audio.pause(); Voice.set('paused'); return; } if (Voice.state !== 'playing') return; Voice.token++; clearTimeout(Voice.timer); try { speechSynthesis.cancel(); } catch (e) { } Voice.set('paused'); },
    resume: function () { if (Voice.mode === 'url' && Voice.audio) { Voice.audio.play(); Voice.set('playing'); return; } if (Voice.state === 'paused') { Voice.speak(); } },
    toggle: function () { Voice.state === 'playing' ? Voice.pause() : Voice.resume(); },
    stop: function (silent) { Voice.token++; clearTimeout(Voice.timer); try { if (Voice.ok) speechSynthesis.cancel(); } catch (e) { } if (Voice.audio) { Voice.audio.pause(); Voice.audio = null; } Voice.q = []; Voice.i = 0; if (Voice.onseg) { try { Voice.onseg(null); } catch (e) { } } if (!silent) Voice.set('idle'); else Voice.state = 'idle'; },
    seek: function (i) { if (Voice.mode === 'url' && Voice.audio) { Voice.audio.currentTime = i; Voice.emit(); return; } Voice.i = Math.max(0, Math.min(Voice.q.length - 1, i)); if (Voice.state === 'playing') Voice.speak(); else Voice.emit(); },
    skip: function (d) { if (Voice.mode === 'url' && Voice.audio) { Voice.audio.currentTime = Math.max(0, Voice.audio.currentTime + d * 15); return; } var cur = Voice.q[Voice.i]; var j = Voice.i + d; if (d > 0) while (j < Voice.q.length - 1 && Voice.q[j].id === cur.id) j++; else { j = Voice.i - 1; while (j > 0 && Voice.q[j - 1].id === Voice.q[j].id) j--; } Voice.seek(j); },
    rate: function (r) { Store.s.prefs.rate = r; Store.save('prefs'); if (Voice.audio) Voice.audio.playbackRate = r; else if (Voice.state === 'playing') Voice.speak(); },
    log: function (t) { var L = Store.s.listening; L.unshift({ t: t, at: Date.now() }); if (L.length > 60) L.length = 60; Store.save(); },
    media: function () { try { if ('mediaSession' in navigator) { navigator.mediaSession.metadata = new MediaMetadata({ title: Voice.title, artist: 'Doctor Orison', album: 'The Archive of Spiritual Knowledge', artwork: [{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' }] }); navigator.mediaSession.setActionHandler('play', Voice.resume); navigator.mediaSession.setActionHandler('pause', Voice.pause); navigator.mediaSession.setActionHandler('stop', function () { Voice.stop(); }); } } catch (e) { } },
    synthetic: function () { return Voice.mode === 'tts'; }
  };

  /* ================= Cloud (Supabase) ================= */
  var Cloud = {
    configured: !!(CFG.supabaseUrl && CFG.supabaseAnonKey), client: null, user: null, role: 'user', status: 'idle', msg: '', onchange: [],
    init: function () {
      if (!Cloud.configured) return Promise.resolve(false);
      return new Promise(function (res) {
        var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'; s.async = true;
        s.onload = function () {
          try {
            Cloud.client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
            Cloud.client.auth.getSession().then(function (r) { Cloud.setUser(r.data && r.data.session ? r.data.session.user : null); res(true); });
            Cloud.client.auth.onAuthStateChange(function (ev, session) { Cloud.setUser(session ? session.user : null); });
          } catch (e) { Cloud.msg = 'Cloud service could not start: ' + e.message; res(false); }
        };
        s.onerror = function () { Cloud.msg = 'Could not load the Supabase library. You are offline or the CDN is blocked. Local data still works.'; res(false); };
        document.head.appendChild(s);
      });
    },
    setUser: function (u) { var changed = (u && u.id) !== (Cloud.user && Cloud.user.id); Cloud.user = u; if (u && changed) { Cloud.pull().then(Cloud.loadRole); } else if (!u) Cloud.role = 'user'; Cloud.emit(); },
    emit: function () { Cloud.onchange.forEach(function (f) { try { f(); } catch (e) { } }); },
    loadRole: function () { if (!Cloud.user) return; return Cloud.client.from('profiles').select('role').eq('id', Cloud.user.id).maybeSingle().then(function (r) { Cloud.role = r.data && r.data.role ? r.data.role : 'user'; Cloud.emit(); }); },
    signUp: function (email, pw) { return Cloud.client.auth.signUp({ email: email, password: pw }); },
    signIn: function (email, pw) { return Cloud.client.auth.signInWithPassword({ email: email, password: pw }); },
    reset: function (email) { return Cloud.client.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] }); },
    signOut: function () { return Cloud.client.auth.signOut(); },
    merge: function (a, b) {
      /* a = local, b = remote. Lists are unioned, maps are unioned, newer side wins conflicts. */
      var newer = (a.updated || 0) >= (b.updated || 0), out = JSON.parse(JSON.stringify(newer ? a : b)), other = newer ? b : a;
      ['bookmarks', 'savedIng', 'savedPrayers'].forEach(function (k) { out[k] = Array.from(new Set((a[k] || []).concat(b[k] || []))); });
      ['myPrayers', 'gratitude', 'routines'].forEach(function (k) { var seen = {}, all = (a[k] || []).concat(b[k] || []); out[k] = all.filter(function (x) { var id = x.id || JSON.stringify(x); if (seen[id]) return false; seen[id] = 1; return true; }); });
      ['highlights', 'notes', 'completed', 'plans', 'journal', 'routineLog', 'lessonsDone', 'activity', 'intention'].forEach(function (k) { out[k] = Object.assign({}, other[k] || {}, out[k] || {}); });
      out.history = (a.history || []).concat(b.history || []).sort(function (x, y) { return (y.at || 0) - (x.at || 0); }).filter(function (x, i, arr) { return i === arr.findIndex(function (z) { return z.ref === x.ref; }); }).slice(0, 80);
      out.listening = (a.listening || []).concat(b.listening || []).sort(function (x, y) { return (y.at || 0) - (x.at || 0); }).slice(0, 60);
      out.prefs = (a.prefs.updated || 0) >= (b.prefs.updated || 0) ? a.prefs : b.prefs; out.updated = Date.now(); return out;
    },
    pull: function () {
      if (!Cloud.client || !Cloud.user || !Store.s.prefs.sync) return Promise.resolve();
      Cloud.status = 'syncing'; Cloud.emit();
      return Cloud.client.from('orison_user_state').select('data,updated_at').eq('user_id', Cloud.user.id).maybeSingle().then(function (r) {
        if (r.error) throw r.error; if (r.data && r.data.data && r.data.data.v) { Store.replace(Cloud.merge(Store.s, r.data.data)); }
        Cloud.status = 'ok'; Cloud.msg = 'Synced ' + new Date().toLocaleTimeString(); Cloud.emit(); return Cloud.push(true);
      }).catch(function (e) { Cloud.status = 'error'; Cloud.msg = 'Sync failed: ' + (e.message || e); Cloud.emit(); });
    },
    push: function (force) {
      if (!Cloud.client || !Cloud.user || !Store.s.prefs.sync) return Promise.resolve();
      return Cloud.client.from('orison_user_state').upsert({ user_id: Cloud.user.id, data: Store.s, updated_at: new Date().toISOString() }).then(function (r) { if (r.error) throw r.error; Cloud.status = 'ok'; Cloud.msg = 'Synced ' + new Date().toLocaleTimeString(); Cloud.emit(); }).catch(function (e) { Cloud.status = 'error'; Cloud.msg = 'Sync failed: ' + (e.message || e); Cloud.emit(); });
    },
    deleteAccount: function () { return Cloud.client.rpc('delete_my_account').then(function (r) { if (r.error) throw r.error; return Cloud.client.auth.signOut(); }); },
    records: function (status) { var q = Cloud.client.from('content_records').select('*').order('updated_at', { ascending: false }); if (status) q = q.eq('status', status); return q; },
    saveRecord: function (rec) { rec.updated_at = new Date().toISOString(); return rec.id ? Cloud.client.from('content_records').update(rec).eq('id', rec.id).select().single() : Cloud.client.from('content_records').insert(rec).select().single(); },
    deleteRecord: function (id) { return Cloud.client.from('content_records').delete().eq('id', id); }
  };

  window.Orison = { CFG: CFG, esc: esc, today: today, dayIndex: dayIndex, uid: uid, Store: Store, Bible: Bible, Voice: Voice, PERSONAS: PERSONAS, Cloud: Cloud, chunk: chunk };
})();
