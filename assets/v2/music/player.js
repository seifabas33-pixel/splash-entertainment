/* Site soundtrack player. The music is original and synthesised live with the Web Audio API
   (tracks in this folder). Nothing plays until the visitor taps a sound button.
   Page API: SAMusic.toggle() / play(id) / stop() / select(id) / duck(bool) / setEnergy(0..1) / on(fn) / state() */
(function () {
  'use strict';
  var me = document.currentScript;
  var BASE = me ? me.src.replace(/[^/]*$/, '') : '/assets/v2/music/';
  var TRACKS = [
    { id: 'red-sea-night', title: 'Red Sea Night' }
  ];
  var VOLUME = 0.7;            /* background level, below the show videos */
  var LOOKAHEAD = 1.5, TICK = 250;
  var root = document.documentElement;
  var S = { on: false, loading: false, pending: false, id: null, energy: 0.4, mood: 'night', ducked: false, hidden: document.hidden };
  var ctx = null, out = null, master = null, track = null, timer = 0, token = 0, listeners = [], scripts = {}, unlockEl = null;
  var meter = null, meterBuf = null, meterLevel = 0;

  try { var saved = localStorage.getItem('sa-track'); if (saved && find(saved)) S.id = saved; } catch (e) {}
  if (!S.id) S.id = TRACKS[0].id;
  S.mood = root.getAttribute('data-theme') === 'light' ? 'day' : 'night';

  function find(id) { for (var i = 0; i < TRACKS.length; i++) if (TRACKS[i].id === id) return TRACKS[i]; return null; }
  function snapshot() { return { on: S.on, loading: S.loading, pending: S.pending, silent: S.on && !S.loading && !S.ducked && !S.hidden && !!ctx && ctx.state !== 'running', id: S.id, title: (find(S.id) || {}).title, tracks: TRACKS.slice(), supported: !!(window.AudioContext || window.webkitAudioContext) }; }
  function emit() { var s = snapshot(); listeners.forEach(function (fn) { try { fn(s); } catch (e) {} }); }
  function load(name) {
    if (!scripts[name]) scripts[name] = new Promise(function (res, rej) {
      var el = document.createElement('script'); el.src = BASE + name + '.js'; el.async = true;
      el.onload = res; el.onerror = function () { delete scripts[name]; rej(new Error('load ' + name)); };
      document.head.appendChild(el);
    });
    return scripts[name];
  }

  /* iPhone: let music play even when the ring/silent switch is on */
  function silentWav() {
    var n = 2000, b = new Uint8Array(44 + n), v = new DataView(b.buffer), p = 0;
    function s(t) { for (var i = 0; i < t.length; i++) b[p++] = t.charCodeAt(i); }
    s('RIFF'); v.setUint32(p, 36 + n, true); p += 4; s('WAVEfmt '); v.setUint32(p, 16, true); p += 4; v.setUint16(p, 1, true); p += 2; v.setUint16(p, 1, true); p += 2;
    v.setUint32(p, 8000, true); p += 4; v.setUint32(p, 8000, true); p += 4; v.setUint16(p, 1, true); p += 2; v.setUint16(p, 8, true); p += 2; s('data'); v.setUint32(p, n, true); p += 4;
    for (var i = 0; i < n; i++) b[p++] = 128;
    var str = ''; for (i = 0; i < b.length; i++) str += String.fromCharCode(b[i]);
    return 'data:audio/wav;base64,' + btoa(str);
  }
  function unlockSession() {
    try { if (navigator.audioSession) { navigator.audioSession.type = 'playback'; return; } } catch (e) {}
    var iOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!iOS) return;
    if (!unlockEl) { unlockEl = document.createElement('audio'); unlockEl.setAttribute('x-webkit-airplay', 'deny'); unlockEl.loop = true; unlockEl.src = silentWav(); }
    var p = unlockEl.play(); if (p && p.catch) p.catch(function () {});
  }

  /* must run inside the tap handler: browsers only allow sound that starts from a gesture */
  function ensureContext() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    if (!ctx) {
      try { ctx = new AC({ latencyHint: 'playback' }); } catch (e) { ctx = new AC(); }
      out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
      meter = ctx.createAnalyser(); meter.fftSize = 512; meter.smoothingTimeConstant = 0; out.connect(meter); meterBuf = new Float32Array(meter.fftSize);
      ctx.onstatechange = function () { emit(); };   /* lets the buttons show when the browser has paused the audio */
    }
    unlockSession();
    if (ctx.state !== 'running') { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); }
    return true;
  }
  function level() { return S.on && !S.ducked && !S.hidden ? VOLUME : 0; }
  function fadeTo(v, secs) {
    if (!ctx) return;
    var now = ctx.currentTime, g = out.gain;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(v, now + secs);
  }
  function tick() {
    if (!track || !ctx) return;
    try { track.scheduleUntil(ctx.currentTime + LOOKAHEAD); } catch (e) { if (window.console) console.error(e); }
  }
  function retire(t) {
    if (!t) return;
    try { t.stop(ctx.currentTime + 0.02); } catch (e) {}
    setTimeout(function () { try { t.dispose(); } catch (e) {} }, 4500);
  }

  function play(id) {
    if (id && find(id)) S.id = id;
    if (!ensureContext()) return;
    S.on = true; S.loading = true; S.pending = false; emit();
    var my = ++token, want = S.id;
    try { localStorage.setItem('sa-track', want); sessionStorage.setItem('sa-music', 'on'); } catch (e) {}
    Promise.all([load('master'), load(want)]).then(function () {
      if (my !== token || !S.on) return;
      if (!master) { master = window.SA_MASTER(ctx); master.output.connect(out); }
      var old = track; track = null; retire(old);            /* switching tracks: the old one fades out under the new one */
      var T = window.SA_MUSIC && window.SA_MUSIC[want];
      if (!T) throw new Error('track ' + want);
      track = T.create(ctx, master.input, { seed: (Math.floor(Math.random() * 1e6) + 1) });
      var now = ctx.currentTime + 0.05;
      track.start(now); track.setMood(S.mood, now); track.setEnergy(S.energy, now); tick();
      clearInterval(timer); timer = setInterval(tick, TICK);
      fadeTo(level(), 0.4);
      S.loading = false; emit();
    }).catch(function (e) {
      if (my !== token) return;
      S.on = false; S.loading = false; emit();
      if (window.console) console.error(e);
    });
  }
  function stop() {
    token++;
    var was = track; track = null;
    S.on = false; S.loading = false; S.pending = false; emit();
    try { sessionStorage.setItem('sa-music', 'off'); } catch (e) {}
    clearInterval(timer); timer = 0;
    if (!ctx) return;
    retire(was);
    setTimeout(function () {
      if (S.on) return;
      fadeTo(0, 0.2);
      if (unlockEl) unlockEl.pause();
      if (ctx.state === 'running') ctx.suspend();
    }, 4600);
  }

  /* fade out when the tab is hidden, back in when it returns */
  function wantsOff() { try { return sessionStorage.getItem('sa-music') === 'off'; } catch (e) { return false; } }
  function resumeCtx() {
    unlockSession();
    var p = ctx.resume(); if (p && p.then) p.then(function () { tick(); fadeTo(level(), 0.8); emit(); }, function () {});
  }
  document.addEventListener('visibilitychange', function () {
    S.hidden = document.hidden;
    if (!ctx || !S.on) { emit(); return; }
    if (S.hidden) { fadeTo(0, 0.3); setTimeout(function () { if (S.hidden && ctx.state === 'running') ctx.suspend(); }, 400); }
    else if (wantsOff()) stop();                      /* switched off on another page meanwhile */
    else if (!S.ducked) resumeCtx();                  /* if the browser refuses, the next tap retries */
    emit();
  });
  /* Back/forward cache (Safari keeps the page alive): follow the on/off choice made on the other page */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var want = null; try { want = sessionStorage.getItem('sa-music'); } catch (x) {}
    if (want === 'off' && (S.on || S.pending)) stop();
    else if (want === 'on' && !S.on) { S.pending = true; emit(); }
  });
  /* Browsers only start sound from a tap or key press. Two cases wait for the next one:
     - iPhone interrupted the audio (a call, another app);
     - the visitor turned music on, then opened another page of the site in this session. */
  try { if (sessionStorage.getItem('sa-music') === 'on') S.pending = true; } catch (e) {}
  function onGesture(e) {
    if (e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Shift' || e.key === 'CapsLock' || e.metaKey || e.ctrlKey || e.altKey)) return;
    if (e.target && e.target.closest && e.target.closest('[data-snd]')) return;   /* the sound buttons handle their own tap */
    if (S.pending && !S.on) {
      /* a scroll's touchend is not a gesture: resume() is refused, `pending` stays, the next real tap starts the music */
      if (!ensureContext()) return;
      if (ctx.state === 'running') { play(); return; }
      var p = ctx.resume(); if (p && p.then) p.then(function () { if (S.pending && !S.on && ctx.state === 'running') play(); }, function () {});
      return;
    }
    if (!S.on || !ctx || S.hidden || S.ducked || ctx.state === 'running' || ctx.state === 'closed') return;
    resumeCtx();   /* iPhone interruptions, or a context left suspended */
  }
  ['pointerup', 'touchend', 'click', 'keydown'].forEach(function (ev) { document.addEventListener(ev, onGesture, true); });
  /* night/day theme changes the mood of the music */
  new MutationObserver(function () {
    var m = root.getAttribute('data-theme') === 'light' ? 'day' : 'night';
    if (m === S.mood) return; S.mood = m;
    if (track && ctx) track.setMood(m, ctx.currentTime + 0.05);
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  window.SAMusic = {
    tracks: TRACKS,
    state: snapshot,
    on: function (fn) { listeners.push(fn); fn(snapshot()); },
    play: play,
    stop: stop,
    toggle: function () {
      if (S.on && ctx && !S.hidden && !S.ducked && ctx.state !== 'running' && ctx.state !== 'closed') { resumeCtx(); return; }   /* on but silent: bring it back */
      if (S.on) stop(); else play();
    },
    select: function (id) { if (!find(id)) return; if (S.on) { if (id !== S.id) play(id); } else { S.id = id; try { localStorage.setItem('sa-track', id); } catch (e) {} emit(); } },
    /* a show video with sound is playing: fade out, then pause the engine to save battery; resume afterwards */
    duck: function (d) {
      d = !!d; if (d === S.ducked) return; S.ducked = d;
      if (!S.on || !ctx) return;
      if (d) {
        fadeTo(0, 0.35);
        setTimeout(function () { if (S.ducked && S.on) { clearInterval(timer); timer = 0; if (ctx.state === 'running') ctx.suspend(); } }, 450);
      } else {
        unlockSession();
        var go = function () { if (!S.on || S.ducked) return; tick(); clearInterval(timer); timer = setInterval(tick, TICK); fadeTo(level(), 1.2); emit(); };
        var p = ctx.resume(); if (p && p.then) p.then(go, function () { emit(); }); else go();
      }
    },
    setEnergy: function (e) { e = Math.max(0, Math.min(1, +e || 0)); if (Math.abs(e - S.energy) < 0.01) return; S.energy = e; if (track && ctx) track.setEnergy(e, ctx.currentTime + 0.05); },
    prefetch: function () { load('master').catch(function () {}); load(S.id).catch(function () {}); },
    /* 0..1 loudness of what is playing right now — lets visuals move with the music */
    level: function () {
      if (!meter || !S.on || S.hidden || ctx.state !== 'running') { meterLevel *= 0.9; return meterLevel; }
      meter.getFloatTimeDomainData(meterBuf);
      var acc = 0; for (var i = 0; i < meterBuf.length; i++) acc += meterBuf[i] * meterBuf[i];
      var v = Math.min(1, Math.sqrt(acc / meterBuf.length) * 5);
      meterLevel = v > meterLevel ? v : meterLevel * 0.92 + v * 0.08;
      return meterLevel;
    },
    _debug: function () { return { ctx: ctx, out: out, track: track }; }   /* used by automated tests */
  };
})();
