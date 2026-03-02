document.addEventListener("DOMContentLoaded", inicializarJuego);



function inicializarJuego() {
    const ciudad = cargarCiudad();

    if (!ciudad) return;

    mostrarDatosCiudad(ciudad);
    renderizarMapa(ciudad);
}
function cargarCiudad() {
    const ciudad = CiudadStorage.cargar();

    if (!ciudad) {
        alert("No hay partida guardada. Crea una nueva ciudad.");
        window.location.href = "Crear_Ciudad.html";
        return null;
    }

    console.log(ciudad);
    console.log(ciudad?.mapa);

    return ciudad;
}
function mostrarDatosCiudad(ciudad) {
    document.getElementById("datosCiudad").textContent = ciudad.nombreCiudad;

    document.getElementById("infoRecursos").textContent =
        `Dinero: ${ciudad.dinero} | Electricidad: ${ciudad.electricidad} | Agua: ${ciudad.agua} | Alimento: ${ciudad.alimento} | Población: ${ciudad.poblacion}`;
}function renderizarMapa(ciudad) {
    const mapaContainer = document.getElementById("mapaContainer");
    let tablaHTML = "<table>";

    for (let i = 0; i < ciudad.mapa.tamanio; i++) {
        tablaHTML += "<tr>";

        for (let j = 0; j < ciudad.mapa.tamanio; j++) {

            const valor = ciudad.mapa.matriz[i][j];
            const clase = obtenerClaseCelda(valor);

            tablaHTML += 
          `
                <td class="${clase}">
                    <button class="casilla" data-x="${i}" data-y="${j}" ></button>
                </td>
            `;
        }

        tablaHTML += "</tr>";
    }

    tablaHTML += "</table>";
    mapaContainer.innerHTML = tablaHTML;
}
function obtenerClaseCelda(valor) {

    if (valor === "g") return "grass";
    if (valor === "r") return "road";
    if (valor === "R1" || valor === "R2") return "residential";
    if (valor === "C1" || valor === "C2") return "commercial";
    if (valor === "I1" || valor === "I2") return "industrial";
    if (valor === "S1" || valor === "S2" || valor === "S3") return "service";
    if (valor === "U1" || valor === "U2") return "utility";
    if (valor === "P1") return "park";

    return "";
}



