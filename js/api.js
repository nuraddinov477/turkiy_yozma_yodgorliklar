// ============================================================
// TURKIY KORPUS — API Client (Django backend + localStorage fallback)
// ============================================================

const CorpusAPI = (function () {
  "use strict";

  // Detect if running under Django (served from http/https)
  const isDjango = window.location.protocol !== 'file:';

  // ─── CSRF helper ────────────────────────────────────────────
  function getCsrf() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [k, v] = c.trim().split('=');
      if (k === name) return decodeURIComponent(v);
    }
    return '';
  }

  function headers(extra = {}) {
    return {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrf(),
      ...extra,
    };
  }

  // ─── Generic fetch wrapper ──────────────────────────────────
  async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
      headers: headers(),
      credentials: 'same-origin',
      ...options,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json();
  }

  // ─── Public API ─────────────────────────────────────────────

  async function getAll(params = {}) {
    if (!isDjango) return { monuments: CorpusDB.getAll(), total: CorpusDB.getAll().length };
    const qs = new URLSearchParams(params).toString();
    return apiFetch('/api/monuments/' + (qs ? '?' + qs : ''));
  }

  async function getById(id) {
    if (!isDjango) return CorpusDB.getById(id);
    return apiFetch(`/api/monuments/${id}/`);
  }

  async function search(query) {
    if (!isDjango) return { monuments: CorpusDB.search(query), total: CorpusDB.search(query).length };
    return apiFetch('/api/monuments/?q=' + encodeURIComponent(query));
  }

  async function filter(filters = {}) {
    if (!isDjango) return { monuments: CorpusDB.filter(filters), total: CorpusDB.filter(filters).length };
    return apiFetch('/api/monuments/?' + new URLSearchParams(filters).toString());
  }

  async function getStats() {
    if (!isDjango) return CorpusDB.getStats();
    return apiFetch('/api/stats/');
  }

  // ─── Admin API (requires Django session) ────────────────────

  async function create(data) {
    if (!isDjango) return CorpusDB.add(data);
    return apiFetch('/panel/api/monuments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async function update(id, data) {
    if (!isDjango) return CorpusDB.update(id, data);
    return apiFetch(`/panel/api/monuments/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async function remove(id) {
    if (!isDjango) return CorpusDB.delete(id);
    return apiFetch(`/panel/api/monuments/${id}/`, {
      method: 'DELETE',
    });
  }

  async function getAdminList(params = {}) {
    if (!isDjango) {
      const all = CorpusDB.getAll();
      return { monuments: all, total: all.length, page: 1, pages: 1 };
    }
    const qs = new URLSearchParams(params).toString();
    return apiFetch('/panel/api/monuments/' + (qs ? '?' + qs : ''));
  }

  async function getAdminStats() {
    if (!isDjango) return CorpusDB.getStats();
    return apiFetch('/panel/api/stats/');
  }

  async function getSettings() {
    if (!isDjango) return null;
    return apiFetch('/panel/api/settings/');
  }

  async function saveSettings(data) {
    if (!isDjango) return { success: true };
    return apiFetch('/panel/api/settings/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async function authStatus() {
    if (!isDjango) return { authenticated: false };
    return apiFetch('/api/auth/status/');
  }

  return {
    isDjango,
    getAll,
    getById,
    search,
    filter,
    getStats,
    create,
    update,
    remove,
    getAdminList,
    getAdminStats,
    getSettings,
    saveSettings,
    authStatus,
  };
})();
