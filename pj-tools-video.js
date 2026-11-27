/* Video Editor tool – runs 100% in the browser (nothing is uploaded).
   Trim, speed, rotate, resize, colour filters, mute, save a frame as PNG, export to a new video file.
   Load AFTER pj-tools-pdf.js and BEFORE pj-tools-app.js. */
(function () {
  if (typeof TOOLS === 'undefined' || !Array.isArray(TOOLS)) return;
  if (TOOLS.some(function (t) { return t.id === 'video-editor'; })) return;

  var NAME = 'Video Editor';
  var DESC = 'Trim, speed up or slow down, rotate, resize, add filters and export your video – plus learn editing like CapCut, VN, Premiere Pro. Free, in your browser.';
  var ICON = '🎬';

  /* Build the tool entry by mirroring the fields an existing tool already has,
     so it fits whatever structure the hub's core file uses. */
  var tpl = TOOLS.find(function (t) { return t.id === 'excel-formulas'; }) || TOOLS[0] || {};
  var tool = { id: 'video-editor', name: NAME, title: NAME, desc: DESC, icon: ICON };
  Object.keys(tpl).forEach(function (k) {
    var v = tpl[k];
    if (k === 'id' || k === 'render') return;
    if (typeof v === 'string') {
      if (/^(name|title|label)$/i.test(k)) tool[k] = NAME;
      else if (/desc|sub|summary/i.test(k)) tool[k] = DESC;
      else if (/ico|emoji/i.test(k)) tool[k] = ICON;
      else if (/tag|keyword|search/i.test(k)) tool[k] = 'video editor trim cut speed rotate resize filter mute mp4 webm frame ' + v;
      else tool[k] = v;
    } else if (Array.isArray(v) && v.every(function (x) { return typeof x === 'string'; })) {
      tool[k] = /tag|keyword|search/i.test(k) ? ['video', 'editor', 'trim', 'cut', 'speed', 'rotate', 'resize', 'filter', 'mp4', 'webm'] : v.slice();
    } else if (v !== undefined && typeof v !== 'function' && typeof v !== 'object') {
      tool[k] = v;
    }
  });

  var audioCtx = null, audioSrc = null, audioDest = null, busy = false;

  function fmt(sec) {
    sec = Math.max(0, sec || 0);
    var m = Math.floor(sec / 60), s = (sec % 60).toFixed(1);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function say(msg) { if (typeof toast === 'function') toast(msg); }

  /* ---------- Learn video editing (CapCut, VN, InShot, Premiere Pro, DaVinci Resolve, Filmora) ---------- */
  var BASICS = [
    ['Timeline & tracks', 'The timeline is where your video is built left to right. Video clips sit on the main track; text, stickers, overlays and music go on extra tracks above or below. Zoom the timeline in for frame-accurate cuts.'],
    ['Cut, split & trim', 'Move the playhead to the exact moment, press Split to cut the clip in two, then delete the part you do not want. Trim = drag a clip edge to shorten it. Use the Trim tool in the Edit tab here to practise.'],
    ['Pacing & cuts', 'Reels/Shorts: change the shot every 2-4 seconds. Cut on movement (a hand wave, a head turn) so cuts feel smooth. Remove silences and "umm" parts first, then add everything else.'],
    ['Speed & speed ramp', 'Speed makes a clip faster or slower. A speed ramp (curve) starts slow, speeds up, then slows again - the popular smooth "velocity" edit. Try 0.5x / 2x in the Edit tab.'],
    ['Transitions', 'Place a transition on the join between two clips. Simple ones (cut, fade, slide) look professional; do not use a fancy effect on every cut.'],
    ['Text, titles & captions', 'Add text on its own track, pick a readable font, keep it inside the safe area (away from the screen edges). Auto-captions create subtitles from speech - always proof-read them.'],
    ['Audio & music', 'Keep voice clearly louder than music (music about 10-20% volume under speech). Add fade in/out at the ends. Cut clips on the music beat for energy. Use only music you have the right to use.'],
    ['Keyframes', 'A keyframe stores a value (position, size, rotation, opacity) at one moment. Add two keyframes with different values and the app animates between them - used for zoom-ins, moving text and pan effects.'],
    ['Colour & filters', 'Fix first: brightness, contrast, saturation. Then add a filter/LUT for a look. Do not over-saturate skin tones. Try the Filters sliders in the Edit tab.'],
    ['Aspect ratio & export', '9:16 = Reels, Shorts, TikTok, Status. 16:9 = YouTube. 1:1 / 4:5 = Instagram posts. Export 1080p, 30 fps is enough for social media; use 60 fps only for smooth gameplay or sports.']
  ];
  var APPS = [
    { n: 'CapCut', i: '✂', w: 'Phone, PC, web. Best for beginners and Reels/Shorts.', q: 'capcut video editing tutorial for beginners',
      s: ['Open CapCut, tap New project and pick your clips.', 'Drag the white playhead to where you want to cut, select the clip and tap Split (PC: Ctrl+B).', 'Tap the unwanted part and Delete. Drag the clip edge to trim.', 'Tap Speed > Normal / Curve to slow down or speed up (curve = speed ramp).', 'Tap Text > Add text, or Captions > Auto captions to generate subtitles.', 'Tap Audio > Sounds to add music; use Volume and Fade for balance.', 'Tap Effects / Filters / Transitions (the small box between two clips).', 'Use Keyframe (diamond icon) for zoom or motion. Set Ratio (9:16 etc.) then Export 1080p, 30 fps.'] },
    { n: 'VN Video Editor', i: '🎞', w: 'Phone & PC, free, no watermark. Good timeline control.', q: 'VN video editor tutorial hindi',
      s: ['Tap + > Create project, select the clips and tap Next.', 'Tap a clip to select it, move the playhead and tap Split. Delete the extra part.', 'Tap Speed for normal or Curve speed; use Voice for audio changes.', 'Add music from Audio; Beats can place markers on the beat so you can cut to rhythm.', 'Use Text, Stickers, Filters and Effects from the bottom menu; transitions appear between clips.', 'Keyframes: tap the diamond on a selected clip to animate position and scale.', 'Tap the export (arrow) button, choose 1080p and frame rate, then Save.'] },
    { n: 'InShot', i: '📱', w: 'Phone. Fast and simple for quick social posts.', q: 'inshot video editing tutorial',
      s: ['Tap Video > New and choose your clips.', 'Tap the clip, choose Split or Trim, and set start/end.', 'Use Canvas to switch ratio (9:16, 1:1, 16:9) and Background for borders.', 'Add Music, Text, Stickers and Filters from the bottom bar.', 'Use Speed for slow/fast and Transition (icon between clips).', 'Tap Save and pick resolution 1080p.'] },
    { n: 'Adobe Premiere Pro', i: '🎬', w: 'PC/Mac. Professional editing for YouTube, films and clients.', q: 'premiere pro tutorial for beginners',
      s: ['File > New Project, then Import your media into the Project panel.', 'Drag clips to the timeline. Press Space to play, V = select tool, C = razor tool.', 'Cut at the playhead with Ctrl+K (Cmd+K on Mac); select the gap and Shift+Delete to ripple-delete.', 'Effect Controls panel: set Position, Scale, Opacity and add keyframes with the stopwatch icon.', 'Effects panel: drag Cross Dissolve etc. onto cuts; right-click a clip > Speed/Duration to change speed.', 'Essential Graphics for titles; Essential Sound to tag audio as Dialogue or Music and auto-balance.', 'Lumetri Color for colour grading.', 'File > Export > Media, choose H.264 and "Match Source", then Export.'] },
    { n: 'DaVinci Resolve', i: '🎨', w: 'PC/Mac. Free, strongest colour grading + powerful editing.', q: 'davinci resolve beginner tutorial',
      s: ['Create a project, go to the Media page and import clips (or drag them directly).', 'On the Cut or Edit page, drag clips to the timeline.', 'Split with Ctrl+B (or the blade tool B); Delete to remove; Shift+Delete to ripple-delete.', 'Inspector tab: Transform, Zoom, Position, Opacity and keyframe diamonds.', 'Effects Library: drag Transitions between clips and Titles above them.', 'Colour page: use Primary wheels for balance, then add looks.', 'Deliver page: pick YouTube / H.264 preset, set filename, Add to Render Queue > Render.'] },
    { n: 'Filmora', i: '🪄', w: 'PC/Mac/phone. Easy drag-and-drop with many built-in effects.', q: 'filmora video editing tutorial',
      s: ['Import media, drag clips to the timeline.', 'Move the playhead and click the scissors (or Ctrl+B) to split; delete the part you do not need.', 'Double-click a clip to change speed, rotate, crop and colour.', 'Drag effects, titles and transitions from the top library onto the timeline.', 'Add keyframes from the clip settings for motion.', 'Click Export, choose MP4 and 1080p.'] }
  ];
  var WORKFLOW = ['1. Collect and name your clips. Watch them and note the best parts.', '2. Rough cut: keep only the good parts, in order. Remove mistakes and silence.', '3. Fine cut: tighten each clip, set the pacing, cut on the beat.', '4. Add speed changes, transitions and keyframe zooms only where they help.', '5. Audio: balance voice and music, add fades.', '6. Text and captions.', '7. Colour: fix exposure, then add a look.', '8. Export, watch the whole video once on your phone, then upload.'];
  var CHEAT = [['Play / Pause', 'Space', 'Space', 'Space'], ['Split at playhead', 'Ctrl+B', 'Ctrl+K', 'Ctrl+B'], ['Undo', 'Ctrl+Z', 'Ctrl+Z', 'Ctrl+Z'], ['Delete + close gap', 'Delete', 'Shift+Delete', 'Shift+Delete']];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* ---------- Course: Beginner -> Intermediate -> Advanced ---------- */
  var LEVELS = [
    { id: 'b', n: 'Beginner', i: '🌱', goal: 'Make a clean, watchable video from scratch: cut, add music and text, export.', les: [
      { t: 'Know your screen', c: 'Every editor has the same 4 parts: Preview (what you see), Timeline (where you build), Media/Library (your clips) and Tools/Properties (settings for the selected clip). The vertical line on the timeline is the playhead - it marks "now".', s: ['Open any editor (CapCut, VN, Premiere, DaVinci...) and find the 4 parts.', 'Drag the playhead and watch the preview change.', 'Zoom the timeline in and out.'], k: 'Name the 4 parts in your editor without looking.' },
      { t: 'Import and organise clips', c: 'Good editing starts before the first cut. Watch your clips, delete bad takes, and put them in the order of your story.', s: ['Import all clips for one video.', 'Watch each once and note the best 2-3 seconds.', 'Rename or sort them (Intro, Main, End).'], k: 'Pick 5 clips and decide the order of your story.' },
      { t: 'Cut, split and trim', c: 'Split cuts a clip at the playhead. Trim shortens a clip from its edges. 80% of editing is removing the boring parts.', s: ['Put the playhead where the bad part starts and Split.', 'Move to where it ends and Split again.', 'Delete the middle piece, then close the gap.', 'Or drag the clip edge to trim.'], k: 'Take a 30-second clip and make it 10 seconds, keeping only the best parts.', e: 1 },
      { t: 'Music and volume', c: 'Voice must always be clear. Put music under it at low volume, and fade it in and out so it does not start or stop suddenly.', s: ['Add a music track below your video.', 'Lower music volume until speech is easy to hear.', 'Add fade in at the start and fade out at the end.', 'Use only music you are allowed to use (royalty-free or the app library).'], k: 'Add music to your 10-second video with a fade out.' },
      { t: 'Text and captions', c: 'Most people watch without sound, so captions help a lot. Keep text short, large and away from the screen edges.', s: ['Add a text layer and type a short title.', 'Pick a clear font and strong contrast (light text on dark or the reverse).', 'Use auto-captions if your app has them, then read and fix every line.'], k: 'Add a title and one caption line.' },
      { t: 'Export the right way', c: 'Export settings decide quality and file size. For social media 1080p and 30 fps is enough. Choose the ratio that matches where you will post.', s: ['9:16 for Reels/Shorts/Status, 16:9 for YouTube.', 'Resolution 1080p, frame rate 30 fps, format MP4 (H.264).', 'Watch the exported file fully on your phone before uploading.'], k: 'Export your video and check it on your phone.', e: 1 }
    ], q: [['What do you press to cut a clip in two?', 'Split, with the playhead at the cut point.'], ['Which should be louder, voice or music?', 'Voice. Keep music low underneath.'], ['Best size for Reels/Shorts?', '9:16 vertical, 1080p.']] },
    { id: 'm', n: 'Intermediate', i: '🚀', goal: 'Make edits feel smooth and professional: rhythm, motion, sound and colour.', les: [
      { t: 'Pacing and rhythm', c: 'Pacing is how fast the shots change. Fast-paced content changes every 1-3 seconds; calm content can hold shots longer. Cut on an action (a step, a turn of the head) so the cut is hidden.', s: ['Remove every pause and "umm".', 'Cut right after a movement starts.', 'Vary shot length so it does not feel robotic.'], k: 'Re-cut a video so no shot is longer than 4 seconds.' },
      { t: 'J-cut and L-cut', c: 'In a J-cut the next clip\'s audio starts before its picture; in an L-cut the previous audio continues over the next picture. They make conversations and storytelling flow naturally.', s: ['Split video and audio apart (unlink or detach audio).', 'Slide the audio a little earlier (J) or later (L) than the picture cut.', 'Add a short audio fade at the join.'], k: 'Make one J-cut between two clips.' },
      { t: 'Speed and speed ramp', c: 'Slow motion adds drama; fast motion adds energy. A speed ramp changes speed smoothly inside one clip (slow -> fast -> slow) and is used with music beats.', s: ['Shoot or pick a clip with clear movement.', 'Apply Speed > Curve (CapCut/VN) or Time Remapping (Premiere/DaVinci).', 'Put the fast part on the action peak and ease in and out.'], k: 'Slow one clip to 0.5x and speed another to 2x, then compare.', e: 1 },
      { t: 'Transitions that work', c: 'The best transition is often a plain cut. Use motion transitions only when the movement in both clips matches (e.g. a whip pan to a whip pan).', s: ['Use cut or a short dissolve by default.', 'Match direction of movement before using slide/zoom transitions.', 'Keep transitions under 0.5 seconds for fast videos.'], k: 'Use no more than 2 transitions in a 30-second video.' },
      { t: 'Keyframes and zoom', c: 'A keyframe saves a setting (size, position, rotation, opacity) at one moment. Two keyframes with different values make the app animate between them.', s: ['Move the playhead to the start and add a keyframe for Scale 100%.', 'Move to the end, set Scale 115% - it creates a slow push-in.', 'Use easing (ease in/out) so the motion feels smooth.'], k: 'Add a slow zoom-in to one clip.' },
      { t: 'Clean audio', c: 'Bad audio makes viewers leave faster than bad video. Remove noise, even out volume, and lower music automatically when someone speaks (ducking).', s: ['Apply noise reduction or voice enhance on the voice clip.', 'Normalise so all voice clips have a similar level.', 'Use auto-ducking or manual volume keyframes on the music.'], k: 'Clean up a voice recording and duck music under it.' },
      { t: 'Basic colour correction', c: 'First fix the picture (exposure, contrast, white balance), then add a style. Skin tones should look natural.', s: ['Adjust brightness and contrast until blacks and whites look right.', 'Fix white balance so white looks white.', 'Match clips shot in different light so they look like one video.', 'Add a filter only at the end, at 30-60% strength.'], k: 'Colour-correct two clips so they match.', e: 1 }
    ], q: [['What is a J-cut?', 'Next clip\'s audio starts before its picture.'], ['Why use ease in/out on keyframes?', 'So the motion starts and stops smoothly, not sharply.'], ['Order of colour work?', 'Correct first (exposure, white balance), then add a creative look.']] },
    { id: 'a', n: 'Advanced', i: '🏆', goal: 'Edit like a professional: storytelling, VFX, grading, sound mixing and efficient workflow.', les: [
      { t: 'Story structure and retention', c: 'Every good video has a hook (first 3 seconds), a body that keeps promising something new, and an ending that pays off. Retention editing means removing anything that gives people a reason to leave.', s: ['Write the hook first; put the most interesting moment at the start.', 'Add a new visual, sound or fact every 3-5 seconds.', 'Check the analytics of your uploads and see where viewers drop, then re-edit that part.'], k: 'Re-edit the first 5 seconds of an old video as a stronger hook.' },
      { t: 'B-roll and multicam', c: 'B-roll is extra footage that covers cuts and shows what is being said. Multicam means syncing several cameras and switching between them.', s: ['Lay the main (A-roll) story first.', 'Cover jump cuts with B-roll that matches what is said.', 'For multicam, sync clips by audio waveform and cut between angles on sentence breaks.'], k: 'Cover three jump cuts in an interview with B-roll.' },
      { t: 'Masking and green screen', c: 'A mask shows only part of a clip. Chroma key removes a solid colour (green/blue) so you can place a subject on any background.', s: ['Apply Chroma Key / Ultra Key to the green-screen clip and pick the green.', 'Tune tolerance and edge feather, then remove green spill.', 'Use a mask with keyframes to reveal or hide objects over time.'], k: 'Replace a green background with an image or video.' },
      { t: 'Motion tracking', c: 'Tracking follows a moving object so text, blur or effects stick to it (e.g. a name tag following a person or a blurred face).', s: ['Add the text, blur or sticker layer above the clip.', 'Run tracking on the object you want to follow (Track / Motion Tracking).', 'Apply the track to your layer and fix drift with manual keyframes.'], k: 'Make a text label that follows a moving person.' },
      { t: 'Pro colour grading', c: 'Grading uses scopes (waveform, vectorscope) instead of just your eyes. Log footage needs a technical conversion, then a creative grade.', s: ['Open the waveform: keep important brightness between 0 and 100 (no clipping).', 'Use primary wheels (lift/gamma/gain) to set contrast and colour balance.', 'Use secondary corrections (curves, qualifier, power windows) for skin or sky.', 'Apply a LUT as a starting point and reduce its strength.'], k: 'Grade a clip using the waveform, then compare before and after.' },
      { t: 'Sound design and mixing', c: 'Sound is half of the video. Layer dialogue, music, ambience and sound effects, and mix them so nothing fights. Final loudness is measured in LUFS.', s: ['Dialogue about -12 to -6 dB peak, music well below it.', 'Add whooshes, hits and room tone to give the cuts weight.', 'Aim for about -14 LUFS for YouTube and social media.', 'Check with a limiter so the audio never clips.'], k: 'Add 3 sound effects and a room tone to a scene.' },
      { t: 'Pro workflow: proxies, nesting, organisation', c: 'Big projects need structure. Proxies are light copies that make editing smooth; nested sequences group many clips into one block; bins and labels keep things findable.', s: ['Create proxies for 4K footage so playback is smooth.', 'Nest repeated sequences (intro, lower third) and reuse them.', 'Use folders (bins), colour labels and clear names for every file.', 'Save versions (v1, v2) and back up the project and media.'], k: 'Organise one project with folders and a backup.' },
      { t: 'Export settings: bitrate and codecs', c: 'H.264 is the safe choice everywhere; H.265 (HEVC) gives smaller files with more demanding playback; ProRes is for archive and handing over to other editors. Bitrate controls the quality/size balance.', s: ['YouTube 1080p: H.264, around 8-12 Mbps; 4K: around 35-45 Mbps.', 'Instagram/Reels: 1080x1920, H.264, around 8-10 Mbps.', 'Use two-pass or higher quality for high-motion footage.', 'Keep a master export (high quality) before making smaller versions.'], k: 'Export one master file and one small file for WhatsApp.' }
    ], q: [['What is a hook?', 'The first 2-3 seconds that make people keep watching.'], ['What does a vectorscope show?', 'Colour (hue and saturation) of the picture.'], ['Why create proxies?', 'Light copies of big files make editing smooth on slower computers.']] }
  ];
  var PKEY = 'veProgress';
  function getProg() { try { return JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { return {}; } }
  function setProg(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) { } }
  function pathHTML() {
    var p = getProg(), h = '<div class="card"><h3 style="margin:0 0 6px">🎓 Video editing course - Beginner to Advanced</h3>' +
      '<p style="margin:0 0 10px">Follow the levels in order. Do the practice task of each lesson, then tick it as done. Your progress is saved on this device.</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap" class="noprint">';
    LEVELS.forEach(function (L, i) { h += '<button class="btn' + (i ? ' ghost' : '') + '" type="button" data-lv="' + L.id + '">' + L.i + ' ' + L.n + ' <span data-pc="' + L.id + '"></span></button>'; });
    h += '</div></div>';
    LEVELS.forEach(function (L, i) {
      h += '<div data-lvp="' + L.id + '"' + (i ? ' hidden' : '') + '><div class="card"><h3 style="margin:0 0 4px">' + L.i + ' ' + L.n + '</h3><p style="margin:0 0 8px;opacity:.85">' + esc(L.goal) + '</p>' +
        '<div style="height:8px;border-radius:99px;background:rgba(128,128,128,.25);overflow:hidden"><div data-bar="' + L.id + '" style="height:100%;width:0;background:#2563eb;transition:width .3s"></div></div></div>';
      L.les.forEach(function (x, j) {
        var id = L.id + (j + 1);
        h += '<div class="card"><details><summary style="cursor:pointer;font-weight:600;padding:4px 0">Lesson ' + (j + 1) + ': ' + esc(x.t) + '</summary>' +
          '<p style="margin:8px 0">' + esc(x.c) + '</p><ol style="margin:0 0 8px 18px;padding:0">';
        x.s.forEach(function (s) { h += '<li style="margin:0 0 4px">' + esc(s) + '</li>'; });
        h += '</ol><p style="margin:0 0 10px;padding:8px 10px;border-radius:8px;background:rgba(37,99,235,.1)"><b>Practice task:</b> ' + esc(x.k) + '</p>' +
          (x.e ? '<button class="btn ghost" type="button" data-goedit="1" style="margin:0 8px 8px 0">🎬 Practise in the editor</button>' : '') +
          '<label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" data-les="' + id + '"' + (p[id] ? ' checked' : '') + '> I finished this lesson</label></details></div>';
      });
      h += '<div class="card"><h3 style="margin:0 0 8px">Quick quiz - ' + L.n + '</h3><p style="font-size:12px;opacity:.7;margin:0 0 8px">Think of the answer first, then tap the question.</p>';
      L.q.forEach(function (q) { h += '<details style="margin:0 0 6px"><summary style="cursor:pointer;padding:4px 0">' + esc(q[0]) + '</summary><p style="margin:4px 0 6px;opacity:.9">✔ ' + esc(q[1]) + '</p></details>'; });
      h += '</div></div>';
    });
    return h;
  }
  function learnHTML() {
    var h = pathHTML();
    h += '<div class="card"><h3 style="margin:0 0 6px">📚 Extra reference</h3>' +
      '<p style="margin:0 0 8px">Basic ideas, step-by-step guides for each app, a workflow and shortcuts. You can practise cut, speed, rotate and filters in the <b>Edit video</b> tab.</p>' +
      '<button class="btn ghost" type="button" data-goedit="1">🎬 Open the editor</button></div>';
    h += '<div class="card"><h3 style="margin:0 0 8px">Editing basics (every app)</h3>';
    BASICS.forEach(function (b) { h += '<details style="margin:0 0 6px"><summary style="cursor:pointer;font-weight:600;padding:6px 0">' + esc(b[0]) + '</summary><p style="margin:0 0 8px;opacity:.85">' + esc(b[1]) + '</p></details>'; });
    h += '</div><div class="card"><h3 style="margin:0 0 8px">Step-by-step: pick your app</h3>';
    APPS.forEach(function (a) {
      h += '<details style="margin:0 0 8px"><summary style="cursor:pointer;font-weight:600;padding:6px 0">' + a.i + ' ' + esc(a.n) + ' <span style="font-weight:400;opacity:.7;font-size:12px">- ' + esc(a.w) + '</span></summary><ol style="margin:4px 0 8px 18px;padding:0">';
      a.s.forEach(function (x) { h += '<li style="margin:0 0 5px">' + esc(x) + '</li>'; });
      h += '</ol><a class="btn ghost" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(a.q) + '">▶ Watch ' + esc(a.n) + ' tutorials on YouTube</a></details>';
    });
    h += '<p style="font-size:12px;opacity:.7;margin:8px 0 0">Menus and button names can change a little when the apps update.</p></div>';
    h += '<div class="card"><h3 style="margin:0 0 8px">A simple editing workflow</h3><ul style="margin:0;padding-left:0;list-style:none">';
    WORKFLOW.forEach(function (w) { h += '<li style="margin:0 0 5px">' + esc(w) + '</li>'; });
    h += '</ul></div><div class="card"><h3 style="margin:0 0 8px">Common shortcuts (PC)</h3><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left;padding:6px">Action</th><th style="text-align:left;padding:6px">CapCut</th><th style="text-align:left;padding:6px">Premiere</th><th style="text-align:left;padding:6px">DaVinci</th></tr>';
    CHEAT.forEach(function (r) { h += '<tr>' + r.map(function (c) { return '<td style="padding:6px;border-top:1px solid rgba(128,128,128,.25)">' + esc(c) + '</td>'; }).join('') + '</tr>'; });
    return h + '</table></div><p style="font-size:12px;opacity:.7;margin:8px 0 0">On Mac use Cmd instead of Ctrl.</p></div>';
  }

  tool.render = function (el) {
    el.innerHTML =
      '<div class="card" style="background:linear-gradient(135deg,#0e0f13,#1b1440);color:#fff;border:0;margin-bottom:14px"><h3 style="margin:0 0 6px;color:#fff">🎬 PJ Studio Pro – CapCut-style Video Editor</h3>' +
      '<p style="margin:0 0 12px;opacity:.85;font-size:14px">Multi-track timeline, text animations, transitions, effects, filters, stickers, keyframes, chroma key, auto captions, music &amp; MP4/WebM export. 100% in your browser – nothing is uploaded.</p>' +
      '<button class="btn" id="ve-pro" type="button">🚀 Open PJ Studio Pro</button></div>' +
      '<div class="noprint" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">' +
      '<button class="btn" id="ve-t-edit" type="button">🎬 Quick edit (simple)</button>' +
      '<button class="btn ghost" id="ve-t-learn" type="button">📚 Learn video editing</button></div>' +
      '<div id="ve-pane-edit">' +
      '<div class="card">' +
      '<p style="margin:0 0 10px">Choose a video from your device. Everything is processed on your device – nothing is uploaded.</p>' +
      '<input id="ve-file" type="file" accept="video/*">' +
      '</div>' +
      '<div class="card" id="ve-work" hidden>' +
      '<video id="ve-vid" controls playsinline style="width:100%;max-height:420px;background:#000;border-radius:10px"></video>' +
      '<div id="ve-info" style="margin:8px 0;font-size:13px;opacity:.8"></div>' +

      '<h3 style="margin:14px 0 8px">✂ Trim</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;align-items:end">' +
      '<label>Start (sec)<br><input id="ve-s" type="number" min="0" step="0.1" value="0" style="width:100%"></label>' +
      '<label>End (sec)<br><input id="ve-e" type="number" min="0" step="0.1" value="0" style="width:100%"></label>' +
      '<button class="btn ghost" id="ve-ss" type="button">Start = current time</button>' +
      '<button class="btn ghost" id="ve-se" type="button">End = current time</button>' +
      '</div>' +

      '<h3 style="margin:16px 0 8px">⚙ Adjust</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">' +
      '<label>Speed<br><select id="ve-spd" style="width:100%"><option value="0.5">0.5x (slow)</option><option value="0.75">0.75x</option><option value="1" selected>1x (normal)</option><option value="1.5">1.5x</option><option value="2">2x</option><option value="3">3x</option><option value="4">4x (fast)</option></select></label>' +
      '<label>Rotate<br><select id="ve-rot" style="width:100%"><option value="0">0°</option><option value="90">90° right</option><option value="180">180°</option><option value="270">90° left</option></select></label>' +
      '<label>Output size<br><select id="ve-res" style="width:100%"><option value="0">Original</option><option value="1080">1080p</option><option value="720">720p</option><option value="480">480p</option><option value="360">360p</option></select></label>' +
      '<label style="display:flex;align-items:center;gap:8px"><input id="ve-mute" type="checkbox"> Mute audio</label>' +
      '</div>' +

      '<h3 style="margin:16px 0 8px">🎨 Filters</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">' +
      '<label>Brightness<br><input id="ve-br" type="range" min="50" max="150" value="100" style="width:100%"></label>' +
      '<label>Contrast<br><input id="ve-co" type="range" min="50" max="150" value="100" style="width:100%"></label>' +
      '<label>Saturation<br><input id="ve-sa" type="range" min="0" max="200" value="100" style="width:100%"></label>' +
      '<label style="display:flex;align-items:center;gap:8px"><input id="ve-bw" type="checkbox"> Black &amp; white</label>' +
      '</div>' +

      '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px">' +
      '<button class="btn" id="ve-go" type="button">▶ Export video</button>' +
      '<button class="btn ghost" id="ve-png" type="button">📷 Save current frame (PNG)</button>' +
      '<button class="btn ghost" id="ve-reset" type="button">↺ Reset</button>' +
      '</div>' +
      '<div id="ve-msg" style="margin-top:12px;font-size:13px"></div>' +
      '<div id="ve-out" style="margin-top:12px"></div>' +
      '<p style="font-size:12px;opacity:.7;margin:12px 0 0">Note: export runs in real time (a 1-minute clip takes about 1 minute at 1x), so keep this tab open and visible until it finishes. Filters work in Chrome, Edge and Firefox.</p>' +
      '</div></div>' +
      '<div id="ve-pane-learn" hidden>' + learnHTML() + '</div>';

    var $ = function (id) { return el.querySelector('#' + id); };
    function tab(which) {
      var L = which === 'learn';
      $('ve-pane-edit').hidden = L; $('ve-pane-learn').hidden = !L;
      $('ve-t-edit').className = 'btn' + (L ? ' ghost' : ''); $('ve-t-learn').className = 'btn' + (L ? '' : ' ghost');
    }
    $('ve-pro').addEventListener('click', function () { if (window.PJVS && PJVS.open) PJVS.open(); else say('Studio failed to load – refresh the page.'); });
    if (/[?&#]studio\b/.test(location.href) && window.PJVS && PJVS.open) setTimeout(function () { PJVS.open(); }, 0);
    $('ve-t-edit').addEventListener('click', function () { tab('edit'); });
    $('ve-t-learn').addEventListener('click', function () { tab('learn'); });
    el.addEventListener('click', function (e) {
      var g = e.target.closest('[data-goedit]'); if (g) { tab('edit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      var b = e.target.closest('[data-lv]');
      if (b) {
        el.querySelectorAll('[data-lvp]').forEach(function (d) { d.hidden = d.getAttribute('data-lvp') !== b.getAttribute('data-lv'); });
        el.querySelectorAll('[data-lv]').forEach(function (x) { x.className = 'btn' + (x === b ? '' : ' ghost'); });
      }
    });
    function updProg() {
      var p = getProg();
      LEVELS.forEach(function (L) {
        var d = 0; L.les.forEach(function (x, j) { if (p[L.id + (j + 1)]) d++; });
        var bar = el.querySelector('[data-bar="' + L.id + '"]'), pc = el.querySelector('[data-pc="' + L.id + '"]');
        if (bar) bar.style.width = Math.round(d / L.les.length * 100) + '%';
        if (pc) pc.textContent = '(' + d + '/' + L.les.length + ')';
      });
    }
    el.addEventListener('change', function (e) {
      var c = e.target.closest('[data-les]'); if (!c) return;
      var p = getProg(); if (c.checked) p[c.getAttribute('data-les')] = 1; else delete p[c.getAttribute('data-les')];
      setProg(p); updProg();
    });
    updProg();
    var v = $('ve-vid'), work = $('ve-work'), msg = $('ve-msg'), out = $('ve-out'), goBtn = $('ve-go');
    var curUrl = null, outUrl = null;

    function dur() { return isFinite(v.duration) ? v.duration : 0; }
    function range() {
      var s = Math.max(0, parseFloat($('ve-s').value) || 0);
      var e = parseFloat($('ve-e').value) || dur();
      e = Math.min(e, dur());
      if (e <= s) { e = dur(); }
      return { s: s, e: e };
    }
    function filterStr() {
      return 'brightness(' + $('ve-br').value + '%) contrast(' + $('ve-co').value + '%) saturate(' + $('ve-sa').value + '%)' + ($('ve-bw').checked ? ' grayscale(1)' : '');
    }
    function liveFilter() { v.style.filter = filterStr(); }
    function size() {
      var rot = parseInt($('ve-rot').value, 10), tall = parseInt($('ve-res').value, 10);
      var w0 = rot % 180 ? v.videoHeight : v.videoWidth, h0 = rot % 180 ? v.videoWidth : v.videoHeight, k = 1;
      if (tall && h0 > tall) k = tall / h0;
      return { rot: rot, W: Math.max(2, Math.round(w0 * k / 2) * 2), H: Math.max(2, Math.round(h0 * k / 2) * 2) };
    }
    function paint(ctx, z) {
      ctx.filter = filterStr();
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, z.W, z.H);
      ctx.save(); ctx.translate(z.W / 2, z.H / 2); ctx.rotate(z.rot * Math.PI / 180);
      var dw = z.rot % 180 ? z.H : z.W, dh = z.rot % 180 ? z.W : z.H;
      ctx.drawImage(v, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    }
    function seek(t) {
      return new Promise(function (ok) {
        var f = function () { v.removeEventListener('seeked', f); ok(); };
        v.addEventListener('seeked', f); v.currentTime = t;
      });
    }
    function clearOut() { if (outUrl) { URL.revokeObjectURL(outUrl); outUrl = null; } out.innerHTML = ''; }

    $('ve-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      if (curUrl) URL.revokeObjectURL(curUrl);
      clearOut(); msg.textContent = '';
      curUrl = URL.createObjectURL(f);
      v.src = curUrl;
      v.onloadedmetadata = function () {
        work.removeAttribute('hidden');
        $('ve-s').value = 0; $('ve-e').value = dur().toFixed(1);
        $('ve-info').textContent = f.name + ' · ' + v.videoWidth + '×' + v.videoHeight + ' · ' + fmt(dur());
      };
      v.onerror = function () { say('This video format cannot be opened in your browser'); };
    });

    $('ve-ss').addEventListener('click', function () { $('ve-s').value = v.currentTime.toFixed(1); });
    $('ve-se').addEventListener('click', function () { $('ve-e').value = v.currentTime.toFixed(1); });
    ['ve-br', 've-co', 've-sa', 've-bw'].forEach(function (id) { $(id).addEventListener('input', liveFilter); });
    $('ve-rot').addEventListener('change', function () { v.style.transform = ''; });

    $('ve-reset').addEventListener('click', function () {
      if (busy) return;
      $('ve-s').value = 0; $('ve-e').value = dur().toFixed(1);
      $('ve-spd').value = '1'; $('ve-rot').value = '0'; $('ve-res').value = '0';
      $('ve-br').value = 100; $('ve-co').value = 100; $('ve-sa').value = 100;
      $('ve-bw').checked = false; $('ve-mute').checked = false;
      liveFilter(); clearOut(); msg.textContent = '';
    });

    $('ve-png').addEventListener('click', function () {
      if (!v.videoWidth) return;
      var z = size(), c = document.createElement('canvas'); c.width = z.W; c.height = z.H;
      paint(c.getContext('2d'), z);
      c.toBlob(function (b) {
        var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'frame-' + fmt(v.currentTime).replace(':', 'm') + '.png';
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        say('Frame saved ✓');
      }, 'image/png');
    });

    goBtn.addEventListener('click', async function () {
      if (busy || !v.videoWidth) return;
      if (typeof MediaRecorder === 'undefined') { say('Your browser does not support video export. Please use Chrome, Edge or Firefox.'); return; }
      busy = true; goBtn.disabled = true; clearOut();
      var r = range(), z = size(), speed = parseFloat($('ve-spd').value) || 1, mute = $('ve-mute').checked;
      var canvas = document.createElement('canvas'); canvas.width = z.W; canvas.height = z.H;
      var ctx = canvas.getContext('2d');
      var stream = canvas.captureStream(30);

      try {
        if (!mute) {
          audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') await audioCtx.resume();
          if (!audioSrc || audioSrc.mediaElement !== v) { audioSrc = audioCtx.createMediaElementSource(v); audioDest = audioCtx.createMediaStreamDestination(); }
          audioSrc.disconnect(); audioSrc.connect(audioDest);
          audioDest.stream.getAudioTracks().forEach(function (t) { stream.addTrack(t); });
        } else if (audioSrc) { audioSrc.disconnect(); }
      } catch (err) { /* continue without audio */ }

      var types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'], mime = '';
      for (var i = 0; i < types.length; i++) { if (MediaRecorder.isTypeSupported(types[i])) { mime = types[i]; break; } }
      var rec, chunks = [];
      try { rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 5000000 } : undefined); }
      catch (err) { say('Could not start the recorder in this browser'); busy = false; goBtn.disabled = false; return; }
      var ext = /mp4/.test(rec.mimeType || mime) ? 'mp4' : 'webm';
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };

      var done = new Promise(function (ok) { rec.onstop = ok; });
      v.pause(); await seek(r.s);
      v.playbackRate = speed; v.muted = false;
      rec.start(250);
      try { await v.play(); } catch (err) { rec.stop(); await done; say('Browser blocked playback – click Export again'); busy = false; goBtn.disabled = false; return; }

      var stopped = false;
      function finish() { if (stopped) return; stopped = true; v.pause(); v.playbackRate = 1; if (rec.state !== 'inactive') rec.stop(); }
      v.onended = finish;
      (function loop() {
        if (stopped) return;
        paint(ctx, z);
        var pct = Math.min(100, Math.round((v.currentTime - r.s) / (r.e - r.s) * 100));
        msg.textContent = '⏳ Exporting… ' + pct + '% (keep this tab open)';
        if (v.currentTime >= r.e) { finish(); return; }
        requestAnimationFrame(loop);
      })();

      await done;
      v.onended = null;
      var blob = new Blob(chunks, { type: (rec.mimeType || mime || 'video/webm').split(';')[0] });
      outUrl = URL.createObjectURL(blob);
      var name = 'edited-video.' + ext;
      out.innerHTML = '<video controls playsinline style="width:100%;max-height:360px;background:#000;border-radius:10px"></video>' +
        '<div style="margin-top:10px"><a class="btn" download="' + name + '" href="' + outUrl + '">⬇ Download ' + name + ' (' + (blob.size / 1048576).toFixed(1) + ' MB)</a></div>';
      out.querySelector('video').src = outUrl;
      msg.textContent = '✓ Done';
      say('Video ready ✓');
      v.pause(); await seek(r.s);
      busy = false; goBtn.disabled = false;
    });
  };

  TOOLS.push(tool);
})();
