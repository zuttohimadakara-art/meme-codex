/* ============================================================
   Meme Codex — Frontend logic
   No build step. Loads memes from data/memes_en.js and
   data/memes_intl.js (each assigns to window.MEMES_EN / MEMES_INTL).
   ============================================================ */

(function () {
  'use strict';

  // ---------- 1. Load and combine data ----------
  const allMemes = []
    .concat(Array.isArray(window.MEMES_EN) ? window.MEMES_EN : [])
    .concat(Array.isArray(window.MEMES_INTL) ? window.MEMES_INTL : []);

  // Cache for Wikipedia lookups, keyed by meme id.
  const imageCache = new Map();

  // ---------- 2. Country color palettes for SVG placeholders ----------
  const PALETTES = {
    US:       ['#1e3a8a', '#dc2626'],
    GB:       ['#1e3a8a', '#dc2626'],
    JP:       ['#dc2626', '#fde68a'],
    KR:       ['#dc2626', '#3b82f6'],
    CN:       ['#dc2626', '#fbbf24'],
    FR:       ['#1e3a8a', '#dc2626'],
    DE:       ['#1f2937', '#fbbf24'],
    RU:       ['#1e3a8a', '#dc2626'],
    BR:       ['#16a34a', '#fbbf24'],
    MX:       ['#16a34a', '#dc2626'],
    Internet: ['#374151', '#0f172a'],
    AR:       ['#60a5fa', '#fde68a'],
    CL:       ['#dc2626', '#1e3a8a'],
    IT:       ['#16a34a', '#dc2626'],
    ID:       ['#dc2626', '#fde68a'],
    PH:       ['#1e3a8a', '#fbbf24'],
    TR:       ['#dc2626', '#fde68a'],
    NG:       ['#16a34a', '#fde68a'],
    FI:       ['#cbd5e1', '#1e3a8a'],
  };
  function paletteFor(country) {
    return PALETTES[country] || ['#E8BD2C', '#b89522']; // brand yellow fallback
  }

  // ---------- 3. SVG placeholder (data URL) ----------
  function svgDataUrl(m) {
    const first = (m.name || '?').charAt(0).toUpperCase();
    const [c1, c2] = paletteFor(m.origin_country);
    const name = (m.name || '').slice(0, 26);
    const year = m.year || '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.08)"/>
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#g)"/>
      <rect width="400" height="400" fill="url(#dots)"/>
      <text x="200" y="225" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="180" font-weight="800" text-anchor="middle" fill="rgba(255,255,255,0.95)" style="letter-spacing:-0.05em">${escapeXML(first)}</text>
      <text x="200" y="320" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="rgba(255,255,255,0.92)">${escapeXML(name)}</text>
      <text x="200" y="350" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="14" font-weight="500" text-anchor="middle" fill="rgba(255,255,255,0.7)">${escapeXML(year)}${m.origin_country ? ' · ' + escapeXML(m.origin_country) : ''}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function escapeXML(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ---------- 4. Wikipedia image lookup ----------
  // Best-effort: search Wikipedia for the meme name, return the lead image URL.
  // Returns null if anything fails.
  async function fetchWikipediaImage(m) {
    if (imageCache.has(m.id)) return imageCache.get(m.id);
    const queries = uniqueQueriesFor(m);
    for (const q of queries) {
      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&srlimit=1&origin=*`;
        const searchRes = await fetch(searchUrl, { headers: { 'Api-User-Agent': 'MemeCodex/1.0' } });
        if (!searchRes.ok) continue;
        const searchData = await searchRes.json();
        const hit = searchData?.query?.search?.[0];
        if (!hit) continue;
        const title = hit.title;
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original|thumbnail&pithumbsize=600&format=json&titles=${encodeURIComponent(title)}&origin=*`;
        const imgRes = await fetch(imgUrl, { headers: { 'Api-User-Agent': 'MemeCodex/1.0' } });
        if (!imgRes.ok) continue;
        const imgData = await imgRes.json();
        const pages = imgData?.query?.pages || {};
        const page = Object.values(pages)[0];
        const src = page?.original?.source || page?.thumbnail?.source;
        if (src) {
          imageCache.set(m.id, src);
          return src;
        }
      } catch (e) {
        // continue to next query
      }
    }
    imageCache.set(m.id, null);
    return null;
  }

  function uniqueQueriesFor(m) {
    const base = [m.name, (m.tags || []).find(t => t.length > 3), (m.short_desc || '').split(' ').slice(0, 3).join(' ')].filter(Boolean);
    return Array.from(new Set(base)).slice(0, 3);
  }

  // ---------- 5. Resolve the best available image for a meme ----------
  function resolvedImage(m) {
    if (m.image_url) return m.image_url;
    return svgDataUrl(m);
  }

  // ---------- 6. State ----------
  const state = {
    search: '',
    filters: { era: 'all', region: 'all', category: 'all' },
  };

  // ---------- 7. DOM refs ----------
  const $ = (id) => document.getElementById(id);
  const dom = {
    grid: $('memeGrid'),
    empty: $('emptyState'),
    resultCount: $('resultCount'),
    totalCount: $('totalCount'),
    statTotal: $('statTotal'),
    statCountries: $('statCountries'),
    statEra: $('statEra'),
    featured: $('featured'),
    featuredGrid: $('featuredGrid'),
    timeline: $('timelineTrack'),
    searchInput: $('searchInput'),
    clearFilters: $('clearFilters'),
    modal: $('modal'),
    modalImage: $('modalImage'),
    modalMeta: $('modalMeta'),
    modalTitle: $('modalTitle'),
    modalDesc: $('modalDesc'),
    modalOrigin: $('modalOrigin'),
    modalMeaning: $('modalMeaning'),
    modalTags: $('modalTags'),
    modalClose: $('modalClose'),
  };

  // ---------- 8. Init ----------
  if (allMemes.length === 0) {
    dom.grid.innerHTML = `<div class="loading-message">No meme data loaded. Make sure <code>data/memes_en.js</code> and <code>data/memes_intl.js</code> exist.</div>`;
    return;
  }

  // Hero stats
  dom.statTotal.textContent = allMemes.length;
  const countries = new Set(allMemes.map(m => m.origin_country).filter(Boolean));
  dom.statCountries.textContent = countries.size;
  const eras = new Set(allMemes.map(m => m.era).filter(Boolean));
  dom.statEra.textContent = eras.size;
  dom.totalCount.textContent = allMemes.length;

  // Featured picks
  const featuredIds = [
    'doge', 'pepe', 'distracted-boyfriend', 'rickroll', 'nyan-cat',
    'grumpy-cat', 'hide-the-pain-harold', 'this-is-fine', 'success-kid',
    'bad-luck-brian', 'coffin-dance', 'among-us-sus', 'harambe',
    'salt-bae', 'expanding-brain', 'surprised-pikachu', 'mocking-spongebob',
    'kakao-emoticon', 'gangnam-style', 'squid-game', 'i-dont-want-to-study',
    'natasha-we-dropped', 'quelle-horreur'
  ];
  const featuredPicks = featuredIds
    .map(id => allMemes.find(m => m.id === id))
    .filter(Boolean)
    .slice(0, 6);
  if (featuredPicks.length > 0) {
    dom.featured.hidden = false;
    dom.featuredGrid.innerHTML = featuredPicks.map(m => featuredCardHTML(m)).join('');
    dom.featuredGrid.querySelectorAll('.featured-card').forEach((el, i) => {
      el.addEventListener('click', () => openModal(featuredPicks[i]));
    });
  }

  renderTimeline();

  // Filter chips
  document.querySelectorAll('.filter-group').forEach(group => {
    const filterKey = group.dataset.filter;
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.filters[filterKey] = chip.dataset.value;
        renderGrid();
      });
    });
  });

  // Search
  dom.searchInput.addEventListener('input', (e) => {
    state.search = e.target.value.toLowerCase().trim();
    renderGrid();
  });

  // Clear filters
  dom.clearFilters?.addEventListener('click', () => {
    state.filters = { era: 'all', region: 'all', category: 'all' };
    state.search = '';
    dom.searchInput.value = '';
    document.querySelectorAll('.filter-group').forEach(group => {
      group.querySelectorAll('.chip').forEach((c, i) => {
        c.classList.toggle('active', i === 0);
      });
    });
    renderGrid();
  });

  // Modal
  dom.modalClose.addEventListener('click', closeModal);
  const modalFootClose = document.getElementById('modalFootClose');
  if (modalFootClose) modalFootClose.addEventListener('click', closeModal);
  dom.modal.addEventListener('click', (e) => {
    if (e.target === dom.modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dom.modal.hidden) closeModal();
  });

  // ---------- 9. Lazy Wikipedia image loader ----------
  // After each render, attach an IntersectionObserver to each card that lacks
  // a real image. When the card scrolls into view, we try to upgrade its
  // src to a Wikipedia image; if Wikipedia fails, leave the SVG placeholder.
  const lazyObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const memeId = el.dataset.id;
      const meme = allMemes.find(m => m.id === memeId);
      lazyObserver.unobserve(el);
      if (!meme || meme.image_url) return;
      fetchWikipediaImage(meme).then(url => {
        if (!url) return;
        // Cache back onto the meme object so the modal also benefits
        meme.image_url = url;
        // Update the card image
        const img = el.querySelector('img.card-img');
        if (img) {
          img.src = url;
          img.onerror = () => {
            // If even the wikipedia image fails, fall back to the svg
            img.src = svgDataUrl(meme);
          };
        }
      });
    });
  }, { rootMargin: '200px 0px' }) : null;

  // ---------- 10. Render ----------
  function renderGrid() {
    const filtered = allMemes.filter(m => {
      if (state.filters.era !== 'all' && m.era !== state.filters.era) return false;
      if (state.filters.region !== 'all' && m.origin_country !== state.filters.region) return false;
      if (state.filters.category !== 'all' && m.category !== state.filters.category) return false;
      if (state.search) {
        const hay = [
          m.name, m.short_desc, m.origin_story, m.meaning,
          ...(m.tags || [])
        ].join(' ').toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => (a.year || 0) - (b.year || 0));

    dom.resultCount.textContent = filtered.length;

    if (filtered.length === 0) {
      dom.grid.innerHTML = '';
      dom.empty.hidden = false;
      return;
    }
    dom.empty.hidden = true;

    dom.grid.innerHTML = filtered.map(m => cardHTML(m)).join('');

    dom.grid.querySelectorAll('.meme-card').forEach((el) => {
      const id = el.dataset.id;
      const meme = allMemes.find(m => m.id === id);
      el.addEventListener('click', () => openModal(meme));
      // Observe cards that need a Wikipedia upgrade
      if (lazyObserver && meme && !meme.image_url) {
        lazyObserver.observe(el);
      }
    });
  }

  function cardHTML(m) {
    const typeShort = shortType(m.category);
    const initialSrc = resolvedImage(m);
    return `
      <article class="meme-card" data-id="${escapeHTML(m.id)}">
        <div class="meme-thumb">
          <img class="card-img" src="${escapeHTML(initialSrc)}" alt="${escapeHTML(m.name)}" loading="lazy">
          <span class="year-badge">${m.year || '—'}</span>
          <span class="type-tag">${typeShort}</span>
        </div>
        <div class="meme-meta">
          <h3 class="meme-name">${escapeHTML(m.name)}</h3>
          <p class="meme-sub">${escapeHTML(m.short_desc || '')}</p>
        </div>
      </article>
    `;
  }

  function featuredCardHTML(m) {
    const initialSrc = resolvedImage(m);
    return `
      <div class="featured-card" data-id="${escapeHTML(m.id)}">
        <span class="badge">Pick</span>
        <img src="${escapeHTML(initialSrc)}" alt="${escapeHTML(m.name)}" loading="lazy">
        <div class="gradient"></div>
        <div class="info">
          <h3>${escapeHTML(m.name)}</h3>
          <p>${m.year || ''} · ${m.origin_country || ''}</p>
        </div>
      </div>
    `;
  }

  function shortType(t) {
    const map = {
      image_macro: 'Image',
      reaction_gif: 'Reaction',
      video_format: 'Video',
      audio_format: 'Audio',
      character: 'Character',
      template: 'Template',
      event: 'Event',
      copypasta: 'Text',
      slang: 'Slang',
    };
    return map[t] || 'Meme';
  }

  function renderTimeline() {
    const startYear = 2007;
    const endYear = 2026;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    const counts = years.map(y => allMemes.filter(m => m.year === y).length);
    const maxCount = Math.max(...counts, 1);

    let html = '';
    years.forEach((y, i) => {
      const c = counts[i];
      const height = c > 0 ? Math.max(8, (c / maxCount) * 140) : 2;
      html += `<div class="timeline-bar" style="height:${height}px;" data-year="${y}">
        <span class="year-label">${y}</span>
        ${c > 0 ? `<span class="count">${c}</span>` : ''}
      </div>`;
    });
    dom.timeline.innerHTML = html;

    dom.timeline.querySelectorAll('.timeline-bar').forEach(bar => {
      bar.addEventListener('click', () => {
        const year = parseInt(bar.dataset.year, 10);
        state.filters = { era: 'all', region: 'all', category: 'all' };
        state.search = String(year);
        dom.searchInput.value = String(year);
        document.querySelectorAll('.filter-group').forEach(group => {
          group.querySelectorAll('.chip').forEach((c, i) => {
            c.classList.toggle('active', i === 0);
          });
        });
        renderGrid();
        document.getElementById('grid').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ---------- 11. Modal ----------
  async function openModal(m) {
    if (!m) return;
    dom.modalMeta.innerHTML = `
      <span class="pill year">${m.year || '—'}</span>
      <span class="pill">${m.origin_country || '—'}</span>
      <span class="pill">${m.era || ''}</span>
      <span class="pill">${m.category || ''}</span>
    `;
    dom.modalTitle.textContent = m.name;
    dom.modalDesc.textContent = m.short_desc || '';

    if (m.origin_story && m.origin_story.trim()) {
      dom.modalOrigin.innerHTML = escapeHTML(m.origin_story);
    } else {
      dom.modalOrigin.innerHTML = '<span class="empty-msg">No origin story recorded for this meme yet.</span>';
    }

    if (m.meaning && m.meaning.trim()) {
      dom.modalMeaning.innerHTML = escapeHTML(m.meaning);
    } else {
      dom.modalMeaning.innerHTML = '<span class="empty-msg">No usage notes recorded for this meme yet.</span>';
    }

    dom.modalTags.innerHTML = (m.tags || [])
      .map(t => `<span class="modal-tag">#${escapeHTML(t)}</span>`)
      .join('');

    // Image: try the best available, upgrade async if needed
    let imgUrl = m.image_url;
    if (!imgUrl) {
      // Try Wikipedia lazily
      imgUrl = await fetchWikipediaImage(m);
      if (imgUrl) m.image_url = imgUrl;
    }
    if (!imgUrl) imgUrl = svgDataUrl(m);

    dom.modalImage.src = imgUrl;
    dom.modalImage.alt = m.name;
    dom.modalImage.onerror = () => {
      // If the resolved URL still fails (e.g. Wikipedia image 404), fall back
      dom.modalImage.src = svgDataUrl(m);
    };

    dom.modal.style.display = '';
    dom.modal.hidden = false;
    dom.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    dom.modal.hidden = true;
    dom.modal.style.display = 'none';
    dom.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ---------- 12. Helpers ----------
  function escapeHTML(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // First render
  renderGrid();
})();
