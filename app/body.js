// Real SmartSpectra input, following the official Electron quickstart. Bundled by esbuild.
const { SmartSpectraSDK } = require('@smartspectra/node-sdk/renderer');
const { decodeMetrics } = require('@smartspectra/node-sdk/messages');
const { applyPacket } = require('./signals.js');
// MetricType bundles: the package root loads native code, so renderer code gets them from main at build time.
const { breathingMetrics, cardioMetrics, faceMetrics } = require('./metrics.gen.json');
let sdk = null;
window.hushBody = {
  async start({ apiKey, onSignal, onHint, onStream, onError }) {
    if (sdk) return;
    sdk = new SmartSpectraSDK({ apiKey, enableTelemetry: false, requestedMetrics: [...breathingMetrics, ...cardioMetrics, ...faceMetrics] });
    const s = { pulse: 0, breath: 0, blink: false, conf: 0, waves: [] };
    sdk.on('streamAvailable', (stream) => onStream(stream));
    sdk.on('metrics', (buf) => { onSignal({ ...applyPacket(s, decodeMetrics(buf)) }); });
    sdk.on('validationStatus', (code, _ts, hint) => onHint(code, hint));
    sdk.on('error', (code, message) => onError(code, message));
    await sdk.start();
  },
  async stop() { if (sdk) { const old = sdk; sdk = null; try { await old.stop(); } catch (e) { /* already dead after a terminal error */ } old.destroy(); } },
  reset() { sdk = null; },
};
