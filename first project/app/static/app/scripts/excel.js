document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".clickable-row").forEach(function (row) {
        row.addEventListener("click", function () {
            window.location = this.dataset.href;
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("downloadZipBtn");
    if (!btn) return;

    btn.addEventListener("click", async function () {
        const table = document.getElementById("myTable");
        if (!table) { alert("Jadval topilmadi!"); return; }

        // ✅ Excel uchun to'liq ma'lumotni vaqtincha tiklash
        const truncatedCells = [];
        table.querySelectorAll("td[data-full]").forEach(function (td) {
            truncatedCells.push({ el: td, short: td.innerHTML });
            td.innerHTML = td.dataset.full;
        });

        // Excel yaratish
        const workbook = XLSX.utils.table_to_book(table, { sheet: "Jadval" });
        const base64 = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
        const excelDataUrl = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + base64;

        // ✅ Ekranda yana qisqartirilgan ko'rinishga qaytarish
        truncatedCells.forEach(function (item) {
            item.el.innerHTML = item.short;
        });

        const rows = table.tBodies[0]?.rows || [];
        const last = rows[0]?.cells.length - 1 || 0;

        const fileList = [];

        for (let i = 0; i < rows.length; i++) {
            const rowId = rows[i].dataset.id || rows[i].cells[0]?.textContent.trim() || (i + 1);
            const a = rows[i].cells[last].querySelector("a");
            if (!a) continue;

            const fileUrl = a.getAttribute("href") || "";
            const idx = fileUrl.indexOf("/media/");
            if (idx !== -1) {
                const clean = fileUrl.substring(idx + 7);
                if (clean.trim() !== "") {
                    fileList.push({
                        path: clean,
                        prefix: rowId
                    });
                }
            }
        }

        // Serverga yuborish
        const res = await fetch("/download-zip/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ excel: excelDataUrl, files: fileList })
        });

        if (!res.ok) {
            alert("Xato yuz berdi: " + res.statusText);
            return;
        }

        // ZIP yuklab olish
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const now = new Date();
        const dateStr = now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");

        a.download = `jadval_va_fayllar_${dateStr}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });
});