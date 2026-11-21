/* ReSource Admin Dashboard interactions. Chart figures are demo data. */
(() => {
  const layout = document.getElementById('adminLayout');
  const menuToggle = document.getElementById('menuToggle');
  const profileToggle = document.getElementById('profileToggle');
  const profileDropdown = document.getElementById('profileDropdown');

  menuToggle?.addEventListener('click', () => {
    const open = layout.classList.toggle('sidebar-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  profileToggle?.addEventListener('click', () => {
    const open = profileDropdown.hidden;
    profileDropdown.hidden = !open;
    profileToggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (event) => {
    const wrap = document.querySelector('.admin-profile-wrap');
    if (wrap && !wrap.contains(event.target)) {
      profileDropdown.hidden = true;
      profileToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('[data-logout]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.confirm('Are you sure you want to logout?')) {
        window.alert('Demo only: connect this button to your real logout/session route.');
      }
    });
  });

  if (typeof Chart === 'undefined') return;

  const registrationCanvas = document.getElementById('registrationChart');
  if (registrationCanvas) new Chart(registrationCanvas, {
    type: 'line',
    data: {
      labels: ['Dec 10', 'Dec 11', 'Dec 12', 'Dec 13', 'Dec 14', 'Dec 15', 'Dec 16'],
      datasets: [{
        data: [10, 15, 25, 20, 22, 30, 38],
        borderColor: '#087bf4', backgroundColor: 'rgba(8,123,244,.10)',
        fill: true, tension: .25, borderWidth: 2.5, pointRadius: 4,
        pointBackgroundColor: '#087bf4'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 40, ticks: { stepSize: 10 }, grid: { color: '#e8edf4' } },
        x: { grid: { color: '#edf1f6' } }
      }
    }
  });

  const categoryCanvas = document.getElementById('categoryChart');
  if (categoryCanvas) new Chart(categoryCanvas, {
    type: 'pie',
    data: {
      labels: ['Plastic', 'Metal', 'Wood', 'Textile', 'Paper', 'Others'],
      datasets: [{ data: [28, 22, 18, 15, 10, 7],
        backgroundColor: ['#087bf4', '#079c62', '#ffad19', '#8050df', '#3766a5', '#20b8b8'],
        borderColor: '#fff', borderWidth: 2 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });
})();
