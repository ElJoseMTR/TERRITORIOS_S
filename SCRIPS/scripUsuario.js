function openExhibidor() {
    document.getElementById("appexhibidor").style.display = "block";
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