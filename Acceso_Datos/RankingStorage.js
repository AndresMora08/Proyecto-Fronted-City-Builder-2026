class RankingStorage {

    static clave = "rankingGuardado";


    static guardarEnRanking(ciudad) {

        // =========================
        // 1. OBTENER RANKING ACTUAL
        // =========================
        let ranking = JSON.parse(localStorage.getItem(this.clave)) || [];


        // =========================
        // 2. CREAR OBJETO DE LA CIUDAD
        // =========================
        const nuevaEntrada = {
            cityName: ciudad.nombreCiudad,
            mayor: ciudad.alcalde || "Desconocido",

            score: Number(ciudad.puntuacion || 0),
            population: Number(ciudad.poblacion || 0),

            
            happiness: ciudad.felicidadPromedio === -1 
                ? "--"
                : Math.round(ciudad.felicidadPromedio),

            turns: Number(ciudad.turno || 0),

            date: new Date().toISOString()
        };


        // =========================
        // 3. AGREGAR AL RANKING
        // =========================
        ranking.push(nuevaEntrada);


        // =========================
        // 4. ORDENAR POR PUNTUACIÓN
        // =========================
        ranking.sort((a, b) => b.score - a.score);


        // =========================
        // 5. GUARDAR EN LOCALSTORAGE
        // =========================
        localStorage.setItem(this.clave, JSON.stringify(ranking));
    }


    // =========================
    // OBTENER RANKING
    // =========================
    static obtenerRanking() {
        return JSON.parse(localStorage.getItem(this.clave)) || [];
    }


    // =========================
    // LIMPIAR RANKING
    // =========================
    static limpiarRanking() {
        localStorage.removeItem(this.clave);
    }


    // =========================
    // EXPORTAR A JSON
    // =========================
    static exportarRanking() {
        const ranking = this.obtenerRanking();

        const dataStr = JSON.stringify(ranking, null, 2);

        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ranking_ciudades.json";
        a.click();

        URL.revokeObjectURL(url);
    }
}