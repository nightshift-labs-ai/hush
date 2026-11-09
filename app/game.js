// Hush rules: pure state machine, no DOM, so it can be unit-tested.
(function (root) {
  const CFG = { duration: 180, calib: 20, start: 100, blinkStep: 1.2, blinkCooldown: 0.9, pulseGain: 0.55, baseDrift: 0.2, breathRetreat: 3.2, confMin: 0.5, lostGrace: 1.2 };
  function create() {
    return { phase: 'calibrate', t: 0, calibT: 0, dist: CFG.start, samples: [], breaths: [], basePulse: null, baseBreath: null,
      lastBlink: -9, lost: 0, blinks: 0, paused: false, flicker: 0, pulse: 0, breath: 0, reason: '', log: [], blinkT: [], nextLog: 0 };
  }
  function median(a) { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; }
  // sig = {pulse, breath, blink:boolean, conf:0..1}
  function step(g, dt, sig) {
    if (g.phase === 'won' || g.phase === 'caught') return g;
    g.flicker = Math.max(0, g.flicker - dt * 4);
    const ok = sig && sig.conf >= CFG.confMin && sig.pulse > 0;
    g.lost = ok ? 0 : g.lost + dt;
    g.paused = g.lost > CFG.lostGrace;   // losing the face pauses play: never a penalty
    if (g.paused || !ok) return g;
    g.pulse = sig.pulse; g.breath = sig.breath;
    if (g.phase === 'calibrate') {
      g.calibT += dt; g.samples.push(sig.pulse); if (sig.breath > 0) g.breaths.push(sig.breath);
      if (g.calibT >= CFG.calib) { g.basePulse = median(g.samples); g.baseBreath = median(g.breaths) || 14; g.phase = 'play'; }
      return g;
    }
    g.t += dt;
    if (sig.blink && g.t - g.lastBlink >= CFG.blinkCooldown) { g.lastBlink = g.t; g.blinks++; g.blinkT.push(g.t); g.dist -= CFG.blinkStep; g.flicker = 1; }
    const over = Math.max(0, sig.pulse - g.basePulse);
    g.dist -= (CFG.baseDrift + over * CFG.pulseGain * 0.1) * dt;
    if (sig.breath > 0 && sig.breath < g.baseBreath - 1) g.dist = Math.min(CFG.start, g.dist + CFG.breathRetreat * dt);
    if (g.dist <= 0) { g.dist = 0; g.phase = 'caught'; g.reason = g.t - g.lastBlink < 0.4 ? 'blink' : 'pulse'; }
    else if (g.t >= CFG.duration) g.phase = 'won';
    // In-memory record for the end screen only; it does not affect any rule above.
    if (g.t >= g.nextLog || g.phase !== 'play') { g.log.push({ t: g.t, p: sig.pulse, d: g.dist, calm: sig.breath > 0 && sig.breath < g.baseBreath - 1 }); g.nextLog += 1; }
    return g;
  }
  // What the end screen says about a finished round.
  function notes(g) {
    let peak = 0, peakT = 0, closest = CFG.start, calmS = 0, calmN = 0, was = false;
    g.log.forEach((r, i) => {
      if (r.p > peak) { peak = r.p; peakT = r.t; }
      closest = Math.min(closest, r.d);
      if (r.calm) { calmS += i ? r.t - g.log[i - 1].t : 0; if (!was) calmN++; }
      was = r.calm;
    });
    return { peak: Math.round(peak), peakT, over: Math.round(peak - g.basePulse), closest: Math.round(closest), calmS: Math.round(calmS), calmN, blinks: g.blinks };
  }
  const api = { CFG, create, step, median, notes };
  if (typeof module !== 'undefined') module.exports = api; else root.Hush = api;
})(typeof window !== 'undefined' ? window : globalThis);
