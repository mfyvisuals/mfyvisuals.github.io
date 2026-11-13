// Small-screen navigation for the selected cinematic layout.
const cinemaMenu = document.querySelector('.cinema-menu');
const cinemaNav = document.getElementById('cinema-nav');
if (cinemaMenu && cinemaNav) {
  const closeCinemaMenu = () => {
    cinemaNav.classList.remove('is-open');
    cinemaMenu.setAttribute('aria-expanded', 'false');
    cinemaMenu.textContent = 'Menü';
  };
  cinemaMenu.addEventListener('click', () => {
    const opened = cinemaNav.classList.toggle('is-open');
    cinemaMenu.setAttribute('aria-expanded', String(opened));
    cinemaMenu.textContent = opened ? 'Kapat' : 'Menü';
  });
  cinemaNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeCinemaMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && cinemaNav.classList.contains('is-open')) {
      closeCinemaMenu();
      cinemaMenu.focus();
    }
  });
}
