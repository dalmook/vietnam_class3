(() => {
  'use strict';

  const KEY = 'vietnam_class3_ttsHistory';

  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  };

  const save = (rows) => {
    localStorage.setItem(KEY, JSON.stringify(rows));
  };

  const getText = (item) => {
    if (typeof item === 'string') return item;
    return item?.text || item?.vi || item?.content || '';
  };

  const splitText = (text) => {
    const clean = String(text || '').replace(/\r/g, '').trim();
    if (!clean) return [];

    let rows = clean
      .match(/[^.!?。！？\n]+[.!?。！？]*/g)
      ?.map((x) => x.trim())
      .filter(Boolean) || [];

    if (rows.length < 2) {
      rows = clean
        .split(/\n+/)
        .map((x) => x.trim())
        .filter(Boolean);
    }

    return rows;
  };

function splitHistory(index) {
  const rows = read();
  const item = rows[index];
  const originalText = getText(item);
  const parts = splitText(originalText);

  if (!item || parts.length < 2) {
    alert('나눌 문장이 없어요. 문장 끝에 . ? ! 표시가 있어야 잘 나뉩니다.');
    return;
  }

  const base = typeof item === 'object' && item !== null ? item : {};
  const now = new Date().toISOString();

  const sourceId =
    base.ttsId ||
    base.sourceId ||
    `tts_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const originalItem =
    typeof item === 'object' && item !== null
      ? { ...item, text: originalText, ttsId: sourceId, splitDone: true }
      : { text: originalText, ttsId: sourceId, splitDone: true, createdAt: now };

  const splitRows = parts.map((text, i) => ({
    text,
    splitNo: i + 1,
    splitTotal: parts.length,
    splitFrom: originalText,
    splitSourceId: sourceId,
    createdAt: now
  }));

  const cleanedRows = rows.filter((row, rowIndex) => {
    if (rowIndex === index) return true;
    return !(row && typeof row === 'object' && row.splitSourceId === sourceId);
  });

  const currentIndex = cleanedRows.findIndex((row, rowIndex) => {
    if (rowIndex === index) return true;
    return row && typeof row === 'object' && row.ttsId === sourceId;
  });

  const insertIndex = currentIndex >= 0 ? currentIndex : index;

  cleanedRows[insertIndex] = originalItem;
  cleanedRows.splice(insertIndex + 1, 0, ...splitRows);

  save(cleanedRows);

  sessionStorage.setItem('openTtsAfterSplit', '1');
  location.reload();
}

  function addStyle() {
    if (document.getElementById('tts-split-style')) return;

    const style = document.createElement('style');
    style.id = 'tts-split-style';
    style.textContent = `
      .tts-split-btn {
        color: #5261ee;
        font-weight: 900;
      }

      .tts-split-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 21px;
        height: 21px;
        margin-right: 5px;
        padding: 0 6px;
        border-radius: 999px;
        background: rgba(93, 109, 255, 0.12);
        color: #5261ee;
        font-size: 0.78rem;
        font-weight: 900;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

function enhanceHistory() {
  const rows = read();

  const speakButtons = Array.from(document.querySelectorAll('[data-action]'))
    .filter((btn) => {
      const action = btn.dataset.action || '';
      const text = btn.textContent || '';
      return action.includes('tts') && action.includes('History') && text.includes('다시');
    });

  speakButtons.forEach((speakBtn, domIndex) => {
    const action = speakBtn.dataset.action || '';
    const matched = action.match(/(\d+)/);
    const index = matched ? Number(matched[1]) : domIndex;

    const actionRow =
      speakBtn.closest('.action-row') ||
      speakBtn.parentElement;

    if (!actionRow) return;
    if (actionRow.querySelector('.tts-split-btn')) return;

    const buttons = Array.from(actionRow.querySelectorAll('button'));
    const deleteBtn =
      buttons.find((btn) => (btn.textContent || '').includes('삭제')) ||
      buttons[buttons.length - 1];

    if (!deleteBtn) return;

    const rowBox =
      actionRow.closest('.history-item') ||
      actionRow.closest('article') ||
      actionRow.closest('.card') ||
      actionRow.parentElement;

    const row = rows[index];

    if (row?.splitNo && rowBox) {
      const p =
        rowBox.querySelector('p') ||
        rowBox.querySelector('.history-text') ||
        rowBox.querySelector('.item-text');

      if (p && !p.querySelector('.tts-split-badge')) {
        p.insertAdjacentHTML(
          'afterbegin',
          `<span class="tts-split-badge">${row.splitNo}</span>`
        );
      }
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tts-split-btn';
    btn.textContent = '문장나누기';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      splitHistory(index);
    });

    deleteBtn.insertAdjacentElement('beforebegin', btn);
  });
}

  function reopenTtsTab() {
    if (sessionStorage.getItem('openTtsAfterSplit') !== '1') return;

    sessionStorage.removeItem('openTtsAfterSplit');

    setTimeout(() => {
      document.querySelector('[data-tab="tts"]')?.click();
    }, 300);
  }

  function init() {
    addStyle();
    reopenTtsTab();
    enhanceHistory();

    const app = document.getElementById('app');
    if (app) {
      new MutationObserver(enhanceHistory).observe(app, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
