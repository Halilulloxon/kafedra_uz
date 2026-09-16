document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ilmiyForm");
    form.addEventListener("submit", (e) => {
        const fields = form.querySelectorAll("input[required], select[required]");
        let valid = true;
        fields.forEach(field => {
            if (!field.value.trim()) valid = false;
        });
        if (!valid) {
            e.preventDefault();
            const alertBox = `
                <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                    Iltimos, barcha maydonlarni to‘ldiring!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Yopish"></button>
                </div>`;
            document.getElementById("alert-container").innerHTML = alertBox;
        }
    });
});
