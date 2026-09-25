/**
 * Multi-Select Dropdown Component for Author Filtering
 * Supports: Search filtering, Select All, Clear, Checkbox counting, Form GET submission
 */
document.addEventListener('DOMContentLoaded', function () {
    initMultiSelects();
});

function initMultiSelects() {
    var containers = document.querySelectorAll('.custom-multiselect');
    containers.forEach(function (container) {
        var button = container.querySelector('.dropdown-toggle');
        var btnText = container.querySelector('.ms-btn-text');
        var menu = container.querySelector('.dropdown-menu');
        var searchInput = container.querySelector('.ms-search-input');
        var selectAllBtn = container.querySelector('.ms-select-all');
        var clearAllBtn = container.querySelector('.ms-clear-all');
        var countBadge = container.querySelector('.ms-count-badge');
        var optionsList = container.querySelector('.ms-options-list');
        var optionItems = container.querySelectorAll('.ms-option-item');
        var noResults = container.querySelector('.ms-no-results');

        if (!button || !optionsList) return;

        function updateState() {
            var checkedBoxes = optionsList.querySelectorAll('input[type="checkbox"]:checked');
            var count = checkedBoxes.length;

            if (countBadge) {
                countBadge.textContent = count;
                if (count > 0) {
                    countBadge.classList.remove('badge-secondary', 'badge-light');
                    countBadge.classList.add('badge-primary');
                } else {
                    countBadge.classList.remove('badge-primary');
                    countBadge.classList.add('badge-secondary');
                }
            }

            if (btnText) {
                if (count === 0) {
                    btnText.textContent = 'Barcha mualliflar';
                    btnText.classList.remove('font-weight-bold', 'text-primary');
                } else if (count === 1) {
                    var val = checkedBoxes[0].value;
                    btnText.textContent = val.length > 22 ? val.substring(0, 20) + '...' : val;
                    btnText.classList.add('font-weight-bold', 'text-primary');
                } else {
                    var firstVal = checkedBoxes[0].value;
                    var shortVal = firstVal.length > 14 ? firstVal.substring(0, 12) + '..' : firstVal;
                    btnText.textContent = shortVal + ' (+' + (count - 1) + ')';
                    btnText.classList.add('font-weight-bold', 'text-primary');
                }
            }
        }

        // Initialize state on load
        updateState();

        // Checkbox change listener
        optionsList.addEventListener('change', function (e) {
            if (e.target && e.target.type === 'checkbox') {
                updateState();
            }
        });

        function normStr(str) {
            if (!str) return '';
            return str.toLowerCase()
                .replace(/o['`’‘]/g, 'o')
                .replace(/g['`’‘]/g, 'g')
                .replace(/sh/g, 's')
                .replace(/ch/g, 'c');
        }

        // Search filtering inside dropdown
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                var query = normStr(this.value.trim());
                var visibleCount = 0;

                optionItems.forEach(function (item) {
                    var text = normStr(item.getAttribute('data-text') || item.textContent || '');
                    if (!query || text.indexOf(query) !== -1) {
                        item.style.display = 'flex';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                if (noResults) {
                    noResults.style.display = (visibleCount === 0) ? 'block' : 'none';
                }
            });

            // Prevent Enter from submitting the parent form while typing in search
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

        // Allow clicking anywhere on the option item row to toggle checkbox
        optionItems.forEach(function (item) {
            item.addEventListener('click', function (e) {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
                    var cb = item.querySelector('input[type="checkbox"]');
                    if (cb) {
                        cb.checked = !cb.checked;
                        updateState();
                    }
                }
            });
        });

        // Select all visible
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                optionItems.forEach(function (item) {
                    if (item.style.display !== 'none') {
                        var cb = item.querySelector('input[type="checkbox"]');
                        if (cb) cb.checked = true;
                    }
                });
                updateState();
            });
        }

        // Clear all
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                optionItems.forEach(function (item) {
                    var cb = item.querySelector('input[type="checkbox"]');
                    if (cb) cb.checked = false;
                });
                updateState();
            });
        }

        // Prevent click inside dropdown menu from closing dropdown
        if (menu) {
            menu.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        // Elevate z-index of card and auto-focus search
        function elevateCard() {
            var card = container.closest('.filter-card') || container.closest('.card');
            if (card) {
                card.classList.add('is-open');
                card.style.setProperty('z-index', '1060', 'important');
                card.style.setProperty('position', 'relative', 'important');
            }
            setTimeout(function () {
                if (searchInput) searchInput.focus();
            }, 100);
        }

        function restoreCard() {
            var card = container.closest('.filter-card') || container.closest('.card');
            if (card) {
                card.classList.remove('is-open');
                card.style.setProperty('z-index', '1020', 'important');
            }
        }

        // Vanilla listener on button click
        button.addEventListener('click', function () {
            setTimeout(function () {
                if (container.classList.contains('show') || (menu && menu.classList.contains('show'))) {
                    elevateCard();
                } else {
                    restoreCard();
                }
            }, 50);
        });

        // Click outside listener
        document.addEventListener('click', function (e) {
            if (!container.contains(e.target)) {
                restoreCard();
            }
        });

        // Bootstrap dropdown events: Elevate z-index of card and auto-focus search
        if (typeof jQuery !== 'undefined') {
            $(container).on('show.bs.dropdown', function () {
                elevateCard();
            });

            $(container).on('hide.bs.dropdown', function () {
                restoreCard();
            });
        }
    });
}
