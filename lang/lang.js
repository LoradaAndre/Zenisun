let resultatJson;
let number_config;
// let valueMotor1;
// let capteurPluie;
let elevation_sol;

let page;
let langueSauvegarde;

console.log(langueSauvegarde)
console.log(localStorage.getItem("langue") == null)

let date = new Date()
let getHours = date.getHours();

let IPAdress;

// defaultConnexion();

// function defaultConnexion(){
//     page = location.href;
//     page = page.split("/");
//     page = page[page.length-1];
    
//     if(page != "guide_utilisation.html"){
//         $(".connexion p").text(resultatJson["general"]["connexionOff"]);
//     }
// }

// langRequest();


setInterval(function(){

    page = location.href;
    page = page.split("/");
    page = page[page.length-1];

    if(localStorage.getItem("langue") == null || localStorage.getItem("langue") == "undefined"){
        localStorage.setItem("langue", "fr");  
        langueSauvegarde = localStorage.getItem("langue");
        console.log(langueSauvegarde)
        chargerLangue(langueSauvegarde);
    
    }else{
        langueSauvegarde = localStorage.getItem("langue");
        console.log(langueSauvegarde)
        chargerLangue(langueSauvegarde);
    
    }

    IPAdress = localStorage.getItem("IP");

    $.ajax({
        url: "http://"+ IPAdress +"/zns.cgi?cmd=d&p=ios",
        context: document.body
      }).done(function(data) {

        isConnected(true, data)
        number_config = parseInt(getElementCarte(data, "user"));
        // valueMotor1 = getMotorValue(getElementCarte(data, "Mot0"));
        capteurPluie = parseInt(getElementCarte(data, "gpi4"));
        elevation_sol = parseInt(getElementCarte(data, "s_elev"));

    })
      .fail(function() {
        $(".connexion p").text(resultatJson["general"]["connexionOff"]);
        if(page == "index.htm"){
            $(".connexion_icon").attr("src","resources/icons/leds/disconnected.png")
            $(".alertCo").show()
        }else{
            $(".connexion_icon").attr("src","../resources/icons/leds/disconnected.png")
            if(page == "connexion.html"){
                $(".alertCo").show()
            }
        }
        //  isConnected(false, data
    });	

},1500);

function chargerLangue(lang){

        if(page == "index.htm"){
            $.getJSON("lang/" + lang + "_lang.json", function(res){
                resultatJson = res
                console.log("==== la if====")
                console.log(resultatJson)
            })
            .fail(function(){
                $(".connexion p").text(resultatJson["general"]["connexionOff"]);
                $(".connexion_icon").attr("src","resources/icons/leds/disconnected.png")
                $(".alertCo").show()
            });
        }else{
            $.getJSON("../lang/" + lang + "_lang.json", function(res){
                resultatJson = res;
                console.log("====la else====")
                console.log(resultatJson)
            })
            .fail(function(){
                $(".connexion p").text(resultatJson["general"]["connexionOff"]);
                $(".connexion_icon").attr("src","../resources/icons/leds/disconnected.png")
                $(".alertCo").show()
            });
        }
    
        console.log(page)

        if(page != "index.htm"){
            applicationGeneral(resultatJson["general"]);
        }
    
        if(page == "index.htm"){
            console.log(resultatJson["pageAccueil"])
            applicationAccueil(resultatJson["pageAccueil"]);
        }else if(page == "eclairage.html"){
            applicationEclairage(resultatJson["pageEclairage"]);
        }else if(page == "lames_orientabes.html"){
            applicationLames(resultatJson["pageLames"]);
        }else if(page == "config_wifi.html"){
            applicationWifi(resultatJson["pageWifi"]);
        }else if(page == "guide_utilisation.html"){
            $("#textInstructionAside").text(applicationGeneral(resultatJson["pageGuide"]["insctruction"]));
            applicationGuide(resultatJson["pageGuide"]);
        }else if(page == "parametres.html"){
            applicationParamètre(resultatJson["pageParametre"]);
        }
}

// function updateTextMeteo(userConfig){
    
// }

//Vérification de connexion
function isConnected(value, data){

    if(value == false){
        if(page == "index.htm"){
            $(".connexion p").text(resultatJson["general"]["connexionOff"]);
            $(".connexion_icon").attr("src","resources/icons/leds/disconnected.png")
            $(".alertCo").show()
        }else{
            $(".connexion p").text(resultatJson["general"]["connexionOff"]);
            $(".connexion_icon").attr("src","../resources/icons/leds/disconnected.png")
            if(page == "connexion.html"){
                $(".alertCo").show()
            }
        }
    }else{
        if(page == "index.htm"){
            $(".connexion p").text(resultatJson["general"]["connexionOn"]);
            $(".connexion_icon").attr("src","resources/icons/leds/connected.png")
            $(".alertCo").hide()
        }else{
            $(".connexion p").text(resultatJson["general"]["connexionOn"]);
            $(".connexion_icon").attr("src","../resources/icons/leds/connected.png")
            if(page == "connexion.html"){
                $(".alertCo").hide()
            }
        }
    }

    // if(page == "index.htm" && (value == false)){
    //         $(".connexion p").text(resultatJson["general"]["connexionOff"]);
    //         $(".connexion_icon").attr("src","resources/icons/leds/disconnected.png");
    //     //   }else{
    //     //     $(".connexion p").text(resultatJson["general"]["connexionOn"]);
    //     //     $(".connexion_icon").attr("src","resources/icons/leds/connected.png")
    //     //   }
    // }else if(page != "index.htm" && (value == false)){
    //     $(".connexion p").text(resultatJson["general"]["connexionOn"]);
    //     $(".connexion_icon").attr("src","../resources/icons/leds/connected.png")
    // }else{
    //     if((value == false) || (data == null)  || (data == "undefined")){
    //         $(".connexion p").text(resultatJson["general"]["connexionOff"]);
    //         $(".connexion_icon").attr("src","../resources/icons/leds/disconnected.png");
    //       }else{
    //         $(".connexion p").text(resultatJson["general"]["connexionOn"]);
    //         $(".connexion_icon").attr("src","../resources/icons/leds/connected.png")
    // }
 
}

function applicationGeneral(res){
    $("#navEclairage").text(res["navigation"]["eclairageTitle"]);
    $("#navLames").text(res["navigation"]["lamesTitle"]);
    $("#navWifi").text(res["navigation"]["ConfigWifiTitle"]);
    $("#navGuide").text(res["navigation"]["GuideTitle"]);
    $("#navParametres").text(res["navigation"]["ParaTitle"]);
}
function applicationAccueil(res){
    //========================== WIDGETS ======================== 
    $("#titreWidgetEclairage").text(res["widgets"]["eclairageTitle"]);
    $("#titreWidgetLames").text(res["widgets"]["lamesTitle"]);
    $("#titreWidgetWifi").text(res["widgets"]["ConfigWifiTitle"]);
    $("#titreWidgetGuide").text(res["widgets"]["GuideTitle"]);
    $("#titreWidgetParametres").text(res["widgets"]["ParaTitle"]);
    $("#titreWidgetConnexion").text(res["widgets"]["ConnexionTitle"]);

    //==================== POPUP INFOS CONTACTS =================== 
    $("#exampleModalLabel").text(res["popupContact"]["titre"]);
    $("#mailContact").text(res["popupContact"]["mail"]);
    $("#telContact").text(res["popupContact"]["tel"]);
    $("#webContact").text(res["popupContact"]["web"]);
    $("#adresseContact").text(res["popupContact"]["adress"]);
    $("#versionContact").text(res["popupContact"]["version"]);

    //==================== TEXTE METEO ============================

     //Blocage vent / neige (même numéro)
     if(number_config&8){
        //Blogage vent
        if(valueMotor1 == 0){
            $(".meteo .type_temps p").text(res["meteo"]["vent"])
        }
        //Blocage neige
        else{
            $(".meteo .type_temps p").text(res["meteo"]["neige"])
        }
    }
    //Mode pluie 
    else if(capteurPluie < 6000){
        $(".meteo .type_temps p").text(res["meteo"]["pluie"])

    }
    //Mode été
    else if(number_config&2){
        //Mode hiver
        if(number_config&4){ 
            $(".meteo .type_temps p").text(res["meteo"]["modeHiver"])
        }else{
            $(".meteo .type_temps p").text(res["meteo"]["modeEte"])
        }
    }
    //Mode nuit
    else if(elevation_sol <= 0){
        $(".meteo .type_temps p").text(res["meteo"]["nuit"])
    }
    //Aube - crépuscule
    else if(elevation_sol > 0 && elevation_sol <= 15){
        if(getHours < 12){
            $(".meteo .type_temps p").text(res["meteo"]["leveeSoleil"])
        
        }else{
            $(".meteo .type_temps p").text(res["meteo"]["coucherSoleil"])
        }
    }
    //Aucun paramètres de défini
    else{
        $(".meteo .type_temps p").text(res["meteo"]["defaultMeteo"])
    }

    //==================== TEXTE DATE ============================

    let a = "" + date.getDay() + "";
    let b = "" + date.getMonth() + "";
    console.log(a)
    console.log(typeof a)
    console.log(b)
    console.log(typeof b)
    $(".time .jour").html(res["dateMeteo"]["joursLettres"][a] + " " + date.getDate() + " " + res["dateMeteo"]["moisLettres"][b]);
    
}
function applicationEclairage(res){
    //==================== TITRE BANDEAUX =================== 
    $("#titreBB1").text(res["BB1"]);
    $("#titreBB2").text(res["BB2"]);
    $("#titreRGB1").text(res["RGB1"]);
    $("#titreRGB2").text(res["RGB2"]);

    //==================== ALL LIGHTS ===================
    $("#allumageAll").text(res["allLumieres"]);
    
    //==================== COLORISATION ===================
    $("#titreColorisation").text(res["colorisationWidget"]["titre"]);
    $("#R1").text(res["colorisationWidget"]["réglageRVB"]);
    $("#R2").text(res["colorisationWidget"]["roueChroma"]);
    $("#textColoRed").text(res["colorisationWidget"]["R"]);
    $("#textColoGreen").text(res["colorisationWidget"]["G"]);
    $("#textColoBlue").text(res["colorisationWidget"]["B"]);
    

    //==================== LUMIERES D'AMBIANCE ===================
    $("#amb1").text(res["ambiance"]["calme"]);
    $("#amb2").text(res["ambiance"]["confort"]);
    $("#amb3").text(res["ambiance"]["sérénité"]);
    $("#amb4").text(res["ambiance"]["detente"]);
    $("#amb5").text(res["ambiance"]["cocktail"]);
    $("#amb6").text(res["ambiance"]["concentration"]);
    $("#amb7").text(res["ambiance"]["eveillé"]);
    $("#amb8").text(res["ambiance"]["inspiration"]);
    $("#amb9").text(res["ambiance"]["motivation"]);

    //==================== MEMORISATION CONFIG ===================
    $("#textMemoConfigEclairage").text(res["mémoriserConfig"]);
    
}
function applicationLames(res){
    //==================== TITRE MOTEURS =================== 
    $("#titreM1").text(res["M1"]);
    $("#titreM2").text(res["M2"]);

    //==================== SAISONNIER =================== 
    $("#textSaisonnier").text(res["saisonnier"]["modeSaisonnier"]);
    $("#textSaisonnierManuel").text(res["saisonnier"]["manuel"]);
    $("#textSaisonnierEte").text(res["saisonnier"]["ete"]);
    $("#textSaisonnierHiver").text(res["saisonnier"]["hiver"]);

    //==================== SYNC LAMES ===================
    $("#titreSync").text(res["sync"]); 
}

function applicationWifi(res){
    $("#textDetectionWifi").text(res["detectionWifi"]);
    $("#exampleModalLabel").text(res["modal"]["connexionWifiTitle"]);
    $("#inputPasswordText").text(res["modal"]["selectionMdp"]);   
    $("#connexionText").text(res["modal"]["connexion"]); 
    $("#annulerText").text(res["modal"]["annuler"]);   



}

function applicationGuide(res){
    //==================== CAS D'INTEMPERIES ===================
    $("#titreIntemp").text(res["casIntemperie"]["title"]);
    $("#sousTitreIntemp1").text(res["casIntemperie"]["subtitle1"]);
    $("#textIntemp1").text(res["casIntemperie"]["para1"]);
    $("#sousTitreIntemp2").text(res["casIntemperie"]["subtitle2"]);
    $("#textIntemp2").text(res["casIntemperie"]["para2"]);

    //==================== ENTRETIEN PERGOLA ===================
    $("#titreEntretien").text(res["entretienPergola"]["title"]);
    $("#textEntretien1").text(res["entretienPergola"]["para1"]);
    $("#textEntretien2").text(res["entretienPergola"]["para2"]);
    $("#textEntretien3").text(res["entretienPergola"]["para3"]);
    $("#textEntretien4").text(res["entretienPergola"]["para4"]);
    $("#textEntretien5").text(res["entretienPergola"]["para5"]);
    $("#textEntretien6").text(res["entretienPergola"]["para6"]);

    //==================== MANIP ELEVATION SOLAIRE ===================
    $("#titreElevSol").text(res["manipElevationSolaire"]["title"]);
    $("#sousTitreElevSol1").text(res["manipElevationSolaire"]["subtitle1"]);
    $("#textElevSol1").text(res["manipElevationSolaire"]["para1"]);
    $("#textElevSol2").text(res["manipElevationSolaire"]["para2"]);
    $("#sousTitreElevSol2").text(res["manipElevationSolaire"]["subtitle2"]);
    $("#textElevSol3").text(res["manipElevationSolaire"]["para3"]);

    //==================== INSTRUCTIONS ===================
    $("#amb9").text(res["insctruction"]);
}

function applicationParamètre(res){
    //==================== GENERAUX ===================
    $("#titreWidgetPara").text(res["blocGeneraux"]["title"]);

    $("#titreDate").text(res["blocGeneraux"]["date"]);
    $("#titreHeure").text(res["blocGeneraux"]["heure"]);
    $("#titreLangue").text(res["blocGeneraux"]["langue"]);

    $("#titreHoming").text(res["blocGeneraux"]["homing"]);
    $("#textHoming").text(res["blocGeneraux"]["boutonHoming"]);

    $("#titreGeolocalisation").text(res["blocGeneraux"]["geolocalisation"]);
    $("#textPositionnement").text(res["blocGeneraux"]["positionnement"]);
    $("#textEnregistrer").text(res["blocGeneraux"]["boutonEnregistrer"]);

    $("#textLattitude").text(res["blocGeneraux"]["lat"]);
    $("#textLongitude").text(res["blocGeneraux"]["lon"]);
    $("#O2_1").text(res["blocGeneraux"]["n"]);
    $("#O2_2").text(res["blocGeneraux"]["s"]);
    $("#O1_1").text(res["blocGeneraux"]["e"]);
    $("#O1_2").text(res["blocGeneraux"]["o"]);

    //Affichage de la position 
	document.querySelector(".geo_final .affichage_geo").textContent = res["blocGeneraux"]["positionnement"] + neLat + lat + ", " + neLong + long ;

    $("#titreOrientation").text(res["blocGeneraux"]["orientation"]);
    $("#N").text(res["blocGeneraux"]["n"]);
    $("#NNE").text(res["blocGeneraux"]["nne"]);
    $("#NE").text(res["blocGeneraux"]["ne"]);
    $("#ENE").text(res["blocGeneraux"]["ene"]);
    $("#E").text(res["blocGeneraux"]["e"]);
    $("#ESE").text(res["blocGeneraux"]["ese"]);
    $("#SE").text(res["blocGeneraux"]["se"]);
    $("#SSE").text(res["blocGeneraux"]["sse"]);
    $("#S").text(res["blocGeneraux"]["s"]);
    $("#SSO").text(res["blocGeneraux"]["sso"]);
    $("#SO").text(res["blocGeneraux"]["so"]);
    $("#OSO").text(res["blocGeneraux"]["oso"]);
    $("#O").text(res["blocGeneraux"]["o"]);
    $("#ONO").text(res["blocGeneraux"]["ono"]);
    $("#NO").text(res["blocGeneraux"]["no"]);
    $("#NNO").text(res["blocGeneraux"]["nno"]);

    //==================== ECLAIRAGE ===================
    $("#titreWidgetEclairage").text(res["blocEclairage"]["title"]);

    $("#textAllumAuto").text(res["blocEclairage"]["allAuto"]);
    $("#heureDebut").text(res["blocEclairage"]["heureDemarage"]);
    $("#heureFin").text(res["blocEclairage"]["heureExtinction"]);
    if(getHourAllumage){
        $(".btn-h-allumage-modifier h3").text(res["blocEclairage"]["modifier"]); 
    }
    if(getHourExtinction){
        $(".btn-h-extinction-modifier h3").text(res["blocEclairage"]["modifier"]); 
    }
    
    $(".btn-h-extinction h3").text(res["blocEclairage"]["appliquer"]);
    $(".btn-h-allumage h3").text(res["blocEclairage"]["appliquer"]);

    $("#titreVitesseLed").text(res["blocEclairage"]["vitesseLed"]);
    $("#L1").text(res["blocEclairage"]["instant"]);
    $("#L2").text(res["blocEclairage"]["seconde1"]);
    $("#L3").text(res["blocEclairage"]["seconde2"]);
    $("#L4").text(res["blocEclairage"]["seconde4"]);

    //En cas de clic sur le bouton Modifier/Annuler => heure allumage
$(".btn-h-allumage-modifier").click(function(){
	//Si c'est modifier
	if($(this).children().text() == res["blocEclairage"]["modifier"]){
		getHourAllumage = false;
		$(".btn-h-allumage").show();
		$(".btn-h-allumage-modifier h3").text(res["blocEclairage"]["annuler"])
		$(".affichage_heure_allumage").hide();
		$(".h_allumage input").show()
	//Si c'est annuler
	}else if($(this).children().text() == res["blocEclairage"]["annuler"]){
		getHourAllumage = true;
		$(".btn-h-allumage").hide();
		$(".btn-h-allumage-modifier h3").text(res["blocEclairage"]["modifier"])
		$(".affichage_heure_allumage").show();
		$(".h_allumage input").hide()
	}
	
})

    //En cas de clic sur le bouton Modifier/Annuler => heure extinction
    $(".btn-h-extinction-modifier").click(function(){
        //Si c'est modifier
        if($(this).children().text() == res["blocEclairage"]["modifier"]){
            getHourExtinction = false;
            $(".btn-h-extinction").show();
            $(".btn-h-extinction-modifier h3").text(res["blocEclairage"]["annuler"])
            $(".affichage_heure_extinction").hide();
            $(".h_extinction input").show()

        //Si c'est annuler
        }else if($(this).children().text() == res["blocEclairage"]["annuler"]){
            getHourExtinction = true;
            $(".btn-h-extinction").hide();
            $(".btn-h-extinction-modifier h3").text(res["blocEclairage"]["modifier"])
            $(".affichage_heure_extinction").show();
            $(".h_extinction input").hide()
        }
    })

    //==================== ENVIRONNEMENT ===================
    $("#titreWidgetEnvironnement").text(res["blocEnvironnement"]["title"]);

    $("#titreFermPluie").text(res["blocEnvironnement"]["fermeturePluie"]);

    $("#titreIntemperie").text(res["blocEnvironnement"]["intemperies"]);
    $("#I1").text(res["blocEnvironnement"]["desactive"]);
    $("#I2").text(res["blocEnvironnement"]["blocageVent"]);
    $("#I3").text(res["blocEnvironnement"]["blocageNeige"]);

    $("#titreSaisonnier").text(res["blocEnvironnement"]["modeSaisonnier"]);
    $("#S1").text(res["blocEnvironnement"]["manuel"]);
    $("#S2").text(res["blocEnvironnement"]["ete"]);
    $("#S3").text(res["blocEnvironnement"]["hiver"]);

    $("#titreSuiviSolaire").text(res["blocEnvironnement"]["suiviSol"]);
    $("#B1").text(res["blocEnvironnement"]["min1"]);
    $("#B2").text(res["blocEnvironnement"]["min5"]);
    $("#B3").text(res["blocEnvironnement"]["min15"]);
    $("#B4").text(res["blocEnvironnement"]["min30"]);
    $("#B5").text(res["blocEnvironnement"]["min60"]);
    
    $("#titreFermetureNuit").text(res["blocEnvironnement"]["fermetureNuit"]); //

    //==================== APPARENCE ===================
    $("#titreWidgetApparence").text(res["blocApparence"]["title"]);
    $("#titreTheme").text(res["blocApparence"]["themeSombre"]);

    //==================== MAINTENANCE ===================
    $("#titreWidgetMaintenance").text(res["blocMaintenance"]["title"]);
    $("#textDebug").text(res["blocMaintenance"]["debug"]);
    $("#textRegFab").text(res["blocMaintenance"]["reglageFab"]);

    //==================== MAJ ===================
    $("#titreWidgetMAJ").text(res["blocMaj"]["title"]);
    $("#textInstaller").text(res["blocMaj"]["installer"]);

    // =============================== FIRMWARE ===============================

$(".install-button").click(function(){
	usr_firmware_upload(res);
})
    
}

function getXMLHttpRequest() 
{
var xhr = null;
	if (window.XMLHttpRequest || window.ActiveXObject) 
	{
		if (window.ActiveXObject) 
		{
			try 
			{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) 
			{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} 
		else 
		{
			xhr = new XMLHttpRequest(); 
		}
	} 
	else 
	{
		alert("ERROR : XMLHttpRequestunavailable!");
		return null;
	}
	return xhr;
}

function usr_firmware_upload(res) 
{
	var fd = new FormData();
	fd.append("i", document.getElementById('firmware_file').files[0]);
	var xhr = new getXMLHttpRequest();
	xhr.upload.addEventListener("progress", firmware_uploadProgress, false);
	xhr.addEventListener("load", firmware_uploadComplete_usr, false);
	xhr.addEventListener("error", firmware_uploadFailed, false);
	xhr.addEventListener("abort", firmware_uploadCanceled, false);
//	xhr.open('POST', '/upload');
	xhr.open('POST', '../firmware');
	$(".upload_information").html('<h2 id="progress_num">' + res["firmware"]["attenteFirmware"] + '</h2>');
	xhr.send(fd);
}


function firmware_uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		document.getElementById('progress_num').innerHTML = resultatJson["pageParametre"]["firmware"]["telechargementFirmware"] + percentComplete.toString() + '%';
		document.getElementById('progress_bar').value = percentComplete;
		$('#progress_bar').hide();
	}
	else {
		document.getElementById('progress_num').innerHTML = 'unknow';
	}
}

function firmware_uploadComplete_usr(evt)
{
	/* This event is raised when the server send back a response */
//            alert(evt.target.responseText);
//	alert('upload completed');
	$('.upload_information').html('<h2>' + resultatJson["pageParametre"]["firmware"]["uploadStep1"] + '</h2>');
	$('.upload_information').html('<h2>' + resultatJson["pageParametre"]["firmware"]["uploadStep2"] + '</h2>');
	firmware_wait_restart_usr();
//	window.location.reload();
}


function firmware_uploadFailed(evt) {
	alert(resultatJson["pageParametre"]["firmware"]["failFirmware"]);
}

function firmware_uploadCanceled(evt) {
	alert(resultatJson["pageParametre"]["firmware"]["cancelFirmware"]);
}
		


function firmware_wait_restart_usr()
{
	$.ajax({
		url: "http://"+ IPAdress +"/version.cgi",	// ask for firmware version
		context: document.body
	})
	.done( function(data) { 	
			$('.upload_information').html('<h2>Firmware ' + data + ' now running<br/>Please wait while reloading...</h2>' );
			setTimeout("window.location.reload();", 5000);
			})
	.fail(  function( jqXHR, textStatus, errorThrown )  {
//			$('#page_manuf').html('<h1>' + textStatus + '</h1>' );
			$('.upload_information').find( "h2" ).append( "." );
			setTimeout("firmware_wait_restart();", 5000);
	});
	
}

function getElementCarte(data, value){
    return $(data).find(value).text();
}

