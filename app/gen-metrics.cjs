// Build step: writes MetricType bundles for the renderer (the package root needs Node).
const m = require('@smartspectra/node-sdk');
require('fs').writeFileSync(__dirname + '/metrics.gen.json', JSON.stringify({ breathingMetrics: m.breathingMetrics, cardioMetrics: m.cardioMetrics, faceMetrics: m.faceMetrics }));
