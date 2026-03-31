class CiudadStorage {

    static clave = "ciudadGuardada";

    // =========================
    // GUARDAR
    // =========================
    static guardar(ciudad) {

        let listaCiudadanosPlano = [];

        for (let i = 0; i < ciudad.ciudadanos.length; i++) {

            let ciudadano = ciudad.ciudadanos[i];

            let ciudadanoSimple = {
                id: ciudadano.id,
                nivelFelicidad: ciudadano.nivelFelicidad,
                viviendaX: null,
                viviendaY: null,
                empleoX: null,
                empleoY: null
            };

            if (ciudadano.vivienda) {
                ciudadanoSimple.viviendaX = ciudadano.vivienda.x;
                ciudadanoSimple.viviendaY = ciudadano.vivienda.y;
            }

            if (ciudadano.empleo) {
                ciudadanoSimple.empleoX = ciudadano.empleo.x;
                ciudadanoSimple.empleoY = ciudadano.empleo.y;
            }

            listaCiudadanosPlano.push(ciudadanoSimple);
        }

        let listaEdificiosPlano = [];

        for (let i = 0; i < ciudad.edificios.length; i++) {

            let edificio = ciudad.edificios[i];

            let edificioSimple = {
                codigoMapa: edificio.codigoMapa,
                nombre: edificio.nombre,
                x: edificio.x,
                y: edificio.y,
                residentesIds: [],
                empleadosIds: []
            };

            if (edificio.ciudadanosViviendo) {
                for (let j = 0; j < edificio.ciudadanosViviendo.length; j++) {
                    edificioSimple.residentesIds.push(edificio.ciudadanosViviendo[j].id);
                }
            }

            if (edificio.ciudadanosEmpleados) {
                for (let j = 0; j < edificio.ciudadanosEmpleados.length; j++) {
                    edificioSimple.empleadosIds.push(edificio.ciudadanosEmpleados[j].id);
                }
            }

            listaEdificiosPlano.push(edificioSimple);
        }

        let ciudadPlano = {
            nombreCiudad: ciudad.nombreCiudad,
            latitud: ciudad.latitud,        // <--- agregado
            longitud: ciudad.longitud,      // <--- agregado
            region: ciudad.region,          // <--- agregado
            dinero: ciudad.dinero,
            electricidad: ciudad.electricidad,
            agua: ciudad.agua,
            alimento: ciudad.alimento,
            poblacion: ciudad.poblacion,
            puntuacion: ciudad.puntuacion,
            tamanioMapa: ciudad.mapa.tamanio,
            matrizMapa: ciudad.mapa.matriz,
            ciudadanos: listaCiudadanosPlano,
            edificios: listaEdificiosPlano
        };

        localStorage.setItem(this.clave, JSON.stringify(ciudadPlano));
    }


    // =========================
    // CARGAR
    // =========================
    static cargar() {

        let datos = localStorage.getItem(this.clave);
        if (!datos) return null;

        let ciudadPlano = JSON.parse(datos);

        
        if (!ciudadPlano.ciudadanos) ciudadPlano.ciudadanos = [];
        if (!ciudadPlano.edificios) ciudadPlano.edificios = [];

        // ===== MAPA =====
        let mapa = new Mapa(ciudadPlano.tamanioMapa);
        mapa.matriz = ciudadPlano.matrizMapa;

        // ===== CIUDAD =====
        let ciudad = new Ciudad(
         ciudadPlano.nombreCiudad,      // nombreCiudad
         ciudadPlano.latitud,           // latitud
         ciudadPlano.longitud,          // longitud
         ciudadPlano.dinero,            // dinero
         ciudadPlano.electricidad,      // electricidad
         ciudadPlano.agua,              // agua
         ciudadPlano.alimento,          // alimento
         ciudadPlano.poblacion,         // poblacion
         ciudadPlano.puntuacion,        // puntuacion
         ciudadPlano.region || ""       // region
);

        ciudad.mapa = mapa;
        ciudad.ciudadanos = [];
        ciudad.edificios = [];

        // ===== CREAR CIUDADANOS =====
        for (let i = 0; i < ciudadPlano.ciudadanos.length; i++) {

            let datosCiudadano = ciudadPlano.ciudadanos[i];

            let nuevo = new Ciudadano(
                datosCiudadano.id,
                datosCiudadano.nivelFelicidad
            );

            ciudad.ciudadanos.push(nuevo);
        }

        // ===== CREAR EDIFICIOS =====
        for (let i = 0; i < ciudadPlano.edificios.length; i++) {

            let e = ciudadPlano.edificios[i];
            let edificio = null;

            if (e.codigoMapa === "R1") {
                edificio = Edificio_Residencial.crearCasa(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "R2") {
                edificio = Edificio_Residencial.crearApartamento(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "C1") {
                edificio = Edificio_Comercial.crearTienda(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "C2") {
                edificio = Edificio_Comercial.crearCentroComercial(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "I1") {
                edificio = Edificio_Industrial.crearFabrica(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "I2") {
                edificio = Edificio_Industrial.crearGranja(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "S1") {
                edificio = Edificio_Servicios.crearEstacionPolicia(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "S2") {
                edificio = Edificio_Servicios.crearEstacionBomberos(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "S3") {
                edificio = Edificio_Servicios.crearHospital(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "U1") {
                edificio = Planta_Utilidad.crearPlantaElectrica(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "U2") {
                edificio = Planta_Utilidad.crearPlantaAgua(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "P1") {
                edificio = Parque.crearParque(e.nombre, e.x, e.y, e.codigoMapa);
            } else if (e.codigoMapa === "r") {
                edificio = Via.crearVia(e.nombre, e.x, e.y, e.codigoMapa);
            }

            if (edificio) {
                
                if (!edificio.ciudadanosViviendo) edificio.ciudadanosViviendo = [];
                if (!edificio.ciudadanosEmpleados) edificio.ciudadanosEmpleados = [];

                ciudad.edificios.push(edificio);
            }
        }

        // ===== FUNCION BUSCAR =====
        function buscarCiudadanoPorId(lista, id) {
            for (let i = 0; i < lista.length; i++) {
                if (lista[i].id === id) return lista[i];
            }
            return null;
        }

        function buscarEdificio(x, y) {
            for (let i = 0; i < ciudad.edificios.length; i++) {
                if (ciudad.edificios[i].x === x && ciudad.edificios[i].y === y) {
                    return ciudad.edificios[i];
                }
            }
            return null;
        }

        // ===== RESTAURAR RELACIONES =====
        for (let i = 0; i < ciudadPlano.ciudadanos.length; i++) {

            let datosC = ciudadPlano.ciudadanos[i];
            let ciudadano = buscarCiudadanoPorId(ciudad.ciudadanos, datosC.id);

            if (!ciudadano) continue;

            if (datosC.viviendaX !== null) {
                let casa = buscarEdificio(datosC.viviendaX, datosC.viviendaY);
                if (casa) ciudadano.vivienda = casa;
            }

            if (datosC.empleoX !== null) {
                let trabajo = buscarEdificio(datosC.empleoX, datosC.empleoY);
                if (trabajo) ciudadano.empleo = trabajo;
            }
        }

        // ===== ASIGNAR A EDIFICIOS =====
        for (let i = 0; i < ciudadPlano.edificios.length; i++) {

            let datosE = ciudadPlano.edificios[i];
            let edificio = buscarEdificio(datosE.x, datosE.y);

            if (!edificio) continue;

            for (let j = 0; j < datosE.residentesIds.length; j++) {
                let c = buscarCiudadanoPorId(ciudad.ciudadanos, datosE.residentesIds[j]);
                if (c) edificio.ciudadanosViviendo.push(c);
            }

            for (let j = 0; j < datosE.empleadosIds.length; j++) {
                let c = buscarCiudadanoPorId(ciudad.ciudadanos, datosE.empleadosIds[j]);
                if (c) edificio.ciudadanosEmpleados.push(c);
            }
        }

        return ciudad;
    }

    static limpiar() {
        localStorage.removeItem(this.clave);
    }
}