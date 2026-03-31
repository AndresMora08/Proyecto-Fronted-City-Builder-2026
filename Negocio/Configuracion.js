

function menuConfiguracion() {

    const mensajeAusuario = document.getElementById("mensajeAusuario");
    if (!mensajeAusuario) return;

    mensajeAusuario.innerHTML = `

    <div class="menu-configuracion">

        <h2>Menú de Configuración</h2>

        <div class="config-opciones">

            <button class="btn-menu btn-config-turno">
                Configuración de Turno
            </button>

            <button class="btn-menu btn-config-recursos">
                Modificación de Recursos
            </button>

            <button class="btn-menu btn-config-felicidad">
                Felicidad y Servicios
            </button>

            <button class="btn-menu btn-config-extra">
                Configuración Extra
            </button>

        </div>

    </div>

    `;

    const btnConfigTurno = document.querySelector(".btn-config-turno").addEventListener("click", configuracionTurno());
    const btnConfigRecursos = document.querySelector(".btn-config-recursos").addEventListener("click", configuracionRecursos());
    const btnConfigFelicidad = document.querySelector(".btn-config-felicidad").addEventListener("click", configuracionFelicidad()) ;
    const btnConfigExtra = document.querySelector(".btn-config-extra").addEventListener("click", configuracionExtra());
}

function configuracionTurno() {


    
}



