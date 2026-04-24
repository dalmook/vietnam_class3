class VietnameseA1App {
  constructor() {
    this.appEl = document.getElementById('app');
    this.state = {
      tab: 'home',
      studyMode: 'vocab',
      quizMode: 'meaning',
      lessonId: null,
      lessonIndex: 0,
      cardIndex: 0,
      sentenceIndex: 0,
      dialogueIndex: 0,
      grammarLessonFilter: 'all',
      pronIndex: 0,
      data: null,
      flat: {},
      loadedPath: null,
      message: '오늘은 10개만 외워볼까요? 🐳',
      searchQuery: '',
      searchResults: [],
      quiz: { queue: [], i: 0, score: 0, wrong: [], phase: 'ready', orderSelected: [], matchPair: [], feedback: '' },
      settings: { speechRate: 0.95, autoShowMeaning: true, autoPlay: false }
    };
    this.storagePrefix = 'vietnam_class3_';
    this.progress = this.loadLocal('progress', {});
    this.wrongAnswers = this.loadLocal('wrongAnswers', []);
    this.bookmarks = this.loadLocal('bookmarks', []);
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
      this.renderError(`JSON 로딩 실패: ${e.message}. README의 경로 안내를 확인해 주세요.`);
    }
  }

  async fetchJson() {
    const paths = ['./vietnamese_a1_to_opic_im1_starter.json', './data/vietnamese_a1_to_opic_im1_starter.json', './vietnamese_a1_lessons_1_6_starter.json', './data/vietnamese_a1_lessons_1_6_starter.json'];
    let lastErr;
    for (const path of paths) {
      try {
        const res = await fetch(path, { cache: 'no-store' });
        if (!res.ok) throw new Error(`${path} ${res.status}`);
        const data = await res.json();
        return { data, path };
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
      const btn = e.target.closest('[data-tab]');
      if (!btn) return;
      this.state.tab = btn.dataset.tab;
      this.render();
    });
    document.addEventListener('keydown', (e) => {
      if (this.state.tab !== 'study') return;
      if (e.key === 'ArrowRight') this.shiftCard(1);
      if (e.key === 'ArrowLeft') this.shiftCard(-1);
    });
  }

  render() {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === this.state.tab));
    if (!this.state.data) return;
    const map = {
      home: () => this.renderHome(),
      study: () => this.renderStudy(),
      quiz: () => this.renderQuiz(),
      search: () => this.renderSearch(),
      bookmark: () => this.renderBookmark(),
      settings: () => this.renderSettings()
    };
    map[this.state.tab]?.();
    this.bindRenderedEvents();
  }

  bindRenderedEvents() {
    this.appEl.querySelectorAll('[data-action]').forEach((el) => {
      el.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset.action, e.currentTarget));
    });
    this.appEl.querySelectorAll('[data-change]').forEach((el) => {
      el.addEventListener('change', (e) => this.handleChange(e.currentTarget.dataset.change, e.currentTarget));
    });
  }

  handleAction(action, el) {
    const [type, payload] = action.split(':');
    if (type === 'openLesson') { this.state.lessonId = payload; this.state.tab = 'study'; this.resetStudyIndexes(); return this.render(); }
    if (type === 'studyMode') { this.state.studyMode = payload; return this.render(); }
    if (type === 'quizMode') { this.state.quizMode = payload; this.setupQuizQueue(); return this.render(); }
    if (type === 'speak') return this.playAudio(payload, el.dataset.text || payload);
    if (type === 'repeatSpeak') return this.repeatSpeak(el.dataset.text, 3);
    if (type === 'mark') return this.markItem(payload, el.dataset.value);
    if (type === 'shift') return this.shiftCard(Number(payload));
    if (type === 'toggleMeaning') { el.closest('.card').querySelector('.ko')?.classList.toggle('hidden'); return; }
    if (type === 'search') return this.runSearch();
    if (type === 'jump') return this.jumpToItem(payload);
    if (type === 'bookmark') return this.toggleBookmark(payload);
    if (type === 'pickOption') return this.pickQuizOption(payload);
    if (type === 'flipResult') return this.flipQuizResult(payload);
    if (type === 'orderPick') return this.pickOrder(payload);
    if (type === 'orderSubmit') return this.submitOrder();
    if (type === 'matchPick') return this.matchPick(payload, el.dataset.side);
    if (type === 'startQuiz') { this.setupQuizQueue(); this.state.quiz.phase = 'playing'; return this.render(); }
    if (type === 'nextQuiz') return this.nextQuiz();
    if (type === 'reviewWrong') { this.state.quiz.queue = this.wrongAnswers.map((id) => this.findItem(id)).filter(Boolean); this.state.quiz.i = 0; this.state.quiz.score = 0; this.state.quiz.phase='playing'; return this.render(); }
    if (type === 'toggleKo') { this.appEl.querySelectorAll('.ko-line').forEach((k)=>k.classList.toggle('hidden')); return; }
    if (type === 'resetLocal') return this.resetLocal();
  }

  handleChange(action, el) {
    if (action === 'lesson') this.state.lessonId = el.value;
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

    const lessons = this.state.flat.lessons.map((l) => {
      const vocab = l.vocabCards?.length || 0;
      const sent = l.sentenceCards?.length || 0;
      const ids = [...(l.vocabCards || []).map((x) => x.id), ...(l.sentenceCards || []).map((x) => x.id)];
      const done = ids.filter((id) => this.progress[id]?.known).length;
      const p = ids.length ? Math.round((done / ids.length) * 100) : 0;
      return `<div class="card lesson-card fade" data-action="openLesson:${l.lessonId}">
        <div class="row"><span class="badge">${l.unitLabel}</span><span class="small">${l.titleKo}</span></div>
        <h3>${l.titleVi}</h3>
        <p class="small">목표: ${(l.goals || []).join(' · ')}</p>
        <p class="small">단어 ${vocab}개 · 문장 ${sent}개 · 진행률 ${p}%</p>
        <div class="progress"><span style="width:${p}%"></span></div>
      </div>`;
    }).join('');

    this.appEl.innerHTML = `<section class="fade">
      <div class="card notice">${this.state.message}</div>
      <div class="grid-2">
        <div class="card stat"><small>전체 진도</small><strong>${Math.round((known / Math.max(total,1)) * 100)}%</strong></div>
        <div class="card stat"><small>오늘 학습 수</small><strong>${this.todayCount()}개</strong></div>
        <div class="card stat"><small>정답률</small><strong>${rate}%</strong></div>
        <div class="card stat"><small>연속 느낌</small><strong>${Math.min(30, Math.floor(known / 3))}일 🔥</strong></div>
      </div>
      <div>${lessons}</div>
    </section>`;
  }

  renderStudy() {
    const lesson = this.currentLesson();
    if (!lesson) return this.renderError('레슨 데이터를 찾을 수 없습니다.');
    const tabs = ['vocab','sentence','dialogue','grammar','pronunciation'].map((m)=>`<button data-action="studyMode:${m}" class="${this.state.studyMode===m?'primary':''}">${({vocab:'단어장',sentence:'문장',dialogue:'회화',grammar:'문법',pronunciation:'발음'})[m]}</button>`).join('');
    let body = '';
    if (this.state.studyMode === 'vocab') body = this.renderVocab(lesson);
    if (this.state.studyMode === 'sentence') body = this.renderSentence(lesson);
    if (this.state.studyMode === 'dialogue') body = this.renderDialogue(lesson);
    if (this.state.studyMode === 'grammar') body = this.renderGrammar();
    if (this.state.studyMode === 'pronunciation') body = this.renderPronunciation(lesson);

    this.appEl.innerHTML = `<section class="fade">
      <div class="card">
        <label class="small">레슨 선택</label>
        <select data-change="lesson">${this.state.flat.lessons.map((l)=>`<option value="${l.lessonId}" ${l.lessonId===this.state.lessonId?'selected':''}>${l.unitLabel} · ${l.titleKo}</option>`).join('')}</select>
      </div>
      <div class="card controls">${tabs}</div>
      ${body}
    </section>`;
  }

  renderVocab(lesson) {
    const cards = lesson.vocabCards || [];
    const c = cards[this.state.cardIndex % Math.max(cards.length,1)];
    if (!c) return '<div class="card">단어가 없습니다.</div>';
    return `<article class="card fade">
      <span class="badge">${this.state.cardIndex + 1} / ${cards.length}</span>
      <div class="vi-big">${c.term}</div>
      <div class="ko ${this.settings.autoShowMeaning ? '' : 'hidden'}">${c.meaningKo}</div>
      ${c.example ? `<p class="small">예문: ${c.example}<br>${c.exampleMeaningKo || ''}</p>`:''}
      ${c.sourcePage ? `<span class="badge">p.${c.sourcePage}</span>` : ''}
      <div class="controls">
        <button class="primary" data-action="speak:${c.audioSrc || ''}" data-text="${c.term}">듣기</button>
        <button data-action="toggleMeaning">뜻 보기/숨기기</button>
        <button data-action="bookmark:${c.id}">${this.bookmarks.includes(c.id)?'북마크 해제':'북마크'}</button>
      </div>
      <div class="controls">
        <button class="good" data-action="mark:${c.id}" data-value="known">알아요</button>
        <button class="bad" data-action="mark:${c.id}" data-value="unknown">몰라요</button>
      </div>
      <div class="controls">
        <button data-action="shift:-1">◀ 이전</button><button data-action="shift:1">다음 ▶</button>
      </div>
    </article>`;
  }

  renderSentence(lesson) {
    const cards = lesson.sentenceCards || [];
    const c = cards[this.state.sentenceIndex % Math.max(cards.length,1)];
    if (!c) return '<div class="card">문장이 없습니다.</div>';
    return `<article class="card fade">
      <span class="badge">${this.state.sentenceIndex + 1} / ${cards.length}</span>
      <div class="vi-big">${c.textVi}</div>
      <div class="ko ${this.settings.autoShowMeaning ? '' : 'hidden'}">${c.textKo}</div>
      <div class="controls">
        <button class="primary" data-action="speak:${c.audioSrc || ''}" data-text="${c.textVi}">듣기</button>
        <button class="warn" data-action="repeatSpeak" data-text="${c.textVi}">3번 반복 듣기</button>
        <button data-action="toggleMeaning">해석 토글</button>
      </div>
      <div class="controls">
        <button class="good" data-action="mark:${c.id}" data-value="known">외움</button>
        <button class="bad" data-action="mark:${c.id}" data-value="difficult">어려움</button>
        <button data-action="shift:${c ? 1 : 0}">다음</button>
      </div>
    </article>`;
  }

  renderDialogue(lesson) {
    const list = lesson.dialogues || [];
    const d = list[this.state.dialogueIndex % Math.max(list.length,1)];
    if (!d) return '<div class="card">회화가 없습니다.</div>';
    const lines = (d.lines || []).map((line, i) => `<div class="dialogue-line ${i%2?'alt':''}"><strong>${line.speaker}</strong>: ${line.vi}<div class="ko-line small">${line.ko}</div>
      <button data-action="speak:" data-text="${line.vi}">한 줄 듣기</button></div>`).join('');
    return `<article class="card fade">
      <h3>${d.title}</h3>
      <p class="small">역할극 모드 말풍선</p>
      ${lines}
      <div class="controls">
        <button class="primary" data-action="speak:${d.audioSrc || ''}" data-text="${(d.lines||[]).map(x=>x.vi).join(' ')}">전체 듣기</button>
        <button data-action="toggleKo">한국어 숨기기/보이기</button>
      </div>
    </article>`;
  }

  renderGrammar() {
    const byLesson = this.state.flat.grammar.filter((g)=>this.state.grammarLessonFilter==='all' || g.lessonId===this.state.grammarLessonFilter);
    return `<article class="fade">
      <div class="card">
        <label class="small">레슨별 보기</label>
        <select data-change="grammarFilter"><option value="all">전체</option>${this.state.flat.lessons.map(l=>`<option value="${l.lessonId}" ${this.state.grammarLessonFilter===l.lessonId?'selected':''}>${l.unitLabel}</option>`).join('')}</select>
      </div>
      ${byLesson.map((g)=>`<div class="card"><span class="badge">${g.lessonTitle}</span><h3>${g.title}</h3><div class="vi-big" style="font-size:1.4rem">${g.pattern}</div>${g.sourcePage?`<span class="badge">p.${g.sourcePage}</span>`:''}</div>`).join('')}
    </article>`;
  }

  renderPronunciation(lesson) {
    const list = lesson.pronunciationTargets || [];
    const t = list[this.state.pronIndex % Math.max(list.length,1)];
    if (!t) return '<div class="card">발음 데이터가 없습니다.</div>';
    return `<article class="card fade">
      <span class="badge">성조/모음 타겟</span>
      <div class="vi-big">${t.text}</div>
      <p class="ko">${t.hintKo}</p>
      <div class="controls">
        <button class="primary" data-action="speak:${t.audioSrc || ''}" data-text="${t.text}">듣기</button>
        <button class="warn" data-action="repeatSpeak" data-text="${t.text}">3회 반복 듣기</button>
        <button data-action="shift:1">다음</button>
      </div>
    </article>`;
  }

  renderQuiz() {
    const modeList = [
      ['meaning','A 뜻 맞추기'],['vi','B 베트남어 맞추기'],['flip','C 카드 뒤집기'],['listen','D 듣기'],['order','E 순서 맞추기'],['tone','F 성조 구분'],['match','G 매칭'],['wrong','H 오답 복습']
    ];
    const chooser = `<div class="card controls">${modeList.map(([k,v])=>`<button data-action="quizMode:${k}" class="${this.state.quizMode===k?'primary':''}">${v}</button>`).join('')}</div>`;
    if (this.state.quizMode === 'wrong') {
      return this.appEl.innerHTML = `<section class="fade">${chooser}<div class="card"><p>저장된 오답: ${this.wrongAnswers.length}개</p><button class="primary" data-action="reviewWrong">오답만 다시 풀기</button></div>${this.renderQuizCore()}</section>`;
    }
    this.appEl.innerHTML = `<section class="fade">${chooser}${this.renderQuizCore()}</section>`;
  }

  renderQuizCore() {
    const q = this.state.quiz;
    if (q.phase !== 'playing') return `<div class="card"><p>퀴즈를 시작해보세요 🎉</p><button class="primary" data-action="startQuiz">시작</button></div>`;
    const item = q.queue[q.i];
    if (!item) {
      const total = q.queue.length || 1;
      const wrong = total - q.score;
      const rate = Math.round((q.score / total) * 100);
      return `<div class="card"><h3>결과</h3><p>정답 ${q.score} / 오답 ${wrong} / 정답률 ${rate}%</p><button class="primary" data-action="startQuiz">다시 풀기</button></div>`;
    }
    if (['meaning','vi','listen'].includes(this.state.quizMode)) return this.renderMcq(item);
    if (this.state.quizMode === 'flip') return this.renderFlip(item);
    if (this.state.quizMode === 'order') return this.renderOrder();
    if (this.state.quizMode === 'tone') return this.renderTone();
    if (this.state.quizMode === 'match') return this.renderMatch();
    return `<div class="card">준비 중</div>`;
  }

  renderMcq(item) {
    const isMeaning = this.state.quizMode === 'meaning' || this.state.quizMode === 'listen';
    const prompt = this.state.quizMode==='vi' ? (item.meaningKo || item.textKo) : (item.term || item.textVi);
    const answer = isMeaning ? (item.meaningKo || item.textKo) : (item.term || item.textVi);
    const pool = this.sampleOptions(answer, isMeaning ? 'ko':'vi');
    if (this.state.quizMode==='listen') setTimeout(()=>this.playAudio(item.audioSrc || '', item.term || item.textVi), 80);
    return `<div class="card">
      <p class="small">문항 ${this.state.quiz.i + 1}</p>
      <h3>${this.state.quizMode==='listen'?'듣고 고르기':prompt}</h3>
      ${pool.map(o=>`<button class="quiz-option" data-action="pickOption:${this.escapeAttr(o)}">${o}</button>`).join('')}
      <p>${this.state.quiz.feedback}</p>
      <button data-action="nextQuiz">다음</button>
    </div>`;
  }

  renderFlip(item) {
    return `<div class="card"><h3>${item.term || item.textVi}</h3><p class="small">먼저 스스로 떠올려보세요.</p>
      <button data-action="toggleMeaning">정답 보기</button>
      <div class="ko hidden">${item.meaningKo || item.textKo}</div>
      <div class="controls"><button class="good" data-action="flipResult:correct">맞음</button><button class="bad" data-action="flipResult:wrong">틀림</button></div></div>`;
  }

  renderOrder() {
    const seed = this.state.flat.seeds.find((s)=>s.type==='order-dialogue') || { answerSet: [] };
    if (!this.state.quiz.orderPool) this.state.quiz.orderPool = this.shuffle([...seed.answerSet]);
    const selected = this.state.quiz.orderSelected;
    return `<div class="card"><h3>순서 맞추기</h3><p class="small">아래 문장을 순서대로 탭하세요</p>
      ${(this.state.quiz.orderPool||[]).map(v=>`<button class="quiz-option" data-action="orderPick:${this.escapeAttr(v)}">${v}</button>`).join('')}
      <p>선택: ${selected.join(' → ')}</p>
      <button class="primary" data-action="orderSubmit">제출</button>
      <p>${this.state.quiz.feedback}</p>
    </div>`;
  }

  renderTone() {
    const seed = this.state.flat.seeds.find((s)=>s.type==='tone-identification');
    const arr = seed?.answerSet || ['ma','má','mà','mả','mã','mạ'];
    const ask = arr[Math.floor(Math.random()*arr.length)];
    return `<div class="card"><h3>성조 구분</h3><div class="vi-big">${ask}</div>
      <button class="primary" data-action="speak:" data-text="${ask}">듣기</button>
      <p class="small">동일한 성조를 고르세요</p>
      ${arr.map(v=>`<button class="quiz-option" data-action="pickOption:${this.escapeAttr(v)}">${v}</button>`).join('')}
      <p>${this.state.quiz.feedback}</p><button data-action="nextQuiz">다음</button></div>`;
  }

  renderMatch() {
    const seed = this.state.flat.seeds.find((s)=>['match-term','sound-match','weekday-match'].includes(s.type));
    const pairs = (seed?.answerSet || []).map((x)=>x.split('-'));
    if (!this.state.quiz.matchPairs) this.state.quiz.matchPairs = this.shuffle(pairs);
    const left = this.state.quiz.matchPairs.map((p)=>p[0]);
    const right = this.shuffle(this.state.quiz.matchPairs.map((p)=>p[1]));
    return `<div class="card"><h3>매칭 퀴즈</h3><p class="small">왼쪽 선택 후 오른쪽 선택</p>
      <div class="grid-2">
        <div>${left.map(v=>`<button class="quiz-option" data-side="left" data-action="matchPick:${this.escapeAttr(v)}">${v}</button>`).join('')}</div>
        <div>${right.map(v=>`<button class="quiz-option" data-side="right" data-action="matchPick:${this.escapeAttr(v)}">${v}</button>`).join('')}</div>
      </div>
      <p>${this.state.quiz.feedback}</p><button data-action="nextQuiz">다음</button></div>`;
  }

  renderSearch() {
    this.appEl.innerHTML = `<section class="fade">
      <div class="card"><input class="input" data-change="searchInput" value="${this.state.searchQuery}" placeholder="베트남어/한국어 검색 (예: khoe, khỏe)" />
      <button class="primary" data-action="search">검색</button></div>
      <div>${this.state.searchResults.map((r)=>`<div class="card list-item"><span class="badge">${r.lessonTitle}</span><h3>${r.term || r.textVi}</h3><p>${r.meaningKo || r.textKo || r.hintKo}</p><button data-action="jump:${r.id}">바로 학습</button></div>`).join('')}</div>
    </section>`;
  }

  renderBookmark() {
    const marked = this.bookmarks.map((id)=>this.findItem(id)).filter(Boolean);
    const difficult = Object.entries(this.progress).filter(([_,v])=>v.difficult).map(([id])=>this.findItem(id)).filter(Boolean);
    this.appEl.innerHTML = `<section class="fade"><div class="card"><h3>북마크 ${marked.length}</h3>${marked.map((m)=>`<div class="list-item">${m.term || m.textVi} · ${m.meaningKo || m.textKo}</div>`).join('') || '<p>없음</p>'}</div>
      <div class="card"><h3>어려운 항목 ${difficult.length}</h3>${difficult.map((m)=>`<div class="list-item">${m.term || m.textVi} · ${m.meaningKo || m.textKo}</div>`).join('') || '<p>없음</p>'}</div></section>`;
  }

  renderSettings() {
    const cnt = this.state.flat;
    this.appEl.innerHTML = `<section class="fade">
      <div class="card"><h3>설정</h3>
        <label>음성 속도 ${this.settings.speechRate.toFixed(2)}</label>
        <input type="range" min="0.6" max="1.2" step="0.05" value="${this.settings.speechRate}" data-change="speechRate" />
        <label><input type="checkbox" ${this.settings.autoShowMeaning?'checked':''} data-change="autoShowMeaning" /> 자동 뜻 보이기</label><br>
        <label><input type="checkbox" ${this.settings.autoPlay?'checked':''} data-change="autoPlay" /> 카드 넘김 자동 재생</label>
        <div class="controls"><button class="bad" data-action="resetLocal">학습기록 초기화</button></div>
      </div>
      <div class="card"><h3>JSON 로딩 상태</h3>
        <p class="small">경로: ${this.state.loadedPath}</p>
        <p class="small">lessons ${cnt.lessons.length}, vocab ${cnt.vocab.length}, sentence ${cnt.sentence.length}, dialogues ${cnt.dialogues.length}, grammar ${cnt.grammar.length}, pronunciation ${cnt.pronunciation.length}, quizSeeds ${cnt.seeds.length}</p>
      </div>
    </section>`;
  }

  setupQuizQueue() {
    const base = this.shuffle([...this.state.flat.vocab.slice(0, 30), ...this.state.flat.sentence.slice(0, 20)]).slice(0, 10);
    this.state.quiz = { ...this.state.quiz, queue: base, i: 0, score: 0, wrong: [], phase: 'ready', feedback: '', orderSelected: [], matchPair: [], orderPool: null, matchPairs: null };
  }

  pickQuizOption(value) {
    const item = this.state.quiz.queue[this.state.quiz.i];
    let answer = '';
    if (this.state.quizMode === 'vi') answer = item.term || item.textVi;
    else if (this.state.quizMode === 'tone') answer = value;
    else answer = item.meaningKo || item.textKo;
    const ok = this.state.quizMode === 'tone' ? true : value === answer;
    this.state.quiz.feedback = ok ? '정답! 🐳🎉' : '한 번 더 들으면 됩니다!';
    if (ok) this.state.quiz.score += 1;
    else {
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
    if (ok) this.state.quiz.score += 1;
    else this.wrongAnswers = [...new Set([...this.wrongAnswers, item.id])];
    this.saveLocal('wrongAnswers', this.wrongAnswers);
    this.nextQuiz();
  }

  pickOrder(text) {
    if (!this.state.quiz.orderSelected.includes(text)) this.state.quiz.orderSelected.push(text);
    this.render();
  }

  submitOrder() {
    const seed = this.state.flat.seeds.find((s)=>s.type==='order-dialogue');
    const ok = JSON.stringify(seed?.answerSet || []) === JSON.stringify(this.state.quiz.orderSelected);
    this.state.quiz.feedback = ok ? '순서가 완벽해요! 🎉' : '거의 맞았어요. 다시!' ;
    if (ok) this.state.quiz.score += 1;
    this.render();
  }

  matchPick(value, side) {
    this.state.quiz.matchPair = this.state.quiz.matchPair || [];
    this.state.quiz.matchPair.push({ side, value });
    if (this.state.quiz.matchPair.length >= 2) {
      const [a, b] = this.state.quiz.matchPair.slice(-2);
      const joined = `${a.value}-${b.value}`;
      const reverse = `${b.value}-${a.value}`;
      const seed = this.state.flat.seeds.find((s)=>['match-term','sound-match','weekday-match'].includes(s.type));
      const ok = (seed?.answerSet || []).includes(joined) || (seed?.answerSet || []).includes(reverse);
      this.state.quiz.feedback = ok ? '매칭 성공 🐳' : '아쉽지만 다시!';
      if (ok) this.state.quiz.score += 1;
    }
    this.render();
  }

  nextQuiz() {
    this.state.quiz.i += 1;
    this.state.quiz.feedback = '';
    this.state.quiz.orderSelected = [];
    this.render();
  }

  markItem(id, value, rerender = true) {
    const prev = this.progress[id] || { correctCount: 0, wrongCount: 0 };
    if (value === 'known') prev.known = true;
    if (value === 'unknown') prev.known = false;
    if (value === 'difficult') prev.difficult = true;
    if (value === 'correct') prev.correctCount = (prev.correctCount || 0) + 1;
    if (value === 'wrong') prev.wrongCount = (prev.wrongCount || 0) + 1;
    prev.lastStudiedAt = new Date().toISOString();
    this.progress[id] = prev;
    this.saveLocal('progress', this.progress);
    if (rerender) this.render();
  }

  shiftCard(delta) {
    const mode = this.state.studyMode;
    if (mode === 'vocab') this.state.cardIndex = Math.max(0, this.state.cardIndex + delta);
    if (mode === 'sentence') this.state.sentenceIndex = Math.max(0, this.state.sentenceIndex + delta);
    if (mode === 'dialogue') this.state.dialogueIndex = Math.max(0, this.state.dialogueIndex + delta);
    if (mode === 'pronunciation') this.state.pronIndex = Math.max(0, this.state.pronIndex + delta);
    if (this.settings.autoPlay) {
      const item = this.currentCardItem();
      if (item) this.playAudio(item.audioSrc || '', item.term || item.textVi || item.text);
    }
    this.render();
  }

  toggleBookmark(id) {
    this.bookmarks = this.bookmarks.includes(id) ? this.bookmarks.filter((x)=>x!==id) : [...this.bookmarks, id];
    this.saveLocal('bookmarks', this.bookmarks);
    this.render();
  }

  runSearch() {
    const q = this.normalize(this.state.searchQuery.trim());
    const pool = [...this.state.flat.vocab, ...this.state.flat.sentence];
    this.state.searchResults = pool.filter((i) => {
      const vi = this.normalize(i.term || i.textVi || '');
      const ko = (i.meaningKo || i.textKo || '').toLowerCase();
      return vi.includes(q) || ko.includes(this.state.searchQuery.toLowerCase());
    }).slice(0, 50);
    this.render();
  }

  jumpToItem(id) {
    const lesson = this.state.flat.lessons.find((l)=>[...(l.vocabCards||[]),...(l.sentenceCards||[])].some((x)=>x.id===id));
    if (!lesson) return;
    this.state.lessonId = lesson.lessonId;
    if ((lesson.vocabCards || []).some((x)=>x.id===id)) {
      this.state.studyMode='vocab';
      this.state.cardIndex=(lesson.vocabCards||[]).findIndex((x)=>x.id===id);
    } else {
      this.state.studyMode='sentence';
      this.state.sentenceIndex=(lesson.sentenceCards||[]).findIndex((x)=>x.id===id);
    }
    this.state.tab='study';
    this.render();
  }

  async playAudio(audioSrc, textFallback) {
    const src = (audioSrc || '').replace(/^\//, './');
    if (src) {
      try {
        const a = new Audio(src);
        await a.play();
        return;
      } catch (_) {}
    }
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(textFallback || 'xin chào');
      u.lang = 'vi-VN';
      u.rate = this.settings.speechRate;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } else {
      alert('이 브라우저는 음성 기능을 지원하지 않습니다.');
    }
  }

  repeatSpeak(text, n) {
    let i = 0;
    const tick = () => {
      if (i >= n) return;
      i += 1;
      this.playAudio('', text);
      setTimeout(tick, 1300);
    };
    tick();
  }

  normalize(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  sampleOptions(answer, type) {
    const pool = type==='ko'
      ? [...new Set([...this.state.flat.vocab.map((x)=>x.meaningKo), ...this.state.flat.sentence.map((x)=>x.textKo)].filter(Boolean))]
      : [...new Set([...this.state.flat.vocab.map((x)=>x.term), ...this.state.flat.sentence.map((x)=>x.textVi)].filter(Boolean))];
    const picks = this.shuffle(pool.filter((x)=>x!==answer)).slice(0,3);
    return this.shuffle([answer, ...picks]);
  }

  currentLesson() { return this.state.flat.lessons.find((l)=>l.lessonId===this.state.lessonId); }
  currentCardItem() {
    const lesson = this.currentLesson();
    if (!lesson) return null;
    if (this.state.studyMode==='vocab') return lesson.vocabCards[this.state.cardIndex];
    if (this.state.studyMode==='sentence') return lesson.sentenceCards[this.state.sentenceIndex];
    if (this.state.studyMode==='pronunciation') return lesson.pronunciationTargets[this.state.pronIndex];
    return null;
  }
  findItem(id) { return [...this.state.flat.vocab, ...this.state.flat.sentence, ...this.state.flat.pronunciation].find((x)=>x.id===id); }

  todayCount() {
    const d = new Date().toISOString().slice(0,10);
    return Object.values(this.progress).filter((p)=>(p.lastStudiedAt || '').startsWith(d)).length;
  }

  resetStudyIndexes() { this.state.cardIndex = this.state.sentenceIndex = this.state.dialogueIndex = this.state.pronIndex = 0; }
  resetLocal() {
    ['progress','wrongAnswers','bookmarks','settings'].forEach((k)=>localStorage.removeItem(this.storagePrefix + k));
    this.progress = {}; this.wrongAnswers=[]; this.bookmarks=[]; this.settings={ ...this.state.settings };
    this.render();
  }

  loadLocal(key, fallback) {
    try { return JSON.parse(localStorage.getItem(this.storagePrefix + key)) ?? fallback; }
    catch { return fallback; }
  }
  saveLocal(key, value) { localStorage.setItem(this.storagePrefix + key, JSON.stringify(value)); }
  shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }
  escapeAttr(s='') { return String(s).replace(/"/g, '&quot;'); }

  renderLoading(msg) { this.appEl.innerHTML = `<div class="card">${msg}</div>`; }
  renderError(msg) { this.appEl.innerHTML = `<div class="card"><h3>앗! 문제가 생겼어요.</h3><p>${msg}</p></div>`; }
}

window.addEventListener('DOMContentLoaded', () => new VietnameseA1App());

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
