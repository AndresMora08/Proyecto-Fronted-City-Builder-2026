const tipoIndustrial = {
    Fabrica: "Fabrica",
    Granja: "Granja"
}

class Edificio_Industrial extends Edificio{

    static contadorFabrica = 1;
    static contadorGranja = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y ,produccion, ciudadanosEmpleados,capacidadMaxima){
        super(nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this._produccion = produccion;
        this._ciudadanosEmpleados = ciudadanosEmpleados;
        this._capacidadMaxima = capacidadMaxima;
    }

    static crearFabrica(nombreIndustria,x,y,codigoMapa){
        const nombreFinal = nombreIndustria && nombreIndustria.trim()
            ? nombreIndustria.trim()
            : `Fabrica ${Edificio_Industrial.contadorFabrica++}`;
        const lista=[];
        const fabrica = new Edificio_Industrial(nombreFinal, tipoIndustrial.Fabrica, 5000, 15, 20,x,y, 800, lista,15);
        fabrica.setCodigoMapa(codigoMapa);
        return fabrica;
    }

    static crearGranja(nombreIndustria,x,y,codigoMapa){
        const nombreFinal = nombreIndustria && nombreIndustria.trim()
            ? nombreIndustria.trim()
            : `Granja ${Edificio_Industrial.contadorGranja++}`;
        const lista=[];
        const granja = new Edificio_Industrial(nombreFinal, tipoIndustrial.Granja, 3000, 10, 0,x,y, 50, lista,8);
        granja.setCodigoMapa(codigoMapa);
        return granja;
    }
    agregarEmpleado(ciudadano){

      if(this._ciudadanosEmpleados.length >= this._capacidadMaxima){
        return false;
        }

        this._ciudadanosEmpleados.push(ciudadano);

         ciudadano._empleo = this;

          return true;
    }

    getProduccion(){
        return this._produccion;
    }

    setProduccion(valor){
        this._produccion = valor;
    }

    getEmpleos(){
        return this._empleos;
    }

    setEmpleos(valor){
        this._empleos = valor;
    }
}
