/* Red Sea Night: maqam Hijaz on D, Egyptian intonation, 84 BPM. Drone, Karplus-Strong oud & qanun, pads, frame drum, nay. */
(function () {
var IRC = {}; // reverb IR per sample rate
function create(ctx, out, opts) {
var sd = (((opts && opts.seed) || 7) * 2654435761) >>> 0, ns = 9871;
var rnd = () => { sd = (sd + 0x6D2B79F5) | 0; var t = Math.imul(sd ^ (sd >>> 15), 1 | sd); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
var nr = () => (ns = (Math.imul(ns, 1103515245) + 12345) | 0) / 2147483648;
var rr = (a, b) => a + (b - a) * rnd(), pick = (a) => a[(rnd() * a.length) | 0], cg = () => ctx.createGain(), hz = (m) => 440 * Math.pow(2, (m - 69 + (m % 12 === 3 ? 0.1 : m % 12 === 6 ? -0.1 : 0)) / 12);
var SR = ctx.sampleRate, BEAT = 60 / 84, BAR = 4 * BEAT, Q = BEAT / 4, keep = [], pers = [], pend = new Set(), now = () => ctx.currentTime;
var LV = 0.8, E = 0.5, night = true, live = false, stopped = false, tS = 0, wt = 0, nextT = 0, bar = 0, secN = -1, S = {}, mot = null, cur = 7, lastK = -1;
function G(v, d) { var g = cg(); g.gain.value = v; if (d) g.connect(d); keep.push(g); return g; }
function F(ty, f, q, d) { var b = ctx.createBiquadFilter(); b.type = ty; b.frequency.value = f; b.Q.value = q; if (d) b.connect(d); keep.push(b); return b; }
function PN(p, d) { var n = ctx.createStereoPanner(); n.pan.value = p; n.connect(d); keep.push(n); return n; }
function O(w, f, d) { var o = ctx.createOscillator(); if (typeof w === 'string') o.type = w; else o.setPeriodicWave(w); o.frequency.value = f; if (d) o.connect(d); return o; }
function wave(h) { var re = new Float32Array(h.length + 1), im = re.slice(); h.forEach((a, i) => { im[i + 1] = a; }); return ctx.createPeriodicWave(re, im); }
var env = (p, t, v, a, r, k) => { p.setValueAtTime(0, t); p.linearRampToValueAtTime(v, t + a); p.setTargetAtTime(0, r, k); };
var done = (s, a, t) => { var r = { a: a, t: t }; pend.add(r); s.onended = () => { pend.delete(r); a.forEach((n) => n.disconnect()); }; }, at = (t) => Math.max(isFinite(t) ? +t : 0, now() + 0.01);

/* master, shared reverb, ping-pong delay */
var master = G(0, out), ls = F('lowshelf', 230, 0, master), tone = F('lowpass', 4000, 0.5, ls); ls.gain.value = -4.5;
var revIn = F('highpass', 220, 0.6), conv = ctx.createConvolver(), revRet = G(0.6, tone); keep.push(conv);
if (!IRC[SR]) {
  var L3 = SR * 3, L = (SR * 2.4) | 0, ir = IRC[SR] = ctx.createBuffer(2, L, SR), k = Math.exp(-2.6 / L3);
  for (var c = 0; c < 2; c++) for (var d = ir.getChannelData(c), lp = 0, e = 1, i = 0; i < L; i++, e *= k) { var y = 1 - i / L3; lp += (0.08 + 0.42 * y) * (nr() - lp); d[i] = lp * e * y * Math.sqrt(y) * Math.min(1, i / (SR * 0.02), (L - i) / (SR * 0.1)); }
}
conv.buffer = IRC[SR]; revIn.connect(conv); conv.connect(revRet);
var dIn = G(1), dA = ctx.createDelay(1.5), dB = ctx.createDelay(1.5), dlp = F('lowpass', 2300, 0.5), dfb = G(0.4), dOut = G(0.42, tone); keep.push(dA, dB);
dA.delayTime.value = dB.delayTime.value = 3 * Q; dOut.connect(revIn);
dIn.connect(dlp); dlp.connect(dA); dA.connect(dB); dB.connect(dfb); dfb.connect(dlp); dA.connect(PN(-0.7, dOut)); dB.connect(PN(0.7, dOut));
var bus = (send, v) => { var b = G(v, tone); b.connect(G(send, revIn)); return b; };
var drB = bus(0.25, 0), padB = bus(0.6, 0), oudB = bus(0.38, 1), drumB = bus(0.18, 0), nayB = bus(0.7, 1);

/* drone D2/A2/D3; the fifth (dk) dips under Bb/Eb chords */
var drF = F('lowpass', 560, 0.9, F('highpass', 70, 0.6, drB)), drT = G(0.06, drF), dk = G(1, drF), drV = G(0.055, dk), l1 = O('sine', 0.061), l2 = O('sine', 0.043);
l1.connect(G(0.03, drT.gain)); l1.connect(G(150, drF.frequency)); l2.connect(G(0.028, drV.gain));
pers.push(l1, l2, O('sawtooth', hz(38), PN(-0.3, drT)), O('sawtooth', hz(38), PN(0.3, drT)), O('sawtooth', hz(45), PN(0.25, drV)), O('triangle', hz(50), PN(-0.2, drV)));
pers[2].detune.value = -6; pers[3].detune.value = 6; pers[4].detune.value = 3;

/* pads; chorus tap at half level (mono-safe) */
var padW = wave([1, 0.42, 0.26, 0.15, 0.11, 0.06, 0.045, 0.03, 0.02, 0.015]);
var padF = F('lowpass', 1100, 0.7, F('highpass', 160, 0.5, padB)), padIn = G(1.25), chD = ctx.createDelay(0.1), chL = O('sine', 0.19); keep.push(chD);
chD.delayTime.value = 0.017; chL.connect(G(0.004, chD.delayTime)); pers.push(chL);
padIn.connect(PN(-0.3, padF)); padIn.connect(chD); chD.connect(G(0.5, PN(0.55, padF)));
function padNote(m, t, dur, v) {
  var o = O(padW, hz(m)), g = cg(), dt = rr(-6, 6); dur = Math.max(2, dur);
  o.detune.setValueAtTime(dt, t); o.detune.linearRampToValueAtTime(dt + rr(-5, 5), t + dur + 2);
  env(g.gain, t, v, 1.9, t + dur, 0.45); o.connect(g); g.connect(padIn); o.start(t); o.stop(t + dur + 1.9); done(o, [o, g], t);
}

/* strings: SC = D Hijaz D3..Eb6 (7 = D4); oud has a paired-course delay */
var SC = []; [50, 62, 74].forEach((o) => [0, 1, 4, 5, 7, 8, 10].forEach((s) => SC.push(o + s))); SC.push(86, 87);
var KS = {}, oudBody = F('peaking', 230, 1.2), oudLP = F('lowpass', 3600, 0.6, oudB), crs = ctx.createDelay(0.05); oudBody.gain.value = 4; oudBody.connect(oudLP); keep.push(crs);
oudLP.connect(G(0.22, dIn)); var oudP = PN(-0.15, oudBody), qanP = PN(0.35, oudBody);
crs.delayTime.value = 0.009; chL.connect(G(0.0003, crs.delayTime)); oudP.connect(crs); crs.connect(G(0.2, oudBody));
function ks(m, q) {
  var key = m + (q ? 'q' : 'o'); if (KS[key]) return KS[key];
  var f = hz(m), t60 = (q ? 3 : 2.1) * Math.pow(147 / f, 0.45), len = (SR * Math.min(2.4, t60 * 0.8 + 0.15)) | 0,
    b = ctx.createBuffer(1, len, SR), d = b.getChannelData(0), P0 = SR / f - 0.5, N = P0 | 0, fr = P0 - N, rho = 0.5 * Math.pow(0.001, 1 / (f * t60)),
    a = q ? 0.6 : 0.4, pp = Math.max(1, Math.round(N * (q ? 0.09 : 0.19))), lp = 0, mean = 0, pk = 0, i, x, fade = (SR * 0.08) | 0,
    s = m * 7919 + (q ? 3 : 1), rn = () => (s = (Math.imul(s, 1103515245) + 12345) | 0) / 2147483648;
  for (i = 0; i < N + 2; i++) { lp += a * (rn() - lp); d[i] = lp; }
  for (i = N + 1; i >= pp; i--) d[i] -= d[i - pp];
  for (i = 0; i < N + 2; i++) mean += d[i] / (N + 2);
  for (i = 0; i < N + 2; i++) { x = d[i] -= mean; pk = Math.max(pk, Math.abs(x)); }
  for (i = N + 2; i < len; i++) { x = d[i] = rho * ((1 - fr) * (d[i - N] + d[i - N - 1]) + fr * (d[i - N - 1] + d[i - N - 2])); if (x > pk || -x > pk) pk = Math.abs(x); }
  for (i = len - fade; i < len; i++) d[i] *= (len - i) / fade;
  b.k = 1 / pk; return (KS[key] = b);
}
var WQ = []; for (i = 22; i > 6; i--) WQ.push([SC[i], 1]); for (i = 0; i < 16; i++) WQ.push([SC[i], 0]);
function warm() { if (stopped || !WQ.length) return; var w = WQ.pop(); ks(w[0], w[1]); wt = setTimeout(warm, 25); } // pre-build off the scheduler
function pluck(ix, t, v, dur, q, orn, u) {
  if (t < now()) return;
  var m = SC[ix], nb = ix % 7 === 1 ? ix - 1 : Math.min(ix + 1, 22), b = ks(m, q), s = ctx.createBufferSource(), g = cg(), f = ctx.createBiquadFilter(),
    e = t + Math.min(dur, b.duration - 0.05), r = s.playbackRate, up = hz(SC[nb]) / hz(m);
  if (q && orn != null) { if (orn === 'm' || orn === 'g') pluck(nb, t - 0.05, v * 0.5, 0.1, q); orn = null; } // qanun: grace, no bend
  s.buffer = b; f.frequency.value = (1200 + 3600 * v) * (u ? 0.65 : 1); f.Q.value = 0.5; // velocity brightness
  env(g.gain, t, v * (q ? 0.24 : 0.45) * b.k, 0.002, e, 0.03);
  if (orn === 'm') { r.setValueAtTime(1, t); r.setValueAtTime(up, t + 0.07); r.setValueAtTime(1, t + 0.13); }
  else if (orn === 'g') { r.setValueAtTime(up, t); r.setValueAtTime(1, t + 0.065); }
  else if (orn != null) { r.setValueAtTime(hz(SC[orn]) / hz(m), t); r.setTargetAtTime(1, t + 0.035, 0.03); }
  s.connect(g); g.connect(f); f.connect(q ? qanP : oudP); s.start(t); s.stop(e + 0.2); done(s, [s, g, f], t);
}
function playLine(L, t, q, t0) {
  var tt = t, prev = -1, u = 0;
  L.forEach((n, k) => {
    var d = n[1] * Q, last = k === L.length - 1, pos = Math.round((tt - t0) / Q) % 4, orn = null,
      v = (pos === 0 ? 0.95 : pos === 2 ? 0.78 : 0.66) * rr(0.82, 1) * (0.85 + 0.15 * Math.sin(Math.PI * (k + 0.5) / L.length));
    u = n[0] === prev ? 1 - u : 0; // up-stroke
    if (prev >= 0 && Math.abs(n[0] - prev) === 1 && n[1] >= 3 && rnd() < 0.3) orn = prev;
    else if (n[1] >= 4 && rnd() < 0.14) orn = 'm'; else if (k && n[1] <= 2 && rnd() < 0.08) orn = 'g';
    if (last && n[1] >= 6 && !q && E > 0.4 && rnd() < 0.05) {
      for (var i = 0, c = Math.min(8, n[1] * 2); i < c; i++) pluck(n[0], tt + i * Q / 2 + rr(-0.004, 0.004), v * (0.5 + 0.35 * Math.sin(Math.PI * (i + 0.5) / c)), i === c - 1 ? 2.2 : Q / 2 + 0.02, 0, null, i % 2);
    } else pluck(n[0], tt + rr(-0.008, 0.008) + (pos % 2 ? Q * 0.08 : 0), v, last ? 2.4 : d + 0.07, q, orn, u);
    prev = n[0]; tt += d;
  });
  return tt;
}

/* melody: motif, variations, answers, licks; rests D > G > A, never a semitone off the chord */
var LICK = ['10.2 9.1 8.1 7.8', '11.2 10.1 9.1 10.1 9.1 8.2 7.8', '8.1 9.1 10.1 11.3 10.1 9.1 8.2 7.6', '6.2 7.1 8.1 7.8', '12.2 11.2 10.1 9.1 10.8', '4.2 5.1 4.1 3.2 2.1 1.1 0.8', '14.2 13.1 12.1 11.2 10.8']
  .map((l) => l.split(' ').map((n) => n.split('.').map(Number)));
var CELLS = [[4], [2, 2], [2, 2], [3, 1], [3, 1], [1, 1, 2], [2, 1, 1], [1, 1, 1, 1]];
function motif() { var r = [], s = [], n = pick([2, 2, 3]), k; for (k = 0; k < n; k++) r = r.concat(pick(CELLS)); for (k = 0; k < r.length; k++) s.push(k ? pick([1, 1, 1, 1, 2, 2, 3, 0]) * (rnd() < (k < r.length / 2 ? 0.62 : 0.3) ? 1 : -1) : 0); return { r: r, s: s }; }
var cl = (i, a, b) => Math.max(a || 2, Math.min(b || 15, i)), fin = (L) => L[L.length - 1][0], isDG = (i) => i % 7 === 0 || i % 7 === 3;
var bad = (i, ch) => CH[ch].some((m) => { var x = (SC[i] - m + 120) % 12; return x === 1 || x === 11; });
function stable(i, ch, lo, hi) {
  var b = -1, bc = 99, P = [0, , , 1, rnd() < 0.4 ? 1 : 9], j, p, c;
  for (j = lo || 2; j <= (hi || 15); j++) { p = P[j % 7]; c = Math.abs(j - i) + p + (j > i ? 0.1 : 0); if (p != null && c < bc && !bad(j, ch)) { b = j; bc = c; } }
  return b < 0 ? i : b;
}
function realize(M, ix, vary, ch) {
  var L = [], n = M.r.length;
  for (var k = 0; k < n; k++) { var dx = vary && k >= n - 2 ? pick([-1, 1, -2]) : M.s[k]; ix = cl(ix + dx < 2 || ix + dx > 15 ? ix - dx : ix + dx); L.push([ix, M.r[k]]); }
  var f = stable(ix, ch); if (f === ix) L[n - 1][1] += pick([4, 6, 8]); else L.push([f, pick([6, 8, 8, 10])]);
  return L;
}
function line(ty, ch) {
  var c = 7 + S.hi + (night ? 0 : 1), L, m;
  if (ty === 'S') { var a = stable(c + pick([-3, 0, 1, 4]), ch); L = rnd() < 0.5 ? [[a, 12]] : [[cl(a + 1), 2], [a, 10]]; }
  else if (ty === 'C') {
    var ok = LICK.filter((l) => !bad(fin(l), ch)), dl = ok.filter((l) => fin(l) % 7 === 0);
    L = pick(!S.dEnd && dl.length ? dl : ok).map((n) => n.slice()); m = L.length;
    if (night && rnd() < 0.35 && L[0][0] > 9) L.forEach((n) => { n[0] -= 7; });
    if (rnd() < 0.35) { if (rnd() < 0.5 && L[m - 3][1] > 1) { L[m - 3][1]--; L[m - 2][1]++; } else L.unshift([cl(L[0][0] + pick([1, -1])), 1]); }
  }
  else if (ty === 'A') L = realize(motif(), cl(c + pick([1, 2, 3])), 0, ch);
  else L = realize(mot, ty === 'V' ? cl(cur + pick([3, -3, 2, -2])) : cl(c + pick([-1, 0, 1])), ty === 'V', ch);
  cur = fin(L); if (cur % 7 === 0) S.dEnd = 1; return L;
}
function arp(ch) { // falls to rest on D or G
  var t = CH[ch].map((m) => SC.indexOf(m + 12)).sort((a, b) => b - a), f = t[1];
  if (!isDG(f)) for (f = t[2] - 1; !isDG(f) || bad(f, ch); f--);
  return [[t[0], 2], [t[1], 2], [t[2], 2], [f, 8]];
}
var answer = (L, ch) => rnd() < 0.6 ? L.slice(-3).map((n, k, a) => [Math.min(22, n[0] + 7), k === a.length - 1 ? 8 : n[1]]) : arp(ch);
function slot(si, t) {
  if (E < 0.08) return; // bed only
  var ty = S.plan[si], ch = S.prog[si];
  if (S.nay && si === S.ns) return nay(t, ch);
  if (si === 0) S.n = 0;
  if (S.br && (si === 1 || si === 2)) { if (E > 0.4) playLine(arp(ch).map((n) => [n[0], n[1] * 2]), t + Q * pick([0, 2, 4]), 1, t); return; } // breath
  if (!(secN === 0 && si === 0) && !(E >= 0.4 && si === 3 && (S.n < 2 || !S.dEnd)) && rnd() > (E < 0.3 ? 0.28 : 0.45 + 0.55 * E)) return;
  S.n++; if (E < 0.3) ty = 'S';
  var L = line(ty, ch), end = playLine(L, t + pick([0, 0, 0, 2, 4]) * Q + (secN || si ? 0 : BAR), 0, t);
  if (E > 0.6 && ty !== 'S' && rnd() < (night ? 0.5 : 0.8)) {
    var A = answer(L, ch), a0 = end + Q * pick([2, 4]), len = 0; A.forEach((n) => { len += n[1]; });
    if (a0 + (len - 6) * Q < t + 2 * BAR) playLine(A, a0, 1, t);
  }
}

/* nay F#4-A5: tone + breath noise, glides, vibrato; no D-Eb-D */
var nayW = wave([1, 0.3, 0.13, 0.06, 0.03, 0.02]), nayBP = F('bandpass', 1200, 2, nayB), nayP = PN(0.12, nayB);
var NZ = ctx.createBuffer(1, SR, SR), nd = NZ.getChannelData(0); for (i = 0; i < SR; i++) nd[i] = nr();
function nay(t, ch) {
  var rh = pick([[8, 4, 14], [6, 2, 8, 12], [12, 4, 12], [4, 4, 8, 12]]), ix = pick([11, 14, 16]), tt = t + Q * pick([0, 2, 4]);
  if (t < now()) return;
  var o = O(nayW, hz(SC[ix])), g = cg(), vb = O('sine', rr(4.6, 5.4)), vd = cg(), n = ctx.createBufferSource(), ng = cg(), v = 0.075;
  vb.connect(vd); vd.connect(o.detune); o.connect(g); g.connect(nayP); n.buffer = NZ; n.loop = true; n.connect(ng); ng.connect(nayBP);
  [g, ng, vd].forEach((x) => x.gain.setValueAtTime(0, t));
  rh.forEach((r, k) => {
    if (k) { var p = ix; ix = k === rh.length - 1 ? stable(ix + pick([-1, 0]), ch, 9, 18) : cl(ix + pick([-1, -1, 1, -2]), 9, 18); if (p % 7 === 0 && ix === p + 1) ix = p - 1; }
    var f = hz(SC[ix]), d = r * Q;
    if (k) { g.gain.setTargetAtTime(v * 0.55, tt - 0.09, 0.03); o.frequency.setTargetAtTime(f, tt - 0.02, 0.03); }
    g.gain.setTargetAtTime(v * (k === rh.length - 1 ? 0.9 : 1), tt, k ? 0.05 : 0.3); nayBP.frequency.setTargetAtTime(f * 2, tt, 0.05);
    ng.gain.setTargetAtTime(0.07, tt, 0.04); ng.gain.setTargetAtTime(0.022, tt + 0.15, 0.2);
    vd.gain.setTargetAtTime(2, tt, 0.05); vd.gain.setTargetAtTime(14, tt + d * 0.3, d * 0.2);
    tt += d;
  });
  g.gain.setTargetAtTime(0, tt - 0.4, 0.2); ng.gain.setTargetAtTime(0, tt - 0.4, 0.15); o.detune.setValueAtTime(0, t); o.detune.setTargetAtTime(-25, tt - 0.3, 0.2);
  [o, vb, n].forEach((s) => { s.start(t); s.stop(tt + 1.5); }); done(o, [o, g, vb, vd, n, ng], t);
}

/* frame drum in key: doum = D2 sub + D3/A3/D4 body + slap; tek rings A5 */
var dmW = wave([0, 0.4, 0.18, 0.1]), tekF = F('bandpass', 2200, 1.2, PN(0.2, drumB)), kaF = F('bandpass', 1800, 1.3, PN(-0.25, drumB)), thF = F('bandpass', 400, 0.7, drumB);
function one(s, t, v, dec, dst, off) { var g = cg(); env(g.gain, t, v, 0.003, t + 0.004, dec); s.connect(g); g.connect(dst); s.start(t, off); s.stop(t + dec * 5); done(s, [s, g], t); }
var nz = (t, dst, v, dec) => { var s = ctx.createBufferSource(); s.buffer = NZ; one(s, t, v, dec, dst, rnd() * 0.7); };
var ton = (t, f0, f1, v, dec, w) => { var o = O(w || 'sine', f0); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.13); one(o, t, v, dec, drumB, 0); };
function hit(k, t, v) {
  if (t < now()) return;
  if (k === 'D') { ton(t, 92, 73.4, v * 0.25, 0.1); ton(t, 76, 73.4, v * 0.5, 0.09, dmW); nz(t, thF, v * 0.5, 0.025); }
  else if (k === 'T') { nz(t, tekF, v * 0.6, 0.012); ton(t, 880, 875, v * 0.1, 0.06); }
  else nz(t, kaF, v * 0.45, 0.024);
}
/* maqsum, baladi, saidi, light */
var PAT = { m: 'D.T...T.D...T...', b: 'D.D...T.D...T...', s: 'D.T...D.D...T...', l: 'D.......D...T...' }, FILL = ['TKTKKT', 'T.TKKT', 'TKT.KT', 'D.TKKT'];
function drums(bi, t) {
  if (E < 0.33 || (secN === 0 && bi < 4)) return;
  var full = E >= 0.72, brk = full && S.brk && bi > 5, p = full && !brk ? S.rh : PAT.l, gm = S.gm.slice();
  for (var k = rnd() < 0.5 ? 1 : 2; k--;) { var x = (rnd() * 16) | 0; gm[x] = !gm[x]; }
  for (var i = 0; i < 16; i++) {
    var c = p[i], v = 0, tt = t + i * Q + (i % 2 ? Q * 0.1 : 0) + rr(-0.006, 0.006);
    if (c !== '.') v = (c === 'D' ? (i ? 0.78 : 1) : (i === 12 ? 0.72 : 0.58)) * rr(0.85, 1) * (full && !brk ? 1 : 0.75);
    else if (full && !brk && gm[i]) { c = 'K'; v = rr(0.2, 0.42); }
    if (full && bi === 7 && i >= 10) { c = S.fl[i - 10]; v = c === '.' ? 0 : (0.35 + (i - 10) * 0.07) * rr(0.85, 1); }
    if (v) hit(c, tt, v);
  }
}

/* harmony over the D pedal, 2 bars per chord */
var CH = { D: [54, 57, 62, 66], Eb: [55, 58, 63, 67], Gm: [55, 58, 62, 67], Cm: [55, 60, 63, 67], Bb: [54, 58, 62, 66], Am: [55, 57, 60, 63], S4: [55, 57, 62, 67], D7: [54, 57, 60, 66] };
var PROG = [['D', 'Eb', 'Gm', 'D'], ['D', 'Cm', 'Eb', 'D'], ['Gm', 'Cm', 'Eb', 'D'], ['D', 'Bb', 'Gm', 'Eb'], ['Cm', 'Eb', 'S4', 'D'], ['Gm', 'Eb', 'Am', 'D7'], ['D', 'S4', 'Cm', 'D']];
function newSection(sec) {
  var k, prevEb = S.prog && S.prog[3] === 'Eb';
  do { k = (rnd() * PROG.length) | 0; } while (k === lastK || ((prevEb || sec === 0) && PROG[k][0] !== 'D'));
  lastK = k; secN = sec; S.prog = PROG[k]; S.hi = PROG[k][0] === 'Gm' ? 3 : 0; S.dEnd = 0;
  S.nay = sec > 0 && !S.nay && rnd() < (night ? 0.45 : 0.2); S.ns = pick([1, 3]);
  S.plan = sec === 0 ? ['S', 'M', 'V', 'C'] : pick([['M', 'V', 'A', 'C'], ['M', 'M', 'V', 'C'], ['A', 'M', 'V', 'C'], ['M', 'A', 'V', 'C']]);
  S.br = sec > 1 && !S.br && rnd() < 0.2; S.brk = !S.br && sec > 1 && rnd() < 0.15; // breath (qanun leads) / drum break
  S.rh = rnd() < 0.7 ? PAT.m : rnd() < 0.85 ? PAT.b : PAT.s; S.fl = pick(FILL);
  for (S.gm = [], k = 0; k < 16; k++) S.gm.push(rnd() < (k % 2 ? 0.12 : 0.5));
  if (!mot || rnd() < 0.55) mot = motif();
}
function genBar(b, t) {
  var bi = b % 8; if (((b / 8) | 0) !== secN) newSection((b / 8) | 0);
  if (bi % 2 === 0) {
    var j = bi / 2, p = S.prog, c = CH[p[j]], ps = at(t - 0.3), late = ps - (t - 0.3); late = late > 0.5 ? late : 0; // late call
    c.forEach((m, i) => { if (j && CH[p[j - 1]][i] === m) return; for (var n = j + 1; n < 4 && CH[p[n]][i] === m; n++); padNote(m, ps, (n - j) * 2 * BAR - late, (i === 3 ? 0.036 : 0.045) * rr(0.9, 1)); });
    if (!night) padNote(c[3] + 12, ps, 2 * BAR - late, 0.02);
    dk.gain.setTargetAtTime(c.indexOf(57) < 0 && (c.indexOf(58) >= 0 || c.indexOf(63) >= 0) ? 0.5 : 1, ps, 0.6);
    slot(j, t);
  }
  drums(bi, t);
}
function apply(t, k) {
  var T = (p, v) => p.setTargetAtTime(v, t, k);
  T(tone.frequency, night ? 4000 : 6500); T(revRet.gain, night ? 0.62 : 0.38); T(dfb.gain, night ? 0.42 : 0.3);
  T(drB.gain, (night ? 1 : 0.75) * (1 - 0.3 * E)); T(padB.gain, (night ? 1 : 0.85) * (1 - 0.25 * E));
  T(padF.frequency, (night ? 1100 : 1700) + 900 * E); T(drumB.gain, E < 0.33 ? 0 : 0.6 + 0.65 * E); T(oudB.gain, 0.92 + 0.15 * E); T(oudLP.frequency, night ? 3300 : 5000);
}
apply(now(), 0.01);
return {
  start: function (t) { if (live) return; t = tS = at(t); live = true; master.gain.setValueAtTime(0, t); master.gain.linearRampToValueAtTime(LV, t + 3); pers.forEach((o) => o.start(t)); nextT = t + 0.05; apply(t, 0.05); wt = setTimeout(warm, 50); },
  stop: function (t) {
    if (stopped || !live) return; t = at(t);
    var g = master.gain; // no cancel gap
    g.linearRampToValueAtTime(LV * Math.min(1, Math.max(0, (t - tS) / 3)), t); g.cancelScheduledValues(t + 1e-4); g.linearRampToValueAtTime(0, t + 2.4);
    stopped = true; clearTimeout(wt); pers.forEach((o) => o.stop(t + 3));
    pend.forEach((r) => { if (r.t > t + 0.005) r.a.forEach((x) => x.disconnect()); }); // drop look-ahead notes
  },
  scheduleUntil: function (t) {
    if (!live || stopped) return;
    while (nextT + BAR < now()) { nextT += BAR; bar++; } // throttled tab: skip lost bars
    while (nextT < t) { genBar(bar, nextT); bar++; nextT += BAR; }
  },
  setMood: function (m, t) { night = m !== 'day'; apply(at(t), 1); },
  setEnergy: function (e, t) { E = Math.max(0, Math.min(1, +e || 0)); apply(at(t), 1); },
  dispose: function () {
    stopped = true; clearTimeout(wt); KS = {};
    pers.concat(keep).forEach((n) => { try { if (n.stop) n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} });
  }
};
}
window.SA_MUSIC = window.SA_MUSIC || {};
window.SA_MUSIC['red-sea-night'] = { title: 'Red Sea Night', key: 'D Hijaz', tempo: 84, scalePCs: [2, 3, 6, 7, 9, 10, 0], create: create };
})();
