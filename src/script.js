(function () {
  'use strict';

  // ===== Menu hambúrguer =====
  var menuBtn = document.getElementById('menu-btn');
  var navOverlay = document.getElementById('nav-overlay');
  var navBackdrop = document.getElementById('nav-backdrop');

  function openMenu() {
    if (navOverlay) {
      navOverlay.classList.add('open');
      navOverlay.setAttribute('aria-hidden', 'false');
    }
    if (navBackdrop) {
      navBackdrop.classList.add('open');
      navBackdrop.setAttribute('aria-hidden', 'false');
    }
    if (menuBtn) {
      menuBtn.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Fechar menu');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (navOverlay) {
      navOverlay.classList.remove('open');
      navOverlay.setAttribute('aria-hidden', 'true');
    }
    if (navBackdrop) {
      navBackdrop.classList.remove('open');
      navBackdrop.setAttribute('aria-hidden', 'true');
    }
    if (menuBtn) {
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menu');
    }
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (navOverlay && navOverlay.classList.contains('open')) closeMenu();
      else openMenu();
    });
  }
  if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ===== Hero vídeo fallback =====
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('error', function () {
      this.style.display = 'none';
      var media = document.querySelector('.hero-media');
      if (media) {
        var fallback = document.createElement('div');
        fallback.className = 'hero-fallback';
        fallback.style.cssText = 'position:absolute;inset:0;background:url(src/img/Ceu estrelado.png) center/cover no-repeat;';
        media.insertBefore(fallback, heroVideo);
      }
    });
    if (heroVideo.readyState < 2) heroVideo.load();
  }

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('.reveal');
  const observerOptions = { rootMargin: '0px 0px -60px 0px', threshold: 0.1 };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  revealEls.forEach(function (el, i) {
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.transitionDelay = el.closest('.hero-content') ? (i * 0.1) + 's' : '0.2s';
    revealObserver.observe(el);
  });

  // ===== Carrossel da galeria (arrastável) =====
  (function () {
    var track = document.getElementById('gallery-track');
    var dotsContainer = document.getElementById('gallery-dots');
    if (!track || !dotsContainer) return;

    var slides = track.querySelectorAll('.gallery-slide');
    var count = slides.length;
    if (count === 0) return;

    var container = track.parentElement;
    var containerWidth = function () { return container.offsetWidth; };
    var currentIndex = 0;
    var startX = 0;
    var dragStartOffset = 0;
    var isDragging = false;
    var hasMoved = false;

    function getOffset() {
      return -currentIndex * containerWidth();
    }

    function applyTransform(px) {
      track.style.transform = 'translate3d(' + px + 'px, 0, 0)';
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, count - 1));
      applyTransform(getOffset());
      updateDots();
    }

    function updateDots() {
      var buttons = dotsContainer.querySelectorAll('button');
      buttons.forEach(function (btn, i) {
        btn.classList.toggle('active', i === currentIndex);
      });
    }

    // Criar dots
    for (var i = 0; i < count; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Ir para foto ' + (i + 1));
      btn.addEventListener('click', function (idx) {
        return function () { goTo(idx); };
      }(i));
      dotsContainer.appendChild(btn);
    }
    updateDots();

    function onPointerDown(e) {
      isDragging = true;
      hasMoved = false;
      track.setAttribute('data-moved', '0');
      startX = e.type.indexOf('touch') >= 0 ? e.touches[0].clientX : e.clientX;
      dragStartOffset = getOffset();
      track.classList.add('dragging');
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      var x = e.type.indexOf('touch') >= 0 ? e.touches[0].clientX : e.clientX;
      var diff = x - startX;
      if (Math.abs(diff) > 8) {
        hasMoved = true;
        track.setAttribute('data-moved', '1');
      }
      var next = dragStartOffset + diff;
      var max = 0;
      var min = -(count - 1) * containerWidth();
      next = Math.max(min, Math.min(max, next));
      applyTransform(next);
    }

    function onPointerUp(ev) {
      if (!isDragging) return;
      track.classList.remove('dragging');
      isDragging = false;
      var endX = ev && (ev.type.indexOf('touch') >= 0 && ev.changedTouches && ev.changedTouches[0])
        ? ev.changedTouches[0].clientX
        : (ev && ev.clientX);
      var diff = endX != null ? startX - endX : 0;
      var currentOffset = dragStartOffset + diff;
      var slideWidth = containerWidth();
      var newIndex = Math.round(-currentOffset / slideWidth);
      goTo(newIndex);
    }

    function onTouchEnd(ev) { onPointerUp(ev); }
    function onMouseUp(ev) { onPointerUp(ev); }

    track.addEventListener('mousedown', onPointerDown);
    track.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    window.addEventListener('resize', function () {
      if (!isDragging) applyTransform(getOffset());
    });
  })();

  // ===== Lightbox =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox && lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox && lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var track = document.getElementById('gallery-track');
      if (track && track.getAttribute('data-moved') === '1') {
        e.preventDefault();
        track.setAttribute('data-moved', '0');
        return;
      }
      e.preventDefault();
      const href = this.getAttribute('href');
      const alt = (this.querySelector('img') && this.querySelector('img').getAttribute('alt')) || '';
      if (lightbox && lightboxImg && href) {
        lightboxImg.src = href;
        lightboxImg.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // ===== Header scroll =====
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== Ícones Lucide =====
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  // ===== Suavizar links âncora =====
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    const id = a.getAttribute('href');
    if (id === '#') return;
    a.addEventListener('click', function (e) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
