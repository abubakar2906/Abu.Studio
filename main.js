// Abu.Studio — small progressive enhancements. The site works fully without this file.
(function () {
  var WA_NUMBER = '2349018450336';

  // 1. Every element with data-wa="…" opens WhatsApp with that message pre-filled.
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(el.getAttribute('data-wa'));
    el.target = '_blank';
    el.rel = 'noopener';
  });

  // 2. Project brief form → composes a WhatsApp message (no server needed).
  var form = document.getElementById('brief');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      if (!name) {
        form.elements.name.classList.add('invalid');
        form.elements.name.focus();
        return;
      }
      form.elements.name.classList.remove('invalid');
      var about = form.elements.about.value.trim();
      var msg = 'Hi Abu, I\'m ' + name + '. I\'m interested in ' + form.elements.plan.value + '.';
      if (about) msg += '\n\nAbout my business: ' + about;
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  // 3. Launch-film card: only downloads the video when someone presses play.
  document.querySelectorAll('[data-video]').forEach(function (box) {
    var btn = box.querySelector('.play');
    btn.addEventListener('click', function () {
      var v = document.createElement('video');
      v.src = box.getAttribute('data-video');
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute('aria-label', 'Conductor Labs launch film');
      box.innerHTML = '';
      box.appendChild(v);
      v.focus();
    });
  });

  // 4. Scroll-reveal (CSS hides .reveal only when JS is running, so content is never lost).
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // 5. Nav border on scroll, and hide the mobile action bar when the contact form is on screen.
  var nav = document.querySelector('.nav');
  var bar = document.querySelector('.mbar');
  var contact = document.getElementById('contact');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 8);
    if (bar && contact) {
      var r = contact.getBoundingClientRect();
      var inContact = r.top < window.innerHeight * 0.85 && r.bottom > 0;
      bar.classList.toggle('hide', inContact || window.scrollY < 560);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 6. Light / dark toggle. The <head> script already applied the starting theme.
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function stored() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  apply(root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light'));
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
  // If the visitor never picked a theme, keep following their device when it changes (e.g. at sunset).
  var follow = function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light'); };
  if (media.addEventListener) media.addEventListener('change', follow); else if (media.addListener) media.addListener(follow);

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
