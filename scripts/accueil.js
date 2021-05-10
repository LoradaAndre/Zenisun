let valEclairage1;
let valEclairage2;

let valueMotor1;
let valueMotor2;

let monitoring_user_config;
let elevation_sol;

let capteurPluie;

let hwcfg;

function getElementCarte(data, value){
    return $(data).find(value).text();
}

$(document).ready(function (){

    $(".canvas-mot").hide();
    $(".canvas-light").hide();
    $(".eclairage").hide();
    $(".icon_lamp").hide();
    $(".lames").hide();

    setInterval(function(){ 
        sync_date();
        lectureCarte();
        if(valueMotor1 != undefined){
            let canvasLames1 = document.querySelector(".L1-canvas"); 
            refreshCanvas(valueMotor1, canvasLames1)
        }
        if(valueMotor2 != undefined){
            let canvasLames2 = document.querySelector(".L2-canvas");
            refreshCanvas(valueMotor2, canvasLames2)
        }
        if(valEclairage1 != undefined){
            let canvasEclairage1 = document.querySelector(".E1-canvas");
            refreshCanvas(valEclairage1, canvasEclairage1)
        }
        if(valEclairage2 != undefined){
            let canvasEclairage2 = document.querySelector(".E2-canvas");
            refreshCanvas(valEclairage2, canvasEclairage2)
        }
        meteo(monitoring_user_config, elevation_sol)
    }, 1000);
});

//Lecture des données de la carte électronque
function lectureCarte(){
    $.ajax({
        url: "cgi/zns.cgi?cmd=d&p=ios",
        context: document.body
      }).done(function(data) {
          console.log("==========test============")

          isConnected(true, data)
        //   monitoring_user_config = parseInt(data.all[30].textContent);
        //   monitoring_user_config = getXMLValue(data, 'user')
        monitoring_user_config = parseInt(getElementCarte(data, "user"));
          console.log(monitoring_user_config)

        //   elevation_sol = getXMLValue( data, 's_elev');
        elevation_sol = parseInt(getElementCarte(data, "s_elev"));
          console.log(elevation_sol)
          afficheElevSol(elevation_sol)



        //   valueMotor1 = parseInt(getMotorValue(data, 24));
        valueMotor1 = getMotorValue(getElementCarte(data, "Mot0"));
        //   valueMotor2 = parseInt(getMotorValue(data, 25));
        valueMotor2 = getMotorValue(getElementCarte(data, "Mot1"));

          //BB1
        //   valEclairage1 = parseInt(getIntensite(data, 14)); //14: <GPO 6>
        valEclairage1 = getIntensite(getElementCarte(data, "gpo6")); 
          //BB2
        //   valEclairage2 = parseInt(getIntensite(data, 15)); //15: <GPO 7>
        valEclairage2 = getIntensite(getElementCarte(data, "gpo7")) 

        //   capteurPluie = parseInt(data.all[6].textContent)
        capteurPluie = parseInt(getElementCarte(data, "gpi4"))

      }).fail(function() {
         isConnected(false, data)
    });	

    $.ajax({
        url: 'cgi/zns.cgi?cmd=c',
        context: document.body
      }).done(function(data){
          //Config utilisateur
            // let hwcfg = parseInt(data.all[17].textContent);
            let hwcfg = parseInt(getElementCarte(data, "hwcfg"))
            affichageCircle(hwcfg)
      }).fail(function() { 
    });
}

function getMotorValue(valMotor){
    // let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
    return parseInt(newVal[0]*100/newVal[1])
}

//Récupère et converti l'intensité (0 à 255) en pourcentage
function getIntensite(ledIntensite){
    // let ledIntensite = data.all[input].textContent
    let newVal = ledIntensite.split(";")
    return parseInt(newVal[0]*100/255);
}

//Met à jour les circles des widgets selons les données de la carte
function refreshCanvas(val, canvasType){
    circle(val, canvasType);
}

//Affichage de l'élévation solaire
function afficheElevSol(elev){
    $(".elev_sol p").text(elev + "°");
}

//Vérification de connexion
function isConnected(value, data){
    if((value == false) || (data == null)){
      $(".connexion p").text("déconnecté");
      $(".connexion_icon").attr("src","resources/icons/leds/disconnected.png");
    }else{
      $(".connexion p").text("connecté");
      $(".connexion_icon").attr("src","resources/icons/leds/connected.png")
  
    }
}

//Gestion du widget météo selon les paramètres enregistrés
function meteo(number_config, elevation_sol){
    //Blocage vent / neige (même numéro)
    if(number_config&8){
        //Blogage vent
        if(valueMotor1 == 0){
            $(".meteo_widget").css({
                "background-image": "url(resources/background/widget_meteo/vent.jpg)",
                "background-size": "cover"
            });
            $(".meteo .type_temps img").attr("src","resources/icons/widgets_light/vent.png")
            $(".meteo .type_temps p").text("Vent")
        }
        //Blocage neige
        else{
            console.log("on est en mode blocage neige")
            $(".meteo_widget").css({
                "background-image": "url(resources/background/widget_meteo/neige.jpg)",
                "background-size": "cover"
            });
            $(".meteo .type_temps img").attr("src","resources/icons/widgets_light/neige.png")
            $(".meteo .type_temps p").text("Neige")
        }
    }
    //Mode pluie =============> à modif 
    else if(capteurPluie < 6000){
        $(".meteo_widget").css({
            "background-image": "url(resources/background/widget_meteo/pluie.jpg)",
            "background-size": "cover"
        });
        $(".meteo .type_temps img").attr("src","resources/icons/widgets_light/pluie.png")
        $(".meteo .type_temps p").text("Pluie")

    }
    //Mode été
    else if(number_config&2){
        $(".meteo_widget").css({
            "background-image": "url(resources/background/widget_meteo/ete.jpg)",
            "background-size": "cover"
        });
        $(".meteo .type_temps img").attr("src","resources/icons/widgets_light/summer.png")
        $(".meteo .type_temps p").text("Mode été")
    }
    //Mode hiver
    else if(number_config&4){
        $(".meteo_widget").css({
            "background-image": "url(resources/background/widget_meteo/hiver.jpg)",
            "background-size": "cover"
        });
        $(".meteo .type_temps img").attr("src","resources/icons/widgets_light/winter.png")
        $(".meteo .type_temps p").text("Mode hiver")
    }
    //Mode nuit
    else if(elevation_sol == 0){
        console.log("il fait nuit");
        $(".meteo_widget").css({
            "background-image": "url(resources/background/widget_meteo/nuit.jpg)",
            "background-size": "cover"
        });
        $(".meteo .type_temps img").attr("src","resources/icons/widgets_light/nuit.png")
        $(".meteo .type_temps p").text("Nuit")
    }
    //Aube - crépuscule
    else if(elevation_sol > 0 && elevation_sol <= 15){
        console.log("c'est l'aube");
        $(".meteo_widget").css({
            "background-image": "url(resources/background/widget_meteo/aube.jpg)",
            "background-size": "cover"
        });
        $(".meteo .type_temps img").attr("src","resources/icons/widgets_light/demisoleil.png")
        $(".meteo .type_temps p").text("Elévation solaire basse")
    }
    //Aucun paramètres de défini
    else{
        console.log("on est en journée, il fait beau");
        $(".meteo_widget").css({
            "background-image": "url(resources/background/widget_meteo/beau.jpg)",
            "background-size": "cover"
        });
        $(".meteo .type_temps img").attr("src","resources/icons/widgets_light/normal.png")
        $(".meteo .type_temps p").text("Temps clair")
    }
}

//Synchronisation de la date de l'automate à celle de Date (Js)
function sync_date(){
	let now_date = new Date();
	let date_sec =  now_date.getTime();
	date_sec /= 1000;	// to seconds for use in pergola
	// set user setttings : zns.cgi?cmd=u&p=<n>&v=<value>
	var command = 'cgi/zns.cgi?cmd=u&p=0&v=' + date_sec;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(){
	}).fail(function() {
	});
}

//Affichages des circles selon la config utilisateur
function affichageCircle(hwcfg){
    console.log(hwcfg)
    let lengthLames = 0;
    let lengthLight = 0;

    if(hwcfg&1){ //Mot1
        $(".canvas-mot1").show();
        $(".lames").show();
    }
    if(hwcfg&2){ //Mot2
        $(".canvas-mot2").show();
        $(".lames").show();
    }
    if(hwcfg&16){ //RGB1
        $(".eclairage").show();
        $(".all_canvas_eclairage").hide();
        $(".icon_lamp").show()
    }
    if(hwcfg&32){ //RGB2
        $(".eclairage").show();
        $(".all_canvas_eclairage").hide();
        $(".icon_lamp").show()
    }
    if(hwcfg&4){ //BB1
        $(".eclairage").show();
        $(".all_canvas_eclairage").show();
        $(".canvas-light1").show();
        $(".icon_lamp").hide()
    }
    if(hwcfg&8){ //BB2
        $(".eclairage").show();
        $(".canvas-light2").show();
    }
}