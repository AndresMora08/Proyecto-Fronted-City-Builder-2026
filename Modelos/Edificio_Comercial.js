const tipoComercio = {
    Tienda: "Tienda",
    CentroComercial: "Centro comercial"
}
class Edificio_Comercial extends Edificio{
    static contadorTienda = 1;
    static contadorCentroComercial = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y, ingresos, ciudadanosEmpleados,capacidadMaxima){
        super(nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this._ingresos = ingresos;
        this._ciudadanosEmpleados = ciudadanosEmpleados;
        this._capacidadMaxima = capacidadMaxima;
        

    }

   static crearTienda(nombreComercio,x,y,codigoMapa){
        const nombreFinal = nombreComercio && nombreComercio.trim()
            ? nombreComercio.trim()
            : `Tienda ${Edificio_Comercial.contadorTienda++}`;
        const lista=[];
        const tienda = new Edificio_Comercial(nombreFinal, tipoComercio.Tienda, 2000, 0, 8,x,y, 500, lista,6);
        tienda.setCodigoMapa(codigoMapa);
        return tienda;
    }

   static crearCentroComercial(nombreComercio,x,y,codigoMapa){
        const nombreFinal = nombreComercio && nombreComercio.trim()
            ? nombreComercio.trim()
            : `Centro comercial ${Edificio_Comercial.contadorCentroComercial++}`;
        const lista=[]
        const CentroComercial = new Edificio_Comercial(nombreFinal, tipoComercio.CentroComercial, 8000, 0, 25,x,y, 2000, lista,20);
        CentroComercial.setCodigoMapa(codigoMapa);
        return CentroComercial;
    }
    agregarEmpleado(ciudadano){

         if(this._ciudadanosEmpleados.length >= this._capacidadMaxima){
        return false;
         }

         this._ciudadanosEmpleados.push(ciudadano);

            ciudadano._empleo = this;

            return true;
        }
     // GETTERS

    getIngresos(){
        return this._ingresos;
    }

    getEmpleos(){
        return this._empleos;
    }

    // SETTERS

    setIngresos(ingresos){
        this._ingresos = ingresos;
    }

    setEmpleos(empleos){
        this._empleos = empleos;
    }
}
