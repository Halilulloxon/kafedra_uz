/* ==========================================================================
   Kafedralar.uz — Universal Dark Mode & 3-Language (UZ / RU / EN) Translation Engine
   ========================================================================== */

(function () {
    // 1. Initial Theme Application (Runs immediately to avoid flash of white)
    var savedTheme = localStorage.getItem('app_theme') || localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        if (document.body) document.body.classList.add('dark-mode');
    }

    // 2. Comprehensive 3-Language Dictionary for All Pages
    var phraseDict = {
        // Nav & Common
        "Bosh sahifa": { ru: "Главная", en: "Home" },
        "O'qituvchilar": { ru: "Преподаватели", en: "Teachers" },
        "Kitoblar": { ru: "Книги", en: "Books" },
        "Maqolalar": { ru: "Статьи", en: "Articles" },
        "Video darslar": { ru: "Видеоуроки", en: "Video Lessons" },
        "Video Darslar": { ru: "Видеоуроки", en: "Video Lessons" },
        "Video dars": { ru: "Видеоурок", en: "Video Lesson" },
        "Kirish": { ru: "Войти", en: "Login" },
        "Chiqish": { ru: "Выйти", en: "Logout" },
        "Ro'yxatdan o'tish": { ru: "Регистрация", en: "Register" },
        "Ro'yxatdan O'tish": { ru: "Регистрация", en: "Register" },
        "Profil": { ru: "Профиль", en: "Profile" },
        "O'quv ishlari": { ru: "Учебные работы", en: "Educational Works" },
        "O'quv Ishlari": { ru: "Учебные работы", en: "Educational Works" },
        "Ilmiy ishlar": { ru: "Научные работы", en: "Scientific Works" },
        "Ilmiy Ishlar": { ru: "Научные работы", en: "Scientific Works" },
        "Ilmiy maqolalar": { ru: "Научные статьи", en: "Scientific Articles" },
        "Ilmiy Maqolalar": { ru: "Научные статьи", en: "Scientific Articles" },
        "O'quv Kitoblari": { ru: "Учебные книги", en: "Textbooks" },
        "O'qituvchi Profillari": { ru: "Профили преподавателей", en: "Teacher Profiles" },
        "Profilni tahrirlash": { ru: "Редактировать профиль", en: "Edit Profile" },
        "Tahrirlash": { ru: "Редактировать", en: "Edit" },
        "O'chirish": { ru: "Удалить", en: "Delete" },
        "Yangi qo'shish": { ru: "Добавить", en: "Add New" },
        "Yuklab olish": { ru: "Скачать", en: "Download" },
        "ZIP yuklab olish": { ru: "Скачать ZIP", en: "Download ZIP" },
        "Qidirish": { ru: "Поиск", en: "Search" },
        "Filtrlash": { ru: "Фильтровать", en: "Filter" },
        "Saqlash": { ru: "Сохранить", en: "Save" },
        "Bekor qilish": { ru: "Отмена", en: "Cancel" },
        "Orqaga qaytish": { ru: "Назад", en: "Go Back" },
        "Orqaga": { ru: "Назад", en: "Back" },
        "Barchasi": { ru: "Все", en: "All" },
        "Barcha": { ru: "Все", en: "All" },
        "Dan": { ru: "От", en: "From" },
        "Gacha": { ru: "До", en: "To" },
        "Turi": { ru: "Тип", en: "Type" },
        "Muallif": { ru: "Автор", en: "Author" },
        "Fakultet": { ru: "Факультет", en: "Faculty" },
        "Kafedra": { ru: "Кафедра", en: "Department" },
        "Sana": { ru: "Дата", en: "Date" },
        "Nomi": { ru: "Название", en: "Title" },
        "Haqida": { ru: "Описание", en: "About" },
        "Fayl": { ru: "Файл", en: "File" },
        "Amallar": { ru: "Действия", en: "Actions" },
        "T/R": { ru: "№", en: "No." },
        "Betlar soni": { ru: "Количество страниц", en: "Pages count" },
        "Kategoriya": { ru: "Категория", en: "Category" },
        "Ko'rish →": { ru: "Смотреть →", en: "View →" },
        "Tomosha qilish": { ru: "Смотреть", en: "Watch" },
        "▶ Tomosha qilish": { ru: "▶ Смотреть", en: "▶ Watch" },
        "⬇ Yuklab olish": { ru: "⬇ Скачать", en: "⬇ Download" },
        "O'qituvchi Kabineti": { ru: "Кабинет преподавателя", en: "Teacher Cabinet" },
        "Kafedra Mudiri Paneli": { ru: "Панель зав. кафедрой", en: "Department Head Panel" },
        "Dekan Boshqaruv Paneli": { ru: "Панель декана", en: "Dean Management Panel" },
        "Prorektor Boshqaruv Paneli": { ru: "Панель проректора", en: "Vice-Rector Panel" },
        "Prorektor boshqaruvi": { ru: "Панель проректора", en: "Vice-Rector Panel" },
        "Mudir paneli": { ru: "Панель зав. кафедрой", en: "Department Head Panel" },
        "Dekan paneli": { ru: "Панель декана", en: "Dean Panel" },
        "Prorektor paneli": { ru: "Панель проректора", en: "Vice-Rector Panel" },
        "O'qituvchi Profilim": { ru: "Мой профиль преподавателя", en: "My Teacher Profile" },
        "Mudir Paneli": { ru: "Панель зав. кафедрой", en: "Department Head Panel" },
        "Dekan Paneli": { ru: "Панель декана", en: "Dean Panel" },
        "Prorektor Paneli": { ru: "Панель проректора", en: "Vice-Rector Panel" },
        "Shaxsiy O'qituvchi Profili": { ru: "Личный профиль преподавателя", en: "Personal Teacher Profile" },
        "Tungi rejim": { ru: "Темная тема", en: "Dark mode" },
        "Kunduzgi rejim": { ru: "Светлая тема", en: "Light mode" },
        "Top Mualliflar": { ru: "Топ авторы", en: "Top Authors" },
        "O'qituvchini Ko'rish": { ru: "Посмотреть", en: "View Teacher" },
        "O'qituvchilarni Ko'rish": { ru: "Посмотреть преподавателей", en: "View Teachers" },
        "O'qituvchi": { ru: "Преподаватель", en: "Teacher" },
        "Video Dars": { ru: "Видеоурок", en: "Video Lesson" },
        "Kitob": { ru: "Книга", en: "Book" },
        "Maqola": { ru: "Статья", en: "Article" },
        "Jami Ishlar": { ru: "Всего работ", en: "Total Works" },
        "Bajarildi": { ru: "Выполнено", en: "Completed" },
        "Jarayonda": { ru: "В процессе", en: "In progress" },
        "Fayl yo'q": { ru: "Нет файла", en: "No file" },
        "Parolni unutdingizmi?": { ru: "Забыли пароль?", en: "Forgot password?" },
        "Eslab qolish": { ru: "Запомнить меня", en: "Remember me" },
        "Tizimga kirish": { ru: "Войти в систему", en: "Sign in" },
        "Yangi dars": { ru: "Новый урок", en: "New lesson" },
        "🔥 SO'NGGI": { ru: "🔥 ПОСЛЕДНЕЕ", en: "🔥 LATEST" }
    };

    // Dictionary by translation key
    var translations = {
        uz: {
            theme_dark: "Tungi rejim",
            theme_light: "Kunduzgi rejim",
            nav_home: "Bosh sahifa",
            nav_articles: "Ilmiy ishlar",
            nav_books: "O'quv ishlari",
            nav_videos: "Video darslar",
            nav_teachers: "O'qituvchilar",
            nav_login: "Kirish",
            nav_logout: "Chiqish",
            profile_menu: "Profil",
            edu_works_menu: "O'quv ishlari",
            sci_works_menu: "Ilmiy ishlar",
            video_lessons_menu: "Video darslar",
            role_badge: "O'qituvchi Kabineti",
            role_oqituvchi: "O'qituvchi Kabineti",
            role_mudir: "Kafedra Mudiri Paneli",
            role_dekan: "Dekan Boshqaruv Paneli",
            role_prorektor: "Prorektor Boshqaruv Paneli",
            switch_teacher_profile: "O'qituvchi Profilim",
            switch_mudir_panel: "Mudir Paneli",
            switch_dekan_panel: "Dekan Paneli",
            switch_prorektor_panel: "Prorektor Paneli",
            my_teacher_profile: "Shaxsiy O'qituvchi Profili",
            dekan_dashboard: "Dekan Paneli",
            mudir_dashboard: "Mudir Paneli",
            dept_requirements: "Kafedra Talablari & Rejasi",
            dept_sci_works: "Kafedra Ilmiy Ishlari",
            dept_edu_works: "Kafedra O'quv Ishlari",
            dept_teachers: "Kafedra O'qituvchilari",
            fac_sci_works: "Fakultet Ilmiy Ishlari",
            fac_edu_works: "Fakultet O'quv Ishlari",
            fac_teachers: "Fakultet O'qituvchilari",
            edit_profile: "Profilni tahrirlash",
            dark_mode: "Tungi rejim",
            light_mode: "Kunduzgi rejim",
            video_lessons_sub: "Barcha yuklangan video darslar ro'yxati",
            back_dashboard: "Boshqaruv paneliga qaytish",
            download_zip: "ZIP yuklab olish",
            add_new: "Yangi qo'shish",
            delete: "O'chirish",
            total_videos: "Jami",
            video_count_unit: "ta video dars",
            from_date: "Dan",
            to_date: "Gacha",
            filter_btn: "Filtrlash",
            no_videos_found: "Hech qanday video dars topilmadi",
            add_video_prompt: "Yangi video dars qo'shish uchun yuqoridagi 'Yangi qo'shish' tugmasini bosing.",
            add_video_title: "Video Dars Qo‘shish",
            add_video_sub: "Platformaga yangi video darslik yuklash",
            back_to_list: "Ro'yxatga qaytish",
            video_details: "Video dars ma’lumotlari",
            video_name: "Video dars nomi / mavzusi",
            author: "Muallif",
            description: "Qisqacha tavsif / haqida",
            date: "Sana",
            video_file: "Video fayli (.mp4, .mkv, .mov)",
            change_video_file: "Yangi video fayl yuklash",
            public_visible: "Barcha foydalanuvchilar (ommaviy) uchun ko'rinsin",
            cancel: "Bekor qilish",
            save_add: "Saqlash va qo‘shish",
            edit_video_title: "Video Darsni Tahrirlash",
            edit_video_sub: "Mavjud video darslik ma'lumotlarini o'zgartirish",
            edit_video_info: "Ma’lumotlarni tahrirlash",
            save_changes: "Saqlash",
            delete_video_title: "Video Darsni O'chirish",
            delete_video_sub: "Keraksiz video darslikni o'chirish",
            confirm_delete: "O'chirishni tasdiqlang",
            confirm_delete_btn: "O‘chirish",
            edu_videos_tag: "Ta'lim videolari",
            video_lessons_title: "Video Darslar",
            video_lessons_desc: "O'qituvchilarimiz tomonidan tayyorlangan sifatli video darsliklar platformasi.",
            teacher_filter: "O'qituvchi:",
            all: "Barchasi",
            username_placeholder: "Foydalanuvchi nomi",
            password_placeholder: "Parolni kiriting",
            remember_me: "Meni eslab qol",
            login_btn: "Kirish",
            register_prompt: "Yangi foydalanuvchimisiz?"
        },
        ru: {
            theme_dark: "Темная тема",
            theme_light: "Светлая тема",
            nav_home: "Главная",
            nav_articles: "Научные работы",
            nav_books: "Учебные работы",
            nav_videos: "Видеоуроки",
            nav_teachers: "Преподаватели",
            nav_login: "Войти",
            nav_logout: "Выйти",
            profile_menu: "Профиль",
            edu_works_menu: "Учебные работы",
            sci_works_menu: "Научные работы",
            video_lessons_menu: "Видеоуроки",
            role_badge: "Кабинет преподавателя",
            role_oqituvchi: "Кабинет преподавателя",
            role_mudir: "Панель зав. кафедрой",
            role_dekan: "Панель декана",
            role_prorektor: "Панель проректора",
            switch_teacher_profile: "Мой профиль преподавателя",
            switch_mudir_panel: "Панель зав. кафедрой",
            switch_dekan_panel: "Панель декана",
            switch_prorektor_panel: "Панель проректора",
            my_teacher_profile: "Личный профиль преподавателя",
            dekan_dashboard: "Панель декана",
            mudir_dashboard: "Панель зав. кафедрой",
            dept_requirements: "Требования кафедры",
            dept_sci_works: "Научные работы кафедры",
            dept_edu_works: "Учебные работы кафедры",
            dept_teachers: "Преподаватели кафедры",
            fac_sci_works: "Научные работы факультета",
            fac_edu_works: "Учебные работы факультета",
            fac_teachers: "Преподаватели факультета",
            edit_profile: "Редактировать профиль",
            dark_mode: "Темная тема",
            light_mode: "Светлая тема",
            video_lessons_sub: "Список всех загруженных видеоуроков",
            back_dashboard: "Вернуться в панель управления",
            download_zip: "Скачать ZIP",
            add_new: "Добавить",
            delete: "Удалить",
            total_videos: "Всего",
            video_count_unit: "видеоуроков",
            from_date: "От",
            to_date: "До",
            filter_btn: "Фильтровать",
            no_videos_found: "Видеоуроки не найдены",
            add_video_prompt: "Нажмите кнопку 'Добавить' выше, чтобы загрузить новый видеоурок.",
            add_video_title: "Добавить видеоурок",
            add_video_sub: "Загрузка нового видеоурока на платформу",
            back_to_list: "Вернуться к списку",
            video_details: "Информация о видеоуроке",
            video_name: "Тема / Название видеоурока",
            author: "Автор",
            description: "Краткое описание",
            date: "Дата",
            video_file: "Видеофайл (.mp4, .mkv, .mov)",
            change_video_file: "Загрузить новый видеофайл",
            public_visible: "Сделать общедоступным (для всех)",
            cancel: "Отмена",
            save_add: "Сохранить и добавить",
            edit_video_title: "Редактировать видеоурок",
            edit_video_sub: "Изменение данных существующего видеоурока",
            edit_video_info: "Редактирование данных",
            save_changes: "Сохранить",
            delete_video_title: "Удалить видеоурок",
            delete_video_sub: "Удаление видеоурока",
            confirm_delete: "Подтвердите удаление",
            confirm_delete_btn: "Удалить",
            edu_videos_tag: "Образовательные видео",
            video_lessons_title: "Видеоуроки",
            video_lessons_desc: "Платформа качественных видеоуроков от наших преподавателей.",
            teacher_filter: "Преподаватель:",
            all: "Все",
            username_placeholder: "Имя пользователя",
            password_placeholder: "Введите пароль",
            remember_me: "Запомнить меня",
            login_btn: "Войти",
            register_prompt: "Вы новый пользователь?"
        },
        en: {
            theme_dark: "Dark mode",
            theme_light: "Light mode",
            nav_home: "Home",
            nav_articles: "Scientific works",
            nav_books: "Educational works",
            nav_videos: "Video lessons",
            nav_teachers: "Professors & Teachers",
            nav_login: "Login",
            nav_logout: "Logout",
            profile_menu: "Profile",
            edu_works_menu: "Educational works",
            sci_works_menu: "Scientific works",
            video_lessons_menu: "Video lessons",
            role_badge: "Teacher Cabinet",
            role_oqituvchi: "Teacher Cabinet",
            role_mudir: "Department Head Panel",
            role_dekan: "Dean Management Panel",
            role_prorektor: "Vice-Rector Panel",
            switch_teacher_profile: "My Teacher Profile",
            switch_mudir_panel: "Dept. Head Panel",
            switch_dekan_panel: "Dean Panel",
            switch_prorektor_panel: "Vice-Rector Panel",
            my_teacher_profile: "Personal Teacher Profile",
            dekan_dashboard: "Dean Dashboard",
            mudir_dashboard: "Dept. Head Dashboard",
            dept_requirements: "Department Requirements",
            dept_sci_works: "Dept. Scientific Works",
            dept_edu_works: "Dept. Educational Works",
            dept_teachers: "Department Teachers",
            fac_sci_works: "Faculty Scientific Works",
            fac_edu_works: "Faculty Educational Works",
            fac_teachers: "Faculty Teachers",
            edit_profile: "Edit profile",
            dark_mode: "Dark mode",
            light_mode: "Light mode",
            video_lessons_sub: "List of all uploaded video lessons",
            back_dashboard: "Back to dashboard",
            download_zip: "Download ZIP",
            add_new: "Add New",
            delete: "Delete",
            total_videos: "Total",
            video_count_unit: "video lessons",
            from_date: "From",
            to_date: "To",
            filter_btn: "Filter",
            no_videos_found: "No video lessons found",
            add_video_prompt: "Click 'Add New' above to upload a new video lesson.",
            add_video_title: "Add Video Lesson",
            add_video_sub: "Upload a new video lesson to the platform",
            back_to_list: "Back to list",
            video_details: "Video Lesson Details",
            video_name: "Video lesson title / topic",
            author: "Author",
            description: "Short description",
            date: "Date",
            video_file: "Video file (.mp4, .mkv, .mov)",
            change_video_file: "Upload new video file",
            public_visible: "Make visible to everyone (public)",
            cancel: "Cancel",
            save_add: "Save and Add",
            edit_video_title: "Edit Video Lesson",
            edit_video_sub: "Update existing video lesson information",
            edit_video_info: "Edit Details",
            save_changes: "Save Changes",
            delete_video_title: "Delete Video Lesson",
            delete_video_sub: "Delete video lesson",
            confirm_delete: "Confirm deletion",
            confirm_delete_btn: "Delete",
            edu_videos_tag: "Educational Videos",
            video_lessons_title: "Video Lessons",
            video_lessons_desc: "Quality video lessons platform created by our teachers.",
            teacher_filter: "Teacher:",
            all: "All",
            username_placeholder: "Username",
            password_placeholder: "Enter password",
            remember_me: "Remember me",
            login_btn: "Sign In",
            register_prompt: "New user? Sign up"
        }
    };

    // 2.1. Sahifaga xos tarjimalar (shablon window.pageTranslations sifatida beradi)
    function mergePageTranslations() {
        var extra = window.pageTranslations;
        if (!extra) return;
        ['uz', 'ru', 'en'].forEach(function (lang) {
            if (!extra[lang]) return;
            translations[lang] = translations[lang] || {};
            Object.keys(extra[lang]).forEach(function (kalit) {
                if (!(kalit in translations[lang])) {
                    translations[lang][kalit] = extra[lang][kalit];
                }
            });
        });
    }

    // 2.2. ApexCharts diagrammalarini joriy mavzuga moslash.
    // Shablonlar diagrammani window.__appCharts ro'yxatiga qo'shib qo'yadi.
    window.applyChartTheme = function () {
        var isDark = document.body.classList.contains('dark-mode') ||
                     document.documentElement.classList.contains('dark-mode');
        (window.__appCharts || []).forEach(function (chart) {
            try {
                chart.updateOptions({
                    theme: { mode: isDark ? 'dark' : 'light' },
                    chart: { background: 'transparent', foreColor: isDark ? '#cbd5e1' : '#373d3f' },
                    tooltip: { theme: isDark ? 'dark' : 'light' },
                    grid: { borderColor: isDark ? '#334155' : '#e2e8f0' }
                }, false, false);
            } catch (e) { /* diagramma hali tayyor emas */ }
        });
    };

    // Mavzu tugmasi belgilari — ingichka chiziqli (stroke) ko'rinish.
    // Font Awesome o'rniga SVG: shriftga bog'liq emas va rangni o'zi oladi.
    var QUYOSH_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" ' +
        'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/>' +
        '<path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/>' +
        '<path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

    var OY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" ' +
        'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

    // 3. Toggle Dark / Light Mode
    window.toggleDarkMode = function () {
        var isDark = document.body.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('dark-mode', isDark);
        localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateToggleButtons();
        window.applyChartTheme();
    };

    function updateToggleButtons() {
        var isDark = document.body.classList.contains('dark-mode') || document.documentElement.classList.contains('dark-mode');
        var curLang = localStorage.getItem('app_lang') || 'uz';
        var t = translations[curLang] || translations.uz;
        var label = isDark ? (t.theme_light || 'Kunduzgi rejim') : (t.theme_dark || 'Tungi rejim');
        var icon = isDark ? '☀️' : '🌙';

        document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
            // data-label="off" — faqat belgi ko'rsatiladigan yumaloq tugma (yangi dizayn)
            if (btn.dataset.label === 'off') {
                btn.innerHTML = isDark ? QUYOSH_SVG : OY_SVG;
                btn.setAttribute('title', label);
                btn.setAttribute('aria-label', label);
                return;
            }
            btn.innerHTML = icon + ' <span class="d-none d-md-inline">' + label + '</span>';
        });
        document.querySelectorAll('.global-theme-btn').forEach(function (btn) {
            btn.innerHTML = icon + ' <span class="d-none d-sm-inline">' + label + '</span>';
        });
    }

    // 4. Translate Entire DOM to Selected Language
    window.changeLanguage = function (lang) {
        if (!translations[lang]) lang = 'uz';
        localStorage.setItem('app_lang', lang);

        // Update all select inputs
        document.querySelectorAll('.lang-select, #langSwitcher, .global-lang-select').forEach(function (sel) {
            sel.value = lang;
        });

        var t = translations[lang] || translations.uz;

        // A. Elements with data-i18n (safely preserve any child icons)
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (t[key]) {
                var icons = el.querySelectorAll('i, svg');
                if (icons.length > 0) {
                    var span = el.querySelector('span:not(.badge)');
                    if (span) {
                        span.textContent = t[key];
                    } else {
                        var textNodeFound = false;
                        Array.from(el.childNodes).forEach(function (node) {
                            if (node.nodeType === 3 && node.textContent.trim().length > 0) {
                                node.textContent = ' ' + t[key];
                                textNodeFound = true;
                            }
                        });
                        if (!textNodeFound) {
                            var iconsHtml = Array.from(icons).map(function(ic) { return ic.outerHTML; }).join(' ');
                            el.innerHTML = iconsHtml + ' ' + t[key];
                        }
                    }
                } else {
                    el.textContent = t[key];
                }
            }
        });

        // B. Translate text nodes using phraseDict safely (never destroying icon child elements)
        var textElements = document.querySelectorAll('a, button, span, p, h1, h2, h3, h4, h5, h6, th, td, label, div.stat-label, div.new-badge, div.hero-badge, .menu-title');
        textElements.forEach(function (el) {
            if (el.hasAttribute('data-i18n')) return; // Already handled
            if (el.tagName === 'I' || el.tagName === 'SVG' || el.classList.contains('fa') || el.classList.contains('fas') || el.classList.contains('far') || el.classList.contains('fab')) return;

            // If it's a leaf element (no child tags)
            if (el.children.length === 0) {
                var rawText = (el.dataset.i18nOrig !== undefined) ? el.dataset.i18nOrig : el.textContent.trim();
                if (!el.dataset.i18nOrig && rawText) {
                    el.dataset.i18nOrig = rawText;
                }
                var orig = el.dataset.i18nOrig;
                if (orig && phraseDict[orig]) {
                    el.textContent = (lang === 'uz') ? orig : (phraseDict[orig][lang] || orig);
                }
            } else {
                // If element has children (e.g. <i> icon + text), update only TEXT_NODES
                Array.from(el.childNodes).forEach(function (node) {
                    if (node.nodeType === 3) { // Text Node
                        var txt = (node._i18nOrig !== undefined) ? node._i18nOrig : node.textContent.trim();
                        if (node._i18nOrig === undefined && txt) {
                            node._i18nOrig = txt;
                        }
                        var orig = node._i18nOrig;
                        if (orig && phraseDict[orig]) {
                            var translated = (lang === 'uz') ? orig : (phraseDict[orig][lang] || orig);
                            var leading = node.textContent.match(/^\s*/)[0];
                            var trailing = node.textContent.match(/\s*$/)[0];
                            node.textContent = leading + translated + trailing;
                        }
                    }
                });
            }
        });

        // C. Translate Input Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (inp) {
            var pKey = inp.getAttribute('data-i18n-placeholder');
            if (t[pKey]) {
                inp.setAttribute('placeholder', t[pKey]);
            }
        });

        document.querySelectorAll('input[placeholder]:not([data-i18n-placeholder])').forEach(function (inp) {
            if (!inp.dataset.origPh) {
                inp.dataset.origPh = inp.getAttribute('placeholder');
            }
            var origPh = inp.dataset.origPh;
            if (origPh) {
                if (origPh.indexOf('Qidirish') !== -1 || origPh.indexOf('qidir') !== -1) {
                    inp.setAttribute('placeholder', lang === 'ru' ? 'Поиск...' : (lang === 'en' ? 'Search...' : origPh));
                } else if (origPh.indexOf('Video') !== -1) {
                    inp.setAttribute('placeholder', lang === 'ru' ? 'Название видео или ключевое слово...' : (lang === 'en' ? 'Video title or keyword...' : origPh));
                }
            }
        });

        updateToggleButtons();
        updateLangLabels();
    };

    // 4.0. Til tanlagich (globus belgili ochiladigan ro'yxat).
    var TIL_NOMLARI = { uz: "O'zbek", ru: 'Русский', en: 'English' };

    function updateLangLabels() {
        var lang = localStorage.getItem('app_lang') || 'uz';
        document.querySelectorAll('.lang-current').forEach(function (el) {
            el.textContent = TIL_NOMLARI[lang] || TIL_NOMLARI.uz;
        });
        document.querySelectorAll('.lang-menu [data-lang]').forEach(function (btn) {
            btn.setAttribute('aria-selected', btn.dataset.lang === lang ? 'true' : 'false');
        });
    }

    function closeLangMenus(except) {
        document.querySelectorAll('.lang-dropdown.open').forEach(function (d) {
            if (d === except) return;
            d.classList.remove('open');
            var b = d.querySelector('.lang-btn');
            if (b) b.setAttribute('aria-expanded', 'false');
        });
    }

    var langInited = false;

    function initLangControls() {
        updateLangLabels();
        if (langInited) return;   // hodisa ikki marta ulanmasligi uchun
        langInited = true;

        document.addEventListener('click', function (e) {
            var tanlov = e.target.closest('.lang-menu [data-lang]');
            if (tanlov) {
                e.preventDefault();
                window.changeLanguage(tanlov.dataset.lang);
                closeLangMenus();
                return;
            }

            var tugma = e.target.closest('.lang-btn');
            if (tugma) {
                e.preventDefault();
                var dropdown = tugma.closest('.lang-dropdown');
                var ochiq = dropdown.classList.toggle('open');
                tugma.setAttribute('aria-expanded', ochiq ? 'true' : 'false');
                closeLangMenus(dropdown);
                return;
            }

            closeLangMenus();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLangMenus();
        });
    }

    // 4.1. Telefonda yuqori menyu balandligi o'zgarib turadi (tugmalar qatorga sig'masa).
    //      Kontent uning ostida qolib ketmasligi uchun bo'shliqni o'lchab qo'yamiz.
    function syncContentOffset() {
        var nav = document.querySelector('.header-navbar');
        var content = document.querySelector('.app-content');
        if (!nav || !content) return;
        if (window.innerWidth >= 992) {
            content.style.removeProperty('padding-top');
            return;
        }
        // CSS'da bu qiymat !important bilan yozilgani uchun biz ham shunday qo'yamiz
        content.style.setProperty('padding-top', (nav.offsetHeight + 16) + 'px', 'important');
    }
    window.addEventListener('resize', syncContentOffset);
    window.addEventListener('load', syncContentOffset);

    // 5. Initialize on Page Load
    function initGlobalControls() {
        mergePageTranslations();
        syncContentOffset();
        initLangControls();
        var hasNavbarToggle = document.getElementById('themeToggleBtn') || document.querySelector('.theme-toggle-btn');
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
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        }

        var savedLang = localStorage.getItem('app_lang') || 'uz';
        changeLanguage(savedLang);

        // Inject hamburger button for public nav if not already present
        var publicNav = document.querySelector('nav:not(.header-navbar)');
        if (publicNav && !document.getElementById('publicNavToggle')) {
            var navControls = publicNav.querySelector('.nav-controls');
            var hamburgerBtn = document.createElement('button');
            hamburgerBtn.id = 'publicNavToggle';
            hamburgerBtn.className = 'public-nav-toggle';
            hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
            hamburgerBtn.setAttribute('title', 'Menyu');
            hamburgerBtn.setAttribute('aria-label', 'Menyu');
            if (navControls) {
                navControls.appendChild(hamburgerBtn);
            } else {
                publicNav.appendChild(hamburgerBtn);
            }
        }

        // Global Mobile Navigation Click Handlers
        document.addEventListener('click', function(e) {
            // 1. Public Navbar Toggle (index, teachers, video, book, article, teacher1)
            var pubToggle = e.target.closest('#publicNavToggle, .public-nav-toggle');
            if (pubToggle) {
                e.preventDefault();
                var navUl = document.querySelector('nav:not(.header-navbar) ul');
                if (navUl) {
                    navUl.classList.toggle('nav-mobile-open');
                }
                return;
            }

            // Close public menu if clicked outside
            var openNavUl = document.querySelector('nav:not(.header-navbar) ul.nav-mobile-open');
            if (openNavUl && !e.target.closest('nav:not(.header-navbar)')) {
                openNavUl.classList.remove('nav-mobile-open');
            }

        });

        // 2. Kabinet yon menyusi (telefon va planshet).
        //    Muammo: vendor app.min.js ham shu tugmani ushlaydi va ikkala kod
        //    holatni almashtirib, bir-birini bekor qilardi — menyu faqat ikkinchi
        //    bosishda ochilardi. Shuning uchun hodisani "capture" bosqichida,
        //    ya'ni vendordan oldin ushlaymiz va uni to'xtatamiz.
        //    Katta ekranda ("modern-nav-toggle" bilan yig'ish) vendor o'zi hal qiladi.
        document.addEventListener('click', function (e) {
            if (window.innerWidth >= 992) return;

            var toggleBtn = e.target.closest('.menu-toggle, .mobile-menu a, .nav-menu-main');
            if (!toggleBtn) return;

            e.preventDefault();
            e.stopPropagation();

            if (document.documentElement.classList.contains('loading')) {
                document.documentElement.classList.remove('loading');
            }

            var isOpen = document.body.classList.toggle('menu-open');
            document.body.classList.toggle('menu-hide', !isOpen);

            var mainMenus = document.querySelectorAll('.main-menu');
            mainMenus.forEach(function (m) {
                m.classList.toggle('is-mobile-open', isOpen);
            });

            var overlay = document.querySelector('.sidenav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidenav-overlay';
                overlay.addEventListener('click', function () {
                    document.body.classList.remove('menu-open');
                    document.body.classList.add('menu-hide');
                    document.querySelectorAll('.main-menu').forEach(function (m) {
                        m.classList.remove('is-mobile-open');
                    });
                    overlay.style.display = 'none';
                });
                document.body.appendChild(overlay);
            }
            overlay.style.display = isOpen ? 'block' : 'none';
        }, true);
        
        // Remove loading class if still present
        if (document.documentElement.classList.contains('loading')) {
            document.documentElement.classList.remove('loading');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalControls);
    } else {
        initGlobalControls();
    }
})();


/* ==========================================================================
   Tizim xabarlari: yopish tugmasi va bir necha soniyadan keyin o'zi yo'qolishi
   ========================================================================== */
(function () {
    var KUTISH = 6000;

    function yop(xabar) {
        if (!xabar || xabar.classList.contains('yopilmoqda')) return;
        xabar.classList.add('yopilmoqda');
        setTimeout(function () {
            var idish = xabar.parentNode;
            if (xabar.parentNode) xabar.parentNode.removeChild(xabar);
            if (idish && !idish.children.length && idish.parentNode) {
                idish.parentNode.removeChild(idish);
            }
        }, 220);
    }

    function boshla() {
        var idish = document.querySelector('.xabarlar');
        if (!idish) return;

        idish.addEventListener('click', function (hodisa) {
            var tugma = hodisa.target.closest('.xabar-yop');
            if (tugma) yop(tugma.closest('.xabar'));
        });

        idish.querySelectorAll('.xabar').forEach(function (xabar) {
            var soat = setTimeout(function () { yop(xabar); }, KUTISH);
            // Sichqoncha ustida turganda o'qib ulgurish uchun kutamiz
            xabar.addEventListener('mouseenter', function () { clearTimeout(soat); });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boshla);
    } else {
        boshla();
    }
})();
