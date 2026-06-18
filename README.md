# Sawaariya Seth Enterprises — Official Website

> Premium Non-Woven Bag Manufacturer · Proudly Indian

A fully responsive, production-ready static website for **Sawaariya Seth Enterprises**, a leading non-woven bag manufacturer based in India. Built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## Live Website

[sawaariyasethenterprises.github.io/Sawaariya-Seth-](https://sawaariyasethenterprises.github.io/Sawaariya-Seth-)

---

## About the Business

Sawaariya Seth Enterprises manufactures high-quality non-woven bags for retailers, brands, distributors, and wholesalers across India. Products are available in bulk with custom logo printing options and are sourced 100% from Indian manufacturing.

**Products offered:**
- W-Cut Bags
- U-Cut Bags
- D-Cut Bags
- Box Bags (Structured)
- Loop Handle Bags
- BOPP Laminated Bags

---

## Website Sections

| Section | Description |
|---|---|
| **Hero** | Brand intro with animated metric counters (clients, orders, cities, experience) |
| **Marquee Strip** | Scrolling product feature highlights |
| **About** | Brand story, values, and trust indicators |
| **Products** | 6-card product showcase with 3D hover tilt effect |
| **Custom Printing** | Logo printing capabilities with colour swatch live preview |
| **Process** | 4-step order process (Enquire → Sample → Confirm → Deliver) |
| **Why Us** | Key differentiators with animated icons |
| **Testimonials** | Client reviews |
| **Contact / Enquiry** | Validated enquiry form + business contact details |
| **Footer** | Links, social, tagline |

---

## Features

### Design
- Premium luxury aesthetic with saffron (`#FF6B00`) and navy (`#060C1A`) brand colours
- Custom SVG logo with gradient emblem, bag icon, and Cinzel wordmark
- Google Fonts: **Cinzel** (display), **Cormorant Garamond** (headings), **Inter** (body)
- CSS design token system via custom properties
- Smooth scroll-triggered fade/slide animations using IntersectionObserver

### Functionality
- Page loader with animated progress bar
- Sticky navbar with scroll state (backdrop blur on scroll)
- Mobile hamburger menu with animated X transform
- Animated counters on scroll (cubic ease-out via requestAnimationFrame)
- Product card 3D tilt on hover (CSS perspective + JS rotateX/rotateY)
- Colour swatch live preview on bag illustration
- Active nav link highlight synced to scroll position
- WhatsApp deep link with pre-filled enquiry message
- Mobile sticky CTA bar (Call / WhatsApp / Get Quote) — dynamically injected, resize-aware
- Success modal on form submission

### Enquiry Form Validation
Full client-side validation with live feedback:

| Field | Rule |
|---|---|
| Full Name | Required · minimum 2 characters |
| Mobile Number | Required · valid Indian 10-digit number (`+91` optional) |
| Email Address | Optional · valid email format if provided |
| City & State | Required · minimum 2 characters |
| Bag Type | Required · must select a product |

- Errors appear on blur with animated red badge
- Live correction — error clears as soon as input becomes valid
- First invalid field is auto-focused on attempted submit
- Form and validation state fully reset after successful submission

### Responsive Design
- Fully mobile-first from 320px up to 1440px+
- CSS Grid collapses from 3-column to 1-column on mobile
- Logo scales down at 768px and 400px breakpoints
- 3D tilt disabled on touch devices
- Mobile sticky CTA bar auto-shows/hides on viewport resize

---

## File Structure

```
Sawaariya Seth Enterprises/
├── index.html      # Main website (all sections)
├── style.css       # All styles + design tokens + animations
├── script.js       # Interactions, validation, animations
└── logo.svg        # Standalone logo (for print / external use)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic) |
| Styles | CSS3 (custom properties, Grid, Flexbox, animations) |
| Scripts | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts (Cinzel, Cormorant Garamond, Inter) |
| Icons | Inline SVG |
| Hosting | GitHub Pages |

No npm, no build step, no frameworks. Open `index.html` directly in any browser.

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/sawaariyasethenterprises/Sawaariya-Seth-.git

# Open in browser
open index.html
```

Or use any static file server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## Customisation Checklist

Before going live, replace the following placeholders in `index.html`:

- [ ] `+91 XXXXX XXXXX` — actual business phone number
- [ ] `XXXX@XXXX.com` — actual business email address
- [ ] WhatsApp links `wa.me/91XXXXXXXXXX` — actual WhatsApp number
- [ ] Metric counters — actual business figures (clients, orders, cities, years)
- [ ] Testimonial names and quotes — real client reviews
- [ ] Form backend — connect EmailJS / Formspree / Web3Forms for real enquiry delivery

---

## Deployment

The site is deployed via **GitHub Pages** from the `main` branch root.

Any `git push` to `main` automatically updates the live site within ~2 minutes.

---

## License

All rights reserved. © Sawaariya Seth Enterprises. Unauthorised reproduction or redistribution is prohibited.
