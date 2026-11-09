// Turns one decoded SmartSpectra metrics packet into the game's signal. Pure, unit-tested.
// Packets are batched, so read every sample. SDK confidence is a percentage (0-100); the game uses 0-1.
(function (root) {
  function applyPacket(s, m) {
    const p = m.cardio?.pulseRate?.at(-1);
    if (p) { s.pulse = p.value; s.conf = (p.confidence ?? 0) / 100; }
    const b = m.breathing?.rate?.at(-1);
    if (b) s.breath = b.value;
    s.waves = (m.cardio?.arterialPressureTrace ?? []).map((x) => x.value);
    s.blink = (m.face?.blinking ?? []).some((x) => x.detected);
    return s;
  }
  const api = { applyPacket };
  if (typeof module !== 'undefined') module.exports = api; else root.HushSignals = api;
})(typeof window !== 'undefined' ? window : globalThis);
