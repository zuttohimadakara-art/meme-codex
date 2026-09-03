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

  // Build a slug->image lookup from either file
  // (already in each entry, but we keep this here for future hookups)

  // ---------- 2. State ----------
  const state = {
    search: '',
    filters: { era: 'all', region: 'all', category: 'all' },
    sortBy: 'year', // could be 'peak' later
  };

  // ---------- 3. DOM refs ----------
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
    modalFallback: $('modalFallback'),
    modalKymLink: $('modalKymLink'),
    modalMeta: $('modalMeta'),
    modalTitle: $('modalTitle'),
    modalDesc: $('modalDesc'),
    modalOrigin: $('modalOrigin'),
    modalMeaning: $('modalMeaning'),
    modalTags: $('modalTags'),
    modalSource: $('modalSource'),
    modalClose: $('modalClose'),
  };

  // ---------- 4. Init ----------
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

  // Featured picks (curator's selection: well-known global icons)
  const featuredIds = [
    'doge', 'pepe', 'distracted-boyfriend', 'rickroll', 'nyan-cat',
    'grumpy-cat', 'hide-the-pain-harold', 'this-is-fine', 'success-kid',
    'bad-luck-brian', 'coffin-dance', 'among-us-sus', 'harambe',
    'salt-bae', 'expanding-brain', 'surprised-pikachu', 'mocking-spongebob',
    'kakao-emoticon', 'gangnam-style', 'squid-game', 'chinese-bilibili-study-meme',
    'russian-natasha-meme', 'french-quelle-horreur'
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

  // Timeline (20-year bar chart, 2007–2026)
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
  dom.modal.addEventListener('click', (e) => {
    if (e.target === dom.modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dom.modal.hidden) closeModal();
  });

  // ---------- 5. Render ----------
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
    });
  }

  function cardHTML(m) {
    const placeholderText = (m.name || '?').charAt(0).toUpperCase();
    const typeShort = shortType(m.category);
    const imgHTML = m.image_url
      ? `<img src="${escapeHTML(m.image_url)}" alt="${escapeHTML(m.name)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
      : '';
    const placeholderHTML = `<div class="placeholder" style="${m.image_url ? 'display:none' : 'display:flex'}">${escapeHTML(placeholderText)}</div>`;

    return `
      <article class="meme-card" data-id="${escapeHTML(m.id)}">
        <div class="meme-thumb">
          ${imgHTML}
          ${placeholderHTML}
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
    const placeholderText = (m.name || '?').charAt(0).toUpperCase();
    const imgHTML = m.image_url
      ? `<img src="${escapeHTML(m.image_url)}" alt="${escapeHTML(m.name)}" loading="lazy" onerror="this.style.display='none';">`
      : '';
    return `
      <div class="featured-card" data-id="${escapeHTML(m.id)}">
        <span class="badge">Pick</span>
        ${imgHTML}
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

    // Clicking a bar filters the grid
    dom.timeline.querySelectorAll('.timeline-bar').forEach(bar => {
      bar.addEventListener('click', () => {
        const year = parseInt(bar.dataset.year, 10);
        // Reset region/category, set search to the year
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

  // ---------- 6. Modal ----------
  function openModal(m) {
    if (!m) return;
    dom.modalMeta.innerHTML = `
      <span class="pill year">${m.year || '—'}</span>
      <span class="pill">${m.origin_country || '—'}</span>
      <span class="pill">${m.era || ''}</span>
      <span class="pill">${m.category || ''}</span>
    `;
    dom.modalTitle.textContent = m.name;
    dom.modalDesc.textContent = m.short_desc || '';
    dom.modalOrigin.textContent = m.origin_story || '—';
    dom.modalMeaning.textContent = m.meaning || '—';
    dom.modalTags.innerHTML = (m.tags || [])
      .map(t => `<span class="modal-tag">#${escapeHTML(t)}</span>`)
      .join('');

    // Image
    if (m.image_url) {
      dom.modalImage.src = m.image_url;
      dom.modalImage.alt = m.name;
      dom.modalImage.style.display = 'block';
      dom.modalFallback.hidden = true;
      dom.modalImage.onerror = () => {
        dom.modalImage.style.display = 'none';
        dom.modalFallback.hidden = false;
        dom.modalKymLink.href = `https://knowyourmeme.com/search?q=${encodeURIComponent(m.name)}`;
      };
    } else {
      dom.modalImage.style.display = 'none';
      dom.modalFallback.hidden = false;
      dom.modalKymLink.href = `https://knowyourmeme.com/search?q=${encodeURIComponent(m.name)}`;
    }

    // Source link — prefer KYM search by name
    const kym = `https://knowyourmeme.com/search?q=${encodeURIComponent(m.name)}`;
    dom.modalSource.href = kym;

    dom.modal.hidden = false;
    dom.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    dom.modal.hidden = true;
    dom.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ---------- 7. Helpers ----------
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
