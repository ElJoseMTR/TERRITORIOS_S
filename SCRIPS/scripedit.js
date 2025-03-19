async function cargarTerritoriosRegistro() {
    try {
        const response = await fetch("https://api-db-territorios.onrender.com/getTerritorios");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Error al obtener territorios");
        }

        if (!Array.isArray(data.territorios) || data.territorios.length === 0) {
            console.warn("No hay territorios disponibles.");
            return;
        }

        const listaMapas = document.getElementById("listaMapasRegistro");
        let select = document.getElementById("territorioSelects");

        if (!select) {
            select = document.createElement("select");
            select.id = "territorioSelects";
            select.name = "territorioSelects";
            select.classList.add("styled-select");

            const label = document.createElement("label");
            label.setAttribute("for", "territorioSelects");

            listaMapas.appendChild(label);
            listaMapas.appendChild(select);
        } else {
            select.innerHTML = "";
        }

        data.territorios.forEach((territorio) => {
            const option = document.createElement("option");
            option.value = territorio;
            option.textContent = territorio;
            select.appendChild(option);
        });

        select.addEventListener("change", () => {
            const territorioSeleccionado = select.value;
            if (territorioSeleccionado === "SELECCIONA") {
                localStorage.removeItem("Territorio")
                return;
            }
            localStorage.setItem("Territorio", territorioSeleccionado);

            document.getElementById("botonesRegistroTerritorios").style.display = "block";

        });
        

    } catch (error) {
        console.error("Error de conexión:", error.message);
    }
}
window.onload = cargarTerritoriosRegistro;