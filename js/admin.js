// ============================================================
// TURKIY KORPUS — Admin Panel Mantiq
// ============================================================

(function () {
  "use strict";

  // ─── Data source ──────────────────────────────────────────
  // CorpusAPI defined in api.js; falls back to CorpusDB for file://
  const isDjango = (typeof CorpusAPI !== "undefined") && CorpusAPI.isDjango;

  // ─── Client-side Auth (fallback for file:// mode) ─────────
  const ADMIN_USERS = [
    { username: "admin", password: "admin123", name: "Administrator", role: "Super Admin" },
    { username: "editor", password: "editor123", name: "Muharrir", role: "Muharrir" }
  ];
  const Auth = {
    key: "turkiy_admin_session",
    login(username, password) {
      const user = ADMIN_USERS.find(u => u.username === username && u.password === password);
      if (user) {
        sessionStorage.setItem(this.key, JSON.stringify({ username: user.username, name: user.name, role: user.role }));
        return true;
      }
      return false;
    },
    logout() { sessionStorage.removeItem(this.key); },
    getUser() { try { return JSON.parse(sessionStorage.getItem(this.key)); } catch { return null; } },
    isLoggedIn() { return !!this.getUser(); }
  };

  // ─── State ─────────────────────────────────────────────────
  const state = {
    currentPage: "dashboard",
    editingId: null,
    tableFilter: "",
    tablePage: 1,
    tablePageSize: 8,
    sortCol: "id",
    sortDir: "asc",
    confirmCallback: null,
    allMonuments: [],
    statsData: null,
  };

  // ─── DOM helpers ───────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const on = (el, ev, cb) => el && el.addEventListener(ev, cb);

  function showToast(msg, type = "info", duration = 3000) {
    const container = $("toastContainer");
    if (!container) return;
    const icons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type]}</span> ${msg}`;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = "0"; t.style.transform = "translateX(30px)"; t.style.transition = "all .3s";
      setTimeout(() => t.remove(), 300);
    }, duration);
  }

  // ─── Login Page (file:// mode only) ────────────────────────
  function initLogin() {
    const form = $("loginForm");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const username = $("loginUser")?.value.trim();
      const password = $("loginPass")?.value;
      const errEl = $("loginError");
      if (Auth.login(username, password)) {
        $("loginPage").style.display = "none";
        $("adminLayout").style.display = "grid";
        initAdmin();
      } else {
        if (errEl) { errEl.textContent = "Noto'g'ri foydalanuvchi nomi yoki parol"; errEl.classList.add("show"); }
        setTimeout(() => errEl?.classList.remove("show"), 3000);
      }
    });
  }

  // ─── Navigation ────────────────────────────────────────────
  function navigate(page) {
    state.currentPage = page;
    document.querySelectorAll(".nav-item").forEach(el =>
      el.classList.toggle("active", el.dataset.page === page)
    );
    document.querySelectorAll(".page").forEach(el =>
      el.classList.toggle("active", el.id === `page-${page}`)
    );
    const titles = { dashboard: "Bosh sahifa", monuments: "Yodgorliklar", settings: "Sozlamalar" };
    const topbarTitle = document.querySelector(".topbar-page-title");
    if (topbarTitle) topbarTitle.textContent = titles[page] || page;

    if (page === "dashboard") renderDashboard();
    if (page === "monuments") renderTable();
    if (page === "settings") loadSettings();
  }

  function initNav() {
    document.querySelectorAll(".nav-item[data-page]").forEach(item => {
      on(item, "click", () => navigate(item.dataset.page));
    });
    on($("logoutBtn"), "click", () => {
      if (isDjango) { window.location.href = "/panel/logout/"; }
      else { Auth.logout(); window.location.reload(); }
    });
    const menuToggle = $("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const sidebarOverlay = $("sidebarOverlay");
    on(menuToggle, "click", () => { sidebar?.classList.toggle("open"); sidebarOverlay?.classList.toggle("open"); });
    on(sidebarOverlay, "click", () => { sidebar?.classList.remove("open"); sidebarOverlay?.classList.remove("open"); });
  }

  // ─── Dashboard ─────────────────────────────────────────────
  async function renderDashboard() {
    try {
      const stats = isDjango
        ? await CorpusAPI.getAdminStats()
        : CorpusDB.getStats();
      state.statsData = stats;

      animVal("kpi-total", stats.total || 0);
      animVal("kpi-words", Math.round((stats.totalWords || 0) / 1000), "K");
      animVal("kpi-scripts", stats.scripts || Object.keys(stats.byScript || {}).length);
      animVal("kpi-views", stats.totalViews || 0);

      renderCenturyChart(stats.byCentury || {});
      renderScriptDonut(stats.byScript || {}, stats.total || 0);
      renderRecentTable(stats.topViewed || []);
    } catch (e) {
      showToast("Dashboard ma'lumotlarini yuklashda xatolik: " + e.message, "error");
    }
  }

  function animVal(id, target, suffix = "") {
    const el = $(id);
    if (!el) return;
    const start = performance.now();
    const dur = 1400;
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease).toLocaleString("uz-UZ") + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderCenturyChart(byCentury) {
    const el = $("centuryChart");
    if (!el) return;
    const entries = Object.entries(byCentury).sort(([a],[b]) => parseInt(a)-parseInt(b));
    if (!entries.length) { el.innerHTML = `<div style="text-align:center;color:var(--text3);padding:40px">Ma'lumot yo'q</div>`; return; }
    const max = Math.max(...entries.map(([,v]) => v), 1);
    const colors = ["#c9a84c","#e8913a","#7ecb9e","#a08bc4","#c4a08b","#e8c46a","#9ecae1"];
    el.innerHTML = entries.map(([c, v], i) => {
      const pct = Math.round(v / max * 100);
      const color = colors[i % colors.length];
      return `
        <div class="bar-item">
          <div class="bar-fill" style="height:${pct}%;background:linear-gradient(180deg,${color},${color}88)" data-val="${v}"></div>
          <div class="bar-label">${c}-asr</div>
        </div>`;
    }).join("");
  }

  function renderScriptDonut(byScript, total) {
    const el = $("scriptDonut");
    if (!el) return;
    const scriptColors = {
      "koktürk":"#c9a84c", "uyg'ur":"#e8913a", "arab":"#7ecb9e",
      "sogd":"#a08bc4", "boshqa":"#c4a08b"
    };
    const scriptNames = {
      "koktürk":"Ko'ktürk", "uyg'ur":"Uyg'ur", "arab":"Arab",
      "sogd":"So'g'd", "boshqa":"Boshqa"
    };
    const r = 45, cx = 60, cy = 60, circ = 2 * Math.PI * r;
    let cum = 0;
    const entries = Object.entries(byScript).filter(([,v]) => v > 0);
    if (!entries.length) { el.innerHTML = `<div style="color:var(--text3);text-align:center;padding:20px">Ma'lumot yo'q</div>`; return; }
    const segments = entries.map(([k, v], i) => {
      const pct = v / (total || 1);
      const dash = pct * circ;
      const gap = circ - dash;
      const offset = circ - cum * circ;
      cum += pct;
      const color = scriptColors[k] || Object.values(scriptColors)[i % 5];
      return `<circle r="${r}" cx="${cx}" cy="${cy}" fill="none"
        stroke="${color}" stroke-width="16"
        stroke-dasharray="${dash} ${gap}"
        stroke-dashoffset="${offset}"
        transform="rotate(-90 ${cx} ${cy})"/>`;
    });
    const legend = entries.map(([k,v], i) => {
      const color = scriptColors[k] || Object.values(scriptColors)[i % 5];
      return `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2)">
        <div style="width:8px;height:8px;border-radius:2px;background:${color};flex-shrink:0"></div>
        <span>${scriptNames[k]||k}: <strong style="color:${color}">${v}</strong></span>
      </div>`;
    }).join("");
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div style="position:relative;width:120px;height:120px;flex-shrink:0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle r="${r}" cx="${cx}" cy="${cy}" fill="none" stroke="var(--bg3)" stroke-width="16"/>
            ${segments.join("")}
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
            <span style="font-size:20px;font-weight:800;font-family:Georgia,serif;color:var(--gold)">${total}</span>
            <span style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:1px">jami</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">${legend}</div>
      </div>`;
  }

  function renderRecentTable(topViewed) {
    const el = $("recentTable");
    if (!el) return;
    if (!topViewed || !topViewed.length) {
      el.innerHTML = `<div style="text-align:center;color:var(--text3);padding:20px">Ma'lumot yo'q</div>`;
      return;
    }
    el.innerHTML = `
      <table>
        <thead><tr><th>#</th><th>Yodgorlik</th><th>Asr</th><th>Ko'rishlar</th></tr></thead>
        <tbody>${topViewed.map((m, i) => `
          <tr style="cursor:pointer" onclick="navigate('monuments')">
            <td style="color:var(--gold);font-weight:700">${i+1}</td>
            <td class="td-title">${m.title}<small>${m.date||m.year||""}</small></td>
            <td><span class="century-pill">${m.century}-asr</span></td>
            <td>👁 ${(m.views||0).toLocaleString()}</td>
          </tr>`).join("")}
        </tbody>
      </table>`;
  }

  // ─── Monuments Table ───────────────────────────────────────
  async function renderTable() {
    const tbody = $("monumentsTbody");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text3)">Yuklanmoqda...</td></tr>`;

    try {
      const params = { page: state.tablePage, per_page: state.tablePageSize };
      if (state.tableFilter) params.q = state.tableFilter;

      let data, total, pages;
      if (isDjango) {
        const res = await CorpusAPI.getAdminList(params);
        data = res.monuments || [];
        total = res.total || 0;
        pages = res.pages || 1;
      } else {
        let all = CorpusDB.getAll();
        if (state.tableFilter) {
          const q = state.tableFilter.toLowerCase();
          all = all.filter(m =>
            (m.title||"").toLowerCase().includes(q) ||
            (m.language||"").toLowerCase().includes(q) ||
            (m.script||"").toLowerCase().includes(q)
          );
        }
        total = all.length;
        pages = Math.ceil(total / state.tablePageSize);
        const start = (state.tablePage - 1) * state.tablePageSize;
        data = all.slice(start, start + state.tablePageSize);
      }
      state.allMonuments = data;

      const scriptColors = {
        "koktürk":"#c9a84c", "uyg'ur":"#e8913a", "arab":"#7ecb9e",
        "sogd":"#a08bc4", "boshqa":"#c4a08b"
      };
      const scriptNames = {
        "koktürk":"Ko'ktürk", "uyg'ur":"Uyg'ur", "arab":"Arab",
        "sogd":"So'g'd", "boshqa":"Boshqa"
      };

      if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><span class="empty-state-icon">🔍</span><h3>Hech narsa topilmadi</h3></div></td></tr>`;
      } else {
        tbody.innerHTML = data.map(m => {
          const color = scriptColors[m.script] || "#888";
          const stars = "★".repeat(m.importance||3) + "☆".repeat(5-(m.importance||3));
          const safeTitle = (m.title||"").replace(/'/g, "\\'");
          return `<tr>
            <td style="color:var(--text3);font-size:12px">#${m.id}</td>
            <td class="td-title">${m.title}<small>${m.subtitle||m.titleOriginal||m.date||""}</small></td>
            <td><span class="script-pill" style="color:${color};border-color:${color}44;background:${color}11">
              ${scriptNames[m.script]||m.script}</span></td>
            <td><span class="century-pill">${m.century}-asr</span></td>
            <td style="font-size:12px">${m.date||m.year||""}</td>
            <td><span class="importance-stars">${stars}</span></td>
            <td>
              <div class="action-btns">
                <button class="btn-icon view" onclick="adminViewMonument(${m.id})" title="Ko'rish">👁</button>
                <button class="btn-icon edit" onclick="openEditForm(${m.id})" title="Tahrirlash">✏️</button>
                <button class="btn-icon delete" onclick="confirmDelete(${m.id},'${safeTitle}')" title="O'chirish">🗑</button>
              </div>
            </td>
          </tr>`;
        }).join("");
      }

      // Pagination
      const paginationEl = $("tablePagination");
      if (paginationEl) {
        paginationEl.innerHTML = `
          <span>Jami: <strong style="color:var(--text)">${total}</strong> ta yodgorlik</span>
          <div class="page-btns">
            <button class="page-btn" ${state.tablePage <= 1 ? "disabled" : ""} onclick="changePage(${state.tablePage-1})">‹</button>
            ${Array.from({length:Math.min(pages,7)}, (_,i) => `
              <button class="page-btn ${state.tablePage===i+1?'active':''}" onclick="changePage(${i+1})">${i+1}</button>`).join("")}
            <button class="page-btn" ${state.tablePage >= pages ? "disabled" : ""} onclick="changePage(${state.tablePage+1})">›</button>
          </div>`;
      }
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:#ff6b6b">Xatolik: ${e.message}</td></tr>`;
    }
  }

  window.changePage = function(p) { state.tablePage = p; renderTable(); };
  window.navigate = navigate;

  function initTableToolbar() {
    const searchEl = $("tableSearch");
    on(searchEl, "input", () => {
      state.tableFilter = searchEl.value;
      state.tablePage = 1;
      renderTable();
    });
  }

  // ─── Monument Form ─────────────────────────────────────────
  function openAddForm() {
    state.editingId = null;
    if ($("formModalTitle")) $("formModalTitle").textContent = "Yangi yodgorlik qo'shish";
    if ($("deleteFromFormBtn")) $("deleteFromFormBtn").style.display = "none";
    resetForm();
    openFormModal();
  }

  async function openEditForm(id) {
    try {
      const m = isDjango ? await CorpusAPI.getById(id) : CorpusDB.getById(id);
      if (!m) return;
      state.editingId = id;
      if ($("formModalTitle")) $("formModalTitle").textContent = "Yodgorlikni tahrirlash";
      if ($("deleteFromFormBtn")) $("deleteFromFormBtn").style.display = "block";
      fillForm(m);
      openFormModal();
    } catch (e) {
      showToast("Xatolik: " + e.message, "error");
    }
  }
  window.openEditForm = openEditForm;

  function fillForm(m) {
    const map = {
      f_title: m.title,
      f_subtitle: m.subtitle || m.titleOriginal || "",
      f_era: m.era || m.date || "",
      f_date: m.date || m.year || "",
      f_century: m.century || "",
      f_year: m.year || "",
      f_script: m.script || "",
      f_language: m.language || "",
      f_location: m.location || "",
      f_category: m.category || "",
      f_wordCount: m.wordCount || 0,
      f_lineCount: m.lineCount || 0,
      f_importance: m.importance || 3,
      f_status: m.status || "Chop etilgan",
      f_description: m.description || "",
      f_significance: m.significance || "",
      f_transcription: m.transcription || m.fullText || "",
      f_transliteration: m.transliteration || "",
      f_translation: m.translation || "",
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = $(id);
      if (el) el.value = val !== undefined ? val : "";
    });
    const resEl = $("f_researchers");
    if (resEl && m.researchers) resEl.value = Array.isArray(m.researchers) ? m.researchers.join(", ") : m.researchers;
    const bibEl = $("f_bibliography");
    if (bibEl && m.bibliography) bibEl.value = Array.isArray(m.bibliography) ? m.bibliography.join("\n") : m.bibliography;
    const tagsEl = $("f_tags");
    if (tagsEl && m.tags) tagsEl.value = Array.isArray(m.tags) ? m.tags.join(", ") : m.tags;
  }

  function resetForm() {
    const formEl = $("monumentForm");
    if (formEl) formEl.reset();
  }

  function openFormModal() {
    $("formModalOverlay")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeFormModal() {
    $("formModalOverlay")?.classList.remove("open");
    document.body.style.overflow = "";
    state.editingId = null;
  }

  async function saveForm() {
    const data = {};

    // Text fields
    const textFields = {
      title: "f_title", script: "f_script", language: "f_language",
      location: "f_location", category: "f_category", status: "f_status",
      description: "f_description", significance: "f_significance",
      transliteration: "f_transliteration", translation: "f_translation",
    };
    Object.entries(textFields).forEach(([key, id]) => {
      const el = $(id);
      if (el) data[key] = el.value.trim();
    });

    // Number fields (Django API uses year/wordCount etc)
    data.year = parseInt($("f_year")?.value || $("f_date")?.value) || 0;
    data.wordCount = parseInt($("f_wordCount")?.value) || 0;
    data.lineCount = parseInt($("f_lineCount")?.value) || 0;
    data.importance = parseInt($("f_importance")?.value) || 3;

    // Full text (transcription)
    data.fullText = $("f_transcription")?.value.trim() || "";

    // Array fields
    const resEl = $("f_researchers");
    data.researchers = resEl ? resEl.value.split(",").map(s => s.trim()).filter(Boolean) : [];
    const bibEl = $("f_bibliography");
    data.bibliography = bibEl ? bibEl.value.split("\n").map(s => s.trim()).filter(Boolean) : [];
    const tagsEl = $("f_tags");
    data.tags = tagsEl ? tagsEl.value.split(",").map(s => s.trim()).filter(Boolean) : [];

    if (!data.title) { showToast("Sarlavha majburiy!", "error"); return; }

    try {
      if (state.editingId) {
        if (isDjango) await CorpusAPI.update(state.editingId, data);
        else CorpusDB.update(state.editingId, data);
        showToast("Yodgorlik yangilandi!", "success");
      } else {
        if (isDjango) await CorpusAPI.create(data);
        else CorpusDB.add(data);
        showToast("Yangi yodgorlik qo'shildi!", "success");
      }
      closeFormModal();
      renderTable();
      renderDashboard();
    } catch (e) {
      showToast("Xatolik: " + e.message, "error");
    }
  }

  // ─── Delete ────────────────────────────────────────────────
  function confirmDelete(id, title) {
    if ($("confirmDesc")) $("confirmDesc").textContent = `"${title}" nomli yodgorlikni o'chirishni tasdiqlaysizmi?`;
    $("confirmOverlay")?.classList.add("open");
    state.confirmCallback = async () => {
      try {
        if (isDjango) await CorpusAPI.remove(id);
        else CorpusDB.delete(id);
        showToast("Yodgorlik o'chirildi", "success");
        closeFormModal();
        renderTable();
        renderDashboard();
      } catch (e) {
        showToast("Xatolik: " + e.message, "error");
      }
    };
  }
  window.confirmDelete = confirmDelete;

  function closeConfirm() {
    $("confirmOverlay")?.classList.remove("open");
    state.confirmCallback = null;
  }

  // ─── View monument ─────────────────────────────────────────
  window.adminViewMonument = function(id) {
    window.open(`/#yodgorliklar`, "_blank");
  };

  // ─── Settings ──────────────────────────────────────────────
  async function loadSettings() {
    if (!isDjango) return;
    try {
      const s = await CorpusAPI.getSettings();
      if (!s) return;
      const f = $("f_siteTitle");
      if (f) f.value = s.siteTitle || "";
      const g = $("f_siteSubtitle");
      if (g) g.value = s.siteSubtitle || "";
      const h = $("f_aboutText");
      if (h) h.value = s.aboutText || "";
      const k = $("f_contactEmail");
      if (k) k.value = s.contactEmail || "";
    } catch (e) {
      console.warn("Settings load:", e);
    }
  }

  function initSettings() {
    on($("saveSettingsBtn"), "click", async () => {
      if (isDjango) {
        try {
          await CorpusAPI.saveSettings({
            siteTitle: $("f_siteTitle")?.value,
            siteSubtitle: $("f_siteSubtitle")?.value,
            aboutText: $("f_aboutText")?.value,
            contactEmail: $("f_contactEmail")?.value,
          });
          showToast("Sozlamalar saqlandi!", "success");
        } catch (e) {
          showToast("Xatolik: " + e.message, "error");
        }
      } else {
        showToast("Sozlamalar saqlandi!", "success");
      }
    });

    on($("resetDataBtn"), "click", () => {
      if ($("confirmDesc")) $("confirmDesc").textContent = "Barcha ma'lumotlar asl holatga qaytariladi!";
      $("confirmOverlay")?.classList.add("open");
      state.confirmCallback = () => {
        if (!isDjango) { CorpusDB.reset(); showToast("Ma'lumotlar tiklandi!", "info"); renderTable(); renderDashboard(); }
        else showToast("Django rejimida ma'lumotlar tiklash uchun manage.py dan foydalaning", "info");
      };
    });
  }

  // ─── Export ────────────────────────────────────────────────
  async function exportData() {
    try {
      const data = isDjango ? (await CorpusAPI.getAdminList({ per_page: 1000 })).monuments : CorpusDB.getAll();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "turkiy-korpus-data.json"; a.click();
      URL.revokeObjectURL(url);
      showToast("Ma'lumotlar eksport qilindi!", "success");
    } catch (e) {
      showToast("Eksport xatoligi: " + e.message, "error");
    }
  }

  // ─── User info ─────────────────────────────────────────────
  async function renderUserInfo() {
    let name, role;
    if (isDjango) {
      try {
        const auth = await CorpusAPI.authStatus();
        name = auth.username || "Admin";
        role = auth.isAdmin ? "Super Admin" : "Muharrir";
      } catch { name = "Admin"; role = ""; }
    } else {
      const user = Auth.getUser();
      name = user?.name || "Admin";
      role = user?.role || "";
    }
    const nameEl = $("sidebarUsername");
    const roleEl = $("sidebarRole");
    const avatarEl = $("sidebarAvatar");
    if (nameEl) nameEl.textContent = name;
    if (roleEl) roleEl.textContent = role;
    if (avatarEl) avatarEl.textContent = (name || "A").charAt(0).toUpperCase();
  }

  // ─── Storage info ──────────────────────────────────────────
  function renderStorageInfo() {
    const badge = $("monumentCount");
    if (badge) badge.textContent = state.allMonuments.length || 15;
    const storageEl = $("storageSize");
    if (storageEl && !isDjango) {
      const stored = localStorage.getItem("turkiy_korpus_monuments") || "";
      const kb = (new Blob([stored]).size / 1024).toFixed(1);
      storageEl.textContent = kb + " KB";
    } else if (storageEl) {
      storageEl.textContent = "Django DB";
    }
  }

  // ─── Init Admin ────────────────────────────────────────────
  function initAdmin() {
    renderUserInfo();
    initNav();
    initTableToolbar();

    on($("closeFormModal"), "click", closeFormModal);
    on($("cancelFormBtn"), "click", closeFormModal);
    on($("saveFormBtn"), "click", saveForm);
    on($("deleteFromFormBtn"), "click", () => {
      if (state.editingId) confirmDelete(state.editingId, "bu yodgorlikni");
    });
    on($("formModalOverlay"), "click", e => {
      if (e.target === $("formModalOverlay")) closeFormModal();
    });
    on($("confirmYes"), "click", () => { if (state.confirmCallback) state.confirmCallback(); closeConfirm(); });
    on($("confirmNo"), "click", closeConfirm);
    on($("confirmOverlay"), "click", e => { if (e.target === $("confirmOverlay")) closeConfirm(); });

    on($("addMonumentBtn"), "click", openAddForm);
    on($("exportBtn"), "click", exportData);
    on($("homeBtn"), "click", () => window.open("/", "_blank"));

    initSettings();
    navigate("dashboard");

    // Sidebar stats
    setTimeout(renderStorageInfo, 1000);
  }

  // ─── Expose ────────────────────────────────────────────────
  window.openAddForm = openAddForm;
  window.openEditForm = openEditForm;

  // ─── Entry point ───────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    const loginPage = $("loginPage");
    const adminLayout = $("adminLayout");

    if (isDjango) {
      // Django handles auth — panel.html is only served to authenticated users
      if (loginPage) loginPage.style.display = "none";
      if (adminLayout) adminLayout.style.display = "grid";
      initAdmin();
    } else {
      // File:// mode — use client-side auth
      if (!adminLayout || !loginPage) { initAdmin(); return; }
      if (Auth.isLoggedIn()) {
        loginPage.style.display = "none";
        adminLayout.style.display = "grid";
        initAdmin();
      } else {
        loginPage.style.display = "flex";
        adminLayout.style.display = "none";
        initLogin();
      }
    }
  });

})();
