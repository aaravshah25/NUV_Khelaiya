# NUV KHELAIYA — IMMERSIVE CULTURAL FESTIVAL WEBSITE
### Cultural Committee of Navrachana University (NUV)

A **cinematic, award-winning, Apple & Awwwards-grade cultural festival web application** engineered with **Pure HTML5, CSS3, and Vanilla JavaScript** (plus creative CDNs: GSAP, GSAP ScrollTrigger, and Lenis). Zero frameworks, zero build steps, and 100% plug-and-play.

---

## 🌟 Key Visual & Technical Highlights

1. **Luxury Haute Cultural Visual Identity**:
   - Refined luxury palette: Deep Charcoal Noir (`#0b0c0e`), Midnight Pine / Forest Emerald (`#0a1714`), Champagne Gold & Warm Beige (`#dfcb9f` / `#f4ebd0`), and Antique Brass (`#c5a059`).
   - Dynamic custom cursor with interactive magnetic scaling and contextual states (`VIEW`, `EXPLORE`).
   - Frosted smoked glassmorphism with delicate Champagne borders and ambient mesh lighting.

2. **GSAP ScrollTrigger Choreography**:
   - **7-Stage Hero Sequence**: Pinned cinematic movie intro scaling and tracking `"KHELAIYA"` with depth letter displacement, background intensity zoom, festival lighting bursts, and metadata entrance.
   - **Pinned Horizontal Cultural Experience**: 6 panels (`01 GARBA`, `02 DANCE`, `03 MUSIC`, `04 COMPETITIONS`, `05 FASHION`, `06 CELEBRATION`) with multi-speed image parallax.
   - **Illuminating Event Timeline**: Progressive central neon laser line tracking scroll depth, with cursor-followed floating image previews on hover.
   - **Signature "Memories" Vortex Collapse**: Floating photo shards drifting across the viewport, rotating and tumbling, then accelerating and collapsing inward into the glowing golden `"NUV KHELAIYA"` seal.

3. **Interactive 3D Holographic Pass & Customizer**:
   - Realistic 3D perspective card with mouse-tilt reflection, holographic foil sheen, dynamic barcode/QR, and attendees live-customization.

4. **Gatekeeper Verification Portal (`verify.html`)**:
   - Operational security tool designed for speed, clarity, and reliability.
   - Simulated optical camera viewfinder with live laser scan sweep beam.
   - **Web Audio API Sound Synthesizer**: Procedurally generates melodious major chord chimes for valid passes, double amber alert tones for duplicates, and low buzz rejections for invalid passes.
   - Offline mode caching via `localStorage` with real-time pass metrics counter and cloud sync simulation.

---

## 📁 File Structure

```
NUV-Khelaiya/
├── index.html              # Main cinematic landing experience
├── about.html              # Cultural legacy, committee mission & pillars
├── registration.html       # Digital pass booking, tier comparison & FAQs
├── sponsors.html           # Tiered partner showcase & sponsorship prospectus
├── team.html               # Editorial portrait team cards & volunteer squads
├── gallery.html            # Category-filter masonry layout & fullscreen lightbox
├── contact.html            # Venue directions, campus map & coordinator hotlines
├── verify.html             # Operational Gate Check-in portal
│
├── css/
│   ├── style.css           # Core luxury design system, typography & components
│   ├── animations.css      # Keyframes, laser scan beam, foil sheens & accordions
│   └── responsive.css      # Responsive breakpoints (Desktop, Tablet, Mobile)
│
├── js/
│   ├── main.js             # Lenis smooth scroll, custom cursor, floating navbar
│   ├── animations.js       # GSAP ScrollTrigger 7-stage hero, slider & vortex
│   ├── gallery.js          # Filterable masonry & keyboard lightbox modal
│   └── verification.js     # Gatekeeper verification engine & Web Audio sound FX
│
└── README.md
```

---

## 🚀 How to Run Locally

### Option 1: Direct File Launch
Simply double click `index.html` in your file explorer to open it in any modern browser (Chrome, Edge, Safari, Firefox).

### Option 2: VS Code Live Server (Recommended)
1. Open the `NUV Khelaiya` folder in VS Code.
2. Right click `index.html` and select **"Open with Live Server"**.
3. The website will load at `http://127.0.0.1:5500/index.html`.

---

## 🛡️ Sample Verification Pass IDs (for `verify.html`)
- `NK-2026-8812` — **VALID** (Aarav Patel • VIP All-Access)
- `NK-2026-4401` — **VALID** (Riya Sharma • General Pass)
- `NK-2026-1044` — **DUPLICATE** (Ananya Desai • Already Checked In)
- `NK-INVALID-99` — **INVALID** (Unrecognized pass ID)

---

## ♿ Accessibility & Performance
- Full `prefers-reduced-motion` compliance.
- Zero external build dependencies.
- Hardware-accelerated CSS transforms and `requestAnimationFrame` loops.
