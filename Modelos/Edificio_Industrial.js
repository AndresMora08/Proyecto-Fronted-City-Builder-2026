const tipoIndustrial = {
    Fabrica: "Fabrica",
    Granja: "Granja"
}

class Edificio_Industrial extends Edificio{

    static contadorFabrica = 1;
    static contadorGranja = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y ,produccion, ciudadanosEmpleados,capacidadMaxima){
        super(nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this.produccion = produccion;
        this.ciudadanosEmpleados = ciudadanosEmpleados;
        this.capacidadMaxima = capacidadMaxima;
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

      if(this.ciudadanosEmpleados.length >= this.capacidadMaxima){
        return false;
        }

        this.ciudadanosEmpleados.push(ciudadano);

         ciudadano.empleo = this;

          return true;
    }

    getProduccion(){
        return this.produccion;
    }

    setProduccion(valor){
        this.produccion = valor;
    }

    getEmpleos(){
        return this.ciudadanosEmpleados;
    }

    setEmpleos(valor){
        this.ciudadanosEmpleados = valor;
    }
}
