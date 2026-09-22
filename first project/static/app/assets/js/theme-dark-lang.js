/* ==========================================================================
   Kafedralar.uz — Global Dark Mode & 3-Language (UZ / RU / EN) Translation Engine
   ========================================================================== */

(function () {
    // 1. Initial Theme Application (Instant)
    var savedTheme = localStorage.getItem('app_theme') || localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        if (document.body) document.body.classList.add('dark-mode');
    }

    // 2. Multilingual Dictionary
    var translations = {
        uz: {
            theme_dark: "Tungi rejim",
            theme_light: "Kunduzgi rejim",
            nav_home: "Bosh sahifa",
            nav_articles: "Ilmiy ishlar",
            nav_books: "O'quv ishlari",
            nav_videos: "Video darslar",
            nav_teachers: "O'qituvchilar",
            nav_library: "Kutubxona",
            nav_public_articles: "Ommaviy Maqolalar",
            nav_logout: "Chiqish",
            nav_login: "Kirish",
            nav_register: "Ro'yxatdan o'tish",
            btn_add: "Yangi qo'shish",
            btn_delete: "O'chirish",
            btn_edit: "Tahrirlash",
            btn_download_zip: "ZIP yuklab olish",
            btn_download: "Yuklab olish",
            btn_filter: "Filtrlash",
            btn_save: "Saqlash",
            btn_cancel: "Bekor qilish",
            btn_search: "Qidirish",
            btn_back: "Orqaga qaytish",
            lbl_from_date: "Dan",
            lbl_to_date: "Gacha",
            lbl_type: "Turi",
            lbl_author: "Muallif",
            lbl_faculty: "Fakultet",
            lbl_department: "Kafedra",
            lbl_all: "Barchasi",
            th_tr: "T/R",
            th_work_type: "Ilmiy ish turi",
            th_title: "Nomi",
            th_about: "Haqida",
            th_author: "Muallif",
            th_date: "Sana",
            th_category: "Kategoriya",
            th_file: "Fayl",
            th_pages: "Betlar soni",
            th_actions: "Amallar",
            stat_faculties: "Fakultetlar (Dekanatlar)",
            stat_departments: "Kafedralar soni",
            stat_professors: "Professor-o'qituvchilar",
            stat_total_works: "Jami Ishlar",
            stat_scopus: "Scopus / WoS",
            stat_oak: "OAK Maqolalar",
            stat_textbooks: "O'quv ishlari",
            status_done: "Bajarildi",
            status_pending: "Jarayonda",
            status_no_file: "Fayl yo'q"
        },
        ru: {
            theme_dark: "Темная тема",
            theme_light: "Светлая тема",
            nav_home: "Главная",
            nav_articles: "Научные работы",
            nav_books: "Учебные работы",
            nav_videos: "Видеоуроки",
            nav_teachers: "Преподаватели",
            nav_library: "Библиотека",
            nav_public_articles: "Публичные статьи",
            nav_logout: "Выйти",
            nav_login: "Войти",
            nav_register: "Регистрация",
            btn_add: "Добавить",
            btn_delete: "Удалить",
            btn_edit: "Редактировать",
            btn_download_zip: "Скачать ZIP",
            btn_download: "Скачать",
            btn_filter: "Фильтровать",
            btn_save: "Сохранить",
            btn_cancel: "Отмена",
            btn_search: "Поиск",
            btn_back: "Назад",
            lbl_from_date: "От",
            lbl_to_date: "До",
            lbl_type: "Тип",
            lbl_author: "Автор",
            lbl_faculty: "Факультет",
            lbl_department: "Кафедра",
            lbl_all: "Все",
            th_tr: "№",
            th_work_type: "Тип работы",
            th_title: "Название",
            th_about: "Описание",
            th_author: "Автор",
            th_date: "Дата",
            th_category: "Категория",
            th_file: "Файл",
            th_pages: "Страниц",
            th_actions: "Действия",
            stat_faculties: "Факультеты (Деканаты)",
            stat_departments: "Кафедры",
            stat_professors: "Преподаватели",
            stat_total_works: "Всего работ",
            stat_scopus: "Scopus / WoS",
            stat_oak: "Статьи ВАК",
            stat_textbooks: "Учебные пособия",
            status_done: "Выполнено",
            status_pending: "В процессе",
            status_no_file: "Нет файла"
        },
        en: {
            theme_dark: "Dark mode",
            theme_light: "Light mode",
            nav_home: "Home",
            nav_articles: "Scientific works",
            nav_books: "Educational works",
            nav_videos: "Video lessons",
            nav_teachers: "Professors & Teachers",
            nav_library: "Library",
            nav_public_articles: "Public Articles",
            nav_logout: "Logout",
            nav_login: "Login",
            nav_register: "Register",
            btn_add: "Add new",
            btn_delete: "Delete",
            btn_edit: "Edit",
            btn_download_zip: "Download ZIP",
            btn_download: "Download",
            btn_filter: "Filter",
            btn_save: "Save",
            btn_cancel: "Cancel",
            btn_search: "Search",
            btn_back: "Go back",
            lbl_from_date: "From",
            lbl_to_date: "To",
            lbl_type: "Type",
            lbl_author: "Author",
            lbl_faculty: "Faculty",
            lbl_department: "Department",
            lbl_all: "All",
            th_tr: "No.",
            th_work_type: "Work type",
            th_title: "Title",
            th_about: "About",
            th_author: "Author",
            th_date: "Date",
            th_category: "Category",
            th_file: "File",
            th_pages: "Pages",
            th_actions: "Actions",
            stat_faculties: "Faculties (Deans)",
            stat_departments: "Departments count",
            stat_professors: "Professors & Teachers",
            stat_total_works: "Total Works",
            stat_scopus: "Scopus / WoS",
            stat_oak: "National Articles",
            stat_textbooks: "Textbooks & Guides",
            status_done: "Completed",
            status_pending: "In progress",
            status_no_file: "No file"
        }
    };

    window.toggleDarkMode = function () {
        var isDark = document.body.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('dark-mode', isDark);
        localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateToggleButtons();
    };

    function updateToggleButtons() {
        var isDark = document.body.classList.contains('dark-mode');
        var curLang = localStorage.getItem('app_lang') || 'uz';
        var t = translations[curLang] || translations.uz;
        var label = isDark ? (t.theme_light || 'Kunduzgi') : (t.theme_dark || 'Tungi');
        var icon = isDark ? '☀️' : '🌙';

        document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
            btn.innerHTML = icon + ' <span class="d-none d-md-inline">' + label + '</span>';
        });
        document.querySelectorAll('.global-theme-btn').forEach(function (btn) {
            btn.innerHTML = icon + ' <span class="d-none d-sm-inline">' + label + '</span>';
        });
    }

    window.changeLanguage = function (lang) {
        if (!translations[lang]) lang = 'uz';
        localStorage.setItem('app_lang', lang);

        document.querySelectorAll('.lang-select, .global-lang-select').forEach(function (sel) {
            sel.value = lang;
        });

        var t = translations[lang];

        // 1. Translate elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.innerText = t[key];
            }
        });

        // 2. Translate table headers & common text
        document.querySelectorAll('table thead th').forEach(function (th) {
            var txt = th.innerText.trim();
            if (txt === 'T/R' || txt === '№' || txt === 'No.') th.innerText = t.th_tr;
            else if (txt.indexOf('turi') !== -1 || txt.indexOf('Тип') !== -1 || txt.indexOf('type') !== -1) th.innerText = t.th_work_type;
            else if (txt === 'Nomi' || txt === 'Название' || txt === 'Title') th.innerText = t.th_title;
            else if (txt === 'Haqida' || txt === 'Описание' || txt === 'About') th.innerText = t.th_about;
            else if (txt === 'Muallif' || txt === 'Автор' || txt === 'Author') th.innerText = t.th_author;
            else if (txt === 'Sana' || txt === 'Дата' || txt === 'Date') th.innerText = t.th_date;
            else if (txt === 'Kategoriya' || txt === 'Категория' || txt === 'Category') th.innerText = t.th_category;
            else if (txt === 'Fayl' || txt === 'Файл' || txt === 'File') th.innerText = t.th_file;
        });

        updateToggleButtons();
    };

    // 3. Inject Floating Controls if not present on page
    function initGlobalControls() {
        var hasNavbarToggle = document.getElementById('themeToggleBtn');
        if (!hasNavbarToggle && !document.querySelector('.global-floating-controls')) {
            var floatingDiv = document.createElement('div');
            floatingDiv.className = 'global-floating-controls';
            floatingDiv.innerHTML = [
                '<button class="global-theme-btn" onclick="toggleDarkMode()" title="Mavzuni almashtirish">',
                '🌙 <span>Tungi rejim</span>',
                '</button>',
                '<select class="global-lang-select" onchange="changeLanguage(this.value)">',
                '  <option value="uz">🇺🇿 UZ</option>',
                '  <option value="ru">🇷🇺 RU</option>',
                '  <option value="en">🇬🇧 EN</option>',
                '</select>'
            ].join('');
            document.body.appendChild(floatingDiv);
        }

        var savedTheme = localStorage.getItem('app_theme') || localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        var savedLang = localStorage.getItem('app_lang') || 'uz';
        changeLanguage(savedLang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalControls);
    } else {
        initGlobalControls();
    }
})();
