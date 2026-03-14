const tipoComercio = {
    Tienda: "Tienda",
    CentroComercial: "Centro comercial"
}
class Edificio_Comercial extends Edificio{
    static contadorTienda = 1;
    static contadorCentroComercial = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y, ingresos, empleos){
        super(nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this.ingresos = ingresos;
        this.empleos = empleos;

    }

   static crearTienda(nombreComercio,x,y,codigoMapa){
        const nombreFinal = nombreComercio && nombreComercio.trim()
            ? nombreComercio.trim()
            : `Tienda ${Edificio_Comercial.contadorTienda++}`;

        const tienda = new Edificio_Comercial(nombreFinal, tipoComercio.Tienda, 2000, 0, 8,x,y, 500, 6);
        tienda.setCodigoMapa(codigoMapa);
        return tienda;
    }

   static crearCentroComercial(nombreComercio,x,y,codigoMapa){
        const nombreFinal = nombreComercio && nombreComercio.trim()
            ? nombreComercio.trim()
            : `Centro comercial ${Edificio_Comercial.contadorCentroComercial++}`;

        const CentroComercial = new Edificio_Comercial(nombreFinal, tipoComercio.CentroComercial, 8000, 0, 25,x,y, 2000, 20);
        CentroComercial.setCodigoMapa(codigoMapa);
        return CentroComercial;
    }

     // GETTERS

    getIngresos(){
        return this.ingresos;
    }

    getEmpleos(){
        return this.empleos;
    }

    // SETTERS

    setIngresos(ingresos){
        this.ingresos = ingresos;
    }

    setEmpleos(empleos){
        this.empleos = empleos;
    }
}