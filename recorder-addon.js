(() => {
  const DB_NAME = 'vietnam_class3_recordings_db';
  const DB_VERSION = 1;
  const STORE_NAME = 'recordings';
  const state = {
    supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder && window.indexedDB),
    status: 'idle',
    mediaRecorder: null,
    stream: null,
    chunks: [],
    startedAt: 0,
    elapsedMs: 0,
    timerId: null,
    recordings: [],
    urls: new Map(),
    error: ''
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (v = '') => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const fmt = (ms = 0) => {
    const t = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  };
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getAll() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve((req.result || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  }

  async function put(record) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async function del(id) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  function mimeType() {
    const list = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
    return list.find((x) => { try { return MediaRecorder.isTypeSupported(x); } catch { return false; } }) || '';
  }

  function getText() {
    return ($('[data-change="ttsInput"]')?.value || '').trim();
  }

  function getUrl(record) {
    if (state.urls.has(record.id)) return state.urls.get(record.id);
    const url = URL.createObjectURL(record.blob);
    state.urls.set(record.id, url);
    return url;
  }

  function startTimer() {
    stopTimer();
    state.timerId = setInterval(() => {
      if (state.status === 'recording') {
        state.elapsedMs = Date.now() - state.startedAt;
        updateUi();
      }
    }, 300);
  }

  function stopTimer() {
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = null;
  }

  function stopStream() {
    if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
    state.stream = null;
  }

  async function start() {
    if (!state.supported || state.status === 'recording' || state.status === 'paused') return;
    try {
      state.error = '';
      state.chunks = [];
      state.elapsedMs = 0;
      state.startedAt = Date.now();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = mimeType();
      const mr = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream);
      state.stream = stream;
      state.mediaRecorder = mr;
      state.status = 'recording';
      mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) state.chunks.push(e.data); };
      mr.onerror = () => {
        state.status = 'error';
        state.error = '녹음 중 오류가 발생했습니다.';
        stopTimer(); stopStream(); updateUi();
      };
      mr.start();
      startTimer();
      updateUi();
    } catch (e) {
      state.status = 'idle';
      state.error = e && e.name === 'NotAllowedError'
        ? '마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.'
        : '녹음을 시작할 수 없습니다. 브라우저/권한을 확인해주세요.';
      stopTimer(); stopStream(); updateUi();
    }
  }

  function pauseResume() {
    const mr = state.mediaRecorder;
    if (!mr) return;
    if (state.status === 'recording' && mr.state === 'recording') {
      state.elapsedMs = Date.now() - state.startedAt;
      mr.pause();
      state.status = 'paused';
      stopTimer();
    } else if (state.status === 'paused' && mr.state === 'paused') {
      state.startedAt = Date.now() - state.elapsedMs;
      mr.resume();
      state.status = 'recording';
      startTimer();
    }
    updateUi();
  }

  function stopRecorder() {
    return new Promise((resolve) => {
      const mr = state.mediaRecorder;
      if (!mr || mr.state === 'inactive') return resolve();
      mr.onstop = () => resolve();
      mr.stop();
    });
  }

  async function done() {
    const mr = state.mediaRecorder;
    if (!mr || !['recording', 'paused'].includes(state.status)) return;
    if (state.status === 'recording') state.elapsedMs = Date.now() - state.startedAt;
    state.status = 'saving';
    stopTimer();
    updateUi();
    await stopRecorder();
    stopStream();

    const type = mr.mimeType || 'audio/webm';
    const createdAt = new Date().toISOString();
    const text = getText();
    const id = `rec_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const ext = type.includes('mp4') ? 'm4a' : 'webm';
    const title = text ? (text.length > 32 ? `${text.slice(0, 32)}…` : text) : '읽기 연습 녹음';
    const fileName = `vietnam-reading-${createdAt.replace(/[:.]/g, '-').slice(0, 19)}.${ext}`;
    const record = { id, title, text, createdAt, durationMs: state.elapsedMs, mimeType: type, fileName, blob: new Blob(state.chunks, { type }) };

    try {
      await put(record);
      state.recordings = [record, ...state.recordings];
      state.status = 'idle';
      state.mediaRecorder = null;
      state.chunks = [];
      state.elapsedMs = 0;
      state.error = '';
      renderList();
    } catch {
      state.status = 'idle';
      state.error = '브라우저 저장공간 문제로 녹음을 저장하지 못했습니다.';
    }
    updateUi();
  }

  function cancel() {
    const mr = state.mediaRecorder;
    try {
      if (mr && mr.state !== 'inactive') {
        mr.onstop = null;
        mr.stop();
      }
    } catch {}
    stopTimer(); stopStream();
    state.status = 'idle';
    state.mediaRecorder = null;
    state.chunks = [];
    state.startedAt = 0;
    state.elapsedMs = 0;
    state.error = '';
    updateUi();
  }

  async function remove(id) {
    if (!confirm('이 녹음을 삭제할까요?')) return;
    await del(id);
    const url = state.urls.get(id);
    if (url) URL.revokeObjectURL(url);
    state.urls.delete(id);
    state.recordings = state.recordings.filter((r) => r.id !== id);
    renderList();
    updateUi();
  }

  function download(id) {
    const record = state.recordings.find((r) => r.id === id);
    if (!record) return;
    const a = document.createElement('a');
    a.href = getUrl(record);
    a.download = record.fileName || 'vietnam-reading.webm';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function listHtml() {
    if (!state.recordings.length) return '<p class="rec-empty">아직 저장된 녹음이 없어요. 문장을 듣고 바로 따라 말해보세요.</p>';
    return state.recordings.map((r) => `
      <article class="rec-item">
        <div class="rec-item-head">
          <div><strong>${esc(r.title)}</strong><span>${fmtDate(r.createdAt)} · ${fmt(r.durationMs)}</span></div>
          <button type="button" class="rec-delete" data-rec-action="delete" data-id="${esc(r.id)}">삭제</button>
        </div>
        ${r.text ? `<p class="rec-text">${esc(r.text)}</p>` : ''}
        <audio controls preload="metadata" src="${getUrl(r)}"></audio>
        <button type="button" class="rec-download" data-rec-action="download" data-id="${esc(r.id)}">파일로 저장</button>
      </article>
    `).join('');
  }

  function renderList() {
    const list = $('[data-rec-list]');
    const count = $('[data-rec-count]');
    if (list) list.innerHTML = listHtml();
    if (count) count.textContent = state.recordings.length;
  }

  function updateUi() {
    const panel = $('#reading-recorder-addon');
    if (!panel) return;
    const recording = state.status === 'recording';
    const paused = state.status === 'paused';
    const saving = state.status === 'saving';
    panel.classList.toggle('is-recording', recording);
    $('[data-rec-label]', panel).textContent = recording ? '● 녹음 중' : paused ? '⏸ 일시정지' : saving ? '저장 중...' : '🎙 녹음 준비';
    $('[data-rec-time]', panel).textContent = fmt(state.elapsedMs);
    $('[data-rec-action="start"]', panel).disabled = !state.supported || recording || paused || saving;
    const pauseBtn = $('[data-rec-action="pause"]', panel);
    pauseBtn.disabled = !state.supported || (!recording && !paused) || saving;
    pauseBtn.textContent = paused ? '다시 녹음' : '일시정지';
    $('[data-rec-action="done"]', panel).disabled = !state.supported || (!recording && !paused) || saving;
    $('[data-rec-action="cancel"]', panel).disabled = !state.supported || (!recording && !paused) || saving;
    const err = $('[data-rec-error]', panel);
    err.textContent = state.supported ? state.error : '이 브라우저에서는 녹음 저장을 지원하지 않습니다. Android Chrome 또는 최신 Chrome 계열 브라우저를 권장합니다.';
    err.hidden = !err.textContent;
  }

  function mount() {
    const app = $('#app');
    const input = $('[data-change="ttsInput"]', app || document);
    if (!app || !input) return;
    if ($('#reading-recorder-addon')) { updateUi(); renderList(); return; }
    const basePanel = input.closest('.panel') || input.parentElement;
    const panel = document.createElement('section');
    panel.id = 'reading-recorder-addon';
    panel.className = 'panel recorder-addon-panel';
    panel.innerHTML = `
      <div class="rec-title-row">
        <div><h2>내 발음 녹음</h2><p>읽기 문장을 듣고 따라 말한 뒤, 앱 안에 저장해서 다시 들어보세요.</p></div>
        <span class="rec-badge"><span data-rec-count>${state.recordings.length}</span>개</span>
      </div>
      <div class="rec-status-card"><span data-rec-label>🎙 녹음 준비</span><strong data-rec-time>00:00</strong></div>
      <div class="rec-buttons">
        <button type="button" class="primary" data-rec-action="start">녹음</button>
        <button type="button" data-rec-action="pause" disabled>일시정지</button>
        <button type="button" data-rec-action="done" disabled>완료</button>
        <button type="button" class="danger" data-rec-action="cancel" disabled>취소</button>
      </div>
      <p class="rec-warning" data-rec-error hidden></p>
      <div class="rec-list-head"><h3>녹음 목록</h3><span>현재 기기의 브라우저 저장소에 보관</span></div>
      <div class="rec-list" data-rec-list>${listHtml()}</div>
    `;
    panel.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-rec-action]');
      if (!btn) return;
      const action = btn.dataset.recAction;
      const id = btn.dataset.id;
      if (action === 'start') start();
      if (action === 'pause') pauseResume();
      if (action === 'done') done();
      if (action === 'cancel') cancel();
      if (action === 'delete' && id) remove(id);
      if (action === 'download' && id) download(id);
    });
    basePanel.insertAdjacentElement('afterend', panel);
    updateUi();
  }

  async function init() {
    try { state.recordings = await getAll(); } catch { state.supported = false; }
    mount();
    const app = $('#app');
    if (app) new MutationObserver(() => mount()).observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
