/* Doctor Orison — editors' area (content management with editorial review).
   Needs the Supabase backend (config.js + supabase-schema.sql). Roles: user, editor, reviewer, admin.
   Editors draft and submit. Reviewers and admins publish. The database enforces the rules too (see schema triggers). */
(function () {
  'use strict';
  var O = window.Orison, A = window.OrisonArt, App = window.App, Cloud = O.Cloud, h = O.esc, ic = A.icon;
  var TYPES = [['ingredient', 'Ingredient / botanical record'], ['prayer', 'Prayer'], ['lesson', 'Lesson'], ['practice', 'Traditional practice'], ['cultural', 'Cultural reference'], ['commentary', 'Scripture commentary'], ['bible_meta', 'Bible metadata / licensed translation note'], ['photo', 'Photograph (title must match the ingredient name)'], ['audio', 'Audio file'], ['safety', 'Safety notice']];
  var EVID = ['Scripture', 'Documented history', 'Cultural belief', 'Scientific: strong', 'Scientific: limited', 'Scientific: none / unsupported', 'Editorial'];
  var cache = [], filter = 'all';
  function can(role) { return Cloud.role === 'reviewer' || Cloud.role === 'admin' || (role === 'edit' && Cloud.role === 'editor'); }

  App.route('cms', function (el, a) {
    var gate = function (title, body) { el.innerHTML = '<h1>Editors’ area</h1><div class="notice"><b class="t">' + h(title) + '</b>' + body + '</div>'; };
    if (!Cloud.configured) return gate('Not configured', 'The editors’ area needs the Supabase backend. Add the project URL and anon key to <b>config.js</b> and run <b>supabase-schema.sql</b>. See README.');
    if (!Cloud.client) return gate('Connecting', 'The account service is still loading. Reopen this page in a moment.');
    if (!Cloud.user) return gate('Sign in required', '<a href="#/account">Sign in</a> with an editor account.');
    if (Cloud.role === 'user') return gate('No editor access', 'Your account does not have an editor role. An administrator sets this in the <b>profiles</b> table (see README).');
    if (a[0] === 'edit') return form(el, a[1]);
    el.innerHTML = '<h1>Editors’ area</h1><p class="small">Role: <b>' + h(Cloud.role) + '</b>. Draft → In review → Published. Botanical and safety records need at least one qualified source and a safety statement before they can go to review. Cultural content should be reviewed by knowledgeable contributors before publishing. Authors cannot publish their own records unless they are administrators.</p><div class="row sp"><div class="row">' + ['all', 'draft', 'in_review', 'published'].map(function (s) { return '<button class="chip" aria-pressed="' + (filter === s) + '" data-act="cfilter" data-s="' + s + '">' + s.replace('_', ' ') + '</button>'; }).join('') + '</div><a class="btn pri" href="#/cms/edit/new">' + ic('plus', 14) + ' New record</a></div><div id="cl">' + App.loading('Loading records…') + '</div>';
    Cloud.records().then(function (r) { if (App.el !== el) return; if (r.error) throw r.error; cache = r.data || []; var l = el.querySelector('#cl'), list = cache.filter(function (x) { return filter === 'all' || x.status === filter; }); l.innerHTML = list.length ? '<div class="grid g2">' + list.map(function (x) { return '<a class="card" href="#/cms/edit/' + x.id + '"><div class="eyebrow">' + h(x.type) + ' · ' + h(x.status.replace('_', ' ')) + '</div><h3>' + h(x.title) + '</h3><p class="small">Updated ' + new Date(x.updated_at).toLocaleDateString() + '</p></a>'; }).join('') + '</div>' : App.empty('No records here yet'); }).catch(function (e) { var l = el.querySelector('#cl'); if (l) l.innerHTML = App.error('Could not load records: ' + e.message, true); });
  });
  App.acts.cfilter = function (b) { filter = b.dataset.s; App.render(); };

  function form(el, id) {
    var go = function (r) {
      var isNew = !r; r = r || { type: 'ingredient', status: 'draft', refs: [], source: 'BIB' };
      var mine = isNew || r.created_by === Cloud.user.id, locked = !can('review') && r.status === 'published';
      el.innerHTML = '<p class="small"><a href="#/cms">Editors’ area</a> › ' + (isNew ? 'New record' : h(r.title)) + '</p><h1>' + (isNew ? 'New record' : 'Edit record') + '</h1><p class="small">Status: <b>' + h(r.status) + '</b></p>' + (locked ? '<div class="notice warn"><b class="t">Published</b>Only reviewers and admins can change published records.</div>' : '') +
        '<form class="card" data-submit="csave" data-id="' + (r.id || '') + '"><label for="f-type">Type</label><select id="f-type">' + TYPES.map(function (t) { return '<option value="' + t[0] + '"' + (r.type === t[0] ? ' selected' : '') + '>' + t[1] + '</option>'; }).join('') + '</select>' +
        '<label for="f-title">Title</label><input id="f-title" type="text" required value="' + h(r.title || '') + '"><label for="f-cat">Category</label><input id="f-cat" type="text" value="' + h(r.category || '') + '" placeholder="e.g. Spices, Leaves, Prayer for peace">' +
        '<label for="f-src">Knowledge source</label><select id="f-src">' + Object.keys(App.TAGS).map(function (k) { return '<option value="' + k + '"' + (r.source === k ? ' selected' : '') + '>' + App.TAGS[k][0] + '</option>'; }).join('') + '</select>' +
        '<label for="f-desc">Description</label><textarea id="f-desc" style="min-height:9rem">' + h(r.description || '') + '</textarea>' +
        '<label for="f-ev">Evidence classification</label><select id="f-ev">' + EVID.map(function (e) { return '<option' + (r.evidence === e ? ' selected' : '') + '>' + e + '</option>'; }).join('') + '</select>' +
        '<label for="f-refs">References (one per line: qualified sources, scripture references, or publications)</label><textarea id="f-refs">' + h((r.refs || []).join('\n')) + '</textarea>' +
        '<label for="f-img">Image URL (verified and licensed only)</label><input id="f-img" type="url" value="' + h(r.image_url || '') + '"><label for="f-aud">Audio URL (licensed or recorded narration)</label><input id="f-aud" type="url" value="' + h(r.audio_url || '') + '">' +
        '<label for="f-saf">Safety information</label><textarea id="f-saf">' + h(r.safety || '') + '</textarea><label for="f-rev">Last reviewed date</label><input id="f-rev" type="date" value="' + h(r.last_reviewed || '') + '">' +
        '<div id="fe"></div><p class="row" style="margin-top:1rem">' + (locked ? '' : '<button class="btn" data-st="draft">Save draft</button><button class="btn" data-st="in_review">Submit for review</button>') + (can('review') ? '<button class="btn pri" data-st="published">Publish</button>' : '') + (!isNew && (Cloud.role === 'admin' || (mine && r.status === 'draft')) ? '<button type="button" class="btn danger" data-act="cdel" data-id="' + r.id + '">Delete</button>' : '') + '</p></form>';
      el.querySelector('form').addEventListener('click', function (e) { var b = e.target.closest('[data-st]'); if (b) el.querySelector('form').dataset.st = b.dataset.st; });
    };
    if (id === 'new') return go(null);
    var hit = cache.filter(function (x) { return String(x.id) === id; })[0]; if (hit) return go(hit);
    el.innerHTML = App.loading(); Cloud.client.from('content_records').select('*').eq('id', id).single().then(function (r) { if (r.error) el.innerHTML = '<h1>Not found</h1>' + App.error(r.error.message); else go(r.data); });
  }
  App.acts.csave = function (f) {
    var g = function (i) { return f.querySelector('#f-' + i).value.trim(); }, st = f.dataset.st || 'draft', err = document.getElementById('fe'), refs = g('refs').split('\n').map(function (x) { return x.trim(); }).filter(Boolean), type = g('type');
    var rec = { type: type, title: g('title'), category: g('cat'), source: g('src'), description: g('desc'), evidence: g('ev'), refs: refs, image_url: g('img') || null, audio_url: g('aud') || null, safety: g('saf'), last_reviewed: g('rev') || null, status: st };
    if (f.dataset.id) rec.id = f.dataset.id; else rec.created_by = Cloud.user.id;
    var need = []; if (st !== 'draft') { if (['ingredient', 'safety', 'practice'].indexOf(type) > -1 && !refs.length) need.push('at least one qualified reference'); if (type === 'ingredient' && !rec.safety) need.push('a safety statement'); if (!rec.description) need.push('a description'); if (st === 'published' && !rec.last_reviewed) need.push('a last-reviewed date'); }
    if (need.length) { err.innerHTML = App.error('Before this can go forward it needs ' + need.join(', ') + '.'); return; }
    if (st === 'published') { rec.reviewer_id = Cloud.user.id; }
    Cloud.saveRecord(rec).then(function (r) { if (r.error) throw r.error; App.toast(st === 'published' ? 'Published' : st === 'in_review' ? 'Submitted for review' : 'Draft saved'); App.cms = []; Cloud.records('published').then(function (x) { if (x.data) App.cms = x.data; }); App.go('cms'); }).catch(function (e) { err.innerHTML = App.error('Could not save: ' + e.message); });
  };
  App.acts.cdel = function (b) { App.modal('<h2>Delete this record?</h2><p>This cannot be undone.</p><div class="row"><button class="btn danger" data-act="cdelgo" data-id="' + b.dataset.id + '">Delete</button><button class="btn" data-act="closeModal">Cancel</button></div>'); };
  App.acts.cdelgo = function (b) { Cloud.deleteRecord(b.dataset.id).then(function (r) { App.closeModal(); if (r.error) App.toast('Could not delete: ' + r.error.message); else { App.toast('Deleted'); App.go('cms'); } }); };
})();
