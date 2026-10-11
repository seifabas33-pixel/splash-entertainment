/* Sand Script: the gold silk of "flow" gathers every ~15 s into a hieroglyph written in grains of light, then lets go. */
(function () {
  window.SA_SCENES = window.SA_SCENES || {};
  window.SA_SCENES['sand-script'] = function (ctx, env) {
  var M = Math, doc = document, PI = M.PI, rnd = M.random;
  /* sign, size x stack height (desktop), x base (phone) */
  var SEQ = [['ankh', 1.42, 1], ['wedjat', 0.95, 1], ['scarab', 1.45, 1], ['seif', 1.4, 1.06], ['sun', 1.2, 0.86], ['falcon', 1.25, 0.95]];
  var GATH = 4200, HOLD = 4600, REL = 1800, FREE = 4200, F = 0.08;
  var X, Y, OX, OY, VX, VY, LF, AX, AY, KA, KB, TA, RA, SP, PH, QX, QY, CX, CY, DL, ST, CT, W, H, lite, wide, rtl, su, ink, cells;
  var ew, eh, pd, U, bx, by, bw, bh, gx, gy, tg, th, tr, tn, P2 = {}, N = 0, K = 0, sw = 1, gi = 0, phase = -1, bs = 0, last = 0;
  var mus = 0, avg = 0, engA = 0, hold = 0, kk = 1, col = '#000', q = [0, 0, 0, 0], pz = q, txt = [];
  var eng = doc.createElement('canvas'), ec = eng.getContext('2d'), rc = doc.createElement('canvas'), rx = rc.getContext('2d', { willReadFrequently: true });

  function op(c, v) { c.globalCompositeOperation = v; }
  function dim(n) { return n === 'seif' ? { w: 270, h: 570, b: 3 } : env.glyphs().byName[n]; }
  function path(n) {
    if (P2[n]) return P2[n];
    var G = env.glyphs().byName, p;
    if (n !== 'seif') p = new Path2D(G[n].d);
    else {
      /* cartouche (oval + tie bar): s-y-f = cloth, two reeds, viper */
      p = new Path2D();
      p.moveTo(20, 115); p.arc(135, 115, 115, PI, 0); p.lineTo(250, 440); p.arc(135, 440, 115, 0, PI); p.closePath();
      p.moveTo(247, 115); p.arc(135, 115, 112, 0, PI, true); p.lineTo(23, 440); p.arc(135, 440, 112, PI, 0, true); p.closePath();
      p.rect(0, 553, 270, 15); p.moveTo(3, 556); p.lineTo(3, 565); p.lineTo(267, 565); p.lineTo(267, 556); p.closePath();
      [['cloth', 111, 55, 0.6], ['reed', 88, 262, 0.66], ['reed', 142, 262, 0.66], ['viper', 47, 445, 0.5]].forEach(function (s) {
        p.addPath(new Path2D(G[s[0]].d), new DOMMatrix([s[3], 0, 0, s[3], s[1], s[2]]));
      });
    }
    return (P2[n] = p);
  }
  function inR(r, x, y) { return x > r[0] && x < r[2] && y > r[1] && y < r[3]; }
  function spawn(i) {
    var x = rnd() * W, y = rnd() * H;
    if (inR(q, x, y) && rnd() < 0.6) { x = rnd() * W; y = rnd() * H; }
    X[i] = OX[i] = x; Y[i] = OY[i] = y; LF[i] = 60 + rnd() * 180;
  }
  /* real boxes of headline words, paragraph, video stack */
  function measure() {
    var hr = ctx.canvas.getBoundingClientRect(), u = [1e9, 1e9, -1e9, -1e9], i, a;
    function box(e, m) { e = e && e.getBoundingClientRect(); return e && e.width ? [e.left - hr.left - m, e.top - hr.top - m, e.right - hr.left + m, e.bottom - hr.top + m] : 0; }
    function grow(s, a) { for (var k = 0; k < 4; k++) s[k] = M[k < 2 ? 'min' : 'max'](s[k], a[k]); }
    rtl = doc.documentElement.dir === 'rtl'; txt = []; su = null;
    var els = doc.querySelectorAll('#heroTitle .split,#heroTitle .reel-pill');
    for (i = 0; i < els.length; i++) if ((a = box(els[i], 0))) { txt.push(a); grow(u, a); }
    if (!txt.length) txt.push(u = [W * 0.05, H * 0.28, W * (wide ? 0.56 : 0.95), H * (wide ? 0.62 : 0.57)]);
    q = [u[0] - 20, u[1] - 10, u[2] + 20, u[3] + 10]; pz = box(doc.querySelector('.hero-foot p'), 7) || [0, 0, 0, 0];
    els = doc.querySelectorAll('#heroStack .hs');
    for (i = 0; i < els.length; i++) if ((a = box(els[i], 0))) grow(su = su || [1e9, 1e9, -1e9, -1e9], a);
  }
  function place(s) {
    var d = dim(s[0]), a = d.w / d.h;
    if (su && wide) {
      /* LTR maths, mirrored for RTL */
      var e = rtl ? [W - q[0], W - su[2], W - su[0]] : [q[2], su[0], su[2]];
      bh = M.min((su[3] - su[1]) * s[1], H * 0.97); bw = bh * a;
      gx = M.min((e[1] + e[2]) / 2, M.max(e[0] + 40 + bw / 2, e[1] + bw * 0.1), W - bw / 2 - 8); gy = (su[1] + su[3]) / 2;
    } else {
      bh = M.min(H * 0.4, W * 0.95) * s[2]; bw = bh * a;
      if (bw > W * 0.84) { bw = W * 0.84; bh = bw / a; }
      gx = M.min(M.max(W * 0.66, bw / 2 - W * 0.04), W * 1.04 - bw / 2); gy = M.max(H * 0.965 - bh / 2, q[3] + 6 + bh / 2);
    }
    if (rtl) gx = W - gx;
    bx = gx - bw / 2; by = gy - bh / 2;
  }
  /* a sign is built over 3 frames. 1: raster, thin line, clear the headline */
  function raster() {
    measure(); var s = SEQ[gi], d = dim(s[0]), p = path(s[0]); place(s);
    U = (ctx.canvas.width / W || 1) * (wide ? 0.5 : 1); pd = M.ceil(12 * U);
    ew = rc.width = eng.width = M.ceil(bw * U) + 2 * pd; eh = rc.height = eng.height = M.ceil(bh * U) + 2 * pd;
    var k = bh * U / d.h, er = ((d.b || 5) * k - U * (wide ? 4.6 : 3.2)) / 2;
    function R(a, m) { return [(a[0] - bx - m) * U + pd, (a[1] - by - m * 0.7) * U + pd, (a[2] - a[0] + 2 * m) * U, (a[3] - a[1] + 1.4 * m) * U]; }
    rx.setTransform(k, 0, 0, k, pd, pd); rx.fill(p); op(rx, 'destination-out');
    if (er > 0.4) { rx.lineWidth = 2 * er / k; rx.lineJoin = 'round'; rx.stroke(p); }
    rx.setTransform(1, 0, 0, 1, 0, 0);
    txt.forEach(function (a) { rx.fillRect.apply(rx, R(a, 18)); });
    rx.globalAlpha = 0.4; rx.fillRect.apply(rx, R(pz, 0));
  }
  /* 2: grain targets, ~one per grid cell */
  function sample() {
    var dat = rx.getImageData(0, 0, ew, eh).data, len = ew * eh, n = 0, p, j, cs = U * (wide ? 4 : 2.7), km = (N * 0.72) | 0, P;
    if (!ink || ink.length < len) ink = new Int32Array(len);
    for (p = 0, j = 3; p < len; p++, j += 4) if (dat[j] > 100) ink[n++] = p;
    P = n % 7919 ? 7919 : 7907;
    do {
      var cw = M.ceil(ew / cs) + 1, nc = cw * (M.ceil(eh / cs) + 1);
      if (!cells || cells.length < nc) cells = new Uint8Array(nc); else cells.fill(0, 0, nc);
      for (K = j = 0; j < n && K < N; j++) {
        p = ink[(j * P) % n]; var px = p % ew, py = (p / ew) | 0, c = ((py / cs) | 0) * cw + ((px / cs) | 0);
        if (!cells[c]) { cells[c] = 1; KA[K] = bx + (px - pd + rnd()) / U; KB[K++] = by + (py - pd + rnd()) / U; }
      }
      cs *= 1.12;
    } while (K > km);
  }
  /* 3: faint engraving + aura, baked once */
  function paint() {
    ec.shadowColor = '#fff'; ec.shadowBlur = 5 * U; ec.globalAlpha = 0.45; ec.drawImage(rc, 0, 0);
    ec.shadowBlur = 0; ec.globalAlpha = 1; ec.drawImage(rc, 0, 0); tint(); rc.width = rc.height = 1;
  }
  function tint() { op(ec, 'source-in'); ec.fillStyle = col; ec.fillRect(0, 0, ew, eh); op(ec, 'source-over'); }
  /* K nearest grains get targets by angle + a twist, top first */
  function assign(now) {
    var ix = [], ot = [], i, r, t, dx, dy, off, cmp = function (a, b) { return TA[a] - TA[b]; };
    for (i = 0; i < N; i++) { ix.push(i); dx = X[i] - gx; dy = Y[i] - gy; TA[i] = dx * dx + dy * dy; }
    ix.sort(cmp); ix.length = K;
    for (i = 0; i < K; i++) { ot.push(i); RA[i] = M.atan2(KB[i] - gy, KA[i] - gx); r = ix[i]; TA[r] = M.atan2(Y[r] - gy, X[r] - gx); }
    ot.sort(function (a, b) { return RA[a] - RA[b]; }); ix.sort(cmp);
    sw = -sw; off = (K * 0.15) | 0; if (sw < 0) off = K - off;
    for (i = 0; i < K; i++) { r = ix[i]; t = ot[(i + off) % K]; AX[r] = KA[t]; AY[r] = KB[t]; ST[r] = 1; DL[r] = now + 1600 * (AY[r] - by) / bh + 700 * rnd(); }
    phase = 1;
  }
  function release(now) {
    for (var i = 0; i < N; i++) { if (ST[i] === 1 || ST[i] === 4) ST[i] = 0; else if (ST[i] === 2) { ST[i] = 3; DL[i] = now + 1000 * (AY[i] - by) / bh + 380 * rnd(); } }
    phase = 3;
  }
  function sched(now, lead) { phase = bs = 0; tg = now + lead; th = tg + GATH; tr = th + HOLD; tn = tr + REL; }
  function draw(k, a, s) {
    var c = ctx, n = 0, h = s / 2, i; c.beginPath();
    for (i = 0; i < N; i++) if (CT[i] === k) { n++; if (s) c.rect(X[i] - h, Y[i] - h, s, s); else { c.moveTo(OX[i], OY[i]); c.lineTo(X[i], Y[i]); } }
    if (n) { c.globalAlpha = M.min(1, a * kk); s ? c.fill() : c.stroke(); }
  }

  function step(S, now, f) {
    var c = ctx, pt = S.pointer, pon = pt.on, px = pt.x, py = pt.y, t = now, hc = 0, i;
    var m = env.music() || 0; mus += (m - mus) * (m > mus ? 0.35 : 0.08); avg += (mus - avg) * 0.01;
    var beat = M.max(0, mus - avg), sp = 1.5 * (1 + 0.5 * beat), br = 1 + 0.01 * beat;
    var glc = phase === 2 ? (now - th - 400) / 2600 * 1.4 - 0.2 : -9;
    op(c, 'destination-out'); c.globalAlpha = 1 - M.pow(1 - F, f); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    op(c, lite ? 'source-over' : 'lighter');
    engA += (hold * hold - engA) * M.min(1, 0.08 * f);
    if (engA > 0.01 && ew && !bs) { c.globalAlpha = engA * (lite ? 0.03 : 0.024) * (1 + 1.5 * beat) * kk; c.drawImage(eng, bx - pd / U, by - pd / U, ew / U, eh / U); }
    for (i = 0; i < N; i++) {
      var x = X[i], y = Y[i], s = ST[i], vx, vy, dx, dy, d, g;
      OX[i] = x; OY[i] = y;
      if (s === 2 || s === 3) {
        if (s === 3 && now >= DL[i]) {
          ST[i] = s = 0; dx = x - gx; dy = y - gy; d = M.hypot(dx, dy) + 1;
          VX[i] += dx / d * 1.3; VY[i] += dy / d * 1.3 - 0.3; LF[i] = 90 + rnd() * 160;
        } else {
          /* held: spring, shimmer, beat breath, parts under a finger */
          var ph = PH[i], tx = gx + (AX[i] - gx) * br + 0.55 * M.sin(t * 0.0023 + ph), ty = gy + (AY[i] - gy) * br + 0.55 * M.cos(t * 0.0019 + ph * 1.3);
          vx = (VX[i] + (tx - x) * 0.1 * f) * 0.8; vy = (VY[i] + (ty - y) * 0.1 * f) * 0.8;
          if (pon) {
            dx = x - px; dy = y - py; d = dx * dx + dy * dy;
            if (d < 14400) { g = (1 - d / 14400) * 1.6; d = M.sqrt(d) + 0.01; vx += (dx - dy * 0.8) / d * g; vy += (dy + dx * 0.8) / d * g; }
          }
          VX[i] = vx; VY[i] = vy; X[i] = x += vx * f; Y[i] = y += vy * f; hc++;
          g = (x - bx) / bw * 0.55 + (y - by) / bh * 0.45;
          CT[i] = vx * vx + vy * vy > 0.5 ? 2 : M.abs(g - glc) < 0.045 ? 5 : inR(pz, x, y) ? 7 : 3 + (i & 1);
          continue;
        }
      }
      if (s === 1 && now >= DL[i]) {
        /* take off: eased polar spiral + drift momentum */
        dx = x - gx; dy = y - gy; d = M.atan2(AY[i] - gy, AX[i] - gx) - M.atan2(dy, dx);
        d -= 2 * PI * M.round((d - sw * 1.2) / (2 * PI));
        QX[i] = M.hypot(dx, dy); QY[i] = M.atan2(dy, dx); CY[i] = d; dx = AX[i] - gx; dy = AY[i] - gy; CX[i] = M.hypot(dx, dy) - QX[i];
        KA[i] = VX[i]; KB[i] = VY[i]; d = M.abs(CX[i]) + M.abs(d) * (QX[i] + CX[i] / 2);
        SP[i] = 1600 + d * 0.8 + rnd() * 500; DL[i] = now; ST[i] = s = 4;
      }
      if (s === 4) {
        g = (now - DL[i]) / SP[i];
        if (g >= 1) { ST[i] = 2; X[i] = AX[i]; Y[i] = AY[i]; VX[i] = VY[i] = 0; CT[i] = 3; continue; }
        var e = 0.5 - 0.5 * M.cos(PI * g), rr = QX[i] + CX[i] * e, aa = QY[i] + CY[i] * e, mo = g * (1 - g) * (1 - g) * SP[i] * 0.021;
        X[i] = gx + rr * M.cos(aa) + KA[i] * mo; Y[i] = gy + rr * M.sin(aa) + KB[i] * mo;
        VX[i] = X[i] - x; VY[i] = Y[i] - y; CT[i] = 2; continue;
      }
      /* free: the flow field, stirred on the beat */
      var a = M.sin(x * 0.0021 + t * 0.00013) * 1.8 + M.cos(y * 0.0026 - t * 0.00011) * 1.8 + M.sin((x + y) * 0.0008 + t * 0.00006) * 1.2;
      g = M.min(1, 0.16 * f);
      vx = VX[i] += (M.cos(a) * sp - VX[i]) * g; vy = VY[i] += (M.sin(a) * sp - VY[i]) * g;
      if (pon) {
        dx = x - px; dy = y - py; d = dx * dx + dy * dy;
        if (d < 44100) { g = (1 - d / 44100) * 3.4; d = M.sqrt(d) + 0.01; vx += (-dy - dx * 0.25) / d * g; vy += (dx - dy * 0.25) / d * g; }
      }
      X[i] = x += vx * f; Y[i] = y += vy * f;
      if (s === 0 && ((LF[i] -= f) <= 0 || x < -10 || x > W + 10 || y < -10 || y > H + 10)) { spawn(i); CT[i] = 0; continue; }
      CT[i] = inR(q, x, y) ? 6 : 1;
    }
    hold = K ? hc / K : 0;
    c.lineWidth = 1.2; c.strokeStyle = c.fillStyle = col;
    draw(6, lite ? 0.15 : 0.12); draw(1, lite ? 0.36 : 0.32); draw(2, lite ? 0.4 : 0.34);
    var tw = 0.5 + 0.5 * M.sin(now * 0.0031), gA = (lite ? 0.19 : 0.08) * (1 + beat), gs = (wide ? 1.6 : 1.4) * (1 + 0.4 * beat);
    draw(3, gA * (0.6 + 0.8 * tw), gs); draw(4, gA * (1.4 - 0.8 * tw), gs); draw(5, gA * 2.4, gs + 0.5); draw(7, gA * 0.6, gs);
    c.globalAlpha = 1; op(c, 'source-over');
  }

  return {
    lowRes: true,
    init: function (S) {
      W = S.W; H = S.H; wide = W >= 1000;
      var n = W < 700 ? 900 : wide ? 2000 : 1200, i, A = function () { return new Float32Array(n); };
      if (n !== N) {
        N = n; [X, Y, OX, OY, VX, VY, LF, AX, AY, KA, KB, TA, RA, SP, PH, QX, QY, CX, CY] = Array.from({ length: 19 }, A);
        DL = new Float64Array(n); ST = new Uint8Array(n); CT = new Uint8Array(n);
      }
      measure();
      for (i = 0; i < N; i++) { spawn(i); ST[i] = 0; VX[i] = VY[i] = 0; PH[i] = rnd() * 6.283; }
      ctx.clearRect(0, 0, W, H); engA = K = 0;
      if (phase >= 0) sched(performance.now(), 600);
    },
    theme: function (S) {
      lite = S.light; col = 'rgb(' + S.rgb + ')'; kk = S.k;
      if (ew) tint();
      ctx.clearRect(0, 0, W, H);
    },
    frame: function (S, now) {
      if (!N || !env.glyphs()) return;
      if (env.reduce) {
        ctx.clearRect(0, 0, W, H); ST.fill(0); raster(); sample(); paint(); assign(now);
        for (var i = 0; i < N; i++) if (ST[i]) { X[i] = AX[i]; Y[i] = AY[i]; ST[i] = 2; }
        phase = 2; th = now - 1e6;
        for (i = 0; i < 70; i++) step(S, now + i * 16.7, 1);
        return;
      }
      var f = last ? M.min(3, M.max(0.25, (now - last) / 16.67)) : 1; last = now;
      if (phase < 0) sched(now, 700);
      if (!phase) {
        if (!bs) { if (now >= tg - 500) { raster(); bs = 1; } } else if (bs === 1) { sample(); bs = 2; } else if (bs === 2) { paint(); bs = 3; } else if (now >= tg) { assign(now); bs = 0; }
      } else if (phase === 1 && now >= th) phase = 2;
      else if (phase === 2 && now >= tr) release(now);
      else if (phase === 3 && now >= tn) { gi = (gi + 1) % SEQ.length; sched(now, FREE); }
      step(S, now, f);
    },
    destroy: function () {
      eng.width = eng.height = rc.width = rc.height = ew = N = K = 0; P2 = {}; ink = cells = null;
      X = Y = OX = OY = VX = VY = LF = AX = AY = KA = KB = TA = RA = SP = PH = QX = QY = CX = CY = DL = ST = CT = null;
    }
  };
  };
})();
