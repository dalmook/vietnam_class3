class VietnameseA1App {
  constructor() {
    this.appEl = document.getElementById('app');
    this.storagePrefix = 'vietnam_class3_';
    this.progress = this.loadLocal('progress', {});
    this.wrongAnswers = this.loadLocal('wrongAnswers', []);
    this.bookmarks = this.loadLocal('bookmarks', []);

    this.state = {
      tab: 'home',
      studyMode: 'vocab',
      quizMode: 'meaning',
      lessonId: null,
      cardIndex: 0,
      sentenceIndex: 0,
      dialogueIndex: 0,
      pronIndex: 0,
      grammarLessonFilter: 'all',
      data: null,
      flat: {},
      loadedPath: null,
      searchQuery: '',
      searchResults: [],
      message: '오늘은 10개만 외워볼까요? 🐳',
      quiz: {
        queue: [],
        i: 0,
        score: 0,
        xp: 0,
        streak: 0,
        bestStreak: 0,
        goalCorrect: 8,
        wrong: [],
        phase: 'ready',
        feedback: '',
        answered: false,
        picked: '',
        orderPool: [],
        orderSelected: [],
        matchPairs: [],
        pairPick: []
      },
      settings: { speechRate: 0.95, autoShowMeaning: true, autoPlay: false }
    };
    this.settings = { ...this.state.settings, ...this.loadLocal('settings', {}) };

    this.bindGlobalEvents();
    this.bootstrap();
  }

  async bootstrap() {
    this.renderLoading('데이터를 준비하고 있어요...');
    try {
      const { data, path } = await this.fetchJson();
      this.state.data = data;
      this.state.loadedPath = path;
      this.state.flat = this.flattenData(data.lessons || []);
      this.state.lessonId = data.lessons?.[0]?.lessonId || null;
      this.render();
    } catch (e) {
      this.renderError(`JSON 로딩 실패: ${e.message}. 정적 서버로 실행하고 README 경로를 확인해주세요.`);
    }
  }

  async fetchJson() {
    const paths = [
      './vietnamese_a1_to_opic_im1_starter.json',
      './data/vietnamese_a1_to_opic_im1_starter.json',
      './vietnamese_a1_lessons_1_6_starter.json',
      './data/vietnamese_a1_lessons_1_6_starter.json'
    ];
    let lastErr;
    for (const path of paths) {
      try {
        const res = await fetch(path, { cache: 'no-store' });
        if (!res.ok) throw new Error(`${path} ${res.status}`);
        return { data: await res.json(), path };
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr;
  }

  flattenData(lessons) {
    const flat = { lessons, vocab: [], sentence: [], dialogues: [], grammar: [], pronunciation: [], seeds: [] };
    lessons.forEach((l) => {
      flat.vocab.push(...(l.vocabCards || []).map((x) => ({ ...x, lessonId: l.lessonId, lessonTitle: l.titleKo })));
      flat.sentence.push(...(l.sentenceCards || []).map((x) => ({ ...x, lessonId: l.lessonId, lessonTitle: l.titleKo })));
      flat.dialogues.push(...(l.dialogues || []).map((x) => ({ ...x, lessonId: l.lessonId, lessonTitle: l.titleKo })));
      flat.grammar.push(...(l.grammarPoints || []).map((x) => ({ ...x, lessonId: l.lessonId, lessonTitle: l.titleKo })));
      flat.pronunciation.push(...(l.pronunciationTargets || []).map((x) => ({ ...x, lessonId: l.lessonId, lessonTitle: l.titleKo })));
      flat.seeds.push(...(l.quizSeeds || []).map((x) => ({ ...x, lessonId: l.lessonId, lessonTitle: l.titleKo })));
    });
    return flat;
  }

  bindGlobalEvents() {
    document.querySelector('.bottom-nav').addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (!tab) return;
      this.state.tab = tab.dataset.tab;
      this.render();
    });
    document.addEventListener('keydown', (e) => {
      if (this.state.tab !== 'study') return;
      if (e.key === 'ArrowRight') this.shiftCard(1);
      if (e.key === 'ArrowLeft') this.shiftCard(-1);
    });
  }

  bindRenderedEvents() {
    this.appEl.querySelectorAll('[data-action]').forEach((node) => {
      node.addEventListener('click', () => this.handleAction(node.dataset.action, node));
    });
    this.appEl.querySelectorAll('[data-change]').forEach((node) => {
      node.addEventListener('change', () => this.handleChange(node.dataset.change, node));
    });
  }

  render() {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === this.state.tab));
    if (!this.state.data) return;
    const view = {
      home: () => this.renderHome(),
      study: () => this.renderStudy(),
      quiz: () => this.renderQuiz(),
      search: () => this.renderSearch(),
      bookmark: () => this.renderBookmark(),
      settings: () => this.renderSettings()
    };
    view[this.state.tab]?.();
    this.bindRenderedEvents();
  }

  handleAction(action, el) {
    const [type, payload] = action.split(':');
    if (type === 'openLesson') { this.state.lessonId = payload; this.resetStudyIndexes(); this.state.tab = 'study'; return this.render(); }
    if (type === 'studyMode') { this.state.studyMode = payload; return this.render(); }
    if (type === 'quizMode') { this.state.quizMode = payload; this.setupQuizQueue(); return this.render(); }
    if (type === 'shift') return this.shiftCard(Number(payload));
    if (type === 'mark') return this.markItem(payload, el.dataset.value);
    if (type === 'bookmark') return this.toggleBookmark(payload);
    if (type === 'toggleMeaning') return el.closest('.card').querySelector('.ko')?.classList.toggle('hidden');
    if (type === 'toggleKo') return this.appEl.querySelectorAll('.ko-line').forEach((x) => x.classList.toggle('hidden'));
    if (type === 'search') return this.runSearch();
    if (type === 'jump') return this.jumpToItem(payload);
    if (type === 'speak') return this.playAudio(payload, el.dataset.text || 'xin chào');
    if (type === 'repeatSpeak') return this.repeatSpeak(el.dataset.text, 3);
    if (type === 'startQuiz') { this.setupQuizQueue(); this.state.quiz.phase = 'playing'; return this.render(); }
    if (type === 'nextQuiz') return this.nextQuiz();
    if (type === 'pickOption') return this.pickQuizOption(payload);
    if (type === 'flipResult') return this.flipQuizResult(payload);
    if (type === 'orderPick') return this.pickOrder(payload);
    if (type === 'orderSubmit') return this.submitOrder();
    if (type === 'matchPick') return this.matchPick(payload, el.dataset.side);
    if (type === 'reviewWrong') return this.startWrongReview();
    if (type === 'resetLocal') return this.resetLocal();
  }

  handleChange(action, el) {
    if (action === 'lesson') { this.state.lessonId = el.value; this.resetStudyIndexes(); }
    if (action === 'grammarFilter') this.state.grammarLessonFilter = el.value;
    if (action === 'searchInput') this.state.searchQuery = el.value;
    if (action === 'speechRate') this.settings.speechRate = Number(el.value);
    if (action === 'autoShowMeaning') this.settings.autoShowMeaning = el.checked;
    if (action === 'autoPlay') this.settings.autoPlay = el.checked;
    this.saveLocal('settings', this.settings);
    this.render();
  }

  renderHome() {
    const total = this.state.flat.vocab.length + this.state.flat.sentence.length;
    const known = Object.values(this.progress).filter((p) => p.known).length;
    const wrong = Object.values(this.progress).reduce((a, c) => a + (c.wrongCount || 0), 0);
    const correct = Object.values(this.progress).reduce((a, c) => a + (c.correctCount || 0), 0);
    const rate = correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : 0;

    const lessonCards = this.state.flat.lessons.map((l) => {
      const ids = [...(l.vocabCards || []).map((v) => v.id), ...(l.sentenceCards || []).map((s) => s.id)];
      const done = ids.filter((id) => this.progress[id]?.known).length;
      const p = ids.length ? Math.round((done / ids.length) * 100) : 0;
      return `<div class="card lesson-card fade" data-action="openLesson:${l.lessonId}">
        <div class="row"><span class="badge">${l.unitLabel}</span><span class="small">${l.titleKo}</span></div>
        <h3>${l.titleVi}</h3>
        <p class="small">목표: ${(l.goals || []).join(' · ')}</p>
        <p class="small">단어 ${(l.vocabCards || []).length}개 · 문장 ${(l.sentenceCards || []).length}개 · 진행률 ${p}%</p>
        <div class="progress"><span style="width:${p}%"></span></div>
      </div>`;
    }).join('');

    this.appEl.innerHTML = `<section class="fade">
      <div class="card notice">${this.state.message}</div>
      <div class="grid-2">
        <div class="card stat"><small>전체 진도</small><strong>${Math.round((known / Math.max(total, 1)) * 100)}%</strong></div>
        <div class="card stat"><small>오늘 학습 수</small><strong>${this.todayCount()}개</strong></div>
        <div class="card stat"><small>정답률</small><strong>${rate}%</strong></div>
        <div class="card stat"><small>연속 정답</small><strong>${this.loadLocal('best_streak', 0)} 🔥</strong></div>
      </div>
      ${lessonCards}
    </section>`;
  }

  renderStudy() {
    const lesson = this.currentLesson();
    if (!lesson) return this.renderError('레슨을 찾을 수 없습니다.');
    const tabs = ['vocab', 'sentence', 'dialogue', 'grammar', 'pronunciation'].map((m) => `<button data-action="studyMode:${m}" class="${this.state.studyMode === m ? 'primary' : ''}">${({ vocab: '단어장', sentence: '문장', dialogue: '회화', grammar: '문법', pronunciation: '발음' })[m]}</button>`).join('');

    let body = '';
    if (this.state.studyMode === 'vocab') body = this.renderVocab(lesson);
    if (this.state.studyMode === 'sentence') body = this.renderSentence(lesson);
    if (this.state.studyMode === 'dialogue') body = this.renderDialogue(lesson);
    if (this.state.studyMode === 'grammar') body = this.renderGrammar();
    if (this.state.studyMode === 'pronunciation') body = this.renderPronunciation(lesson);

    this.appEl.innerHTML = `<section class="fade">
      <div class="card"><label class="small">레슨 선택</label><select data-change="lesson">${this.state.flat.lessons.map((l) => `<option value="${l.lessonId}" ${l.lessonId === this.state.lessonId ? 'selected' : ''}>${l.unitLabel} · ${l.titleKo}</option>`).join('')}</select></div>
      <div class="card controls">${tabs}</div>
      ${body}
    </section>`;
  }

  renderVocab(lesson) {
    const cards = lesson.vocabCards || [];
    if (!cards.length) return '<div class="card">단어가 없습니다.</div>';
    const idx = this.clampIndex(this.state.cardIndex, cards.length);
    this.state.cardIndex = idx;
    const c = cards[idx];
    return `<article class="card fade">
      <div class="row"><span class="badge">${idx + 1} / ${cards.length}</span>${c.sourcePage ? `<span class="badge">p.${c.sourcePage}</span>` : ''}</div>
      <div class="vi-big">${c.term}</div>
      <div class="pron-tip">발음팁: ${this.pronHint(lesson, c.term)}</div>
      <div class="ko ${this.settings.autoShowMeaning ? '' : 'hidden'}">${c.meaningKo}</div>
      ${c.example ? `<p class="small">예문: ${c.example}<br>${c.exampleMeaningKo || ''}</p>` : ''}
      <div class="controls">
        <button class="primary" data-action="speak:${c.audioSrc || ''}" data-text="${c.term}">듣기</button>
        <button class="warn" data-action="repeatSpeak" data-text="${c.term}">3회 반복</button>
        <button data-action="toggleMeaning">뜻 토글</button>
      </div>
      <div class="controls">
        <button class="good" data-action="mark:${c.id}" data-value="known">알아요</button>
        <button class="bad" data-action="mark:${c.id}" data-value="unknown">몰라요</button>
        <button data-action="bookmark:${c.id}">${this.bookmarks.includes(c.id) ? '북마크 해제' : '북마크'}</button>
      </div>
      <div class="controls"><button data-action="shift:-1">◀ 이전</button><button data-action="shift:1">다음 ▶</button></div>
    </article>`;
  }

  renderSentence(lesson) {
    const cards = lesson.sentenceCards || [];
    if (!cards.length) return '<div class="card">문장이 없습니다.</div>';
    const idx = this.clampIndex(this.state.sentenceIndex, cards.length);
    this.state.sentenceIndex = idx;
    const c = cards[idx];
    return `<article class="card fade">
      <div class="row"><span class="badge">${idx + 1} / ${cards.length}</span>${c.sourcePage ? `<span class="badge">p.${c.sourcePage}</span>` : ''}</div>
      <div class="vi-big">${c.textVi}</div>
      <div class="pron-tip">발음팁: 문장을 끊어 읽기 + 마지막 성조 분명히</div>
      <div class="ko ${this.settings.autoShowMeaning ? '' : 'hidden'}">${c.textKo}</div>
      <div class="controls">
        <button class="primary" data-action="speak:${c.audioSrc || ''}" data-text="${c.textVi}">듣기</button>
        <button class="warn" data-action="repeatSpeak" data-text="${c.textVi}">3번 반복 듣기</button>
        <button data-action="toggleMeaning">해석 토글</button>
      </div>
      <div class="controls">
        <button class="good" data-action="mark:${c.id}" data-value="known">외움</button>
        <button class="bad" data-action="mark:${c.id}" data-value="difficult">어려움</button>
        <button data-action="shift:1">다음</button>
      </div>
    </article>`;
  }

  renderDialogue(lesson) {
    const list = lesson.dialogues || [];
    if (!list.length) return '<div class="card">회화가 없습니다.</div>';
    const idx = this.clampIndex(this.state.dialogueIndex, list.length);
    this.state.dialogueIndex = idx;
    const d = list[idx];
    return `<article class="card fade"><h3>${d.title}</h3>
      ${(d.lines || []).map((line, i) => `<div class="dialogue-line ${i % 2 ? 'alt' : ''}"><strong>${line.speaker}</strong>: ${line.vi}<div class="ko-line small">${line.ko}</div><button data-action="speak:" data-text="${line.vi}">한 줄 듣기</button></div>`).join('')}
      <div class="controls"><button class="primary" data-action="speak:${d.audioSrc || ''}" data-text="${(d.lines || []).map((x) => x.vi).join(' ')}">전체 듣기</button><button data-action="toggleKo">한국어 토글</button><button data-action="shift:1">다음 대화</button></div>
    </article>`;
  }

  renderGrammar() {
    const list = this.state.flat.grammar.filter((g) => this.state.grammarLessonFilter === 'all' || g.lessonId === this.state.grammarLessonFilter);
    return `<article class="fade"><div class="card"><label class="small">레슨별 보기</label><select data-change="grammarFilter"><option value="all">전체</option>${this.state.flat.lessons.map((l) => `<option value="${l.lessonId}" ${this.state.grammarLessonFilter === l.lessonId ? 'selected' : ''}>${l.unitLabel}</option>`).join('')}</select></div>${list.map((g) => `<div class="card"><span class="badge">${g.lessonTitle}</span><h3>${g.title}</h3><div class="vi-big" style="font-size:1.4rem">${g.pattern}</div></div>`).join('')}</article>`;
  }

  renderPronunciation(lesson) {
    const list = lesson.pronunciationTargets || [];
    if (!list.length) return '<div class="card">발음 데이터가 없습니다.</div>';
    const idx = this.clampIndex(this.state.pronIndex, list.length);
    this.state.pronIndex = idx;
    const t = list[idx];
    return `<article class="card fade">
      <span class="badge">성조/모음 타겟 ${idx + 1}/${list.length}</span>
      <div class="vi-big">${t.text}</div>
      <p class="ko">${t.hintKo}</p>
      <div class="controls"><button class="primary" data-action="speak:${t.audioSrc || ''}" data-text="${t.text}">듣기</button><button class="warn" data-action="repeatSpeak" data-text="${t.text}">3회 반복</button><button data-action="shift:1">다음</button></div>
    </article>`;
  }

  renderQuiz() {
    const modes = [['meaning', 'A 뜻 맞추기'], ['vi', 'B 베트남어 맞추기'], ['flip', 'C 카드 뒤집기'], ['listen', 'D 듣기'], ['order', 'E 순서 맞추기'], ['tone', 'F 성조 구분'], ['match', 'G 매칭'], ['wrong', 'H 오답복습']];
    const chooser = `<div class="card controls">${modes.map(([k, v]) => `<button data-action="quizMode:${k}" class="${this.state.quizMode === k ? 'primary' : ''}">${v}</button>`).join('')}</div>`;
    const hero = this.renderQuizHero();
    if (this.state.quizMode === 'wrong') {
      this.appEl.innerHTML = `<section class="fade">${chooser}${hero}<div class="card"><p>저장된 오답 ${this.wrongAnswers.length}개</p><button class="primary" data-action="reviewWrong">오답만 다시 풀기</button></div>${this.renderQuizCore()}</section>`;
      return;
    }
    this.appEl.innerHTML = `<section class="fade">${chooser}${hero}${this.renderQuizCore()}</section>`;
  }

  renderQuizHero() {
    const q = this.state.quiz;
    const total = q.queue.length || 10;
    const solved = Math.min(q.i, total);
    const p = Math.round((solved / total) * 100);
    return `<div class="card quiz-hero"><div class="row"><span class="badge">챌린지 목표 ${q.goalCorrect}/${total}</span><span class="badge">XP ${q.xp}</span></div>
      <div class="grid-2"><div><small>현재 점수</small><strong>${q.score}</strong></div><div><small>연속 정답</small><strong>${q.streak}</strong></div></div>
      <div class="progress"><span style="width:${p}%"></span></div>
      <p class="small">문항 ${Math.min(q.i + 1, total)} / ${total}</p>
    </div>`;
  }

  renderQuizCore() {
    const q = this.state.quiz;
    if (q.phase !== 'playing') return '<div class="card"><h3>실전 퀴즈 시작</h3><p class="small">목표 정답을 넘기면 고래 배지가 빛나요 🐳</p><button class="primary" data-action="startQuiz">시작하기</button></div>';
    const item = q.queue[q.i];
    if (!item) {
      const total = q.queue.length || 1;
      const rate = Math.round((q.score / total) * 100);
      const success = q.score >= q.goalCorrect;
      return `<div class="card"><h3>${success ? '미션 성공! 🎉' : '한 번 더 도전!'}</h3><p>정답 ${q.score} / ${total} · 정답률 ${rate}% · XP ${q.xp}</p><p class="small">최고 연속 정답 ${q.bestStreak}</p><button class="primary" data-action="startQuiz">다시 풀기</button></div>`;
    }
    if (['meaning', 'vi', 'listen'].includes(this.state.quizMode)) return this.renderMcq(item);
    if (this.state.quizMode === 'flip') return this.renderFlip(item);
    if (this.state.quizMode === 'order') return this.renderOrder();
    if (this.state.quizMode === 'tone') return this.renderTone();
    if (this.state.quizMode === 'match') return this.renderMatch();
    return '<div class="card">퀴즈 준비 중</div>';
  }

  renderMcq(item) {
    const isMeaning = this.state.quizMode === 'meaning' || this.state.quizMode === 'listen';
    const prompt = this.state.quizMode === 'vi' ? (item.meaningKo || item.textKo) : (item.term || item.textVi);
    const answer = isMeaning ? (item.meaningKo || item.textKo) : (item.term || item.textVi);
    const options = this.sampleOptions(answer, isMeaning ? 'ko' : 'vi');
    const pronunciation = item.term || item.textVi;
    if (this.state.quizMode === 'listen' && !this.state.quiz.answered) setTimeout(() => this.playAudio(item.audioSrc || '', pronunciation), 80);
    return `<div class="card quiz-card">
      <div class="row"><span class="badge">문항 ${this.state.quiz.i + 1}</span><button data-action="speak:${item.audioSrc || ''}" data-text="${pronunciation}">🔊 다시 듣기</button></div>
      <h3>${this.state.quizMode === 'listen' ? '듣고 정답 고르기' : prompt}</h3>
      <p class="small">정답 시 +10 XP · 연속 정답 보너스 +2 XP</p>
      ${options.map((o) => `<button class="quiz-option ${this.state.quiz.picked === o ? 'choice-selected' : ''}" data-action="pickOption:${this.escapeAttr(o)}" ${this.state.quiz.answered ? 'disabled' : ''}>${o}</button>`).join('')}
      <p class="quiz-feedback">${this.state.quiz.feedback}</p>
      <button data-action="nextQuiz" ${this.state.quiz.answered ? '' : 'disabled'}>다음 문항</button>
    </div>`;
  }

  renderFlip(item) {
    return `<div class="card quiz-card"><h3>${item.term || item.textVi}</h3><p class="small">먼저 스스로 뜻을 떠올리세요.</p>
      <button data-action="toggleMeaning">정답 보기</button><div class="ko hidden">${item.meaningKo || item.textKo}</div>
      <div class="controls"><button class="good" data-action="flipResult:correct">맞음(+8 XP)</button><button class="bad" data-action="flipResult:wrong">틀림</button></div>
      <p>${this.state.quiz.feedback}</p></div>`;
  }

  renderOrder() {
    const seed = this.state.flat.seeds.find((s) => s.type === 'order-dialogue') || { answerSet: [] };
    if (!this.state.quiz.orderPool.length) this.state.quiz.orderPool = this.shuffle([...seed.answerSet]);
    return `<div class="card quiz-card"><h3>순서 맞추기</h3><p class="small">클릭한 순서로 아래에 쌓입니다.</p>
      ${this.state.quiz.orderPool.map((line) => `<button class="quiz-option" data-action="orderPick:${this.escapeAttr(line)}">${line}</button>`).join('')}
      <p>선택: ${this.state.quiz.orderSelected.join(' → ')}</p>
      <button class="primary" data-action="orderSubmit">제출</button>
      <button data-action="nextQuiz">다음</button>
      <p class="quiz-feedback">${this.state.quiz.feedback}</p></div>`;
  }

  renderTone() {
    const seed = this.state.flat.seeds.find((s) => s.type === 'tone-identification');
    const options = seed?.answerSet || ['ma', 'má', 'mà', 'mả', 'mã', 'mạ'];
    const ask = options[Math.floor(Math.random() * options.length)];
    return `<div class="card quiz-card"><h3>성조 구분 퀴즈</h3><div class="vi-big">${ask}</div>
      <p class="small">먼저 듣고 같은 성조를 골라보세요.</p>
      <button class="primary" data-action="speak:" data-text="${ask}">🔊 듣기</button>
      ${options.map((o) => `<button class="quiz-option" data-action="pickOption:${this.escapeAttr(o)}">${o}</button>`).join('')}
      <p class="quiz-feedback">${this.state.quiz.feedback}</p><button data-action="nextQuiz">다음</button></div>`;
  }

  renderMatch() {
    const seed = this.state.flat.seeds.find((s) => ['match-term', 'sound-match', 'weekday-match'].includes(s.type));
    const pairs = (seed?.answerSet || []).map((x) => x.split('-'));
    if (!this.state.quiz.matchPairs.length) this.state.quiz.matchPairs = this.shuffle([...pairs]);
    const left = this.state.quiz.matchPairs.map((p) => p[0]);
    const right = this.shuffle(this.state.quiz.matchPairs.map((p) => p[1]));
    return `<div class="card quiz-card"><h3>매칭 퀴즈</h3>
      <div class="grid-2"><div>${left.map((v) => `<button class="quiz-option" data-side="left" data-action="matchPick:${this.escapeAttr(v)}">${v}</button>`).join('')}</div><div>${right.map((v) => `<button class="quiz-option" data-side="right" data-action="matchPick:${this.escapeAttr(v)}">${v}</button>`).join('')}</div></div>
      <p class="quiz-feedback">${this.state.quiz.feedback}</p><button data-action="nextQuiz">다음</button></div>`;
  }

  renderSearch() {
    this.appEl.innerHTML = `<section class="fade"><div class="card"><input class="input" data-change="searchInput" value="${this.state.searchQuery}" placeholder="베트남어/한국어 검색 (예: khoe, khỏe)" /><button class="primary" data-action="search">검색</button></div>
      ${this.state.searchResults.map((r) => `<div class="card list-item"><span class="badge">${r.lessonTitle}</span><h3>${r.term || r.textVi}</h3><p>${r.meaningKo || r.textKo || ''}</p><button data-action="jump:${r.id}">바로 학습</button></div>`).join('')}</section>`;
  }

  renderBookmark() {
    const marked = this.bookmarks.map((id) => this.findItem(id)).filter(Boolean);
    const difficult = Object.entries(this.progress).filter(([, v]) => v.difficult).map(([id]) => this.findItem(id)).filter(Boolean);
    this.appEl.innerHTML = `<section class="fade"><div class="card"><h3>북마크 ${marked.length}</h3>${marked.map((m) => `<div class="list-item">${m.term || m.textVi} · ${m.meaningKo || m.textKo}</div>`).join('') || '<p>없음</p>'}</div>
      <div class="card"><h3>어려운 항목 ${difficult.length}</h3>${difficult.map((m) => `<div class="list-item">${m.term || m.textVi} · ${m.meaningKo || m.textKo}</div>`).join('') || '<p>없음</p>'}</div></section>`;
  }

  renderSettings() {
    const c = this.state.flat;
    this.appEl.innerHTML = `<section class="fade"><div class="card"><h3>설정</h3>
      <label>음성 속도 ${this.settings.speechRate.toFixed(2)}</label><input type="range" min="0.6" max="1.2" step="0.05" value="${this.settings.speechRate}" data-change="speechRate" />
      <label><input type="checkbox" ${this.settings.autoShowMeaning ? 'checked' : ''} data-change="autoShowMeaning" /> 자동 뜻 보이기</label><br>
      <label><input type="checkbox" ${this.settings.autoPlay ? 'checked' : ''} data-change="autoPlay" /> 카드 넘김 자동 재생</label>
      <div class="controls"><button class="bad" data-action="resetLocal">학습기록 초기화</button></div></div>
      <div class="card"><h3>JSON 로딩 상태</h3><p class="small">경로: ${this.state.loadedPath}</p><p class="small">lessons ${c.lessons.length}, vocab ${c.vocab.length}, sentence ${c.sentence.length}, dialogues ${c.dialogues.length}, grammar ${c.grammar.length}, pronunciation ${c.pronunciation.length}, quizSeeds ${c.seeds.length}</p></div></section>`;
  }

  setupQuizQueue() {
    const base = this.shuffle([...this.state.flat.vocab, ...this.state.flat.sentence]).slice(0, 12);
    this.state.quiz = {
      ...this.state.quiz,
      queue: base,
      i: 0,
      score: 0,
      xp: 0,
      streak: 0,
      bestStreak: this.loadLocal('best_streak', 0),
      goalCorrect: Math.max(8, Math.floor(base.length * 0.75)),
      wrong: [],
      phase: 'ready',
      feedback: '',
      answered: false,
      picked: '',
      orderPool: [],
      orderSelected: [],
      matchPairs: [],
      pairPick: []
    };
  }

  pickQuizOption(value) {
    const item = this.state.quiz.queue[this.state.quiz.i];
    if (!item || this.state.quiz.answered) return;
    let answer = this.state.quizMode === 'vi' ? (item.term || item.textVi) : (item.meaningKo || item.textKo);
    if (this.state.quizMode === 'tone') answer = value;
    const ok = this.state.quizMode === 'tone' ? true : value === answer;
    this.state.quiz.answered = true;
    this.state.quiz.picked = value;
    if (ok) {
      this.state.quiz.score += 1;
      this.state.quiz.streak += 1;
      this.state.quiz.bestStreak = Math.max(this.state.quiz.bestStreak, this.state.quiz.streak);
      this.state.quiz.xp += 10 + Math.min(10, this.state.quiz.streak * 2);
      this.state.quiz.feedback = `정답! 🐳 +${10 + Math.min(10, this.state.quiz.streak * 2)}XP`;
      this.saveLocal('best_streak', this.state.quiz.bestStreak);
    } else {
      this.state.quiz.streak = 0;
      this.state.quiz.feedback = `오답! 정답: ${answer} · 한 번 더 들으면 됩니다!`;
      this.state.quiz.wrong.push(item.id);
      if (!this.wrongAnswers.includes(item.id)) this.wrongAnswers.push(item.id);
      this.saveLocal('wrongAnswers', this.wrongAnswers);
    }
    this.markItem(item.id, ok ? 'correct' : 'wrong', false);
    this.render();
  }

  flipQuizResult(result) {
    const item = this.state.quiz.queue[this.state.quiz.i];
    const ok = result === 'correct';
    if (ok) {
      this.state.quiz.score += 1;
      this.state.quiz.streak += 1;
      this.state.quiz.xp += 8;
      this.state.quiz.feedback = '좋아요! +8XP';
    } else {
      this.state.quiz.streak = 0;
      this.state.quiz.feedback = '다음 카드에서 복수해요!';
      if (!this.wrongAnswers.includes(item.id)) this.wrongAnswers.push(item.id);
      this.saveLocal('wrongAnswers', this.wrongAnswers);
    }
    this.nextQuiz();
  }

  pickOrder(text) {
    if (!this.state.quiz.orderSelected.includes(text)) this.state.quiz.orderSelected.push(text);
    this.render();
  }

  submitOrder() {
    const seed = this.state.flat.seeds.find((s) => s.type === 'order-dialogue');
    const ok = JSON.stringify(seed?.answerSet || []) === JSON.stringify(this.state.quiz.orderSelected);
    if (ok) {
      this.state.quiz.score += 1;
      this.state.quiz.xp += 14;
      this.state.quiz.feedback = '순서 완벽! +14XP 🎉';
    } else this.state.quiz.feedback = '순서를 다시 확인해볼까요?';
    this.render();
  }

  matchPick(value, side) {
    this.state.quiz.pairPick.push({ value, side });
    if (this.state.quiz.pairPick.length < 2) return;
    const [a, b] = this.state.quiz.pairPick.slice(-2);
    const key1 = `${a.value}-${b.value}`;
    const key2 = `${b.value}-${a.value}`;
    const seed = this.state.flat.seeds.find((s) => ['match-term', 'sound-match', 'weekday-match'].includes(s.type));
    const ok = (seed?.answerSet || []).includes(key1) || (seed?.answerSet || []).includes(key2);
    if (ok) {
      this.state.quiz.score += 1;
      this.state.quiz.xp += 12;
      this.state.quiz.feedback = '매칭 성공! +12XP';
    } else this.state.quiz.feedback = '아쉽지만 다시!';
    this.render();
  }

  nextQuiz() {
    this.state.quiz.i += 1;
    this.state.quiz.feedback = '';
    this.state.quiz.answered = false;
    this.state.quiz.picked = '';
    this.state.quiz.orderSelected = [];
    this.state.quiz.orderPool = [];
    this.state.quiz.matchPairs = [];
    this.state.quiz.pairPick = [];
    this.render();
  }

  startWrongReview() {
    const queue = this.wrongAnswers.map((id) => this.findItem(id)).filter(Boolean);
    this.state.quiz = { ...this.state.quiz, queue, i: 0, score: 0, xp: 0, streak: 0, goalCorrect: Math.max(3, queue.length), phase: 'playing', answered: false, feedback: '' };
    this.render();
  }

  shiftCard(delta) {
    const lesson = this.currentLesson();
    if (!lesson) return;
    if (this.state.studyMode === 'vocab') this.state.cardIndex = this.rotateIndex(this.state.cardIndex, delta, (lesson.vocabCards || []).length);
    if (this.state.studyMode === 'sentence') this.state.sentenceIndex = this.rotateIndex(this.state.sentenceIndex, delta, (lesson.sentenceCards || []).length);
    if (this.state.studyMode === 'dialogue') this.state.dialogueIndex = this.rotateIndex(this.state.dialogueIndex, delta, (lesson.dialogues || []).length);
    if (this.state.studyMode === 'pronunciation') this.state.pronIndex = this.rotateIndex(this.state.pronIndex, delta, (lesson.pronunciationTargets || []).length);

    if (this.settings.autoPlay) {
      const item = this.currentCardItem();
      if (item) this.playAudio(item.audioSrc || '', item.term || item.textVi || item.text);
    }
    this.render();
  }

  markItem(id, value, rerender = true) {
    const p = this.progress[id] || { correctCount: 0, wrongCount: 0 };
    if (value === 'known') p.known = true;
    if (value === 'unknown') p.known = false;
    if (value === 'difficult') p.difficult = true;
    if (value === 'correct') p.correctCount = (p.correctCount || 0) + 1;
    if (value === 'wrong') p.wrongCount = (p.wrongCount || 0) + 1;
    p.lastStudiedAt = new Date().toISOString();
    this.progress[id] = p;
    this.saveLocal('progress', this.progress);
    if (rerender) this.render();
  }

  toggleBookmark(id) {
    this.bookmarks = this.bookmarks.includes(id) ? this.bookmarks.filter((x) => x !== id) : [...this.bookmarks, id];
    this.saveLocal('bookmarks', this.bookmarks);
    this.render();
  }

  runSearch() {
    const q = this.normalize(this.state.searchQuery.trim());
    const list = [...this.state.flat.vocab, ...this.state.flat.sentence];
    this.state.searchResults = list.filter((x) => this.normalize(x.term || x.textVi || '').includes(q) || (x.meaningKo || x.textKo || '').toLowerCase().includes(this.state.searchQuery.toLowerCase())).slice(0, 60);
    this.render();
  }

  jumpToItem(id) {
    const lesson = this.state.flat.lessons.find((l) => [...(l.vocabCards || []), ...(l.sentenceCards || [])].some((x) => x.id === id));
    if (!lesson) return;
    this.state.lessonId = lesson.lessonId;
    if ((lesson.vocabCards || []).some((x) => x.id === id)) {
      this.state.studyMode = 'vocab';
      this.state.cardIndex = (lesson.vocabCards || []).findIndex((x) => x.id === id);
    } else {
      this.state.studyMode = 'sentence';
      this.state.sentenceIndex = (lesson.sentenceCards || []).findIndex((x) => x.id === id);
    }
    this.state.tab = 'study';
    this.render();
  }

  async playAudio(audioSrc, fallbackText) {
    const src = (audioSrc || '').replace(/^\//, './');
    if (src) {
      try {
        const audio = new Audio(src);
        await audio.play();
        return;
      } catch (_) {}
    }
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(fallbackText || 'xin chào');
      u.lang = 'vi-VN';
      u.rate = this.settings.speechRate;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  }

  repeatSpeak(text, n) {
    let i = 0;
    const tick = () => {
      if (i >= n) return;
      i += 1;
      this.playAudio('', text);
      setTimeout(tick, 1200);
    };
    tick();
  }

  pronHint(lesson, text) {
    const t = this.normalize(text || '');
    const p = (lesson.pronunciationTargets || []).find((x) => t.includes(this.normalize((x.text || '').split('/')[0])));
    return p?.hintKo || '성조를 또렷하게, 음절을 천천히 분리해서 읽어보세요.';
  }

  rotateIndex(index, delta, len) {
    if (!len) return 0;
    return (index + delta + len) % len;
  }

  clampIndex(index, len) {
    if (!len) return 0;
    return Math.min(Math.max(0, index), len - 1);
  }

  currentLesson() {
    return this.state.flat.lessons.find((l) => l.lessonId === this.state.lessonId);
  }

  currentCardItem() {
    const lesson = this.currentLesson();
    if (!lesson) return null;
    if (this.state.studyMode === 'vocab') return lesson.vocabCards?.[this.state.cardIndex];
    if (this.state.studyMode === 'sentence') return lesson.sentenceCards?.[this.state.sentenceIndex];
    if (this.state.studyMode === 'pronunciation') return lesson.pronunciationTargets?.[this.state.pronIndex];
    return null;
  }

  findItem(id) {
    return [...this.state.flat.vocab, ...this.state.flat.sentence, ...this.state.flat.pronunciation].find((x) => x.id === id);
  }

  resetStudyIndexes() {
    this.state.cardIndex = 0;
    this.state.sentenceIndex = 0;
    this.state.dialogueIndex = 0;
    this.state.pronIndex = 0;
  }

  resetLocal() {
    ['progress', 'wrongAnswers', 'bookmarks', 'settings', 'best_streak'].forEach((k) => localStorage.removeItem(this.storagePrefix + k));
    this.progress = {};
    this.wrongAnswers = [];
    this.bookmarks = [];
    this.settings = { ...this.state.settings };
    this.render();
  }

  todayCount() {
    const d = new Date().toISOString().slice(0, 10);
    return Object.values(this.progress).filter((x) => (x.lastStudiedAt || '').startsWith(d)).length;
  }

  normalize(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  sampleOptions(answer, type) {
    const pool = type === 'ko'
      ? [...new Set([...this.state.flat.vocab.map((x) => x.meaningKo), ...this.state.flat.sentence.map((x) => x.textKo)].filter(Boolean))]
      : [...new Set([...this.state.flat.vocab.map((x) => x.term), ...this.state.flat.sentence.map((x) => x.textVi)].filter(Boolean))];
    return this.shuffle([answer, ...this.shuffle(pool.filter((x) => x !== answer)).slice(0, 3)]);
  }

  shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
  escapeAttr(s = '') { return String(s).replace(/"/g, '&quot;'); }

  loadLocal(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(this.storagePrefix + key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  saveLocal(key, value) { localStorage.setItem(this.storagePrefix + key, JSON.stringify(value)); }
  renderLoading(msg) { this.appEl.innerHTML = `<div class="card">${msg}</div>`; }
  renderError(msg) { this.appEl.innerHTML = `<div class="card"><h3>앗! 문제가 생겼어요.</h3><p>${msg}</p></div>`; }
}

window.addEventListener('DOMContentLoaded', () => new VietnameseA1App());
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
