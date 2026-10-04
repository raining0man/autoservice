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

// Форма записи
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
    showToast(`Спасибо, ${name}! Мы перезвоним в течение 15 минут.`);
    form.reset();
  });
})();

// Кнопки "Заказать" / "В корзину"
(function initCart() {
  document.querySelectorAll('.js-add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => showToast('Заявка отправлена — мы свяжемся с вами'));
  });
})();

// Вкладки блога (Наши работы / Статьи / Новости)
(function initBlogTabs() {
  const tabs = document.querySelectorAll('.blog-tab');
  const sections = document.querySelectorAll('.blog-section');
  if (!tabs.length || !sections.length) return;

  // Активация вкладки по хэшу в URL: #tab-articles, #tab-news
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    const targetTab = document.querySelector(`.blog-tab[data-tab="${hash}"]`);
    if (targetTab) targetTab.classList.add('active');
    document.getElementById(hash).classList.add('active');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
})();

// Фильтры (работают независимо в каждой группе .filter-tabs)
(function initFilters() {
  document.querySelectorAll('.filter-tabs').forEach(group => {
    const buttons = group.querySelectorAll('.filter-btn');
    // Ищем карточки в пределах родительской секции
    const scope = group.closest('.blog-section') || document;
    const cards = scope.querySelectorAll('[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cards.forEach(card => {
          const cat = card.dataset.category;
          if (filter === 'all' || cat === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
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
