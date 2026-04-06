/* ===== Progress Tracking (localStorage) ===== */
const STORAGE_KEY = 'career-upskill-progress';

function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function setProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function markDay(day, completed) {
  const progress = getProgress();
  if (completed) { progress[day] = Date.now(); }
  else { delete progress[day]; }
  setProgress(progress);
}

function isDayCompleted(day) {
  return !!getProgress()[day];
}

function getCompletedCount() {
  return Object.keys(getProgress()).length;
}

/* ===== Index Page ===== */
function initIndex() {
  const cards = document.querySelectorAll('.day-card');
  cards.forEach(function (card) {
    var href = card.getAttribute('href');
    var match = href && href.match(/day-(\d+)/);
    if (match && isDayCompleted(match[1])) {
      card.classList.add('completed');
    }
  });

  var countEl = document.querySelector('.progress-summary .count');
  var fillEl = document.querySelector('.progress-bar-index .fill');
  if (countEl) {
    var count = getCompletedCount();
    countEl.textContent = count;
    if (fillEl) fillEl.style.width = ((count / 14) * 100) + '%';
  }
}

/* ===== Lesson Page: Mark Complete ===== */
function initLesson() {
  var btn = document.querySelector('.mark-complete-btn');
  if (!btn) return;

  var day = btn.dataset.day;
  if (isDayCompleted(day)) {
    btn.textContent = 'Completed';
    btn.classList.add('completed');
  }

  btn.addEventListener('click', function () {
    if (this.classList.contains('completed')) return;
    markDay(day, true);
    this.textContent = 'Completed';
    this.classList.add('completed');
  });
}

/* ===== Keyboard Navigation ===== */
function initKeyboardNav() {
  var nav = document.querySelector('nav.lesson-nav');
  if (!nav) return;

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'ArrowLeft') {
      var prev = nav.firstElementChild;
      if (prev && prev.tagName === 'A' && !prev.classList.contains('disabled')) {
        window.location.href = prev.href;
      }
    }
    if (e.key === 'ArrowRight') {
      var next = nav.lastElementChild;
      if (next && next.tagName === 'A' && !next.classList.contains('disabled')) {
        window.location.href = next.href;
      }
    }
  });
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.day-grid')) initIndex();
  if (document.querySelector('.mark-complete-btn')) initLesson();
  if (document.querySelector('nav.lesson-nav')) initKeyboardNav();
});
