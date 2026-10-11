/* Shared master chain: used by the test bench AND the website, so renders match what visitors hear.
   input -> soft-clip safety -> compressor (gentle glue + peak control) -> output gain */
(function (g) {
  g.SA_MASTER = function (ctx) {
    var input = ctx.createGain();
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3.5;
    comp.attack.value = 0.008; comp.release.value = 0.3;
    var out = ctx.createGain(); out.gain.value = 1;
    input.connect(comp); comp.connect(out);
    return { input: input, output: out, comp: comp };
  };
})(typeof window !== 'undefined' ? window : globalThis);
