class AlcaldeStorage {

    static clave = "alcaldeGuardado";

    // =========================
    // GUARDAR
    // =========================
    static guardar(alcalde) {

        if (!alcalde) return;

        const alcaldePlano = {
            nombreAlcalde: alcalde.nombreAlcalde
        };

        localStorage.setItem(this.clave, JSON.stringify(alcaldePlano));
    }

    // =========================
    // CARGAR
    // =========================
    static cargar() {

        const datos = localStorage.getItem(this.clave);
        if (!datos) return null;

        try {
            const alcaldePlano = JSON.parse(datos);

            const alcalde = new Alcalde(alcaldePlano.nombreAlcalde);

            return alcalde;

        } catch (error) {
            console.error("Error cargando alcalde:", error);
            return null;
        }
    }

    // =========================
    // ELIMINAR
    // =========================
    static limpiar() {
        localStorage.removeItem(this.clave);
    }
}