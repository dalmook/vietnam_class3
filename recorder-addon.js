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
    previewUrl: '',
    previewPending: false,
    error: ''
  };

  const $ = (s, r = document) => r ? r.querySelector(s) : null;
  const esc = (v = '') => String(v).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  const mmss = (ms = 0) => { const t = Math.max(0, Math.floor(ms / 1000)); return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
  const dateText = (iso) => { const d = new Date(iso); if (Number.isNaN(d.getTime())) return ''; return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

  function injectStyle() {
    if ($('#reading-recorder-style')) return;
    const style = document.createElement('style');
    style.id = 'reading-recorder-style';
    style.textContent = `
      .recorder-addon-panel{display:grid;gap:10px;padding-top:18px!important;padding-bottom:18px!important}.rec-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.rec-top h2{margin:0;font-size:1.25rem;letter-spacing:-.04em}.rec-chip{display:inline-flex;align-items:center;gap:4px;padding:5px 9px;border-radius:999px;background:rgba(93,109,255,.1);color:#5261ee;font-weight:900;font-size:.82rem}.rec-card{display:grid;gap:10px;padding:12px;border-radius:20px;background:linear-gradient(135deg,rgba(93,109,255,.12),rgba(255,255,255,.72));border:1px solid rgba(93,109,255,.14);box-shadow:0 10px 24px rgba(15,23,42,.06)}.rec-main{display:flex;align-items:center;justify-content:space-between;gap:10px}.rec-state{display:flex;align-items:center;gap:8px;font-weight:900}.rec-dot{width:10px;height:10px;border-radius:50%;background:#aab2c8;box-shadow:0 0 0 5px rgba(170,178,200,.12)}.recorder-addon-panel.is-recording .rec-dot{background:#ef4444;box-shadow:0 0 0 5px rgba(239,68,68,.14)}.rec-time{font-size:1.35rem;font-weight:950;font-variant-numeric:tabular-nums;letter-spacing:.02em}.rec-buttons{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.rec-buttons button{min-height:38px;border-radius:14px;font-weight:900;padding:8px 6px}.rec-buttons button:disabled{opacity:.38}.rec-buttons .danger{color:#d93636}.rec-preview{display:grid;gap:6px;padding:9px 10px;border-radius:16px;background:rgba(255,255,255,.76);border:1px solid rgba(93,109,255,.12)}.rec-preview-title{display:flex;align-items:center;justify-content:space-between;color:#5261ee;font-weight:900;font-size:.86rem}.rec-preview audio{width:100%;height:38px}.rec-warning{margin:0;padding:9px 11px;border-radius:14px;background:rgba(255,72,72,.08);color:#c53030;font-weight:800;font-size:.88rem}.rec-list-head{display:flex;align-items:center;justify-content:space-between;margin-top:4px}.rec-list-head h3{margin:0;font-size:1.05rem;letter-spacing:-.03em}.rec-list{display:grid;gap:9px}.rec-empty{margin:0;padding:12px;border-radius:16px;background:rgba(148,163,184,.08);color:#64748b;font-weight:700;font-size:.9rem}.rec-item{display:grid;gap:8px;padding:10px;border-radius:17px;background:rgba(255,255,255,.78);border:1px solid rgba(15,23,42,.07);box-shadow:0 6px 18px rgba(15,23,42,.05)}.rec-item-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.rec-item-title{min-width:0}.rec-item-title strong{display:block;font-size:.95rem;line-height:1.28;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rec-item-title span{display:block;margin-top:2px;color:#73809a;font-size:.78rem;font-weight:800}.rec-text{margin:0;padding:8px 10px;border-radius:12px;background:rgba(93,109,255,.06);font-size:.9rem;line-height:1.42;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.rec-item audio{width:100%;height:40px}.rec-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.rec-download,.rec-delete{min-height:36px;border:0;border-radius:12px;padding:7px 9px;font-weight:900}.rec-delete{color:#d93636}.rec-download{color:#334155}@media(max-width:430px){.rec-buttons button{font-size:.86rem}.rec-card{padding:11px}.rec-top h2{font-size:1.18rem}}
    `;
    document.head.appendChild(style);
  }

  function openDb() { return new Promise((res, rej) => { const req = indexedDB.open(DB, 1); req.onupgradeneeded = () => { const db = req.result; if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' }).createIndex('createdAt', 'createdAt'); }; req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); }); }
  async function all() { const db = await openDb(); return new Promise((res, rej) => { const tx = db.transaction(STORE, 'readonly'); const req = tx.objectStore(STORE).getAll(); req.onsuccess = () => res((req.result || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); req.onerror = () => rej(req.error); tx.oncomplete = () => db.close(); }); }
  async function put(row) { const db = await openDb(); return new Promise((res, rej) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(row); tx.oncomplete = () => { db.close(); res(); }; tx.onerror = () => { db.close(); rej(tx.error); }; }); }
  async function removeDb(id) { const db = await openDb(); return new Promise((res, rej) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete = () => { db.close(); res(); }; tx.onerror = () => { db.close(); rej(tx.error); }; }); }

  const textNow = () => ($('[data-change="ttsInput"]')?.value || '').trim();
  const mime = () => ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(t => { try { return MediaRecorder.isTypeSupported(t); } catch { return false; } }) || '';
  const urlFor = row => state.urls.get(row.id) || (state.urls.set(row.id, URL.createObjectURL(row.blob)), state.urls.get(row.id));
  const stopTimer = () => { if (state.timer) clearInterval(state.timer); state.timer = null; };
  const tick = () => { state.elapsed = Date.now() - state.started; updateUi(); };
  function setMicEnabled(enabled) { if (state.stream) state.stream.getAudioTracks().forEach(t => { t.enabled = enabled; }); }
  function stopStream() { if (state.stream) state.stream.getTracks().forEach(t => t.stop()); state.stream = null; }

  function clearPreview() { if (state.previewUrl) URL.revokeObjectURL(state.previewUrl); state.previewUrl = ''; state.previewPending = false; }
  function makePreview() {
    if (!state.mr || !state.chunks.length || state.status !== 'paused') return;
    clearPreview();
    const type = state.mr.mimeType || 'audio/webm';
    state.previewUrl = URL.createObjectURL(new Blob(state.chunks, { type }));
    updateUi();
  }

  async function start() {
    if (!state.ok || state.status === 'recording' || state.status === 'paused') return;
    try {
      clearPreview(); state.error = ''; state.chunks = []; state.elapsed = 0; state.started = Date.now();
      state.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const type = mime();
      state.mr = type ? new MediaRecorder(state.stream, { mimeType: type }) : new MediaRecorder(state.stream);
      state.mr.ondataavailable = e => {
        if (e.data && e.data.size) state.chunks.push(e.data);
        if (state.status === 'paused' && state.previewPending) setTimeout(makePreview, 0);
      };
      state.mr.onerror = () => { state.error = '녹음 중 오류가 발생했습니다.'; state.status = 'idle'; stopTimer(); stopStream(); updateUi(); };
      state.mr.start(1000); state.status = 'recording'; state.timer = setInterval(tick, 300); updateUi();
    } catch (e) {
      state.error = e && e.name === 'NotAllowedError' ? '마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.' : '녹음을 시작할 수 없습니다. 브라우저/권한을 확인해주세요.';
      state.status = 'idle'; stopTimer(); stopStream(); updateUi();
    }
  }

  function pause() {
    const mr = state.mr; if (!mr) return;
    if (state.status === 'recording' && mr.state === 'recording') {
      state.elapsed = Date.now() - state.started;
      state.status = 'paused';
      state.previewPending = true;
      try { mr.requestData(); } catch {}
      try { mr.pause(); } catch {}
      setMicEnabled(false);
      stopTimer(); updateUi();
      setTimeout(makePreview, 700);
    } else if (state.status === 'paused' && mr.state === 'paused') {
      clearPreview();
      setMicEnabled(true);
      state.started = Date.now() - state.elapsed;
      try { mr.resume(); } catch {}
      state.status = 'recording'; state.timer = setInterval(tick, 300); updateUi();
    }
  }

  function stopMr() { return new Promise(res => { if (!state.mr || state.mr.state === 'inactive') return res(); state.mr.onstop = res; state.mr.stop(); }); }
  async function done() {
    if (!state.mr || !['recording', 'paused'].includes(state.status)) return;
    if (state.status === 'recording') state.elapsed = Date.now() - state.started;
    setMicEnabled(true); state.status = 'saving'; stopTimer(); updateUi(); await stopMr(); stopStream();
    const type = state.mr.mimeType || 'audio/webm';
    const createdAt = new Date().toISOString();
    const text = textNow(); const ext = type.includes('mp4') ? 'm4a' : 'webm';
    const row = { id: `rec_${Date.now()}_${Math.random().toString(16).slice(2)}`, title: text ? (text.length > 30 ? `${text.slice(0, 30)}…` : text) : '읽기 연습 녹음', text, createdAt, durationMs: state.elapsed, mimeType: type, fileName: `vietnam-reading-${createdAt.replace(/[:.]/g, '-').slice(0, 19)}.${ext}`, blob: new Blob(state.chunks, { type }) };
    try { await put(row); state.rows = [row, ...state.rows]; state.error = ''; }
    catch { state.error = '브라우저 저장공간 문제로 녹음을 저장하지 못했습니다.'; }
    clearPreview(); state.status = 'idle'; state.mr = null; state.chunks = []; state.elapsed = 0; renderList(); updateUi();
  }

  function cancel() {
    try { setMicEnabled(true); if (state.mr && state.mr.state !== 'inactive') { state.mr.onstop = null; state.mr.stop(); } } catch {}
    clearPreview(); stopTimer(); stopStream(); state.status = 'idle'; state.mr = null; state.chunks = []; state.elapsed = 0; state.error = ''; updateUi();
  }

  async function delRow(id) { if (!confirm('이 녹음을 삭제할까요?')) return; await removeDb(id); const u = state.urls.get(id); if (u) URL.revokeObjectURL(u); state.urls.delete(id); state.rows = state.rows.filter(r => r.id !== id); renderList(); updateUi(); }
  function download(id) { const row = state.rows.find(r => r.id === id); if (!row) return; const a = document.createElement('a'); a.href = urlFor(row); a.download = row.fileName || 'vietnam-reading.webm'; document.body.appendChild(a); a.click(); a.remove(); }

  function listHtml() {
    if (!state.rows.length) return '<p class="rec-empty">저장된 녹음이 없습니다.</p>';
    return state.rows.map(r => `<article class="rec-item"><div class="rec-item-head"><div class="rec-item-title"><strong>${esc(r.title)}</strong><span>${dateText(r.createdAt)} · ${mmss(r.durationMs)}</span></div></div>${r.text ? `<p class="rec-text">${esc(r.text)}</p>` : ''}<audio controls preload="metadata" src="${urlFor(r)}"></audio><div class="rec-actions"><button type="button" class="rec-download" data-rec-action="download" data-id="${esc(r.id)}">저장</button><button type="button" class="rec-delete" data-rec-action="delete" data-id="${esc(r.id)}">삭제</button></div></article>`).join('');
  }
  function renderList() { const list = $('[data-rec-list]'); const count = $('[data-rec-count]'); if (list) list.innerHTML = listHtml(); if (count) count.textContent = String(state.rows.length); }

  function updateUi() {
    const p = $('#reading-recorder-addon'); if (!p) return;
    const rec = state.status === 'recording', paused = state.status === 'paused', saving = state.status === 'saving'; p.classList.toggle('is-recording', rec);
    $('[data-rec-label]', p).textContent = rec ? '녹음 중' : paused ? '일시정지' : saving ? '저장 중' : '대기';
    $('[data-rec-time]', p).textContent = mmss(state.elapsed);
    $('[data-rec-action="start"]', p).disabled = !state.ok || rec || paused || saving;
    const pb = $('[data-rec-action="pause"]', p); pb.disabled = !state.ok || (!rec && !paused) || saving; pb.textContent = paused ? '재개' : '일시정지';
    $('[data-rec-action="done"]', p).disabled = !state.ok || (!rec && !paused) || saving;
    $('[data-rec-action="cancel"]', p).disabled = !state.ok || (!rec && !paused) || saving;
    const prev = $('[data-rec-preview]', p); const prevAudio = $('[data-rec-preview-audio]', p);
    if (prev && prevAudio) { prev.hidden = !(paused && state.previewUrl); if (state.previewUrl && prevAudio.src !== state.previewUrl) prevAudio.src = state.previewUrl; if (!state.previewUrl) prevAudio.removeAttribute('src'); }
    const err = $('[data-rec-error]', p); err.textContent = state.ok ? state.error : '이 브라우저에서는 녹음 저장을 지원하지 않습니다.'; err.hidden = !err.textContent;
  }

  function mount() {
    const app = $('#app'); const input = $('[data-change="ttsInput"]', app || document); if (!app || !input) return;
    if ($('#reading-recorder-addon')) { updateUi(); return; }
    const base = input.closest('.panel') || input.parentElement; if (!base) return;
    const panel = document.createElement('section'); panel.id = 'reading-recorder-addon'; panel.className = 'panel recorder-addon-panel';
    panel.innerHTML = `<div class="rec-top"><h2>내 발음 녹음</h2><span class="rec-chip"><span data-rec-count>${state.rows.length}</span>개</span></div><div class="rec-card"><div class="rec-main"><div class="rec-state"><span class="rec-dot"></span><span data-rec-label>대기</span></div><strong class="rec-time" data-rec-time>00:00</strong></div><div class="rec-buttons"><button type="button" class="primary" data-rec-action="start">녹음</button><button type="button" data-rec-action="pause" disabled>일시정지</button><button type="button" data-rec-action="done" disabled>완료</button><button type="button" class="danger" data-rec-action="cancel" disabled>취소</button></div><div class="rec-preview" data-rec-preview hidden><div class="rec-preview-title"><span>미리듣기</span><span>현재까지 녹음</span></div><audio controls preload="metadata" data-rec-preview-audio></audio></div><p class="rec-warning" data-rec-error hidden></p></div><div class="rec-list-head"><h3>녹음 목록</h3></div><div class="rec-list" data-rec-list>${listHtml()}</div>`;
    panel.addEventListener('click', e => { const b = e.target.closest('[data-rec-action]'); if (!b) return; const a = b.dataset.recAction, id = b.dataset.id; if (a === 'start') start(); if (a === 'pause') pause(); if (a === 'done') done(); if (a === 'cancel') cancel(); if (a === 'delete' && id) delRow(id); if (a === 'download' && id) download(id); });
    base.insertAdjacentElement('afterend', panel); updateUi();
  }
  async function init() { injectStyle(); try { if (state.ok) state.rows = await all(); } catch { state.ok = false; } mount(); const app = $('#app'); if (app) new MutationObserver(() => mount()).observe(app, { childList: true }); }
  try { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init(); } catch (e) { console.warn('[reading recorder addon]', e); }
})();
