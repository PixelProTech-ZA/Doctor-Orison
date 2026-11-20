/* Doctor Orison — Department II: The Prayer Chamber (lessons, library, personal prayers, recording). */
(function () {
  'use strict';
  var O = window.Orison, A = window.OrisonArt, App = window.App, Store = O.Store, Bible = O.Bible, h = O.esc, PR = window.OrisonPrayers, ic = A.icon;

  /* IndexedDB for voice recordings (kept only in this browser) */
  function db() {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error('This browser does not allow local storage of recordings.'));
      var r = indexedDB.open('orison-media', 1); r.onupgradeneeded = function () { r.result.createObjectStore('rec', { keyPath: 'id' }); }; r.onsuccess = function () { App.idb = true; res(r.result); }; r.onerror = function () { rej(r.error || new Error('Recording storage is unavailable.')); };
    });
  }
  function idbAll() { return db().then(function (d) { return new Promise(function (res, rej) { var q = d.transaction('rec').objectStore('rec').getAll(); q.onsuccess = function () { res(q.result.sort(function (a, b) { return b.at - a.at; })); }; q.onerror = function () { rej(q.error); }; }); }); }
  function idbPut(o) { return db().then(function (d) { return new Promise(function (res, rej) { var t = d.transaction('rec', 'readwrite'); t.objectStore('rec').put(o); t.oncomplete = res; t.onerror = function () { rej(t.error); }; }); }); }
  function idbDel(id) { return db().then(function (d) { return new Promise(function (res, rej) { var t = d.transaction('rec', 'readwrite'); t.objectStore('rec').delete(id); t.oncomplete = res; t.onerror = function () { rej(t.error); }; }); }); }

  App.route('prayer', function (el, a, qs) {
    var tab = a[0] || 'lessons';
    if (tab === 'lesson') return lesson(el, a[1]);
    var tabs = [['lessons', 'Lessons'], ['library', 'Prayer library'], ['write', 'Write a prayer'], ['record', 'Record & playback']];
    el.innerHTML = '<h1>The Prayer Chamber</h1><p>Prayer taught from the first word. No special language is needed. Prayers here never promise money, luck or a particular outcome: they are ways of speaking honestly to God.</p><div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button role="tab" aria-selected="' + (t[0] === tab) + '" data-act="ptab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="pb"></div>';
    var box = el.querySelector('#pb');
    if (tab === 'lessons') lessons(box); else if (tab === 'library') library(box, qs.c); else if (tab === 'write') write(box, qs.e); else if (tab === 'record') record(box); else lessons(box);
  });
  App.acts.ptab = function (b) { App.go('prayer/' + b.dataset.t); };

  function lessons(box) {
    var done = Store.s.lessonsDone;
    box.innerHTML = '<div class="grid g2">' + PR.LESSONS.map(function (l, i) { return '<a class="card" href="#/prayer/lesson/' + l.id + '"><div class="eyebrow">Lesson ' + A.roman(i + 1) + ' · ' + l.time + (done[l.id] ? ' · completed ✓' : '') + '</div><h3>' + h(l.t) + '</h3><p class="small">' + h(l.intro.slice(0, 130)) + '…</p></a>'; }).join('') + '</div>';
  }
  function lesson(el, id) {
    var i = PR.LESSONS.findIndex(function (l) { return l.id === id; }), L = PR.LESSONS[i];
    if (!L) { el.innerHTML = '<h1>Lesson not found</h1><a class="btn" href="#/prayer">Back to lessons</a>'; return; }
    var done = !!Store.s.lessonsDone[L.id], prev = PR.LESSONS[i - 1], next = PR.LESSONS[i + 1];
    var full = L.intro + ' ' + L.steps.map(function (s) { return s[0] + '. ' + s[1]; }).join(' ') + ' ' + L.why;
    el.innerHTML = '<p class="small"><a href="#/prayer">The Prayer Chamber</a> › Lesson ' + A.roman(i + 1) + '</p><h1>' + h(L.t) + '</h1><p class="small">' + L.time + ' · Scripture: ' + h(Bible.label(L.ref)) + '</p><div class="row" style="margin-bottom:1rem">' + App.listenBtn('Listen to the lesson', App.regAudio('ll' + L.id, L.t, [{ id: 1, text: L.intro }].concat(L.steps.map(function (s, k) { return { id: k + 2, text: s[0] + '. ' + s[1] }; })).concat([{ id: 99, text: L.why }]), 'guide'), 'guide') + '</div><p>' + h(L.intro) + '</p><div id="lq">' + App.loading('Loading scripture…') + '</div>' +
      '<ol class="steps">' + L.steps.map(function (s) { return '<li><b>' + h(s[0]) + '</b>' + h(s[1]) + '</li>'; }).join('') + '</ol>' +
      '<div class="comm"><p>' + h(L.why) + '</p></div><div class="notice"><b class="t">What this cannot do</b>' + h(L.limit) + '</div>' +
      App.rule('A prayer to begin with') + '<div class="card"><p style="font-size:1.15rem">' + h(L.prayer) + '</p><div class="row">' + App.listenBtn('Listen', App.regAudio('lp' + L.id, 'Prayer: ' + L.t, L.prayer, 'prayer'), 'prayer', true) + '<button class="btn sm" data-act="copyp" data-t="' + h(L.prayer) + '">Copy</button><a class="btn sm" href="#/prayer/write?e=new&t=' + encodeURIComponent(L.prayer) + '">Make it my own</a></div></div>' +
      '<div class="row sp" style="margin-top:1.5rem"><button class="btn' + (done ? '' : ' pri') + '" data-act="lessonDone" data-id="' + L.id + '">' + (done ? 'Completed ✓ (undo)' : 'Mark lesson complete') + '</button><div class="row">' + (prev ? '<a class="btn sm" href="#/prayer/lesson/' + prev.id + '">← ' + h(prev.t.split(' ').slice(0, 3).join(' ')) + '</a>' : '') + (next ? '<a class="btn sm" href="#/prayer/lesson/' + next.id + '">' + h(next.t.split(' ').slice(0, 3).join(' ')) + ' →</a>' : '') + '</div></div>';
    Store.touch(); Bible.load().then(function () { var q = el.querySelector('#lq'); if (q && App.el === el) q.innerHTML = App.quote(L.ref, 4); }).catch(function (e) { var q = el.querySelector('#lq'); if (q) q.innerHTML = '<p class="small">' + h(e.message) + '</p>'; });
  }
  App.acts.lessonDone = function (b) { var d = Store.s.lessonsDone; if (d[b.dataset.id]) { delete d[b.dataset.id]; b.className = 'btn pri'; b.textContent = 'Mark lesson complete'; } else { d[b.dataset.id] = Date.now(); b.className = 'btn'; b.textContent = 'Completed ✓ (undo)'; App.toast('Lesson completed'); } Store.touch(); Store.save(); };
  App.acts.copyp = function (b) { App.copy(b.dataset.t); };

  function library(box, cat) {
    var cats = ['All'].concat(PR.PRAYER_LIBRARY.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; })), c = cat || 'All', saved = Store.s.savedPrayers;
    var list = PR.PRAYER_LIBRARY.filter(function (p) { return c === 'All' || p.cat === c; });
    box.innerHTML = '<div class="row" style="margin-bottom:1rem">' + cats.map(function (x) { return '<button class="chip" aria-pressed="' + (x === c) + '" data-act="pcat" data-c="' + x + '">' + x + '</button>'; }).join('') + '</div><div class="grid g2">' + list.map(function (p) { var on = saved.indexOf(p.id) > -1; return '<article class="card"><div class="eyebrow">' + h(p.cat) + '</div><h3>' + h(p.t) + '</h3><p>' + h(p.text) + '</p><p class="small">Scripture: <a href="#/bible/' + p.ref.split('.')[0] + '/' + p.ref.split('.')[1] + '">' + h(Bible.label(p.ref)) + '</a></p><div class="row">' + App.listenBtn('Listen', App.regAudio('pl' + p.id, p.t, p.text, 'prayer'), 'prayer', true) + '<button class="btn sm" data-act="psave" data-id="' + p.id + '" aria-pressed="' + on + '">' + ic('bm', 14) + ' ' + (on ? 'Saved' : 'Save') + '</button><button class="btn sm" data-act="copyp" data-t="' + h(p.text) + '">Copy</button></div></article>'; }).join('') + '</div>';
  }
  App.acts.pcat = function (b) { App.go('prayer/library?c=' + encodeURIComponent(b.dataset.c)); };
  App.acts.psave = function (b) { var s = Store.s.savedPrayers, i = s.indexOf(b.dataset.id); if (i > -1) s.splice(i, 1); else s.push(b.dataset.id); Store.save(); b.innerHTML = ic('bm', 14) + ' ' + (i > -1 ? 'Save' : 'Saved'); App.toast(i > -1 ? 'Removed' : 'Saved to My Archive'); };

  function write(box, edit) {
    var mine = Store.s.myPrayers, e = edit && edit !== 'new' ? mine.filter(function (p) { return p.id === edit; })[0] : null, qs = new URLSearchParams(location.hash.split('?')[1] || '');
    box.innerHTML = '<form class="card" data-submit="savePrayer" data-id="' + (e ? e.id : '') + '"><h3>' + (e ? 'Edit your prayer' : 'Write your own prayer') + '</h3><p class="small">Write to God in your own words. A simple pattern: thank, say what is true, ask, and close. Your prayers are private and saved on this device.</p><label for="pt">Title</label><input id="pt" type="text" maxlength="80" value="' + h(e ? e.title : '') + '" placeholder="For example: Before the interview" required><label for="pbd">Your prayer</label><textarea id="pbd" required style="min-height:10rem">' + h(e ? e.text : (qs.get('t') || '')) + '</textarea><p class="row"><button class="btn pri">Save prayer</button>' + (e ? '<a class="btn" href="#/prayer/write">Cancel</a>' : '') + '</p></form>' +
      App.rule('Your prayers') + (mine.length ? '<div class="grid g2">' + mine.map(function (p) { return '<article class="card"><h3>' + h(p.title) + '</h3><p style="white-space:pre-wrap">' + h(p.text) + '</p><div class="row">' + App.listenBtn('Listen', App.regAudio('mp' + p.id, p.title, p.text, 'prayer'), 'prayer', true) + '<a class="btn sm" href="#/prayer/write?e=' + p.id + '">Edit</a><button class="btn sm danger" data-act="delPrayer" data-id="' + p.id + '">Delete</button></div></article>'; }).join('') + '</div>' : App.empty('No prayers written yet'));
  }
  App.acts.savePrayer = function (f) { var s = Store.s, id = f.dataset.id, t = f.querySelector('#pt').value.trim(), x = f.querySelector('#pbd').value.trim(); if (!t || !x) return; if (id) { var p = s.myPrayers.filter(function (q) { return q.id === id; })[0]; if (p) { p.title = t; p.text = x; p.at = Date.now(); } } else s.myPrayers.unshift({ id: O.uid(), title: t, text: x, at: Date.now() }); Store.touch(); Store.save(); App.toast('Prayer saved'); App.go('prayer/write'); App.render(); };
  App.acts.delPrayer = function (b) { var s = Store.s; s.myPrayers = s.myPrayers.filter(function (p) { return p.id !== b.dataset.id; }); Store.save(); App.render(); };

  /* ---- recording ---- */
  var rec = null, chunks = [], stream = null, timer = 0, secs = 0;
  function record(box) {
    var ok = !!(navigator.mediaDevices && window.MediaRecorder);
    box.innerHTML = '<div class="card"><h3>Record a prayer</h3><p class="small">Record yourself praying or reading, then play it back. Recordings stay in this browser only and are never uploaded. The browser will ask permission to use the microphone.</p>' + (ok ? '<div class="row"><button class="btn pri" id="rbtn" data-act="recToggle">' + ic('mic', 16) + ' Start recording</button><span id="rtime" class="small" role="timer"></span></div><div id="rmsg"></div>' : '<div class="notice warn"><b class="t">Not supported</b>This browser cannot record audio. Try a recent Chrome, Edge, Firefox or Safari over a secure (https) connection.</div>') + '</div>' + App.rule('Your recordings') + '<div id="rl">' + App.loading('…') + '</div>'; drawRecs(box);
  }
  function drawRecs(box) {
    idbAll().then(function (all) { var l = (box || document).querySelector('#rl'); if (!l) return; l.innerHTML = all.length ? '<div class="grid g2">' + all.map(function (r) { return '<div class="card"><h3>' + h(r.title) + '</h3><p class="small">' + new Date(r.at).toLocaleString() + ' · ' + r.secs + 's</p><audio controls preload="none" data-rid="' + r.id + '" style="width:100%"></audio><p class="row"><button class="btn sm danger" data-act="recDel" data-id="' + r.id + '">Delete</button></p></div>'; }).join('') + '</div>' : App.empty('No recordings yet'); all.forEach(function (r) { var a = l.querySelector('audio[data-rid="' + r.id + '"]'); if (a) a.src = URL.createObjectURL(r.blob); }); }).catch(function (e) { var l = (box || document).querySelector('#rl'); if (l) l.innerHTML = App.error(e.message); });
  }
  App.acts.recToggle = function (b) {
    var msg = document.getElementById('rmsg'), t = document.getElementById('rtime');
    if (rec && rec.state === 'recording') { rec.stop(); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) {
      stream = st; chunks = []; secs = 0; var types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'], mt = types.filter(function (x) { return window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(x); })[0];
      rec = mt ? new MediaRecorder(st, { mimeType: mt }) : new MediaRecorder(st);
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () { clearInterval(timer); stream.getTracks().forEach(function (x) { x.stop(); }); var blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' }), n = secs; b.innerHTML = ic('mic', 16) + ' Start recording'; if (t) t.textContent = ''; if (!blob.size) { msg.innerHTML = App.error('Nothing was recorded.'); return; } idbPut({ id: O.uid(), title: 'Prayer ' + new Date().toLocaleDateString(), at: Date.now(), secs: n, blob: blob }).then(function () { App.toast('Recording saved'); drawRecs(document); }).catch(function (e) { msg.innerHTML = App.error('Could not save: ' + e.message); }); };
      rec.start(); b.innerHTML = ic('stop', 16) + ' Stop and save'; timer = setInterval(function () { secs++; if (t) t.textContent = secs + 's'; }, 1000); msg.innerHTML = '';
    }).catch(function (e) { msg.innerHTML = App.error(e && e.name === 'NotAllowedError' ? 'Microphone permission was denied. Allow it in your browser’s site settings and try again.' : 'Could not start recording: ' + (e && e.message)); });
  };
  App.acts.recDel = function (b) { idbDel(b.dataset.id).then(function () { App.toast('Deleted'); drawRecs(document); }); };
})();
