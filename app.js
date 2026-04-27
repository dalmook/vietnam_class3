const PRON_KO_MAP = {
  'xin chào': '신 짜오',
  'chào bạn': '짜오 반',
  'chào buổi sáng': '짜오 부오이 상',
  'chào buổi trưa': '짜오 부오이 쯔어',
  'chào buổi tối': '짜오 부오이 또이',
  'tạm biệt': '땀 비엣',
  'hẹn gặp lại': '헨 갑 라이',
  'cảm ơn': '깜 언',
  'cảm ơn nhiều': '깜 언 니에우',
  'xin lỗi': '신 로이',
  'không sao': '콩 사오',
  'vâng': '벙',
  'dạ': '야',
  'không': '콩',
  'được rồi': '드억 조이',
  'đúng rồi': '둥 조이',
  'sai rồi': '사이 조이',
  'tôi': '또이',
  'bạn': '반',
  'anh': '아잉',
  'chị': '찌',
  'em': '엠',
  'chúng tôi': '쭝 또이',
  'họ': '허',
  'tên': '뗀',
  'họ tên': '허 뗀',
  'quốc tịch': '꾸억 띡',
  'nghề nghiệp': '응에 응이엡',
  'sinh viên': '신 비엔',
  'giáo viên': '자오 비엔',
  'nhân viên': '년 비엔',
  'công ty': '꽁 띠',
  'đồng nghiệp': '동 응이엡',
  'quản lý': '꽌 리',
  'trưởng nhóm': '쯔엉 념',
  'thực tập sinh': '특 떱 신',
  'địa chỉ': '디아 찌',
  'số điện thoại': '소 디엔 토아이',
  'email': '이메일',
  'quê quán': '꿰 꾸안',
  'tuổi': '뚜오이',
  'độc thân': '돋 턴',
  'gia đình': '자 딘',
  'bố': '보',
  'mẹ': '메',
  'anh trai': '아잉 짜이',
  'chị gái': '찌 가이',
  'em trai': '엠 짜이',
  'em gái': '엠 가이',
  'con trai': '꼰 짜이',
  'con gái': '꼰 가이',
  'vợ': '버',
  'chồng': '쫑',
  'nhà': '냐',
  'căn hộ': '깐 허',
  'phòng khách': '퐁 캇',
  'phòng ngủ': '퐁 응우',
  'nhà bếp': '냐 뱁',
  'nhà tắm': '냐 땀',
  'ban công': '반 꽁',
  'thang máy': '탕 마이',
  'bãi đỗ xe': '바이 도 세',
  'hàng xóm': '항 솜',
  'khu dân cư': '쿠 전 끄',
  'an toàn': '안 또안',
  'yên tĩnh': '이엔 띵',
  'tiện nghi': '띠엔 응이',
  'tiền thuê nhà': '띠엔 투에 냐',
  'trang trí': '쯩 찌',
  'đi làm': '디 람',
  'đi học': '디 혹',
  'về nhà': '베 냐',
  'dậy sớm': '저이 섬',
  'ăn sáng': '안 상',
  'ăn trưa': '안 쯔어',
  'ăn tối': '안 또이',
  'uống nước': '우옹 느억',
  'uống cà phê': '우옹 카페',
  'nấu ăn': '너우 안',
  'làm việc nhà': '람 비엑 냐',
  'xem tin tức': '셈 띤 뜩',
  'đi siêu thị': '디 시에우 티',
  'nghỉ trưa': '응이 쯔어',
  'đi ngủ': '디 응우',
  'bận': '번',
  'rảnh': '라인',
  'hôm nay': '홈 나이',
  'ngày mai': '응아이 마이',
  'hôm qua': '홈 꾸아',
  'sở thích': '서 팃',
  'đọc sách': '독 삭',
  'xem phim': '셈 핌',
  'nghe nhạc': '응에 냑',
  'chơi game': '쩌이 겜',
  'chụp ảnh': '춥 아잉',
  'vẽ tranh': '베 짠',
  'trồng cây': '쫑 꺼이',
  'đánh cầu lông': '다잉 꺼우 롱',
  'tập yoga': '떱 요가',
  'đi bộ': '디 보',
  'chạy bộ': '짜이 보',
  'thư giãn': '트 지안',
  'tham gia': '탐 자',
  'du lịch': '주 릭',
  'sân bay': '선 바이',
  'khách sạn': '칵 산',
  'nhà ga': '냐 가',
  'bến xe': '벤 세',
  'xe buýt': '세 부잇',
  'taxi': '택시',
  'bản đồ': '반 도',
  'bản chỉ dẫn': '반 찌 전',
  'hành lý': '하잉 리',
  'đặt phòng': '닷 퐁',
  'vé': '베',
  'đường': '드엉',
  'đường một chiều': '드엉 못 찌에우',
  'giao thông': '자오 통',
  'ngã ba': '응아 바',
  'ngã tư': '응아 뜨',
  'đi thẳng': '디 탕',
  'rẽ trái': '제 짜이',
  'rẽ phải': '제 파이',
  'qua đường': '꾸아 드엉',
  'gần': '건',
  'xa': '싸',
  'thứ hai': '트 하이',
  'thứ ba': '트 바',
  'thứ tư': '트 뜨',
  'thứ năm': '트 남',
  'thứ sáu': '트 사우',
  'thứ bảy': '트 버이',
  'chủ nhật': '쭈 녓',
  'một': '못',
  'hai': '하이',
  'ba': '바',
  'bốn': '본',
  'năm': '남',
  'sáu': '사우',
  'bảy': '버이',
  'tám': '땀',
  'chín': '찐',
  'mười': '므어이',
  'mấy giờ': '머이 저',
  'bây giờ': '버이 저',
  'sáng': '상',
  'chiều': '찌에우',
  'tối': '또이',
  'rất tốt': '젓 똣',
  'bình thường': '빈 트엉',
  'khá tốt': '카 똣',
  'vui': '부이',
  'buồn': '부온',
  'mệt': '멧',
  'khỏe': '퀘',
  'đói': '도이',
  'no': '노',
  'nóng': '농',
  'lạnh': '란',
  'đẹp': '뎁',
  'xấu': '서우',
  'nhanh': '냐잉',
  'chậm': '쩜',
  'dễ': '예',
  'khó': '코',
  'đắt': '닷',
  'rẻ': '제',
  'mới': '머이',
  'cũ': '꾸',
  'xin chào bạn khỏe không': '신 짜오 반 퀘 콩',
  'tôi khỏe cảm ơn': '또이 퀘 깜 언',
  'rất vui được gặp bạn': '젓 부이 드억 갑 반',
  'cho tôi hỏi': '쪼 또이 허이',
  'bạn tên là gì': '반 뗀 라 지',
  'tên tôi là': '뗀 또이 라',
  'tôi là người hàn quốc': '또이 라 응우어이 한 꾸억',
  'bạn làm nghề gì': '반 람 응에 지',
  'tôi là nhân viên văn phòng': '또이 라 년 비엔 반 퐁',
  'địa chỉ của bạn ở đâu': '디아 찌 꾸아 반 어 다우',
  'số điện thoại của bạn là gì': '소 디엔 토아이 꾸아 반 라 지',
  'rất mong được hợp tác': '젓 몽 드억 헙 딱',
  'buổi sáng tôi dậy lúc sáu giờ': '부오이 상 또이 저이 룩 사우 저',
  'tôi thường đi làm lúc tám giờ': '또이 트엉 디 람 룩 땀 저',
  'sau giờ làm tôi học tiếng việt': '사우 저 람 또이 혹 띠엥 비엣',
  'tối nay tôi bận': '또이 나이 또이 번',
  'ngày nào tôi cũng học từ vựng': '응아이 나오 또이 꿍 혹 뜨 븡',
  'cuối tuần tôi nghỉ ngơi': '꾸오이 뚜언 또이 응이 응어이',
  'sở thích của bạn là gì': '서 팃 꾸아 반 라 지',
  'tôi thích nghe nhạc': '또이 팃 응에 냑',
  'tôi thích xem phim': '또이 팃 셈 핌',
  'tôi thích chạy bộ': '또이 팃 짜이 보',
  'khi rảnh tôi đọc sách': '키 라인 또이 독 삭',
  'nghe nhạc giúp tôi thư giãn': '응에 냑 줍 또이 트 지안',
  'xin lỗi bưu điện ở đâu': '신 로이 부우 디엔 어 다우',
  'bạn đi thẳng rồi rẽ trái': '반 디 탕 조이 제 짜이',
  'rẽ phải ở ngã tư': '제 파이 어 응아 뜨',
  'từ đây đến chợ bao xa': '뜨 다이 덴 저 바오 싸',
  'tôi muốn đặt phòng hai đêm': '또이 무온 닷 퐁 하이 뎀',
  'xe buýt số năm đi đến chợ bến thành': '세 부잇 소 남 디 덴 저 벤 타잉',
  'tôi sống ở căn hộ gần công viên': '또이 송 어 깐 허 건 꽁 비엔',
  'nhà tôi có hai phòng ngủ': '냐 또이 꼬 하이 퐁 응우',
  'khu phố của tôi yên tĩnh': '쿠 포 꾸아 또이 이엔 띵',
  'gần nhà có siêu thị': '건 냐 꼬 시에우 티',
  'tôi thích trang trí phòng': '또이 팃 쯩 찌 퐁',
  'khu này an toàn': '쿠 나이 안 또안',
  'xin mở cửa': '신 머 꾸어',
  'xin đóng cửa': '신 동 꾸어',
  'xin nói chậm': '신 노이 쩜',
  'xin nói lại': '신 노이 라이',
  'xin viết lại': '신 비엣 라이',
  'xin chờ một chút': '신 처 못 쭛',
  'xin bắt đầu': '신 밧 더우',
  'xin kết thúc': '신 껫 툭',
  'xin đi thôi': '신 디 토이',
  'xin ngồi xuống': '신 응오이 수옹',
  'vui lòng mở cửa': '부이 롱 머 꾸어',
  'vui lòng đóng cửa': '부이 롱 동 꾸어',
  'vui lòng nói chậm': '부이 롱 노이 쩜',
  'vui lòng nói lại': '부이 롱 노이 라이',
  'vui lòng viết lại': '부이 롱 비엣 라이',
  'vui lòng chờ một chút': '부이 롱 처 못 쭛',
  'vui lòng bắt đầu': '부이 롱 밧 더우',
  'vui lòng kết thúc': '부이 롱 껫 툭',
  'vui lòng đi thôi': '부이 롱 디 토이',
  'vui lòng ngồi xuống': '부이 롱 응오이 수옹',
  'làm ơn mở cửa': '람 언 머 꾸어',
  'làm ơn đóng cửa': '람 언 동 꾸어',
  'làm ơn nói chậm': '람 언 노이 쩜',
  'làm ơn nói lại': '람 언 노이 라이',
  'làm ơn viết lại': '람 언 비엣 라이',
  'làm ơn chờ một chút': '람 언 처 못 쭛',
  'làm ơn bắt đầu': '람 언 밧 더우',
  'làm ơn kết thúc': '람 언 껫 툭',
  'làm ơn đi thôi': '람 언 디 토이',
  'làm ơn ngồi xuống': '람 언 응오이 수옹',
  'cho tôi mở cửa': '쪼 또이 머 꾸어',
  'cho tôi đóng cửa': '쪼 또이 동 꾸어',
  'cho tôi nói chậm': '쪼 또이 노이 쩜',
  'cho tôi nói lại': '쪼 또이 노이 라이',
  'cho tôi viết lại': '쪼 또이 비엣 라이',

  'trời ơi': '쪄이 어이',
  'ôi chao': '오이 짜오',
  'chao ôi': '짜오 오이',
  'ây da': '어이 자',
  'ái chà': '아이 짜',
  'a lô': '아 로',
  'ủa': '우아',
  'hả': '하',
  'ơ kìa': '어 끼아',
  'ôi thôi': '오이 토이',
  'than ôi': '탄 오이',
  'nhé': '녜',
  'nhỉ': '니',
  'à': '아',
  'ạ': '아',};

let deferredInstallPrompt = null;

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
      quizLessonFilter: null,
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
      revealMeaning: true,
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
        options: [],
        optionKey: '',
        matchingRound: null
      },
      settings: { speechRate: 0.95, autoShowMeaning: true, autoPlay: false }
    };
    this.settings = { ...this.state.settings, ...this.loadLocal('settings', {}) };
    this.healTried = false;
    this.audioUnlocked = false;
    this.effect = null;
    this.sfxCtx = null;
    this.swReloading = false;
    this.pendingSWRegistration = null;
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    this.ensureStorageHealth();

    this.bindGlobalEvents();
    this.setupPwaUI();
    this.bindInstallPromptEvents();
    this.setupServiceWorkerRegistration();
    this.bindNetworkStatusEvents();
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
      this.state.quizLessonFilter = data.lessons?.[0]?.lessonId || 'all';
      this.render();
    } catch (e) {
      const healed = await this.tryRecoverFromCacheIssue();
      if (healed) return;
      this.renderError(`JSON 로딩 실패: ${e.message}. 설정 > 앱 캐시 초기화로 서비스워커/캐시를 정리해보세요.`, true);
    }
  }

  async fetchJson() {
    const paths = [
      './vietnamese_a1_to_opic_im1_starter.json'
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
      this.ensureAudioUnlocked();
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
      node.addEventListener('click', () => {
        this.ensureAudioUnlocked();
        this.handleAction(node.dataset.action, node);
      });
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
    this.injectFloatingUI();
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
    if (type === 'toggleCardReveal') { this.state.revealMeaning = !this.state.revealMeaning; return this.render(); }
    if (type === 'toggleKo') return this.appEl.querySelectorAll('.ko-line').forEach((x) => x.classList.toggle('hidden'));
    if (type === 'search') return this.runSearch();
    if (type === 'jump') return this.jumpToItem(payload);
    if (type === 'speak') return this.playAudio(payload, el.dataset.text || 'xin chào');
    if (type === 'repeatSpeak') return this.repeatSpeak({ text: el.dataset.text, audioSrc: el.dataset.audio || '' }, 3);
    if (type === 'startQuiz') {
      this.setupQuizQueue();
      this.state.quiz.phase = 'playing';
      this.render();
      this.playListenPromptIfNeeded();
      return;
    }
    if (type === 'exitQuiz') { this.state.quiz.phase = 'ready'; this.state.quiz.feedback = ''; return this.render(); }
    if (type === 'nextQuiz') return this.nextQuiz();
    if (type === 'pickOption') return this.pickQuizOption(payload);
    if (type === 'matchPick') return this.matchPick(payload, el.dataset.side);
    if (type === 'reviewWrong') return this.startWrongReview();
    if (type === 'recoverCache') return this.recoverAndReload();
    if (type === 'audioTest') return this.playAudio('', 'xin chào, đây là kiểm tra âm thanh');
    if (type === 'resetLocal') return this.resetLocal();
  }

  handleChange(action, el) {
    if (action === 'lesson') { this.state.lessonId = el.value; this.resetStudyIndexes(); }
    if (action === 'quizLesson') this.state.quizLessonFilter = el.value;
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
    const tabs = ['vocab', 'sentence', 'dialogue', 'grammar', 'pronunciation']
      .map((m) => `<button data-action="studyMode:${m}" class="mode-pill ${this.state.studyMode === m ? 'active' : ''}">${({ vocab: '단어장', sentence: '문장', dialogue: '회화', grammar: '문법', pronunciation: '발음' })[m]}</button>`)
      .join('');

    let body = '';
    if (this.state.studyMode === 'vocab') body = this.renderVocab(lesson);
    if (this.state.studyMode === 'sentence') body = this.renderSentence(lesson);
    if (this.state.studyMode === 'dialogue') body = this.renderDialogue(lesson);
    if (this.state.studyMode === 'grammar') body = this.renderGrammar();
    if (this.state.studyMode === 'pronunciation') body = this.renderPronunciation(lesson);

    this.appEl.innerHTML = `<section class="fade">
      <div class="card study-toolbar">
        <div class="lesson-compact-select">
          <label class="small">레슨</label>
          <select data-change="lesson">${this.state.flat.lessons.map((l) => `<option value="${l.lessonId}" ${l.lessonId === this.state.lessonId ? 'selected' : ''}>${l.unitLabel} · ${l.titleKo}</option>`).join('')}</select>
        </div>
        <div class="mode-pills">${tabs}</div>
      </div>
      ${body}
    </section>`;
  }

  renderVocab(lesson) {
    const cards = lesson.vocabCards || [];
    if (!cards.length) return '<div class="card">단어가 없습니다.</div>';
    const idx = this.clampIndex(this.state.cardIndex, cards.length);
    this.state.cardIndex = idx;
    const c = cards[idx];
    const stat = this.progress[c.id] || {};
    const show = this.state.revealMeaning;
    const pronGuide = this.renderPronGuide(c, c.term);
    const exampleSpeakBtn = show && c.example
      ? `<button class="example-play-btn" type="button" data-action="speak:" data-text="${this.escapeAttr(c.example)}" aria-label="예문 듣기" onclick="event.stopPropagation()">▶</button>`
      : '';
    return `<article class="card fade study-card">
      <div class="row card-top">
        <div class="row compact-card-meta"><span class="badge">${idx + 1} / ${cards.length}</span>${c.sourcePage ? `<span class="badge">p.${c.sourcePage}</span>` : ''}</div>
        <div class="icon-actions">
          <button class="icon-btn ${stat.known ? 'active' : ''}" aria-label="알아요" data-action="mark:${c.id}" data-value="known">✅</button>
          <button class="icon-btn ${stat.known === false ? 'active' : ''}" aria-label="몰라요" data-action="mark:${c.id}" data-value="unknown">❓</button>
          <button class="icon-btn ${this.bookmarks.includes(c.id) ? 'active' : ''}" aria-label="북마크" data-action="bookmark:${c.id}">⭐</button>
        </div>
      </div>
      <div class="card-tap-zone study-card-body" data-action="toggleCardReveal">
        <div class="vi-big">${c.term}</div>
        <div class="pron-tip ${show ? '' : 'hidden'}">뜻: ${c.meaningKo}</div>
        <div class="${show ? '' : 'hidden'}">${pronGuide}</div>
        ${show && c.example ? `<div class="example-fold" onclick="event.stopPropagation()">
          <div class="example-head">예문 보기 ${exampleSpeakBtn}</div>
          <p class="small">${c.example}<br>${c.exampleMeaningKo || ''}</p>
        </div>` : ''}
        <p class="small tap-hint">${show ? '카드를 탭하면 뜻을 숨길 수 있어요' : '카드를 탭하면 뜻이 보여요'}</p>
      </div>
      <div class="audio-button-grid audio-controls study-card-actions">
        <button class="audio-square-btn primary" data-action="speak:${c.audioSrc || ''}" data-text="${c.term}">
          <span class="audio-icon">🔊</span>
          <span>듣기</span>
        </button>
        <button class="audio-square-btn" data-action="repeatSpeak:${c.audioSrc || ''}" data-text="${c.term}" data-audio="${c.audioSrc || ''}">
          <span class="audio-icon">🔁</span>
          <span>3회</span>
        </button>
      </div>
      <div class="controls nav-controls"><button data-action="shift:-1">◀ 이전</button><button data-action="shift:1">다음 ▶</button></div>
    </article>`;
  }

  renderSentence(lesson) {
    const cards = lesson.sentenceCards || [];
    if (!cards.length) return '<div class="card">문장이 없습니다.</div>';
    const idx = this.clampIndex(this.state.sentenceIndex, cards.length);
    this.state.sentenceIndex = idx;
    const c = cards[idx];
    const stat = this.progress[c.id] || {};
    const show = this.state.revealMeaning;
    const pronGuide = this.renderPronGuide(c, c.textVi, { compact: true });
    return `<article class="card fade study-card">
      <div class="row card-top">
        <div class="row compact-card-meta"><span class="badge">${idx + 1} / ${cards.length}</span>${c.sourcePage ? `<span class="badge">p.${c.sourcePage}</span>` : ''}</div>
        <div class="icon-actions">
          <button class="icon-btn ${stat.known ? 'active' : ''}" aria-label="외움" data-action="mark:${c.id}" data-value="known">✅</button>
          <button class="icon-btn ${stat.difficult ? 'active' : ''}" aria-label="어려움" data-action="mark:${c.id}" data-value="difficult">🔥</button>
          <button class="icon-btn ${this.bookmarks.includes(c.id) ? 'active' : ''}" aria-label="북마크" data-action="bookmark:${c.id}">⭐</button>
        </div>
      </div>
      <div class="card-tap-zone study-card-body" data-action="toggleCardReveal">
        <div class="vi-big">${c.textVi}</div>
        <div class="pron-tip ${show ? '' : 'hidden'}">뜻: ${c.textKo}</div>
        <div class="${show ? '' : 'hidden'}">${pronGuide}</div>
        <p class="small tap-hint">${show ? '카드를 탭하면 해석을 숨깁니다' : '카드를 탭하면 해석이 보여요'}</p>
      </div>
      <div class="audio-button-grid audio-controls study-card-actions">
        <button class="audio-square-btn primary" data-action="speak:${c.audioSrc || ''}" data-text="${c.textVi}">
          <span class="audio-icon">🔊</span>
          <span>듣기</span>
        </button>
        <button class="audio-square-btn" data-action="repeatSpeak:${c.audioSrc || ''}" data-text="${c.textVi}" data-audio="${c.audioSrc || ''}">
          <span class="audio-icon">🔁</span>
          <span>3회</span>
        </button>
      </div>
      <div class="controls nav-controls"><button data-action="shift:-1">◀ 이전</button><button data-action="shift:1">다음 ▶</button></div>
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
    const fallbackHint = t.hintKo ? `<p class="ko">${this.escapeHtml(t.hintKo)}</p>` : '';
    const hasRomanizedPron = /[A-Za-zÀ-ỹà-ỹ]/.test(t.pronKo || '');
    const pronBlocks = [
      ['발음 느낌', t.pronKo && !hasRomanizedPron ? t.pronKo : this.hangulPronNatural(t.text), 'pron-main'],
      ['입모양', t.mouthKo, 'pron-note'],
      ['성조/억양', t.toneKo, 'pron-note']
    ].filter(([, content]) => content);
    return `<article class="card fade study-card">
      <span class="badge">성조/모음 타겟 ${idx + 1}/${list.length}</span>
      <div class="vi-big">${t.text}</div>
      ${fallbackHint}
      <div class="pron-target-grid">
        ${pronBlocks.map(([label, content, klass]) => `<div class="pron-info-card ${klass}"><div class="pron-label">${label}</div><div>${this.escapeHtml(content)}</div></div>`).join('')}
      </div>
      <div class="audio-button-grid audio-controls study-card-actions">
        <button class="audio-square-btn primary" data-action="speak:${t.audioSrc || ''}" data-text="${t.text}">
          <span class="audio-icon">🔊</span>
          <span>듣기</span>
        </button>
        <button class="audio-square-btn" data-action="repeatSpeak:${t.audioSrc || ''}" data-text="${t.text}" data-audio="${t.audioSrc || ''}">
          <span class="audio-icon">🔁</span>
          <span>3회</span>
        </button>
      </div>
      <div class="controls nav-controls"><button data-action="shift:-1">◀ 이전</button><button data-action="shift:1">다음 ▶</button></div>
    </article>`;
  }

  renderQuiz() {
    const modes = [['meaning', 'A 뜻 맞추기'], ['vi', 'B 베트남어 맞추기'], ['listen', 'C 듣기'], ['match', 'D 매칭'], ['wrong', 'E 오답복습']];
    if (this.state.quiz.phase === 'playing') {
      this.appEl.innerHTML = `<section class="fade match-screen-wrap">${this.renderMatch()}</section>`;
      return;
    }
    const chooser = `<div class="card controls">${modes.map(([k, v]) => `<button data-action="quizMode:${k}" class="${this.state.quizMode === k ? 'primary' : ''}">${v}</button>`).join('')}</div>`;
    const filterCard = `<div class="card"><label class="small">퀴즈 범위</label><select data-change="quizLesson"><option value="all" ${this.state.quizLessonFilter==='all'?'selected':''}>전체 레슨 통합</option>${this.state.flat.lessons.map((l)=>`<option value="${l.lessonId}" ${this.state.quizLessonFilter===l.lessonId?'selected':''}>${l.unitLabel} · ${l.titleKo}</option>`).join('')}</select></div>`;
    const hero = this.renderQuizHero();
    if (this.state.quizMode === 'wrong') {
      this.appEl.innerHTML = `<section class="fade">${chooser}${filterCard}${hero}<div class="card"><p>저장된 오답 ${this.wrongAnswers.length}개</p><button class="primary" data-action="reviewWrong">오답만 다시 풀기</button></div>${this.renderQuizCore()}</section>`;
      return;
    }
    this.appEl.innerHTML = `<section class="fade">${chooser}${filterCard}${hero}${this.renderQuizCore()}</section>`;
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
    if (this.state.quizMode === 'match') return this.renderMatch();
    return '<div class="card">퀴즈 준비 중</div>';
  }

  renderMcq(item) {
    const isMeaning = this.state.quizMode === 'meaning' || this.state.quizMode === 'listen';
    const prompt = this.state.quizMode === 'vi' ? (item.meaningKo || item.textKo) : (item.term || item.textVi);
    const answer = isMeaning ? (item.meaningKo || item.textKo) : (item.term || item.textVi);
    const optionType = isMeaning ? 'ko' : 'vi';
    const optionKey = `${this.state.quiz.i}:${this.state.quizMode}:${item.id || ''}:${answer}`;
    if (this.state.quiz.optionKey !== optionKey || !Array.isArray(this.state.quiz.options) || !this.state.quiz.options.length) {
      this.state.quiz.options = this.sampleOptions(answer, optionType);
      this.state.quiz.optionKey = optionKey;
    }
    const options = this.state.quiz.options;
    const pronunciation = item.term || item.textVi;
    return `<div class="match-stage">
      <div class="match-top">
        <button class="match-close" data-action="exitQuiz" aria-label="퀴즈 종료">✕</button>
        <div class="match-progress"><span style="width:${Math.round(((this.state.quiz.i) / Math.max(this.state.quiz.queue.length, 1)) * 100)}%"></span></div>
        <button data-action="speak:${item.audioSrc || ''}" data-text="${pronunciation}">🔊</button>
      </div>
      <h2 class="match-title">${this.state.quizMode === 'listen' ? '먼저 듣고 정답을 고르세요' : prompt}</h2>
      <p class="small match-sub">정답 시 +10 XP · 연속 정답 보너스 +2 XP</p>
      <div class="match-grid single-col"><div class="match-col option-col">${options.map((o) => `<button class="quiz-option match-option ${this.state.quiz.picked === o ? 'choice-selected' : ''}" data-action="pickOption:${this.escapeAttr(o)}" ${this.state.quiz.answered ? 'disabled' : ''}>${o}</button>`).join('')}</div></div>
      <div class="match-bottom">
        <p class="quiz-feedback">${this.state.quiz.feedback}</p>
        <button class="primary match-confirm" data-action="nextQuiz" ${this.state.quiz.answered ? '' : 'disabled'}>확인</button>
      </div>
    </div>`;
  }

  renderMatch() {
    if (this.state.quizMode !== 'match') {
      const item = this.state.quiz.queue[this.state.quiz.i];
      return item ? this.renderMcq(item) : '';
    }
    const round = this.getOrCreateMatchingRound();
    const leftButtons = round.leftOrder.map((card) => {
      const selected = round.selectedLeftId === card.id;
      const matched = round.matchedIds.includes(card.id);
      return `<button class="quiz-option match-option ${selected ? 'choice-selected' : ''} ${matched ? 'match-done' : ''}" data-side="left" data-action="matchPick:${this.escapeAttr(card.id)}" ${matched ? 'disabled' : ''}>${card.left}</button>`;
    }).join('');
    const rightButtons = round.rightOrder.map((card) => {
      const selected = round.selectedRightId === card.id;
      const matched = round.matchedIds.includes(card.id);
      return `<button class="quiz-option match-option ${selected ? 'choice-selected' : ''} ${matched ? 'match-done' : ''}" data-side="right" data-action="matchPick:${this.escapeAttr(card.id)}" ${matched ? 'disabled' : ''}>${card.right}</button>`;
    }).join('');
    const solved = round.matchedIds.length;
    const total = round.pairs.length;
    return `<div class="match-stage">
      <div class="match-top">
        <button class="match-close" data-action="exitQuiz" aria-label="퀴즈 종료">✕</button>
        <div class="match-progress"><span style="width:${Math.round((solved / Math.max(total, 1)) * 100)}%"></span></div>
        <div class="badge">XP ${this.state.quiz.xp}</div>
      </div>
      <h2 class="match-title">의미가 일치하는 단어끼리 짝을 지으세요</h2>
      <p class="small match-sub">매칭 ${solved}/${total} · 시도 ${round.attempts}회</p>
      <div class="match-grid">
        <div class="match-col">${leftButtons}</div>
        <div class="match-col">${rightButtons}</div>
      </div>
      <div class="match-bottom">
        <p class="quiz-feedback">${this.state.quiz.feedback}</p>
        <button class="primary match-confirm" data-action="nextQuiz" ${round.completed ? '' : 'disabled'}>확인</button>
      </div>
    </div>`;
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
      <p class="small">앱 캐시 초기화: Service Worker/Cache Storage를 삭제하고 새로고침합니다.</p>
      <p class="small">학습 기록 초기화: localStorage의 진도/북마크/오답 기록을 삭제합니다.</p>
      <div class="controls settings-actions"><button data-action="audioTest">🔊 음성 테스트</button><button class="warn cache-reset-btn" data-action="recoverCache">앱 캐시 초기화</button><button class="bad progress-reset-btn" data-action="resetLocal">학습 기록 초기화</button></div></div>
      <div class="card"><h3>JSON 로딩 상태</h3><p class="small">경로: ${this.state.loadedPath}</p><p class="small">lessons ${c.lessons.length}, vocab ${c.vocab.length}, sentence ${c.sentence.length}, dialogues ${c.dialogues.length}, grammar ${c.grammar.length}, pronunciation ${c.pronunciation.length}, quizSeeds ${c.seeds.length}</p></div></section>`;
  }

  setupQuizQueue() {
    const base = this.shuffle(this.getQuizPoolByFilter()).slice(0, 12);
    const safeQueue = base.length ? base : this.shuffle([...this.state.flat.vocab, ...this.state.flat.sentence]).slice(0, 8);
    this.state.quiz = {
      ...this.state.quiz,
      queue: safeQueue,
      i: 0,
      score: 0,
      xp: 0,
      streak: 0,
      bestStreak: this.loadLocal('best_streak', 0),
      goalCorrect: Math.max(3, Math.floor(safeQueue.length * 0.75)),
      wrong: [],
      phase: 'ready',
      feedback: '',
      answered: false,
      picked: '',
      options: [],
      optionKey: '',
      matchingRound: null
    };
  }

  pickQuizOption(value) {
    const item = this.state.quiz.queue[this.state.quiz.i];
    if (!item || this.state.quiz.answered) return;
    let answer = this.state.quizMode === 'vi' ? (item.term || item.textVi) : (item.meaningKo || item.textKo);
    const ok = value === answer;
    this.state.quiz.answered = true;
    this.state.quiz.picked = value;
    if (ok) {
      this.state.quiz.score += 1;
      this.state.quiz.streak += 1;
      this.state.quiz.bestStreak = Math.max(this.state.quiz.bestStreak, this.state.quiz.streak);
      this.state.quiz.xp += 10 + Math.min(10, this.state.quiz.streak * 2);
      this.state.quiz.feedback = `정답! 🐳 +${10 + Math.min(10, this.state.quiz.streak * 2)}XP`;
      this.triggerEffect('success', '정답! 🐳🎉');
      this.playFeedbackSound('correct');
      this.playAudio(item.audioSrc || '', item.term || item.textVi || '');
      this.saveLocal('best_streak', this.state.quiz.bestStreak);
    } else {
      this.state.quiz.streak = 0;
      this.state.quiz.feedback = `오답! 정답: ${answer} · 한 번 더 들으면 됩니다!`;
      this.triggerEffect('warn', '한 번 더 들으면 됩니다 🙂');
      this.playFeedbackSound('wrong');
      this.state.quiz.wrong.push(item.id);
      if (!this.wrongAnswers.includes(item.id)) this.wrongAnswers.push(item.id);
      this.saveLocal('wrongAnswers', this.wrongAnswers);
    }
    this.markItem(item.id, ok ? 'correct' : 'wrong', false);
    this.render();
  }

  getOrCreateMatchingRound() {
    const current = this.state.quiz.matchingRound;
    if (current?.questionIndex === this.state.quiz.i) return current;
    const pool = this.shuffle(this.getQuizPoolByFilter())
      .filter((x) => (x.term || x.textVi) && (x.meaningKo || x.textKo))
      .slice(0, 5)
      .map((x, idx) => ({
        id: `m${idx}`,
        left: x.term || x.textVi,
        right: x.meaningKo || x.textKo,
        sourceId: x.id
      }));
    const pairs = pool.length ? pool : this.shuffle([...this.state.flat.vocab, ...this.state.flat.sentence]).slice(0, 5).map((x, idx) => ({
      id: `m${idx}`,
      left: x.term || x.textVi,
      right: x.meaningKo || x.textKo,
      sourceId: x.id
    })).filter((x) => x.left && x.right);
    this.state.quiz.matchingRound = {
      questionIndex: this.state.quiz.i,
      pairs,
      leftOrder: this.shuffle([...pairs]),
      rightOrder: this.shuffle([...pairs]),
      matchedIds: [],
      selectedLeftId: '',
      selectedRightId: '',
      attempts: 0,
      completed: false
    };
    return this.state.quiz.matchingRound;
  }

  matchPick(value, side) {
    const round = this.getOrCreateMatchingRound();
    if (round.completed) return;
    if (side === 'left') round.selectedLeftId = value;
    if (side === 'right') round.selectedRightId = value;
    if (!round.selectedLeftId || !round.selectedRightId) return this.render();
    if (round.matchedIds.includes(round.selectedLeftId) || round.matchedIds.includes(round.selectedRightId)) {
      round.selectedLeftId = '';
      round.selectedRightId = '';
      return this.render();
    }
    round.attempts += 1;
    const ok = round.selectedLeftId === round.selectedRightId;
    if (ok) {
      round.matchedIds.push(round.selectedLeftId);
      this.state.quiz.xp += 6;
      this.state.quiz.feedback = `매칭 성공! +6XP (${round.matchedIds.length}/${round.pairs.length})`;
      this.playFeedbackSound('correct');
      const solvedPair = round.pairs.find((x) => x.id === round.selectedLeftId);
      if (solvedPair?.left) this.playAudio('', solvedPair.left);
      if (round.matchedIds.length === round.pairs.length) {
        round.completed = true;
        this.state.quiz.score += 1;
        this.state.quiz.streak += 1;
        const bonus = 10 + Math.min(8, Math.max(0, round.pairs.length - round.attempts));
        this.state.quiz.xp += bonus;
        this.state.quiz.bestStreak = Math.max(this.state.quiz.bestStreak, this.state.quiz.streak);
        this.state.quiz.feedback = `라운드 클리어! +${bonus}XP 보너스 🎉`;
        this.saveLocal('best_streak', this.state.quiz.bestStreak);
      }
    } else {
      this.state.quiz.streak = 0;
      this.state.quiz.feedback = '짝이 맞지 않아요. 다시 시도해보세요.';
      this.playFeedbackSound('wrong');
    }
    round.selectedLeftId = '';
    round.selectedRightId = '';
    this.render();
  }

  nextQuiz() {
    this.state.quiz.i += 1;
    this.state.quiz.feedback = '';
    this.state.quiz.answered = false;
    this.state.quiz.picked = '';
    this.state.quiz.matchingRound = null;
    if (this.state.quiz.i >= this.state.quiz.queue.length) {
      this.state.quiz.phase = 'ready';
    }
    this.render();
    this.playListenPromptIfNeeded();
  }

  playListenPromptIfNeeded() {
    if (this.state.quizMode !== 'listen' || this.state.quiz.phase !== 'playing') return;
    const item = this.state.quiz.queue[this.state.quiz.i];
    if (!item) return;
    this.playAudio(item.audioSrc || '', item.term || item.textVi || item.text || '');
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
    this.state.revealMeaning = this.settings.autoShowMeaning;

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
    if (value === 'known') this.triggerEffect('success', '좋아요! 기억했어요 ✨');
    if (value === 'unknown' || value === 'difficult') this.triggerEffect('warn', '괜찮아요, 반복하면 됩니다 💪');
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
    const src = this.normalizeAudioSrc(audioSrc || '');
    if (src) {
      try {
        const audio = new Audio(src);
        audio.playbackRate = Math.max(0.6, Math.min(1.6, Number(this.settings.speechRate || 1)));
        await new Promise((resolve, reject) => {
          audio.onended = resolve;
          audio.onerror = reject;
          audio.play().catch(reject);
        });
        return true;
      } catch (_) {
        // fallback to TTS below
      }
    }
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(fallbackText || 'xin chào');
      u.lang = 'vi-VN';
      u.rate = this.settings.speechRate;
      await new Promise((resolve) => {
        const fallbackMs = Math.max(900, (fallbackText || '').length * 110);
        const timer = setTimeout(resolve, fallbackMs);
        u.onend = () => { clearTimeout(timer); resolve(); };
        u.onerror = () => { clearTimeout(timer); resolve(); };
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      });
      return true;
    }
    this.state.quiz.feedback = '브라우저 음성 권한/자동재생 정책으로 소리가 막혔을 수 있어요.';
    this.render();
    return false;
  }

  async repeatSpeak(payload, n) {
    const text = payload?.text || '';
    const audioSrc = payload?.audioSrc || '';
    for (let i = 0; i < n; i += 1) {
      const ok = await this.playAudio(audioSrc, text);
      if (!ok) break;
      await new Promise((r) => setTimeout(r, 220));
    }
  }

  normalizeAudioSrc(audioSrc) {
    const src = String(audioSrc || '').trim();
    if (!src) return '';
    if (/^https?:\/\//i.test(src)) return src;
    const baseUrl = this.getAppBaseUrl();
    if (src.startsWith('/')) return new URL(`.${src}`, baseUrl).href;
    return new URL(src.replace(/^\.\//, ''), baseUrl).href;
  }

  getAppBaseUrl() {
    const manifestHref = document.querySelector('link[rel="manifest"]')?.getAttribute('href') || './manifest.webmanifest';
    const manifestUrl = new URL(manifestHref, window.location.href);
    const manifestPath = manifestUrl.pathname.replace(/\/[^/]*$/, '/');
    return `${window.location.origin}${manifestPath}`;
  }

  setupPwaUI() {
    if (!document.getElementById('pwa-install-banner')) {
      const install = document.createElement('aside');
      install.id = 'pwa-install-banner';
      install.className = 'pwa-install-banner hidden';
      install.setAttribute('role', 'status');
      install.innerHTML = `<h3>앱처럼 설치해서 공부해요</h3>
        <p>홈 화면에 추가하면 주소창 없이 바로 열고, 일부 학습자료는 오프라인에서도 볼 수 있어요.</p>
        <p class="small hidden" id="pwa-ios-helper">iPhone은 Safari 공유 버튼에서 ‘홈 화면에 추가’를 눌러주세요.</p>
        <div class="pwa-banner-actions"><button class="pwa-primary-btn" id="pwa-install-now">앱 설치하기</button><button class="pwa-secondary-btn" id="pwa-install-later">나중에</button></div>`;
      document.body.appendChild(install);
      install.querySelector('#pwa-install-now')?.addEventListener('click', () => this.promptInstallApp());
      install.querySelector('#pwa-install-later')?.addEventListener('click', () => this.hideInstallBanner());
    }
    if (!document.getElementById('pwa-update-banner')) {
      const update = document.createElement('aside');
      update.id = 'pwa-update-banner';
      update.className = 'pwa-update-banner hidden';
      update.setAttribute('role', 'status');
      update.innerHTML = `<h3>새 학습 콘텐츠가 있어요</h3><p>최신 단어장/음성/화면을 적용하려면 업데이트해 주세요.</p><div class="pwa-banner-actions"><button class="pwa-primary-btn" id="pwa-update-now">지금 업데이트</button><button class="pwa-secondary-btn" id="pwa-update-later">나중에</button></div>`;
      document.body.appendChild(update);
      update.querySelector('#pwa-update-now')?.addEventListener('click', () => this.applyWaitingServiceWorker());
      update.querySelector('#pwa-update-later')?.addEventListener('click', () => this.hideUpdateBanner());
    }
    if (!document.getElementById('offline-badge')) {
      const badge = document.createElement('div');
      badge.id = 'offline-badge';
      badge.className = 'offline-badge hidden';
      badge.textContent = '오프라인 모드입니다. 저장된 학습자료로 복습할 수 있어요.';
      document.body.appendChild(badge);
    }
    this.refreshInstallBannerState();
    this.updateNetworkBadge();
  }

  bindInstallPromptEvents() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      this.refreshInstallBannerState();
    });

    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      this.isStandalone = true;
      this.hideInstallBanner();
    });
  }

  isIosSafari() {
    const ua = window.navigator.userAgent || '';
    const isiOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    return isiOS && isSafari;
  }

  refreshInstallBannerState() {
    const banner = document.getElementById('pwa-install-banner');
    if (!banner) return;
    const iosHelper = document.getElementById('pwa-ios-helper');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true || this.isStandalone;
    if (isStandalone) {
      this.hideInstallBanner();
      return;
    }

    const canPromptInstall = !!deferredInstallPrompt;
    const showIosHint = !canPromptInstall && this.isIosSafari();
    banner.classList.toggle('hidden', !canPromptInstall && !showIosHint);
    if (iosHelper) iosHelper.classList.toggle('hidden', !showIosHint);
  }

  async promptInstallApp() {
    if (!deferredInstallPrompt) {
      this.refreshInstallBannerState();
      return;
    }
    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    this.hideInstallBanner();
  }

  showInstallBanner() {
    document.getElementById('pwa-install-banner')?.classList.remove('hidden');
  }

  hideInstallBanner() {
    document.getElementById('pwa-install-banner')?.classList.add('hidden');
  }

  bindNetworkStatusEvents() {
    window.addEventListener('offline', () => this.updateNetworkBadge());
    window.addEventListener('online', () => this.updateNetworkBadge());
  }

  updateNetworkBadge() {
    const badge = document.getElementById('offline-badge');
    if (!badge) return;
    badge.classList.toggle('hidden', navigator.onLine);
  }

  showUpdateBanner() {
    document.getElementById('pwa-update-banner')?.classList.remove('hidden');
  }

  hideUpdateBanner() {
    document.getElementById('pwa-update-banner')?.classList.add('hidden');
  }

  async applyWaitingServiceWorker() {
    const reg = this.pendingSWRegistration || (await navigator.serviceWorker.getRegistration('./'));
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      this.hideUpdateBanner();
    }
  }

  setupServiceWorkerRegistration() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        this.pendingSWRegistration = registration;

        const watchInstalling = (worker) => {
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateBanner();
            }
          });
        };

        watchInstalling(registration.installing);
        registration.addEventListener('updatefound', () => watchInstalling(registration.installing));

        if (registration.waiting && navigator.serviceWorker.controller) {
          this.showUpdateBanner();
        }
      } catch (error) {
        console.warn('서비스워커 등록 실패', error);
      }
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.swReloading) return;
      this.swReloading = true;
      window.location.reload();
    });
  }

  hangulPron(text) {
    if (!text) return '';
    const raw = text.toLowerCase().trim();
    if (PRON_KO_MAP[raw]) return PRON_KO_MAP[raw];

    const cleaned = raw
      .replaceAll('đ', 'd')
      .replaceAll('ph', 'f')
      .replaceAll('th', 't')
      .replaceAll('tr', 'ch')
      .replaceAll('ch', 'j')
      .replaceAll('nh', 'ny')
      .replaceAll('ngh', 'ng')
      .replaceAll('ng', 'ng')
      .replaceAll('kh', 'k')
      .replaceAll('qu', 'kw')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const syllables = cleaned.split(/\\s+/).filter(Boolean).slice(0, 8);
    return syllables.map((s) => this.syllableToKo(s)).join(' ');
  }

  hangulPronNatural(text) {
    const src = (text || '').trim();
    if (!src) return '';
    const phraseMap = {
      'xin chao': '씬 짜오',
      'ban co khoe khong': '반 꼬 쾌 콩',
      'toi ten la': '또이 뗀 라',
      'han quoc': '한 꾸옥',
      'nguoi han quoc': '응어이 한 꾸옥',
      'tieng viet': '띠엥 비엣',
      'ha noi': '하 노이',
      'vi vay': '비 버이',
      'toi la': '또이 라',
      'toi dang': '또이 당',
      'toi se': '또이 세',
      'toi muon': '또이 무온'
    };
    const wordMap = {
      'xin': '씬', 'chao': '짜오', 'toi': '또이', 'ten': '뗀', 'la': '라',
      'nguoi': '응어이', 'han': '한', 'quoc': '꾸옥', 'dang': '당', 'hoc': '혹',
      'tieng': '띠엥', 'viet': '비엣', 'se': '세', 'di': '디', 'ha': '하', 'noi': '노이',
      'vi': '비', 'vay': '버이', 'muon': '무온', 'noi': '노이', 'tot': '똣', 'hon': '헌',
      'ban': '반', 'co': '꼬', 'khoe': '쾌', 'khong': '콩', 'cam': '깜', 'on': '언',
      'toi': '또이', 'chu': '쭈', 'nhat': '녓', 'thu': '트', 'mot': '못', 'hai': '하이', 'ba': '바',
      'bon': '본', 'nam': '남', 'sau': '사우', 'bay': '버이', 'tam': '땀', 'chin': '찐', 'muoi': '므어이'
    };
    const normalized = this.normalizeVi(src);
    if (phraseMap[normalized]) return phraseMap[normalized];
    const words = normalized.split(/\\s+/).filter(Boolean);
    const out = [];
    for (let i = 0; i < words.length; i += 1) {
      const tri = [words[i], words[i + 1], words[i + 2]].filter(Boolean).join(' ');
      const bi = [words[i], words[i + 1]].filter(Boolean).join(' ');
      if (phraseMap[tri]) { out.push(phraseMap[tri]); i += 2; continue; }
      if (phraseMap[bi]) { out.push(phraseMap[bi]); i += 1; continue; }
      out.push(wordMap[words[i]] || this.syllableToKo(words[i]));
    }
    return out.join(' ');
  }

  normalizeVi(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\\u0300-\\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\\s]/g, ' ')
      .replace(/\\s+/g, ' ')
      .trim();
  }

  syllableToKo(s) {
    let out = s;
    const rep = [
      ['uyen', '우옌'], ['uong', '우엉'], ['uoc', '우억'], ['anh', '앙'], ['ong', '옹'],
      ['ang', '앙'], ['inh', '잉'], ['ien', '이엔'], ['ieu', '이우'], ['ao', '아오'],
      ['ai', '아이'], ['oi', '오이'], ['ua', '우아'], ['uo', '우어'], ['eu', '에우'],
      ['au', '아우'], ['ia', '이아'], ['a', '아'], ['e', '에'], ['i', '이'], ['o', '오'], ['u', '우'], ['y', '이']
    ];
    rep.forEach(([k, v]) => { out = out.replaceAll(k, v); });
    out = out
      .replace(/ng/g, '응')
      .replace(/ny/g, '니')
      .replace(/j/g, '쯔')
      .replace(/f/g, '프')
      .replace(/d/g, '드')
      .replace(/k/g, '크')
      .replace(/t/g, '트')
      .replace(/b/g, '브')
      .replace(/m/g, '므')
      .replace(/n/g, '느')
      .replace(/h/g, '흐')
      .replace(/r/g, '르')
      .replace(/l/g, '르')
      .replace(/v/g, '브')
      .replace(/x/g, '스');
    return out;
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
    this.state.revealMeaning = this.settings.autoShowMeaning;
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
    const quizPool = this.getQuizPoolByFilter();
    const pool = type === 'ko'
      ? [...new Set(quizPool.map((x) => x.meaningKo || x.textKo).filter(Boolean))]
      : [...new Set(quizPool.map((x) => x.term || x.textVi).filter(Boolean))];
    return this.shuffle([answer, ...this.shuffle(pool.filter((x) => x !== answer)).slice(0, 3)]);
  }

  getQuizPoolByFilter() {
    const all = [...this.state.flat.vocab, ...this.state.flat.sentence];
    if (this.state.quizLessonFilter === 'all') return all;
    return all.filter((x) => x.lessonId === this.state.quizLessonFilter);
  }

  shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
  escapeAttr(s = '') { return String(s).replace(/"/g, '&quot;'); }
  escapeHtml(s = '') {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  renderPronGuide(item, originalText, opts = {}) {
    const hasRomanized = /[A-Za-zÀ-ỹà-ỹ]/.test(item.pronKo || '');
    const mainPron = item.pronKo && !hasRomanized ? item.pronKo : this.hangulPronNatural(originalText);
    const compactClass = opts.compact ? 'pron-guide compact' : 'pron-guide';
    return `<div class="${compactClass}">
      <div class="pron-main"><div class="pron-label">발음 느낌</div><div>${this.escapeHtml(mainPron)}</div></div>
      ${item.pronNoteKo ? `<div class="pron-note"><div class="pron-label">발음 팁</div><div>${this.escapeHtml(item.pronNoteKo)}</div></div>` : ''}
    </div>`;
  }

  loadLocal(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(this.storagePrefix + key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  saveLocal(key, value) { localStorage.setItem(this.storagePrefix + key, JSON.stringify(value)); }

  triggerEffect(type, text) {
    this.effect = { type, text, at: Date.now() };
    setTimeout(() => {
      if (this.effect && Date.now() - this.effect.at > 1400) {
        this.effect = null;
        this.injectFloatingUI();
      }
    }, 1500);
  }

  injectFloatingUI() {
    let root = document.getElementById('fx-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'fx-root';
      document.body.appendChild(root);
    }
    if (!this.effect) {
      root.innerHTML = '';
      return;
    }
    const confetti = this.effect.type === 'success'
      ? '<div class=\"wow-confetti\">🎉 ✨ 🐳 ✨ 🎉</div>'
      : '';
    root.innerHTML = `<div class=\"wow-toast ${this.effect.type}\">${this.effect.text}</div>${confetti}`;
  }

  ensureStorageHealth() {
    const versionKey = this.storagePrefix + 'schema_version';
    const currentVersion = '2026-04-ui-audio-2';
    const stored = localStorage.getItem(versionKey);
    if (!stored) {
      localStorage.setItem(versionKey, currentVersion);
      return;
    }
    if (stored !== currentVersion) {
      // keep progress, but clear transient quiz flags that can cause browser-specific odd behavior
      localStorage.removeItem(this.storagePrefix + 'settings');
      localStorage.setItem(versionKey, currentVersion);
    }
  }

  ensureAudioUnlocked() {
    if (this.audioUnlocked) return;
    this.audioUnlocked = true;
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      speechSynthesis.speak(u);
      speechSynthesis.cancel();
    }
  }

  playFeedbackSound(kind = 'correct') {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!this.sfxCtx) this.sfxCtx = new Ctx();
    const ctx = this.sfxCtx;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const now = ctx.currentTime + 0.01;
    const notes = kind === 'correct'
      ? [523.25, 659.25]
      : [392.0, 349.23];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.055, now + idx * 0.12 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.22);
    });
  }
  async tryRecoverFromCacheIssue() {
    if (this.healTried) return false;
    this.healTried = true;
    try {
      await this.clearBrowserCaches();
      const { data, path } = await this.fetchJson();
      this.state.data = data;
      this.state.loadedPath = path;
      this.state.flat = this.flattenData(data.lessons || []);
      this.state.lessonId = data.lessons?.[0]?.lessonId || null;
      this.state.message = '캐시 복구를 완료했어요. 다시 시작합니다! 🐳';
      this.render();
      return true;
    } catch {
      return false;
    }
  }

  async recoverAndReload() {
    this.renderLoading('브라우저 캐시와 서비스워커를 정리하는 중...');
    await this.clearBrowserCaches();
    location.reload();
  }

  async clearBrowserCaches() {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  }

  renderLoading(msg) { this.appEl.innerHTML = `<div class="card">${msg}</div>`; }
  renderError(msg, canRecover = false) { this.appEl.innerHTML = `<div class="card"><h3>앗! 문제가 생겼어요.</h3><p>${msg}</p>${canRecover ? '<button class="warn" data-action="recoverCache">오류 복구 실행</button>' : ''}</div>`; this.bindRenderedEvents(); }
}

window.addEventListener('DOMContentLoaded', () => new VietnameseA1App());
