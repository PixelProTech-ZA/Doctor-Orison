/* Doctor Orison — Department IV: The Botanical and Ingredient Archive. */
(function () {
  'use strict';
  var O = window.Orison, A = window.OrisonArt, App = window.App, Store = O.Store, Bible = O.Bible, h = O.esc, IG = window.OrisonIngredients, ic = A.icon;
  var REVIEWED = 'Author draft (Nov 2026), not yet reviewed by a botanist or cultural expert';

  App.route('archive', function (el, a, qs) {
    if (a[0] === 'rec') return recView(el, a[1]);
    if (a[0]) return profile(el, a[0], a[1]);
    var cat = qs.c || 'All', q = (qs.q || '').toLowerCase(), src = qs.s || '';
    var list = IG.ITEMS.filter(function (i) {
      if (cat !== 'All' && i.cat !== cat) return false; if (src && App.ingTags(i).indexOf(src) < 0) return false;
      if (!q) return true; return (i.n + ' ' + i.sci + ' ' + i.cat + ' ' + (i.names || []).map(function (n) { return n[0]; }).join(' ')).toLowerCase().indexOf(q) > -1;
    });
    var q2 = function (o) { var m = { c: cat, q: qs.q || '', s: src }; for (var k in o) m[k] = o[k]; var u = 'archive?c=' + encodeURIComponent(m.c); if (m.q) u += '&q=' + encodeURIComponent(m.q); if (m.s) u += '&s=' + m.s; return u; };
    el.innerHTML = '<h1>The Botanical Archive</h1><p>' + IG.ITEMS.length + ' ingredient profiles: spices, leaves, roots, flowers, seeds, fruits, sweeteners, resins, grains, African botanicals and minerals. Every profile separates <b>cultural belief</b>, <b>documented history</b> and <b>modern science</b>, and puts safety first.</p>' +
      '<div class="notice warn"><b class="t">Safety first</b>Never eat, drink or apply a plant you cannot identify with certainty. ' + h(IG.NOTE_GEN) + ' Nothing here claims an ingredient brings money, luck or protection.</div>' +
      '<form class="sbox" role="search" data-submit="asearch"><label class="sr" for="aq">Search ingredients</label><input id="aq" type="search" value="' + h(qs.q || '') + '" placeholder="Search by name, botanical name or category"><button type="submit" aria-label="Search">' + ic('search', 18) + '</button></form>' +
      '<div class="row" style="margin:1rem 0">' + ['All'].concat(IG.CATS).map(function (c) { return '<a class="chip" aria-pressed="' + (c === cat) + '" href="#/' + q2({ c: c }) + '" style="' + (c === cat ? 'background:var(--gold);color:#16130b;border-color:var(--gold)' : '') + '">' + c + '</a>'; }).join('') + '</div>' +
      '<div class="row" style="margin-bottom:1rem"><span class="small">Source:</span>' + Object.keys(App.TAGS).map(function (k) { return '<a class="chip ' + App.TAGS[k][1] + '" href="#/' + q2({ s: src === k ? '' : k }) + '" aria-pressed="' + (src === k) + '" style="' + (src === k ? 'outline:2px solid var(--gold)' : '') + '">' + App.TAGS[k][0] + '</a>'; }).join('') + '</div>' +
      (list.length ? '<div class="grid g2">' + list.map(App.ingCard).join('') + '</div>' : App.empty('No ingredient matches', 'Clear the filters or try another word.')) +
      (App.cms.filter(function (r) { return r.type === 'ingredient'; }).length ? App.rule('Reviewed additions') + '<div class="grid g2">' + App.cms.filter(function (r) { return r.type === 'ingredient'; }).map(function (r) { return '<a class="card" href="#/archive/rec/' + r.id + '"><h3>' + h(r.title) + '</h3><p class="small">' + h((r.description || '').slice(0, 120)) + '</p></a>'; }).join('') + '</div>' : '');
  });
  App.acts.asearch = function (f) { App.go('archive?q=' + encodeURIComponent(f.querySelector('input').value.trim())); };

  function profile(el, id, tab) {
    var i = IG.ITEMS.filter(function (x) { return x.id === id; })[0], idx = IG.ITEMS.indexOf(i);
    if (!i) { el.innerHTML = '<h1>Not found</h1><a class="btn" href="#/archive">Back to the Archive</a>'; return; }
    tab = tab || 'overview'; Store.touch();
    var saved = Store.s.savedIng.indexOf(i.id) > -1, tabs = [['overview', 'Overview'], ['culture', 'Culture & history'], ['use', 'Use & preparation'], ['safety', 'Safety'], ['sources', 'Sources']];
    var names = (i.names && i.names.length) ? '<ul style="margin:0;padding-left:1.1rem">' + i.names.map(function (n) { return '<li><b>' + h(n[0]) + '</b> <span class="small">' + h(n[1]) + '</span></li>'; }).join('') + '</ul>' : '<span class="small">None verified yet. Regional names are added only when well attested; editors can contribute them.</span>';
    var summary = i.n + '. ' + i.sci.split(/[;(]/)[0] + '. Part used: ' + i.part + ' Safety: ' + i.tox;
    var body = '';
    if (tab === 'overview') body = '<dl class="facts"><dt>Botanical name</dt><dd><i>' + h(i.sci) + '</i></dd><dt>Common and regional names</dt><dd>' + h(i.n) + (i.names && i.names.length ? '' : '') + names + '</dd><dt>How to identify it</dt><dd>' + h(i.idn) + '</dd><dt>Part used</dt><dd>' + h(i.part) + '</dd><dt>Where it grows</dt><dd>' + h(i.where) + '</dd><dt>Where to buy it</dt><dd>' + h(i.buy) + '</dd><dt>Can it be cultivated?</dt><dd>' + h(i.grow) + '</dd><dt>Environmental and harvesting notes</dt><dd>' + h(i.env) + '</dd></dl>';
    if (tab === 'culture') {
      body = (i.culture || []).map(function (c) { return '<div class="cult"><div class="lab">' + h(c[0]) + '</div><p style="margin:.2rem 0">' + h(c[1]) + '</p></div>'; }).join('') + '<h4 style="margin-top:1rem">Historical background</h4><p>' + h(i.hist) + '</p><h4>In the Bible</h4><p>' + h(i.bible.note) + '</p><div id="bq">' + (i.bible.refs.length ? App.loading('Loading scripture…') : '') + '</div><div class="notice"><b class="t">How to read this tab</b>“Belief” entries describe what some people believe. They are not facts and they are not promises. Nothing in this archive says an ingredient or ritual attracts money, luck or protection.</div>';
    }
    if (tab === 'use') body = '<dl class="facts"><dt>Culinary uses</dt><dd>' + h(i.cook) + '</dd><dt>Documented traditional preparation</dt><dd>' + h(i.prep) + '</dd><dt>Bathing and external use</dt><dd>' + h(i.ext) + '</dd><dt>' + h(i.ev[0]) + '</dt><dd>' + h(i.ev[1]) + '</dd></dl>';
    if (tab === 'safety') body = '<div class="notice warn"><b class="t">Toxicity and allergy</b>' + h(i.tox) + '</div><dl class="facts"><dt>Skin safety</dt><dd>' + h(i.skin) + '</dd><dt>Consumption safety</dt><dd>' + h(i.eat) + '</dd><dt>Pregnancy and medication</dt><dd>' + h(i.preg) + '</dd></dl><div class="notice"><b class="t">Always</b>' + h(IG.NOTE_GEN) + ' Never use a wild plant based on a picture or a name alone.</div>';
    if (tab === 'sources') body = '<ul>' + i.src.map(function (s) { return '<li>' + h(s) + '</li>'; }).join('') + '</ul><p class="small">Last reviewed: ' + REVIEWED + '. Botanical safety claims in this archive should be checked against these sources, and records are upgraded to “reviewed” only through the editors’ workflow.</p>';
    el.innerHTML = '<p class="small"><a href="#/archive">The Botanical Archive</a> › ' + h(i.cat) + '</p><div class="row sp"><h1><span class="emo" aria-hidden="true">' + i.e + '</span> ' + h(i.n) + '</h1><div class="row"><button class="btn sm" data-act="ising" data-id="' + i.id + '" aria-pressed="' + saved + '">' + ic('bm', 14) + ' ' + (saved ? 'Saved' : 'Save') + '</button>' + App.listenBtn('Listen', App.regAudio('ia' + i.id, i.n, summary, 'guide'), 'guide', true) + '</div></div><p style="font-style:italic;color:var(--ink2)">' + h(i.sci) + '</p><div style="margin-bottom:1rem">' + App.tagChips(App.ingTags(i)) + '</div>' +
      '<div class="notice warn"><b class="t">Safety summary</b>' + h(i.tox) + '</div>' +
      '<div class="ing"><div><div class="plate">' + A.plate(i, idx) + '</div><p class="small" style="margin:.4rem 0">Schematic engraving of the type of plant part. Not a species-accurate plate.</p>' + photo(i) + '</div><div><div class="tabs" role="tablist">' + tabs.map(function (t) { return '<button role="tab" aria-selected="' + (t[0] === tab) + '" data-act="itab" data-id="' + i.id + '" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' + body + '</div></div>';
    if (tab === 'culture' && i.bible.refs.length) Bible.load().then(function () { var q = el.querySelector('#bq'); if (q && App.el === el) q.innerHTML = i.bible.refs.slice(0, 4).map(function (r) { return App.quote(r, 3); }).join(''); }).catch(function () { var q = el.querySelector('#bq'); if (q) q.innerHTML = '<p class="small">Scripture text could not load.</p>'; });
  }
  function photo(i) {
    var rec = App.cms.filter(function (r) { return r.type === 'photo' && r.title && r.title.toLowerCase() === i.n.toLowerCase() && r.image_url; })[0];
    if (rec) return '<div class="photo" style="padding:0"><img src="' + h(rec.image_url) + '" alt="Photograph of ' + h(i.n) + '" loading="lazy" onerror="this.parentNode.textContent=\'Photograph could not be loaded.\'"></div><p class="small">Photograph attached by editors. ' + h(rec.description || '') + '</p>';
    return '<div class="photo" role="img" aria-label="No photograph attached yet"><span>Photograph: none attached yet.<br>A real photograph is shown only once an editor attaches a verified, correctly licensed image for ' + h(i.n) + '.</span></div>';
  }
  App.acts.ising = function (b) { var s = Store.s.savedIng, i = s.indexOf(b.dataset.id); if (i > -1) s.splice(i, 1); else s.push(b.dataset.id); Store.save(); b.innerHTML = ic('bm', 14) + ' ' + (i > -1 ? 'Save' : 'Saved'); App.toast(i > -1 ? 'Removed' : 'Saved to My Archive'); };
  App.acts.itab = function (b) { App.go('archive/' + b.dataset.id + '/' + b.dataset.t); };

  function recView(el, id) {
    var r = App.cms.filter(function (x) { return String(x.id) === id; })[0];
    if (!r) { el.innerHTML = '<h1>Not found</h1><a class="btn" href="#/archive">Back</a>'; return; }
    el.innerHTML = '<p class="small"><a href="#/archive">The Botanical Archive</a> › Reviewed addition</p><h1>' + h(r.title) + '</h1><p>' + App.tagChips([r.source].filter(function (s) { return App.TAGS[s]; })) + ' <span class="chip">' + h(r.type) + '</span></p><p>' + h(r.description || '') + '</p>' + (r.safety ? '<div class="notice warn"><b class="t">Safety</b>' + h(r.safety) + '</div>' : '') + (r.image_url ? '<img src="' + h(r.image_url) + '" alt="' + h(r.title) + '" style="max-width:100%">' : '') + (r.audio_url ? '<audio controls src="' + h(r.audio_url) + '" style="width:100%"></audio>' : '') + '<p class="small">Evidence: ' + h(r.evidence || 'not classified') + ' · Last reviewed ' + h(r.last_reviewed || 'unknown') + (r.refs && r.refs.length ? '<br>References: ' + r.refs.map(h).join('; ') : '') + '</p>';
  }
})();
