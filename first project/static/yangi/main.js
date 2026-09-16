// ============================================================
//  EduPortal — Umumiy JavaScript Fayli
// ============================================================

// ---- Filter tugmalari ----
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var parent = btn.closest('.filters');
      parent.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
    });
  });
}

// ---- O'qituvchi profili tablari ----
function showTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(function (t) {
    t.classList.remove('active');
  });
  document.querySelectorAll('.tab').forEach(function (t) {
    t.classList.remove('active');
  });
  var target = document.getElementById('tab-' + name);
  if (target) target.classList.add('active');
  if (el) el.classList.add('active');
}

// ---- Sahifa yuklanganida ishga tushirish ----
document.addEventListener('DOMContentLoaded', function () {
  initFilters();
});
