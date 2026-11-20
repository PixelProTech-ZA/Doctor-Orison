/* Doctor Orison — Department I: The Bible Vault (reader, search, topics, plans, dictionary, companion). */
(function () {
  'use strict';
  var O = window.Orison, A = window.OrisonArt, App = window.App, Store = O.Store, Bible = O.Bible, Voice = O.Voice, h = O.esc, BK = window.OrisonBooks, ic = A.icon;
  var sel = [], cur = null; /* selected verse numbers, current chapter {book,ch} */

  function bookTile(b) { return '<a class="card" href="#/bible/' + b.id + '/1" style="padding:.7rem .9rem"><h3 style="font-size:1rem;margin:0">' + h(b.name) + '</h3><span class="small">' + b.c.length + ' ch</span></a>'; }

  App.route('bible', function (el, a, qs) {
    if (a[0] && a[0] !== 'topics' && a[0] !== 'plans' && a[0] !== 'dictionary' && a[0] !== 'search' && a[0] !== 'events') return reader(el, a, qs);
    App.withBible(el, function () {
      var tab = a[0] || 'books', s = Store.s;
      var tabs = [['books', 'Books'], ['topics', 'Topics'], ['events', 'People & events'], ['plans', 'Reading plans'], ['dictionary', 'Dictionary']];
      var head = '<h1>The Bible Vault</h1><p class="small">World English Bible · public domain · 66 books · 1,189 chapters · 31,103 verses</p>' +
        '<form class="sbox" role="search" data-submit="bsearch"><label class="sr" for="bq">Search the Bible</label><input id="bq" type="search" placeholder="A word, a subject, or a reference such as Psalm 23" autocomplete="off"><button type="submit" aria-label="Search">' + ic('search', 18) + '</button></form>' +
        (s.lastRead ? '<p style="margin-top:.8rem"><a class="btn sm pri" href="#/bible/' + s.lastRead.ref.split('.')[0] + '/' + s.lastRead.ref.split('.')[1] + '">Continue: ' + h(Bible.label(s.lastRead.ref)) + '</a></p>' : '') +
        '<div class="tabs" role="tablist" style="margin-top:1rem">' + tabs.map(function (t) { return '<button role="tab" aria-selected="' + (t[0] === tab) + '" data-act="btab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
      var body = '';
      if (tab === 'books') {
        body = App.rule('Old Testament') + '<div class="grid g3">' + Bible.books.filter(function (b) { return b.t === 'OT'; }).map(bookTile).join('') + '</div>' + App.rule('New Testament') + '<div class="grid g3">' + Bible.books.filter(function (b) { return b.t === 'NT'; }).map(bookTile).join('') + '</div>';
      } else if (tab === 'topics') {
        var t = a[1] && BK.TOPICS.filter(function (x) { return x.id === a[1]; })[0];
        if (t) body = '<h2>' + h(t.t) + '</h2><p class="small">Curated passages. Read each in its chapter to see who it was written to.</p>' + t.refs.map(function (r) { return App.quote(r, 6); }).join('') + '<p><a class="btn sm" href="#/bible/topics">All topics</a></p>';
        else body = '<div class="grid g3">' + BK.TOPICS.map(function (x) { return '<a class="card" href="#/bible/topics/' + x.id + '"><h3>' + h(x.t) + '</h3><p class="small">' + x.refs.length + ' passages</p></a>'; }).join('') + '</div>';
      } else if (tab === 'events') {
        body = '<p class="small">Search by person or event. Each opens the passage.</p><div class="grid g3">' + BK.PEOPLE_EVENTS.map(function (e) { var p = Bible.split(e.refs[0]); return '<a class="card" href="#/bible/' + p.book + '/' + p.ch + (p.v1 ? '?v=' + p.v1 : '') + '"><h3 style="font-size:1.05rem">' + h(e.t) + '</h3><p class="small">' + h(Bible.label(e.refs[0])) + (e.refs.length > 1 ? ' + ' + (e.refs.length - 1) + ' more chapters' : '') + '</p></a>'; }).join('') + '</div>';
      } else if (tab === 'plans') {
        body = plans(a[1]);
      } else if (tab === 'dictionary') {
        body = '<label class="sr" for="dq">Filter the dictionary</label><input id="dq" type="search" placeholder="Filter terms" data-chg="dfilter"><div id="dl" class="grid g2" style="margin-top:1rem">' + dictList('') + '</div>';
      }
      el.innerHTML = head + body;
    });
  });
  function dictList(f) { f = f.toLowerCase(); var l = BK.DICTIONARY.filter(function (d) { return !f || (d.t + ' ' + d.d).toLowerCase().indexOf(f) > -1; }); return l.length ? l.map(function (d) { return '<div class="card"><h3>' + h(d.t) + '</h3><p class="small" style="color:var(--ink2)">' + h(d.d) + '</p></div>'; }).join('') : App.empty('No matching term'); }
  App.acts.dfilter = function (i) { document.getElementById('dl').innerHTML = dictList(i.value); };
  App.acts.btab = function (b) { App.go('bible' + (b.dataset.t === 'books' ? '' : '/' + b.dataset.t)); };
  App.acts.bsearch = function (f) { var q = f.querySelector('input').value.trim(); if (!q) return; var r = Bible.parse(q); if (r) { var p = Bible.split(r); App.go('bible/' + p.book + '/' + p.ch + (p.v1 ? '?v=' + p.v1 : '')); } else App.go('search?q=' + encodeURIComponent(q) + '&t=bible'); };

  /* ---------- reading plans ---------- */
  function plans(id) {
    var s = Store.s;
    if (id) {
      var P = BK.READING_PLANS.filter(function (p) { return p.id === id; })[0]; if (!P) return App.empty('Plan not found');
      var days = P.build(Bible.books), st = s.plans[id], done = st ? st.done : {}, nextDay = -1;
      for (var i = 0; i < days.length; i++) if (!done[i]) { nextDay = i; break; }
      return '<h2>' + h(P.t) + '</h2><p class="small">' + h(P.d) + ' · ' + Object.keys(done).length + ' of ' + days.length + ' days done</p>' + (!st ? '<p><button class="btn pri" data-act="planStart" data-id="' + id + '">Start this plan</button></p>' : '<p class="small">Started ' + h(st.start) + '. Missing a day is fine: just continue where you are.</p><p><button class="btn sm danger" data-act="planReset" data-id="' + id + '">Reset plan</button></p>') +
        '<div class="grid g3">' + days.map(function (d, i) { var isDone = !!done[i]; return '<div class="card" style="' + (i === nextDay && st ? 'border-color:var(--gold)' : '') + '"><div class="eyebrow">Day ' + (i + 1) + (i === nextDay && st ? ' · next' : '') + '</div><p style="margin:0 0 .5rem">' + d.map(function (k) { var p = Bible.split(k); return '<a href="#/bible/' + p.book + '/' + p.ch + '">' + h(Bible.label(k)) + '</a>'; }).join(', ') + '</p>' + (st ? '<button class="btn sm' + (isDone ? '' : ' pri') + '" data-act="planDay" data-id="' + id + '" data-d="' + i + '">' + (isDone ? 'Done ✓ (undo)' : 'Mark day done') + '</button>' : '') + '</div>'; }).join('') + '</div><p><a class="btn sm" href="#/bible/plans">All plans</a></p>';
    }
    return '<div class="grid g2">' + BK.READING_PLANS.map(function (p) { var st = s.plans[p.id], n = p.build(Bible.books).length; return '<a class="card" href="#/bible/plans/' + p.id + '"><h3>' + h(p.t) + '</h3><p class="small">' + h(p.d) + '</p><p class="small">' + (st ? Object.keys(st.done).length + ' of ' + n + ' days done' : n + ' days · not started') + '</p></a>'; }).join('') + '</div>';
  }
  App.acts.planStart = function (b) { Store.s.plans[b.dataset.id] = { start: O.today(), done: {} }; Store.save(); App.render(); };
  App.acts.planReset = function (b) { delete Store.s.plans[b.dataset.id]; Store.save(); App.render(); };
  App.acts.planDay = function (b) { var st = Store.s.plans[b.dataset.id], d = b.dataset.d; if (st.done[d]) delete st.done[d]; else st.done[d] = 1; Store.touch(); Store.save(); App.render(); };

  /* ---------- reader ---------- */
  function reader(el, a, qs) {
    var book = a[0], ch = parseInt(a[1] || '1', 10);
    App.withBible(el, function () {
      var b = Bible.byId[book]; if (!b) { el.innerHTML = '<h1>Book not found</h1>' + App.empty('There is no book called “' + book + '”.', '<a href="#/bible">Browse all books</a>'); return; }
      if (!(ch >= 1 && ch <= b.c.length)) ch = 1;
      cur = { book: book, ch: ch }; sel = []; var key = book + '.' + ch, s = Store.s, p = s.prefs, verses = b.c[ch - 1];
      /* history and last read */
      s.history = s.history.filter(function (x) { return x.ref !== key; }); s.history.unshift({ ref: key, at: Date.now() }); if (s.history.length > 80) s.history.length = 80; s.lastRead = { ref: key, at: Date.now() }; Store.touch(); Store.save();
      var info = BK.BOOK_INFO[book], done = !!s.completed[key], hasPrev = ch > 1 || b.i > 0, hasNext = ch < b.c.length || b.i < 65;
      var perLine = p.vpl || /^(psalms|proverbs|lamentations|songofsolomon)$/.test(book) && p.vpl !== false && false;
      var body = verses.map(function (t, i) { var n = i + 1, r = key + '.' + n, cl = 'v' + (s.highlights[r] ? ' h' + s.highlights[r] : '') + (s.bookmarks.indexOf(r) > -1 ? ' bm' : '') + (s.notes[r] ? ' nt' : ''); return '<span class="' + cl + '" id="v' + n + '" data-act="vsel" data-n="' + n + '" role="button" tabindex="0" aria-label="Verse ' + n + '"><sup>' + n + '</sup>' + h(t) + '</span>' + (perLine ? '<br>' : ' '); }).join('');
      var terms = dictTerms(verses.join(' '));
      el.innerHTML =
        '<div class="reader"><div class="rbar" role="toolbar" aria-label="Reading tools">' +
        '<button class="btn sm" data-act="picker">' + ic('book', 14) + ' ' + h(b.name) + ' ' + ch + '</button>' +
        '<a class="btn sm ico" ' + (hasPrev ? 'href="#/' + prevHref(b, ch) + '"' : 'aria-disabled="true" style="opacity:.4;pointer-events:none"') + ' aria-label="Previous chapter">' + ic('prev', 14) + '</a>' +
        '<a class="btn sm ico" ' + (hasNext ? 'href="#/' + nextHref(b, ch) + '"' : 'aria-disabled="true" style="opacity:.4;pointer-events:none"') + ' aria-label="Next chapter">' + ic('next', 14) + '</a>' +
        '<span style="flex:1"></span><button class="btn sm" data-act="fsize" data-d="-1" aria-label="Smaller text">A−</button><button class="btn sm" data-act="fsize" data-d="1" aria-label="Larger text">A+</button>' +
        '<button class="btn sm" data-act="rtheme" aria-label="Switch reading mode">' + (p.theme === 'parch' ? 'Dark' : 'Parchment') + '</button><button class="btn sm" data-act="vpl" aria-pressed="' + !!p.vpl + '">¶ ' + (p.vpl ? 'Flow' : 'Lines') + '</button>' +
        '<button class="btn sm pri" data-act="listench">' + ic('play', 14) + ' Listen</button></div>' +
        '<h1 class="rtitle">' + h(b.name) + ' ' + ch + '</h1><div class="rsub">' + (b.t === 'OT' ? 'Old' : 'New') + ' Testament · World English Bible</div>' +
        '<div class="text" id="txt" lang="en">' + body + '</div>' +
        '<div class="row sp" style="margin:2rem 0 1rem"><button class="btn' + (done ? '' : ' pri') + '" data-act="complete">' + (done ? 'Completed ✓ (undo)' : 'Mark chapter as read') + '</button><div class="row"><button class="btn sm" data-act="companionCh">' + ic('ask', 14) + ' Ask about this chapter</button><button class="btn sm" data-act="ctx">Context</button></div></div>' +
        '<div id="ctxbox"></div>' +
        (terms.length ? '<p class="small">Words in this chapter: ' + terms.map(function (t) { return '<button class="chip" data-act="defn" data-t="' + h(t.t) + '">' + h(t.t) + '</button>'; }).join(' ') + '</p>' : '') +
        '<p class="small">Verse text: World English Bible, public domain.</p></div>';
      if (qs.v) { var n = parseInt(qs.v, 10), e = el.querySelector('#v' + n); if (e) { e.classList.add('sel'); setTimeout(function () { e.scrollIntoView({ block: 'center', behavior: Store.s.prefs.nomo ? 'auto' : 'smooth' }); }, 80); } }
    });
  }
  function prevHref(b, ch) { if (ch > 1) return 'bible/' + b.id + '/' + (ch - 1); var pb = Bible.books[b.i - 1]; return 'bible/' + pb.id + '/' + pb.c.length; }
  function nextHref(b, ch) { if (ch < b.c.length) return 'bible/' + b.id + '/' + (ch + 1); return 'bible/' + Bible.books[b.i + 1].id + '/1'; }
  function dictTerms(text) { var low = text.toLowerCase(), out = []; BK.DICTIONARY.forEach(function (d) { d.t.split(' / ').forEach(function (w) { if (new RegExp('\\b' + w.toLowerCase().replace(/[^a-z ]/g, '') + '\\b').test(low) && out.indexOf(d) < 0) out.push(d); }); }); return out.slice(0, 14); }
  App.acts.defn = function (b) { var d = BK.DICTIONARY.filter(function (x) { return x.t === b.dataset.t; })[0]; if (d) App.modal('<h2>' + h(d.t) + '</h2><p>' + h(d.d) + '</p><p class="small">Biblical dictionary · plain-language definition written for this app.</p>', { label: d.t }); };

  /* picker */
  App.acts.picker = function () {
    App.modal('<h2>Choose a book</h2><div id="pk"></div>', { label: 'Book and chapter picker' }); pickBooks();
  };
  function pickBooks() { var pk = document.getElementById('pk'); pk.innerHTML = '<h4>Old Testament</h4><div class="books">' + Bible.books.filter(function (b) { return b.t === 'OT'; }).map(function (b) { return '<button data-act="pickBook" data-b="' + b.id + '">' + h(b.name) + '</button>'; }).join('') + '</div><h4 style="margin-top:1rem">New Testament</h4><div class="books">' + Bible.books.filter(function (b) { return b.t === 'NT'; }).map(function (b) { return '<button data-act="pickBook" data-b="' + b.id + '">' + h(b.name) + '</button>'; }).join('') + '</div>'; }
  App.acts.pickBook = function (btn) { var b = Bible.byId[btn.dataset.b], pk = document.getElementById('pk'), c = Store.s.completed; var g = ''; for (var i = 1; i <= b.c.length; i++) g += '<button class="' + (c[b.id + '.' + i] ? 'done' : '') + '" data-act="pickCh" data-b="' + b.id + '" data-c="' + i + '" aria-label="Chapter ' + i + (c[b.id + '.' + i] ? ' (read)' : '') + '">' + i + '</button>'; pk.innerHTML = '<h3>' + h(b.name) + '</h3><p class="small">Gold chapters are ones you have marked as read.</p><div class="chs">' + g + '</div><p><button class="btn sm" data-act="pickBack">All books</button></p>'; };
  App.acts.pickBack = pickBooks;
  App.acts.pickCh = function (btn) { App.closeModal(); App.go('bible/' + btn.dataset.b + '/' + btn.dataset.c); };

  /* reader tools */
  App.acts.fsize = function (b) { var p = Store.s.prefs; p.size = Math.max(0, Math.min(4, p.size + (+b.dataset.d))); Store.save('prefs'); App.applyPrefs(); };
  App.acts.rtheme = function (b) { var p = Store.s.prefs; p.theme = p.theme === 'parch' ? 'dark' : 'parch'; Store.save('prefs'); App.applyPrefs(); b.textContent = p.theme === 'parch' ? 'Dark' : 'Parchment'; };
  App.acts.vpl = function () { var p = Store.s.prefs; p.vpl = !p.vpl; Store.save('prefs'); App.render(); };
  App.acts.complete = function (b) { var s = Store.s, k = cur.book + '.' + cur.ch; if (s.completed[k]) { delete s.completed[k]; b.className = 'btn'; b.textContent = 'Mark chapter as read'; b.classList.add('pri'); } else { s.completed[k] = Date.now(); b.className = 'btn'; b.textContent = 'Completed ✓ (undo)'; App.toast('Chapter marked as read'); } Store.touch(); Store.save(); };
  App.acts.ctx = function () {
    var box = document.getElementById('ctxbox'), info = BK.BOOK_INFO[cur.book], b = Bible.byId[cur.book]; if (box.innerHTML) { box.innerHTML = ''; return; }
    var c = commentaryFor(cur.book + '.' + cur.ch, null);
    box.innerHTML = '<div class="card"><div class="eyebrow">Historical context · ' + h(b.name) + '</div><dl class="facts"><dt>Type of writing</dt><dd>' + h(info.g) + '</dd><dt>Author</dt><dd>' + h(info.a) + '</dd><dt>When and where</dt><dd>' + h(info.w) + '</dd><dt>What it is</dt><dd>' + h(info.s) + '</dd></dl><p class="small">Authorship and dating are traditional attributions or commonly discussed ranges; scholars differ.</p></div>' + (c ? '<div class="comm"><b>' + h(c.title) + '.</b> ' + h(c.mean) + '</div>' : '');
  };

  /* audio Bible */
  App.acts.listench = function () {
    var b = Bible.byId[cur.book], key = cur.book + '.' + cur.ch, tpl = O.CFG.audio && O.CFG.audio.chapterUrlTemplate;
    Store.touch();
    if (tpl) { Voice.play(b.name + ' ' + cur.ch, [], { url: tpl.replace('{book}', cur.book).replace('{chapter}', cur.ch).replace('{bookName}', encodeURIComponent(b.name)), persona: 'reader' }); return; }
    var vs = Bible.verses(key), start = sel.length ? Math.min.apply(null, sel) - 1 : 0, segs = vs.map(function (v) { return { id: v.n, text: v.t }; });
    var from = 0, cnt = 0; segs.forEach(function (sg, i) { if (i < start) cnt++; }); /* start index in chunk space */
    var idx = 0; segs.forEach(function (sg) { if (sg.id < start + 1) idx += O.chunk(sg.text).length; });
    Voice.play(b.name + ' chapter ' + cur.ch, segs, { persona: 'reader', start: idx, onseg: function (id) { document.querySelectorAll('.v.speak').forEach(function (e) { e.classList.remove('speak'); }); if (id) { var e = document.getElementById('v' + id); if (e) { e.classList.add('speak'); var r = e.getBoundingClientRect(); if (r.top < 90 || r.bottom > innerHeight - 160) e.scrollIntoView({ block: 'center', behavior: Store.s.prefs.nomo ? 'auto' : 'smooth' }); } } }, onend: function () { App.toast('End of chapter'); } });
  };

  /* verse selection + action sheet */
  App.acts.vsel = function (el) {
    var n = +el.dataset.n, i = sel.indexOf(n); i > -1 ? sel.splice(i, 1) : sel.push(n); sel.sort(function (a, b) { return a - b; });
    el.classList.toggle('sel'); drawSheet();
  };
  document.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('v')) { e.preventDefault(); App.acts.vsel(e.target); } });
  App.acts.clearSel = function () { sel = []; document.querySelectorAll('.v.sel').forEach(function (e) { e.classList.remove('sel'); }); var s = document.getElementById('sheet'); if (s) s.remove(); };
  function selRef() { if (!sel.length) return null; var a = sel[0], z = sel[sel.length - 1]; return cur.book + '.' + cur.ch + '.' + a + (z !== a ? '-' + z : ''); }
  function drawSheet() {
    var old = document.getElementById('sheet'); if (old) old.remove(); if (!sel.length) return;
    var ref = selRef(), s = Store.s, first = cur.book + '.' + cur.ch + '.' + sel[0], isBm = s.bookmarks.indexOf(first) > -1, d = document.createElement('div'); d.id = 'sheet'; d.className = 'sheet'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Verse actions');
    d.innerHTML = '<div class="q"><span class="attrib">' + h(Bible.label(ref)) + '</span> ' + h(Bible.text(ref)) + '</div><div class="row">' + [1, 2, 3, 4].map(function (c) { return '<button class="btn sm" data-act="hl" data-c="' + c + '" style="background:var(--hl' + c + ')" aria-label="Highlight colour ' + c + '">' + ic('hl', 14) + '</button>'; }).join('') + '<button class="btn sm" data-act="hl" data-c="0" aria-label="Remove highlight">' + ic('x', 14) + '</button><button class="btn sm" data-act="bm">' + ic('bm', 14) + ' ' + (isBm ? 'Unbookmark' : 'Bookmark') + '</button><button class="btn sm" data-act="note">' + ic('note', 14) + ' Note</button><button class="btn sm" data-act="share">' + ic('share', 14) + ' Share</button><button class="btn sm" data-act="xref">' + ic('link', 14) + ' Cross-refs</button><button class="btn sm pri" data-act="companion">' + ic('ask', 14) + ' Ask</button><button class="btn sm" data-act="listenv">' + ic('play', 14) + ' From here</button><button class="btn sm ico" data-act="clearSel" aria-label="Clear selection">' + ic('x', 14) + '</button></div>';
    document.body.appendChild(d);
  }
  function refreshVerse(n) { var r = cur.book + '.' + cur.ch + '.' + n, e = document.getElementById('v' + n), s = Store.s; if (!e) return; e.classList.remove('h1', 'h2', 'h3', 'h4'); if (s.highlights[r]) e.classList.add('h' + s.highlights[r]); e.classList.toggle('bm', s.bookmarks.indexOf(r) > -1); e.classList.toggle('nt', !!s.notes[r]); }
  App.acts.hl = function (b) { var s = Store.s, c = +b.dataset.c; sel.forEach(function (n) { var r = cur.book + '.' + cur.ch + '.' + n; if (c) s.highlights[r] = c; else delete s.highlights[r]; refreshVerse(n); }); Store.save(); App.announce(c ? 'Highlighted' : 'Highlight removed'); };
  App.acts.bm = function () { var s = Store.s, on = null; sel.forEach(function (n) { var r = cur.book + '.' + cur.ch + '.' + n, i = s.bookmarks.indexOf(r); if (on === null) on = i < 0; if (on && i < 0) s.bookmarks.push(r); else if (!on && i > -1) s.bookmarks.splice(i, 1); refreshVerse(n); }); Store.save(); App.toast(on ? 'Bookmarked' : 'Bookmark removed'); drawSheet(); };
  App.acts.note = function () {
    var first = cur.book + '.' + cur.ch + '.' + sel[0], s = Store.s;
    App.modal('<h2>Note on ' + h(Bible.label(first)) + '</h2><div class="scripture"><p>' + h(Bible.text(first)) + '</p></div><form data-submit="saveNote" data-r="' + first + '"><label for="nt">Your note (private)</label><textarea id="nt" autofocus>' + h(s.notes[first] || '') + '</textarea><p class="row"><button class="btn pri">Save note</button>' + (s.notes[first] ? '<button type="button" class="btn danger" data-act="delNoteM" data-r="' + first + '">Delete</button>' : '') + '</p></form>', { label: 'Note' });
  };
  App.acts.saveNote = function (f) { var r = f.dataset.r, v = f.querySelector('textarea').value.trim(), s = Store.s; if (v) s.notes[r] = v; else delete s.notes[r]; Store.save(); App.closeModal(); refreshVerse(+r.split('.')[2]); App.toast(v ? 'Note saved' : 'Note removed'); };
  App.acts.delNoteM = function (b) { var r = b.dataset.r; delete Store.s.notes[r]; Store.save(); App.closeModal(); refreshVerse(+r.split('.')[2]); App.toast('Note deleted'); };
  App.acts.share = function () {
    var ref = selRef(), text = '“' + Bible.text(ref) + '”\n— ' + Bible.attribution(ref) + '\nShared from Doctor Orison';
    if (navigator.share) navigator.share({ text: text }).catch(function () { }); else App.copy(text);
  };
  App.acts.listenv = function () { App.acts.listench(); };

  /* cross-references */
  function xrefsFor(ref) {
    var p = Bible.split(ref), out = [], seen = {};
    Object.keys(BK.XREF).forEach(function (k) { var q = Bible.split(k); if (q.book === p.book && q.ch === p.ch && q.v1 >= p.v1 && q.v1 <= p.v2) BK.XREF[k].forEach(function (r) { if (!seen[r]) { seen[r] = 1; out.push(r); } }); });
    return out;
  }
  function topicRefs(ref) { var p = Bible.split(ref), out = [], seen = {}; BK.TOPICS.forEach(function (t) { var hit = t.refs.some(function (r) { var q = Bible.split(r); return q.book === p.book && q.ch === p.ch && (!q.v1 || (q.v1 <= (p.v2 || 999) && q.v2 >= (p.v1 || 0))); }); if (hit) t.refs.forEach(function (r) { if (!seen[r] && r.indexOf(p.book + '.' + p.ch) !== 0) { seen[r] = 1; out.push([r, t.t]); } }); }); return out; }
  App.acts.xref = function () {
    var ref = selRef(), x = xrefsFor(ref), t = topicRefs(ref);
    App.modal('<h2>Cross-references</h2><div class="scripture"><p>' + h(Bible.text(ref)) + '</p><span class="attrib">' + h(Bible.label(ref)) + '</span></div>' + (x.length ? x.map(function (r) { return App.quote(r, 4); }).join('') : '<p class="small">No curated cross-references are stored for this verse yet. The Vault includes a hand-checked set for well-known passages rather than an automatic list that could be wrong.</p>') + (t.length ? '<h4>Related by topic</h4>' + t.slice(0, 5).map(function (r) { return '<p class="small">' + h(r[1]) + '</p>' + App.quote(r[0], 3); }).join('') : ''), { label: 'Cross references' });
  };

  /* ---------- Bible Companion ---------- */
  function commentaryFor(chRef, vref) {
    var p = Bible.split(vref || chRef), keys = Object.keys(BK.COMMENTARY), hit = null;
    keys.forEach(function (k) { var q = Bible.split(k); if (hit || q.book !== p.book || q.ch !== p.ch) return; if (!q.v1 || !p.v1) hit = BK.COMMENTARY[k]; else if (p.v1 <= q.v2 && p.v2 >= q.v1) hit = BK.COMMENTARY[k]; });
    return hit;
  }
  var GENRE_TIPS = {
    'Gospel': 'Gospels are accounts of Jesus’ life. Ask: who is speaking, who is listening, and what question is being answered?',
    'Letter': 'Letters answer real situations in real churches. Ask: what problem or question is the author responding to?',
    'Pastoral letter': 'Letters answer real situations in real churches. Ask: what problem or question is the author responding to?',
    'Poetry: prayers and songs': 'Psalms are prayers and songs. Ask: is this praise, complaint, trust or confession, and how does the writer’s mood change?',
    'Wisdom sayings': 'Proverbs are general observations, not guarantees. Ask: what does this saying say about how life usually works?',
    'Narrative': 'Stories show rather than tell. Ask: who are the characters, what do they want, and what happens because of their choices?',
    'Historical narrative': 'Historical narrative records what happened and does not always approve of it. Ask: is the author describing or recommending?',
    'Prophecy': 'Prophets spoke to their own time first. Ask: who was being addressed and what was happening to them?'
  };
  function tip(book) { var g = BK.BOOK_INFO[book].g; var k = Object.keys(GENRE_TIPS).filter(function (x) { return g.indexOf(x) === 0 || x.indexOf(g) === 0; })[0]; return GENRE_TIPS[k] || 'Read slowly, read the surrounding verses, and ask who is speaking and to whom.'; }
  function openCompanion(ref, wholeChapter) {
    var p = Bible.split(ref), b = Bible.byId[p.book], label = Bible.label(ref);
    var quote = wholeChapter ? '<div class="scripture"><p>Chapter ' + p.ch + ' of ' + h(b.name) + '. <a href="#/bible/' + p.book + '/' + p.ch + '">Read it</a>.</p></div>' : '<div class="scripture"><p>' + h(Bible.text(ref)) + '</p><span class="attrib">' + h(label) + '</span></div>';
    var qs = [['mean', 'What does this mean?'], ['why', 'Why was it written?'], ['who', 'Who wrote it?'], ['hist', 'What was happening historically?'], ['learn', 'What can I learn from it?'], ['me', 'How does it relate to my circumstances?'], ['rel', 'What related passages should I read?'], ['pray', 'What prayer could accompany this reading?']];
    var m = App.modal('<h2>Bible Companion</h2>' + quote + '<div class="notice"><b class="t">How this works</b>Answers come from written background, commentary and topic notes stored in this app. They are not generated by AI. Scripture is quoted separately from commentary, and commentary is interpretation.</div><div class="row" style="margin-bottom:.8rem">' + qs.map(function (q) { return '<button class="btn sm" data-act="cq" data-q="' + q[0] + '" data-ref="' + ref + '" data-w="' + (wholeChapter ? 1 : 0) + '">' + q[1] + '</button>'; }).join('') + '</div><div id="cans" aria-live="polite"></div>', { label: 'Bible Companion' });
  }
  App.acts.companion = function () { openCompanion(selRef(), false); };
  App.acts.companionCh = function () { openCompanion(cur.book + '.' + cur.ch, true); };
  App.acts.cq = function (b) {
    var ref = b.dataset.ref, whole = b.dataset.w === '1', p = Bible.split(ref), info = BK.BOOK_INFO[p.book], bk = Bible.byId[p.book], out = document.getElementById('cans'), c = commentaryFor(p.book + '.' + p.ch, whole ? null : ref), q = b.dataset.q, h2 = '';
    var cm = function (t) { return '<div class="comm"><p>' + t + '</p></div>'; };
    if (q === 'mean') h2 = c ? cm('<b>' + h(c.title) + '.</b> ' + h(c.mean)) : cm('No written commentary for this exact passage yet. A reliable way to start: read the whole paragraph and the verses before and after, work out who is speaking and to whom, and ask what the passage meant to its first readers. ' + h(tip(p.book)));
    if (q === 'why') h2 = (c ? cm('<b>Why this passage:</b> ' + h(c.why)) : '') + cm('<b>Why ' + h(bk.name) + ' was written:</b> ' + h(info.s));
    if (q === 'who') h2 = (c ? cm('<b>This passage:</b> ' + h(c.who)) : '') + cm('<b>The book:</b> ' + h(info.a) + '. Authorship and dating are traditional attributions or commonly discussed ranges; scholars differ.');
    if (q === 'hist') h2 = cm('<b>' + h(bk.name) + ':</b> ' + h(info.w) + '. Type of writing: ' + h(info.g) + '.');
    if (q === 'learn') h2 = c ? cm('<b>To take away:</b> ' + h(c.learn)) : cm('<b>Reading tip:</b> ' + h(tip(p.book)) + ' Then ask: what does this passage say about God, about people, and about how to live?');
    if (q === 'me') h2 = '<form data-submit="cme" data-ref="' + ref + '"><label for="cmt">In a sentence, what are you going through? (matched to topics by keyword; nothing is uploaded)</label><input id="cmt" type="text" maxlength="160" placeholder="For example: I am worried about money"><p><button class="btn sm pri">Find guidance</button></p></form><div id="cme"></div>';
    if (q === 'rel') { var x = xrefsFor(whole ? p.book + '.' + p.ch + '.1-' + bk.c[p.ch - 1].length : ref), t = topicRefs(whole ? p.book + '.' + p.ch : ref); h2 = (x.length ? '<h4>Cross-references</h4>' + x.map(function (r) { return App.quote(r, 4); }).join('') : '') + (t.length ? '<h4>Related by topic</h4>' + t.slice(0, 4).map(function (r) { return '<p class="small">' + h(r[1]) + '</p>' + App.quote(r[0], 3); }).join('') : '') || '<p class="small">No curated related passages are stored here yet. Try the Topics tab in the Bible Vault.</p>'; }
    if (q === 'pray') { var t2 = topicRefs(ref)[0], pr = null; if (t2) { var map = { 'Worry and anxiety': 'p-peace', 'Fear and courage': 'p-fear', 'Grief and loss': 'p-grief', 'Forgiveness': 'p-forgive', 'Gratitude': 'p-thanks', 'Guidance and direction': 'p-wisdom', 'Family': 'p-family', 'Starting again': 'p-start' }; pr = window.OrisonPrayers.PRAYER_LIBRARY.filter(function (x) { return x.id === map[t2[1]]; })[0]; } var txt = pr ? pr.text : 'God, as I read ' + Bible.label(ref) + ', help me to understand it honestly. Show me what is true here, and how to live it today. Amen.'; h2 = '<div class="card"><p>' + h(txt) + '</p>' + App.listenBtn('Listen', App.regAudio('cp', 'Prayer with ' + Bible.label(ref), txt, 'prayer'), 'prayer', true) + '</div><p class="small">' + (pr ? 'A prayer matched to a related topic from the Prayer Chamber library.' : 'A simple template prayer. See the Prayer Chamber for lessons on praying in your own words.') + '</p>'; }
    out.innerHTML = h2;
  };
  App.acts.cme = function (f) {
    var t = f.querySelector('input').value.toLowerCase(), ref = f.dataset.ref, hit = BK.TOPICS.filter(function (x) { return x.k.some(function (k) { return t.indexOf(k) > -1; }); }), box = document.getElementById('cme');
    if (!t.trim()) { box.innerHTML = ''; return; }
    if (!hit.length) { box.innerHTML = '<p class="small">I could not match that to a topic. Try words such as worry, fear, grief, money, work, forgiveness, lonely, guidance, peace, family, hope or starting again.</p>'; return; }
    box.innerHTML = '<div class="comm"><p>Matched by keyword to: <b>' + hit.map(function (x) { return h(x.t); }).join(', ') + '</b>. These passages are offered as company for your situation, not as a promise about outcomes. If the situation involves danger, abuse or crisis, please contact people or services who can help in practice.</p></div>' + hit[0].refs.slice(0, 3).map(function (r) { return App.quote(r, 4); }).join('') + '<p><a class="btn sm" href="#/bible/topics/' + hit[0].id + '">More on ' + h(hit[0].t) + '</a></p>';
  };
})();
