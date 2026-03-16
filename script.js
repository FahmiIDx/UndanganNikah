/* ============================================================
   UNDANGAN DIGITAL — Pahruroji & Yunita
   script.js
   ============================================================ */

// ── KONFIGURASI — edit bagian ini sesuai kebutuhan ──────────
const CONFIG = {
  weddingDate:   '2026-04-04T10:00:00',   // Tanggal & jam akad
  groomWA:       '62881023257269',          // Nomor WA mempelai pria (format: 62xxx)
  waGreeting:    'Assalamu%27alaikum%2C+saya+sudah+mengirimkan+hadiah+untuk+pernikahan+Pahruroji+%26+Yunita.',
};
// ────────────────────────────────────────────────────────────

const WEDDING_DATE = new Date(CONFIG.weddingDate);

// ────────────────────────────────────────────────────────────
// BUKA UNDANGAN — animasi tutup cover, tampilkan konten
// ────────────────────────────────────────────────────────────
function openInvitation() {
  const cover = document.getElementById('cover');
  cover.classList.add('closing');

  setTimeout(() => {
    cover.style.display = 'none';

    const main = document.getElementById('main');
    const nav  = document.getElementById('navBar');
    const mb   = document.getElementById('music-btn');

    main.style.display = 'block';
    nav.style.display  = 'flex';
    mb.style.display   = 'flex';

    main.style.opacity    = '0';
    main.style.transition = 'opacity .5s ease';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      main.style.opacity = '1';
    }));

    startCountdown();
    initReveal();
  }, 800);
}

// ────────────────────────────────────────────────────────────
// NAVIGASI — pindah antar section
// ────────────────────────────────────────────────────────────
function goTo(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const sec = document.getElementById('sec-' + id);
  if (sec) {
    sec.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (btn) btn.classList.add('active');

  setTimeout(initReveal, 100);
}

// ────────────────────────────────────────────────────────────
// COUNTDOWN TIMER
// ────────────────────────────────────────────────────────────
function pad(n) { return n < 10 ? '0' + n : String(n); }
let cdInterval = null;

function startCountdown() {
  function tick() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      ['d', 'h', 'm', 's'].forEach(x => {
        const el = document.getElementById('cd-' + x);
        if (el) el.textContent = '00';
      });
      clearInterval(cdInterval);
      return;
    }

    const vals = {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };

    ['d', 'h', 'm', 's'].forEach(key => {
      const el = document.getElementById('cd-' + key);
      if (!el) return;
      const nv = pad(vals[key]);
      if (el.textContent !== nv) {
        el.textContent = nv;
        el.classList.remove('bump');
        void el.offsetWidth; // force reflow
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 150);
      }
    });
  }

  tick();
  cdInterval = setInterval(tick, 1000);
}

// ────────────────────────────────────────────────────────────
// RSVP — validasi, kirim, tampilkan ucapan
// ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const attendEl = document.getElementById('rAttend');
  if (attendEl) {
    attendEl.addEventListener('change', function () {
      const group = document.getElementById('guestCountGroup');
      if (group) group.style.display = this.value === 'hadir' ? 'block' : 'none';
    });
  }
});

function submitRsvp() {
  const name   = document.getElementById('rName').value.trim();
  const attend = document.getElementById('rAttend').value;
  const msg    = document.getElementById('rMsg').value.trim();

  if (!name || !attend) {
    alert('Mohon lengkapi nama dan konfirmasi kehadiran.');
    return;
  }

  // Tambah ke daftar ucapan jika ada pesan
  if (msg) {
    const list    = document.getElementById('ucapanList');
    const item    = document.createElement('div');
    item.className = 'ucapan-item';

    const isHadir = attend === 'hadir';
    const count   = document.getElementById('rCount')?.value || '1';

    item.innerHTML = `
      <div class="ucapan-name">${escHtml(name)}</div>
      <span class="ucapan-attend ${isHadir ? '' : 'absent'}">${isHadir ? 'Hadir' : 'Tidak Hadir'}</span>
      <p class="ucapan-text">${escHtml(msg)}</p>
      <div class="ucapan-time">Baru saja${isHadir ? ' · ' + count + ' orang' : ''}</div>
    `;

    item.style.opacity   = '0';
    item.style.transform = 'translateY(12px)';
    list.insertBefore(item, list.children[1]);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      item.style.transition = 'opacity .5s, transform .5s';
      item.style.opacity    = '1';
      item.style.transform  = 'translateY(0)';
    }));
  }

  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('rsvpSuccess').classList.add('show');
}

function escHtml(s) {
  return s
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g, '&quot;');
}

// ────────────────────────────────────────────────────────────
// COPY TO CLIPBOARD
// ────────────────────────────────────────────────────────────
function copyNum(btn, num) {
  _copy(num, () => {
    btn.textContent = 'Tersalin!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Salin Nomor'; btn.classList.remove('copied'); }, 2200);
  });
}

function copyEw(btn, num) {
  _copy(num, () => {
    btn.textContent = 'OK!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Salin'; btn.classList.remove('copied'); }, 2200);
  });
}

function _copy(text, cb) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(cb).catch(() => _fallback(text, cb));
  } else {
    _fallback(text, cb);
  }
}

function _fallback(text, cb) {
  const ta       = document.createElement('textarea');
  ta.value       = text;
  ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  if (cb) cb();
}

// ────────────────────────────────────────────────────────────
// LIGHTBOX GALERI
// ────────────────────────────────────────────────────────────
function openLightbox(src) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  img.src   = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.g-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src);
    });
  });
});

// ────────────────────────────────────────────────────────────
// MUSIK — Web Audio API (nada lembut)
// ────────────────────────────────────────────────────────────
let audioCtx     = null;
let musicPlaying = false;
let musicTimer   = null;

const melody = [
  261.63, 293.66, 329.63, 349.23, 392, 440,
  392, 349.23, 329.63, 293.66, 261.63,
  293.66, 329.63, 392, 440, 493.88,
  440, 392, 349.23, 293.66,
];
let mIdx = 0;

function toggleMusic() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  if (musicPlaying) {
    clearTimeout(musicTimer);
    musicPlaying = false;
    document.getElementById('music-icon').classList.remove('music-on');
  } else {
    musicPlaying = true;
    document.getElementById('music-icon').classList.add('music-on');
    playNext();
  }
}

function playNext() {
  if (!musicPlaying || !audioCtx) return;

  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type          = 'sine';
  osc.frequency.value = melody[mIdx % melody.length];

  const t = audioCtx.currentTime;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.06, t + .08);
  gain.gain.exponentialRampToValueAtTime(0.001, t + .7);

  osc.start(t);
  osc.stop(t + .72);
  mIdx++;

  musicTimer = setTimeout(playNext, 700);
}

// ────────────────────────────────────────────────────────────
// SCROLL REVEAL — elemen muncul saat discroll ke view
// ────────────────────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
}
