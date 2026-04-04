
function convertirMapaATexto(mapa){

    let texto = "";

    for(let i = 0; i < mapa.length; i++){

        texto += "[";

        for(let j = 0; j < mapa[i].length; j++){

            texto += mapa[i][j];

            if(j < mapa[i].length - 1){
                texto += ",";
            }
        }

        texto += "]";

        if(i < mapa.length - 1){
            texto += ",\n";
        }
    }

    return texto;
}

function descargarMapaTXT(ciudad){
    if(!ciudad || !ciudad.mapa || !ciudad.mapa.matriz){
        alert("No se pudo exportar el mapa. Datos de la ciudad incompletos.");
        return;
    }

    const mapa = ciudad.mapa.matriz; 
    const contenido = convertirMapaATexto(mapa);

    const blob = new Blob([contenido], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mapa_ciudad.txt";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}