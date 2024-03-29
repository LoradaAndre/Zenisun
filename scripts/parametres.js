let monitoring_user_config = 0;							// current user configuration :b0=rain mode, b1=sun track, b2=winter mode.

let	heure_allumage = 1200;									// automatically power on light at XX:xx
let	heure_extinction = 360;		

let vitesseGradLed;
let actSuiviSol;

let sun_elev_close;

let home_set = [];

let longSaved;
let latSaved;

// let long;
// let lat;

// let neLong;
// let neLat;

// let interupt = false;

let onceIntemp = false;

let mot;
let once = false;
let clickSurOrient = false;

// let getHourAllumage = true;
// let getHourExtinction = true;

let capteurPluie;

let allumageAuto_switch;
let fermeturePluie_switch;

$(document).ready(function(){
	$(".btn-h-allumage").hide();
	$(".btn-h-extinction").hide();

	$(".h_allumage input").hide();
	$(".h_extinction input").hide();

	$(".saison_detail").hide();
	//Actualisation des informations, refresh
	lectureCarte()
	//Met à jour les sliders par rapport aux données de la carte
	updateInputRange();

	//Création des switcher
	createDoubleSwitch();
	
	allumage_auto_horaire()
	fermeture_pluie()
	clickGradLed()
	clickActSuiviSol()
	clickGeolocalisation();
	defaultOrientationPergola();

    setInterval(function(){ 

		IPAdress = localStorage.getItem("IP");

        lectureCarte();
        updateOutputRange();
		updateButtons();
    }, 1000);
});

function getElementCarte(data, value){
    return $(data).find(value).text();
}

//Lecture de la carte, récupération des infos pour les paramètres
function lectureCarte(){
    $.ajax({
        url: "http://"+ IPAdress +"/zns.cgi?cmd=d&p=ios",
        context: document.body
      }).done(function(data){
			// mot = parseInt(getMotorValue(data,24))
			mot = parseInt(getMotorValue(getElementCarte(data, "Mot0")))

			monitoring_user_config = parseInt(getElementCarte(data, "user"));

			if(onceIntemp == false && monitoring_user_config != "undefined"){
				defaultIntemperies()
			}
			
			//actualisation suivi solaire
			actSuiviSol = parseInt(getElementCarte(data , "sun_delay"));
			$(".list_of_buttons_suivi_sol h3[value="+ actSuiviSol +"]").attr("check", "true")

			//Capteur pluie
			capteurPluie = parseInt(getElementCarte(data, "gpi4"))


      }).fail(function() {
			// isConnected(false, data)
    });	

	$.ajax({
        url: "http://"+ IPAdress +"/zns.cgi?cmd=c",
        context: document.body
      }).done(function(data){
			// isConnected(true, data)
		  	//heure allumage
			// heure_allumage = parseInt(data.all[13].textContent);
			heure_allumage = parseInt(getElementCarte(data, "ligt_on_h"))
			if(getHourAllumage){
				$(".affichage_heure_allumage").text(GMTHourTolocalHour(heure_allumage))
				document.querySelector(".h_allumage input").value = GMTHourTolocalHour(heure_allumage);
			}
			//heure extinction
			// heure_extinction = parseInt(data.all[14].textContent);
			heure_extinction = parseInt(getElementCarte(data, "ligt_off_h"))
			if(getHourExtinction){
				$(".affichage_heure_extinction").text(GMTHourTolocalHour(heure_extinction))
				document.querySelector(".h_extinction input").value = GMTHourTolocalHour(heure_extinction);
			}
		
			//seuil de fermeture nuit
			// sun_elev_close = parseInt(data.all[15].textContent);
			sun_elev_close = parseInt(getElementCarte(data, "sun_elev_close"))
			$(".value_fermeture_nuit").text(sun_elev_close + "°")


			//gradateur LED
			// vitesseGradLed = parseInt(data.all[16].textContent);
			vitesseGradLed = parseInt(getElementCarte(data, "light_opt"));
			// console.log("vitesse grad led: " + vitesseGradLed)
			$(".list_of_buttons_grad_LED h3[value="+ vitesseGradLed +"]").attr("check", "true")


			//Longitude/lattitude
			// longSaved =  parseInt(data.all[6].textContent)/100.0;
			longSaved =  parseInt(getElementCarte(data, "lon"))/100.0
			// latSaved =  parseInt(data.all[7].textContent)/100.0;
			latSaved =  parseInt(getElementCarte(data, "lat"))/100.0

			affichageGeolocalisation();

			//Position des moteurs
			// home_set[0] = parseInt(getMotorHomeSet(data, 2))
			home_set[0] = parseInt(getElementCarte(data, "Mot0"))
			// home_set[1] = parseInt(getMotorHomeSet(data, 3))
			home_set[1] = parseInt(getElementCarte(data, "Mot1"))

			//Affichage de la valeur de l'orientation sur le dropdown
			// $("#liste_orientation").val(data.all[4].textContent)
			// +++++++++++++++
			$("#liste_orientation").val(getElementCarte(data, "orient"))
      }).fail(function() {
			// isConnected(false, data) 
    });

}

//Convertiseur int en boolean
function testTrueFalse(number){
	if(number == 0){
		return "false"
	}
	if(number == 1){
		return "true"
	}

}
//Récupère et converti la valeur du moteur en pourcentage
function getMotorValue(valMotor){
    newVal = valMotor.split(";")
    return newVal[0]*100/newVal[1]
}

// =============================== LANGUE ===============================

$(".drapFrance").click(function(){
	localStorage.setItem("langue", "fr")
});

$(".drapAnglais").click(function(){
	localStorage.setItem("langue", "en")
});

// $(".drapSuede").click(function(){
// 	localStorage.setItem("langue", "se")
// });

// =============================== HOMING ===============================

//Récupère si le homeset à été effectué ou non
function getMotorHomeSet(valHomeSet){
    newVal = valHomeSet.split(";")
    return newVal[2]
}

//Permet d'effectuer un homing des moteurs
function homming(mot_id){
	var command = "http://"+ IPAdress +"/zns.cgi?cmd=m&m=" + mot_id + "&p=-10000";
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data){
		// isConnected(true, data)
	}).fail(function(){
		// isConnected(false, data)
	});
}

//clic sur le bouton du homing => effectue le homing
$(".bouton_homing").click(function(){
    homming(3); // 3 => les deux moteurs
});

// =============================== GEOLOCALISATION ===============================

function clickGeolocalisation(){
	$(".bouton_geo").click(function(){
		applyGeolocalisation(neLong, long, neLat, lat)
	});

	$("#O1_1").click(function(){ //Est
		neLong = "";
		applyGeolocalisation(neLong, long, neLat, lat)
	});
	$("#O1_2").click(function(){ //Ouest
		neLong = "-";
		applyGeolocalisation(neLong, long, neLat, lat)
	});
	$("#O2_1").click(function(){ //Nord
		neLat = "";
		applyGeolocalisation(neLong, long, neLat, lat)
	});
	$("#O2_2").click(function(){ //Sud
		neLat = "-";
		applyGeolocalisation(neLong, long, neLat, lat)
	});

}

//Gestion de la géolocalisation (Paramètres généraux)
function affichageGeolocalisation(){
	//Affiche les orientations de geolocalisation selon la valeur enregistrée
	//long < 0 => Est 
	if(longSaved < 0){ 
		$("#O1_2").attr("check","true");
		$("#O1_1").attr("check","false");
	}
	//long > 0 => Ouest 
	else{ 
		$("#O1_1").attr("check","true");
		$("#O1_2").attr("check","false");
	}
	//lat < 0 => Sud 
	if(latSaved < 0){
		$("#O2_2").attr("check","true");
		$("#O2_1").attr("check","false");
	}
	//lat > 0 => Nord 
	else{
		$("#O2_1").attr("check","true");
		$("#O2_2").attr("check","false");
	}

	//Associe par défaut les valeurs de long/latt en fonction de ce qui est enregistré dans la carte
	if(once == false && $(".geo_item_long input").val() != "undefined" && $(".geo_item_lat input").val()){
		
		long = Math.abs(longSaved);
		lat = Math.abs(latSaved);
		
		$(".geo_item_long input").val(Math.abs(long));
		$(".geo_item_lat input").val(Math.abs(lat));

		once = true;
	}

	//Pour les autres fois, la long/lat => les valeurs de l'input
	long = $(".geo_item_long input").val();
	lat = $(".geo_item_lat input").val();
	
	//Associe les symboles (+ et -) selon ce qui est enregistré comme cliqué
	if($("#O1_1").attr("check") == "false"){
		neLong = "-";
	}else{
		neLong = "";
	}

	if($("#O2_1").attr("check") == "false"){
		neLat = "-";
	}else{
		neLat = "";
	}

	//Affichage de la position 
	// document.querySelector(".geo_final .affichage_geo").textContent = "Positionnement: " + neLat + lat + ", " + neLong + long ;

}

//Requête pour sauvegarder la géolocalisation (Paramètres généraux)
function applyGeolocalisation(neLong, pergola_longitude, neLat, pergola_latitude){
//Pour la sauvegarde des nombres dans l'automate
pergola_longitude = pergola_longitude.toString().replace(',','.');
pergola_latitude = pergola_latitude.toString().replace(',','.');

//Transforme la chaine de caractère en nombre
if(neLong == "-"){
	pergola_longitude = - parseFloat(pergola_longitude)
}else{
	pergola_longitude = parseFloat(pergola_longitude)
}
if(neLat == "-"){
	pergola_latitude = - parseFloat(pergola_latitude)
}else{
	pergola_latitude = parseFloat(pergola_latitude)
}

//On applique la géolocalisation de la pergola
var command_long = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=11&v=" + pergola_longitude;
$.ajax({
  url: command_long,	
  context: document.body
	}).done(function(data) {
		// isConnected(true, data)
		var command_lat = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=12&v=" + pergola_latitude;
		$.ajax({
		url: command_lat,	
		context: document.body
		}).done(function(data){
			// isConnected(true, data)
		}).fail(function(){
			// isConnected(false, data)
	});
});
}
// =============================== ORIENTATION ===============================

function defaultOrientationPergola(){
	$("#liste_orientation").change(function(){
		interupt = false;
		applyOrientationPergola($(this).val())
	});
}
// Requête d'orientation de la pergola (paramètres généraux)
function applyOrientationPergola(valeur){
	pergola_orient = parseInt(valeur);
	var command = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=10&v=" + pergola_orient;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data) {
		// isConnected(true, data)
	}).fail(function(){
		// isConnected(false, data)
	});
}
// =============================== ALLUMAGE AUTO SUR HORAIRE ===============================

//Off sur le check => met la valeur à 0
function allumage_auto_horaire(){
    $(".line-allumage-auto .switch").click(function(){
        if($(this).attr("aria-checked") == "false"){
            set_user_config ( monitoring_user_config & ~16 )
			$(".selection_horaire_auto").hide();
        }else{
			set_user_config ( monitoring_user_config | 16 );
			$(".selection_horaire_auto").show();
		}
    });
}

//Converti l'heure en local (format XX:XX) en GMT
function localHourToGMTHour(str){
	var h_pergola = (new Date( 1970, 0, 1, str.substr(0,2), str.substr(3))).getTime();	 // in milliseconds
	return h_pergola/1000/60;
}

//Converti l'heure en GMT en local (format XX:XX) 
function GMTHourTolocalHour(minutes){
		var h_local = new Date(Date.UTC( 1970, 0, 1, parseInt(minutes/60), minutes%60 ));	
		var str = TwoDigit(parseInt(h_local.getHours())) + ":"  + TwoDigit(parseInt(h_local.getMinutes() ));
		return str;
}	

function TwoDigit(v){
	if(v < 10 ){
		return "0" + v;
	}
	return "" + v;
}

//Clique sur appliquer => Applique l'heure pour l'allumage
$(".btn-h-allumage").click(function(){
	apply_ligt_on_h();
	getHourAllumage = true;
	$(".btn-h-allumage").hide();
	$(".btn-h-allumage-modifier h3").text("Modifier")
	$(".affichage_heure_allumage").show();
	$(".h_allumage input").hide()
});

//Clique sur appliquer => applique l'heure pour l'extinction
$(".btn-h-extinction").click(function(){
	apply_ligt_off_h();
	getHourExtinction = true;
	$(".btn-h-extinction").hide();
	$(".btn-h-extinction-modifier h3").text("Modifier")
	$(".affichage_heure_extinction").show();
	$(".h_extinction input").hide()
});

//Applique l'heure pour l'extinction
function apply_ligt_off_h(){

	heure_allumage = $('#light_off_hour').val()

	var command = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=6&v=" + localHourToGMTHour(heure_allumage);
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		// isConnected(true, data)
	}).fail(function(){
		// isConnected(false, data)
	});
}

//Applique l'heure pour l'allumage
function apply_ligt_on_h(){

	heure_extinction = $('#light_on_hour').val()

	var command = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=5&v=" + localHourToGMTHour(heure_extinction);
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data) {
		// isConnected(true, data)
	}).fail(function(){
		// isConnected(false, data)
	});
}
// =============================== VITESSE GRADATEUR LED ===============================

function clickGradLed(){
	applyGradateurLed("#L1")
	applyGradateurLed("#L2")
	applyGradateurLed("#L3")
	applyGradateurLed("#L4")
	applyGradateurLed("#L5")
}

//Vitesse gradateur LED
function applyGradateurLed(idButton){

	$(idButton).click(function(){

		light_opt = $(idButton).attr("value");

		var command = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=9&v=" + light_opt;
		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function(data){
			// isConnected(true, data)
		}).fail(function(){
			// isConnected(false, data)
		});
	});
}


// =============================== FERMETURE PLUIE ===============================

//Off sur le check => met la valeur à 0
function fermeture_pluie(){
    $(".line-fermeture-pluie .switch").click(function(){
        if($(this).attr("aria-checked") == "true"){
            set_user_config(monitoring_user_config | 1);	// clr rain mode bit
        }else{
			set_user_config(monitoring_user_config & ~1);  	// set rain mode bit
		}
    });
}
// =============================== SAISONNIER ===============================
$(".button_ete").click(function(){
	$(".saison_detail").show();
	set_user_config ( monitoring_user_config | 2 );		// set tracking bit
	set_user_config ( monitoring_user_config & ~4 );	// clr winter bit
});

$(".button_hiver").click(function(){
	$(".saison_detail").show();
	set_user_config ( monitoring_user_config | 4 );		// set winter bit
	set_user_config ( monitoring_user_config | 2 );		// set tracking bit	
});

$(".button_saision_off").click(function(){
	$(".saison_detail").hide();
	set_user_config ( monitoring_user_config & ~2 );	// clr tracking bit
	set_user_config ( monitoring_user_config & ~4 );	// clr winter bit
});

// =============================== INTEMPERIES ===============================

$(".button_vent").click(function(){
	$(this).attr("check","true")
	deplacementLames(3, 0);  //déplacement de tout les moteurs à 0°
	
	setTimeout(function(){
		set_user_config ( monitoring_user_config | 8 );		// set wintering  bit
		$(".button_intemp_off").attr("check","false")
	}, 1000);
	$(".button_neige").hide();
});

$(".button_neige").click(function(){
		$(this).attr("check","true")
		deplacementLamesAngle(3, 90);  //déplacement de tout les moteurs à 90°
		setTimeout(function(){
			set_user_config ( monitoring_user_config | 8 );		// set wintering  bit
			$(".button_intemp_off").attr("check","false")
		}, 1000);
		$(".button_vent").hide();
});

$(".button_intemp_off").click(function(){
	//Si le homing n'a pas été fait, on le réalise
	for(let i = 0; i < home_set.length; i++){
		if(home_set[i] & 1){
			// console.log("passage au suivant")
		}
		else{
			homming(i+1)
		}
	}
	set_user_config ( monitoring_user_config & ~8 );	// clr wintering  bit

	$(".button_neige").show();
	$(".button_vent").show();
});

// =============================== SEUIL DE FERMETURE NUIT ===============================

//Récupère et converti le seuil de fermeture en pourcentage
function getSeuilFermeture(newVal){
    return parseInt(newVal*100/45);
}

//Change les valeurs de la carte selon la position des sliders
function updateInputRange(){
    changeValueWithRange(".wrap-elevation_sol");
}

function changeValueWithRange(classRange){
    let range = document.querySelector(classRange + " .range");
    $(range).change(function(){
        changeSeuilFermNuit(range.value);
    });
}

//Met à jour les barres selon les données de la carte
function updateOutputRange(){
    refreshBarre(".wrap-elevation_sol", sun_elev_close);
}

//Actualisation des barres selon les données de la carte
function refreshBarre(classRange, input, inputSpe){

	if(typeof inputSpe == 'undefined'){
		inputSpe = "";
	}

	let range = document.querySelector(classRange)
	let bubble = range.querySelector(".bubble");
	let contenuVal = range.querySelector(".value-range-wrap");

	setOffsetBubble(bubble, contenuVal, input, inputSpe);
}
//Requête de changement du seil de fermeture nuit (Environnement)
function changeSeuilFermNuit(value){
	var h = parseInt(value);
	var command = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=7&v=" + h;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data){
		// isConnected(true, data)
	}).fail( function(){
		// isConnected(false, data)
	});
}

// =============================== ACTUALISATION SUIVI SOLAIRE  ===============================

function clickActSuiviSol(){
	applyPeriodSuiviSol("#B1")
	applyPeriodSuiviSol("#B2")
	applyPeriodSuiviSol("#B3")
	applyPeriodSuiviSol("#B4")
	applyPeriodSuiviSol("#B5")
}

//Requête pour l'actualisation de suivi solaire (Environnement)
function applyPeriodSuiviSol(idButton){
	$(idButton).click(function(){
		sun_upd_per = $(idButton).attr("value");
		var command = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=4&v=" + sun_upd_per;

		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function(data) {
			// isConnected(true, data)
		}).fail(function() {
			// isConnected(false, data)
		});
	});
}

// =============================== AUTRE ===============================

//Création des switcher
function createDoubleSwitch(){
    let elallumage = document.querySelector('.allumageAuto-check');
    let elpluie = document.querySelector('.fermeturePluie-check');

	console.log("======================")
	console.log(elallumage)
	console.log(elpluie)

	allumageAuto_switch = new Switch(elallumage, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });
	fermeturePluie_switch = new Switch(elpluie, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });
}

function set_user_config( new_config ){
	new_config &= 65535;	// bound to 16 bits
	if ( monitoring_user_config != new_config ){
		monitoring_user_config = new_config;	// anticipate to answer.
		var command = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=3&v=" + new_config;
		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function(data){
			// isConnected(true, data)
		}).fail(function(){
			// isConnected(false, data)
		});
	}
}

//Requête de déplacement de lame à un certain angle (pour les modes avec les lames)
function deplacementLamesAngle(moteur, angle){ 
    $.ajax({
        url: "http://"+ IPAdress +"/zns.cgi?cmd=m&m=" + moteur + '&a=' + angle,
        context: document.body
      }).done(function(data) {
			// isConnected(true, data)
      }).fail(function() {
			// isConnected(false, data)
      });
}

//Requête de déplacement de lame (pour les modes avec les lames)
function deplacementLames(moteur, valeur){ 
    $.ajax({
        url: "http://"+ IPAdress +"/zns.cgi?cmd=m&m=" + moteur + "&p=" + valeur,
        context: document.body
      }).done(function(data) {
			// isConnected(true, data)
      }).fail(function() {
			// isConnected(false, data)
      });
}

function updateButtons(){

	//si pluie activée
	if(monitoring_user_config&1){
		// console.log("pluie activée: " + (monitoring_user_config&1))
		// $(".check-fermeture_pluie .ui-switcher").attr("aria-checked", "true")
		fermeturePluie_switch.on()
	}

	//si le bit suivi solaire est activé (mode été)
	if(monitoring_user_config&2){
		//si le bit de l'ombrage minimum est activé (mode hiver activé) => active mode hiver
		if(monitoring_user_config&4){
			$(".button_hiver").attr("check", "true")
			$(".button_ete").attr("check", "false")	
			$(".button_saision_off").attr("check", "false")

			$(".saison_detail").show();

		}//si le bit de l'ombrage minimum est désactivé (mode hiver activé) => active mode été
		else{
			$(".button_ete").attr("check", "true")
			$(".button_hiver").attr("check", "false")
			$(".button_saision_off").attr("check", "false")

			$(".saison_detail").show();
		}
	}
	//si ni mode été ni mode hiver
	else{
		$(".button_ete").attr("check", "false")
		$(".button_hiver").attr("check", "false")
		$(".button_saision_off").attr("check", "true")
		$(".saison_detail").hide();
	}

	if(monitoring_user_config == 0){
		// console.log("oui c'est zéro")
		$(".button_intemp_off").attr("check", "true")
		$(".button_saision_off").attr("check", "true")
	}

	//si allumage auto horaire
	if(monitoring_user_config&16){
		// $(".check-allumage-auto-h .ui-switcher").attr("aria-checked", "true")
		allumageAuto_switch.on()
		$(".selection_horaire_auto").show();
	}else{
		// $(".check-allumage-auto-h .ui-switcher").attr("aria-checked", "false")
		allumageAuto_switch.off()
		$(".selection_horaire_auto").hide();
	}
}

function defaultIntemperies(){
	onceIntemp = true;
	//si intemperies activé
	if(monitoring_user_config&8){
		// console.log("motval: " + mot)
		if(mot == 0){
			// console.log("vent activées: " + (monitoring_user_config&8))
			$(".button_vent").attr("check", "true")
			$(".button_neige").attr("check", "false")
			$(".button_neige").hide()
			$(".button_vent").show()
			$(".button_intemp_off").attr("check", "false")
		}else{
			// console.log("neige activées: " + (monitoring_user_config&8))
			$(".button_vent").attr("check", "false")
			$(".button_vent").hide()
			$(".button_neige").show()
			$(".button_neige").attr("check", "true")
			$(".button_intemp_off").attr("check", "false")
		}
		
	}else{
		$(".button_intemp_off").attr("check", "true")

	}
}

// ================================ MAINTENANCE ================================

$(".b_first").click(function(){
	// console.log("oui t'as cliqué")
	// console.log($(".modal-body input").val())
	// console.log(typeof $(".modal-body input").val())
	if($(".modal-body input").val() == "4682"){
		window.location.href = "setup.html"
	}
});

// =============================== FIRMWARE ===============================

// $(".install-button").click(function(){
// 	usr_firmware_upload();
// })

// function getXMLHttpRequest() 
// {
// var xhr = null;
// 	if (window.XMLHttpRequest || window.ActiveXObject) 
// 	{
// 		if (window.ActiveXObject) 
// 		{
// 			try 
// 			{
// 				xhr = new ActiveXObject("Msxml2.XMLHTTP");
// 			} catch(e) 
// 			{
// 				xhr = new ActiveXObject("Microsoft.XMLHTTP");
// 			}
// 		} 
// 		else 
// 		{
// 			xhr = new XMLHttpRequest(); 
// 		}
// 	} 
// 	else 
// 	{
// 		alert("ERROR : XMLHttpRequestunavailable!");
// 		return null;
// 	}
// 	return xhr;
// }

// function usr_firmware_upload() 
// {
// 	var fd = new FormData();
// 	fd.append("i", document.getElementById('firmware_file').files[0]);
// 	var xhr = new getXMLHttpRequest();
// 	xhr.upload.addEventListener("progress", firmware_uploadProgress, false);
// 	xhr.addEventListener("load", firmware_uploadComplete_usr, false);
// 	xhr.addEventListener("error", firmware_uploadFailed, false);
// 	xhr.addEventListener("abort", firmware_uploadCanceled, false);
// //	xhr.open('POST', '/upload');
// 	xhr.open('POST', '../firmware');
// 	$(".upload_information").html('<h2 id="progress_num">Veuillez patienter...</h2>');
// 	xhr.send(fd);
// }


// function firmware_uploadProgress(evt) {
// 	if (evt.lengthComputable) {
// 		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
// 		document.getElementById('progress_num').innerHTML = 'Téléchargement du firmware ... ' + percentComplete.toString() + '%';
// 		document.getElementById('progress_bar').value = percentComplete;
// 		$('#progress_bar').hide();
// 	}
// 	else {
// 		document.getElementById('progress_num').innerHTML = 'unknow';
// 	}
// }

// function firmware_uploadComplete_usr(evt)
// {
// 	/* This event is raised when the server send back a response */
// //            alert(evt.target.responseText);
// //	alert('upload completed');
// 	$('.upload_information').html('<h2>Patientez, l\'installation démarre...</h2>');
// 	$('.upload_information').html('<h2>La wifi de votre pergola va redémarrer, pensez à vous reconnecter</h2>');
// 	firmware_wait_restart_usr();
// //	window.location.reload();
// }


// function firmware_uploadFailed(evt) {
// 	alert("Une erreur est survenue durant l'installation du firmware");
// }

// function firmware_uploadCanceled(evt) {
// 	alert("Le chargement à été annulé par l'utilisateur ou la connexion wifi à été coupée");
// }
		


// function firmware_wait_restart_usr()
// {
// 	$.ajax({
// 		url: '../cgi/version.cgi',	// ask for firmware version
// 		context: document.body
// 	})
// 	.done( function(data) { 	
// 			$('.upload_information').html('<h2>Firmware ' + data + ' now running<br/>Please wait while reloading...</h2>' );
// 			setTimeout("window.location.reload();", 5000);
// 			})
// 	.fail(  function( jqXHR, textStatus, errorThrown )  {
// //			$('#page_manuf').html('<h1>' + textStatus + '</h1>' );
// 			$('.upload_information').find( "h2" ).append( "." );
// 			setTimeout("firmware_wait_restart();", 5000);
// 	});
	
// }