/* Site-wide enhancements:
   1. Scroll progress bar
   2. Scroll reveal via IntersectionObserver
   3. Active nav link based on current section
   4. Cursor-aware glass highlight on .card
   Respects (prefers-reduced-motion: reduce) for motion-heavy bits. */

(function () {
  'use strict';

  var prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Scroll progress bar */
  (function scrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop || 0;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      var pct = Math.max(0, Math.min(1, scrollTop / max));
      bar.style.transform = 'scaleX(' + pct + ')';
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  /* 2. Scroll reveal */
  var revealObserver = null;
  (function reveal() {
    if (prefersReduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { revealObserver.observe(el); });
  })();

  /* Expose a refresh for dynamically added elements */
  window.__enhanceRefresh = function () {
    if (revealObserver) {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(function (el) { el.classList.add('is-in'); });
    }
  };

  /* 3. Active nav based on scroll position */
  (function activeNav() {
    var nav = document.getElementById('nav-links');
    if (!nav || !('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var ids = Object.keys(map);
    if (!ids.length) return;
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.intersectionRatio; });
      var best = null, bestRatio = 0;
      ids.forEach(function (id) {
        var r = visible[id] || 0;
        if (r > bestRatio) { bestRatio = r; best = id; }
      });
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (best && map[best] && bestRatio > 0) map[best].classList.add('is-active');
    }, { threshold: [0, 0.2, 0.5, 0.8], rootMargin: '-30% 0px -55% 0px' });
    ids.forEach(function (id) { io.observe(document.getElementById(id)); });
  })();

  /* 4. Cursor-aware glass highlight */
  (function cursorGlass() {
    if (prefersReduce) return;
    var active = null;
    var raf = 0;
    var pendingEvent = null;

    function apply() {
      raf = 0;
      if (!active || !pendingEvent) return;
      var rect = active.getBoundingClientRect();
      var x = ((pendingEvent.clientX - rect.left) / rect.width) * 100;
      var y = ((pendingEvent.clientY - rect.top) / rect.height) * 100;
      active.style.setProperty('--mx', x + '%');
      active.style.setProperty('--my', y + '%');
      active.style.setProperty('--mo', '1');
    }

    function clear(el) {
      if (!el) return;
      el.style.setProperty('--mo', '0');
    }

    document.addEventListener('pointermove', function (e) {
      var card = e.target && e.target.closest ? e.target.closest('.card') : null;
      if (card !== active) {
        clear(active);
        active = card;
      }
      if (!active) return;
      pendingEvent = e;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
      clear(active); active = null;
    });
    window.addEventListener('blur', function () { clear(active); active = null; });
  })();
})();
