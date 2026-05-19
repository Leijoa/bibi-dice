(function () {
  function makeParticle(opts) {
    var el = document.createElement("span");
    var colors = opts.colors || ["#fbbf24", "#f87171", "#60a5fa", "#34d399"];
    var angle = ((opts.angle == null ? 90 : opts.angle) - 90 + (Math.random() - 0.5) * (opts.spread || 70)) * Math.PI / 180;
    var velocity = 220 + Math.random() * 260;
    var size = 5 + Math.random() * 7;
    var x = (opts.origin && opts.origin.x != null ? opts.origin.x : 0.5) * window.innerWidth;
    var y = (opts.origin && opts.origin.y != null ? opts.origin.y : 0.6) * window.innerHeight;
    var dx = Math.cos(angle) * velocity;
    var dy = -Math.sin(angle) * velocity - Math.random() * 120;
    var spin = (Math.random() - 0.5) * 720;
    var rotate = Math.random() * 360;

    el.style.cssText = [
      "position:fixed",
      "left:" + x + "px",
      "top:" + y + "px",
      "width:" + size + "px",
      "height:" + (size * 0.55) + "px",
      "background:" + colors[Math.floor(Math.random() * colors.length)],
      "border-radius:2px",
      "pointer-events:none",
      "z-index:9999",
      "will-change:transform,opacity"
    ].join(";");
    document.body.appendChild(el);

    var start = performance.now();
    var duration = 900 + Math.random() * 700;
    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      var ease = 1 - Math.pow(1 - t, 3);
      var px = dx * ease;
      var py = dy * ease + 520 * t * t;
      el.style.transform = "translate(" + px + "px," + py + "px) rotate(" + (rotate + spin * t) + "deg)";
      el.style.opacity = String(1 - t);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.remove();
      }
    }
    requestAnimationFrame(tick);
  }

  window.confetti = function (opts) {
    opts = opts || {};
    var count = Math.max(0, Math.min(opts.particleCount || 80, 180));
    for (var i = 0; i < count; i++) makeParticle(opts);
  };
})();
