$(document).ready(function(){

    $(".linkStopHelp").hide();
    $(".textHelp").hide();

    $(".saisieIPAutomate").val(localStorage.getItem("IP"));

    $(".buttonValiderIP").click(function(){

        let IPAdress = $(".saisieIPAutomate").val();
        let regexIP = /^(([1-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([1-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/
    
        if(!regexIP.exec(IPAdress)){
            alert("Votre adresse IP n'est pas valable");
        }
        else{
            localStorage.setItem("IP", $(".saisieIPAutomate").val());  
            alert("La nouvelle IP est désormais " + localStorage.getItem("IP"));
        }
    
    });

    $(".linkHelp").click(function(){
        $(".linkStopHelp").show();
        $(".textHelp").show();
    });

    $(".linkStopHelp").click(function(){
        $(this).hide();
        $(".textHelp").hide();
    });
    
  
  

    
            
  
});



