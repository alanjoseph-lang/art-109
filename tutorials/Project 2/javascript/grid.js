

document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("table");

    table.addEventListener("mouseover", (event) => {
        if (event.target.tagName === "TD") {
            const cell = event.target;
            const row = cell.parentElement;
            const colIndex = cell.cellIndex;

            const rowHeader = row.querySelector("th");
            if (rowHeader) rowHeader.classList.add("highlight-header");

            const colHeader = table.querySelector(`thead tr th:nth-child(${colIndex + 1})`);
            if (colHeader) colHeader.classList.add("highlight-header");

            [...row.querySelectorAll("td")].forEach((td, idx) => {
                if (idx < colIndex) td.classList.add("highlight-edge");
            });

            [...table.querySelectorAll("tbody tr")].forEach((tr) => {
                if (tr.rowIndex < row.rowIndex) {
                    const td = tr.querySelector(`td:nth-child(${colIndex + 1})`);
                    if (td) td.classList.add("highlight-edge");
                }
            });
        }
    });

    table.addEventListener("mouseout", (event) => {
        if (event.target.tagName === "TD") {
            table.querySelectorAll("th, td").forEach(cell => {
                cell.classList.remove("highlight-header", "highlight-edge");
            });
        }
    });
});