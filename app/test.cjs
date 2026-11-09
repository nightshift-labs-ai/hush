const H = require('./game.js'), assert = require('assert');
const calm = { pulse: 70, breath: 14, blink: false, conf: 0.9 };
function run(g, s, secs) { for (let i = 0; i < secs * 20; i++) H.step(g, 0.05, typeof s === 'function' ? s(i) : s); return g; }
let g = run(H.create(), calm, 21); assert.equal(g.phase, 'play'); assert.equal(g.basePulse, 70);
const d = g.dist; run(g, { ...calm, conf: 0.1 }, 10); assert.ok(g.paused); assert.equal(g.dist, d, 'lost signal must not punish');
run(g, calm, 1); assert.ok(!g.paused);
const a = H.create(); run(a, calm, 21); run(a, calm, 30); const b = H.create(); run(b, calm, 21); run(b, { ...calm, pulse: 100 }, 30); assert.ok(b.dist < a.dist, 'high pulse closes faster');
const c = H.create(); run(c, calm, 21); run(c, { ...calm, blink: true }, 2); assert.ok(c.blinks <= 3, 'blink cooldown'); 
const e = H.create(); run(e, calm, 21); e.dist = 50; run(e, { ...calm, breath: 8 }, 5); assert.ok(e.dist > 50, 'slow breath retreats');
const f = H.create(); run(f, calm, 21); run(f, calm, 200); assert.equal(f.phase, 'won', 'calm player can win: ' + f.dist);
// realistic player: ~15 blinks/min for the whole run, steady pulse
const r = H.create(); run(r, calm, 21); run(r, (i) => ({ ...calm, blink: i % 80 === 0 }), 185); assert.equal(r.phase, 'won', 'realistic calm player can win: ' + r.dist);
const x = H.create(); run(x, calm, 21); run(x, { ...calm, pulse: 110, blink: true }, 60); assert.equal(x.phase, 'caught');
const S = require('./signals.js');
let s = { pulse: 0, breath: 0, blink: false, conf: 0, waves: [] };
S.applyPacket(s, { cardio: { pulseRate: [{ value: 71, confidence: 87 }], arterialPressureTrace: [{ value: 1 }, { value: 2 }] }, breathing: { rate: [{ value: 13 }] }, face: { blinking: [{ detected: false }, { detected: true }, { detected: false }] } });
assert.equal(s.pulse, 71); assert.ok(Math.abs(s.conf - 0.87) < 1e-9, 'confidence is a percentage'); assert.equal(s.breath, 13); assert.ok(s.blink, 'blink inside a batch counts'); assert.equal(s.waves.length, 2);
S.applyPacket(s, {}); assert.equal(s.pulse, 71, 'empty packet keeps last reading'); assert.equal(s.blink, false); assert.equal(s.waves.length, 0);
console.log('realistic finish dist', r.dist.toFixed(1), 'blinks', r.blinks); console.log('ok; calm finish dist', f.dist.toFixed(1), 'panic caught at t', x.t.toFixed(1));

{ const n = H.create(); run(n, calm, 21); run(n, { ...calm, pulse: 90 }, 10); run(n, { ...calm, breath: 8 }, 6); run(n, calm, 3);
  const s = H.notes(n); assert.equal(s.peak, 90); assert.equal(s.over, 20); assert.equal(s.calmN, 1); assert.ok(s.calmS >= 5 && s.calmS <= 7, 'calm seconds ' + s.calmS); assert.ok(n.log.length >= 19 && n.log.length <= 22);
  const p = H.create(), q = H.create(); run(p, calm, 21); run(q, calm, 21); q.log = null; q.nextLog = Infinity; run(p, { ...calm, pulse: 80 }, 40); run(q, { ...calm, pulse: 80 }, 40); assert.equal(p.dist, q.dist, 'the record must not change the rules'); }
