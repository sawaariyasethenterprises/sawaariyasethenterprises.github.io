/* ══════════════════════════════════════
   ALOREX PACKAGING LLP
   Main JavaScript
══════════════════════════════════════ */

/* ── PAGE LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1600);
});

/* ── NAVBAR SCROLL STATE ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
}));

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (a.getAttribute('href') === '#contact') {
      setTimeout(() => {
        const firstField = document.getElementById('inp-name');
        if (firstField) firstField.focus();
      }, 700);
    }
  });
});

/* ── SCROLL-TRIGGERED ANIMATIONS ── */
const animateEls = document.querySelectorAll('[data-animate]');
const animObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay);
    animObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
animateEls.forEach(el => animObserver.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    animateCounter(el, parseInt(el.dataset.count));
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

/* ── ACTIVE NAV LINK HIGHLIGHT ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => navObserver.observe(s));

/* ── FORM VALIDATION & SUBMISSION ── */
const form    = document.getElementById('enquiryForm');
const overlay = document.getElementById('modalOverlay');

const RULES = {
  name:    { id: 'inp-name',    fld: 'fld-name',
             msg: v => {
               if (v.trim().length < 2)          return 'Please enter your full name (min 2 characters)';
               if (/\d/.test(v))                 return 'Name must not contain numbers';
               if (!/^[A-Za-z\s.\-']+$/.test(v)) return 'Name should contain letters only';
               return '';
             }},
  phone:   { id: 'inp-phone',   fld: 'fld-phone',
             msg: v => {
               const digits = v.trim().replace(/[\s\-()]/g, '');
               const stripped = digits.replace(/^\+?91/, '');
               if (!/^\d+$/.test(stripped))       return 'Enter digits only — no letters or symbols';
               if (!/^[6-9]\d{9}$/.test(stripped)) return 'Enter a valid 10-digit Indian mobile number (starts with 6–9)';
               return '';
             }},
  email:   { id: 'inp-email',   fld: 'fld-email',
             msg: v => v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Enter a valid email address (e.g. name@company.com)' : '' },
  city:    { id: 'inp-city',    fld: 'fld-city',
             msg: v => v.trim().length < 2 ? 'Please enter your city and state' : '' },
  bagType: { id: 'inp-bagtype', fld: 'fld-bagtype',
             msg: () => selectedBags.length === 0 ? 'Please select at least one bag type' : '' },
  qty:     { id: 'inp-qty',     fld: 'fld-qty',
             msg: v => v.trim().length === 0 ? 'Please enter an approximate quantity' : '' },
  size:    { id: 'inp-size',   fld: 'fld-size',
             msg: () => selectedSizes.length === 0 ? 'Please select at least one bag size' : '' },
};

function showError(rule, message) {
  const fldEl  = document.getElementById(rule.fld);
  const errEl  = fldEl && fldEl.querySelector('.fld-error');
  if (!fldEl) return;
  fldEl.classList.toggle('fld--error', !!message);
  fldEl.classList.toggle('fld--valid', !message && document.getElementById(rule.id).value.trim() !== '');
  if (errEl) errEl.textContent = message;
}

function validateField(rule) {
  const input = document.getElementById(rule.id);
  if (!input) return true;
  const message = rule.msg(input.value);
  showError(rule, message);
  return !message;
}

function validateAll() {
  return Object.values(RULES).map(r => validateField(r)).every(Boolean);
}

/* Live validation on blur */
Object.values(RULES).forEach(rule => {
  const input = document.getElementById(rule.id);
  if (!input) return;
  input.addEventListener('blur', () => validateField(rule));
  input.addEventListener('input', () => {
    const fldEl = document.getElementById(rule.fld);
    if (fldEl && fldEl.classList.contains('fld--error')) validateField(rule);
  });
});

/* ── BAG CHIP MULTI-SELECT ── */
const selectedBags = [];
document.querySelectorAll('#bag-chips .bag-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const val = chip.dataset.value;
    const idx = selectedBags.indexOf(val);
    if (idx === -1) { selectedBags.push(val); chip.classList.add('selected'); }
    else            { selectedBags.splice(idx, 1); chip.classList.remove('selected'); }
    document.getElementById('inp-bagtype').value = selectedBags.join(', ');
    const fldEl = document.getElementById('fld-bagtype');
    if (fldEl && fldEl.classList.contains('fld--error')) validateField(RULES.bagType);
  });
});

/* ── SIZE CHIP MULTI-SELECT ── */
const selectedSizes = [];
document.querySelectorAll('#size-chips .bag-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const val = chip.dataset.value;
    const idx = selectedSizes.indexOf(val);
    if (idx === -1) { selectedSizes.push(val); chip.classList.add('selected'); }
    else            { selectedSizes.splice(idx, 1); chip.classList.remove('selected'); }
    document.getElementById('inp-size').value = selectedSizes.join(', ');
    const fldEl = document.getElementById('fld-size');
    if (fldEl && fldEl.classList.contains('fld--error')) validateField(RULES.size);
  });
});

/* ── PRINT TOGGLE ── */
document.querySelectorAll('.pt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('inp-print').value = btn.dataset.value;
  });
});

/* ── INPUT GUARDS ── */
/* Name: silently strip any digit as user types */
const nameInput = document.getElementById('inp-name');
nameInput && nameInput.addEventListener('input', () => {
  const pos   = nameInput.selectionStart;
  const clean = nameInput.value.replace(/[0-9]/g, '');
  if (clean !== nameInput.value) {
    nameInput.value = clean;
    nameInput.setSelectionRange(pos - 1, pos - 1);
  }
});

/* Phone: allow only digits, +, spaces, hyphens, brackets */
const phoneInput = document.getElementById('inp-phone');
phoneInput && phoneInput.addEventListener('input', () => {
  const pos   = phoneInput.selectionStart;
  const clean = phoneInput.value.replace(/[^\d+\s\-()]/g, '');
  if (clean !== phoneInput.value) {
    phoneInput.value = clean;
    phoneInput.setSelectionRange(pos - 1, pos - 1);
  }
});

const WEB3FORMS_KEY  = 'fb3113a7-498d-41f2-bbbf-8931633a3d2f';
const SHEETS_URL     = 'https://script.google.com/macros/s/AKfycbx_cn2xSVxf2qcCFGYtICuss7cF-c4pHOvc_7Q0-adBrdJDjcX3qymrcK-XqIBAP0Gg/exec';
const WA_NUMBER     = '919756565319';

form && form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateAll()) {
    const firstErr = form.querySelector('.fld--error input, .fld--error select');
    if (firstErr) firstErr.focus();
    return;
  }

  const btn     = form.querySelector('.form-submit');
  const btnText = btn.querySelector('.btn-text');
  btnText.textContent = 'Sending...';
  btn.disabled = true;

  /* ── Collect values ── */
  const name       = document.getElementById('inp-name').value.trim();
  const phone      = document.getElementById('inp-phone').value.trim();
  const email      = document.getElementById('inp-email').value.trim();
  const city       = document.getElementById('inp-city').value.trim();
  const bagType    = selectedBags.join(', ');
  const qty        = document.getElementById('inp-qty').value.trim();
  const bagSize    = document.getElementById('inp-size').value.trim();
  const printing   = document.getElementById('inp-print').value;
  const specs      = document.getElementById('inp-specs').value.trim();
  const printLabel = printing === 'yes' ? 'Yes — With Logo Printing' : 'No — Plain Bags Required';

  /* ── 1. Email via Web3Forms ── */
  try {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

    const payload = new FormData();
    payload.append('access_key',         WEB3FORMS_KEY);
    payload.append('subject',            `New Enquiry: ${bagType} — ${name} (${city})`);
    payload.append('from_name',          'Alorex Packaging LLP Website');
    payload.append('replyto',            email || 'info@alorexpackaging.com');
    payload.append('-- CUSTOMER DETAILS --', '───────────────────────────');
    payload.append('Full Name',          name);
    payload.append('Mobile Number',      phone);
    payload.append('Email Address',      email      || 'Not provided');
    payload.append('City & State',       city);
    payload.append('-- ORDER REQUIREMENTS --', '───────────────────────────');
    payload.append('Bag Type Required',  bagType);
    payload.append('Approx. Quantity',   qty        || 'Not specified');
    payload.append('Size of Bags',       bagSize    || 'Not specified');
    payload.append('Custom Printing',    printLabel);
    payload.append('-- SPECIFICATIONS --', '───────────────────────────');
    payload.append('Additional Notes',   specs      || 'None provided');
    payload.append('-- META --',         '───────────────────────────');
    payload.append('Received At',        timestamp + ' IST');
    payload.append('Source',             'alorexpackaging.com');

    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload });
  } catch (_) { /* silent */ }

  /* ── 2. Save to Google Sheets ── */
  try {
    fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ name, phone, email, city, bagType, bagSize, qty, printing: printLabel, specs }),
    });
  } catch (_) { /* silent */ }

  /* ── 2. Reset UI ── */
  btnText.textContent = 'Submit Enquiry';
  btn.disabled = false;
  form.reset();
  /* Clear chip selections */
  selectedBags.length = 0;
  document.querySelectorAll('.bag-chip').forEach(c => c.classList.remove('selected'));
  document.getElementById('inp-bagtype').value = '';
  /* Reset print toggle to default */
  document.querySelectorAll('.pt-btn').forEach(b => b.classList.remove('active'));
  const defaultPrint = document.querySelector('.pt-btn.pt-yes');
  if (defaultPrint) { defaultPrint.classList.add('active'); document.getElementById('inp-print').value = 'yes'; }
  /* Clear validation states */
  Object.values(RULES).forEach(rule => {
    const fldEl = document.getElementById(rule.fld);
    if (fldEl) fldEl.classList.remove('fld--error', 'fld--valid');
    const errEl = fldEl && fldEl.querySelector('.fld-error');
    if (errEl) errEl.textContent = '';
  });
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
});

function closeModal() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}
overlay && overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── PRODUCT CARD TILT ── */
document.querySelectorAll('.prod-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x     = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
    const y     = ((e.clientY - rect.top)  / rect.height - 0.5) * -6;
    card.style.transform = `translateY(-8px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── COLOUR SWATCH LIVE PREVIEW ── */
const swatches = document.querySelectorAll('.pm-swatch');
const bagBody  = document.querySelector('.pm-bag-body');
swatches.forEach(sw => {
  sw.addEventListener('click', () => {
    const col = getComputedStyle(sw).getPropertyValue('background-color');
    if (bagBody) {
      bagBody.style.transition = 'background 0.4s ease';
      bagBody.style.background = col;
    }
    swatches.forEach(s => { s.style.outline = ''; s.style.outlineOffset = ''; });
    sw.style.outline = '3px solid rgba(255,255,255,0.6)';
    sw.style.outlineOffset = '2px';
  });
});

/* ── PARALLAX HERO SHAPES ── */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const heroGrid = document.querySelector('.hero-grid-pattern');
  if (heroGrid) heroGrid.style.transform = `translateY(${sy * 0.2}px)`;
}, { passive: true });

/* ── CALLBACK POPUP ── */
(function () {
  if (sessionStorage.getItem('cb_shown')) return;
  const overlay = document.getElementById('cbOverlay');
  const form    = document.getElementById('cbForm');
  if (!overlay) return;

  const selectedBags = new Set();

  setTimeout(() => {
    overlay.classList.add('active');
    sessionStorage.setItem('cb_shown', '1');
  }, 6000);

  document.getElementById('cbClose').addEventListener('click', () => overlay.classList.remove('active'));
  document.getElementById('cbSkip').addEventListener('click',  () => overlay.classList.remove('active'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });

  document.querySelectorAll('.cb-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      if (chip.classList.contains('selected')) {
        selectedBags.add(chip.dataset.value);
      } else {
        selectedBags.delete(chip.dataset.value);
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('cb-name').value.trim();
    const phone = document.getElementById('cb-phone').value.trim();
    const city  = document.getElementById('cb-city').value.trim();
    if (!name || !phone || !city) return;

    try {
      fetch('https://script.google.com/macros/s/AKfycbx_cn2xSVxf2qcCFGYtICuss7cF-c4pHOvc_7Q0-adBrdJDjcX3qymrcK-XqIBAP0Gg/exec', {
        method: 'POST', mode: 'no-cors',
        body: JSON.stringify({ name, phone, city, bagType: selectedBags.size ? [...selectedBags].join(', ') : 'Not selected', source: 'Popup' }),
      });
    } catch (_) { /* silent */ }

    /* Show thank you state */
    const modal = overlay.querySelector('.cb-modal');
    modal.innerHTML = `
      <div class="cb-thankyou">
        <div class="cb-ty-confetti">
          <span>🎊</span><span>✨</span><span>🎉</span>
        </div>
        <div class="cb-ty-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 class="cb-ty-title">Thank You, ${name}!</h3>
        <p class="cb-ty-msg">Our team will reach you within <span class="cb-ty-highlight">2 hours</span> with pricing &amp; a free sample dispatch.</p>
        <div class="cb-ty-steps">
          <div class="cb-ty-step"><span>📞</span><p>Callback within 2 hrs</p></div>
          <div class="cb-ty-step"><span>📦</span><p>Free sample dispatched</p></div>
          <div class="cb-ty-step"><span>✅</span><p>No advance payment</p></div>
        </div>
        <button class="cb-ty-btn" onclick="document.getElementById('cbOverlay').classList.remove('active')">
          Continue Exploring →
        </button>
      </div>`;
  });
})();

/* ── CLEAR VALIDATION ON OUTSIDE CLICK ── */
document.addEventListener('click', e => {
  if (!form || form.contains(e.target)) return;
  Object.values(RULES).forEach(rule => {
    const fldEl = document.getElementById(rule.fld);
    if (fldEl) fldEl.classList.remove('fld--error', 'fld--valid');
    const errEl = fldEl && fldEl.querySelector('.fld-error');
    if (errEl) errEl.textContent = '';
  });
});

/* ── STICKY CTA BAR ── */
const stickyCta = document.getElementById('stickyCta');
const waFloat = document.querySelector('.wa-float');
window.addEventListener('scroll', () => {
  if (!stickyCta) return;
  const show = window.scrollY > 500;
  stickyCta.classList.toggle('visible', show);
  if (waFloat) {
    waFloat.style.opacity = show ? '0' : '1';
    waFloat.style.pointerEvents = show ? 'none' : 'auto';
  }
}, { passive: true });

/* ── GSAP-LIKE STAGGERED CARDS ── */
document.querySelectorAll('.products-grid .prod-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});
document.querySelectorAll('.why-cards .why-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 50}ms`;
});
