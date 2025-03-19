function openImagen() {
    document.getElementById("appmapa").style.display = "none";
    document.getElementById("appimagen").style.display = "none";
    document.getElementById("appimagen").style.display = "block";
}
function openMapa() {
    document.getElementById("appexhibidor").style.display = "none";
    document.getElementById("appimagen").style.display = "none";
    document.getElementById("appmapa").style.display = "block";
}
function openExhibidor() {
    document.getElementById("appmapa").style.display = "none";
    document.getElementById("appimagen").style.display = "none";
    document.getElementById("appexhibidor").style.display = "block";
}

async function cargarTerritorios() {
    try {
        const response = await fetch("https://api-db-territorios.onrender.com/getTerritoriosCapitan");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Error al obtener territorios");
        }

        if (!Array.isArray(data.territorios) || data.territorios.length === 0) {
            console.warn("No hay territorios disponibles.");
            return;
        }

        const listaMapas = document.getElementById("listaMapas");
        let select = document.getElementById("territorioSelect");

        if (!select) {
            select = document.createElement("select");
            select.id = "territorioSelect";
            select.name = "territorioSelect";
            select.classList.add("styled-select");

            const label = document.createElement("label");
            label.setAttribute("for", "territorioSelect");

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

            if (territorioSeleccionado === "SELECCIONA"){
                return;
            }

            localStorage.setItem("Territorio", territorioSeleccionado);
            localStorage.setItem("Centro", 1);
            localStorage.setItem("vista", "ver");
            document.getElementById("mapaCentro1").style.display = "block";
            document.getElementById("listaMapasContainer").style.display = "none";
            document.getElementById("botonesEdit").style.display = "block";
        
            let url = `https://api-db-territorios.onrender.com/getVistaMapas?territorio=${encodeURIComponent(territorioSeleccionado)}&grupo=${encodeURIComponent(1)}`;
        
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    Object.keys(data).forEach(mapa => {
                        const pathElement = document.getElementById(mapa);
                        if (pathElement) {
                            if (data[mapa] === "no") {
                                pathElement.setAttribute("fill", "green"); 
                            } else if (data[mapa] === "sí") {
                                pathElement.setAttribute("fill", "red"); 
                            } else if (data[mapa] === "falta") {
                                pathElement.setAttribute("fill", "yellow"); 
                            }
                        }
                    });
                })
                .catch(error => console.error("Error al buscar los mapas:", error));
        });
        

    } catch (error) {
        console.error("Error de conexión:", error.message);
    }
}


window.onload = cargarTerritorios;

function clickguardar(){
    const estado = localStorage.getItem("vista");
    if (estado === "edita"){
        localStorage.setItem("vista", "ver");
    }
}

function clickeditar(){
    const mapa = localStorage.getItem("Territorio");
    if (mapa) {
        alert("¡Ya puedes editar!");
        localStorage.setItem("vista", "edita"); 
    } else {
        alert("Primero selecciona un mapa antes de editar.");
    }
}

function mostrarModal(boton) {
    document.getElementById('fechaModal').style.display = "flex";
    localStorage.setItem("Exhibidor", boton.innerHTML)
}

function cerrarModal() {
    document.getElementById('fechaModal').style.display = "none";
}

function setFechaHoy() {
    let now = new Date();
    let fechaISO = now.toISOString().split('T')[0]; 
    fechaSeleccionada = fechaISO;
    confirmarFecha();
}

function mostrarInputFecha() {
    document.getElementById('fechaInput').style.display = 'block';
}
function guardarFecha() {
    let input = document.getElementById('fechaInput').value;
    if (input) {
        fechaSeleccionada = input;
        confirmarFecha();
    }
}
function confirmarFecha(boton) {
    if (confirm(`¿Confirmar la fecha seleccionada?\n${fechaSeleccionada}`)) {
        cerrarModal();
        addRegistroExhibidor();
    }
}

async function addRegistroExhibidor(){

    if (!fechaSeleccionada) {
        alert("Debes seleccionar una fecha antes de continuar.");
        return;
    }
    


    let nombreExhibidor = localStorage.getItem("Exhibidor");
    let username = localStorage.getItem("username");

    const data = {
        nombre: nombreExhibidor,
        username: username,
        fecha: fechaSeleccionada
    };
    try {
        const response = await fetch("https://api-db-territorios.onrender.com/addregistro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert("Registro de exhibidor añadido con exito");
        } else {
            alert("Error: " + result.detail);
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Hubo un problema al crear el territorio.");
    }
}

function exit(){
    let confirmado = confirm("¿Quieres cerrar sesión?");    
    if (confirmado) {
        localStorage.clear();
        window.location.href = "../index.html";
    } 

}