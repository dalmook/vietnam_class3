(() => {
  'use strict';

  const SETTING_KEY = 'autoPlayKorean';

  function resolveAppClass() {
    try {
      if (typeof VietnameseA1App !== 'undefined') return VietnameseA1App;
    } catch (_) {}
    return null;
  }

  function ensureSetting(app) {
    if (!app.settings) app.settings = {};
    if (typeof app.settings[SETTING_KEY] === 'undefined') {
      app.settings[SETTING_KEY] = true;
    }
    return app.settings[SETTING_KEY] !== false;
  }

  function addStyle() {
    if (document.getElementById('autoplay-ko-option-style')) return;

    const style = document.createElement('style');
    style.id = 'autoplay-ko-option-style';
    style.textContent = `
      .autoplay-ko-option {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin: 10px 0;
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(93, 109, 255, 0.08);
        line-height: 1.45;
      }

      .autoplay-ko-option input {
        margin-top: 3px;
        transform: scale(1.1);
      }

      .autoplay-ko-option strong {
        display: block;
        font-size: 0.96rem;
      }

      .autoplay-ko-option small {
        display: block;
        margin-top: 3px;
        opacity: 0.72;
        font-size: 0.82rem;
      }
    `;
    document.head.appendChild(style);
  }

  function insertOption(app) {
    if (!app?.appEl || app.appEl.querySelector('[data-change="autoPlayKorean"]')) return;

    const checked = ensureSetting(app) ? 'checked' : '';
    const label = document.createElement('label');
    label.className = 'autoplay-ko-option';
    label.innerHTML = `
      <input type="checkbox" data-change="autoPlayKorean" ${checked} />
      <span>
        <strong>자동 재생 한국어 뜻 읽기</strong>
        <small>끄면 학습 탭 연속 재생에서 베트남어만 나옵니다.</small>
      </span>
    `;

    const autoPlayInput = app.appEl.querySelector('[data-change="autoPlay"]');
    const anchor = autoPlayInput?.closest('label') || autoPlayInput?.parentElement;

    if (anchor && anchor.parentElement) {
      anchor.insertAdjacentElement('afterend', label);
      return;
    }

    const firstCard = app.appEl.querySelector('.card, .panel, section, article') || app.appEl;
    firstCard.insertAdjacentElement('afterbegin', label);
  }

  function patchApp() {
    const App = resolveAppClass();
    if (!App || App.prototype.__autoplayKoOptionPatched) return false;

    const proto = App.prototype;
    proto.__autoplayKoOptionPatched = true;

    const originalRenderSettings = proto.renderSettings;
    proto.renderSettings = function patchedRenderSettings(...args) {
      ensureSetting(this);
      const result = originalRenderSettings.apply(this, args);
      addStyle();
      insertOption(this);
      return result;
    };

    const originalHandleChange = proto.handleChange;
    proto.handleChange = function patchedHandleChange(action, el) {
      if (action === 'autoPlayKorean') {
        ensureSetting(this);
        this.settings[SETTING_KEY] = !!el.checked;
        this.saveLocal('settings', this.settings);
        this.render();
        return;
      }
      return originalHandleChange.call(this, action, el);
    };

    const originalPlayAudio = proto.playAudio;
    proto.playAudio = async function patchedPlayAudio(audioSrc, fallbackText, options = {}) {
      ensureSetting(this);
      const isKoreanMeaning = /^ko/i.test(options?.lang || '');
      const isStudyAutoplayRunning = !!(this.sentenceAutoplay?.running || this.vocabAutoplay?.running);

      if (isKoreanMeaning && isStudyAutoplayRunning && this.settings[SETTING_KEY] === false) {
        return true;
      }

      return originalPlayAudio.call(this, audioSrc, fallbackText, options);
    };

    return true;
  }

  addStyle();
  if (!patchApp()) {
    document.addEventListener('DOMContentLoaded', patchApp, { once: true });
  }
})();
