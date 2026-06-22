/* ══════════════════════════════════════
   SAWAARIYA SETH ENTERPRISES
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
  const spans = hamburger.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
    spans[1].style.cssText = 'opacity:0';
    spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
}));

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  name:    { id: 'inp-name',    fld: 'fld-name',    msg: v => v.trim().length < 2    ? 'Please enter your full name'                        : '' },
  phone:   { id: 'inp-phone',   fld: 'fld-phone',   msg: v => !/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.trim().replace(/\s/g,'')) ? 'Enter a valid 10-digit Indian mobile number' : '' },
  email:   { id: 'inp-email',   fld: 'fld-email',   msg: v => v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Enter a valid email address' : '' },
  city:    { id: 'inp-city',    fld: 'fld-city',    msg: v => v.trim().length < 2    ? 'Please enter your city and state'                   : '' },
  bagType: { id: 'inp-bagtype', fld: 'fld-bagtype', msg: v => v === ''               ? 'Please select a bag type'                           : '' },
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

const WEB3FORMS_KEY = 'fb3113a7-498d-41f2-bbbf-8931633a3d2f';
const WA_NUMBER     = '917055598280';

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
  const name     = document.getElementById('inp-name').value.trim();
  const phone    = document.getElementById('inp-phone').value.trim();
  const email    = document.getElementById('inp-email').value.trim();
  const city     = document.getElementById('inp-city').value.trim();
  const bagType  = document.getElementById('inp-bagtype').value;
  const qty      = document.getElementById('inp-qty').value.trim();
  const printing = document.getElementById('inp-print').value;
  const specs    = document.getElementById('inp-specs').value.trim();
  const printLabel = printing === 'yes' ? 'Yes — With Logo Printing' : 'No — Plain Bags Required';

  /* ── 1. Email via Web3Forms ── */
  try {
    const now       = new Date();
    const timestamp = now.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

    const row = (label, value) => `
      <tr>
        <td style="padding:10px 16px;width:38%;background:#f8f5f1;border-bottom:1px solid #ede8e0;font-size:13px;font-weight:600;color:#5a4a3a;white-space:nowrap;">${label}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #ede8e0;font-size:13px;color:#1a1a2e;">${value}</td>
      </tr>`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0ece6;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece6;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

      <!-- HEADER -->
      <tr>
        <td style="background:linear-gradient(135deg,#0D1730,#1A2E52);padding:32px 36px;text-align:center;">
          <div style="font-size:22px;font-weight:800;color:#FF6B00;letter-spacing:3px;text-transform:uppercase;">SAWAARIYA SETH</div>
          <div style="font-size:11px;font-weight:600;color:#E8B84B;letter-spacing:6px;text-transform:uppercase;margin-top:4px;">ENTERPRISES</div>
          <div style="margin-top:14px;display:inline-block;background:#FF6B00;color:#fff;font-size:11px;font-weight:700;letter-spacing:2px;padding:5px 18px;border-radius:50px;text-transform:uppercase;">New Enquiry Received</div>
        </td>
      </tr>

      <!-- SECTION: CUSTOMER DETAILS -->
      <tr>
        <td style="background:#fff;padding:28px 36px 0;">
          <div style="font-size:11px;font-weight:700;color:#FF6B00;letter-spacing:2.5px;text-transform:uppercase;border-bottom:2px solid #FF6B00;padding-bottom:8px;margin-bottom:0;">Customer Details</div>
        </td>
      </tr>
      <tr>
        <td style="background:#fff;padding:0 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ede8e0;border-radius:8px;overflow:hidden;margin-top:14px;">
            ${row('Full Name', name)}
            ${row('Mobile Number', phone)}
            ${row('Email Address', email || '<span style="color:#aaa;font-style:italic;">Not provided</span>')}
            ${row('City &amp; State', city)}
          </table>
        </td>
      </tr>

      <!-- SECTION: ORDER REQUIREMENTS -->
      <tr>
        <td style="background:#fff;padding:24px 36px 0;">
          <div style="font-size:11px;font-weight:700;color:#FF6B00;letter-spacing:2.5px;text-transform:uppercase;border-bottom:2px solid #FF6B00;padding-bottom:8px;margin-bottom:0;">Order Requirements</div>
        </td>
      </tr>
      <tr>
        <td style="background:#fff;padding:0 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ede8e0;border-radius:8px;overflow:hidden;margin-top:14px;">
            ${row('Bag Type', `<strong>${bagType}</strong>`)}
            ${row('Approx. Quantity', qty || '<span style="color:#aaa;font-style:italic;">Not specified</span>')}
            ${row('Custom Printing', printLabel)}
          </table>
        </td>
      </tr>

      <!-- SECTION: SPECIFICATIONS -->
      <tr>
        <td style="background:#fff;padding:24px 36px 0;">
          <div style="font-size:11px;font-weight:700;color:#FF6B00;letter-spacing:2.5px;text-transform:uppercase;border-bottom:2px solid #FF6B00;padding-bottom:8px;">Additional Specifications</div>
          <div style="background:#f8f5f1;border:1px solid #ede8e0;border-radius:8px;padding:14px 16px;margin-top:14px;font-size:13px;color:#3a3a3a;line-height:1.65;min-height:44px;">
            ${specs || '<span style="color:#aaa;font-style:italic;">None provided</span>'}
          </div>
        </td>
      </tr>

      <!-- ACTION PROMPT -->
      <tr>
        <td style="background:#fff;padding:28px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fff8f2,#fff3e8);border:1px solid #ffd9b8;border-radius:8px;">
            <tr>
              <td style="padding:16px 20px;">
                <div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:6px;">Suggested Next Step</div>
                <div style="font-size:12px;color:#555;line-height:1.6;">Reply directly to this email or call the customer at <strong>${phone}</strong> within 24 hours to confirm requirements and provide a quotation.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#0D1730;padding:20px 36px;text-align:center;">
          <div style="font-size:11px;color:rgba(255,255,255,0.45);line-height:1.8;">
            Received: ${timestamp} IST<br/>
            Source: sawaariyasethenterprises.github.io<br/>
            <span style="color:rgba(255,255,255,0.25);">This is an automated notification. Reply to respond to the customer.</span>
          </div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject:    `New Enquiry: ${bagType} — ${name} (${city})`,
        from_name:  'Sawaariya Seth Enterprises Website',
        replyto:    email || 'sawaariyasethenterprises@gmail.com',
        html,
      }),
    });
  } catch (_) { /* silent */ }

  /* ── 2. Reset UI ── */
  btnText.textContent = 'Submit Enquiry';
  btn.disabled = false;
  form.reset();
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

/* ── STICKY CTA BAR (mobile only) ── */
function createStickyBar() {
  const existing = document.querySelector('.sticky-cta-bar');
  if (window.innerWidth > 768) {
    if (existing) existing.remove();
    return;
  }
  if (existing) return;
  const bar = document.createElement('div');
  bar.className = 'sticky-cta-bar';
  bar.innerHTML = `
    <a href="tel:+917055598280" class="scb-call">📞 Call</a>
    <a href="https://wa.me/917055598280" target="_blank" rel="noopener noreferrer" class="scb-wa">💬 WhatsApp</a>
    <a href="#contact" class="scb-quote">Get Quote</a>
  `;
  document.body.appendChild(bar);

  const style = document.createElement('style');
  style.textContent = `
    .sticky-cta-bar {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 300;
      display: flex; background: #fff;
      border-top: 1px solid #e4ded6;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
    }
    .sticky-cta-bar a {
      flex: 1; text-align: center; padding: 14px 8px;
      font-size: 0.82rem; font-weight: 700; color: #1a1a2e;
      text-decoration: none; transition: background 0.2s;
    }
    .scb-call { border-right: 1px solid #e4ded6; }
    .scb-wa { background: rgba(37,211,102,0.08); color: #1a7a3a; border-right: 1px solid #e4ded6; }
    .scb-quote { background: #FF6B00; color: #fff; }
    .wa-float { bottom: 80px; }
  `;
  document.head.appendChild(style);
}
createStickyBar();
window.addEventListener('resize', createStickyBar, { passive: true });

/* ── GSAP-LIKE STAGGERED CARDS ── */
document.querySelectorAll('.products-grid .prod-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});
document.querySelectorAll('.why-cards .why-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 50}ms`;
});
