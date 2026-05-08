(() => {
  'use strict';

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

  const $ = (sel, root = document) => root ? root.querySelector(sel) : null;
  const esc = (v = '') => String(v).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  const fmt = (ms = 0) => {
    const t = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  };
  const fmtDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
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

  function getMimeType() {
    const list = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
    return list.find((x) => {
      try { return MediaRecorder.isTypeSupported(x); } catch (_) { return false; }
    }) || '';
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

  function stopTimer() {
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = null;
  }

  function startTimer() {
    stopTimer();
    state.timerId = setInterval(() => {
      if (state.status !== 'recording') return;
      state.elapsedMs = Date.now() - state.startedAt;
      updateUi();
    }, 300);
  }

  function stopStream() {
    if (state.stream) state.stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
  }

  async function startRecording() {
    if (!state.supported || state.status === 'recording' || state.status === 'paused') return;
    try {
      state.error = '';
      state.chunks = [];
      state.elapsedMs = 0;
      state.startedAt = Date.now();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = getMimeType();
      const mr = type ? new MediaRecorder(stream, { mimeType: type }) : new MediaRecorder(stream);

      state.stream = stream;
      state.mediaRecorder = mr;
      state.status = 'recording';

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) state.chunks.push(e.data);
      };
      mr.onerror = () => {
        state.status = 'idle';
        state.error = '녹음 중 오류가 발생했습니다.';
        stopTimer();
        stopStream();
        updateUi();
      };

      mr.start();
      startTimer();
      updateUi();
    } catch (e) {
      state.status = 'idle';
      state.error = e && e.name === 'NotAllowedError'
        ? '마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.'
        : '녹음을 시작할 수 없습니다. 브라우저/권한을 확인해주세요.';
      stopTimer();
      stopStream();
      updateUi();
    }
  }

  function pauseResumeRecording() {
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

  async function doneRecording() {
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
    const blob = new Blob(state.chunks, { type });
    const record = { id, title, text, createdAt, durationMs: state.elapsedMs, mimeType: type, fileName, blob };

    try {
      await put(record);
      state.recordings = [record, ...state.recordings];
      state.status = 'idle';
      state.mediaRecorder = null;
      state.chunks = [];
      state.elapsedMs = 0;
      state.error = '';
      renderList();
    } catch (_) {
      state.status = 'idle';
      state.error = '브라우저 저장공간 문제로 녹음을 저장하지 못했습니다.';
    }

    updateUi();
  }

  function cancelRecording() {
    const mr = state.mediaRecorder;
    try {
      if (mr && mr.state !== 'inactive') {
        mr.onstop = null;
        mr.stop();
      }
    } catch (_) {}

    stopTimer();
    stopStream();
    state.status = 'idle';
    state.mediaRecorder = null;
    state.chunks = [];
    state.startedAt = 0;
    state.elapsedMs = 0;
    state.error = '';
    updateUi();
  }

  async function removeRecording(id) {
    if (!window.confirm('이 녹음을 삭제할까요?')) return;
    try {
      await del(id);
      const url = state.urls.get(id);
      if (url) URL.revokeObjectURL(url);
      state.urls.delete(id);
      state.recordings = state.recordings.filter((r) => r.id !== id);
      renderList();
      updateUi();
    } catch (_) {
      state.error = '녹음을 삭제하지 못했습니다.';
      updateUi();
    }
  }

  function downloadRecording(id) {
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
    if (!state.recordings.length) {
      return '<p class="rec-empty">아직 저장된 녹음이 없어요. 문장을 듣고 바로 따라 말해보세요.</p>';
    }

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
    if (count) count.textContent = String(state.recordings.length);
  }

  function updateUi() {
    const panel = $('#reading-recorder-addon');
    if (!panel) return;

    const recording = state.status === 'recording';
    const paused = state.status === 'paused';
    const saving = state.status === 'saving';

    panel.classList.toggle('is-recording', recording);

    const label = $('[data-rec-label]', panel);
    const time = $('[data-rec-time]', panel);
    const startBtn = $('[data-rec-action="start"]', panel);
    const pauseBtn = $('[data-rec-action="pause"]', panel);
    const doneBtn = $('[data-rec-action="done"]', panel);
    const cancelBtn = $('[data-rec-action="cancel"]', panel);
    const err = $('[data-rec-error]', panel);

    if (label) label.textContent = recording ? '● 녹음 중' : paused ? '⏸ 일시정지' : saving ? '저장 중...' : '🎙 녹음 준비';
    if (time) time.textContent = fmt(state.elapsedMs);
    if (startBtn) startBtn.disabled = !state.supported || recording || paused || saving;
    if (pauseBtn) {
      pauseBtn.disabled = !state.supported || (!recording && !paused) || saving;
      pauseBtn.textContent = paused ? '다시 녹음' : '일시정지';
    }
    if (doneBtn) doneBtn.disabled = !state.supported || (!recording && !paused) || saving;
    if (cancelBtn) cancelBtn.disabled = !state.supported || (!recording && !paused) || saving;

    if (err) {
      err.textContent = state.supported
        ? state.error
        : '이 브라우저에서는 녹음 저장을 지원하지 않습니다. Android Chrome 또는 최신 Chrome 계열 브라우저를 권장합니다.';
      err.hidden = !err.textContent;
    }
  }

  function mount() {
    const app = $('#app');
    const input = $('[data-change="ttsInput"]', app || document);
    if (!app || !input) return;
    if ($('#reading-recorder-addon')) {
      updateUi();
      return;
    }

    const basePanel = input.closest('.panel') || input.parentElement;
    if (!basePanel) return;

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
      if (action === 'start') startRecording();
      if (action === 'pause') pauseResumeRecording();
      if (action === 'done') doneRecording();
      if (action === 'cancel') cancelRecording();
      if (action === 'delete' && id) removeRecording(id);
      if (action === 'download' && id) downloadRecording(id);
    });

    basePanel.insertAdjacentElement('afterend', panel);
    updateUi();
  }

  async function init() {
    try {
      if (state.supported) state.recordings = await getAll();
    } catch (_) {
      state.supported = false;
    }

    mount();

    const app = $('#app');
    if (app) {
      new MutationObserver(() => mount()).observe(app, { childList: true });
    }
  }

  try {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  } catch (e) {
    console.warn('[reading recorder addon]', e);
  }
})();
