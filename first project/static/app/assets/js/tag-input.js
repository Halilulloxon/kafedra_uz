/**
 * Tag Input — Hammualliflar uchun teg-style kiritish komponenti
 *
 * Foydalanish:
 *   <div class="tag-input-wrapper" data-name="ish_mualliflari" data-value="Ali, Vali, Soli"></div>
 *
 * Atributlar:
 *   data-name        — form field nomi (hidden input uchun)
 *   data-value        — boshlang'ich qiymat (vergul bilan ajratilgan)
 *   data-placeholder — placeholder matni (ixtiyoriy)
 */
(function () {
    'use strict';

    function initTagInput(wrapper) {
        if (wrapper._tagInputInit) return;
        wrapper._tagInputInit = true;

        var fieldName = wrapper.getAttribute('data-name') || 'tags';
        var initialValue = wrapper.getAttribute('data-value') || '';
        var placeholder = wrapper.getAttribute('data-placeholder') || 'Ism kiriting va Enter bosing...';

        // Hidden input — formaga yuboriladi
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = fieldName;
        wrapper.appendChild(hiddenInput);

        // Visible text input
        var textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'tag-text-input';
        textInput.placeholder = placeholder;
        textInput.autocomplete = 'off';
        wrapper.appendChild(textInput);

        var tags = [];

        function addTag(text) {
            text = text.trim();
            if (!text) return;
            // Duplikatni tekshirish (case-insensitive)
            var lowerText = text.toLowerCase();
            for (var i = 0; i < tags.length; i++) {
                if (tags[i].toLowerCase() === lowerText) return;
            }
            tags.push(text);
            renderTags();
            syncHidden();
        }

        function removeTag(index) {
            tags.splice(index, 1);
            renderTags();
            syncHidden();
            textInput.focus();
        }

        function renderTags() {
            // Eski taglarni o'chirish
            var oldTags = wrapper.querySelectorAll('.tag-item');
            for (var i = 0; i < oldTags.length; i++) {
                oldTags[i].remove();
            }
            // Yangi taglarni yaratish
            for (var j = 0; j < tags.length; j++) {
                var tagEl = document.createElement('span');
                tagEl.className = 'tag-item';
                tagEl.innerHTML =
                    '<span class="tag-label">' + escapeHtml(tags[j]) + '</span>' +
                    '<button type="button" class="tag-remove" data-index="' + j + '" title="O\'chirish">&times;</button>';
                wrapper.insertBefore(tagEl, textInput);
            }
        }

        function syncHidden() {
            hiddenInput.value = tags.join(', ');
        }

        function escapeHtml(str) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        }

        // Boshlang'ich qiymatni taglarga aylantirish
        if (initialValue) {
            var parts = initialValue.split(',');
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].trim();
                if (part) {
                    tags.push(part);
                }
            }
            renderTags();
            syncHidden();
        }

        // Keyboard events
        textInput.addEventListener('keydown', function (e) {
            var val = textInput.value;

            // Enter yoki Tab — teg qo'shish
            if (e.key === 'Enter' || e.key === 'Tab') {
                if (val.trim()) {
                    e.preventDefault();
                    addTag(val);
                    textInput.value = '';
                } else if (e.key === 'Enter') {
                    e.preventDefault(); // Formani yuborishni to'xtatish
                }
            }

            // Backspace — oxirgi tegni o'chirish
            if (e.key === 'Backspace' && !val && tags.length > 0) {
                removeTag(tags.length - 1);
            }
        });

        // Vergul bilan ajratish (input event)
        textInput.addEventListener('input', function () {
            var val = textInput.value;
            if (val.indexOf(',') !== -1) {
                var parts = val.split(',');
                for (var i = 0; i < parts.length - 1; i++) {
                    addTag(parts[i]);
                }
                textInput.value = parts[parts.length - 1].trim();
            }
        });

        // Paste event — nusxalab qo'yganda ham taglarga ajratish
        textInput.addEventListener('paste', function (e) {
            e.preventDefault();
            var pasted = (e.clipboardData || window.clipboardData).getData('text');
            var parts = pasted.split(',');
            for (var i = 0; i < parts.length; i++) {
                addTag(parts[i]);
            }
        });

        // Wrapper'ga bosilganda input'ga focus
        wrapper.addEventListener('click', function (e) {
            if (e.target === wrapper) {
                textInput.focus();
            }
        });

        // Tag o'chirish tugmasi
        wrapper.addEventListener('click', function (e) {
            var btn = e.target.closest('.tag-remove');
            if (btn) {
                var idx = parseInt(btn.getAttribute('data-index'), 10);
                removeTag(idx);
            }
        });
    }

    // Barcha tag-input elementlarini avtomatik initsializatsiya
    function initAll() {
        var wrappers = document.querySelectorAll('.tag-input-wrapper');
        for (var i = 0; i < wrappers.length; i++) {
            initTagInput(wrappers[i]);
        }
    }

    // DOM tayyor bo'lganda ishga tushirish
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Global funksiya — kerak bo'lsa qo'lda chaqirish uchun
    window.initTagInput = initTagInput;
})();
