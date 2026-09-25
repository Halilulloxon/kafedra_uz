document.addEventListener("DOMContentLoaded", function () {
    // 1. Clickable row navigation
    document.querySelectorAll(".clickable-row").forEach(function (row) {
        row.addEventListener("click", function (e) {
            // Don't trigger row navigation if clicked on a button, link, or form control
            if (e.target.closest("a, button, input, select, textarea, .btn")) return;
            if (this.dataset.href) {
                window.location = this.dataset.href;
            }
        });
    });

    // 2. Excel yuklab olish tugmasi
    const excelBtn = document.getElementById("downloadExcelBtn");
    if (excelBtn) {
        excelBtn.addEventListener("click", function () {
            const table = document.getElementById("myTable");
            if (!table) { alert("Jadval topilmadi!"); return; }

            const originalBtnHtml = excelBtn.innerHTML;
            excelBtn.disabled = true;
            excelBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Tayyorlanmoqda...';

            try {
                const wb = buildExcelWorkbook(table);
                const now = new Date();
                const dateStr = now.getFullYear() + "-" +
                    String(now.getMonth() + 1).padStart(2, "0") + "-" +
                    String(now.getDate()).padStart(2, "0");

                const titleElem = document.querySelector(".content-header-title");
                let baseName = "jadval";
                if (titleElem) {
                    const tText = titleElem.textContent.toLowerCase();
                    if (tText.includes("ilmiy")) baseName = "ilmiy_ishlar";
                    else if (tText.includes("o'quv") || tText.includes("oquv")) baseName = "oquv_ishlari";
                }

                XLSX.writeFile(wb, `${baseName}_${dateStr}.xlsx`);
            } catch (err) {
                console.error(err);
                alert("Excel eksport qilishda xatolik: " + err.message);
            } finally {
                excelBtn.disabled = false;
                excelBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    // 3. ZIP yuklab olish tugmasi
    const zipBtn = document.getElementById("downloadZipBtn");
    if (zipBtn) {
        zipBtn.addEventListener("click", async function () {
            const table = document.getElementById("myTable");
            if (!table) { alert("Jadval topilmadi!"); return; }

            const originalBtnHtml = zipBtn.innerHTML;
            zipBtn.disabled = true;
            zipBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Tayyorlanmoqda...';

            try {
                const workbook = buildExcelWorkbook(table);
                const base64 = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
                const excelDataUrl = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + base64;

                const rows = table.tBodies[0]?.rows || [];
                if (rows.length === 0) {
                    alert("Jadvalda ma'lumot yo'q!");
                    return;
                }
                const last = rows[0]?.cells.length - 1 || 0;

                const fileList = [];

                for (let i = 0; i < rows.length; i++) {
                    const rowId = rows[i].dataset.id || rows[i].cells[0]?.textContent.trim() || (i + 1);
                    const a = rows[i].cells[last]?.querySelector("a[href*='/media/']");
                    if (!a) continue;

                    const fileUrl = a.getAttribute("href") || "";
                    const idx = fileUrl.indexOf("/media/");
                    if (idx !== -1) {
                        const clean = decodeURIComponent(fileUrl.substring(idx + 7));
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
            } catch (err) {
                console.error(err);
                alert("Yuklab olishda xatolik: " + err.message);
            } finally {
                zipBtn.disabled = false;
                zipBtn.innerHTML = originalBtnHtml;
            }
        });
    }
});

/**
 * Builds an enhanced SheetJS workbook from HTML table with clean columns:
 * - Scopus / DOI / Article links in a dedicated column, with clickable Excel hyperlinks!
 * - DGU / Patent certificate numbers in a dedicated column!
 * - Full unabridged text (data-full) for title, description, and authors.
 * - Cleaned-up type and file columns.
 */
function buildExcelWorkbook(table) {
    if (typeof XLSX === "undefined") {
        throw new Error("XLSX kutubxonasi yuklanmagan!");
    }

    const headerThs = Array.from(table.querySelectorAll("thead tr th"));
    const headerTexts = headerThs.map(th => th.textContent.trim().toLowerCase());

    const isIlmiy = headerTexts.some(h => h.includes("ilmiy ish"));
    const isOquv = headerTexts.some(h => h.includes("o`quv") || h.includes("oquv") || h.includes("o'quv"));

    const rows = table.tBodies[0]?.rows || [];
    const aoa = [];
    let colWidths = [];

    if (isIlmiy) {
        const hasFakultet = headerTexts.some(h => h.includes("fakultet"));
        const hasKafedra = headerTexts.some(h => h.includes("kafedra"));
        const hasKategoriya = headerTexts.some(h => h.includes("kategoriya"));

        // Sarlavhalar
        const excelHeaders = ["T/R"];
        if (hasFakultet) excelHeaders.push("Fakultet");
        if (hasKafedra) excelHeaders.push("Kafedra");
        excelHeaders.push("Ilmiy ish turi");
        excelHeaders.push("DGU / Patent raqami");
        excelHeaders.push("Ish nomi");
        excelHeaders.push("Haqida / Izoh");
        excelHeaders.push("Muallif(lar)");
        excelHeaders.push("Sana");
        if (hasKategoriya) excelHeaders.push("Kategoriya");
        excelHeaders.push("Maqola havolasi (Link / DOI)");
        excelHeaders.push("Fayl");

        aoa.push(excelHeaders);

        for (let i = 0; i < rows.length; i++) {
            const tr = rows[i];
            const cells = tr.cells;
            if (!cells || cells.length === 0) continue;
            if (cells.length === 1 && cells[0].getAttribute("colspan")) continue;

            const rowId = tr.dataset.id || cells[0]?.textContent.trim() || (i + 1);

            let cellIdx = 1;
            let fakultet = "-";
            if (hasFakultet) {
                fakultet = cells[cellIdx]?.textContent.trim() || "-";
                cellIdx++;
            }
            let kafedra = "-";
            if (hasKafedra) {
                kafedra = cells[cellIdx]?.textContent.trim() || "-";
                cellIdx++;
            }

            // Turi
            const turiCell = cells[cellIdx];
            cellIdx++;
            const turiBadge = turiCell?.querySelector(".badge-primary") || turiCell?.querySelector(".badge");
            let turi = tr.dataset.turi || (turiBadge ? turiBadge.textContent.trim() : (turiCell?.textContent.split("\n")[0].trim() || "-"));

            // DGU raqami
            let dgu = tr.dataset.dgu || "";
            if (!dgu && turiCell) {
                const dguBadge = turiCell.querySelector(".badge-info");
                if (dguBadge) {
                    dgu = dguBadge.textContent.replace(/^[\s№#]+/, "").trim();
                }
            }
            if (!dgu) dgu = "-";

            // Nomi
            const nomiCell = cells[cellIdx];
            cellIdx++;
            const nomi = nomiCell?.dataset.full || tr.dataset.nomi || nomiCell?.textContent.trim() || "-";

            // Haqida
            const haqidaCell = cells[cellIdx];
            cellIdx++;
            const haqida = haqidaCell?.dataset.full || haqidaCell?.textContent.trim() || "-";

            // Muallif
            const muallifCell = cells[cellIdx];
            cellIdx++;
            const muallif = muallifCell?.dataset.full || muallifCell?.textContent.trim() || "-";

            // Sana
            const sanaCell = cells[cellIdx];
            cellIdx++;
            let sana = sanaCell?.textContent.trim() || "-";
            if (sana !== "-") {
                if (/^\d{4}-\d{2}-\d{2}$/.test(sana)) {
                    const p = sana.split("-");
                    sana = `${p[2]}/${p[1]}/${p[0]}`;
                } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(sana)) {
                    sana = sana.replace(/\./g, "/");
                }
            }

            // Kategoriya
            let kategoriya = "-";
            if (hasKategoriya) {
                const katCell = cells[cellIdx];
                cellIdx++;
                kategoriya = katCell?.textContent.trim() || "-";
            }

            // Maqola havolasi (Link / DOI)
            let link = tr.dataset.link || "";
            const lastCell = cells[cells.length - 1];
            if (!link && lastCell) {
                const anchors = lastCell.querySelectorAll("a");
                for (let a of anchors) {
                    const href = a.getAttribute("href") || "";
                    if (href && !href.includes("/media/") && (href.startsWith("http") || href.startsWith("doi:"))) {
                        link = href;
                        break;
                    }
                }
            }
            if (!link) link = "-";

            // Fayl
            let fayl = "-";
            if (lastCell) {
                const fileAnchor = lastCell.querySelector("a[href*='/media/']");
                if (fileAnchor) {
                    const fileHref = fileAnchor.getAttribute("href") || "";
                    const fname = decodeURIComponent(fileHref.split("/").pop());
                    fayl = fname || "Fayl biriktirilgan";
                } else if (tr.dataset.file) {
                    fayl = decodeURIComponent(tr.dataset.file.split("/").pop()) || "Fayl biriktirilgan";
                }
            }

            const rowData = [rowId];
            if (hasFakultet) rowData.push(fakultet);
            if (hasKafedra) rowData.push(kafedra);
            rowData.push(turi);
            rowData.push(dgu);
            rowData.push(nomi);
            rowData.push(haqida);
            rowData.push(muallif);
            rowData.push(sana);
            if (hasKategoriya) rowData.push(kategoriya);
            rowData.push(link);
            rowData.push(fayl);

            aoa.push(rowData);
        }

        colWidths = [
            { wch: 6 },  // T/R
            ...(hasFakultet ? [{ wch: 25 }] : []),
            ...(hasKafedra ? [{ wch: 25 }] : []),
            { wch: 18 }, // Turi
            { wch: 24 }, // DGU raqami
            { wch: 45 }, // Nomi
            { wch: 35 }, // Haqida
            { wch: 30 }, // Muallif
            { wch: 14 }, // Sana
            ...(hasKategoriya ? [{ wch: 16 }] : []),
            { wch: 50 }, // Maqola havolasi
            { wch: 25 }  // Fayl
        ];
    } else if (isOquv) {
        const hasFakultet = headerTexts.some(h => h.includes("fakultet"));
        const hasKafedra = headerTexts.some(h => h.includes("kafedra"));

        const excelHeaders = ["T/R"];
        if (hasFakultet) excelHeaders.push("Fakultet");
        if (hasKafedra) excelHeaders.push("Kafedra");
        excelHeaders.push("O'quv ishi turi");
        excelHeaders.push("Ish nomi");
        excelHeaders.push("Haqida / Izoh");
        excelHeaders.push("Muallif(lar)");
        excelHeaders.push("Sana");
        excelHeaders.push("Betlar soni");
        excelHeaders.push("Fayl");

        aoa.push(excelHeaders);

        for (let i = 0; i < rows.length; i++) {
            const tr = rows[i];
            const cells = tr.cells;
            if (!cells || cells.length === 0) continue;
            if (cells.length === 1 && cells[0].getAttribute("colspan")) continue;

            const rowId = tr.dataset.id || cells[0]?.textContent.trim() || (i + 1);

            let cellIdx = 1;
            let fakultet = "-";
            if (hasFakultet) {
                fakultet = cells[cellIdx]?.textContent.trim() || "-";
                cellIdx++;
            }
            let kafedra = "-";
            if (hasKafedra) {
                kafedra = cells[cellIdx]?.textContent.trim() || "-";
                cellIdx++;
            }

            // Turi
            const turi = cells[cellIdx]?.textContent.trim() || "-";
            cellIdx++;

            // Nomi
            const nomi = cells[cellIdx]?.dataset.full || cells[cellIdx]?.textContent.trim() || "-";
            cellIdx++;

            // Haqida
            const haqida = cells[cellIdx]?.dataset.full || cells[cellIdx]?.textContent.trim() || "-";
            cellIdx++;

            // Muallif
            const muallif = cells[cellIdx]?.dataset.full || cells[cellIdx]?.textContent.trim() || "-";
            cellIdx++;

            // Sana
            const sana = cells[cellIdx]?.textContent.trim() || "-";
            cellIdx++;

            // Betlar soni
            const betlar = cells[cellIdx]?.textContent.trim() || "-";
            cellIdx++;

            // Fayl
            let fayl = "-";
            const lastCell = cells[cells.length - 1];
            if (lastCell) {
                const fileAnchor = lastCell.querySelector("a[href*='/media/']");
                if (fileAnchor) {
                    const fileHref = fileAnchor.getAttribute("href") || "";
                    const fname = decodeURIComponent(fileHref.split("/").pop());
                    fayl = fname || "Fayl biriktirilgan";
                }
            }

            const rowData = [rowId];
            if (hasFakultet) rowData.push(fakultet);
            if (hasKafedra) rowData.push(kafedra);
            rowData.push(turi);
            rowData.push(nomi);
            rowData.push(haqida);
            rowData.push(muallif);
            rowData.push(sana);
            rowData.push(betlar);
            rowData.push(fayl);

            aoa.push(rowData);
        }

        colWidths = [
            { wch: 6 },
            ...(hasFakultet ? [{ wch: 25 }] : []),
            ...(hasKafedra ? [{ wch: 25 }] : []),
            { wch: 20 },
            { wch: 45 },
            { wch: 35 },
            { wch: 30 },
            { wch: 14 },
            { wch: 14 },
            { wch: 25 }
        ];
    } else {
        // Fallback generic table exporter
        const excelHeaders = headerThs.map(th => th.textContent.trim());
        aoa.push(excelHeaders);

        for (let i = 0; i < rows.length; i++) {
            const tr = rows[i];
            const cells = tr.cells;
            if (!cells || cells.length === 0) continue;
            if (cells.length === 1 && cells[0].getAttribute("colspan")) continue;

            const rowData = [];
            for (let j = 0; j < cells.length; j++) {
                const td = cells[j];
                let val = td.dataset.full || td.textContent.trim();
                const a = td.querySelector("a");
                if (a && a.getAttribute("href") && !a.getAttribute("href").startsWith("#") && !a.getAttribute("href").startsWith("javascript:")) {
                    const href = a.getAttribute("href");
                    if (href.startsWith("http")) val = href;
                }
                rowData.push(val);
            }
            aoa.push(rowData);
        }
    }

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    if (colWidths && colWidths.length > 0) {
        ws['!cols'] = colWidths;
    }

    // Convert link strings to clickable hyperlinks in Excel
    const range = XLSX.utils.decode_range(ws['!ref'] || "A1:A1");
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddr = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[cellAddr];
            if (cell && typeof cell.v === "string" && (cell.v.startsWith("http://") || cell.v.startsWith("https://"))) {
                cell.l = { Target: cell.v, Tooltip: cell.v };
            }
        }
    }

    const wb = XLSX.utils.book_new();
    const sheetName = isIlmiy ? "Ilmiy_Ishlar" : (isOquv ? "Oquv_Ishlari" : "Jadval");
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return wb;
}