// ============================================================
// TURKIY YOZMA YODGORLIKLAR KORPUSI — SPA + Asosiy mantiq
// ============================================================

(function () {
  "use strict";

  // ─── Old Turkic rune characters for canvas ─────────────────
  const RUNE_CHARS = [
    "𐰀","𐰉","𐰃","𐰏","𐰑","𐰒","𐰔","𐰚","𐰞","𐰠",
    "𐰣","𐰤","𐰨","𐰭","𐰯","𐰰","𐰴","𐰶","𐱃","𐱅",
    "𐰋","𐰌","𐰍","𐰎","𐰓","𐰕","𐰗","𐰘","𐰙","𐰛",
    "𐰜","𐰝","𐰟","𐰡","𐰢","𐰥","𐰦","𐰧","𐰩","𐰪",
    "𐰫","𐰬","𐰱","𐰲","𐰳","𐰵","𐰷","𐰸","𐰹","𐰺",
    "𐰻","𐰼","𐰽","𐰾","𐰿","𐱀","𐱁","𐱂","𐱄","𐱆"
  ];

  // ─── State ─────────────────────────────────────────────────
  const state = {
    currentPage: "home",
    filter: { script: "all", category: "all", century: "all", sort: "date_asc", query: "" },
    view: "grid",
    pagesRendered: {},
    statsCache: null,
  };

  // ─── Data source helper ────────────────────────────────────
  // CorpusAPI is defined in api.js; falls back to CorpusDB for file://
  const DB = (typeof CorpusAPI !== "undefined") ? CorpusAPI : null;

  async function dbGetAll() {
    if (DB) return (await DB.getAll()).monuments || [];
    return CorpusDB.getAll();
  }

  async function dbGetById(id) {
    if (DB) return DB.getById(id);
    return CorpusDB.getById(id);
  }

  async function dbFilter(f) {
    if (DB) {
      const params = {};
      if (f.script && f.script !== "all") params.script = f.script;
      if (f.category && f.category !== "all") params.category = f.category;
      if (f.query) params.q = f.query;
      if (f.sort) {
        const sortMap = { date_asc:"year", date_desc:"year_desc", alpha:"title", views:"views" };
        params.sort = sortMap[f.sort] || "year";
      }
      const res = await DB.getAll(params);
      return res.monuments || [];
    }
    return CorpusDB.filter(f);
  }

  async function dbSearch(q) {
    if (DB) return (await DB.search(q)).monuments || [];
    return CorpusDB.search(q);
  }

  async function dbStats() {
    if (DB) return DB.getStats();
    return CorpusDB.getStats();
  }

  // ─── SPA Navigation ────────────────────────────────────────
  function navigateTo(pageId) {
    if (state.currentPage === pageId) return;
    const prev = document.getElementById("spa-" + state.currentPage);
    const next = document.getElementById("spa-" + pageId);
    if (!next) return;

    if (prev) prev.classList.remove("active");
    next.classList.add("active");
    next.classList.remove("spa-anim");
    void next.offsetWidth;
    next.classList.add("spa-anim");

    state.currentPage = pageId;
    window.scrollTo({ top: 0, behavior: "instant" });

    document.querySelectorAll(".nav-links a[data-spa]").forEach(a => {
      a.classList.toggle("active", a.dataset.spa === pageId);
    });

    if (!state.pagesRendered[pageId]) {
      if (pageId === "yodgorliklar") renderMonuments();
      if (pageId === "vaqt") { renderTimeline(); renderTimelineCards(); }
      if (pageId === "yozuvlar") { renderScriptCards(); renderAlphabet(); }
      if (pageId === "statistika") renderStats();
      if (pageId === "haqida") renderAllMonumentsList();
      if (pageId === "arxitektura") initArchChecks();
      if (pageId === "bibliografiya") renderBibliografiya();
      if (pageId === "sozlik") renderSozlik();
      if (pageId === "taqqoslash") initTaqqoslash();
      if (pageId === "xarita") initXarita();
      if (pageId === "taklif") { initFileUploadZones(); }
      state.pagesRendered[pageId] = true;
    }
    setTimeout(initScrollReveal, 80);

    document.getElementById("navLinks")?.classList.remove("mobile-open");
    history.replaceState(null, "", "#" + pageId);
  }

  window.navigateTo = navigateTo;

  // ─── Init nav links ─────────────────────────────────────────
  function initNav() {
    document.querySelectorAll("a[data-spa]").forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        navigateTo(a.dataset.spa);
      });
    });

    const ham = document.getElementById("hamburger");
    const links = document.getElementById("navLinks");
    ham?.addEventListener("click", () => links?.classList.toggle("mobile-open"));

    // Dropdown — click toggle
    const dropdown = document.querySelector(".nav-dropdown");
    const moreBtn = dropdown?.querySelector(".nav-more-btn");
    moreBtn?.addEventListener("click", e => {
      e.preventDefault();
      dropdown.classList.toggle("open");
    });
    // Tashqariga bosganda yopsin
    document.addEventListener("click", e => {
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
    // Dropdown ichidagi link bosilganda ham yopsin
    dropdown?.querySelectorAll("a[data-spa]").forEach(a => {
      a.addEventListener("click", () => dropdown.classList.remove("open"));
    });

    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById("spa-" + hash)) {
      state.pagesRendered["home"] = true;
      navigateTo(hash);
    }
  }

  // ─── Canvas Particle System ─────────────────────────────────
  class RuneParticle {
    constructor(canvas) { this.canvas = canvas; this.reset(true); }
    reset(initial = false) {
      this.char = RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)];
      this.x = Math.random() * this.canvas.width;
      this.y = initial ? Math.random() * this.canvas.height : -40;
      this.size = Math.random() * 18 + 8;
      this.color = Math.random() < 0.5 ? "#1c5fb8" : "#c79a1f";
      this.opacity = Math.random() * 0.16 + 0.05;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = Math.random() * 0.3 + 0.08;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.008;
      this.life = 0;
      this.maxLife = Math.random() * 500 + 300;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.rotation += this.rotSpeed; this.life++;
      const fi = Math.min(1, this.life / 60);
      const fo = Math.min(1, (this.maxLife - this.life) / 60);
      this.cur = this.opacity * fi * fo;
      if (this.y > this.canvas.height + 40 || this.life > this.maxLife) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.cur || 0;
      ctx.fillStyle = this.color;
      ctx.font = `${this.size}px serif`;
      ctx.fillText(this.char, 0, 0);
      ctx.restore();
    }
  }

  function initParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const particles = [];
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 55; i++) particles.push(new RuneParticle(canvas));
    (function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(ctx); });
      requestAnimationFrame(frame);
    })();
  }

  // ─── Animated Counter ───────────────────────────────────────
  function animateCounter(el, target, duration = 1600, suffix = "") {
    if (!el) return;
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease).toLocaleString("uz-UZ") + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  async function initHeroCounters() {
    try {
      const s = await dbStats();
      animateCounter(document.getElementById("counter-total"), s.total || 0);
      animateCounter(document.getElementById("counter-words"), Math.round((s.totalWords || 0) / 1000), 1600, "K+");
      animateCounter(document.getElementById("counter-scripts"), s.scripts || 0);
      animateCounter(document.getElementById("counter-views"), s.totalViews || 0);
    } catch (e) {
      console.warn("Stats load error:", e);
    }
  }

  // ─── Monument Cards ─────────────────────────────────────────
  function getScriptInfo(script) {
    return SCRIPTS_INFO[script] || { name: script, color: "#888", bg: "#1a1a1a", icon: "?" };
  }
  function getCategoryIcon(cat) {
    return {
      bitiglar:"🗿", qollanmalar:"📜", diniy:"🕌", adabiy:"📚", boshqa:"📄",
      tosh_bitik:"🗿", qolyozma:"📜", doston:"📚", lugat:"📖", yozuv:"✍️"
    }[cat] || "📄";
  }
  function getStars(n) { return "★".repeat(n||3) + "☆".repeat(5-(n||3)); }

  function renderMonumentCard(m) {
    const s = getScriptInfo(m.script);
    const featuredBadge = m.featured ? `<span class="badge badge-featured">★ Tanlangan</span>` : "";
    const fallbackHtml = `<div class="m-card-thumb-fallback">
        <span style="font-size:38px;position:relative;z-index:1">${getCategoryIcon(m.category)}</span>
        <span style="font-size:10px;color:rgba(201,168,76,0.5);text-transform:uppercase;letter-spacing:2px;position:relative;z-index:1">${s.name}</span>
      </div>`;
    const thumbHtml = m.image
      ? `<div class="m-card-thumb">
           <img src="${m.image}" alt="${m.title}" loading="lazy"
             onerror="this.parentElement.innerHTML='${fallbackHtml.replace(/'/g,"\\'").replace(/\n\s*/g,' ')}'">`
        + `</div>`
      : `<div class="m-card-thumb">${fallbackHtml}</div>`;
    return `
      <article class="m-card" data-id="${m.id}" tabindex="0" role="button">
        ${thumbHtml}
        <div class="m-card-accent"></div>
        <div class="m-card-top">
          <div class="m-card-icon" style="background:${s.bg};color:${s.color}">${getCategoryIcon(m.category)}</div>
          <div class="m-card-badges">
            ${featuredBadge}
            <span class="badge badge-century">${m.century}-asr</span>
            <span class="badge badge-script" style="color:${s.color}">${s.icon} ${s.name}</span>
          </div>
        </div>
        <div class="m-card-body">
          <h3 class="m-card-title">${m.title}</h3>
          <p class="m-card-subtitle">${m.subtitle || m.era || m.date || ""}</p>
          <p class="m-card-location">
            <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.333A4.667 4.667 0 0 0 3.333 6c0 3.5 4.667 8.667 4.667 8.667S12.667 9.5 12.667 6A4.667 4.667 0 0 0 8 1.333zm0 6.334a1.667 1.667 0 1 1 0-3.334 1.667 1.667 0 0 1 0 3.334z"/></svg>
            ${(m.location||"").split(",")[0]}
          </p>
          <p class="m-card-desc">${m.description}</p>
        </div>
        <div class="m-card-footer">
          <div class="m-card-meta">
            <span>📝 ${(m.wordCount||0).toLocaleString()}</span>
            <span>👁 ${(m.views||0).toLocaleString()}</span>
            <span style="color:var(--gold)">${getStars(m.importance)}</span>
          </div>
          <button class="m-card-btn">Ko'rish →</button>
        </div>
      </article>`;
  }

  async function renderMonuments() {
    const grid = document.getElementById("monumentsGrid");
    if (!grid) return;
    grid.innerHTML = `<div class="skeleton" style="height:200px;border-radius:20px"></div>`.repeat(3);
    try {
      const data = await dbFilter(state.filter);
      if (!data.length) {
        grid.innerHTML = `<div class="no-results"><div class="no-results-icon">🔍</div><h3>Yodgorlik topilmadi</h3><p style="color:var(--text3);font-size:14px">Qidiruv parametrlarini o'zgartiring</p></div>`;
        return;
      }
      grid.className = `monuments-grid ${state.view === "list" ? "list-view" : ""}`;
      grid.innerHTML = data.map(renderMonumentCard).join("");
      grid.querySelectorAll(".m-card").forEach(c => {
        const open = () => openModal(parseInt(c.dataset.id));
        c.addEventListener("click", open);
        c.addEventListener("keydown", e => { if (e.key === "Enter") open(); });
      });
    } catch (e) {
      grid.innerHTML = `<div class="no-results"><div class="no-results-icon">⚠️</div><h3>Xatolik yuz berdi</h3><p style="color:var(--text3);font-size:14px">${e.message}</p></div>`;
    }
  }

  // ─── Filters ───────────────────────────────────────────────
  function initFilters() {
    document.querySelectorAll(".filter-btn[data-script]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn[data-script]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.filter.script = btn.dataset.script;
        state.pagesRendered["yodgorliklar"] = false;
        if (state.currentPage === "yodgorliklar") renderMonuments();
      });
    });
    document.querySelectorAll(".filter-btn[data-cat]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn[data-cat]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.filter.category = btn.dataset.cat;
        state.pagesRendered["yodgorliklar"] = false;
        if (state.currentPage === "yodgorliklar") renderMonuments();
      });
    });
    const sort = document.getElementById("sortSelect");
    sort?.addEventListener("change", () => {
      state.filter.sort = sort.value;
      state.pagesRendered["yodgorliklar"] = false;
      if (state.currentPage === "yodgorliklar") renderMonuments();
    });
    const fsearch = document.getElementById("filterSearch");
    if (fsearch) {
      let t;
      fsearch.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => {
          state.filter.query = fsearch.value;
          state.pagesRendered["yodgorliklar"] = false;
          if (state.currentPage === "yodgorliklar") renderMonuments();
        }, 280);
      });
    }
    document.querySelectorAll(".view-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.view = btn.dataset.view;
        state.pagesRendered["yodgorliklar"] = false;
        if (state.currentPage === "yodgorliklar") renderMonuments();
      });
    });
  }

  // ─── Modal ─────────────────────────────────────────────────
  async function openModal(id) {
    try {
      const m = await dbGetById(id);
      if (!m) return;
      const overlay = document.getElementById("modalOverlay");
      const s = getScriptInfo(m.script);

      overlay.querySelector("#modalTitle").textContent = m.title;
      overlay.querySelector("#modalSubtitle").textContent = m.subtitle || m.titleOriginal || m.era || "";

      overlay.querySelector("#modalMeta").innerHTML = [
        ["Sana", m.date], ["Asr", `${m.century}-asr`],
        ["Yozuv", s.name], ["Til", m.language],
        ["Joylashuv", m.location], ["Turi", CATEGORIES_INFO[m.category]?.name || m.category],
        ["So'zlar", (m.wordCount||0).toLocaleString()], ["Qatorlar", (m.lineCount||0).toLocaleString()],
        ["Ko'rishlar", (m.views||0).toLocaleString()], ["Holat", m.status||"—"],
      ].map(([l,v]) => `<div class="modal-meta-item"><div class="modal-meta-lbl">${l}</div><div class="modal-meta-val">${v||"—"}</div></div>`).join("");

      // Increment view count
      if (typeof CorpusDB !== "undefined") CorpusDB.incrementViews(id);

      const imgHtml = m.image
        ? `<div class="modal-image-wrap"><img src="${m.image}" alt="${m.title}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<span style=\\'font-size:64px\\'>${getCategoryIcon(m.category)}</span>'"></div>`
        : `<div class="modal-image-wrap"><span style="font-size:64px">${getCategoryIcon(m.category)}</span></div>`;

      overlay.querySelector("#tabAbout").innerHTML = `
        ${imgHtml}
        <div class="modal-section"><h4 class="modal-section-title">Tavsif</h4><p class="modal-desc">${m.description||"—"}</p></div>
        ${m.significance ? `<div class="modal-section"><h4 class="modal-section-title">Ahamiyati</h4><p class="modal-desc">${m.significance}</p></div>` : ""}
        ${m.tags?.length ? `<div class="modal-section"><h4 class="modal-section-title">Teglar</h4><div class="modal-tags">${m.tags.map(t=>`<span class="modal-tag">#${t}</span>`).join("")}</div></div>` : ""}`;

      overlay.querySelector("#tabText").innerHTML = `
        ${m.transcription||m.fullText ? `<div class="modal-section"><h4 class="modal-section-title">Asl matn</h4><div class="modal-text-block original">${m.transcription||m.fullText}</div></div>` : ""}
        ${m.transliteration ? `<div class="modal-section"><h4 class="modal-section-title">Transliteratsiya</h4><div class="modal-text-block">${m.transliteration}</div></div>` : ""}
        ${m.translation ? `<div class="modal-section"><h4 class="modal-section-title">O'zbek tarjimasi</h4><div class="modal-text-block">${m.translation}</div></div>` : ""}
        ${!m.transcription && !m.fullText && !m.transliteration && !m.translation ? `<p style="color:var(--text3);text-align:center;padding:40px">Matn ma'lumotlari kiritilmagan</p>` : ""}`;

      overlay.querySelector("#tabResearch").innerHTML = `
        ${m.researchers?.length ? `<div class="modal-section"><h4 class="modal-section-title">Tadqiqotchilar</h4><div class="modal-researchers">${m.researchers.map(r=>`<span class="researcher-tag">👤 ${r}</span>`).join("")}</div></div>` : ""}
        ${m.bibliography?.length ? `<div class="modal-section"><h4 class="modal-section-title">Bibliografiya</h4><ul class="modal-bib">${m.bibliography.map(b=>`<li>📚 ${b}</li>`).join("")}</ul></div>` : ""}`;

      // Modal footer actions
      let footerEl = overlay.querySelector(".modal-footer-actions");
      if (!footerEl) {
        footerEl = document.createElement("div");
        footerEl.className = "modal-footer-actions";
        footerEl.style.cssText = "display:flex;gap:10px;padding:16px 28px;border-top:1px solid var(--border);flex-wrap:wrap";
        overlay.querySelector(".modal-body").appendChild(footerEl);
      }
      footerEl.innerHTML = `
        <button class="kwic-btn" style="flex:1;min-width:120px" onclick="openReader(${m.id});closeModal()">📖 O'qish</button>
        <button class="kwic-btn" style="flex:1;min-width:120px;background:var(--gold)" onclick="startCompare(${m.id})">⚖️ Taqqoslash</button>
        <a class="export-btn" href="/api/export/?format=json" style="padding:10px 16px;display:flex;align-items:center" download>⬇ JSON</a>
        <a class="export-btn" href="/api/export/?format=csv" style="padding:10px 16px;display:flex;align-items:center" download>⬇ CSV</a>`;

      activateModalTab("about");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    } catch (e) {
      console.error("Modal error:", e);
    }
  }
  window.openModal = openModal;

  function activateModalTab(tab) {
    document.querySelectorAll(".modal-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
    document.querySelectorAll(".modal-tab-content").forEach(c => c.classList.toggle("active", c.id === `tab${tab.charAt(0).toUpperCase()+tab.slice(1)}`));
  }

  function closeModal() {
    document.getElementById("modalOverlay")?.classList.remove("open");
    document.body.style.overflow = "";
  }
  window.closeModal = closeModal;

  function startCompare(id) {
    closeModal();
    navigateTo('taqqoslash');
    setTimeout(async () => {
      const sel = document.getElementById("compareLeft");
      if (sel && !sel.value) { sel.value = id; renderCompare(); }
      else {
        const sel2 = document.getElementById("compareRight");
        if (sel2) { sel2.value = id; renderCompare(); }
      }
    }, 300);
  }
  window.startCompare = startCompare;

  function initModal() {
    const overlay = document.getElementById("modalOverlay");
    overlay?.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
    document.getElementById("modalClose")?.addEventListener("click", closeModal);
    document.querySelectorAll(".modal-tab").forEach(t => t.addEventListener("click", () => activateModalTab(t.dataset.tab)));
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeSearch(); } });
  }

  // ─── Search Overlay ────────────────────────────────────────
  function openSearch() {
    document.getElementById("searchOverlay")?.classList.add("open");
    setTimeout(() => document.getElementById("searchOverlayInput")?.focus(), 80);
    document.body.style.overflow = "hidden";
  }
  function closeSearch() {
    document.getElementById("searchOverlay")?.classList.remove("open");
    document.body.style.overflow = "";
  }

  function initSearch() {
    document.getElementById("searchBtn")?.addEventListener("click", openSearch);
    document.getElementById("searchClose")?.addEventListener("click", closeSearch);
    const overlay = document.getElementById("searchOverlay");
    overlay?.addEventListener("click", e => { if (e.target === overlay) closeSearch(); });

    const input = document.getElementById("searchOverlayInput");
    const results = document.getElementById("searchResults");
    if (!input || !results) return;

    let debounce;
    input.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(async () => {
        const q = input.value.trim();
        if (!q) { results.innerHTML = ""; return; }
        try {
          const found = (await dbSearch(q)).slice(0, 8);
          if (!found.length) { results.innerHTML = `<p style="color:var(--text3);text-align:center;padding:20px">Hech narsa topilmadi</p>`; return; }
          results.innerHTML = found.map(m => `
            <div class="search-result-item" data-id="${m.id}">
              <div class="search-result-title">${m.title}</div>
              <div class="search-result-meta">${m.date||m.year} · ${getScriptInfo(m.script).name} · ${m.location}</div>
            </div>`).join("");
          results.querySelectorAll(".search-result-item").forEach(item => {
            item.addEventListener("click", () => {
              closeSearch();
              navigateTo("yodgorliklar");
              setTimeout(() => openModal(parseInt(item.dataset.id)), 350);
            });
          });
        } catch (e) {
          results.innerHTML = `<p style="color:var(--text3);text-align:center;padding:20px">Xatolik yuz berdi</p>`;
        }
      }, 230);
    });
  }

  // ─── Timeline ──────────────────────────────────────────────
  async function renderTimeline() {
    const track = document.getElementById("timelineTrack");
    if (!track || track.children.length > 0) return;

    const monuments = await dbGetAll();
    const byCentury = {};
    monuments.forEach(m => {
      const c = m.century || 7;
      if (!byCentury[c]) byCentury[c] = [];
      byCentury[c].push(m);
    });

    const axis = document.createElement("div");
    axis.className = "timeline-axis";
    track.appendChild(axis);

    Object.keys(byCentury).sort((a,b)=>a-b).forEach(c => {
      const group = document.createElement("div");
      group.className = "tl-century-group";

      const label = document.createElement("div");
      label.className = "tl-century-label";
      label.textContent = `${c}-asr`;
      group.appendChild(label);

      const tick = document.createElement("div");
      tick.className = "tl-century-tick";
      group.appendChild(tick);

      const items = document.createElement("div");
      items.className = "tl-items";
      byCentury[c].forEach(m => {
        const item = document.createElement("div");
        item.className = "tl-item";
        item.innerHTML = `<div class="tl-item-date">${m.date||m.year}</div><div class="tl-item-title">${m.title}</div><div class="tl-item-dot"></div>`;
        item.addEventListener("click", () => openModal(m.id));
        items.appendChild(item);
      });
      group.appendChild(items);
      track.appendChild(group);
    });

    const wrap = track.parentElement;
    let isDown = false, startX, scrollLeft;
    wrap.addEventListener("mousedown", e => { isDown = true; startX = e.pageX - wrap.offsetLeft; scrollLeft = wrap.scrollLeft; });
    wrap.addEventListener("mouseleave", () => isDown = false);
    wrap.addEventListener("mouseup", () => isDown = false);
    wrap.addEventListener("mousemove", e => { if (!isDown) return; e.preventDefault(); wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX); });
  }

  async function renderTimelineCards() {
    const el = document.getElementById("timelineCards");
    if (!el) return;
    const all = (await dbGetAll()).sort((a, b) => (a.century||0) - (b.century||0) || (a.year||0) - (b.year||0));
    el.innerHTML = all.map((m, i) => `
      <div class="timeline-card-item sr" style="transition-delay:${i*0.04}s" onclick="openModal(${m.id})">
        <div class="timeline-card-num">${i+1}</div>
        <div class="timeline-card-body">
          <div class="timeline-card-date">${m.date||m.year} · ${m.century}-asr</div>
          <div class="timeline-card-title">${m.title}</div>
          <div class="timeline-card-sub">${m.language} · ${(m.location||"").split(",")[0]}</div>
        </div>
      </div>`).join("");
    setTimeout(initScrollReveal, 50);
  }

  // ─── Scripts Section ───────────────────────────────────────
  async function renderScriptCards() {
    const el = document.getElementById("scriptsGrid");
    if (!el || el.children.length > 0) return;
    const stats = await dbStats();
    const runes = ["𐰀𐰉𐰃𐰏𐰑","𐰒𐰔𐰚𐰞𐰠","ئاببتث","عبجدذ","𑀩𑀪𑀫"];
    Object.entries(SCRIPTS_INFO).forEach(([key, s], i) => {
      const count = stats.byScript[key] || 0;
      const card = document.createElement("div");
      card.className = "script-card";
      card.style.borderColor = `${s.color}22`;
      card.innerHTML = `
        <span class="script-card-icon" style="color:${s.color}">${s.icon}</span>
        <div class="script-card-name" style="color:${s.color}">${s.name}</div>
        <div class="script-card-count" style="color:${s.color}">${count}</div>
        <div class="script-card-lbl">yodgorlik</div>
        <div class="script-runes-sample" style="color:${s.color}">${runes[i]||""}</div>`;
      el.appendChild(card);
    });
  }

  // ─── Alphabet ───────────────────────────────────────────────
  const ALPHABET = [
    {sym:"𐰀",lat:"a/e"},{sym:"𐰉",lat:"b₁"},{sym:"𐰋",lat:"b₂"},
    {sym:"𐰏",lat:"g/k₁"},{sym:"𐰚",lat:"k₂"},{sym:"𐰑",lat:"d₁"},
    {sym:"𐰒",lat:"d₂"},{sym:"𐱀",lat:"ä"},{sym:"𐰔",lat:"z"},
    {sym:"𐰃",lat:"ı/i"},{sym:"𐰘",lat:"y₁"},{sym:"𐰙",lat:"y₂"},
    {sym:"𐰞",lat:"l₁"},{sym:"𐰠",lat:"l₂"},{sym:"𐰢",lat:"m"},
    {sym:"𐰣",lat:"n₁"},{sym:"𐰤",lat:"n₂"},{sym:"𐰨",lat:"ñ"},
    {sym:"𐰭",lat:"ng"},{sym:"𐱃",lat:"t₁"},{sym:"𐱅",lat:"t₂"},
    {sym:"𐰴",lat:"q"},{sym:"𐰯",lat:"p"},{sym:"𐰺",lat:"r₁"},
    {sym:"𐰼",lat:"r₂"},{sym:"𐰽",lat:"s₁"},{sym:"𐰾",lat:"s₂"},
    {sym:"𐱁",lat:"š"},{sym:"𐰶",lat:"q/ğ"},{sym:"𐰵",lat:"q₂"},
    {sym:"𐰱",lat:"č"},{sym:"𐰲",lat:"č₂"},{sym:"𐰓",lat:"nt/nd"},
  ];

  function renderAlphabet() {
    const el = document.getElementById("alphabetGrid");
    if (!el || el.children.length > 0) return;
    el.innerHTML = ALPHABET.map(c => `
      <div class="alpha-char" title="${c.sym} = ${c.lat}">
        <span class="alpha-char-sym">${c.sym}</span>
        <span class="alpha-char-lat">${c.lat}</span>
      </div>`).join("");
  }

  // ─── "Haqida" page monument list ───────────────────────────
  async function renderAllMonumentsList() {
    const el = document.getElementById("allMonumentsList");
    if (!el || el.children.length > 0) return;
    const all = await dbGetAll();
    el.innerHTML = all.map(m => `
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;transition:all .25s"
           onclick="openModal(${m.id})"
           onmouseenter="this.style.borderColor='rgba(28,95,184,0.35)'"
           onmouseleave="this.style.borderColor='var(--border)'">
        <div style="font-size:13px;font-weight:600;color:var(--text)">${m.title}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:3px">${m.date||m.year} · ${SCRIPTS_INFO[m.script]?.name||m.script}</div>
      </div>`).join("");
  }

  // ─── Statistika sahifasi ────────────────────────────────────
  const SCRIPT_LABELS = {
    "koktürk": "Ko'hna turkiy runik", "uyg'ur": "Eski uyg'ur",
    arab: "Arab yozuvi", sogd: "So'g'diy", "sogʻd": "So'g'diy",
    runik: "Ko'hna turkiy runik", uyghur: "Eski uyg'ur",
    boshqa: "Boshqa"
  };
  const CAT_LABELS = {
    bitiglar: "Tosh bitiklar", qollanmalar: "Qo'llanmalar",
    diniy: "Diniy matnlar", adabiy: "Adabiy asarlar", boshqa: "Boshqa",
    tosh_bitik: "Tosh bitiklar", qolyozma: "Qo'lyozmalar",
    doston: "Dostonlar", lugat: "Lug'atlar"
  };
  const CHART_COLORS = ["#c9a84c","#1c5fb8","#7ecb9e","#a08bc4","#e8913a","#c0392b"];

  function renderBarChart(elId, dataObj, labels, total) {
    const el = document.getElementById(elId);
    if (!el) return;
    const entries = Object.entries(dataObj).sort((a, b) => b[1] - a[1]);
    el.innerHTML = entries.map(([key, count], i) => {
      const pct = total ? Math.round(count / total * 100) : 0;
      return `<div class="stat-bar-item2">
        <div class="stat-bar-label">${labels[key] || key}</div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" data-w="${pct}" style="background:${CHART_COLORS[i%CHART_COLORS.length]};width:0"></div>
        </div>
        <div class="stat-bar-val" style="color:${CHART_COLORS[i%CHART_COLORS.length]}">${count}</div>
      </div>`;
    }).join("");
    requestAnimationFrame(() => {
      el.querySelectorAll(".stat-bar-fill").forEach(b => { b.style.width = b.dataset.w + "%"; });
    });
  }

  function renderDonutChart(elId, dataObj, labels, total) {
    const el = document.getElementById(elId);
    if (!el) return;
    const entries = Object.entries(dataObj).sort((a, b) => b[1] - a[1]);
    if (!entries.length) return;
    const r = 60, cx = 72, cy = 72, circ = 2 * Math.PI * r;
    let offset = 0;
    const slices = entries.map(([key, count], i) => {
      const pct = total ? count / total : 0;
      const dash = pct * circ;
      const s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
        stroke="${CHART_COLORS[i%CHART_COLORS.length]}" stroke-width="18"
        stroke-dasharray="${dash} ${circ - dash}"
        stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"
        style="transition:stroke-dasharray 1.2s ease"/>`;
      offset += dash;
      return s;
    }).join("");

    const legend = entries.map(([key, count], i) => `
      <div class="donut-legend-item">
        <div class="donut-legend-dot" style="background:${CHART_COLORS[i%CHART_COLORS.length]}"></div>
        <span>${labels[key] || key}</span>
        <span style="margin-left:auto;font-weight:700;color:${CHART_COLORS[i%CHART_COLORS.length]}">${count}</span>
      </div>`).join("");

    el.innerHTML = `<div class="donut-chart-wrap">
      <div class="donut-svg-wrap">
        <svg width="144" height="144" viewBox="0 0 144 144">${slices}</svg>
        <div class="donut-center">
          <div class="donut-center-num">${total}</div>
          <div class="donut-center-lbl">Jami</div>
        </div>
      </div>
      <div class="donut-legend">${legend}</div>
    </div>`;
  }

  async function renderStats() {
    try {
      const stats = await dbStats();
      animateCounter(document.getElementById("sb-total"), stats.total || 0);
      animateCounter(document.getElementById("sb-words"), Math.round((stats.totalWords||0)/1000), 1400, "K+");
      animateCounter(document.getElementById("sb-scripts"), stats.scripts || 0);
      animateCounter(document.getElementById("sb-views"), stats.totalViews || 0);

      renderBarChart("statByScript", stats.byScript || {}, SCRIPT_LABELS, stats.total);
      renderBarChart("statByCentury", stats.byCentury || {}, {
        "6":"VI asr","7":"VII asr","8":"VIII asr","9":"IX asr","10":"X asr","11":"XI asr"
      }, stats.total);
      renderDonutChart("donutChart", stats.byCategory || {}, CAT_LABELS, stats.total);

      const topEl = document.getElementById("topMonuments");
      if (topEl && stats.topViewed) {
        topEl.innerHTML = stats.topViewed.map(m => {
          const s = getScriptInfo(m.script);
          return `<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r2);padding:20px;cursor:pointer;transition:all .3s;display:flex;gap:14px;align-items:center"
              onclick="openModal(${m.id})"
              onmouseenter="this.style.borderColor='rgba(28,95,184,0.4)';this.style.transform='translateY(-3px)'"
              onmouseleave="this.style.borderColor='var(--border)';this.style.transform=''">
            <div style="width:44px;height:44px;border-radius:12px;background:${s.bg};color:${s.color};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${getCategoryIcon(m.category)}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.title}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:2px">${m.date||m.year} · ${m.century}-asr</div>
            </div>
            <div style="font-size:13px;color:var(--text3);white-space:nowrap">👁 ${(m.views||0).toLocaleString()}</div>
          </div>`;
        }).join("");
      }
      setTimeout(initScrollReveal, 80);
    } catch (e) { console.error("Stats error:", e); }
  }

  // ─── Tanlangan yodgorliklar (bosh sahifa) ───────────────────
  async function renderFeaturedHome() {
    const el = document.getElementById("featuredGrid");
    if (!el) return;
    try {
      let all = await dbGetAll();
      const featured = all.filter(m => m.featured);
      const items = featured.length ? featured.slice(0, 3) :
        [...all].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0, 3);
      if (!items.length) { el.innerHTML = ""; return; }
      el.innerHTML = items.map(m => {
        const s = getScriptInfo(m.script);
        return `<div class="featured-card sr" onclick="openModal(${m.id})">
          <div class="featured-card-top">
            <div class="featured-card-icon" style="color:${s.color}">${getCategoryIcon(m.category)}</div>
            <span class="featured-star">★</span>
          </div>
          <div class="featured-card-title">${m.title}</div>
          <div class="featured-card-meta">${m.date||m.year} · ${m.century}-asr · ${s.name}</div>
          <div class="featured-card-desc">${m.description}</div>
          <div class="featured-card-footer">
            <div class="featured-views">👁 ${(m.views||0).toLocaleString()}</div>
            <div style="color:var(--blue);font-size:12px;font-weight:600">Ko'rish →</div>
          </div>
        </div>`;
      }).join("");
      setTimeout(initScrollReveal, 80);
    } catch(e) { el.innerHTML = ""; }
  }

  // ─── Scroll Reveal (IntersectionObserver) ──────────────────
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".sr:not(.in)").forEach(el => obs.observe(el));
  }

  // ─── Theme Toggle ──────────────────────────────────────────
  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('turkiy_theme', next);
  }
  window.toggleTheme = toggleTheme;

  // ─── Konkordans / KWIC ─────────────────────────────────────
  async function searchKwic() {
    const q = (document.getElementById("kwicInput")?.value || "").trim();
    const statsEl = document.getElementById("kwicStats");
    const resEl = document.getElementById("kwicResults");
    if (!q || q.length < 2) { if (statsEl) statsEl.textContent = "Kamida 2 ta harf kiriting"; return; }
    if (resEl) resEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">Qidirilmoqda…</div>';
    try {
      let data;
      if (DB) {
        const r = await fetch(`/api/concordance/?q=${encodeURIComponent(q)}`);
        data = await r.json();
      } else {
        // localStorage mode: search locally
        const all = await dbGetAll();
        const results = [];
        const CTX = 80;
        all.forEach(m => {
          [['Tavsif', m.description || ''], ['Transliteratsiya', m.transliteration || ''], ['Tarjima', m.translation || '']].forEach(([label, text]) => {
            let idx = 0, tl = text.toLowerCase(), ql = q.toLowerCase();
            while (results.length < 200) {
              const pos = tl.indexOf(ql, idx);
              if (pos === -1) break;
              const s = Math.max(0, pos - CTX), e = Math.min(text.length, pos + q.length + CTX);
              results.push({ monumentId: m.id, monumentTitle: m.title, script: m.script, field: label,
                left: (s > 0 ? '…' : '') + text.slice(s, pos),
                match: text.slice(pos, pos + q.length),
                right: text.slice(pos + q.length, e) + (e < text.length ? '…' : '') });
              idx = pos + 1;
            }
          });
        });
        data = { results, total: results.length, query: q };
      }
      if (statsEl) statsEl.textContent = data.total
        ? `"${data.query}" uchun ${data.total} ta natija topildi`
        : `"${data.query}" uchun natija topilmadi`;
      if (!resEl) return;
      if (!data.results.length) { resEl.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text3);font-size:32px">🔍<br><span style="font-size:16px">Natija yo\'q</span></div>'; return; }
      resEl.innerHTML = `<div style="overflow-x:auto"><table class="kwic-table">
        <thead><tr><th>Manba</th><th>Maydon</th><th style="text-align:right">Chap kontekst</th><th>So'z</th><th>O'ng kontekst</th></tr></thead>
        <tbody>${data.results.map(r => `<tr>
          <td class="kwic-src" onclick="openModal(${r.monumentId})">${r.monumentTitle}</td>
          <td><span class="kwic-field">${r.field}</span></td>
          <td class="kwic-left">${escHtml(r.left)}</td>
          <td class="kwic-match">${escHtml(r.match)}</td>
          <td class="kwic-right">${escHtml(r.right)}</td>
        </tr>`).join('')}</tbody>
      </table></div>`;
    } catch(e) { if (resEl) resEl.innerHTML = '<div style="color:var(--red);padding:20px">Xatolik: ' + e.message + '</div>'; }
  }
  window.searchKwic = searchKwic;

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ─── Matn O'qish (Reader) ───────────────────────────────────
  async function openReader(id) {
    try {
      const m = await dbGetById(id);
      if (!m) return;
      const s = getScriptInfo(m.script);
      document.getElementById("readerTitle").innerHTML = `${m.title} <span class="g-text">Matni</span>`;
      document.getElementById("readerSubtitle").textContent = `${m.year} · ${s.name} · ${m.location}`;
      document.getElementById("readerBreadcrumb").textContent = m.title;
      const meta = [
        { label: "Yil", val: m.date || m.year },
        { label: "Yozuv", val: s.name },
        { label: "Joylashuv", val: m.location },
        { label: "So'zlar", val: (m.wordCount || 0).toLocaleString() },
        { label: "Satrlar", val: (m.lineCount || 0).toLocaleString() },
      ];
      const hasText = m.fullText || m.transliteration || m.translation;
      document.getElementById("readerContent").innerHTML = `
        <div class="reader-meta-bar">${meta.map(x => `<div class="reader-meta-item"><strong>${x.val}</strong>${x.label}</div>`).join('')}</div>
        ${hasText ? `<div class="reader-grid">
          <div class="reader-col">
            <div class="reader-col-title">Asl matn</div>
            <div class="reader-col-text original">${m.fullText || '<span style="opacity:.4">Matn mavjud emas</span>'}</div>
          </div>
          <div class="reader-col">
            <div class="reader-col-title">Transliteratsiya</div>
            <div class="reader-col-text">${m.transliteration || '<span style="opacity:.4">Mavjud emas</span>'}</div>
          </div>
          <div class="reader-col">
            <div class="reader-col-title">O'zbek tarjimasi</div>
            <div class="reader-col-text">${m.translation || '<span style="opacity:.4">Mavjud emas</span>'}</div>
          </div>
        </div>` : `<div style="text-align:center;padding:80px;color:var(--text3)">
          <div style="font-size:48px;margin-bottom:16px">📜</div>
          <div style="font-size:16px">Bu yodgorlik uchun to'liq matn hali qo'shilmagan</div>
        </div>`}
        <div style="margin-top:24px;display:flex;gap:12px">
          <button class="kwic-btn" onclick="navigateTo('yodgorliklar')">← Orqaga</button>
          <a class="export-btn" href="/api/export/?format=json&id=${m.id}" style="padding:12px 20px">JSON</a>
        </div>`;
      navigateTo('reader');
    } catch(e) { console.error(e); }
  }
  window.openReader = openReader;

  // ─── Xarita (Leaflet) ──────────────────────────────────────
  const MONUMENT_COORDS = {
    "Tonyuquq bitigi":        [47.73, 107.22],
    "Kültigin bitigi":        [47.55, 101.48],
    "Bilge Xoqon bitigi":     [47.54, 101.45],
    "Bugut bitigi":           [47.32, 100.83],
    "Shine-Usu bitigi":       [48.02,  96.53],
    "Yenisey bitiklari":      [53.72,  91.42],
    "Talas bitiklari":        [42.52,  72.23],
    "Irq Bitig":              [40.14,  94.66],
    "Xuastuanift":            [42.93,  89.19],
    "Altun Yoruq":            [42.94,  89.22],
    "Mo'yinchur bitigi":      [47.52, 101.03],
    "Turfon qo'lyozmalari":   [42.94,  89.19],
    "Suji bitigi":            [47.50, 101.00],
    "Qutadg'u Bilig":         [39.47,  75.98],
    "Devonu Lug'atit Turk":   [33.32,  44.42],
  };
  let mapInstance = null;

  async function initXarita() {
    if (!window.L) { console.warn("Leaflet yuklanmagan"); return; }
    const el = document.getElementById("mapContainer");
    if (!el) return;
    if (mapInstance) { mapInstance.invalidateSize(); return; }

    mapInstance = L.map('mapContainer', { zoomControl: true, scrollWheelZoom: false })
      .setView([45, 90], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 14,
    }).addTo(mapInstance);

    const all = await dbGetAll();
    const listEl = document.getElementById("mapList");
    const listItems = [];

    all.forEach(m => {
      const coords = m.coords || MONUMENT_COORDS[m.title];
      if (!coords) return;
      const s = getScriptInfo(m.script);
      const icon = L.divIcon({
        className: '',
        html: `<div class="map-marker-pulse" style="background:${s.color};color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:15px;border:3px solid #fff;box-shadow:0 3px 12px rgba(0,0,0,.4);cursor:pointer;transition:transform .2s">${getCategoryIcon(m.category)}</div>`,
        iconSize: [36, 36], iconAnchor: [18, 18],
      });
      const marker = L.marker(coords, { icon }).addTo(mapInstance);
      const thumbImg = m.image
        ? `<img src="${m.image}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:8px" onerror="this.style.display='none'">`
        : '';
      marker.bindPopup(`<div style="min-width:200px;max-width:220px;font-family:sans-serif">
        ${thumbImg}
        <div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#13233c">${m.title}</div>
        <div style="font-size:11px;color:#666;margin-bottom:4px">${m.date||''} · ${s.name}</div>
        <div style="font-size:11px;color:#888;margin-bottom:8px">📍 ${(m.location||'').split(',')[0]}</div>
        <button onclick="window.openModal(${m.id})" style="width:100%;background:#1c5fb8;color:#fff;border:none;border-radius:7px;padding:6px 0;font-size:12px;font-weight:600;cursor:pointer">Ko'rish →</button>
      </div>`, { maxWidth: 240 });
      listItems.push(`<div class="map-card sr" onclick="window.mapInstance&&window.mapInstance.setView([${coords[0]},${coords[1]}],7);window.mapInstance&&window.mapInstance.eachLayer(l=>{if(l._latlng&&Math.abs(l._latlng.lat-${coords[0]})<0.01)l.openPopup()});document.getElementById('mapContainer').scrollIntoView({behavior:'smooth'})">
        <div class="map-card-icon" style="color:${s.color}">${getCategoryIcon(m.category)}</div>
        <div>
          <div class="map-card-title">${m.title}</div>
          <div class="map-card-meta">${m.date||''} · ${(m.location||'').split(',')[0]}</div>
        </div>
      </div>`);
    });

    if (listEl) listEl.innerHTML = listItems.join('');
    setTimeout(initScrollReveal, 80);
    setTimeout(() => mapInstance.invalidateSize(), 300);
    window.mapInstance = mapInstance;
  }
  window.mapInstance = null;

  // ─── Taqqoslash ────────────────────────────────────────────
  async function initTaqqoslash() {
    const all = await dbGetAll();
    ['compareLeft', 'compareRight'].forEach(id => {
      const sel = document.getElementById(id);
      if (!sel) return;
      const curr = sel.value;
      sel.innerHTML = '<option value="">— Tanlang —</option>' +
        all.map(m => `<option value="${m.id}" ${m.id==curr?'selected':''}>${m.title} (${m.date||m.year})</option>`).join('');
    });
  }

  async function renderCompare() {
    const lid = document.getElementById("compareLeft")?.value;
    const rid = document.getElementById("compareRight")?.value;
    const el = document.getElementById("compareResult");
    if (!el) return;
    if (!lid || !rid) { el.innerHTML = ''; return; }
    if (lid === rid) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">Ikkita turli yodgorlik tanlang</div>'; return; }
    const [L2, R] = await Promise.all([dbGetById(Number(lid)), dbGetById(Number(rid))]);
    if (!L2 || !R) return;
    const sL = getScriptInfo(L2.script), sR = getScriptInfo(R.script);
    const rows = [
      ['Sarlavha', L2.title, R.title],
      ['Yil', L2.date||L2.year, R.date||R.year],
      ['Asr', `${L2.century}-asr`, `${R.century}-asr`],
      ['Joylashuv', (L2.location||'').split(',')[0], (R.location||'').split(',')[0]],
      ['Yozuv', sL.name, sR.name],
      ['Toifa', getCatName(L2.category), getCatName(R.category)],
      ['Til', L2.language, R.language],
      ["So'zlar", (L2.wordCount||0).toLocaleString(), (R.wordCount||0).toLocaleString()],
      ['Satrlar', (L2.lineCount||0).toLocaleString(), (R.lineCount||0).toLocaleString()],
      ["Ko'rishlar", (L2.views||0).toLocaleString(), (R.views||0).toLocaleString()],
      ['Tadqiqotchilar', (L2.researchers||[]).join(', '), (R.researchers||[]).join(', ')],
    ];
    el.innerHTML = `<div style="overflow-x:auto"><table class="compare-table">
      <thead><tr>
        <th>Ko'rsatkich</th>
        <th style="color:${sL.color}">${L2.title}</th>
        <th style="color:${sR.color}">${R.title}</th>
      </tr></thead>
      <tbody>${rows.map(([label, lv, rv]) => `<tr>
        <td>${label}</td>
        <td>${lv||'—'}</td>
        <td>${rv||'—'}</td>
      </tr>`).join('')}</tbody>
    </table></div>
    <div style="display:flex;gap:16px;margin-top:20px">
      <button class="kwic-btn" style="flex:1" onclick="openModal(${L2.id})">${L2.title} →</button>
      <button class="kwic-btn" style="flex:1;background:var(--gold)" onclick="openModal(${R.id})">${R.title} →</button>
    </div>`;
  }
  window.renderCompare = renderCompare;

  function getCatName(cat) {
    const CATS = {bitiglar:"Tosh bitiklar",qollanmalar:"Qo'llanmalar",diniy:"Diniy matnlar",adabiy:"Adabiy asarlar",boshqa:"Boshqa"};
    return CATS[cat] || cat;
  }

  // ─── Bibliografiya ─────────────────────────────────────────
  async function renderBibliografiya() {
    const el = document.getElementById("biblioContent");
    if (!el) return;
    const all = await dbGetAll();
    const researchers = {};
    all.forEach(m => {
      (m.researchers || []).forEach(r => {
        if (!researchers[r]) researchers[r] = { works: new Set(), monuments: [] };
        (m.bibliography || []).forEach(b => researchers[r].works.add(b));
        researchers[r].monuments.push(m);
      });
    });
    const sorted = Object.entries(researchers).sort((a,b) => b[1].monuments.length - a[1].monuments.length);
    el.innerHTML = sorted.map(([name, data]) => `
      <div class="biblio-researcher sr">
        <div class="biblio-name">${name}</div>
        <div class="biblio-count">${data.monuments.length} ta yodgorlik bo'yicha tadqiqot</div>
        ${data.works.size ? `<div class="biblio-works">${[...data.works].map(w => `<div class="biblio-work">${w}</div>`).join('')}</div>` : ''}
        <div class="biblio-monuments">${data.monuments.map(m => `<span class="biblio-monument-tag" onclick="openModal(${m.id})">${m.title}</span>`).join('')}</div>
      </div>`).join('');
    setTimeout(initScrollReveal, 80);
  }

  // ─── So'zlik / Glosariy ────────────────────────────────────
  const GLOSSARY = [
    { word:"tengri",    script:"𐱅𐰤𐰼𐰃",  pos:"ot",    trans:"Osmon; Xudo; ilohiy kuch",       ex:"tengri yarlıqadı — osmon buyurdi" },
    { word:"türk",      script:"𐱃𐰇𐰼𐰚",  pos:"ot",    trans:"Türk (xalq nomi)",               ex:"türk bodun — türk xalqi" },
    { word:"xagan",     script:"𐴐𐴁𐴚",   pos:"ot",    trans:"Xoqon, oliy hukmdor",            ex:"türk xagani — türk xoqoni" },
    { word:"bitig",     script:"𐰉𐰃𐱅𐰏",  pos:"ot",    trans:"Yozuv, bitik, yodgorlik",        ex:"taş bitig — tosh yozuv" },
    { word:"bodun",     script:"𐰉𐰆𐰑𐰣",  pos:"ot",    trans:"Xalq, el",                      ex:"türk bodun — türk xalqi" },
    { word:"yir",       script:"𐰘𐰼",    pos:"ot",    trans:"Yer, makon; mamlakat",           ex:"yir sub — yer-suv" },
    { word:"yer",       script:"𐰘𐰼",    pos:"ot",    trans:"Yer, makon",                     ex:"yer sub — yer-suv (Vatan)" },
    { word:"sub",       script:"𐰽𐰆𐰉",   pos:"ot",    trans:"Suv, daryo",                     ex:"yir sub — yer va suv" },
    { word:"beg",       script:"𐰉𐰏",    pos:"ot",    trans:"Bek, zodagon, boshliq",          ex:"bodun begi — xalq begi" },
    { word:"kün",       script:"𐰚𐰤",    pos:"ot",    trans:"Kun; quyosh",                    ex:"kün toġsı — quyosh chiqishi (sharq)" },
    { word:"ay",        script:"𐰀𐰖",    pos:"ot",    trans:"Oy (yoritgich); oy (vaqt)",      ex:"ay yultuz — oy va yulduzlar" },
    { word:"ötükän",    script:"𐰇𐱃𐰰𐰣",  pos:"ot",    trans:"Muqaddas o'rmon, poytaxt mintaqa", ex:"ötükän yış — Ötükän tog'i" },
    { word:"bilge",     script:"𐰉𐰃𐰠𐰏𐰀", pos:"sifat", trans:"Dono, aqlli, bilimdon",          ex:"bilge xagan — dono xoqon" },
    { word:"alp",       script:"𐰞𐰯",    pos:"sifat", trans:"Bahodir, jasur, qahramonlarcha",  ex:"alp ärän — bahodir yigitlar" },
    { word:"qutluġ",    script:"𐰴𐱃𐰞𐰍",  pos:"sifat", trans:"Baxtli, xayrli",                 ex:"qutluġ bodun — baxtli xalq" },
    { word:"ärän",      script:"𐰀𐰼𐰤",   pos:"ot",    trans:"Erlar, yigitlar, jangchilar",    ex:"alp ärän — jasur jangchilar" },
    { word:"yarlıqa",   script:"𐰖𐰺𐰞𐰴𐰀", pos:"fe'l",  trans:"Rahm qilmoq, ne'mat bermoq",    ex:"tengri yarlıqadı — tangri rahm etdi" },
    { word:"öltür",     script:"𐰇𐰠𐱃𐰺",  pos:"fe'l",  trans:"O'ldirmoq",                     ex:"yagı öltürtim — dushmanlarni o'ldirdim" },
    { word:"yorıt",     script:"𐰖𐰺𐰃𐱃",  pos:"fe'l",  trans:"Yuritmaq, boshqarmoq",           ex:"bodunuġ yorıttım — xalqni boshqardim" },
    { word:"kälti",     script:"𐰚𐰠𐱃𐰃",  pos:"fe'l",  trans:"Keldi",                          ex:"süŋüşgäli kälti — urushga keldi" },
    { word:"barıq",     script:"𐰋𐰺𐰴",   pos:"fe'l",  trans:"Bordi, ketdi",                   ex:"yagı barıq — dushman ketdi" },
    { word:"yulduZ",    script:"𐰖𐰞𐱃𐰔",  pos:"ot",    trans:"Yulduz",                         ex:"ay yultuz — oy va yulduzlar" },
    { word:"qara",      script:"𐰴𐰺𐰀",   pos:"sifat", trans:"Qora; oddiy, kichik (xalq)",     ex:"qara bodun — oddiy xalq" },
    { word:"ög",        script:"𐰇𐰏",    pos:"ot",    trans:"Ona",                            ex:"ögi qatun — ona xotun" },
    { word:"oġlı",      script:"𐰆𐰍𐰞",   pos:"ot",    trans:"O'g'li, o'g'lon",               ex:"xagan oġlı — xoqon o'g'li" },
  ];

  let glossaryFilter = 'barchasi';

  function renderSozlik() {
    const filterEl = document.getElementById("sozlikFilters");
    const gridEl = document.getElementById("sozlikGrid");
    if (!filterEl || !gridEl) return;
    const posList = ['barchasi', 'ot', 'sifat', "fe'l"];
    filterEl.innerHTML = posList.map(p => `<button class="sozlik-filter-btn${p===glossaryFilter?' active':''}" onclick="setGlossaryFilter('${p}')">${p.charAt(0).toUpperCase()+p.slice(1)}</button>`).join('');
    renderGlossaryCards(GLOSSARY);
  }

  function setGlossaryFilter(pos) {
    glossaryFilter = pos;
    renderSozlik();
  }
  window.setGlossaryFilter = setGlossaryFilter;

  function filterGlossary(q) {
    const filtered = GLOSSARY.filter(w =>
      w.word.includes(q.toLowerCase()) ||
      w.trans.toLowerCase().includes(q.toLowerCase()) ||
      w.ex.toLowerCase().includes(q.toLowerCase())
    );
    renderGlossaryCards(filtered);
  }
  window.filterGlossary = filterGlossary;

  function renderGlossaryCards(words) {
    const gridEl = document.getElementById("sozlikGrid");
    if (!gridEl) return;
    const filtered = glossaryFilter === 'barchasi' ? words : words.filter(w => w.pos === glossaryFilter);
    if (!filtered.length) { gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text3)">Natija topilmadi</div>'; return; }
    gridEl.className = 'sozlik-grid';
    gridEl.innerHTML = filtered.map(w => `
      <div class="sozlik-card sr">
        <div class="sozlik-word">${w.word}</div>
        <div class="sozlik-script">${w.script}</div>
        <span class="sozlik-pos">${w.pos}</span>
        <div class="sozlik-trans">${w.trans}</div>
        ${w.ex ? `<div class="sozlik-example">${w.ex}</div>` : ''}
      </div>`).join('');
    setTimeout(initScrollReveal, 60);
  }

  // ─── Architecture Checklist ────────────────────────────────
  const ARCH_KEY = "turkiy_arch_checks";

  function initArchChecks() {
    const saved = JSON.parse(localStorage.getItem(ARCH_KEY) || "{}");
    const cards = document.querySelectorAll("#spa-arxitektura [data-arch-id]");
    cards.forEach(card => {
      const id = card.dataset.archId;
      const cb = card.querySelector(".arch-card-check");
      if (!cb) return;
      if (saved[id]) { card.classList.add("done"); }

      const toggle = () => {
        const data = JSON.parse(localStorage.getItem(ARCH_KEY) || "{}");
        if (card.classList.contains("done")) {
          delete data[id]; card.classList.remove("done");
        } else {
          data[id] = true; card.classList.add("done");
        }
        localStorage.setItem(ARCH_KEY, JSON.stringify(data));
        updateArchProgress();
      };

      cb.addEventListener("click", toggle);
      cb.style.cursor = "pointer";
    });
    updateArchProgress();
    setTimeout(initScrollReveal, 60);
  }

  function updateArchProgress() {
    const cards = document.querySelectorAll("#spa-arxitektura [data-arch-id]");
    const total = cards.length;
    if (!total) return;
    const done = document.querySelectorAll("#spa-arxitektura [data-arch-id].done").length;
    const pct = Math.round(done / total * 100);
    const pctEl = document.getElementById("arch-progress-pct");
    const barEl = document.getElementById("arch-progress-bar");
    if (pctEl) pctEl.textContent = pct + "%";
    if (barEl) barEl.style.width = pct + "%";
  }

  // ─── Toast ─────────────────────────────────────────────────
  function showToast(msg, type = "info", duration = 3000) {
    const c = document.getElementById("toastContainer");
    if (!c) return;
    const icons = {success:"✅",error:"❌",info:"ℹ️"};
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type]}</span> ${msg}`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity="0"; t.style.transform="translateX(30px)"; t.style.transition="all .3s"; setTimeout(()=>t.remove(),300); }, duration);
  }
  window.showToast = showToast;

  // ─── File upload zones (drag & drop) ─────────────────────
  function initFileUploadZones() {
    setupDropZone('imageDropZone', 'imageFileInput', 'imageFileInfo',
                  20 * 1024 * 1024, ['jpg','jpeg','png','webp','gif','tiff','bmp']);
    setupDropZone('docDropZone',   'docFileInput',   'docFileInfo',
                  100 * 1024 * 1024, ['pdf','doc','docx','odt','txt','rtf','xls','xlsx','ods','ppt','pptx']);
  }

  function setupDropZone(zoneId, inputId, infoId, maxBytes, allowedExts) {
    const zone  = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    const info  = document.getElementById(infoId);
    if (!zone || !input) return;

    function showFile(file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(ext)) {
        showToast(`❌ Bu format qo'llab-quvvatlanmaydi: .${ext}`, 'error');
        input.value = '';
        info.style.display = 'none';
        return;
      }
      if (file.size > maxBytes) {
        const mb = (maxBytes / 1024 / 1024).toFixed(0);
        showToast(`❌ Fayl hajmi ${mb} MB dan oshmasligi kerak`, 'error');
        input.value = '';
        info.style.display = 'none';
        return;
      }
      const sizeTxt = file.size > 1024*1024
        ? (file.size / 1024 / 1024).toFixed(1) + ' MB'
        : (file.size / 1024).toFixed(0) + ' KB';
      info.innerHTML = `<span class="file-name">✅ ${file.name}</span>
        <span style="color:var(--text3);flex-shrink:0">${sizeTxt}</span>
        <button type="button" class="file-remove-btn" title="O'chirish">✕</button>`;
      info.style.display = 'flex';
      info.querySelector('.file-remove-btn').onclick = () => {
        input.value = '';
        info.style.display = 'none';
      };
    }

    input.addEventListener('change', () => { if (input.files[0]) showFile(input.files[0]); });

    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      showFile(file);
    });
  }

  // ─── Submission form ───────────────────────────────────────
  window.handleSubmitForm = async function(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = document.getElementById('submitBtn');
    const errEl = document.getElementById('submitError');
    errEl.style.display = 'none';
    btn.disabled = true;
    document.getElementById('submitBtnText').textContent = '⏳ Yuborilmoqda...';

    // FormData — fayllar bilan ishlaydi (multipart/form-data)
    const fd = new FormData(form);

    try {
      const res = await fetch('/api/submit/', {
        method: 'POST',
        // Content-Type ni o'rnatmaymiz — brauzer boundary bilan o'zi qo'yadi
        body: fd
      });
      const json = await res.json();
      if (res.ok && json.success) {
        form.reset();
        document.getElementById('imageFileInfo').style.display = 'none';
        document.getElementById('docFileInfo').style.display = 'none';
        form.style.display = 'none';
        document.getElementById('submitSuccess').style.display = 'flex';
      } else {
        errEl.textContent = json.error || 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
        errEl.style.display = 'block';
        errEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch {
      errEl.textContent = 'Tarmoq xatosi. Internet aloqangizni tekshiring.';
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false;
      document.getElementById('submitBtnText').textContent = '📤 Yuborish';
    }
  };

  // ─── DOMContentLoaded ──────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    // Init CorpusDB only for file:// mode
    if (typeof CorpusDB !== "undefined" && !CorpusAPI?.isDjango) {
      CorpusDB.init();
    }
    initNav();
    initParticles();
    initHeroCounters();
    initFilters();
    initModal();
    initSearch();
    renderFeaturedHome();
    initThemeToggle();
    initLangSwitch();
    initNavProgress();
    // i18n
    if (window.I18N) { I18N.applyAll(); document.addEventListener('langchange', () => I18N.applyAll()); }
    // Keyboard shortcut for KWIC
    document.getElementById("kwicInput")?.addEventListener("keydown", e => { if (e.key === "Enter") searchKwic(); });
    setTimeout(initScrollReveal, 200);
  });

  function initThemeToggle() {
    // Mavzu (kun/tun) yagona tizim orqali boshqariladi:
    //   • bosish        → toggleTheme() (HTML dagi onclick), kalit: 'turkiy_theme'
    //   • boshlang'ich   → <head> dagi inline skript (miltillashsiz)
    //   • ikonka (☀/🌙) → CSS [data-theme="light"] orqali almashadi
    // Shu sababli bu yerda qo'shimcha listener kerak emas (ilgari ikki marta
    // toggle bo'lib, mavzu eski holatiga qaytib qolardi).
  }

  function initLangSwitch() {
    const btns = document.querySelectorAll(".lang-btn");
    if (!btns.length || !window.I18N) return;
    // Apply saved lang on load
    const saved = window.I18N.getLang();
    btns.forEach(b => b.classList.toggle("active", b.dataset.lang === saved));
    document.documentElement.lang = saved;
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        window.I18N.setLang(lang);
        document.documentElement.lang = lang;
        btns.forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
        // Re-render current page content
        const page = state.currentPage;
        state.pagesRendered = {};
        if (page === "yodgorliklar") renderMonuments();
      });
    });
  }

  function initNavProgress() {
    const bar = document.createElement("div");
    bar.className = "nav-progress";
    bar.id = "navProgress";
    document.body.appendChild(bar);
    const orig = window.navigateTo;
    window.navigateTo = function(page) {
      bar.style.width = "0%";
      bar.style.opacity = "1";
      bar.style.transition = "width .4s ease";
      bar.style.width = "70%";
      orig(page);
      setTimeout(() => {
        bar.style.width = "100%";
        setTimeout(() => { bar.style.opacity = "0"; bar.style.width = "0%"; bar.style.transition = ""; }, 300);
      }, 200);
    };
  }

})();
