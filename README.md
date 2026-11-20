# Doctor Orison: The Archive of Spiritual Knowledge

Phase 1 build. An independent app, not connected to any other brand.

**Understand the Word. Honour the roots. Cultivate the mind. Build the future.**

## What works now (Phase 1)

| Department | Status |
|---|---|
| Home (entrance, daily scripture/reflection/prayer, continue reading, journey, search, audio shortcut, saved) | working |
| I. Bible Vault: all 66 books, World English Bible (public domain), chapter navigation, verse search, reference search ("1 cor 13:4"), topics, people and events, bookmarks, 4-colour highlights, notes, history, reading plans, chapter completion, text size, dark and parchment modes, audio, sharing with attribution, cross-references (hand-checked set), biblical dictionary, historical context, Bible Companion | working |
| II. Prayer Chamber: 12 lessons, 12-prayer library, write your own prayers, record and play back (stored only in the browser) | working |
| IV. Botanical Archive: 54 ingredient profiles, categories, source filters, safety-first profiles, engraved plates, save | working |
| X. Daily Path: scripture, prayer, intention, botanical of the day, lesson, evening reflection, gratitude journal, routines, gentle streaks (never shaming), optional reminders | working |
| Global search with the five knowledge-source filters | working |
| Listening room, three voice personalities, voice and accent choice | working (see Audio) |
| My Archive: progress, saved items, notes, history, accessibility, privacy, data export, delete | working |
| Optional accounts, cloud sync, account deletion, editors' CMS with review workflow | **written, not yet tested against a live Supabase project** |

Not built yet, and deliberately not in the navigation: Ancestral Archive (III), Ritual and Cleansing Chamber (V), Fortune Archive (VI), Wealth Doctrine (VII), Protection and Peace Library (VIII), Trials of Life and the Situation-to-Guidance engine (IX), plant identification from photos, advanced audio and personal journeys (Phase 2 and 3).

## Files (flat: everything in one folder, no subfolders)

```
index.html  styles.css  config.js  start.js  sw.js  manifest.webmanifest
app.js  core.js  art.js  views-bible.js  views-prayer.js  views-archive.js  cms.js
data-books.js  data-prayers.js  data-ingredients.js  bible-web.json
orison-icon.svg  orison-icon-maskable.svg  icon-192.png  icon-512.png  icon-maskable-512.png  apple-touch-icon.png
supabase-schema.sql  README.md
```

## Deploy on GitHub Pages (web upload)

1. Create a repository. Upload **all files in this folder** with "Add file → Upload files". Keep them in the repository root. There are no subfolders to lose.
2. Settings → Pages → Deploy from branch → main / root.
3. Open the Pages URL. The app must be served over http(s). Opening `index.html` as a file will not load the Bible text (the app says so).
4. After changing any file later, bump `VERSION` in `sw.js` so installed copies refresh.

## Optional: accounts, sync and the editors' area (Supabase)

Without this the app is fully local: data stays in the browser and nothing is uploaded.

1. Create a free project at supabase.com.
2. SQL editor → paste and run `supabase-schema.sql`.
3. Project settings → API: copy the **Project URL** and the **anon public key** into `config.js` (`supabaseUrl`, `supabaseAnonKey`). The anon key is meant to be public. Never put the `service_role` key anywhere in this folder.
4. Authentication → URL configuration: add your Pages URL as the site URL and redirect URL.
5. Make yourself an admin (SQL editor): `update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');`
6. Roles: `user` (default), `editor` (drafts and submits), `reviewer` (publishes), `admin` (everything). The database refuses to publish ingredient, safety or practice records without a reference, ingredient records without a safety statement, and authors publishing their own records (unless admin).

What is synced: notes, bookmarks, highlights, progress, journal, prayers you wrote, settings. Voice recordings are never uploaded. Sync merges both sides (lists are combined, the newer side wins conflicts). Account deletion removes the account and cloud rows.

**Be aware:** this Supabase code and SQL were written carefully but have not been run against a real project yet. Test sign-up, sync, account deletion and the editor workflow first and report anything that fails.

## Audio

- Default: speech synthesis built into the browser or device, always labelled "Synthetic voice, not a human recording". Quality depends on the voices installed on the device. Natural or neural voices (for example "Natural" voices in Microsoft Edge, Enhanced voices on iOS and macOS, Google voices on Android) sound far more human than basic ones. The Listening Room reports what is available.
- Three personalities (The Guide, The Scripture Reader, The Prayer Companion) differ in pace, pitch and pauses. Each can be given a different installed voice. The accent setting prefers African English (en-ZA, en-NG, en-KE and similar) when the device has one, otherwise the closest voice.
- Bible names get a best-effort respelling for speech (for example Yahweh, Habakkuk, Melchizedek). The text on screen is never changed.
- Pause, resume, previous and next verse, seek, and 0.75 to 1.5 times speed work. Verses highlight as they are read.
- Background playback on a locked phone is not reliable with speech synthesis. It works when recorded audio files are used.
- **Recorded human narration:** set `audio.chapterUrlTemplate` in `config.js`, for example `https://your-cdn.example/audio/{book}/{chapter}.mp3`. The reader then streams those recordings with real seeking and speed control. Only use audio you have the right to publish. Downloadable audio should only be offered where the licence allows it.
- Not included: a paid neural voice provider. If you want one, it needs a provider account and key (and ideally a small server so the key stays private).

## Content rules built in

- Scripture is always shown in a gold-ruled block, quoted live from the World English Bible. Commentary is shown in a dashed block and marked as interpretation. Cultural belief is marked "Belief". Science is marked with its strength.
- No prayer, ingredient or ritual is presented as guaranteeing money, luck, protection or the removal of a curse.
- Ingredient records are **author drafts awaiting review by a botanist and by knowledgeable cultural contributors**. Each profile says so. Regional names are included only where well attested; an empty list means "not verified yet". Please have the safety and cultural content checked before public launch.
- Only the World English Bible is included. Other translations require permission.

## Photographs

Each ingredient has an original engraved **schematic plate** showing the type of plant part. It is not a species-accurate botanical plate. Real photographs are never guessed or hotlinked blindly. An editor adds a record of type `photo` (title equal to the ingredient name, image URL, licence in the description) and it appears on the profile. Until then the slot says no photograph is attached.

## Backup strategy

- Users: Settings → Download my data (JSON), any time.
- Supabase: enable the project's daily backups (paid plans) or run `pg_dump` on a schedule against the database connection string. Export the `content_records` table regularly as CSV or JSON, since that is editorial work.
- Source files: keep this folder in a GitHub repository (history is the backup).

## Accessibility and performance

Skip link, labelled controls, keyboard operation (verses open with Enter or Space), focus management on page change, screen-reader announcements, high-contrast mode, wider-spacing mode, reduce-motion setting plus the device setting, responsive layout from phone to desktop. The Bible JSON (4 MB) loads once and is cached for offline use. The animated sphere pauses when off-screen or when the tab is hidden.

## Known limits

- Speech cannot be tested in a headless browser; verify it on a real phone and desktop.
- Not tested on physical iPhone or Android devices.
- Bible text is flattened to verses, so original paragraph breaks are not shown (the "Lines" toggle shows one verse per line).
- Cross-references and commentary cover well-known passages only; the app says so when none exist instead of guessing.
