(() => {
  const STORAGE_KEY = 'cebuano-learner-progress-v1';
  const SETTINGS_KEY = 'cebuano-learner-settings-v1';
  const STREAK_KEY = 'cebuano-learner-streak-v1';

  /**
   * Minimal fallback dataset used if fetching data/cebuano.json fails.
   */
  const FALLBACK_DATA = [
    { id: 'greet-hello', cebuano: 'Kumusta', english: 'Hello' },
    { id: 'greet-thanks', cebuano: 'Salamat', english: 'Thank you' },
    { id: 'greet-please', cebuano: 'Palihug', english: 'Please' },
    { id: 'greet-sorry', cebuano: 'Pasayloa ko', english: 'Sorry' },
    { id: 'greet-good-morning', cebuano: 'Maayong buntag', english: 'Good morning' },
    { id: 'greet-good-afternoon', cebuano: 'Maayong hapon', english: 'Good afternoon' },
    { id: 'greet-good-evening', cebuano: 'Maayong gabii', english: 'Good evening' },
    { id: 'greet-goodbye', cebuano: 'Babay', english: 'Goodbye' },
    { id: 'core-yes', cebuano: 'Oo', english: 'Yes' },
    { id: 'core-no', cebuano: 'Dili', english: 'No' },
    { id: 'core-what', cebuano: 'Unsa', english: 'What' },
    { id: 'core-who', cebuano: 'Kinsa', english: 'Who' },
    { id: 'core-where', cebuano: 'Asa', english: 'Where' },
    { id: 'core-when', cebuano: 'Kanus-a', english: 'When' },
    { id: 'core-why', cebuano: 'Nganong', english: 'Why' },
    { id: 'core-how', cebuano: 'Giunsa', english: 'How' },
    { id: 'core-i', cebuano: 'Ako', english: 'I / me' },
    { id: 'core-you', cebuano: 'Ikaw', english: 'You' },
    { id: 'core-he', cebuano: 'Siya', english: 'He / she' },
    { id: 'core-we', cebuano: 'Kita', english: 'We (incl.)' },
    { id: 'core-they', cebuano: 'Sila', english: 'They' },
    { id: 'food-water', cebuano: 'Tubig', english: 'Water' },
    { id: 'food-rice', cebuano: 'Bugas / kan-on', english: 'Rice' },
    { id: 'food-fish', cebuano: 'Isda', english: 'Fish' },
    { id: 'food-chicken', cebuano: 'Manok', english: 'Chicken' },
    { id: 'travel-bus', cebuano: 'Sakayán / bus', english: 'Bus' },
    { id: 'travel-jeep', cebuano: 'Dyip', english: 'Jeepney' },
    { id: 'travel-port', cebuano: 'Pantalan', english: 'Port' },
    { id: 'num-one', cebuano: 'Usa', english: 'One' },
    { id: 'num-two', cebuano: 'Duha', english: 'Two' },
    { id: 'num-three', cebuano: 'Tulo', english: 'Three' },
    { id: 'num-four', cebuano: 'Upat', english: 'Four' },
    { id: 'num-five', cebuano: 'Lima', english: 'Five' },
    { id: 'color-red', cebuano: 'Pula', english: 'Red' },
    { id: 'color-blue', cebuano: 'Asul', english: 'Blue' },
    { id: 'color-green', cebuano: 'Berde / lunhaw', english: 'Green' },
    { id: 'color-yellow', cebuano: 'Dilaw', english: 'Yellow' },
    { id: 'emotion-hungry', cebuano: 'Gigutom', english: 'Hungry' },
    { id: 'emotion-thirsty', cebuano: 'Gi-uhaw', english: 'Thirsty' },
    { id: 'emotion-tired', cebuano: 'Kapoy', english: 'Tired' },
    { id: 'common-how-much', cebuano: 'Tagpila', english: 'How much' },
    { id: 'common-where-is', cebuano: 'Asa ang...', english: 'Where is...' },
    { id: 'common-what-name', cebuano: 'Unsa imong ngalan?', english: 'What is your name?' },
    { id: 'common-my-name', cebuano: 'Akong ngalan kay...', english: 'My name is...' },
    { id: 'common-i-dont-know', cebuano: 'Wala ko kahibalo', english: "I don't know" },
    { id: 'common-i-understand', cebuano: 'Nakasabot ko', english: 'I understand' },
    { id: 'common-help', cebuano: 'Tabang!', english: 'Help!' },
    { id: 'place-house', cebuano: 'Balay', english: 'House' },
    { id: 'place-school', cebuano: 'Eskwelahan', english: 'School' },
    { id: 'place-market', cebuano: 'Merkado', english: 'Market' }
  ];

  function readLocalStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // ignore
    }
  }

  function readStreak() {
    return readLocalStorage(STREAK_KEY, { lastActiveDay: null, streakCount: 0 });
  }

  function writeStreak(streak) {
    writeLocalStorage(STREAK_KEY, streak);
  }

  function getDayString(ts) {
    return new Date(ts).toISOString().slice(0, 10);
  }

  function recordDailyActivity() {
    const now = nowTs();
    const today = getDayString(now);
    const streak = readStreak();
    if (streak.lastActiveDay === today) {
      return streak.streakCount || 0;
    }
    const yesterday = getDayString(now - 24 * 3600e3);
    const isConsecutive = streak.lastActiveDay === yesterday;
    const nextCount = isConsecutive ? (streak.streakCount || 0) + 1 : 1;
    const updated = { lastActiveDay: today, streakCount: nextCount };
    writeStreak(updated);
    return nextCount;
  }

  function shuffleInPlace(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async function loadDataset() {
    try {
      const res = await fetch('data/cebuano.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch dataset');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('Invalid dataset');
      return data;
    } catch (err) {
      console.warn('Using fallback dataset:', err);
      return FALLBACK_DATA;
    }
  }

  function computeAccuracy(correct, incorrect) {
    const total = correct + incorrect;
    if (total <= 0) return 0;
    return Math.round((correct / total) * 100);
  }

  function createProgressIfMissing(progressById, id) {
    if (!progressById[id]) {
      progressById[id] = { score: 0, seen: 0, correct: 0, incorrect: 0, lastSeen: 0 };
    }
    return progressById[id];
  }

  function nowTs() { return Date.now(); }

  function chooseNextWord(words, progressById, lastId) {
    const scored = words.map(w => {
      const p = progressById[w.id] || { score: 0, seen: 0 };
      const base = (p.score || 0) * 10 + (p.seen || 0);
      const jitter = Math.random() * 5;
      let penalty = 0;
      if (w.id === lastId) penalty += 8; // avoid immediate repeat
      return { w, weight: base + jitter + penalty };
    });
    scored.sort((a, b) => a.weight - b.weight);
    // Pick among the 5 lightest candidates randomly
    const top = scored.slice(0, Math.min(5, scored.length));
    return top[Math.floor(Math.random() * top.length)].w;
  }

  function sampleUnique(array, count, excludeId) {
    const pool = array.filter(x => x.id !== excludeId);
    shuffleInPlace(pool);
    return pool.slice(0, count);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const el = {
      modeButtons: Array.from(document.querySelectorAll('.mode-btn')),
      views: {
        flashcards: document.getElementById('flashcards-view'),
        quiz: document.getElementById('quiz-view'),
        stats: document.getElementById('stats-view')
      },
      datasetSummary: document.getElementById('dataset-summary'),
      orientation: document.getElementById('lang-orientation'),
      resetBtn: document.getElementById('reset-progress'),
      shuffleBtn: document.getElementById('shuffle-deck'),
      // Flashcards
      card: document.getElementById('card'),
      cardFront: document.getElementById('card-front'),
      cardBack: document.getElementById('card-back'),
      btnFlip: document.getElementById('btn-flip'),
      btnAgain: document.getElementById('btn-again'),
      btnGood: document.getElementById('btn-good'),
      btnEasy: document.getElementById('btn-easy'),
      flashProgress: document.getElementById('flash-progress'),
      // Quiz
      quizPrompt: document.getElementById('quiz-prompt'),
      quizOptions: Array.from(document.querySelectorAll('.quiz-option')),
      quizFeedback: document.getElementById('quiz-feedback'),
      quizNext: document.getElementById('quiz-next'),
      quizProgress: document.getElementById('quiz-progress'),
      // Stats
      statTotal: document.getElementById('stat-total'),
      statMastered: document.getElementById('stat-mastered'),
      statSeen: document.getElementById('stat-seen'),
      statAccuracy: document.getElementById('stat-accuracy'),
      statStreak: document.getElementById('stat-streak')
    };

    const settings = readLocalStorage(SETTINGS_KEY, { orientation: 'cebuano', mode: 'flashcards' });

    let words = await loadDataset();
    let progressById = readLocalStorage(STORAGE_KEY, {});

    const idToWord = new Map(words.map(w => [w.id, w]));
    let lastFlashId = null;
    let quizState = { currentId: null, correctIndex: null, options: [], dir: 'cebuano' };
    let flashLock = false;
    let quizLocked = false;

    if (settings.orientation) el.orientation.value = settings.orientation;

    function saveProgress() { writeLocalStorage(STORAGE_KEY, progressById); }
    function saveSettings() { writeLocalStorage(SETTINGS_KEY, settings); }

    function setMode(mode) {
      settings.mode = mode; saveSettings();
      for (const b of el.modeButtons) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
      for (const k of Object.keys(el.views)) el.views[k].classList.remove('visible');
      el.views[mode].classList.add('visible');
      if (mode === 'quiz') renderQuiz();
      if (mode === 'stats') renderStats();
    }

    function getCardDirection(word) {
      const o = el.orientation.value;
      if (o === 'mixed') return Math.random() < 0.5 ? 'cebuano' : 'english';
      return o;
    }

    function renderDatasetSummary() {
      el.datasetSummary.textContent = `${words.length} words loaded`;
    }

    function renderStats() {
      const ids = words.map(w => w.id);
      let totalSeen = 0, totalCorrect = 0, totalIncorrect = 0, mastered = 0;
      for (const id of ids) {
        const p = progressById[id];
        if (!p) continue;
        totalSeen += p.seen || 0;
        totalCorrect += p.correct || 0;
        totalIncorrect += p.incorrect || 0;
        if ((p.score || 0) >= 4) mastered += 1;
      }
      el.statTotal.textContent = String(words.length);
      el.statMastered.textContent = String(mastered);
      el.statSeen.textContent = String(totalSeen);
      el.statAccuracy.textContent = `${computeAccuracy(totalCorrect, totalIncorrect)}%`;
      const streak = readStreak();
      el.statStreak.textContent = String(streak.streakCount || 0);
    }

    function renderFlashcard() {
      const next = chooseNextWord(words, progressById, lastFlashId);
      const dir = getCardDirection(next);
      const front = dir === 'cebuano' ? next.cebuano : next.english;
      const back = dir === 'cebuano' ? next.english : next.cebuano;
      el.card.classList.remove('flipped');
      el.cardFront.textContent = front;
      el.cardBack.textContent = back;
      el.flashProgress.textContent = `Score: ${(progressById[next.id]?.score || 0)} · Seen: ${(progressById[next.id]?.seen || 0)}`;
      lastFlashId = next.id;
    }

    function adjustScore(id, delta) {
      const p = createProgressIfMissing(progressById, id);
      p.score = Math.max(0, Math.min(7, (p.score || 0) + delta));
      p.seen = (p.seen || 0) + 1;
      if (delta > 0) p.correct = (p.correct || 0) + 1; else p.incorrect = (p.incorrect || 0) + 1;
      p.lastSeen = nowTs();
      saveProgress();
      recordDailyActivity();
    }

    function renderQuiz() {
      // pick current
      const current = chooseNextWord(words, progressById, quizState.currentId);
      quizState.currentId = current.id;
      const dir = getCardDirection(current);
      const promptText = dir === 'cebuano' ? current.cebuano : current.english;
      const candidates = [current, ...sampleUnique(words, 3, current.id)];
      let optionItems = candidates.map(w => ({ word: w, display: dir === 'cebuano' ? w.english : w.cebuano }));
      shuffleInPlace(optionItems);
      const correctIndex = optionItems.findIndex(x => x.word.id === current.id);
      quizState.correctIndex = correctIndex;
      quizState.options = optionItems;
      quizState.dir = dir;

      el.quizPrompt.textContent = promptText;
      el.quizFeedback.textContent = '';
      el.quizOptions.forEach((btn, i) => {
        btn.textContent = optionItems[i] ? optionItems[i].display : '';
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
      });
      el.quizNext.disabled = true;
      quizLocked = false;
      const p = progressById[current.id] || { score: 0, seen: 0 };
      el.quizProgress.textContent = `Score: ${p.score || 0} · Seen: ${p.seen || 0}`;
    }

    function answerQuiz(index) {
      if (quizLocked) return;
      quizLocked = true;
      const current = idToWord.get(quizState.currentId);
      if (!current) return;
      const correct = index === quizState.correctIndex;
      if (correct) {
        adjustScore(current.id, +1);
        el.quizFeedback.textContent = 'Correct!';
      } else {
        adjustScore(current.id, -1);
        el.quizFeedback.textContent = 'Not quite.';
      }
      el.quizOptions.forEach((btn, i) => {
        btn.disabled = true;
        if (i === quizState.correctIndex) btn.classList.add('correct');
        else if (i === index && !correct) btn.classList.add('incorrect');
      });
      // After answering in English → Cebuano direction, show both languages on options
      if (quizState.dir === 'english') {
        el.quizOptions.forEach((btn, i) => {
          const item = quizState.options[i];
          if (item && item.word) {
            btn.textContent = `${item.word.cebuano} — ${item.word.english}`;
          }
        });
      }
      el.quizNext.disabled = false;
    }

    // Events
    el.modeButtons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    el.orientation.addEventListener('change', () => { settings.orientation = el.orientation.value; saveSettings(); if (settings.mode === 'quiz') renderQuiz(); });
    el.resetBtn.addEventListener('click', () => {
      if (confirm('Reset your learning progress?')) {
        progressById = {};
        saveProgress();
        renderStats();
        renderDatasetSummary();
        if (settings.mode === 'flashcards') renderFlashcard(); else renderQuiz();
      }
    });
    el.shuffleBtn.addEventListener('click', () => { shuffleInPlace(words); if (settings.mode === 'flashcards') renderFlashcard(); else renderQuiz(); });

    // Flashcard events
    el.btnFlip.addEventListener('click', () => { el.card.classList.toggle('flipped'); });
    el.card.addEventListener('click', () => { el.card.classList.toggle('flipped'); });
    el.btnAgain.addEventListener('click', () => {
      if (flashLock || !lastFlashId) return;
      flashLock = true;
      adjustScore(lastFlashId, -1);
      renderFlashcard();
      flashLock = false;
    });
    el.btnGood.addEventListener('click', () => {
      if (flashLock || !lastFlashId) return;
      flashLock = true;
      adjustScore(lastFlashId, +1);
      renderFlashcard();
      flashLock = false;
    });
    el.btnEasy.addEventListener('click', () => {
      if (flashLock || !lastFlashId) return;
      flashLock = true;
      adjustScore(lastFlashId, +2);
      renderFlashcard();
      flashLock = false;
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (settings.mode === 'flashcards') {
        if (e.code === 'Space') { e.preventDefault(); el.card.classList.toggle('flipped'); }
        if (e.key === '1') { if (!flashLock && lastFlashId) { flashLock = true; adjustScore(lastFlashId, -1); renderFlashcard(); flashLock = false; } }
        if (e.key === '2') { if (!flashLock && lastFlashId) { flashLock = true; adjustScore(lastFlashId, +1); renderFlashcard(); flashLock = false; } }
        if (e.key === '3') { if (!flashLock && lastFlashId) { flashLock = true; adjustScore(lastFlashId, +2); renderFlashcard(); flashLock = false; } }
      }
    });

    // Quiz events
    el.quizOptions.forEach((btn, i) => btn.addEventListener('click', () => answerQuiz(i)));
    el.quizNext.addEventListener('click', renderQuiz);

    // Init
    renderDatasetSummary();
    setMode(settings.mode || 'flashcards');
    if (settings.mode === 'flashcards') renderFlashcard();
  });
})();