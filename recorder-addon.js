(() => {
  'use strict';

  const DB_NAME = 'vietnam_class3_recordings_db';
  const STORE_NAME = 'recordings';

  const state = {
    ok: !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder &&
      window.indexedDB
    ),
    status: 'idle', // idle | recording | paused | saving
    mediaRecorder: null,
    stream: null,
    chunks: [],
    mimeType: '',
    startedAt: 0,
    elapsedMs: 0,
    timer: null,
    rows: [],
    urls: new Map(),
    previewUrl: '',
    error: ''
  };

  const $ = (selector, root = document) => (root ? root.querySelector(selector) : null);

  const escapeHtml = (value = '') =>
    String(value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[ch]));

  const formatTime = (ms = 0) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const min = String(Math.floor(total / 60)).padStart(2, '0');
    const sec = String(total % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  function injectStyle() {
    if ($('#reading-recorder-style')) return;

    const style = document.createElement('style');
    style.id = 'reading-recorder-style';
    style.textContent = `
      .recorder-addon-panel {
        display: grid;
        gap: 10px;
        padding-top: 0 !important;
        padding-bottom: 18px !important;
      }

.rec-sticky {
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + 64px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 80;
  display: grid;
  gap: 10px;
  width: min( calc(100vw - 28px), 720px );
  padding: 12px;
  border: 1px solid rgba(93, 109, 255, 0.14);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}
body.recorder-floating-on #app {
  padding-top: 178px;
}
      .rec-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .rec-top h2 {
        margin: 0;
        font-size: 1.22rem;
        letter-spacing: -0.04em;
      }

      .rec-chip {
        padding: 5px 9px;
        border-radius: 999px;
        background: rgba(93, 109, 255, 0.10);
        color: #5261ee;
        font-size: 0.82rem;
        font-weight: 900;
      }

      .rec-card {
        display: grid;
        gap: 8px;
        padding: 10px;
        border: 1px solid rgba(93, 109, 255, 0.14);
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(93, 109, 255, 0.12), rgba(255, 255, 255, 0.78));
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
      }

      .rec-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .rec-state {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 900;
      }

      .rec-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #aab2c8;
        box-shadow: 0 0 0 5px rgba(170, 178, 200, 0.12);
      }

      .recorder-addon-panel.is-recording .rec-dot {
        background: #ef4444;
        box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.14);
      }

      .rec-time {
        font-size: 1.35rem;
        font-weight: 950;
        font-variant-numeric: tabular-nums;
      }

      .rec-buttons {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 7px;
      }

      .rec-buttons button {
        min-height: 38px;
        padding: 8px 6px;
        border-radius: 14px;
        font-weight: 900;
      }

      .rec-buttons button:disabled {
        opacity: 0.38;
      }

      .rec-buttons .danger,
      .rec-delete {
        color: #d93636;
      }

      .rec-preview {
        display: grid;
        gap: 6px;
        padding: 9px 10px;
        border: 1px solid rgba(93, 109, 255, 0.12);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.86);
      }

      .rec-preview-title {
        display: flex;
        justify-content: space-between;
        color: #5261ee;
        font-size: 0.86rem;
        font-weight: 900;
      }

      .rec-preview audio,
      .rec-item audio {
        width: 100%;
        height: 40px;
      }

      .rec-warning {
        margin: 0;
        padding: 9px 11px;
        border-radius: 14px;
        background: rgba(255, 72, 72, 0.08);
        color: #c53030;
        font-size: 0.88rem;
        font-weight: 800;
      }

      .rec-list-head h3 {
        margin: 4px 0 0;
        font-size: 1.04rem;
      }

      .rec-list {
        display: grid;
        gap: 9px;
      }

      .rec-empty {
        margin: 0;
        padding: 12px;
        border-radius: 16px;
        background: rgba(148, 163, 184, 0.08);
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 700;
      }

      .rec-item {
        display: grid;
        gap: 8px;
        padding: 10px;
        border: 1px solid rgba(15, 23, 42, 0.07);
        border-radius: 17px;
        background: rgba(255, 255, 255, 0.78);
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
      }

      .rec-item-title strong {
        display: block;
        overflow: hidden;
        font-size: 0.95rem;
        line-height: 1.28;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .rec-item-title span {
        display: block;
        margin-top: 2px;
        color: #73809a;
        font-size: 0.78rem;
        font-weight: 800;
      }

      .rec-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin: 0;
        padding: 8px 10px;
        border-radius: 12px;
        background: rgba(93, 109, 255, 0.06);
        font-size: 0.9rem;
        line-height: 1.42;
      }

      .rec-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 7px;
      }

      .rec-download,
      .rec-delete {
        min-height: 36px;
        padding: 7px 9px;
        border: 0;
        border-radius: 12px;
        font-weight: 900;
      }

      @media (max-width: 430px) {
.rec-sticky {
  top: calc(env(safe-area-inset-top, 0px) + 68px);
  width: calc(100vw - 20px);
  padding: 10px;
  border-radius: 20px;
}

        .rec-buttons button {
          font-size: 0.86rem;
        }

        .rec-card {
          padding: 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' }).createIndex('createdAt', 'createdAt');
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getAllRows() {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAll();

      request.onsuccess = () => {
        const rows = request.result || [];
        resolve(rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      };

      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  }

  async function putRow(row) {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(row);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }

  async function deleteRow(id) {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }

  function pickMimeType() {
    const candidates = [
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mp4',
      'audio/webm;codecs=opus',
      'audio/webm'
    ];

    return candidates.find((type) => {
      try {
        return MediaRecorder.isTypeSupported(type);
      } catch {
        return false;
      }
    }) || '';
  }

  function getTtsText() {
    return ($('[data-change="ttsInput"]')?.value || '').trim();
  }

  function getRowUrl(row) {
    if (state.urls.has(row.id)) return state.urls.get(row.id);

    const url = URL.createObjectURL(row.blob);
    state.urls.set(row.id, url);
    return url;
  }

  function stopTimer() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function stopStream() {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
    }
    state.stream = null;
  }

  function tick() {
    state.elapsedMs = Date.now() - state.startedAt;
    updateUi();
  }

  function clearPreview() {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    state.previewUrl = '';
  }

  function makePreview() {
    clearPreview();

    if (state.chunks.length) {
      state.previewUrl = URL.createObjectURL(
        new Blob(state.chunks, { type: state.mimeType || 'audio/webm' })
      );
    }

    updateUi();
  }

  async function openRecorder() {
    state.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    if (!state.mimeType) state.mimeType = pickMimeType();

    state.mediaRecorder = state.mimeType
      ? new MediaRecorder(state.stream, { mimeType: state.mimeType })
      : new MediaRecorder(state.stream);

    state.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size) {
        state.chunks.push(event.data);
      }
    };

    state.mediaRecorder.onerror = () => {
      state.error = '녹음 중 오류가 발생했습니다.';
      state.status = 'idle';
      stopTimer();
      stopStream();
      updateUi();
    };

    state.mediaRecorder.start(1000);
  }

  function stopRecorder() {
    return new Promise((resolve) => {
      const recorder = state.mediaRecorder;

      if (!recorder || recorder.state === 'inactive') {
        resolve();
        return;
      }

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size) {
          state.chunks.push(event.data);
        }
      };

      recorder.onstop = resolve;

      try {
        recorder.requestData();
      } catch {}

      try {
        recorder.stop();
      } catch {
        resolve();
      }
    });
  }

  async function startRecording() {
    if (!state.ok || state.status !== 'idle') return;

    try {
      clearPreview();

      state.error = '';
      state.chunks = [];
      state.mimeType = '';
      state.elapsedMs = 0;
      state.startedAt = Date.now();

      await openRecorder();

      state.status = 'recording';
      state.timer = setInterval(tick, 300);

      updateUi();
    } catch (error) {
      state.error = error && error.name === 'NotAllowedError'
        ? '마이크 권한이 거부되었습니다.'
        : '녹음을 시작할 수 없습니다.';

      state.status = 'idle';

      stopTimer();
      stopStream();
      updateUi();
    }
  }

  async function pauseOrResumeRecording() {
    if (state.status === 'recording') {
      state.elapsedMs = Date.now() - state.startedAt;
      state.status = 'paused';

      stopTimer();
      updateUi();

      await stopRecorder();

      stopStream();
      state.mediaRecorder = null;

      makePreview();
      return;
    }

    if (state.status === 'paused') {
      try {
        clearPreview();

        state.error = '';

        await openRecorder();

        state.startedAt = Date.now() - state.elapsedMs;
        state.status = 'recording';
        state.timer = setInterval(tick, 300);

        updateUi();
      } catch {
        state.error = '녹음을 재개할 수 없습니다.';
        updateUi();
      }
    }
  }

  async function finishRecording() {
    if (!['recording', 'paused'].includes(state.status)) return;

    if (state.status === 'recording') {
      state.elapsedMs = Date.now() - state.startedAt;
      state.status = 'saving';

      stopTimer();
      updateUi();

      await stopRecorder();

      stopStream();
      state.mediaRecorder = null;
    } else {
      state.status = 'saving';
      updateUi();
    }

    const type = state.mimeType || 'audio/webm';
    const createdAt = new Date().toISOString();
    const text = getTtsText();
    const ext = type.includes('mp4') ? 'm4a' : 'webm';

    const row = {
      id: `rec_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      title: text ? (text.length > 30 ? `${text.slice(0, 30)}…` : text) : '읽기 연습 녹음',
      text,
      createdAt,
      durationMs: state.elapsedMs,
      mimeType: type,
      fileName: `vietnam-reading-${createdAt.replace(/[:.]/g, '-').slice(0, 19)}.${ext}`,
      blob: new Blob(state.chunks, { type })
    };

    try {
      await putRow(row);
      state.rows = [row, ...state.rows];
      state.error = '';
    } catch {
      state.error = '브라우저 저장공간 문제로 저장하지 못했습니다.';
    }

    clearPreview();

    state.status = 'idle';
    state.chunks = [];
    state.mimeType = '';
    state.elapsedMs = 0;

    renderList();
    updateUi();
  }

  async function cancelRecording() {
    try {
      await stopRecorder();
    } catch {}

    clearPreview();
    stopTimer();
    stopStream();

    state.status = 'idle';
    state.mediaRecorder = null;
    state.chunks = [];
    state.mimeType = '';
    state.elapsedMs = 0;
    state.error = '';

    updateUi();
  }

  async function removeRecording(id) {
    if (!confirm('이 녹음을 삭제할까요?')) return;

    await deleteRow(id);

    const url = state.urls.get(id);
    if (url) URL.revokeObjectURL(url);

    state.urls.delete(id);
    state.rows = state.rows.filter((row) => row.id !== id);

    renderList();
    updateUi();
  }

  function downloadRecording(id) {
    const row = state.rows.find((item) => item.id === id);
    if (!row) return;

    const anchor = document.createElement('a');
    anchor.href = getRowUrl(row);
    anchor.download = row.fileName || 'vietnam-reading.webm';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function renderListHtml() {
    if (!state.rows.length) {
      return '<p class="rec-empty">저장된 녹음이 없습니다.</p>';
    }

    return state.rows.map((row) => `
      <article class="rec-item">
        <div class="rec-item-title">
          <strong>${escapeHtml(row.title)}</strong>
          <span>${formatDate(row.createdAt)} · ${formatTime(row.durationMs)}</span>
        </div>

        ${row.text ? `<p class="rec-text">${escapeHtml(row.text)}</p>` : ''}

        <audio controls preload="metadata" src="${getRowUrl(row)}"></audio>

        <div class="rec-actions">
          <button class="rec-download" type="button" data-rec-action="download" data-id="${escapeHtml(row.id)}">저장</button>
          <button class="rec-delete" type="button" data-rec-action="delete" data-id="${escapeHtml(row.id)}">삭제</button>
        </div>
      </article>
    `).join('');
  }

  function renderList() {
    const list = $('[data-rec-list]');
    const count = $('[data-rec-count]');

    if (list) list.innerHTML = renderListHtml();
    if (count) count.textContent = String(state.rows.length);
  }

  function updateUi() {
    const panel = $('#reading-recorder-addon');
    if (!panel) return;

    const isRecording = state.status === 'recording';
    const isPaused = state.status === 'paused';
    const isSaving = state.status === 'saving';

    panel.classList.toggle('is-recording', isRecording);

    $('[data-rec-label]', panel).textContent = isRecording
      ? '녹음 중'
      : isPaused
        ? '일시정지'
        : isSaving
          ? '저장 중'
          : '대기';

    $('[data-rec-time]', panel).textContent = formatTime(state.elapsedMs);

    $('[data-rec-action="start"]', panel).disabled = !state.ok || state.status !== 'idle';

    const pauseButton = $('[data-rec-action="pause"]', panel);
    pauseButton.disabled = !state.ok || (!isRecording && !isPaused) || isSaving;
    pauseButton.textContent = isPaused ? '재개' : '일시정지';

    $('[data-rec-action="done"]', panel).disabled = !state.ok || (!isRecording && !isPaused) || isSaving;
    $('[data-rec-action="cancel"]', panel).disabled = !state.ok || (!isRecording && !isPaused) || isSaving;

    const preview = $('[data-rec-preview]', panel);
    const previewAudio = $('[data-rec-preview-audio]', panel);

    if (preview && previewAudio) {
      preview.hidden = !(isPaused && state.previewUrl);

      if (state.previewUrl && previewAudio.src !== state.previewUrl) {
        previewAudio.src = state.previewUrl;
      }

      if (!state.previewUrl) {
        previewAudio.removeAttribute('src');
      }
    }

    const error = $('[data-rec-error]', panel);
    error.textContent = state.ok ? state.error : '이 브라우저에서는 녹음 저장을 지원하지 않습니다.';
    error.hidden = !error.textContent;
  }

function cleanupFloatingRecorder() {
  document.body.classList.remove('recorder-floating-on');

  const recorder = document.getElementById('reading-recorder-addon');
  if (recorder) recorder.remove();
}

function isReadingTabVisible() {
  const app = $('#app');
  if (!app) return false;

  return !!$('[data-change="ttsInput"]', app);
}

function mount() {
  const app = $('#app');

  if (!app || !isReadingTabVisible()) {
    cleanupFloatingRecorder();
    return;
  }

  const existing = $('#reading-recorder-addon');
  if (existing) {
    document.body.classList.add('recorder-floating-on');
    updateUi();
    return;
  }

  const panel = document.createElement('section');
  panel.id = 'reading-recorder-addon';
  panel.className = 'panel recorder-addon-panel';

  panel.innerHTML = `
    <div class="rec-sticky">
      <div class="rec-top">
        <h2>내 발음 녹음</h2>
        <span class="rec-chip"><span data-rec-count>${state.rows.length}</span>개</span>
      </div>

      <div class="rec-card">
        <div class="rec-main">
          <div class="rec-state">
            <span class="rec-dot"></span>
            <span data-rec-label>대기</span>
          </div>
          <strong class="rec-time" data-rec-time>00:00</strong>
        </div>

        <div class="rec-buttons">
          <button class="primary" type="button" data-rec-action="start">녹음</button>
          <button type="button" data-rec-action="pause" disabled>일시정지</button>
          <button type="button" data-rec-action="done" disabled>완료</button>
          <button class="danger" type="button" data-rec-action="cancel" disabled>취소</button>
        </div>

        <div class="rec-preview" data-rec-preview hidden>
          <div class="rec-preview-title">
            <span>미리듣기</span>
            <span>마이크 해제됨</span>
          </div>
          <audio controls preload="metadata" data-rec-preview-audio></audio>
        </div>

        <p class="rec-warning" data-rec-error hidden></p>
      </div>
    </div>

    <div class="rec-list-head">
      <h3>녹음 목록</h3>
    </div>

    <div class="rec-list" data-rec-list>${renderListHtml()}</div>
  `;

  panel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-rec-action]');
    if (!button) return;

    const action = button.dataset.recAction;
    const id = button.dataset.id;

    if (action === 'start') startRecording();
    if (action === 'pause') pauseOrResumeRecording();
    if (action === 'done') finishRecording();
    if (action === 'cancel') cancelRecording();
    if (action === 'delete' && id) removeRecording(id);
    if (action === 'download' && id) downloadRecording(id);
  });

  document.body.classList.add('recorder-floating-on');
  app.insertAdjacentElement('afterbegin', panel);
  updateUi();
}

async function init() {
  injectStyle();

  try {
    if (state.ok) state.rows = await getAllRows();
  } catch {
    state.ok = false;
  }

  mount();

  const app = $('#app');
  if (app) {
    new MutationObserver(() => {
      setTimeout(mount, 0);
    }).observe(app, { childList: true });
  }

  document.addEventListener('click', (event) => {
    const tabButton = event.target.closest('[data-tab]');
    if (!tabButton) return;

    const tabName = tabButton.dataset.tab;

    if (tabName !== 'tts') {
      cleanupFloatingRecorder();
      return;
    }

    setTimeout(mount, 80);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
