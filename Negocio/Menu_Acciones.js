
let tipoElegido;
document.addEventListener("DOMContentLoaded", function() {

    const hudAcciones = document.getElementById("hudAcciones");
    const hudDinamico = document.getElementById("hudDinamico");
    const btnConstruir = document.getElementById("btnConstruir");

   
    

    btnConstruir.addEventListener("click", function() {
        hudAcciones.style.display = "none";
        mostrarMenuConstruccion();
    });

    // Menú principal de construcción
    function mostrarMenuConstruccion() {
        hudDinamico.innerHTML = `
            <table>
                <tr>
                    <td><button id="btnResiden">Residencial</button></td>
                    <td><button id="btnComer">Comercial</button></td>
                    <td><button id="btnIndus">Industrial</button></td>
                    <td><button id="btnVolver">⬅ Volver</button></td>
                </tr>
            </table>
        `;

        document.getElementById("btnResiden").addEventListener("click", mostrarMenuResidencial);
        document.getElementById("btnComer").addEventListener("click", mostrarMenuComercial);
        document.getElementById("btnIndus").addEventListener("click", mostrarMenuIndustrial);
        document.getElementById("btnVolver").addEventListener("click", function() {
            hudDinamico.innerHTML = "";
            hudAcciones.style.display = "block";
        });
    }

    // Submenú Residencial
    function mostrarMenuResidencial() {
        hudDinamico.innerHTML = `
            <table>
                <tr>
                    <td><button data-tipo="R1">Casa</button></td>
                    <td><button data-tipo="R2">Apartamento</button></td>
                    <td><button id="btnVolver">⬅ Volver</button></td>
                </tr>
            </table>
        `;
        agregarListenerVolver();
        agregarListenerTipo();
    }

    // Submenú Comercial
    function mostrarMenuComercial() {
        hudDinamico.innerHTML = `
            <table>
                <tr>
                    <td><button data-tipo="C1">Tienda</button></td>
                    <td><button data-tipo="C2">Centro Comercial</button></td>
                    <td><button id="btnVolver">⬅ Volver</button></td>
                </tr>
            </table>
        `;
        agregarListenerVolver();
        agregarListenerTipo();
    }

    // Submenú Industrial
    function mostrarMenuIndustrial() {
        hudDinamico.innerHTML = `
            <table>
                <tr>
                    <td><button data-tipo="I1">Fábrica</button></td>
                    <td><button data-tipo="I2">Granja</button></td>
                    <td><button id="btnVolver">⬅ Volver</button></td>
                </tr>
            </table>
        `;
        agregarListenerVolver();
        agregarListenerTipo();
    }

    // Botón volver siempre regresa al menú principal de construcción
    function agregarListenerVolver() {
        const btnVolver = document.getElementById("btnVolver");
        btnVolver.addEventListener("click", function() {
            hudDinamico.innerHTML = "";
            mostrarMenuConstruccion();
        });
    }

    
    function agregarListenerTipo() {
        hudDinamico.addEventListener("click", function listener(e) {
            if (e.target.dataset.tipo) {
                
                 tipoElegido=e.target.dataset.tipo;
                
                hudDinamico.removeEventListener("click", listener); 
            }
        });
    }

});