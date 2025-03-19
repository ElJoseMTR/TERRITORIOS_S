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
function editarUsuario(username) {
    Swal.fire({
        title: `Editar a ${username}`,
        input: "radio",
        inputOptions: {
            password: "Contraseña",
            role: "Role"
        },
        inputValidator: (value) => {
            if (!value) {
                return "Debes seleccionar para editar";
            }
        },
        showCancelButton: true,
        confirmButtonText: "Editar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            let campo = result.value; 

            if (campo === "password") {
                editarUsuarioPassword(username);
            } else if (campo === "role") {
                editarUsuarioRol(username);
            }
        } else {
            Swal.fire("CANCELADA", "No se realizó ningún cambio.", "info");
        }
    });
}


function editarUsuarioPassword(username) {
    Swal.fire({
        title: `Editar contraseña de ${username}`,
        input: "password",
        inputPlaceholder: "Nueva contraseña",
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
            if (value.length > 10) {
                return "La contraseña debe tener menos de 10 caracteres";
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            actualizarPassword(username, result.value);
        } else {
            Swal.fire("CANCELADA", "No se realizó ningún cambio.", "info");
        }
    });
}

function actualizarPassword(username, nuevaPassword) {
    fetch(`https://api-db-territorios.onrender.com/usuariosupdatepassword/${username}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: nuevaPassword })
    })
        .then(response => response.json())
        .then(data => {
            Swal.fire("Éxito", `La contraseña de ${username} ha sido actualizada.`, "success");
            console.log(data);
        })
        .catch(error => {
            Swal.fire("Error", "No se pudo actualizar la contraseña.", "error");
            console.error("Error:", error);
        });
}

function editarUsuarioRol(username) {
    Swal.fire({
        title: `Selecciona un rol para ${username}`,
        input: "radio",
        inputOptions: {
            administrador: "administrador",
            capitan: "capitan",
            exhibidor: "usuario"
        },
        inputValidator: (value) => {
            if (!value) {
                return "Debes seleccionar un rol";
            }
        },
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            actualizarRol(username, result.value);
        } else {
            Swal.fire("CANCELADA", "No se realizó ningún cambio.", "info");
        }
    });
}

function actualizarRol(username, nuevoRol) {
    Swal.fire(`${username} ahora es ${nuevoRol.charAt(0).toUpperCase() + nuevoRol.slice(1)}.`);
    fetch(`https://api-db-territorios.onrender.com/usuariosupdaterole/${username}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nuevo_rol: nuevoRol })
    })
        .then(response => response.json())
        .then(data => console.log(data));
}
document.getElementById("gruposelect").addEventListener("change", function () {
    let selectedValue = this.value;
    let groupNumber = selectedValue.replace("grupo", "");
    localStorage.setItem("Centro", groupNumber);


    for (let i = 1; i <= 4; i++) {
        let mapa = document.querySelector(".mapaCentro" + i);
        if (mapa) {
            mapa.style.display = "none";
        }
    }

    let numeros = localStorage.getItem("Centro");
    let nombre = localStorage.getItem("Territorio");

    let selectedMap = document.querySelector(".mapaCentro" + numeros);

    if (selectedMap) {
        selectedMap.style.display = "block";
        let url = `https://api-db-territorios.onrender.com/getVistaMapas?territorio=${encodeURIComponent(nombre)}&grupo=${encodeURIComponent(numeros)}`;

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
    }
});




document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("path").forEach(path => {
        path.addEventListener("click", function () {
            const estado = localStorage.getItem("vista");
            const mapa = localStorage.getItem("Territorio");
            const grupo = localStorage.getItem("Centro");

            if (!mapa) {
                alert("No hay un mapa seleccionado.");
                return;

            }
            let nombre = `${this.id}`;
            let fecha = `Error: base de datos`;




            if (estado === "ver") {
                let stringnombre = `a`
                let url = `https://api-db-territorios.onrender.com/getFechaMapa?territorio=${encodeURIComponent(mapa)}&grupo=${encodeURIComponent(grupo)}&mapa=${encodeURIComponent(nombre)}`;

                switch (`${this.id}`) {
                    case "MFCriales":
                        stringnombre = `Manzana: Familia Criales`

                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaLaPoderosa":

                        stringnombre = `Manzana: Tienda La Poderosa`;

                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFVargas":
                        stringnombre = (`Manzana: Familia Vargas`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFPolanco":
                        stringnombre = (`Manzana: Familia Polanco`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFrenteSalon":
                        stringnombre = (`Manzana: Al Frente Del Salon Del Reino`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MCasaCarnaval":
                        stringnombre = (`Manzana: Casa Del Carnaval`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFCarvajal":
                        stringnombre = (`Manzana: Donde Vive La Familia Carvajal`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MLaBotella":
                        stringnombre = (`Manzana: La Botella`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFEcheverria":
                        stringnombre = (`Manzana: Familia Echeverria`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MHIslanda":
                        stringnombre = (`Manzana: Hermana Islanda Romero`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFCastro":
                        stringnombre = (`Manzana: Familia Castro`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFMaldonado":
                        stringnombre = (`Manzana: Familia Maldonado`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MSalon":
                        stringnombre = (`Manzana: Salon Del Reino`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MChacon":
                        stringnombre = (`Manzana: Familia Chacon Cassiani`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFSantiagoChacon":
                        stringnombre = (`Manzana: Familia Santiago Chacon`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MIslita":
                        stringnombre = (`Manzana: Islita`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaSureña":
                        stringnombre = (`Manzana: Familia Tienda Sureña`); fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MBicicletasBikebar":
                        stringnombre = (`Manzana: Taller De Bicicleta BikeBar`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;

                    //GRUPO 2
                    case "MFCera":
                        stringnombre = (`Manzana: Familia Cera Retamoso`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFCantillo":
                        stringnombre = (`Manzana: Familia Cantillo`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MColegioCorazonSantuario":
                        stringnombre = (`Manzana: Colegio El Corazon Del Santuario`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MSede":
                        stringnombre = (`Manzana: Sede`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MMiselaneaEdgar":
                        stringnombre = (`Manzana: Miselanea Del Señor Edgar`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFNuma":
                        stringnombre = (`Manzana: Familia Numa`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFCastañeda":
                        stringnombre = (`Manzana: Familia Castañeda Gomez`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MHJulia":
                        stringnombre = (`Manzana: Hermana Julia Lobelo`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MParquecito":
                        stringnombre = (`Manzana: Parquesito`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaDiosConNosotros":
                        stringnombre = (`Manzana: Tienda Dios Con Nosotros`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaMiAngelDeAmor":
                        stringnombre = (`Manzana: Tienda Mi Angel De Amor`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MLos6Hermanos":
                        stringnombre = (`Manzana: Los 6 Hermanos`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MHKelly":
                        stringnombre = (`Manzana: Hermana Paola Prieto`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFMartinez":
                        stringnombre = (`Manzana: Familia Martinez`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MAlFrenteFMartinez":
                        stringnombre = (`Manzana: Al Frente La Familia Martinez`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaMerkanubar":
                        stringnombre = (`Manzana: Tienda Merkanubar`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MAlLadoParqueAbandonado":
                        stringnombre = (`Manzana: Al Lado Del Parque Abandonado`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MAlLadoTiendaPrecioEsCorrecto":
                        stringnombre = (`Manzana: Al Lado De La Tienda El Precio Es Correcto`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaPrecioEsCorrecto":
                        stringnombre = (`Manzana: Tienda El Precio Es Correcto`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MParqueGoldaMeir":
                        stringnombre = (`Manzana: Parque GolaMeir`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MAlLadoFCoronado":
                        stringnombre = (`Manzana: Al Lado De La Familia Coronado`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFCoronado":
                        stringnombre = (`Manzana: Familia Coronado Montaño`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MParqueAbandonado":
                        stringnombre = (`Manzana: Parque Abandonado`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFrenteFSuarez":
                        stringnombre = (`Manzana: Frente La Familia Suarez`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFarmaciaJyH":
                        stringnombre = (`Manzana: Farmacia JyH`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    //GRUPO 3
                    case "MFPerezSegura":
                        stringnombre = (`Manzana: Familia Perez Segura`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFPerezCarvajal":
                        stringnombre = (`Manzana: Familia Perez Carvajal`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaLaRenovacion":
                        stringnombre = (`Manzana: Tienda La Renovacion`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MPanaderiaElLider":
                        stringnombre = (`Manzana: Panaderia El Lider`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MLosGallos":
                        stringnombre = (`Manzana: Los Gallos / Bodega De La Ferreteria Santuario`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MMuebleriaLuxuryHouse":
                        stringnombre = (`Manzana: Muebleria Luxury House`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaLaFeEnDios":
                        stringnombre = (`Manzana: Tienda La Fe En Dios De La 52`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MVariedadesFenicia":
                        stringnombre = (`Manzana: Variedades Fenicia`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaElBacan":
                        stringnombre = (`Manzana: Tienda El Bacan`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MEstaderoLaRetoba":
                        stringnombre = (`Manzana: Estadero La Retoba`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTallerCarlos":
                        stringnombre = (`Manzana: Taller Carlos`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MSeñoraLevix":
                        stringnombre = (`Manzana: Donde Vive La Señora Levix`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MHFrancelina":
                        stringnombre = (`Manzana: Hermana Francelina Muñoz`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaElEden":
                        stringnombre = (`Manzana: Tienda El Eden`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaDondeTotto":
                        stringnombre = (`Manzana: Tienda Donde Totto`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaNuevoRenacer":
                        stringnombre = (`Manzana: Tienda Nuevo Renacer`);

                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MAlLadoDondeTotto":
                        stringnombre = (`Manzana: Al Lado De La Tienda Donde Totto`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFSuarez":
                        stringnombre = (`Manzana: Familia Suarez`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MLasPiedras":
                        stringnombre = (`Las Piedras`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MLaIslita3":
                        stringnombre = (`Manzana: La Islita`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFrenteFTapia":
                        stringnombre = (`Manzana: Frente La Familia Tapia`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFTapia":
                        stringnombre = (`Manzana: Familia Tapia`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaRivero":
                        stringnombre = (`Manzana: Tienda Rivero`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MLaBombonera":
                        stringnombre = (`Manzana: La Bombonera`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    //GRUPO 4
                    case "MBillaresLasPernicias":
                        stringnombre = (`Manzana: Billares Las Pernicias`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFCeren":
                        stringnombre = (`Manzana: Familia Ceren`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MColegioJesusDeNazareth":
                        stringnombre = (`Manzana: Colegio Jesus De Nazareth`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MHBelen":
                        stringnombre = (`Manzana: Hermana Belen Garcia`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MColegioAtanacioGirardot":
                        stringnombre = (`Manzana: Colegioo Atanacio Girardot`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFTorregrosa":
                        stringnombre = (`Manzana: Familia Torregrosa`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFrenteLaPanaderiaLaEsquinaDel":
                        stringnombre = (`Manzana: Frente La Panaderia La Esquina Del Sabor`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MTiendaJJ":
                        stringnombre = (`Manzana: Tienda JJ`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;

                    case "MFrenteColegioLasAmericas":
                        stringnombre = (`Manzana: Frente Al Colegio Las Americas`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MVariedadesSofy":
                        stringnombre = (`Manzana: Variedades Sofy`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MHGloria":
                        stringnombre = (`Manzana: Hermana Gloria Vega`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MHGloria2":
                        stringnombre = (`Manzana: Hermana Gloria Vega2`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MHEloina":
                        stringnombre = (`Manzana: Hermana Eloina Palacio`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MPanaderiaEsquinaDelSabor":
                        stringnombre = (`Manzana: Panaderia La Esquina Del Sabor`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MRestauranteChino":
                        stringnombre = (`Manzana: Restaurante Chino`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFerreteriaElAmigo":
                        stringnombre = (`Manzana: Ferreteria El Amigo`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MIslitaDelBrazil":
                        stringnombre = (`Manzana: Islita Del Brazil`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MFundacionChildrenInternationa":
                        stringnombre = (`Manzana: Fundacion Children International`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    case "MAlLadoFundacionChildrenIntern":
                        stringnombre = (`Manzana: Al Lado De La Fundacion Children International`);
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data.error) {
                                    console.error("Error:", data.error);
                                } else {
                                    alert(`${stringnombre}\nFecha: ${data.fecha ? data.fecha : "No realizada"} \nUsuario: ${data.username ? data.username : "Desconocido"}`);
                                }
                            })
                            .catch(error => console.error("Error al buscar la fecha del mapa:", error));
                        break;
                    default:
                        break;
                }

            } else if (estado === "edita") {
                let nombre = this.id;
                let territorio = localStorage.getItem("Territorio");

                showSelectionDialog()
                    .then(opcion => {
                        if (!opcion) return;

                        let nuevoValor = null;
                        let nuevoColor = "green";
                        let nuevoHecho = "no";

                        if (opcion === "realizada") {
                            nuevoColor = "red";
                            nuevoValor = new Date().toISOString().split("T")[0];
                            nuevoHecho = "sí";
                        } else if (opcion === "incompleta") {
                            nuevoColor = "yellow";
                            nuevoValor = new Date().toISOString().split("T")[0];
                            nuevoHecho = "falta";
                        }

                        this.setAttribute("fill", nuevoColor);

                        if (!territorio || !nombre || !nuevoHecho) {
                            console.error("Datos inválidos para la actualización");
                            return;
                        }

                        let username = localStorage.getItem("username");


                        fetch("https://api-db-territorios.onrender.com/updateMapa", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                territorio: territorio,
                                mapa: nombre,
                                fecha: nuevoValor,
                                hecho: nuevoHecho,
                                username: username
                            })
                        })
                            .then(response => response.json())
                            .then(data => alert(data.message))
                            .catch(error => console.error("Error al actualizar el mapa:", error));
                    })
                    .catch(error => console.error("Error al seleccionar opción:", error));
            }


        });
    });
});

function showSelectionDialog() {
    return new Promise((resolve) => {
        const modal = document.createElement("div");
        modal.innerHTML = `
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
                border-radius: 10px; text-align: center; z-index: 1000;">
        <h3>Edita estado de la Manzana</h3>
        <button id="realizada" style="background: red; color: white; margin: 5px; padding: 10px;">Manzana Realizada</button>
        <button id="incompleta" style="background: yellow; color: black; margin: 5px; padding: 10px;">Manzana Incompleta</button>
        <button id="no_realizada" style="background: green; color: white; margin: 5px; padding: 10px;">Manzana No Realizada</button>
    </div>
`;
        document.body.appendChild(modal);

        document.getElementById("realizada").addEventListener("click", () => {
            document.body.removeChild(modal);
            resolve("realizada");
        });

        document.getElementById("incompleta").addEventListener("click", () => {
            document.body.removeChild(modal);
            resolve("incompleta");
        });

        document.getElementById("no_realizada").addEventListener("click", () => {
            document.body.removeChild(modal);
            resolve("no");
        });
    });
}



document.addEventListener("DOMContentLoaded", function () {
    fetch('https://api-db-territorios.onrender.com/usuarios')
        .then(response => response.json())
        .then(data => {
            const listaUsuarios = document.getElementById("listaUsuarios");

            let tablaHTML = `
        <table border="1">
            <tr>
                <th>Username</th>
                <th>Rol</th>
                <th>Eliminar</th>
            </tr>
    `;

            data.forEach(usuario => {
                tablaHTML += `
            <tr>
                <td>${usuario.username}</td>
                <td>${usuario.rol}</td>
                <td>
                    <button class="eliminar" onclick="eliminarUsuario('${usuario.username}')">Eliminar</button>
                    <button class="editar" onclick="editarUsuario('${usuario.username}')">Editar</button>
                </td>
            </tr>
        `;
            });

            tablaHTML += `</table>`;
            listaUsuarios.innerHTML = tablaHTML;
        })
        .catch(error => console.error("Error al obtener usuarios:", error));
});
