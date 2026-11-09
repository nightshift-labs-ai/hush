// Simulated body for development only. The real signal comes from body.js.
window.MockBody = function () {
  let t = 0, nextBlink = 2.5, level = 0;
  return { tick(dt, keys) {
    t += dt; level += ((keys.panic ? 1 : 0) - level) * Math.min(1, dt * 0.6);
    const slow = !!keys.calm;
    let blink = false; nextBlink -= dt; if (nextBlink <= 0) { blink = true; nextBlink = 2 + Math.random() * 4; }
    return { pulse: 68 + level * 34 + Math.sin(t * 0.3) * 1.5, breath: slow ? 7 : 14, blink, conf: keys.lost ? 0.1 : 0.9, wave: Math.pow(Math.max(0, Math.sin(t * Math.PI * (68 + level * 34) / 60)), 8) };
  } };
};
