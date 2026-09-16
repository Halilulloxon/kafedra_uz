document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("downloadZipBtn");
    if (!btn) return;

    btn.addEventListener("click", async function() {
        const table = document.getElementById("myTable");
        if (!table) return;

        const workbook = XLSX.utils.table_to_book(table, { sheet: "Jadval" });
        const excelBase64 = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
        const excelDataUrl = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + excelBase64;

        const rows = table.tBodies[0].rows;
        const lastColumnIndex = table.tBodies[0].rows[0].cells.length - 1;
        const fileList = [];

        for (let i = 0; i < rows.length; i++) {
            const cell = rows[i].cells[lastColumnIndex];
            const fileLink = cell.querySelector('a');
            let fileUrl = fileLink ? fileLink.getAttribute("href") : cell.innerText.trim();
            if (fileUrl) fileList.push(fileUrl.replace(/^\/+/, ""));
        }

        try {
            const res = await fetch("/download-zip/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ excel: excelDataUrl, files: fileList })
            });

            if (!res.ok) throw new Error();

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "jadval_va_fayllar.zip";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch {
            alert("Xatolik yuz berdi, zip yaratilmadi.");
        }
    });
});
