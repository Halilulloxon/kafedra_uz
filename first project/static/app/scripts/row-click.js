document.addEventListener('DOMContentLoaded', function () {
    // attach handlers to rows (works for static rows rendered server-side)
    document.querySelectorAll('.clickable-row').forEach(function (row) {
        // make row focusable for keyboard users
        row.tabIndex = 0;

        // click handler (ignore clicks on anchors/buttons/inputs)
        row.addEventListener('click', function (e) {
            if (e.target.closest('a, button, input, select, textarea')) return;
            var href = row.getAttribute('data-href') || row.dataset.href;
            if (href) window.location.href = href;
        });

        // Enter key activates the row
        row.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                var href = row.getAttribute('data-href') || row.dataset.href;
                if (href) window.location.href = href;
            }
        });
    });
});