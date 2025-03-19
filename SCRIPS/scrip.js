document.getElementById("presionarsesion").addEventListener("click",async function(event){
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    try {
        let response = await fetch(`https://api-db-territorios.onrender.com/openWeb/${username}/${password}`);

        let data = await response.json();

        if (response.ok) {
            if (data.status === "success") {
                if (data.role === "administrador") {
                    localStorage.setItem("username", username);
                    localStorage.setItem("role", data.role);
                    window.location.href = "paginas/admin.html";
                } else if (data.role === "capitan") {
                    localStorage.setItem("username", username);
                    localStorage.setItem("role", data.role)
                    window.location.href = "paginas/inicio.html";
                } else if(data.role === "usuario"){
                    localStorage.setItem("username", username);
                    localStorage.setItem("role", data.role)
                    window.location.href = "paginas/inicioE.html";
                }
            } else {
                alert("Usuario o contraseña incorrectos.");
            }
        } else {
            alert("Error en el servidor.");
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Error de conexión.");
    }
});
