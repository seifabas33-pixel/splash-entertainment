#!/usr/bin/env python3
"""Builds the case-study pages: work/<slug>/index.html from tools/cases_data.py.
Run from the repo root:  python3 tools/build_cases.py"""
import json, os, sys, html
sys.path.insert(0, os.path.dirname(__file__))
from cases_data import CASES

SITE = 'https://seifabas.vercel.app'
ARROW = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>'

HEAD_THEME = """<script>(function(){var mode='auto';try{var q=new URLSearchParams(location.search).get('theme');if(q==='auto'||q==='light'||q==='dark'){mode=q;localStorage.setItem('sa-theme',q);}else mode=localStorage.getItem('sa-theme')||'auto';}catch(e){}var h=new Date().getHours();var theme=mode==='auto'?(h>=6&&h<19?'light':'dark'):mode;document.documentElement.setAttribute('data-theme',theme);document.documentElement.setAttribute('data-mode',mode);})();</script>"""

def strip(s):
    return html.unescape(s.replace('&amp;', '&'))

def page(i, c):
    n = len(CASES)
    nxt = CASES[(i + 1) % n]
    e = c['en']
    ext = c['url'].startswith('http')
    live_attrs = ' target="_blank" rel="noopener"' if ext else ' target="_blank"'
    num = f'{i + 1:02d}'
    title = f"{strip(c['name'])} — case study · Seif Abas"
    desc = strip(e['lede'])
    url = f"{SITE}/work/{c['slug']}/"
    feats = '\n'.join(
        f'''        <article class="c-feat rv"><span class="mono">{k:02d}</span><h3 data-i="f{k}.h">{e[f"f{k}.h"]}</h3><p data-i="f{k}.p">{e[f"f{k}.p"]}</p></article>'''
        for k in range(1, 7))
    nums = '\n'.join(
        f'''      <div class="rv"><b>{v}</b><span data-i="n{k}">{e[f"n{k}"]}</span></div>'''
        for k, v in enumerate(c['nums'], 1))
    sw = '\n'.join(
        f'''          <div class="sw" style="--c:{hx}"><i></i><b data-i="{key}">{e[key]}</b><span class="mono">{hx}</span></div>'''
        for hx, key in c['swatches'])
    fonts = ''.join(f'<li style="font-family:\'{f}\', var(--sans)">{f}</li>' for f in c['fonts'])
    tech = ''.join(f'<li>{t}</li>' for t in c['tech'])
    trans = {l: c[l] for l in ('ar', 'de', 'it')}
    shot = c['shot']
    return f'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  {HEAD_THEME}
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <meta name="theme-color" content="#070605" />
  <link rel="canonical" href="{url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Seif Abas" />
  <meta property="og:title" content="{html.escape(strip(c['name']))} — case study" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:image" content="{SITE}/assets/v2/shots/{shot}.jpg" />
  <meta property="og:url" content="{url}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
  <link rel="preload" href="/assets/fonts/syne.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/assets/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/assets/v2/case.css" />
</head>
<body style="--acc:{c['acc']}">
  <nav class="c-nav">
    <a class="c-back" href="/#work" data-keep="/#work"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg><span data-i="ui.back">All work</span></a>
    <a class="c-brand" href="/" data-keep="/">Seif Abas</a>
    <div class="c-tools">
      <button type="button" class="c-theme" id="themeBtn" aria-label="Theme" data-ia="aria-label:ui.theme"><svg class="i-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg><svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></button>
      <div class="c-langs" role="group" aria-label="Language" data-ia="aria-label:ui.lang"><button type="button" data-lang="en" lang="en">EN</button><button type="button" data-lang="ar" lang="ar">AR</button><button type="button" data-lang="de" lang="de">DE</button><button type="button" data-lang="it" lang="it">IT</button></div>
    </div>
  </nav>

  <main class="wrap">
    <header class="c-hero">
      <p class="kicker mono"><span data-i="ui.k">Case study</span>&nbsp;· <span dir="ltr">{num} / {n:02d}</span></p>
      <h1 class="c-title"><span>{c['name']}</span></h1>
      <p class="c-type mono" data-i="type">{e['type']}</p>
      <p class="c-lede" data-i="lede">{e['lede']}</p>
      <dl class="c-meta">
        <div><dt data-i="ui.client">Client</dt><dd data-i="client">{e['client']}</dd></div>
        <div><dt data-i="ui.where">Location</dt><dd data-i="where">{e['where']}</dd></div>
        <div><dt data-i="ui.year">Year</dt><dd>2026</dd></div>
        <div><dt data-i="ui.langs">Languages</dt><dd dir="ltr">{c['langs']}</dd></div>
        <div><dt data-i="ui.role">Role</dt><dd data-i="role">Design &amp; development</dd></div>
      </dl>
      <div class="c-actions">
        <a class="btn btn-gold" href="{c['url']}"{live_attrs}><span data-i="ui.live">Visit the live site</span>{ARROW}</a>
        <a class="btn btn-ghost" href="/?pick={c['pick']}#quote" data-keep="/?pick={c['pick']}#quote"><span data-i="ui.quote">Get a quote</span></a>
      </div>
    </header>

    <section class="c-show" aria-label="Screens">
      <figure class="c-browser rv"><div class="c-bar"><i></i><i></i><i></i><span>{c['urlLabel']}</span></div><img src="/assets/v2/shots/{shot}.jpg" srcset="/assets/v2/shots/{shot}-sm.jpg 720w, /assets/v2/shots/{shot}.jpg 1440w" sizes="(max-width: 800px) 92vw, 1000px" width="1440" height="900" alt="{html.escape(strip(c['name']))} on desktop" /></figure>
      <div class="c-phones">
        <figure class="c-phone rv"><img src="/assets/v2/shots/{shot}-m1.jpg" width="600" height="1298" alt="{html.escape(strip(c['name']))} on a phone" loading="lazy" decoding="async" data-par="-30" /></figure>
        <figure class="c-phone rv"><img src="/assets/v2/shots/{shot}-m2.jpg" width="600" height="1298" alt="" loading="lazy" decoding="async" data-par="30" /></figure>
      </div>
    </section>

    <section class="c-story">
      <div class="rv"><p class="kicker mono" data-i="ui.brief">The brief</p><p class="c-big" data-i="brief">{e['brief']}</p></div>
      <div class="rv"><p class="kicker mono" data-i="ui.built">What I built</p><p data-i="built">{e['built']}</p></div>
    </section>

    <section class="c-feats">
      <h2 class="c-h2 rv" data-i="ui.feats">Key features</h2>
      <div class="c-grid">
{feats}
      </div>
    </section>

    <section class="c-nums" aria-label="In numbers">
{nums}
    </section>

    <section class="c-design">
      <div class="rv"><p class="kicker mono" data-i="ui.palette">Colour palette</p>
        <div class="c-swatches">
{sw}
        </div>
      </div>
      <div class="rv"><p class="kicker mono" data-i="ui.type">Typefaces</p><ul class="c-fonts">{fonts}</ul></div>
      <div class="rv"><p class="kicker mono" data-i="ui.tech">Built with</p><ul class="c-chips" dir="ltr">{tech}</ul></div>
    </section>

    <section class="c-cta rv">
      <h2 data-i="ui.ctaH">Want something like this for <span class="serif gold">your hotel?</span></h2>
      <p data-i="ui.ctaP">Tell me what you need and I’ll get back to you on WhatsApp.</p>
      <div class="c-actions">
        <a class="btn btn-gold" href="/?pick={c['pick']}#quote" data-keep="/?pick={c['pick']}#quote"><span data-i="ui.quote">Get a quote</span></a>
        <a class="btn btn-ghost" href="https://wa.me/201001570273" target="_blank" rel="noopener"><span data-i="ui.wa">Chat on WhatsApp</span></a>
      </div>
    </section>

    <a class="c-next rv" href="/work/{nxt['slug']}/" data-keep="/work/{nxt['slug']}/"><span><span class="mono" data-i="ui.next">Next project</span><b>{nxt['name']}</b></span><img src="/assets/v2/shots/{nxt['shot']}-sm.jpg" alt="" loading="lazy" decoding="async" /></a>

    <footer class="c-foot mono"><span>© 2026 Seif Abas</span><a href="/" data-keep="/">seifabas.vercel.app</a></footer>
  </main>

  <script>window.CASE_T = {json.dumps(trans, ensure_ascii=False)};</script>
  <script src="/assets/v2/case.js" defer></script>
</body>
</html>
'''

def main():
    root = os.path.join(os.path.dirname(__file__), '..')
    for i, c in enumerate(CASES):
        d = os.path.join(root, 'work', c['slug'])
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(page(i, c))
        print('work/' + c['slug'] + '/')

if __name__ == '__main__':
    main()
