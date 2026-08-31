/**
 * NUV KHELAIYA — PASS VERIFICATION & GATEKEEPER ENGINE
 * Cultural Committee of Navrachana University
 */

// Simulated Pre-Seeded Pass Database
const INITIAL_PASS_DATABASE = [
  { id: 'NK-2026-8812', name: 'Aarav Patel', category: 'VIP All-Access', email: 'aarav.p@nuv.ac.in', checkedIn: false, checkInTime: null, gate: 'Gate A - VIP North' },
  { id: 'NK-2026-4401', name: 'Riya Sharma', category: 'General Pass', email: 'riya.s@nuv.ac.in', checkedIn: false, checkInTime: null, gate: 'Gate B - East Quad' },
  { id: 'NK-2026-9032', name: 'Kabir Mehta', category: 'Squad Pass', email: 'kabir.m@nuv.ac.in', checkedIn: false, checkInTime: null, gate: 'Gate C - Main Dome' },
  { id: 'NK-2026-1044', name: 'Ananya Desai', category: 'VIP All-Access', email: 'ananya.d@nuv.ac.in', checkedIn: true, checkInTime: '07:15 PM', gate: 'Gate A - VIP North' },
  { id: 'NK-2026-5520', name: 'Devansh Joshi', category: 'General Pass', email: 'devansh.j@nuv.ac.in', checkedIn: false, checkInTime: null, gate: 'Gate B - East Quad' },
  { id: 'NK-2026-3390', name: 'Ishita Shah', category: 'General Pass', email: 'ishita.s@nuv.ac.in', checkedIn: false, checkInTime: null, gate: 'Gate B - East Quad' },
  { id: 'NK-2026-7711', name: 'Rohan Trivedi', category: 'VIP All-Access', email: 'rohan.t@nuv.ac.in', checkedIn: false, checkInTime: null, gate: 'Gate A - VIP North' },
  { id: 'NK-2026-2245', name: 'Khushi Panchal', category: 'Squad Pass', email: 'khushi.p@nuv.ac.in', checkedIn: false, checkInTime: null, gate: 'Gate C - Main Dome' }
];

class VerificationEngine {
  constructor() {
    this.initDatabase();
    this.initAudio();
  }

  initDatabase() {
    if (!localStorage.getItem('nuv_khelaiya_passes')) {
      localStorage.setItem('nuv_khelaiya_passes', JSON.stringify(INITIAL_PASS_DATABASE));
    }
    if (!localStorage.getItem('nuv_khelaiya_logs')) {
      localStorage.setItem('nuv_khelaiya_logs', JSON.stringify([
        { id: 'NK-2026-1044', name: 'Ananya Desai', status: 'VALID', timestamp: '07:15 PM', gate: 'Gate A' }
      ]));
    }
    if (!localStorage.getItem('nuv_cached_count')) {
      localStorage.setItem('nuv_cached_count', '14');
    }
  }

  getPasses() {
    return JSON.parse(localStorage.getItem('nuv_khelaiya_passes')) || [];
  }

  savePasses(passes) {
    localStorage.setItem('nuv_khelaiya_passes', JSON.stringify(passes));
  }

  getLogs() {
    return JSON.parse(localStorage.getItem('nuv_logs')) || [];
  }

  initAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBeep(type) {
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (type === 'valid') {
      // Pleasant melodious chord chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc2.frequency.setValueAtTime(880.00, now); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);

    } else if (type === 'duplicate') {
      // Double amber warning buzz
      [0, 0.15].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now + offset);
        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });

    } else if (type === 'invalid') {
      // Harsh low error buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  verifyPass(passId) {
    const passes = this.getPasses();
    const cleanId = passId.trim().toUpperCase();
    const pass = passes.find(p => p.id === cleanId);

    if (!pass) {
      this.playBeep('invalid');
      return {
        status: 'INVALID',
        message: 'Pass ID not found in database. Entry denied.',
        passId: cleanId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    if (pass.checkedIn) {
      this.playBeep('duplicate');
      return {
        status: 'DUPLICATE',
        message: `Already checked in at ${pass.checkInTime || 'earlier today'} via ${pass.gate || 'Main Gate'}.`,
        pass: pass,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    this.playBeep('valid');
    return {
      status: 'VALID',
      message: 'Verified successfully. Access granted.',
      pass: pass,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  checkInPass(passId) {
    const passes = this.getPasses();
    const cleanId = passId.trim().toUpperCase();
    const passIndex = passes.findIndex(p => p.id === cleanId);

    if (passIndex !== -1 && !passes[passIndex].checkedIn) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      passes[passIndex].checkedIn = true;
      passes[passIndex].checkInTime = timeStr;
      this.savePasses(passes);

      // Increment offline cached count
      let cached = parseInt(localStorage.getItem('nuv_cached_count') || '0', 10);
      localStorage.setItem('nuv_cached_count', (cached + 1).toString());

      return passes[passIndex];
    }
    return null;
  }

  getStats() {
    const passes = this.getPasses();
    const total = passes.length;
    const checkedIn = passes.filter(p => p.checkedIn).length;
    const remaining = total - checkedIn;
    const cached = parseInt(localStorage.getItem('nuv_cached_count') || '14', 10);

    return { total, checkedIn, remaining, cached };
  }
}

// Global Engine Instance
window.verificationEngine = new VerificationEngine();

// Hookup interactive landing page simulator if present
document.addEventListener('DOMContentLoaded', () => {
  initLandingPageSimulator();
  initOperationalVerifyPage();
});

/**
 * LANDING PAGE INTERACTIVE SIMULATOR
 */
function initLandingPageSimulator() {
  const displayScreen = document.querySelector('.sim-display-screen');
  const btnValid = document.querySelector('.sim-btn-valid');
  const btnDuplicate = document.querySelector('.sim-btn-duplicate');
  const btnInvalid = document.querySelector('.sim-btn-invalid');

  if (!displayScreen || !btnValid) return;

  function renderSimState(result) {
    displayScreen.className = `sim-display-screen state-${result.status.toLowerCase()}`;

    if (result.status === 'VALID') {
      displayScreen.innerHTML = `
        <div style="color: var(--emerald-bright); font-size: 2.2rem; font-family: var(--font-royal); margin-bottom: 0.4rem;">✓ PASS VERIFIED</div>
        <div style="font-family: var(--font-accent); font-size: 0.9rem; letter-spacing: 0.15em; color: var(--gold-champagne); text-transform: uppercase; margin-bottom: 1.2rem;">ENTRY GRANTED</div>
        <div style="display: flex; gap: 2rem; justify-content: center; font-size: 0.9rem; text-align: left; background: rgba(0,0,0,0.4); padding: 1rem 1.8rem; border-radius: 1rem; border: 1px solid var(--border-emerald);">
          <div>
            <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; display: block;">ATTENDEE</span>
            <strong>${result.pass.name}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; display: block;">PASS ID</span>
            <strong>${result.pass.id}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; display: block;">TIME</span>
            <strong style="color: var(--emerald-bright);">${result.time}</strong>
          </div>
        </div>
      `;
    } else if (result.status === 'DUPLICATE') {
      displayScreen.innerHTML = `
        <div style="color: #f59e0b; font-size: 2.2rem; font-family: var(--font-royal); margin-bottom: 0.4rem;">⚠ ALREADY CHECKED IN</div>
        <div style="font-family: var(--font-accent); font-size: 0.85rem; letter-spacing: 0.15em; color: #fbbf24; text-transform: uppercase; margin-bottom: 1.2rem;">DUPLICATE SCAN DETECTED</div>
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.4); padding: 1rem 1.5rem; border-radius: 1rem; color: #fde68a; font-size: 0.9rem;">
          ${result.message}
        </div>
      `;
    } else {
      displayScreen.innerHTML = `
        <div style="color: #ef4444; font-size: 2.2rem; font-family: var(--font-royal); margin-bottom: 0.4rem;">✕ INVALID PASS</div>
        <div style="font-family: var(--font-accent); font-size: 0.85rem; letter-spacing: 0.15em; color: #f87171; text-transform: uppercase; margin-bottom: 1.2rem;">ACCESS DENIED</div>
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.4); padding: 1rem 1.5rem; border-radius: 1rem; color: #fca5a5; font-size: 0.9rem;">
          ${result.message}
        </div>
      `;
    }
  }

  btnValid.addEventListener('click', () => {
    const res = window.verificationEngine.verifyPass('NK-2026-8812');
    renderSimState(res);
  });

  btnDuplicate.addEventListener('click', () => {
    const res = window.verificationEngine.verifyPass('NK-2026-1044');
    renderSimState(res);
  });

  btnInvalid.addEventListener('click', () => {
    const res = window.verificationEngine.verifyPass('INVALID-9999');
    renderSimState(res);
  });
}

/**
 * OPERATIONAL VERIFY.HTML LOGIC
 */
function initOperationalVerifyPage() {
  const statsTotal = document.getElementById('stat-total-passes');
  if (!statsTotal) return;

  const statsChecked = document.getElementById('stat-checked-in');
  const statsRemaining = document.getElementById('stat-remaining');
  const cachedBadge = document.getElementById('cached-count-badge');
  const scanInput = document.getElementById('manual-pass-input');
  const scanBtn = document.getElementById('btn-manual-verify');
  const resultContainer = document.getElementById('operational-result-card');
  const syncBtn = document.getElementById('btn-sync-cloud');
  const syncToast = document.getElementById('sync-toast');
  const simulateScanBtn = document.getElementById('btn-simulate-camera-scan');

  function updateDashboard() {
    const stats = window.verificationEngine.getStats();
    if (statsTotal) statsTotal.textContent = stats.total;
    if (statsChecked) statsChecked.textContent = stats.checkedIn;
    if (statsRemaining) statsRemaining.textContent = stats.remaining;
    if (cachedBadge) cachedBadge.textContent = `${stats.cached} CHECK-INS CACHED`;
  }

  function handleVerification(passId) {
    if (!passId) return;
    const result = window.verificationEngine.verifyPass(passId);

    if (resultContainer) {
      resultContainer.style.display = 'block';
      if (result.status === 'VALID') {
        resultContainer.innerHTML = `
          <div style="background: rgba(18, 22, 27, 0.95); border: 2px solid var(--emerald-bright); border-radius: 1.5rem; padding: 2rem; text-align: center; box-shadow: var(--glow-emerald);">
            <div style="color: var(--emerald-bright); font-size: 2rem; font-family: var(--font-royal); margin-bottom: 0.3rem;">✓ PASS VERIFIED</div>
            <div style="font-family: var(--font-accent); color: var(--gold-champagne); letter-spacing: 0.15em; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 1.5rem;">ENTRY GRANTED</div>
            <div style="text-align: left; background: rgba(0,0,0,0.5); padding: 1.2rem; border-radius: 1rem; margin-bottom: 1.5rem; border: 1px solid var(--border-emerald);">
              <p style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">NAME</p>
              <h3 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.8rem;">${result.pass.name}</h3>
              <p style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">PASS ID</p>
              <p style="font-family: var(--font-accent); font-size: 1.1rem; color: var(--gold-warm); font-weight: 700; margin-bottom: 0.8rem;">${result.pass.id}</p>
              <p style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">CATEGORY</p>
              <p style="color: var(--emerald-bright); font-weight: 600;">${result.pass.category}</p>
            </div>
            <button id="btn-confirm-checkin" class="btn-luxury btn-luxury-emerald" style="width: 100%;">CONFIRM GATE CHECK-IN</button>
          </div>
        `;

        document.getElementById('btn-confirm-checkin').addEventListener('click', () => {
          window.verificationEngine.checkInPass(result.pass.id);
          updateDashboard();
          resultContainer.innerHTML = `
            <div style="background: rgba(18, 22, 27, 0.95); border: 1px solid var(--border-gold); border-radius: 1.5rem; padding: 2rem; text-align: center;">
              <h3 style="color: var(--gold-warm); font-family: var(--font-display); margin-bottom: 0.5rem;">CHECK-IN COMPLETED</h3>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">Gate Pass ${result.pass.id} marked as Checked In.</p>
            </div>
          `;
        });

      } else if (result.status === 'DUPLICATE') {
        resultContainer.innerHTML = `
          <div style="background: rgba(18, 22, 27, 0.95); border: 2px solid #f59e0b; border-radius: 1.5rem; padding: 2rem; text-align: center; box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);">
            <div style="color: #f59e0b; font-size: 2rem; font-family: var(--font-royal); margin-bottom: 0.3rem;">⚠ ALREADY CHECKED IN</div>
            <div style="font-family: var(--font-accent); color: #fbbf24; letter-spacing: 0.15em; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 1.5rem;">DUPLICATE PASS ENTRY</div>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">${result.message}</p>
          </div>
        `;
      } else {
        resultContainer.innerHTML = `
          <div style="background: rgba(18, 22, 27, 0.95); border: 2px solid #ef4444; border-radius: 1.5rem; padding: 2rem; text-align: center; box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);">
            <div style="color: #ef4444; font-size: 2rem; font-family: var(--font-royal); margin-bottom: 0.3rem;">✕ INVALID PASS</div>
            <div style="font-family: var(--font-accent); color: #f87171; letter-spacing: 0.15em; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 1.5rem;">ACCESS DENIED</div>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">${result.message}</p>
          </div>
        `;
      }
    }
  }

  if (scanBtn && scanInput) {
    scanBtn.addEventListener('click', () => {
      handleVerification(scanInput.value);
    });
    scanInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleVerification(scanInput.value);
    });
  }

  if (simulateScanBtn) {
    simulateScanBtn.addEventListener('click', () => {
      const sampleIds = ['NK-2026-4401', 'NK-2026-9032', 'NK-2026-1044', 'NK-INVALID-001'];
      const randomId = sampleIds[Math.floor(Math.random() * sampleIds.length)];
      if (scanInput) scanInput.value = randomId;
      handleVerification(randomId);
    });
  }

  if (syncBtn && syncToast) {
    syncBtn.addEventListener('click', () => {
      syncBtn.textContent = 'SYNCING...';
      syncBtn.style.opacity = '0.7';
      setTimeout(() => {
        syncBtn.textContent = 'SYNC DATA';
        syncBtn.style.opacity = '1';
        syncToast.style.opacity = '1';
        localStorage.setItem('nuv_cached_count', '0');
        updateDashboard();
        setTimeout(() => {
          syncToast.style.opacity = '0';
        }, 3000);
      }, 1400);
    });
  }

  updateDashboard();
}
