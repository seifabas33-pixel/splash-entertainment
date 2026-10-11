/* Inscription: an invisible scribe writes short columns of hieroglyphs in gold leaf. Each sign is drawn in its
   writing direction (top-down; flat signs left-to-right) behind a molten front that cools as it passes. Finished
   columns rest, catch a slow diagonal sheen and fade while new ones start elsewhere, placed from the live layout so
   the headline, text and video cards stay clear (RTL too). Now and then a column writes SEIF in a cartouche.
   Pointer: nearby signs lift and brighten. Music: a sign on every beat; sheens and ink pulse gently. */
(function () {
window.SA_SCENES = window.SA_SCENES || {};
window.SA_SCENES.inscription = function (ctx, env) {
  var M = Math, rnd = M.random, G = null, PA = [], K = { T: [], F: [], S: [], Q: [] }, prev = -1;
  var W = 0, H = 0, R = 1, T = 0, last = -1, mob = false, U = 30, light = null, ink = '', hot = '', add = 'lighter';
  var cols = [], pool = [], RS = [], RF = [], RO = [], HL = null, remeasured = false, RAD = 160;
  var px = 0, py = 0, pon = 0, mPrev = 0, mu = 0, pl = 0, lastBeat = -1e9, seifAt = 2000, spawnAt = [0, 0, 0];
  var OX = [0, 0, 0], OY = [0, 0, 0], glint = null, rule = null, band = null, scr = null, sc = null, TG = [3, 2, 1], MW = 2;
  var SZ = [0.6, 1, 1.6], DEP = [0.35, 0.65, 1], NQ = [[4, 7], [3, 5], [2, 3]], REST = [10000, 8500, 7500];
  var AD = [0.32, 0.66, 0.92], AL = [0.34, 0.66, 0.9], HT = [0.9, 0.5, 0.26, 0.12], CA = M.cos(-0.42), SA = M.sin(-0.42);

  function mk() { return document.createElement('canvas'); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(p) { return 0.5 - 0.5 * M.cos(M.PI * clamp(p)); }
  function gi(n) { return G.indexOf(G.byName[n]); }

  function prep() {
    if (G) return true;
    var g = env.glyphs(); if (!g || !g.length) return false;
    for (var i = 0; i < g.length; i++) {
      var q = g[i]; PA[i] = new Path2D(q.d);
      K[M.max(q.w, q.h) < 150 ? 'S' : q.w / q.h < 0.5 ? 'T' : q.h / q.w < 0.45 ? 'F' : 'Q'].push(i);
    }
    G = g; glint = mk(); glint.width = glint.height = 64; rule = mk(); rule.width = 1; rule.height = 64; scr = mk(); sc = scr.getContext('2d');
    band = mk(); band.width = 2; band.height = 64;
    var b = band.getContext('2d'), gr = b.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.36, 'rgba(255,255,255,.18)'); gr.addColorStop(0.5, '#fff'); gr.addColorStop(0.64, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    b.fillStyle = gr; b.fillRect(0, 0, 2, 64);
    return true;
  }

  /* where the page's content sits (hero CSS px): strict = headline + meta, soft = text/buttons, occluders = cards */
  function measure() {
    RS = []; RF = []; RO = []; HL = null;
    var b = ctx.canvas.getBoundingClientRect(), hm = mob ? 10 : 24;
    function put(L, l, t, r, bt, m) { if (r - l > 2 && bt - t > 2) L.push([l - b.left - m, t - b.top - m, r - b.left + m, bt - b.top + m]); }
    function all(s, f) { var n = document.querySelectorAll(s); for (var i = 0; i < n.length; i++) f(n[i], n[i].getBoundingClientRect()); }
    all('#heroTitle .split', function (e, r) { put(RS, r.left, r.top, r.right, r.bottom, hm); });
    /* the pill and the cards are transformed during the intro: use their layout boxes */
    all('#heroTitle .reel-pill', function (e, r) {
      var x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2, w = e.offsetWidth / 2, h = e.offsetHeight / 2;
      put(RS, x - w, y - h, x + w, y + h, hm);
    });
    for (var i = 0; i < RS.length; i++) { var r = RS[i]; HL = HL ? [M.min(HL[0], r[0]), M.min(HL[1], r[1]), M.max(HL[2], r[2]), M.max(HL[3], r[3])] : r.slice(); }
    all('.hero-meta > *', function (e, r) { put(RS, r.left, r.top, r.right, r.bottom, 10); });
    all('.hero-foot > *', function (e, r) { put(RF, r.left, r.top, r.right, r.bottom, 12); });
    all('.hs', function (e) {
      var p = e.offsetParent; if (!p || !e.offsetWidth) return;
      var q = p.getBoundingClientRect(), x = q.left + e.offsetLeft, y = q.top + e.offsetTop, m = e.offsetHeight * 0.06;
      put(RO, x - m, y, x + e.offsetWidth + m, y + e.offsetHeight, 0);
    });
  }
  function cover(r, L) {
    var a = 0;
    for (var i = 0; i < L.length; i++) { var o = L[i], w = M.min(r[2], o[2]) - M.max(r[0], o[0]), h = M.min(r[3], o[3]) - M.max(r[1], o[1]); if (w > 0 && h > 0) a += w * h; }
    return M.min(1, a / ((r[2] - r[0]) * (r[3] - r[1])));
  }
  /* best free vertical run for a column: away from the headline, on the far side, visible, not crowding others */
  function place(l, cw, need, minH) {
    var best = null, bs = -1e9, m = cw * 0.35 + 8, Ls = l ? [RS, RF] : [RS];
    var hc = HL ? (HL[0] + HL[2]) / 2 : 0, side = hc > W * 0.55 ? -1 : 1;
    for (var k = 0; k < 40; k++) {
      var x = 4 + rnd() * (W - cw - 8), bl = [[-1e9, 96], [H - 12, 1e9]], i, j;
      for (i = 0; i < Ls.length; i++) for (j = 0; j < Ls[i].length; j++) { var o = Ls[i][j]; if (o[2] > x - 4 && o[0] < x + cw + 4) bl.push([o[1], o[3]]); }
      for (i = 0; i < cols.length; i++) { var c = cols[i]; if (c.x + c.cw + m > x && c.x - m < x + cw) bl.push([c.y - m, c.y + c.h + m]); }
      bl.sort(function (a, b) { return a[0] - b[0]; });
      for (i = 0, j = -1e9; i < bl.length; i++) {
        var len = bl[i][0] - j;
        if (len >= minH) {
          var h = M.min(need, len), y = j + rnd() * (len - h), r = [x, y, x + cw, y + h], vis = 1 - cover(r, RO);
          var dx = HL ? M.max(HL[0] - r[2], r[0] - HL[2], 0) : 99, dy = HL ? M.max(HL[1] - r[3], r[1] - HL[3], 0) : 99;
          var s = 0.3 * M.min(1, M.sqrt(dx * dx + dy * dy) / 90) + 0.35 * (HL ? clamp(0.5 + side * (x + cw / 2 - hc) / W) : 0.5) + 0.3 * vis + 0.2 * h / need + 0.25 * rnd();
          if ((!l || vis > 0.72) && s > bs) { bs = s; best = r; }
        }
        if (bl[i][1] > j) j = bl[i][1];
      }
    }
    return best;
  }

  /* signs, grouped into quadrats like real inscriptions */
  function sg(c, i, s, x, y) { c.sg.push({ i: i, s: s, x: x, y: y, w: G[i].w * s, h: G[i].h * s }); }
  function cen(c, i, s, y) { sg(c, i, s, (c.cw - G[i].w * s) / 2, y); return G[i].h * s; }
  function pk(a) { var i = a[rnd() * a.length | 0]; if (i === prev) i = a[rnd() * a.length | 0]; prev = i; return i; }
  function row(c, y, L, hh) { /* tall signs side by side, bottom-aligned */
    var w = c.cw * 0.06 * (L.length - 1), i, k;
    for (i = 0; i < L.length; i++) w += G[L[i]].w * hh / G[L[i]].h;
    k = M.min(1, c.cw / w); w *= k; hh *= k;
    for (i = 0, w = (c.cw - w) / 2; i < L.length; i++) { var s = hh / G[L[i]].h; sg(c, L[i], s, w, y + c.u - hh); w += G[L[i]].w * s + c.cw * 0.06 * k; }
    return c.u;
  }
  function quad(c, y) {
    var u = c.u, cw = c.cw, r = rnd(), a, h;
    if (r < 0.34) { a = pk(K.Q); return cen(c, a, M.min(cw / G[a].w, 0.9 * u / G[a].h), y); }
    if (r < 0.5) { a = pk(K.T); return cen(c, a, u / G[a].h, y); }
    if (r < 0.66) return row(c, y, [pk(K.T), pk(K.T)], u);
    if (r < 0.8) { a = pk(K.F); return cen(c, a, M.min(cw * 0.96 / G[a].w, 0.5 * u / G[a].h), y); }
    if (r < 0.92) {
      a = pk(K.F); h = cen(c, a, M.min(cw * 0.9 / G[a].w, 0.36 * u / G[a].h), y) + u * 0.14;
      a = pk(K.F); return h + cen(c, a, M.min(cw * 0.9 / G[a].w, 0.36 * u / G[a].h), y + h);
    }
    a = pk(K.S); return cen(c, a, 0.55 * u / M.max(G[a].w, G[a].h), y);
  }
  /* the client's name: s (folded cloth) · y (two reeds) · f (horned viper) in a vertical cartouche with its tie bar */
  function cart(c, y) {
    var u = c.u, cw = c.cw, p = cw * 0.2, n = G.seif, a = gi(n[0]), b = gi(n[1]), s, yy = y + p * 1.15;
    var ring = { i: -1, x: 0, y: y, w: cw, h: 0 }, bar = { i: -2, x: -cw * 0.06, y: 0, w: cw * 1.12, h: u * 0.1 };
    c.sg.push(ring, bar);
    yy += cen(c, a, 0.78 * u / G[a].h, yy) + u * 0.1;
    s = 0.7 * u / G[b].h; sg(c, b, s, cw * 0.45 - G[b].w * s, yy); sg(c, b, s, cw * 0.55, yy); yy += G[b].h * s + u * 0.12;
    a = gi(n[3]); yy += cen(c, a, (cw - 2 * p) / G[a].w, yy) + p * 1.1;
    ring.h = yy - y; bar.y = yy + u * 0.05;
    return bar.y + bar.h - y;
  }

  function stad(x, l, t, w, h) { var r = w / 2; x.moveTo(l, t + r); x.arc(l + r, t + r, r, M.PI, 0); x.lineTo(l + w, t + h - r); x.arc(l + r, t + h - r, r, 0, M.PI); x.closePath(); }
  /* bake a column into two sheets: ink and molten/highlight gold */
  function paint(c) {
    var w = M.ceil((c.cw + 2 * c.P) * R), h = M.ceil((c.h + 2 * c.P) * R), lw = M.max(0.7, c.u * 0.024);
    for (var k = 0; k < 2; k++) {
      var cv = k ? c.sb : c.sa, x = cv.getContext('2d');
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } else { x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, w, h); }
      x.fillStyle = x.strokeStyle = k ? hot : ink; x.lineJoin = 'round';
      for (var j = 0; j < c.sg.length; j++) {
        var e = c.sg[j];
        if (e.i >= 0) {
          x.setTransform(R * e.s, 0, 0, R * e.s, R * (c.P + e.x), R * (c.P + e.y)); x.fill(PA[e.i]);
          var th = 0.8 - 5.5 * e.s; if (th > 0.05) { x.lineWidth = th / e.s; x.stroke(PA[e.i]); }   /* small signs: keep lines visible */
        } else {
          x.setTransform(R, 0, 0, R, R * c.P, R * c.P); x.lineWidth = lw; x.beginPath();
          if (e.i === -1) { stad(x, e.x + lw / 2, e.y + lw / 2, e.w - lw, e.h - lw); var g = e.w * 0.08; stad(x, e.x + g, e.y + g, e.w - 2 * g, e.h - 2 * g); }
          else x.rect(e.x + lw / 2, e.y + lw / 2, e.w - lw, e.h - lw);
          x.stroke();
        }
      }
    }
  }

  function spawn(l, t, seif) {
    var u = U * SZ[l], cw = u * 0.92, gap = u * 0.24, n = NQ[l][0] + (rnd() * (NQ[l][1] - NQ[l][0] + 1) | 0), r = null;
    if (seif) r = place(l, cw, 3.7 * u + gap, 2.75 * u);
    if (!r) { seif = false; r = place(l, cw, n * (u * 0.95 + gap), 2 * u + gap); }
    if (!r) return null;
    var c = { l: l, x: r[0], y: r[1], cw: cw, u: u, m: cw * 0.35 + 8, sg: [], t0: t, a: (light ? AL : AD)[l], P: M.max(3, cw * 0.07 + 2) }, y = 0, mx = r[3] - r[1], k, h;
    if (seif) { y = cart(c, 0) + gap; if (y + u <= mx) y += row(c, y, [gi('ankh'), gi('djed'), gi('was')], u * 0.86) + gap; }
    else for (;;) { k = c.sg.length; h = quad(c, y); if (y + h > mx) { c.sg.length = k; break; } y += h + gap; }
    if (c.sg.length < 2) return null;
    c.h = y - gap;
    /* the scribe's schedule: one sign after another, each finishing as the next begins */
    for (k = 0, y = t + 520; k < c.sg.length; k++) {
      var e = c.sg[k]; e.v = e.i === -1 || (e.i >= 0 && e.h > e.w * 0.5);
      e.d = 300 + (e.v ? e.h : e.w) * 13; e.t = y; y += e.d * 0.62 + 110 + rnd() * 220;
    }
    e = c.sg[c.sg.length - 1]; c.tw = e.t + e.d; c.sh = c.tw + 250; c.SD = 1500 + c.h * 5;
    c.tf = c.tw + REST[l] * (0.8 + rnd() * 0.4); c.te = c.tf + c.sg.length * 110 + 1600;
    c.sa = pool.pop() || mk(); c.sb = pool.pop() || mk(); paint(c);
    cols.push(c); return c;
  }
  function shift(c, d, j) { for (; j < c.sg.length; j++) c.sg[j].t -= d; c.tw -= d; c.tf -= d; c.te -= d; c.sh -= d; }
  function warm() {
    for (var i = 0; i < cols.length; i++) pool.push(cols[i].sa, cols[i].sb);
    cols.length = 0;
    for (var l = 2, w = 0; l >= 0; l--) for (var j = 0; j < TG[l] - (env.reduce || l === 2 ? 0 : 1); j++) {
      var c = spawn(l, T, env.reduce && l === (mob ? 1 : 2) && !j); if (!c) continue;
      var d = env.reduce ? c.tw - c.t0 + 2500 : w++ ? (c.tf - c.t0) * (0.35 + 0.5 * rnd()) : (c.tw - c.t0) * 0.45;
      spawnAt[l] = T + (l ? 2300 : 300);
      c.t0 -= d; shift(c, d, 0);
      if (env.reduce) { c.tf = c.te = 1e15; c.sh = l === 2 || c.sg[0].i === -1 ? T - c.SD * 0.42 : 1e15; }
    }
  }
  function colors(S) {
    light = S.light; add = light ? 'source-over' : 'lighter';
    ink = light ? 'rgb(120,80,18)' : 'rgb(' + S.rgb + ')'; hot = light ? 'rgb(206,150,38)' : 'rgb(255,243,212)';
    var x = glint.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32), c = light ? '214,160,52' : '255,236,190';
    g.addColorStop(0, 'rgba(' + c + ',1)'); g.addColorStop(0.16, 'rgba(' + c + ',0.6)'); g.addColorStop(0.5, 'rgba(' + c + ',0.12)'); g.addColorStop(1, 'rgba(' + c + ',0)');
    x.clearRect(0, 0, 64, 64); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    x = rule.getContext('2d'); g = x.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.2, ink); g.addColorStop(0.8, ink); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.clearRect(0, 0, 1, 64); x.fillStyle = g; x.fillRect(0, 0, 1, 64);
  }

  /* draw part [u0,u1] (CSS px along the sign's writing axis) of sign e from sheet cv */
  function slice(c, cv, e, u0, u1, X, Y, k) {
    var bx = e.x - 1, by = e.y - 1, bw = e.w + 2, bh = e.h + 2, L = e.v ? bh : bw;
    if (u0 < 0) u0 = 0; if (u1 > L) u1 = L; if (u1 - u0 < 0.05) return;
    if (e.v) { by += u0; bh = u1 - u0; } else { bx += u0; bw = u1 - u0; }
    var cx = e.x + e.w / 2, cy = e.y + e.h / 2;
    ctx.drawImage(cv, (c.P + bx) * R, (c.P + by) * R, bw * R, bh * R, X + cx + (bx - cx) * k, Y + cy + (by - cy) * k, bw * k, bh * k);
  }
  function sheen(c, q) {
    var w = c.sa.width, h = c.sa.height, bl = (w + h) * 0.6, bt = c.u * 1.7 * R / 64;
    if (scr.width < w || scr.height < h) { scr.width = M.max(scr.width, w); scr.height = M.max(scr.height, h); }
    sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.clearRect(0, 0, w, h); sc.drawImage(c.sb, 0, 0);
    sc.globalCompositeOperation = 'destination-in';
    sc.setTransform(CA * bl, SA * bl, -SA * bt, CA * bt, w / 2, (-0.25 + 1.5 * q) * h); sc.drawImage(band, -1, -32);
    sc.globalCompositeOperation = 'source-over';
  }

  function draw(c, beat) {
    var l = c.l, X = c.x + OX[l], Y = c.y + OY[l], n = c.sg.length, a = c.a * (1 + 0.12 * pl), j, e, p;
    var fc = 1 - clamp((T - c.tf) / (1600 + n * 110)), rp = ease((T - c.t0) / 900), rg = c.u * 0.3;
    if (beat && T < c.tw) { /* music: the next sign starts on the beat */
      for (j = 0; j < n && c.sg[j].t <= T; j++);
      p = j ? c.sg[j - 1] : null;
      if (j < n && (p ? T > p.t + p.d * 0.5 : T > c.t0 + 400)) shift(c, c.sg[j].t - T, j);
    }
    if (T > c.sh + c.SD && T < c.tf) c.sh = T + 4500 + rnd() * 4000;
    /* faint guide rules the scribe lays out first */
    if (a * fc * rp > 0.01) {
      ctx.globalAlpha = a * 0.5 * fc * rp; p = (c.h + rg * 2) * rp;
      ctx.drawImage(rule, X - rg, Y - rg, 1 / R, p); ctx.drawImage(rule, X + c.cw + rg, Y - rg, 1 / R, p);
    }
    var q = (T - c.sh) / c.SD, sh = q > 0 && q < 1 ? M.sin(M.PI * q) * (light ? 0.9 : 0.8) * (1 + 0.6 * pl) : 0;
    if (sh) sheen(c, q);
    var far = pon < 0.02 || px < X - RAD || px > X + c.cw + RAD || py < Y - RAD || py > Y + c.h + RAD;
    if (far && T > c.tw && T < c.tf) { /* resting column: one draw for the ink, one for the sheen */
      var w = c.sa.width, h = c.sa.height;
      ctx.globalAlpha = a; ctx.drawImage(c.sa, X - c.P, Y - c.P, w / R, h / R);
      if (sh) { ctx.globalCompositeOperation = add; ctx.globalAlpha = a * sh; ctx.drawImage(scr, 0, 0, w, h, X - c.P, Y - c.P, w / R, h / R); ctx.globalCompositeOperation = 'source-over'; }
      return;
    }
    for (j = 0; j < n; j++) {
      e = c.sg[j]; p = (T - e.t) / e.d; if (p <= 0) continue;
      var f = T > c.tf ? 1 - clamp((T - c.tf - j * 110) / 1600) : 1; if (f <= 0) continue;
      var ae = a * f, L = (e.v ? e.h : e.w) + 2, cx = X + e.x + e.w / 2, cy = Y + e.y + e.h / 2, nr = 0, dx = 0, dy = 0, k = 1;
      if (!far) {
        var qx = cx - px, qy = cy - py, d = M.sqrt(qx * qx + qy * qy) / RAD;
        if (d < 1) { nr = pon * (1 - d) * (1 - d); dx = qx / RAD * nr * 4; dy = -nr * 5 * (0.5 + 0.5 * DEP[l]); k = 1 + nr * 0.06 * DEP[l]; }
      }
      var x0 = X + dx, y0 = Y + dy;
      ctx.globalAlpha = ae;
      if (p < 1) { /* writing: ink up to the front, a molten band cooling behind it, a glint on the pen */
        var tl = L * 0.6, fr = ease(p) * (L + tl);
        slice(c, c.sa, e, 0, fr, x0, y0, k);
        ctx.globalCompositeOperation = add;
        for (var b = 0; b < 4; b++) { ctx.globalAlpha = ae * HT[b]; slice(c, c.sb, e, fr - tl * (b + 1) / 4, fr - tl * b / 4, x0, y0, k); }
        if (fr < L) {
          var gw = M.max(e.v ? e.w : e.h, c.u * 0.5) * 1.5, gt = c.u * 0.3;
          ctx.globalAlpha = ae * (light ? 0.35 : 0.6) * M.sin(M.PI * fr / L);
          if (e.v) ctx.drawImage(glint, x0 + e.x + e.w / 2 - gw / 2, y0 + e.y - 1 + fr - gt / 2, gw, gt);
          else ctx.drawImage(glint, x0 + e.x - 1 + fr - gt / 2, y0 + e.y + e.h / 2 - gw / 2, gt, gw);
        }
      } else slice(c, c.sa, e, 0, L, x0, y0, k);
      if (nr > 0.01 || (sh && p >= 1)) {
        ctx.globalCompositeOperation = add;
        if (nr > 0.01) { ctx.globalAlpha = ae * nr * 0.7; slice(c, c.sb, e, 0, L, x0, y0, k); }
        if (sh && p >= 1) { ctx.globalAlpha = ae * sh; slice(c, scr, e, 0, L, x0, y0, k); }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  return {
    lowRes: false,
    init: function (S) {
      if (!prep()) return;
      W = S.W; H = S.H; R = ctx.canvas.width / W || 1; mob = W < 700;
      U = mob ? 30 : M.max(30, M.min(46, H * 0.05)); RAD = mob ? 120 : 170;
      TG = mob ? [3, 1, 1] : [4, 2, 1]; MW = 2;
      if (light === null || light !== S.light) colors(S);
      measure(); warm(); last = -1;
    },
    theme: function (S) {
      if (!G || S.light === light) return;
      colors(S);
      for (var i = 0; i < cols.length; i++) { cols[i].a = (light ? AL : AD)[cols[i].l]; paint(cols[i]); }
    },
    frame: function (S, now) {
      if (!G || !W) return;
      var dt = last < 0 || env.reduce ? 0 : M.min(50, now - last), i, c, l, sp = S.pointer;
      last = now; T += dt;
      if (!remeasured && T > 3000) { remeasured = true; measure(); }
      /* pointer: smoothed position and presence, layer parallax */
      if (sp.on) { if (pon < 0.02) { px = sp.x; py = sp.y; } else { px += (sp.x - px) * (1 - M.exp(-dt / 90)); py += (sp.y - py) * (1 - M.exp(-dt / 90)); } }
      pon += ((sp.on ? 1 : 0) - pon) * (1 - M.exp(-dt / 280));
      for (l = 0; l < 3; l++) { OX[l] = pon * (W / 2 - px) / W * 18 * DEP[l]; OY[l] = pon * (H / 2 - py) / H * 10 * DEP[l]; }
      /* music: detect beat peaks on the level, keep a soft pulse */
      var m = env.music() || 0, beat = dt > 0 && m > 0.05 && m - mPrev > 0.08 && T - lastBeat > 320;
      mPrev = m; mu += (m - mu) * 0.05; pl *= M.exp(-dt / 320);
      if (beat) { lastBeat = T; pl = M.min(1, 0.4 + m); }
      if (dt) {
        for (i = cols.length - 1; i >= 0; i--) if (T > cols[i].te) { c = cols[i]; pool.push(c.sa, c.sb); cols.splice(i, 1); spawnAt[c.l] = T + 300 + rnd() * 1500; }
        var cnt = [0, 0, 0], wr = 0;
        for (i = 0; i < cols.length; i++) { cnt[cols[i].l]++; if (T < cols[i].tw) wr++; }
        for (l = 2; l >= 0; l--) if (wr < MW && cnt[l] < TG[l] && T > spawnAt[l]) {
          var sf = l > 0 && T > seifAt; c = spawn(l, T, sf);
          if (c) { wr++; if (sf && c.sg[0].i === -1) seifAt = T + 26000 + rnd() * 12000; }
          spawnAt[l] = T + 700 + rnd() * 1400;
        }
      }
      ctx.clearRect(0, 0, W, H);
      for (i = 0; i < cols.length; i++) draw(cols[i], beat);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    },
    destroy: function () {
      for (var i = 0; i < cols.length; i++) pool.push(cols[i].sa, cols[i].sb);
      for (i = 0; i < pool.length; i++) pool[i].width = pool[i].height = 0;
      if (scr) scr.width = scr.height = 0;
      cols = []; pool = []; ctx.clearRect(0, 0, W, H);
    }
  };
};
})();
