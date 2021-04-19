let monitoring_user_config = 0;							// current user configuration :b0=rain mode, b1=sun track, b2=winter mode.

let	heure_allumage = 1200;									// automatically power on light at XX:xx
let	heure_extinction = 360;		

let vitesseGradLed;
let actSuiviSol;

let sun_elev_close;

let home_set = [];

let longSaved;
let latSaved;

let long;
let lat;

let neLong;
let neLat;

let once = false;

let mot;

$(document).ready(function(){
	//Actualisation des informations, refresh
	lectureCarte()
	//Met à jour les sliders par rapport aux données de la carte
	updateInputRange();

	allumage_auto_horaire()
	fermeture_pluie()
	clickGradLed()
	clickActSuiviSol()
	clickGeolocalisation();
	defaultOrientationPergola();

    setInterval(function(){ 
        lectureCarte();
        updateOutputRange();
		affichageGeolocalisation();
    }, 1000);
});

//Lecture de la carte, récupération des infos pour les paramètres
function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data){
			console.log(data.all)

			isConnected(true, data)
			monitoring_user_config = parseInt(data.all[30].textContent);
			console.log("monitoring user truc: " + (monitoring_user_config))
			updateButtons();

			mot = parseInt(getMotorValue(data,24))
			
			actSuiviSol = parseInt(data.all[33].textContent);
			console.log("actulisation suivi sol: " + actSuiviSol)
			$(".list_of_buttons_suivi_sol h3[value="+ actSuiviSol +"]").attr("check", "true")

      }).fail(function() {
			isConnected(false, data)
			//   alert("Lecture de la carte échouée")  
    });	

	$.ajax({
        url: '../cgi/zns.cgi?cmd=c'+my_current_automatum_cmd,
        context: document.body
      }).done(function(data){
		  	// console.log(data.all)

			isConnected(true, data)
		  	//heure allumage
			heure_allumage = parseInt(data.all[13].textContent);	
			document.querySelector(".h_allumage input").value = GMTHourTolocalHour(heure_allumage);		
			//heure extinction
			heure_extinction = parseInt(data.all[14].textContent);	
			document.querySelector(".h_extinction input").value = GMTHourTolocalHour(heure_extinction);
		
			//seuil de fermeture nuit
			sun_elev_close = parseInt(data.all[15].textContent);

			//gradateur LED
			vitesseGradLed = parseInt(data.all[16].textContent);
			console.log("vitesse grad led: " + vitesseGradLed)
			$(".list_of_buttons_grad_LED h3[value="+ vitesseGradLed +"]").attr("check", "true")


			//Longitude/lattitude
			longSaved =  parseInt(data.all[6].textContent)/100.0;
			latSaved =  parseInt(data.all[7].textContent)/100.0;

			//Position des moteurs
			home_set[0] = parseInt(getMotorHomeSet(data, 2))
			home_set[1] = parseInt(getMotorHomeSet(data, 3))

			

			$("#liste_orientation").val(data.all[4].textContent)
      }).fail(function() {
			isConnected(false, data)
        //   alert("Lecture de la carte échouée")  
    });

}

function testTrueFalse(number){
	if(number == 0){
		return "false"
	}
	if(number == 1){
		return "true"
	}

}
//Récupère et converti la valeur du moteur en pourcentage
function getMotorValue(data, input){
    let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
    return newVal[0]*100/newVal[1]
}


// =============================== HOMING ===============================

//Récupère si le homeset à été effectué ou non
function getMotorHomeSet(data, input){
    let valHomeSet = data.all[input].textContent
    let newVal = valHomeSet.split(";")
    return newVal[2]
}

//Permet d'effectuer un homing des moteurs
function homming(mot_id){
	var command = '../cgi/zns.cgi?cmd=m&m=' + mot_id + '&p=-10000';
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data){
		isConnected(true, data)
		alert("homing")
	}).fail(function(){
		isConnected(false, data)
		alert("erreur lors de l'aplication de l'homing")
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
		$(".geo_item_long input").val(Math.abs(longSaved));
		$(".geo_item_lat input").val(Math.abs(latSaved));

		long = Math.abs(longSaved);
		lat = Math.abs(latSaved);

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
	document.querySelector(".geo_final .affichage_geo").textContent = "Positionnement: " + neLat + lat + ", " + neLong + long ;

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
var command_long = '../cgi/zns.cgi?cmd=u&p=11&v=' + pergola_longitude + my_current_automatum_cmd;
$.ajax({
  url: command_long,	
  context: document.body
	}).done(function(data) {
		isConnected(true, data)
		alert("envoie de la longitude réussie")
		var command_lat = '../cgi/zns.cgi?cmd=u&p=12&v=' + pergola_latitude + my_current_automatum_cmd;
		$.ajax({
		url: command_lat,	
		context: document.body
		}).done(function(data){
			isConnected(true, data)
			alert("envoi de la geolocalisation réussie")
		}).fail(function(){
			isConnected(false, data)
			alert("bug lors de l'envoi de la geolocalisation")
	});
});
}
// =============================== ORIENTATION ===============================

function defaultOrientationPergola(){
	$("#liste_orientation").change(function(){
		applyOrientationPergola($(this).val())
	});
}
//Requête d'orientation de la pergola (paramètres généraux)
function applyOrientationPergola(valeur){
	pergola_orient = parseInt(valeur);
	var command = '../cgi/zns.cgi?cmd=u&p=10&v=' + pergola_orient + my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data) {
		isConnected(true, data)
		alert("envoi du changement d'orientation de la pergola => code: " + pergola_orient )
	}).fail(function(){
		isConnected(false, data)
		alert("erreur lors du changement d'orientation de la pergola")
	});
}
// =============================== ALLUMAGE AUTO SUR HORAIRE ===============================

//Off sur le check => met la valeur à 0
function allumage_auto_horaire(){
    $(".check-allumage-auto-h .ui-switcher").click(function(){
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
});

//Clique sur appliquer => applique l'heure pour l'extinction
$(".btn-h-extinction").click(function(){
	apply_ligt_off_h();
});

//Applique l'heure pour l'extinction
function apply_ligt_off_h(){

	heure_allumage = $('#ligt_off_h').val()

	var command = '../cgi/zns.cgi?cmd=u&p=6&v=' + localHourToGMTHour(heure_allumage);
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		isConnected(true, data)
		alert("envoi de l'heure d'extinction terminée")
	}).fail(function(){
		isConnected(false, data)
		alert("echec de l'heure d'extinction ")
	});
}

//Applique l'heure pour l'allumage
function apply_ligt_on_h(){

	heure_extinction = $('#light_on_hour').val()

	var command = '../cgi/zns.cgi?cmd=u&p=5&v=' + localHourToGMTHour(heure_extinction);
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data) {
		isConnected(true, data)
		alert("envoi de l'heure de démarrage terminée")
	}).fail(function(){
		isConnected(false, data)
		alert("echec de l'heure de démarrage ")
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

		var command = '../cgi/zns.cgi?cmd=u&p=9&v=' + light_opt+my_current_automatum_cmd;
		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function(data){
			isConnected(true, data)
			alert("Mise en place du gradateur LED à " + $(idButton).text())
		}).fail(function(){
			isConnected(false, data)
			alert("Erreur lors de la mise en place du gradateur LED")
		});
	});
}


// =============================== FERMETURE PLUIE ===============================

//Off sur le check => met la valeur à 0
function fermeture_pluie(){
    $(".check-fermeture_pluie .ui-switcher").click(function(){
        if($(this).attr("aria-checked") == "false"){
            set_user_config(monitoring_user_config & ~1);	// clr rain mode bit
        }else{
			set_user_config(monitoring_user_config | 1);	// set rain mode bit
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
	set_user_config ( monitoring_user_config & ~2 );	// clear tracking bit	
});

$(".button_saision_off").click(function(){
	$(".saison_detail").hide();
	set_user_config ( monitoring_user_config & ~2 );	// clr tracking bit
	set_user_config ( monitoring_user_config & ~4 );	// clr winter bit
});

// =============================== INTEMPERIES ===============================

$(".button_vent").click(function(){
	deplacementLames(3, 0);  //déplacement de tout les moteurs à 0°
	set_user_config ( monitoring_user_config | 8 );		// set wintering  bit
	$(".button_neige").hide();
});

$(".button_neige").click(function(){
	deplacementLamesAngle(3, 90);  //déplacement de tout les moteurs à 90°
	set_user_config ( monitoring_user_config | 8 );		// set wintering  bit
	$(".button_vent").hide();
});

$(".button_intemp_off").click(function(){
	//Si le homing n'a pas été fait, on le réalise
	for(let i = 0; i < home_set.length; i++){
		if(home_set[i] & 1){
			console.log("passage au suivant")
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
function getSeuilFermeture(data, input){
    let newVal = data.all[input].textContent
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
	var command = '../cgi/zns.cgi?cmd=u&p=7&v=' + h+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data){
		isConnected(true, data)
		alert("élévation solaire à " + value + " degrés")
	}).fail( function(){
		isConnected(false, data)
		alert("fail dans l'élévation solaire")
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
		var command = '../cgi/zns.cgi?cmd=u&p=4&v=' + sun_upd_per+my_current_automatum_cmd;

		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function(data) {
			isConnected(true, data)
			alert("temps suiv sol à " + sun_upd_per + " minutes" )
		}).fail(function() {
			isConnected(false, data)
			alert("erreur lors de l'activation du temps du suivi solaire")
		});
	});
}

// =============================== UPGRADE ===============================
// =============================== AUTRE ===============================

function set_user_config( new_config ){
	new_config &= 65535;	// bound to 16 bits
	if ( monitoring_user_config != new_config ){
		monitoring_user_config = new_config;	// anticipate to answer.
		var command = '../cgi/zns.cgi?cmd=u&p=3&v=' + new_config;
		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function(data){
			isConnected(true, data)
			alert("change config okay");
		}).fail(function(){
			isConnected(false, data)
			alert("erreur lors du changement de config utilisateur");
		});
	}
}

//Requête de déplacement de lame à un certain angle (pour les modes avec les lames)
function deplacementLamesAngle(moteur, angle){ 
    $.ajax({
        url: '../cgi/zns.cgi?cmd=m&m=' + moteur + '&a=' + angle,
        context: document.body
      }).done(function(data) {
			isConnected(true, data)
			alert('déplacement de la lame à ' + angle + "°")
      }).fail(function() {
			isConnected(false, data)
          	alert("Déplacement de la lame échoué")
      });
}

//Requête de déplacement de lame (pour les modes avec les lames)
function deplacementLames(moteur, valeur){ 
    $.ajax({
        url: '../cgi/zns.cgi?cmd=m&m=' + moteur + '&p=' + valeur,
        context: document.body
      }).done(function(data) {
			isConnected(true, data)
			alert('deplacement de la lame à la position' + valeur)
      }).fail(function() {
			isConnected(false, data)
			alert("Déplacement de la lame échoué")
      });
}

function updateButtons(){

	//si pluie activée
	if(monitoring_user_config&1){
		console.log("pluie activée: " + (monitoring_user_config&1))
		$(".check-fermeture_pluie .ui-switcher").attr("aria-checked", "true")
	}

	//si intemperies activé
	if(monitoring_user_config&8){
		if(mot == 0){
			console.log("vent activées: " + (monitoring_user_config&8))
			$(".button_vent").attr("check", "true")
			$(".button_neige").attr("check", "false")
			$(".button_neige").hide()
			$(".button_vent").show()
			$(".button_intemp_off").attr("check", "false")
		}else{
			console.log("neige activées: " + (monitoring_user_config&8))
			$(".button_vent").attr("check", "false")
			$(".button_vent").hide()
			$(".button_neige").show()
			$(".button_neige").attr("check", "true")
			$(".button_intemp_off").attr("check", "false")
		}
		
	}else{
		$(".button_intemp_off").attr("check", "true")

	}

	//si mode hiver activé
	if(monitoring_user_config&4){
		// $(".button_ete").attr("check", "false")
		console.log("mode hiver activées: " + (monitoring_user_config&4))
		$(".button_hiver").attr("check", "true")
		$(".button_ete").attr("check", "false")	
		$(".button_saision_off").attr("check", "false")

	}

	//si mode été activé
	if(monitoring_user_config&2){
		console.log("mode été activées: " + (monitoring_user_config&2))

		$(".button_ete").attr("check", "true")

		$(".button_hiver").attr("check", "false")
		$(".button_saision_off").attr("check", "false")
		
		// $(".button_hiver").attr("check", "false")
	}

	if(monitoring_user_config == 0){
		console.log("oui c'est zéro")
		$(".button_intemp_off").attr("check", "true")
		$(".button_saision_off").attr("check", "true")
	}

	//si allumage auto horaire
	if(monitoring_user_config&16){
		$(".check-allumage-auto-h .ui-switcher").attr("aria-checked", "true")
		$(".selection_horaire_auto").show();
	}else{
		$(".check-allumage-auto-h .ui-switcher").attr("aria-checked", "false")
		$(".selection_horaire_auto").hide();
	}

	
}

// ================================ MAINTENANCE ================================

$(".b_first").click(function(){
	console.log("oui t'as cliqué")
	console.log($(".modal-body input").val())
	console.log(typeof $(".modal-body input").val())
	if($(".modal-body input").val() == "4682"){
		window.location.href = "setup.html"
	}
});