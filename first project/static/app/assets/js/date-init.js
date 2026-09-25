/**
 * Universal Date Initializer & Formatter (dd/mm/yyyy)
 * Barcha kiritiladigan va ko'rsatiladigan sanalarni qat'iy dd/mm/yyyy formatida ta'minlaydi.
 */
document.addEventListener("DOMContentLoaded", function () {
    // 1. Matn ko'rinishidagi sanalarni dd/mm/yyyy formatiga o'tkazish yordamchisi
    function toDDMMYYYY(val) {
        if (!val) return "";
        val = val.trim();
        // YYYY-MM-DD -> DD/MM/YYYY
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            const p = val.split("-");
            return `${p[2]}/${p[1]}/${p[0]}`;
        }
        // DD.MM.YYYY -> DD/MM/YYYY
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(val)) {
            return val.replace(/\./g, "/");
        }
        return val;
    }

    // 2. Barcha sana maydonlarini topish
    const selector = [
        "input[type='date']",
        "input[name='from']",
        "input[name='to']",
        "input[name='sana']",
        "input[name='tugulgan_sana']",
        "input[name='muddati']",
        ".date-picker",
        ".date-input"
    ].join(", ");

    const dateInputs = document.querySelectorAll(selector);

    dateInputs.forEach(function (input) {
        // Avvalgi qiymatni dd/mm/yyyy formatiga keltirish
        if (input.value) {
            input.value = toDDMMYYYY(input.value);
        }

        // Native date maydonini text maydoniga o'zgartirish (brauzer default formatini chetlab o'tish uchun)
        if (input.type === "date") {
            try {
                input.type = "text";
            } catch (e) {
                // Ayrim eski brauzerlarda xatolik bermasligi uchun
            }
        }

        input.setAttribute("placeholder", "dd/mm/yyyy");
        input.setAttribute("autocomplete", "off");
        input.setAttribute("maxlength", "10");

        // Klaviatura orqali yozganda avtomatik / qo'yish (Masking)
        input.addEventListener("input", function (e) {
            // Agar belgi o'chirilayotgan bo'lsa aralashmaymiz
            if (e.inputType && e.inputType.startsWith("delete")) return;

            let val = this.value.replace(/[^\d/]/g, "");
            const rawDigits = val.replace(/\D/g, "");

            if (rawDigits.length > 8) {
                val = rawDigits.slice(0, 8);
            }

            if (rawDigits.length >= 5) {
                this.value = rawDigits.slice(0, 2) + "/" + rawDigits.slice(2, 4) + "/" + rawDigits.slice(4, 8);
            } else if (rawDigits.length >= 3) {
                this.value = rawDigits.slice(0, 2) + "/" + rawDigits.slice(2);
            } else {
                this.value = rawDigits;
            }
        });

        // 3. Agar Flatpickr mavjud bo'lsa, qulay kalendar ochilishi
        if (typeof flatpickr !== "undefined") {
            flatpickr(input, {
                dateFormat: "d/m/Y",
                allowInput: true,
                disableMobile: true,
                locale: {
                    firstDayOfWeek: 1,
                    weekdays: {
                        shorthand: ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"],
                        longhand: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]
                    },
                    months: {
                        shorthand: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
                        longhand: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"]
                    }
                }
            });
        }
    });
});
