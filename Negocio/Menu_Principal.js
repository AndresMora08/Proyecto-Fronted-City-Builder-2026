document.addEventListener("DOMContentLoaded", function() {
    
    let botonNC= document.getElementById("BotonNC");
    let botonCJ=document.getElementById("BotonCJ");
    botonNC.addEventListener("click",function(){
        
        window.location.href="Crear_Ciudad.html";
    });

    botonCJ.addEventListener("click",function(){

        window.location.href="Juego.html";
    });

});