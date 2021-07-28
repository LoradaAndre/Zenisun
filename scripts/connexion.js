$(document).ready(function(){

    $(".saisieIPAutomate").val(localStorage.getItem("IP"));

    $(".buttonValiderIP").click(function(){

        let IPAdress = $(".saisieIPAutomate").val();
        let regexIP = /^(([1-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([1-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/
    
        if(!regexIP.exec(IPAdress)){
            alert("Votre adresse IP n'est pas valable");
        }
        else{
            console.log(IPAdress + " -> est ok");
            localStorage.setItem("IP", $(".saisieIPAutomate").val());  
        }
    
    });

  
    
  
  

    
            
  
});



