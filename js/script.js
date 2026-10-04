// Тема
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

// Бургер-меню
(function initBurger() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('navMenu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
})();

// ==================== ФОРМА ЗАЯВКИ ====================
// Отправляем заявку на backend админки.
// Backend (Layero) сохраняет в JSON и отправляет в Telegram.
const ADMIN_API = 'https://autogeometryadmin.layero.app';

(function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#name')?.value.trim() || '';
    const phone = form.querySelector('#phone')?.value.trim() || '';
    const service = form.querySelector('#service')?.value.trim() || '';
    const comment = form.querySelector('#comment')?.value.trim() || '';

    if (!name || !phone) {
      showToast('Заполните имя и телефон');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      showToast('Проверьте номер телефона');
      return;
    }

    const btn = form.querySelector('button[type=submit]');
    const originalText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Отправляем...'; }

    try {
      const res = await fetch(ADMIN_API + '/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, service, comment,
          source: document.title || 'Сайт'
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      showToast(`Спасибо, ${name}! Мы перезвоним в течение 15 минут.`);
      form.reset();
    } catch (err) {
      console.error(err);
      showToast('Не удалось отправить. Позвоните нам: +7 (904) 333-10-24');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
    }
  });
})();

// Кнопки "Заказать" / "В корзину"
(function initCart() {
  document.querySelectorAll('.js-add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => showToast('Заявка отправлена — мы свяжемся с вами'));
  });
})();

// Уведомление
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

// Подсветка активной ссылки при скролле (только на главной)
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + top.offsetHeight;
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
