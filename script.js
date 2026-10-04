// =====================
// ТЕМА (светлая / тёмная)
// =====================
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon = toggle ? toggle.querySelector('.theme-icon') : null;

  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');

  root.setAttribute('data-theme', initial);
  updateIcon(initial);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(next);
    });
  }

  function updateIcon(theme) {
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
})();

// =====================
// БУРГЕР-МЕНЮ
// =====================
(function initBurger() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('navMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Закрываем меню при клике по ссылке
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });

  // Закрываем при клике вне меню
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
})();

// =====================
// ФОРМА ЗАПИСИ
// =====================
(function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    if (!name || !phone) {
      showToast('Заполните имя и телефон');
      return;
    }

    // Заглушка — потом подключим отправку
    showToast(`Спасибо, ${name}! Мы перезвоним в течение 15 минут.`);
    form.reset();
  });
})();

// =====================
// КОРЗИНА (заглушка)
// =====================
(function initCart() {
  document.querySelectorAll('.js-add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Товар добавлен в корзину');
    });
  });
})();

// =====================
// ВСПОМОГАТЕЛЬНОЕ — всплывающее уведомление
// =====================
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// =====================
// ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ ПРИ СКРОЛЛЕ (только на главной)
// =====================
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');

      links.forEach(link => {
        if (link.getAttribute('href') === `#${id}`) {
          if (scrollPos >= top && scrollPos < bottom) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });
  });
})();
