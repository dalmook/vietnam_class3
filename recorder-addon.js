(() => {
  'use strict';

  const DB = 'vietnam_class3_recordings_db';
  const STORE = 'recordings';
  const state = {
    ok: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder && window.indexedDB),
    status: 'idle',
    mr: null,
    stream: null,
    chunks: [],
    started: 0,
    elapsed: 0,
    timer: null,
    rows: [],
    urls: new Map(),
    error: '',
    mounted: false
  };

  const $ = (s, r = document) => r ? r.querySelector(s) : null;
  const esc = (v = '') => String(v).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  const mmss = (ms = 0) => {
    const t = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  };
  const dateText = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  function injectStyle() {
    if ($('#reading-recorder-style')) return;
    const style = document.createElement('style');
    style.id = 'reading-recorder-style';
    style.textContent = `
      .recorder-addon-panel{display:grid;gap:14px}.rec-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.rec-title-row h2{margin-bottom:4px}.rec-title-row p,.rec-list-head span,.rec-empty{color:var(--muted,#6b7280);font-size:.92rem;line-height:1.5}.rec-badge{flex:0 0 auto;padding:7px 10px;border-radius:999px;background:rgba(93,109,255,.12);color:var(--primary,#5d6dff);font-weight:800;font-size:.9rem}.rec-status-card{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-radius:18px;background:rgba(93,109,255,.08);border:1px solid rgba(93,109,255,.12);font-weight:800}.rec-status-card strong{font-size:1.5rem;letter-spacing:.05em;font-variant-numeric:tabular-nums}.recorder-addon-panel.is-recording .rec-status-card{background:rgba(255,72,72,.1);border-color:rgba(255,72,72,.18);color:#d93636}.rec-buttons{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.rec-buttons button,.rec-download,.rec-delete{min-height:42px}.rec-buttons button:disabled{opacity:.45;cursor:not-allowed}.rec-buttons .danger,.rec-delete{color:#d93636}.rec-warning{margin:0;padding:10px 12px;border-radius:14px;background:rgba(255,72,72,.08);color:#c53030;font-weight:700;line-height:1.45}.rec-list-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:4px}.rec-list-head h3{margin:0;font-size:1rem}.rec-list{display:grid;gap:12px}.rec-item{display:grid;gap:10px;padding:12px;border-radius:18px;background:rgba(255,255,255,.72);border:1px solid rgba(15,23,42,.08);box-shadow:0 8px 24px rgba(15,23,42,.06)}.rec-item-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.rec-item-head strong{display:block;line-height:1.35}.rec-item-head span{display:block;margin-top:3px;color:var(--muted,#6b7280);font-size:.82rem}.rec-text{margin:0;padding:10px 12px;border-radius:14px;background:rgba(93,109,255,.07);line-height:1.5;word-break:keep-all}.rec-item audio{width:100%}.rec-download,.rec-delete{border:0;border-radius:12px;padding:8px 10px;font-weight:800}.rec-download{width:100%}@media(max-width:430px){.rec-buttons{grid-template-columns:repeat(2,minmax(0,1fr))}.rec-list-head{display:block}}
    `;
    document.head.appendChild(style);
  }

  function openDb() {
    return new Promise((res, rej) => {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' }).createIndex('createdAt', 'createdAt');
      };
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  }
  async function all() {
    const db = await openDb();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => res((req.result || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      req.onerror = () => rej(req.error);
      tx.oncomplete = () => db.close();
    });
  }
  async function put(row) {
    const db = await openDb();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(row);
      tx.oncomplete = () => { db.close(); res(); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    });
  }
  async function removeDb(id) {
    const db = await openDb();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => { db.close(); res(); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    });
  }

  const textNow = () => ($('[data-change="ttsInput"]')?.value || '').trim();
  const mime = () => ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(t => { try { return MediaRecorder.isTypeSupported(t); } catch { return false; } }) || '';
  const urlFor = row => state.urls.get(row.id) || (state.urls.set(row.id, URL.createObjectURL(row.blob)), state.urls.get(row.id));
  const stopTimer = () => { if (state.timer) clearInterval(state.timer); state.timer = null; };
  const stopStream = () => { if (state.stream) state.stream.getTracks().forEach(t => t.stop()); state.stream = null; };
  const tick = () => { state.elapsed = Date.now() - state.started; updateUi(); };

  async function start() {
    if (!state.ok || state.status === 'recording' || state.status === 'paused') return;
    try {
      state.error = ''; state.chunks = []; state.elapsed = 0; state.started = Date.now();
      state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = mime();
      state.mr = type ? new MediaRecorder(state.stream, { mimeType: type }) : new MediaRecorder(state.stream);
      state.mr.ondataavailable = e => { if (e.data && e.data.size) state.chunks.push(e.data); };
      state.mr.onerror = () => { state.error = '녹음 중 오류가 발생했습니다.'; state.status = 'idle'; stopTimer(); stopStream(); updateUi(); };
      state.mr.start(); state.status = 'recording'; state.timer = setInterval(tick, 300); updateUi();
    } catch (e) {
      state.error = e && e.name === 'NotAllowedError' ? '마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.' : '녹음을 시작할 수 없습니다. 브라우저/권한을 확인해주세요.';
      state.status = 'idle'; stopTimer(); stopStream(); updateUi();
    }
  }

  function pause() {
    const mr = state.mr; if (!mr) return;
    if (state.status === 'recording' && mr.state === 'recording') { state.elapsed = Date.now() - state.started; mr.pause(); state.status = 'paused'; stopTimer(); }
    else if (state.status === 'paused' && mr.state === 'paused') { state.started = Date.now() - state.elapsed; mr.resume(); state.status = 'recording'; state.timer = setInterval(tick, 300); }
    updateUi();
  }

  function stopMr() { return new Promise(res => { if (!state.mr || state.mr.state === 'inactive') return res(); state.mr.onstop = res; state.mr.stop(); }); }

  async function done() {
    if (!state.mr || !['recording', 'paused'].includes(state.status)) return;
    if (state.status === 'recording') state.elapsed = Date.now() - state.started;
    state.status = 'saving'; stopTimer(); updateUi(); await stopMr(); stopStream();
    const type = state.mr.mimeType || 'audio/webm';
    const createdAt = new Date().toISOString();
    const text = textNow(); const ext = type.includes('mp4') ? 'm4a' : 'webm';
    const row = { id: `rec_${Date.now()}_${Math.random().toString(16).slice(2)}`, title: text ? (text.length > 32 ? `${text.slice(0, 32)}…` : text) : '읽기 연습 녹음', text, createdAt, durationMs: state.elapsed, mimeType: type, fileName: `vietnam-reading-${createdAt.replace(/[:.]/g, '-').slice(0, 19)}.${ext}`, blob: new Blob(state.chunks, { type }) };
    try { await put(row); state.rows = [row, ...state.rows]; state.error = ''; }
    catch { state.error = '브라우저 저장공간 문제로 녹음을 저장하지 못했습니다.'; }
    state.status = 'idle'; state.mr = null; state.chunks = []; state.elapsed = 0; renderList(); updateUi();
  }

  function cancel() {
    try { if (state.mr && state.mr.state !== 'inactive') { state.mr.onstop = null; state.mr.stop(); } } catch {}
    stopTimer(); stopStream(); state.status = 'idle'; state.mr = null; state.chunks = []; state.elapsed = 0; state.error = ''; updateUi();
  }

  async function delRow(id) {
    if (!confirm('이 녹음을 삭제할까요?')) return;
    await removeDb(id); const u = state.urls.get(id); if (u) URL.revokeObjectURL(u); state.urls.delete(id); state.rows = state.rows.filter(r => r.id !== id); renderList(); updateUi();
  }

  function download(id) {
    const row = state.rows.find(r => r.id === id); if (!row) return;
    const a = document.createElement('a'); a.href = urlFor(row); a.download = row.fileName || 'vietnam-reading.webm'; document.body.appendChild(a); a.click(); a.remove();
  }

  function listHtml() {
    if (!state.rows.length) return '<p class="rec-empty">아직 저장된 녹음이 없어요. 문장을 듣고 바로 따라 말해보세요.</p>';
    return state.rows.map(r => `<article class="rec-item"><div class="rec-item-head"><div><strong>${esc(r.title)}</strong><span>${dateText(r.createdAt)} · ${mmss(r.durationMs)}</span></div><button type="button" class="rec-delete" data-rec-action="delete" data-id="${esc(r.id)}">삭제</button></div>${r.text ? `<p class="rec-text">${esc(r.text)}</p>` : ''}<audio controls preload="metadata" src="${urlFor(r)}"></audio><button type="button" class="rec-download" data-rec-action="download" data-id="${esc(r.id)}">파일로 저장</button></article>`).join('');
  }
  function renderList() { const list = $('[data-rec-list]'); const count = $('[data-rec-count]'); if (list) list.innerHTML = listHtml(); if (count) count.textContent = String(state.rows.length); }

  function updateUi() {
    const p = $('#reading-recorder-addon'); if (!p) return;
    const rec = state.status === 'recording', paused = state.status === 'paused', saving = state.status === 'saving'; p.classList.toggle('is-recording', rec);
    $('[data-rec-label]', p).textContent = rec ? '● 녹음 중' : paused ? '⏸ 일시정지' : saving ? '저장 중...' : '🎙 녹음 준비';
    $('[data-rec-time]', p).textContent = mmss(state.elapsed);
    $('[data-rec-action="start"]', p).disabled = !state.ok || rec || paused || saving;
    const pb = $('[data-rec-action="pause"]', p); pb.disabled = !state.ok || (!rec && !paused) || saving; pb.textContent = paused ? '다시 녹음' : '일시정지';
    $('[data-rec-action="done"]', p).disabled = !state.ok || (!rec && !paused) || saving;
    $('[data-rec-action="cancel"]', p).disabled = !state.ok || (!rec && !paused) || saving;
    const err = $('[data-rec-error]', p); err.textContent = state.ok ? state.error : '이 브라우저에서는 녹음 저장을 지원하지 않습니다. Android Chrome 또는 최신 Chrome 계열 브라우저를 권장합니다.'; err.hidden = !err.textContent;
  }

  function mount() {
    const app = $('#app'); const input = $('[data-change="ttsInput"]', app || document); if (!app || !input) return;
    if ($('#reading-recorder-addon')) { updateUi(); return; }
    const base = input.closest('.panel') || input.parentElement; if (!base) return;
    const panel = document.createElement('section'); panel.id = 'reading-recorder-addon'; panel.className = 'panel recorder-addon-panel';
    panel.innerHTML = `<div class="rec-title-row"><div><h2>내 발음 녹음</h2><p>읽기 문장을 듣고 따라 말한 뒤, 앱 안에 저장해서 다시 들어보세요.</p></div><span class="rec-badge"><span data-rec-count>${state.rows.length}</span>개</span></div><div class="rec-status-card"><span data-rec-label>🎙 녹음 준비</span><strong data-rec-time>00:00</strong></div><div class="rec-buttons"><button type="button" class="primary" data-rec-action="start">녹음</button><button type="button" data-rec-action="pause" disabled>일시정지</button><button type="button" data-rec-action="done" disabled>완료</button><button type="button" class="danger" data-rec-action="cancel" disabled>취소</button></div><p class="rec-warning" data-rec-error hidden></p><div class="rec-list-head"><h3>녹음 목록</h3><span>현재 기기의 브라우저 저장소에 보관</span></div><div class="rec-list" data-rec-list>${listHtml()}</div>`;
    panel.addEventListener('click', e => { const b = e.target.closest('[data-rec-action]'); if (!b) return; const a = b.dataset.recAction, id = b.dataset.id; if (a === 'start') start(); if (a === 'pause') pause(); if (a === 'done') done(); if (a === 'cancel') cancel(); if (a === 'delete' && id) delRow(id); if (a === 'download' && id) download(id); });
    base.insertAdjacentElement('afterend', panel); updateUi();
  }

  async function init() { injectStyle(); try { if (state.ok) state.rows = await all(); } catch { state.ok = false; } mount(); const app = $('#app'); if (app) new MutationObserver(() => mount()).observe(app, { childList: true }); }
  try { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init(); } catch (e) { console.warn('[reading recorder addon]', e); }
})();
