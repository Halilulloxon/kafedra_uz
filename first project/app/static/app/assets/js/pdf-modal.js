/* ==========================================================================
   Kafedralar.uz — PDF ni sayt ichida ko'rsatuvchi modal oyna
   Har qanday .pdf havolasi (yuklab olish havolasidan tashqari) shu oynada
   ochiladi. Shablonlarni o'zgartirish shart emas — havolalar avtomatik
   ushlanadi.
   ========================================================================== */
(function () {
    'use strict';

    var oyna = null;       // modal elementi
    var ramka = null;      // iframe
    var sarlavha = null;
    var yuklashTugmasi = null;
    var yangiOynaTugmasi = null;
    var oxirgiFokus = null;

    function pdfMi(havola) {
        var manzil = (havola.getAttribute('href') || '').split('?')[0].split('#')[0];
        return /\.pdf$/i.test(manzil);
    }

    function yarat() {
        if (oyna) return;

        oyna = document.createElement('div');
        oyna.className = 'pdfm-overlay';
        oyna.setAttribute('role', 'dialog');
        oyna.setAttribute('aria-modal', 'true');
        oyna.innerHTML =
            '<div class="pdfm">' +
                '<div class="pdfm-head">' +
                    '<div class="pdfm-title"><i class="fas fa-file-pdf"></i> <span></span></div>' +
                    '<div class="pdfm-tools">' +
                        '<a class="pdfm-btn pdfm-new" target="_blank" rel="noopener" title="Yangi oynada ochish">' +
                            '<i class="fas fa-up-right-from-square"></i></a>' +
                        '<a class="pdfm-btn pdfm-download" download title="Yuklab olish">' +
                            '<i class="fas fa-download"></i></a>' +
                        '<button type="button" class="pdfm-btn pdfm-close" title="Yopish" aria-label="Yopish">' +
                            '<i class="fas fa-xmark"></i></button>' +
                    '</div>' +
                '</div>' +
                '<div class="pdfm-body"></div>' +
            '</div>';

        document.body.appendChild(oyna);

        ramka = oyna.querySelector('.pdfm-body');
        sarlavha = oyna.querySelector('.pdfm-title span');
        yuklashTugmasi = oyna.querySelector('.pdfm-download');
        yangiOynaTugmasi = oyna.querySelector('.pdfm-new');

        oyna.querySelector('.pdfm-close').addEventListener('click', yop);
        oyna.addEventListener('click', function (e) {
            if (e.target === oyna) yop();   // fon bosilganda yopiladi
        });
    }

    function och(manzil, nom) {
        yarat();
        oxirgiFokus = document.activeElement;

        sarlavha.textContent = nom || 'Hujjat';
        yuklashTugmasi.setAttribute('href', manzil);
        yangiOynaTugmasi.setAttribute('href', manzil);

        // <object> ishlatiladi: brauzer PDF ni ko'rsata olmasa, ichidagi
        // zaxira matn va tugmalar avtomatik chiqadi.
        ramka.innerHTML =
            '<object data="' + manzil + '" type="application/pdf">' +
                '<div class="pdfm-fallback">' +
                    '<i class="fas fa-file-pdf"></i>' +
                    '<strong>Hujjatni shu oynada ko\'rsatib bo\'lmadi</strong>' +
                    '<span>Brauzeringiz PDF ni sayt ichida ochmayapti. Quyidagilardan birini tanlang:</span>' +
                    '<div class="pdfm-fallback-btns">' +
                        '<a class="read-btn" data-no-modal target="_blank" rel="noopener" href="' + manzil + '">' +
                            '<i class="fas fa-up-right-from-square"></i> Yangi oynada ochish</a>' +
                        '<a class="download-btn" download href="' + manzil + '">' +
                            '<i class="fas fa-download"></i> Yuklab olish</a>' +
                    '</div>' +
                '</div>' +
            '</object>';

        oyna.classList.add('is-open');
        document.body.classList.add('pdfm-lock');
        oyna.querySelector('.pdfm-close').focus();
    }

    function yop() {
        if (!oyna) return;
        oyna.classList.remove('is-open');
        document.body.classList.remove('pdfm-lock');
        ramka.innerHTML = '';   // hujjat yuklanishini to'xtatamiz
        if (oxirgiFokus && oxirgiFokus.focus) oxirgiFokus.focus();
    }

    // ── Havolalarni ushlab olish ──
    document.addEventListener('click', function (e) {
        var havola = e.target.closest ? e.target.closest('a[href]') : null;
        if (!havola) return;
        if (havola.hasAttribute('download')) return;          // yuklab olish havolasi
        if (havola.dataset.noModal !== undefined) return;     // ataylab chetlatilgan
        if (!pdfMi(havola)) return;

        // Boshqa saytdagi fayl bo'lsa, o'zimizda ko'rsatmaymiz
        if (havola.host && havola.host !== window.location.host) return;

        e.preventDefault();
        var nom = (havola.closest('.pp-card, .pp-row, .tp-card, .tp-row, article') || {}).querySelector
            ? (havola.closest('.pp-card, .pp-row, .tp-card, .tp-row, article').querySelector('h3, h4, .pp-title, .pp-card-title') || {}).textContent
            : '';
        och(havola.getAttribute('href'), (nom || havola.textContent || '').trim());
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') yop();
    });

    // Boshqa kodlar ham ochishi uchun
    window.pdfModalOch = och;
    window.pdfModalYop = yop;
})();
