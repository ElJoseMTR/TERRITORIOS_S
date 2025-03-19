function openInicio() {
    document.getElementById("appmapa").style.display = "none";
    document.getElementById("appexhibidor").style.display = "none";
    document.getElementById("appusuarios").style.display = "none";
    document.getElementById("appregistro").style.display = "none";
    document.getElementById("appinicio").style.display = "block";
}
function openMapa() {
    document.getElementById("appregistro").style.display = "none";
    document.getElementById("appinicio").style.display = "none";
    document.getElementById("appexhibidor").style.display = "none";
    document.getElementById("appusuarios").style.display = "none";
    document.getElementById("appmapa").style.display = "block";
}
function openExhibidor() {
    document.getElementById("appmapa").style.display = "none";
    document.getElementById("appinicio").style.display = "none";
    document.getElementById("appusuarios").style.display = "none";
    document.getElementById("appregistro").style.display = "none";
    document.getElementById("appexhibidor").style.display = "block";
}
function openUsuarios() {
    document.getElementById("appmapa").style.display = "none";
    document.getElementById("appexhibidor").style.display = "none";
    document.getElementById("appinicio").style.display = "none";
    document.getElementById("appregistro").style.display = "none";
    document.getElementById("appusuarios").style.display = "block";
}
function openRegistro() {
    document.getElementById("appmapa").style.display = "none";
    document.getElementById("appexhibidor").style.display = "none";
    document.getElementById("appusuarios").style.display = "none";
    document.getElementById("appinicio").style.display = "none";
    document.getElementById("appregistro").style.display = "block";
}

//VER TERRITORIOS


async function cargarTerritorios() {
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
            if (territorioSeleccionado === "SELECCIONA") return;
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


async function cargarTerritorioss() {
    try {
        const response = await fetch("https://api-db-territorios.onrender.com/getTerritorios");
        const data = await response.json();

        const select = document.createElement("select");
        select.classList.add("miselect");

        data.territorios.forEach(territorio => {
            const option = document.createElement("option");
            option.value = territorio;
            option.textContent = territorio;
            select.appendChild(option);
        });

        document.getElementById("listaMapasRegistro").appendChild(select);

        select.addEventListener("change", () => {
            const territorioSeleccionado = select.value;
            if (territorioSeleccionado === "SELECCIONA") {
                localStorage.removeItem("Territorio")
                return;
            } else {
                localStorage.setItem("Territorio", territorioSeleccionado);
                document.getElementById("botonesRegistroTerritorios").style.display = "block";
            }
        });
    } catch (error) {
        console.error("Error al cargar los territorios:", error);
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

function salir(){
    let confirmado = confirm("¿Quieres cerrar sesión?");    
    if (confirmado) {
        localStorage.clear();
        window.location.href = "../index.html";
    } 
}

///creat
async function crearmapa() {
    const nombreMapa = document.getElementById("nombremapa").value.trim();
    if (!nombreMapa) {
        alert("Por favor, ingrese un nombre para el territorio.");
        return;
    }
    const data = {
        nombre: nombreMapa
    };
    try {
        const response = await fetch("https://api-db-territorios.onrender.com/createTerritorio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert("Territorio creado con éxito.");
            document.getElementById("nombremapa").value = "";
        } else {
            alert("Error: " + result.detail);
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Hubo un problema al crear el territorio.");
    }
}

function clickguardar() {
    const estado = localStorage.getItem("vista");
    if (estado === "edita") {
        localStorage.setItem("vista", "ver");
    }
}

function clickeditar() {
    const mapa = localStorage.getItem("Territorio");
    if (mapa) {
        alert("¡Ya puedes editar!");
        localStorage.setItem("vista", "edita");
    } else {
        alert("Primero selecciona un mapa antes de editar.");
    }
}

function registroTerritorios() {
    document.getElementById("botonTerritorio").style.display = "none";
    document.getElementById("botonExhibidores").style.display = "none";
    document.getElementById("registroTerritorio").style.display = "block";
    cargarTerritorioss();
}
function registroExhibidores() {
    document.getElementById("botonTerritorio").style.display = "none";
    document.getElementById("botonExhibidores").style.display = "none";
    document.getElementById("Lista").style.display = "block";
}
async function clickEliminarTerritorio() {
    const territorio = localStorage.getItem("Territorio");

    if (!territorio || territorio.trim() === "") {
        alert("No hay un territorio seleccionado para eliminar.");
        return;
    }

    try {
        const response = await fetch("https://api-db-territorios.onrender.com/deleteTerritorio", {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ "territorio": territorio }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error en la respuesta del servidor.");
        }

        const data = await response.json();
        alert(data.message);
        localStorage.removeItem("Territorios"); 
    } catch (error) {
        console.error("Error al eliminar el territorio:", error);
        alert("Ocurrió un error al eliminar el territorio: " + error.message);
    }
}
function resgistroEloina(){
    localStorage.setItem("registroExhibidor", "Exhibidor_H_Eloina");
    document.getElementById("Lista").style.display = "none";
    document.getElementById("selecctordeFecha").style.display = "block";
}
function registroCastañeda(){
    localStorage.setItem("registroExhibidor", "Exhibidor_FCastañeda");
    document.getElementById("Lista").style.display = "none";
    document.getElementById("selecctordeFecha").style.display = "block";
}
function registroParquesito(){
    localStorage.setItem("registroExhibidor", "Exhibidor_Parquesito");
    document.getElementById("Lista").style.display = "none";
    document.getElementById("selecctordeFecha").style.display = "block";
}
function registroToño(){
    localStorage.setItem("registroExhibidor", "Exhibidor_Donde_Toño");
    document.getElementById("Lista").style.display = "none";
    document.getElementById("selecctordeFecha").style.display = "block";
}
function añoSeleccionado(){    
    let select = document.getElementById("año");
    let selectedValue = select.value;
    if (selectedValue === "SELECCIONA")return;
    localStorage.setItem("añoResgistro", selectedValue);
    document.getElementById("mes").style.display = "block";
}

function mesSeleccionado() {
    let año = localStorage.getItem("añoResgistro");
    let nombre = localStorage.getItem("registroExhibidor");
    let select = document.getElementById("mess");
    let mesNombre = select.value;

    if (mesNombre === "SELECCIONA") return;

    const meses = {
        "Enero": "01", "Febrero": "02", "Marzo": "03", "Abril": "04",
        "Mayo": "05", "Junio": "06", "Julio": "07", "Agosto": "08",
        "Septiembre": "09", "Octubre": "10", "Noviembre": "11", "Diciembre": "12"
    };

    let mes = meses[mesNombre];
    document.getElementById("datos").style.display = "block";

    fetch(`https://api-db-territorios.onrender.com/exhibidores/uso?nombre=${nombre}&año=${año}&mes=${mes}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("usos").textContent = `Usos: ${data.uso}`;
        })
        .catch(error => {
            console.error("Error al obtener cantidad de usos:", error);
        });

    fetch(`https://api-db-territorios.onrender.com/exhibidores/lista?nombre=${nombre}&año=${año}&mes=${mes}`)
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("exhibidoresLista");
            select.innerHTML = "<option value=''>SELECCIONA</option>"; // Limpiar lista

            data.exhibidores.forEach(exhibidor => {
                let option = document.createElement("option");
                option.textContent = `Nombre: ${exhibidor.nombre} | Fecha: ${exhibidor.fecha} | Username: ${exhibidor.username}`;

                option.dataset.nombre = exhibidor.nombre;
                option.dataset.fecha = exhibidor.fecha;
                option.dataset.username = exhibidor.username;

                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al obtener exhibidores:", error);
        });
}

function registrodeElExhibidor() {
    let select = document.getElementById("exhibidoresLista");
    let selectedOption = select.options[select.selectedIndex];

    if (!selectedOption.dataset.nombre) {
        console.error("Opción inválida o mal formateada.");
        return;
    }

    let nombre = selectedOption.dataset.nombre;
    let fecha = selectedOption.dataset.fecha;
    let username = selectedOption.dataset.username;

    localStorage.setItem("EliminarNombre", nombre);
    localStorage.setItem("EliminarFecha", fecha);
    localStorage.setItem("EliminarUsername", username);

    console.log("Datos obtenidos correctamente:", { nombre, fecha, username });
}



function EliminarRegistroExhibidor(){
    let nombre = localStorage.getItem("EliminarNombre");
    let fecha = localStorage.getItem("EliminarFecha");
    let username = localStorage.getItem("EliminarUsername");

    fetch(`https://api-db-territorios.onrender.com/exhibidores/eliminar?nombre=${nombre}&fecha=${fecha}&username=${username}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar el exhibidor");
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        alert("Exhibidor eliminado correctamente");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("No se pudo eliminar el exhibidor");
    });
}
function crearUsuario() {
    Swal.fire({
        title: 'Crear Usuario',
        html: `
            <input type="text" id="username" class="swal2-input" placeholder="Nombre de usuario">
            <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
            <div style="text-align: left; margin-top: 10px;">
                <label><input type="radio" name="role" value="administrador"> administrador</label><br>
                <label><input type="radio" name="role" value="usuario" checked> usuario</label><br>
                <label><input type="radio" name="role" value="capitan"> capitan</label>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked').value;

            if (!username || !password) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }

            return { username, password, role };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("https://api-db-territorios.onrender.com/usuarioscreate/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(result.value)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    Swal.fire('¡Usuario creado!', `Nombre: ${result.value.username}<br>Rol: ${result.value.role}`, 'success');
                } else {
                    Swal.fire('Error', 'No se pudo crear el usuario', 'error');
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire('Error', 'Hubo un problema con la solicitud', 'error');
            });
        }
    });
}
function clickVistaTerritorio() {
    let territorio = localStorage.getItem("Territorio");
    
    let vista = confirm("¿Quieres que los capitanes vean al territorio?") ? true : false;
    
    fetch(`https://api-db-territorios.onrender.com/updateTerritorioVista?nombre=${territorio}&vista=${vista}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));
}
