/* Torchlight: a temple wall of hieroglyph columns, gilded sign by sign by a torch (dark) or doorway
   sunlight (light) that follows the pointer, or idles on a calm loop clear of the headline. */
(function () {
window.SA_SCENES = window.SA_SCENES || {};
window.SA_SCENES.torchlight = function (ctx, env) {
  var M = Math, G, PA = [], CL = { T: [], F: [], S: [], Q: [] };
  var W = 0, H = 0, dpr = 1, WD = 0, HD = 0, P = 0, PD = 0, R = 120, C = 40, pitch = 60, n = 1, mob = false;
  var light = false, rgb = '240,199,102', dirty = true, place = [], cart = {};
  var wall, glo, dot, cc, Gw = 0, Gh = 0, IT = [], B, D, Y, NI = 0, snap = true, rx = 1, ry = 1;
  var pos = { x: 0, y: 0, ok: false }, A = { x: 0, y: 0 }, lpx = -1, lpy = -1, lastMove = -1e9, start = -1, prev = 0, mu = 0;
  var motes = [], WP, lo = -1, cp = false, U = [0, 0, 0, 0], PR = [0, 0, 0, 0];
  /* idle loops (x,y fractions): around the video stack (desktop), lower edge (phone) */
  var WPD = [0.62, 0.76, 0.75, 0.87, 0.91, 0.85, 0.99, 0.6, 0.985, 0.3, 0.84, 0.16, 0.65, 0.17, 0.7, 0.46];
  var WPM = [0.95, 0.72, 1, 0.84, 0.9, 0.97, 0.55, 1.03, 0.15, 0.99, 0.45, 1.02, 0.85, 0.93, 0.99, 0.78];

  function cv() { return document.createElement('canvas'); }
  function rng(a) { return function () { a = a * 16807 % 2147483647; return a / 2147483647; }; }
  function mod(a, b) { return ((a % b) + b) % b; }
  function prep() {
    if (G) return true;
    var g = env.glyphs(); if (!g || !g.length) return false;
    for (var i = 0; i < g.length; i++) {
      var q = g[i]; PA[i] = new Path2D(q.d);
      CL[q.w < 150 && q.h < 150 ? 'S' : q.h / q.w < 0.5 ? 'F' : q.w / q.h < 0.46 ? 'T' : 'Q'].push(i);
    }
    G = g; return true;
  }
  function gi(name) { return G.indexOf(G.byName[name]); }
  function fit(i, bw, bh) { return M.min(bw / G[i].w, bh / G[i].h); }
  function put(c, i, x, y, s, k) { c.setTransform(s * k, 0, 0, s * k, x * k, y * k); c.fill(PA[i]); }

  /* a quadrat, grouped like real inscriptions */
  function quad(r) {
    function pk(a) { return a[(r() * a.length) | 0]; }
    var t = r(), it, h, a = pk(CL.T), b = pk(CL.T), c = pk(CL.S), d = pk(CL.S), e = pk(CL.F), f = pk(CL.F), s, u;
    if (t < 0.3) { a = pk(CL.Q); s = fit(a, C, C) * (0.78 + 0.22 * r()); it = [a, 0, 0, s]; h = G[a].h * s; }
    else if (t < 0.45) { it = [a, -C * 0.22, 0, C / G[a].h, b, C * 0.22, 0, C / G[b].h]; h = C; }
    else if (t < 0.55) { s = C * 1.12 / G[a].h; it = [a, 0, 0, s]; h = C * 1.12; }
    else if (t < 0.73) { s = fit(e, C, C * 0.34); u = fit(f, C * 0.9, C * 0.34); h = G[e].h * s + C * 0.14; it = [e, 0, 0, s, f, 0, h, u]; h += G[f].h * u; }
    else if (t < 0.83) { s = fit(e, C * 1.04, C * 0.42); it = [e, 0, 0, s]; h = G[e].h * s; }
    else if (t < 0.91) { s = fit(c, C * 0.44, C * 0.5); u = fit(d, C * 0.44, C * 0.5); it = [c, -C * 0.25, 0, s, d, C * 0.25, 0, u]; h = M.max(G[c].h * s, G[d].h * u); }
    else { it = [a, -C * 0.24, 0, C / G[a].h, c, C * 0.2, 0, fit(c, C * 0.46, C * 0.44), d, C * 0.2, C * 0.54, fit(d, C * 0.46, C * 0.44)]; h = C; }
    return { h: h, it: it, g: C * (0.2 + 0.14 * r()) };
  }
  function column(x, y0, y1, r) {
    var q = [], tot = 0, i, j, y, Q, ex;
    for (;;) { Q = quad(r); if (tot + Q.h + Q.g > y1 - y0) break; q.push(Q); tot += Q.h + Q.g; }
    ex = q.length ? (y1 - y0 - tot) / q.length : 0; y = y0;
    for (i = 0; i < q.length; i++) {
      Q = q[i]; y += (Q.g + ex) / 2;
      for (j = 0; j < Q.it.length; j += 4) place.push(Q.it[j], x + Q.it[j + 1] - G[Q.it[j]].w * Q.it[j + 3] / 2, y + Q.it[j + 2], Q.it[j + 3]);
      y += Q.h + (Q.g + ex) / 2;
    }
  }
  function layout() {
    mob = W < 900 || H > W * 1.1;
    n = M.max(4, M.round(W / M.min(80, M.max(52, W / 18)))); pitch = W / n; C = pitch * 0.64;
    PD = M.ceil((H + C * 4) * dpr); P = PD / dpr; place.length = 0;
    var r = rng(n * 7919 + 13), k = M.min(n - 1, M.max(0, M.round((mob ? 0.93 : 0.6) * W / pitch - 0.5)));
    cart.w = C * 1.06; cart.h = C * 2.95; cart.x = (k + 0.5) * pitch; cart.y = (mob ? 0.665 : 0.64) * H;
    for (var i = 0; i < n; i++) {
      if (i === k) column(cart.x, cart.y + cart.h + C * 0.42, cart.y + P - C * 0.25, r);
      else column((i + 0.5) * pitch, 0, P, r);
    }
    R = M.max(105, M.min(220, M.min(W * 0.3, H * 0.24))) * (light ? 1.12 : 1); WP = mob ? WPM : WPD;
  }
  function stadium(c, x, y, w, h) { var r = w / 2; c.moveTo(x, y + r); c.arc(x + r, y + r, r, M.PI, 0); c.lineTo(x + w, y + h - r); c.arc(x + r, y + h - r, r, 0, M.PI); c.closePath(); }
  /* cartouche: folded cloth, two reeds, horned viper = S-I-F */
  function drawCart(c, x, y, k) {
    var w = cart.w, h = cart.h, i, s, e = C * 0.075;
    c.setTransform(k, 0, 0, k, 0, 0); c.lineWidth = M.max(0.7, C * 0.024); c.beginPath();
    stadium(c, x - w / 2, y, w, h); stadium(c, x - w / 2 + e, y + e, w - 2 * e, h - 2 * e);
    c.rect(x - w * 0.62, y + h + C * 0.02, w * 1.24, C * 0.1); c.stroke();
    i = gi('cloth'); s = C * 0.86 / G[i].h; put(c, i, x - G[i].w * s / 2, y + C * 0.32, s, k);
    i = gi('reed'); s = C * 0.86 / G[i].h; for (e = -1; e < 2; e += 2) put(c, i, x + e * C * 0.17 - G[i].w * s / 2, y + C * 1.28, s, k);
    i = gi('viper'); s = C * 0.78 / G[i].w; put(c, i, x - C * 0.39, y + C * 2.3, s, k);
  }
  /* soft elliptical falloff sprite */
  function bake(cn, rx, ry, st) {
    cn.width = 2 * M.ceil(rx); cn.height = 2 * M.ceil(ry);
    var c = cn.getContext('2d'), g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
    for (var i = 0; i < st.length; i += 2) g.addColorStop(st[i], st[i + 1]);
    c.setTransform(rx, 0, 0, ry, cn.width / 2, cn.height / 2); c.fillStyle = g; c.fillRect(-1, -1, 2, 2);
  }

  function build() {
    dirty = false; layout();
    if (!wall) { wall = cv(); glo = cv(); dot = cv(); cc = cv(); }
    wall.width = WD; wall.height = PD;
    var c = wall.getContext('2d'), i, y, g, col = 'rgb(' + rgb + ')';
    c.fillStyle = col; IT.length = 0;
    for (i = 0; i < place.length; i += 4) {
      var q = place[i + 3], x = place[i + 1], gw, gh, sx, sy;
      g = G[place[i]]; gw = g.w * q; gh = g.h * q;
      y = mod(place[i + 2], P); put(c, place[i], x, y, q, dpr);
      if (y + gh > P) put(c, place[i], x, y - P, q, dpr);
      sx = M.max(0, M.floor(x * dpr) - 1); sy = M.floor(y * dpr) - 1;
      IT.push(x + gw / 2, y + gh / 2, sx, mod(sy, PD), M.min(WD, M.ceil((x + gw) * dpr) + 1) - sx, M.ceil((y + gh) * dpr) + 1 - sy);
    }
    NI = IT.length / 6; B = new Float32Array(NI); Y = new Float32Array(NI); D = new Uint8Array(NI); snap = true;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 0.5;
    for (i = 0; i <= n; i++) c.fillRect(M.min(WD - 1, M.round(i * pitch * dpr)), 0, M.max(1, M.round(dpr * 0.75)), PD);
    c.globalAlpha = 1; c.strokeStyle = col; drawCart(c, cart.x, cart.y, dpr);
    if (!mob) {
      /* quieter behind the headline (left) */
      c.setTransform(1, 0, 0, 1, 0, 0); g = c.createLinearGradient(0, 0, WD, 0);
      g.addColorStop(0.3, 'rgba(0,0,0,0.5)'); g.addColorStop(0.6, '#000');
      c.globalCompositeOperation = 'destination-in'; c.fillStyle = g; c.fillRect(0, 0, WD, PD);
    }
    /* bright cartouche copy, laid over it when lit */
    cart.cw = cart.w * 1.4 + 8; cc.width = M.ceil(cart.cw * dpr); cc.height = M.ceil((cart.h + C * 0.4 + 8) * dpr);
    c = cc.getContext('2d'); c.fillStyle = c.strokeStyle = light ? 'rgb(96,58,8)' : 'rgb(255,226,160)'; drawCart(c, cart.cw / 2, 4, dpr);
    /* light pool (glo), dust mote (dot) */
    rx = R * (light ? 0.8 : 1.05); ry = R * (light ? 1.35 : 1.14);
    bake(glo, rx * 1.45 * dpr, ry * 1.4 * dpr, light
      ? [0, 'rgba(255,252,242,0.72)', 0.35, 'rgba(255,240,205,0.4)', 0.7, 'rgba(246,212,148,0.13)', 1, 'rgba(240,205,140,0)']
      : [0, 'rgba(255,170,88,0.32)', 0.3, 'rgba(240,148,68,0.14)', 0.65, 'rgba(205,118,48,0.04)', 1, 'rgba(160,90,30,0)']);
    Gw = glo.width; Gh = glo.height;
    bake(dot, 8, 8, light ? [0, 'rgba(130,88,24,0.9)', 1, 'rgba(130,88,24,0)'] : [0, 'rgba(255,238,196,1)', 0.4, 'rgba(250,200,120,0.45)', 1, 'rgba(240,180,90,0)']);
    motes.length = 0;
    for (i = 0; i < (mob ? 9 : 14); i++) motes.push({ age: -1 });
  }
  /* copy a band of the repeating wall (device px) */
  function blit(c, sx, sy, w, h, dx, dy) {
    sy = mod(sy, PD);
    while (h > 0) { var hh = M.min(h, PD - sy); c.drawImage(wall, sx, sy, w, hh, dx, dy, w, hh); dy += hh; h -= hh; sy = 0; }
  }
  function grow(x, y, w, h) { U[0] = M.min(U[0], x); U[1] = M.min(U[1], y); U[2] = M.max(U[2], x + w); U[3] = M.max(U[3], y + h); }
  function auto(t) {
    var k = WP.length / 2, u = mod(t / 9.5, k), i = M.floor(u), f = u - i, d, v;
    for (d = 0; d < 2; d++) {
      var p0 = WP[mod(i - 1, k) * 2 + d], p1 = WP[i * 2 + d], p2 = WP[mod(i + 1, k) * 2 + d], p3 = WP[mod(i + 2, k) * 2 + d];
      v = 0.5 * (2 * p1 + (p2 - p0) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (3 * p1 - p0 - 3 * p2 + p3) * f * f * f);
      if (d) A.y = v * H + M.sin(t * 0.21) * 10; else A.x = v * W + M.sin(t * 0.17 + 1) * 12;
    }
  }

  return {
    lowRes: false,
    init: function (S) {
      W = S.W; H = S.H; WD = ctx.canvas.width; HD = ctx.canvas.height; dpr = W ? WD / W : 1;
      dirty = true; pos.ok = false; start = -1;
    },
    theme: function (S) { light = !!S.light; rgb = S.rgb || rgb; dirty = true; },
    frame: function (S, now) {
      if (!W || !prep()) return;
      if (dirty) build();
      var c = ctx, red = env.reduce, pt = S.pointer, dt = M.min(0.05, M.max(0, (now - prev) / 1000)), i, j, k, x, y, u, v, d, f, p, o;
      prev = now; if (start < 0) start = now;
      var t = (now - start) / 1000 + 0.001, mv = +env.music() || 0;
      mu += (mv - mu) * (mv > mu ? 0.3 : 0.05);
      if (pt.x !== lpx || pt.y !== lpy) { lpx = pt.x; lpy = pt.y; if (pt.on) lastMove = now; }
      var act = !red && pt.on && now - lastMove < 4500, kk = 1 - M.exp(-dt * (act ? 6.5 : 1.3));
      auto(t);
      if (!pos.ok) { pos.x = A.x; pos.y = A.y; pos.ok = true; }
      pos.x += ((act ? pt.x : A.x) - pos.x) * kk; pos.y += ((act ? pt.y : A.y) - pos.y) * kk;
      /* flame flicker; sunlight only breathes; music lifts it smoothly */
      var fl = red ? 1 : light ? 1 + 0.03 * M.sin(t * 0.7) : 1 + 0.045 * M.sin(t * 7.3) + 0.03 * M.sin(t * 17.1 + 1.7) + 0.025 * M.sin(t * 31 + 0.3);
      var I = M.min(1, fl * (0.86 + 0.2 * mu)), off = M.round(mod(t * 2.2, P) * dpr);
      j = light || red ? 0 : dpr; var gx = M.round(pos.x * dpr - Gw / 2 + M.sin(t * 9.1) * j), gy = M.round(pos.y * dpr - Gh / 2 + M.sin(t * 6.3 + 1) * 1.4 * j);
      var ku = snap ? 1 : 1 - M.exp(-dt * 9), kd = snap ? 1 : 1 - M.exp(-dt * 1.5), gain = I * (light || mob ? 0.85 : 1);
      /* repaint only what changed; everything when the wall steps up */
      U[0] = M.min(gx, PR[0]); U[1] = M.min(gy, PR[1]); U[2] = M.max(gx + Gw, PR[2]); U[3] = M.max(gy + Gh, PR[3]);
      PR[0] = gx; PR[1] = gy; PR[2] = gx + Gw; PR[3] = gy + Gh;
      /* each sign the light touches is gilded, then dims slowly */
      for (j = 0; j < NI; j++) {
        k = j * 6; y = IT[k + 3] - off; if (y < -IT[k + 5]) y += PD;
        x = IT[k] - pos.x; v = IT[k + 1] + (y - IT[k + 3]) / dpr - pos.y;
        u = x / rx; v /= ry; d = M.sqrt(u * u + v * v) / (1 + 0.12 * mu);
        f = d < 1 ? M.min(1, (1 - d) * 1.35) : 0; f = f * f * (3 - 2 * f);
        B[j] += (f - B[j]) * (f > B[j] ? ku : kd); Y[j] = y;
        f = B[j] > 0.015 && y < HD ? 1 : 0;
        if (f || D[j]) grow(IT[k + 2], y, IT[k + 4], IT[k + 5]);
        D[j] = f;
      }
      y = mod(cart.y - off / dpr, P); if (y > H + C) y -= P;
      x = cart.x - pos.x; v = y + cart.h / 2 - pos.y; p = M.max(0, 1 - M.hypot(x, v) / (R * 1.25));
      x = M.round((cart.x - cart.h * 0.8) * dpr); v = M.round((y - cart.h * 0.3) * dpr); u = M.round(cart.h * 1.6 * dpr);
      if (p > 0.01 || cp) grow(x, v, u, u);
      cp = p > 0.01;
      if (snap || off !== lo) { U[0] = U[1] = 0; U[2] = WD; U[3] = HD; }
      lo = off; snap = false;
      U[0] = M.max(0, U[0]); U[1] = M.max(0, U[1]); U[2] = M.min(WD, U[2]) - U[0]; U[3] = M.min(HD, U[3]) - U[1];
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over';
      if (U[2] > 0 && U[3] > 0) { c.clearRect(U[0], U[1], U[2], U[3]); c.globalAlpha = light ? 0.12 : 0.08; blit(c, U[0], U[1] + off, U[2], U[3], U[0], U[1]); }
      c.globalCompositeOperation = light ? 'source-over' : 'lighter';
      c.globalAlpha = I; c.drawImage(glo, gx, gy);
      for (j = 0; j < NI; j++) if (D[j]) { k = j * 6; c.globalAlpha = M.min(1, B[j] * gain); blit(c, IT[k + 2], IT[k + 3], IT[k + 4], IT[k + 5], IT[k + 2], Y[j]); }
      /* the cartouche answers the light */
      if (cp) {
        p = p * p * (3 - 2 * p);
        if (!light) { c.globalAlpha = p * I * 0.45; c.drawImage(glo, x, v, u, u); }
        c.globalAlpha = p * I * (light ? 0.4 : 0.55);
        c.drawImage(cc, M.round((cart.x - cart.cw / 2) * dpr), M.round((y - 4) * dpr));
      }
      /* dust in the beam (world space) */
      for (i = 0; i < motes.length; i++) {
        o = motes[i]; d = M.hypot(o.x - pos.x, o.y - pos.y) / R;
        if (o.age < 0 || d > 0.92) {
          u = M.random() * 6.283; d = M.sqrt(M.random()) * 0.8;
          o.x = pos.x + M.cos(u) * d * R; o.y = pos.y + M.sin(u) * d * R * 0.9; o.age = red ? 2 : 0; o.s = 1.6 + M.random() * 2.6; o.v = 4 + M.random() * 9; o.ph = M.random() * 6.283;
        }
        o.age += dt; o.y -= o.v * dt; o.x += M.sin(t * 0.8 + o.ph) * 7 * dt;
        f = (1 - d) * M.min(1, o.age / 1.2) * (0.55 + 0.45 * M.sin(t * 1.7 + o.ph * 3)) * I * (light ? 0.45 : 0.8);
        if (f > 0.01) { c.globalAlpha = f; u = o.s * dpr * 2.2; c.drawImage(dot, o.x * dpr - u / 2, o.y * dpr - u / 2, u, u); }
      }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    destroy: function () {
      [wall, glo, dot, cc].forEach(function (x) { if (x) { x.width = 0; x.height = 0; } });
      wall = glo = dot = cc = null; place.length = 0; IT.length = 0; motes.length = 0; dirty = true;
    }
  };
};
})();
