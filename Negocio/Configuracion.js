document.addEventListener('DOMContentLoaded', () => {

    const getMensaje = () => document.getElementById("mensajeAusuario");

    function limpiarMensaje() {
        const el = getMensaje();
        if (el) el.innerHTML = "";
    }

    const botonesConfiguracion = {
        btnCambioTiempo: document.getElementById('btnCambioTiempo'),
        btnCambioTasaAumento: document.getElementById('btnCambioTasaAumento'),
        btnCambioConsumo: document.getElementById('btnCambioConsumo'),

        btnModificarDinero: document.getElementById('btnModificarDinero'),
        btnModificarElectricidad: document.getElementById('btnModificarElectricidad'),
        btnModificarAgua: document.getElementById('btnModificarAgua'),
        btnModificarAlimento: document.getElementById('btnModificarAlimento'),

        btnCambioBeneficioH: document.getElementById('btnCambioBeneficioH'),
        btnCambioBeneficioP: document.getElementById('btnCambioBeneficioP'),
        btnCambioBeneficioB: document.getElementById('btnCambioBeneficioB'),

        btnExportarCiudad: document.getElementById('btnExportarMapa'),
        EliminarCiudad: document.getElementById('EliminarCiudad'),
        CrearNuevaCiudad: document.getElementById('CrearNuevaCiudad')
    };

    // ================= TIEMPO =================
    botonesConfiguracion.btnCambioTiempo.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = `
        <div>
            <label>Ingrese el nuevo tiempo del turno (en segundos):</label>
            <input type="number" id="nuevoTiempoTurno" min="1" value="10">
            <button id="confirmarCambioTiempo">Confirmar</button>
        </div>`;

        document.getElementById('confirmarCambioTiempo').addEventListener('click', () => {
            const input = document.getElementById('nuevoTiempoTurno');
            cambiarTiempoTurno(parseInt(input.value) * 1000);
            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Tiempo cambiado a ${input.value}s`, 3000);
        });
    });

    // ================= RANGO CIUDADANOS =================
    botonesConfiguracion.btnCambioTasaAumento.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = `<div>
        <label>Nuevo rango de ciudadanos:</label>
        <input type="number" id="nuevoMinimoCiudadanos" min="0" value="1">
        <input type="number" id="nuevoMaximoCiudadanos" min="1" value="3">
        <button id="confirmarCambioRango">Confirmar</button>
        </div>`;

        document.getElementById('confirmarCambioRango').addEventListener('click', () => {

            const min = parseInt(document.getElementById('nuevoMinimoCiudadanos').value);
            const max = parseInt(document.getElementById('nuevoMaximoCiudadanos').value);

            const validacion = cambiarRangoCreacion(max, min);

            if (!validacion) {
                limpiarMensaje();
                UIMensajes.mostrarMensaje(`Rango inválido`, 3000);
                return;
            }

            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Rango actualizado`, 3000);
        });
    });

    // ================= CONSUMO =================
    botonesConfiguracion.btnCambioConsumo.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = `<div>
        <label>Consumo por ciudadano:</label>
        <input type="number" id="nuevoConsumo" min="0" value="1">
        <button id="confirmarCambioConsumo">Confirmar</button>
        </div>`;

        document.getElementById('confirmarCambioConsumo').addEventListener('click', () => {
            const valor = parseInt(document.getElementById('nuevoConsumo').value);

            const validacion = cambiarConsumoCiudadano(valor);

            if (!validacion) {
                limpiarMensaje();
                UIMensajes.mostrarMensaje(`Consumo inválido`, 3000);
                return;
            }

            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Consumo actualizado`, 3000);
        });
    });

    // ================= DINERO =================
    botonesConfiguracion.btnModificarDinero.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = `<div>
        <label>Modificar dinero(ingrese la cantidad a agregar o restar con un - al inicio):</label>
        <input type="number" id="cantidadDinero" value="0">
        <button id="confirmarCambioDinero">Confirmar</button>
        </div>`;

        document.getElementById('confirmarCambioDinero').addEventListener('click', () => {
            const valor = parseInt(document.getElementById('cantidadDinero').value);
            ciudad.dinero += valor;
            CiudadStorage.guardar(ciudad);
            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Dinero actualizado: ${ciudad.dinero}`, 3000);
            mostrarDatosCiudad(ciudad);
        });
    });

    // ================= ELECTRICIDAD =================
    botonesConfiguracion.btnModificarElectricidad.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = `<div>
        <label>Modificar electricidad:</label>
        <input type="number" id="cantidadElectricidad" value="0">
        <button id="confirmarCambioElectricidad">Confirmar</button>
        </div>`;

        document.getElementById('confirmarCambioElectricidad').addEventListener('click', () => {
            const valor = parseInt(document.getElementById('cantidadElectricidad').value);
            ciudad.electricidad += valor;
            CiudadStorage.guardar(ciudad);
            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Electricidad: ${ciudad.electricidad}`, 3000);
            mostrarDatosCiudad(ciudad);
        });
    });

    // ================= AGUA =================
    botonesConfiguracion.btnModificarAgua.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = `<div>
        <label>Modificar agua:</label>
        <input type="number" id="cantidadAgua" value="0">
        <button id="confirmarCambioAgua">Confirmar</button>
        </div>`;

        document.getElementById('confirmarCambioAgua').addEventListener('click', () => {
            const valor = parseInt(document.getElementById('cantidadAgua').value);
            ciudad.agua += valor;
            CiudadStorage.guardar(ciudad);
            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Agua: ${ciudad.agua}`, 3000);
            mostrarDatosCiudad(ciudad);
        });
    });

    // ================= ALIMENTO =================
    botonesConfiguracion.btnModificarAlimento.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = `<div>
        <label>Modificar alimento:</label>
        <input type="number" id="cantidadAlimento" value="0">
        <button id="confirmarCambioAlimento">Confirmar</button>
        </div>`;

        document.getElementById('confirmarCambioAlimento').addEventListener('click', () => {
            const valor = parseInt(document.getElementById('cantidadAlimento').value);
            ciudad.alimento += valor;
            CiudadStorage.guardar(ciudad);
            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Alimento: ${ciudad.alimento}`, 3000);
            mostrarDatosCiudad(ciudad);

        });
    });

    botonesConfiguracion.btnCambioBeneficioH.addEventListener('click', () => {
            const el = getMensaje();
            if (!el) return;

            el.innerHTML = `<div>
            <label>Nuevo beneficio por felicidad:</label>
            <input type="number" id="nuevoBeneficioH" min="0" value="0">
            <button id="confirmarCambioBeneficioH">Confirmar</button>
            </div>`;

            document.getElementById('confirmarCambioBeneficioH').addEventListener('click', () => {
                const valor = parseInt(document.getElementById('nuevoBeneficioH').value);
                for (let i = 0; i < ciudad.edificios.length; i++) {
                    
                    const edificio = ciudad.edificios[i];
                    if(edificio.tipo==="Hospital"){
                        console.log("edificio encontrado", edificio);
                         validacion=edificio.cambiarBeneficio(valor);
                         if(!validacion){
                            limpiarMensaje();
                            UIMensajes.mostrarMensaje(`Beneficio inválido`, 3000);
                            return;
                         }
                    }
                }
                CiudadStorage.guardar(ciudad);
                console.log(ciudad.edificios);
                limpiarMensaje();
                UIMensajes.mostrarMensaje(`Beneficio por felicidad actualizado`, 3000);
            });
    }
    );

    botonesConfiguracion.btnCambioBeneficioP.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;
        el.innerHTML = `<div>
        <label>Nuevo beneficio por felicidad:</label>
        <input type="number" id="nuevoBeneficioP" min="0" value="0">
        <button id="confirmarCambioBeneficioP">Confirmar</button>
        </div>`;
        document.getElementById('confirmarCambioBeneficioP').addEventListener('click', () => {
            const valor = parseInt(document.getElementById('nuevoBeneficioP').value);
            for (let i = 0; i < ciudad.edificios.length; i++) {
                const edificio = ciudad.edificios[i];
                if(edificio.tipo==="Estacion de policia"){
                    console.log("edificio encontrado", edificio);
                    const validacion = edificio.cambiarBeneficio(valor);
                    if(!validacion){
                        limpiarMensaje();
                        UIMensajes.mostrarMensaje(`Beneficio inválido`, 3000);
                        return;
                    }
                }
            }

            CiudadStorage.guardar(ciudad);
            console.log(ciudad.edificios);
            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Beneficio por felicidad actualizado`, 3000);
        });
    });
    botonesConfiguracion.btnCambioBeneficioB.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;
        el.innerHTML = `<div>
        <label>Nuevo beneficio por felicidad:</label>
        <input type="number" id="nuevoBeneficioB" min="0" value="0">
        <button id="confirmarCambioBeneficioB">Confirmar</button>
        </div>`;
        document.getElementById('confirmarCambioBeneficioB').addEventListener('click', () => {
            const valor = parseInt(document.getElementById('nuevoBeneficioB').value);
            for (let i = 0; i < ciudad.edificios.length; i++) {
                const edificio = ciudad.edificios[i];
                if(edificio.tipo==="Estacion de bomberos"){
                    console.log("edificio encontrado", edificio);
                    const validacion = edificio.cambiarBeneficio(valor);
                    if(!validacion){
                        limpiarMensaje();
                        UIMensajes.mostrarMensaje(`Beneficio inválido`, 3000);
                        return;
                    }
                }
            }
            CiudadStorage.guardar(ciudad);
            console.log(ciudad.edificios);
            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Beneficio por felicidad actualizado`, 3000);
        });
    });
    // ================= ELIMINAR =================
    botonesConfiguracion.EliminarCiudad.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = `<div>
        <label>¿Eliminar ciudad?</label>
        <button id="confirmarEliminarCiudad">Sí</button>
        <button id="cancelarEliminarCiudad">No</button>
        </div>`;

        document.getElementById('cancelarEliminarCiudad').addEventListener('click', limpiarMensaje);
        document.getElementById('confirmarEliminarCiudad').addEventListener('click', () => {
            eliminarCiudad(ciudad);
            limpiarMensaje();
            UIMensajes.mostrarMensaje(`Ciudad eliminada, Juego terminado`, 3000);
        });
    });
    function eliminarCiudad(ciudad){
        detenerTurnos();
        RankingStorage.guardarEnRanking(ciudad);
        UIMensajes.mostrarMensaje(`Juego Terminado, desempeño guardado en ranking local`, 8000);
        CiudadStorage.limpiar();
        ciudad = null;
        setTimeout(() => {
        window.location.href="Menu_Principal.html";
         },1000);
        }

        botonesConfiguracion.CrearNuevaCiudad.addEventListener('click', () => {
            const el = getMensaje();
            if (!el) return;
            el.innerHTML = `<div>
            <label>¿Crear nueva ciudad? Se perderá el progreso actual.</label>
            <button id="confirmarCrearCiudad">Sí</button>
            <button id="cancelarCrearCiudad">No</button>
            </div>`;
            document.getElementById('cancelarCrearCiudad').addEventListener('click', limpiarMensaje);
            document.getElementById('confirmarCrearCiudad').addEventListener('click', () => {
                eliminarCiudad(ciudad);
                limpiarMensaje();
                window.location.href="Crear_Ciudad.html";
                
            });

        });
    botonesConfiguracion.btnExportarCiudad.addEventListener('click', () => {
        const el = getMensaje();
        if (!el) return;
        el.innerHTML = `<div>
        <label>¿Exportar mapa de la ciudad?</label>
        <button id="confirmarExportarCiudad">Sí</button>
        <button id="cancelarExportarCiudad">No</button>
        </div>`;

        document.getElementById('cancelarExportarCiudad').addEventListener('click', limpiarMensaje);
            document.getElementById('confirmarExportarCiudad').addEventListener('click', () => {
                descargarMapaTXT(ciudad);
                limpiarMensaje();
                UIMensajes.mostrarMensaje(`Mapa exportado`, 3000);

            });



    });
    

    window.Configuracion = {
        eliminarCiudad
    };

    

});