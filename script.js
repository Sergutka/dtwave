// =========================================================
// WAVE — интерактивность сайта
// =========================================================
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileClose = document.querySelector('.mobile-close');
  function openNav(){ mobileNav.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeNav(){ mobileNav.classList.remove('open'); document.body.style.overflow=''; }
  if(navToggle){ navToggle.addEventListener('click', openNav); }
  if(mobileClose){ mobileClose.addEventListener('click', closeNav); }
  document.querySelectorAll('.mobile-nav a').forEach(function(a){
    a.addEventListener('click', closeNav);
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  /* ---------- Breathing wave rail = scroll progress ---------- */
  var waveFill = document.getElementById('waveFillWrap');
  function updateWaveProgress(){
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var scrollHeight = (doc.scrollHeight - doc.clientHeight) || 1;
    var pct = Math.min(1, Math.max(0, scrollTop / scrollHeight));
    if(waveFill){
      waveFill.style.clipPath = 'inset(0 ' + (100 - pct*100) + '% 0 0)';
    }
  }
  document.addEventListener('scroll', updateWaveProgress, { passive:true });
  updateWaveProgress();

  /* ---------- Header shrink ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader(){
    if(window.scrollY > 40){ header.style.background = 'rgba(11,11,10,0.95)'; }
    else{ header.style.background = 'rgba(11,11,10,0.82)'; }
  }
  document.addEventListener('scroll', onScrollHeader, { passive:true });

  /* ---------- Count-up numbers ---------- */
  var counters = document.querySelectorAll('[data-count-to]');
  function animateCount(el){
    var to = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    if(reduceMotion){ el.textContent = to + suffix; return; }
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(to * eased);
      el.textContent = current + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
      else { el.textContent = to + suffix; }
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var cIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCount(entry.target);
          cIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function(el){ cIo.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- FAQ / Science accordion ---------- */
  document.querySelectorAll('.acc-head').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.acc-item');
      var body = item.querySelector('.acc-body');
      var isOpen = item.classList.contains('open');
      // close siblings within same accordion group
      var group = item.parentElement;
      group.querySelectorAll('.acc-item.open').forEach(function(openItem){
        if(openItem !== item){
          openItem.classList.remove('open');
          openItem.querySelector('.acc-body').style.maxHeight = null;
        }
      });
      if(isOpen){
        item.classList.remove('open');
        body.style.maxHeight = null;
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contact form (mailto fallback) ---------- */
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value.trim();
      var contact = form.querySelector('[name="contact"]').value.trim();
      var goal = form.querySelector('[name="goal"]').value.trim();
      var status = document.getElementById('formStatus');

      if(!name || !contact){
        status.textContent = 'Заполните имя и контакт для связи.';
        return;
      }

      var subject = encodeURIComponent('Заявка с сайта WAVE от ' + name);
      var body = encodeURIComponent(
        'Имя: ' + name + '\n' +
        'Контакт: ' + contact + '\n' +
        'Цель / запрос: ' + (goal || '—')
      );
      // TODO: заменить на реальный email или подключить сервис (Formspree / Telegram-бот / CRM)
      window.location.href = 'mailto:info@wave-system.example?subject=' + subject + '&body=' + body;
      status.textContent = 'Открываем почтовый клиент для отправки заявки…';
      form.reset();
    });
  }

  /* ---------- Smooth anchor offset (fixed header + wave rail) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length < 2) return;
      var target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      var offset = 100;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
})();
