let config = 1;

let valueMotor0;
let valueMotor1;

let valueMaxMotor0;
let valueMaxMotor1;

let synchro = false;

let init = false;

let monitoring_user_config;

let hwcfg;
let oneTime = false;

let switchSynchro;

$(document).ready(function (){
    $(".test").hide();
    updateAllInput();
    lectureCarte();
    createSwitch();

    setInterval(function(){ 
        lectureCarte();
        initButtons()
        updateOutputRange();
        synchronisationLames();
        sauvegardeSync()
    }, 1000);
});

function getElementCarte(data, value){
    return $(data).find(value).text();
}

function lectureCarte(){
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios",
        context: document.body
      }).done(function(data) {
            // isConnected(true, data)
            // valueMotor0 = parseInt(getMotorValue(data, 24));
            valueMotor0 = parseInt(getMotorValue(getElementCarte(data, "Mot0")));
            // valueMaxMotor0 = parseInt(getMotorMaxValue(data, 24));
            valueMaxMotor0 = parseInt(getMotorMaxValue(getElementCarte(data, "Mot0")));
            // valueMotor1 = parseInt(getMotorValue(data, 25));
            valueMotor1 = parseInt(getMotorValue(getElementCarte(data, "Mot1")));
            // valueMaxMotor1 = parseInt(getMotorMaxValue(data, 25));
            valueMaxMotor1 = parseInt(getMotorMaxValue(getElementCarte(data, "Mot0")));

            // monitoring_user_config = parseInt(data.all[30].textContent);
            monitoring_user_config = parseInt(getElementCarte(data, "user"));
            console.log(getElementCarte(data, "user"))
			console.log(monitoring_user_config)
            updateSaisonnier();

      }).fail(function() {
            // isConnected(false, data)
      });	


      $.ajax({
        url: '../cgi/zns.cgi?cmd=c',
        context: document.body
      }).done(function(data){
             //hwcfg
             hwcfg = parseInt(getElementCarte(data, "hwcfg"))
             if(oneTime == false){
                gestionAffichageBloc(hwcfg)
             }
      }).fail(function() {
    });	
  
}

//Gestion des boutons de pourcentage
function initButtons(){
    if(valueMotor0 != "undefined" && init == false){
        init = true;

        if(valueMotor0 == 0){
            $(".lbl1").children().eq(0).attr("check", "true");
        }
        if(valueMotor0 == 25){
            $(".lbl1").children().eq(1).attr("check", "true");
        }
        if(valueMotor0 == 50){
            $(".lbl1").children().eq(2).attr("check", "true");
        }
        if(valueMotor0 == 75){
            $(".lbl1").children().eq(3).attr("check", "true");
        }
        if(valueMotor0 == 100){
            $(".lbl1").children().eq(4).attr("check", "true");
        }

        if(valueMotor1 == 0){
            $(".lbl2").children().eq(0).attr("check", "true");
        }
        if(valueMotor1 == 25){
            $(".lbl2").children().eq(1).attr("check", "true");
        }
        if(valueMotor1 == 50){
            $(".lbl2").children().eq(2).attr("check", "true");
        }
        if(valueMotor1 == 75){
            $(".lbl2").children().eq(3).attr("check", "true");
        }
        if(valueMotor1 == 100){
            $(".lbl2").children().eq(4).attr("check", "true");
        }
    }
}

//Sauvegarde de la synchronisation des lames (local storage)
function sauvegardeSync(){
    //Si la syncho est pas enregistrée, on enregistre false
    if(localStorage.getItem("syncLames") == null){
        localStorage.setItem("syncLames", "false");
        synchro = false;
    }
    //dans le cals ou elle est enregistrée... on assimile le switcher à ce qui est enregistré 
    synchro = stringToBool(localStorage.getItem("syncLames"));
    if(synchro){
        switchSynchro.on();
    }else{
        switchSynchro.off();
    }

    $(".switch").click(function(){
        console.log($(this).attr("aria-checked"))
        let value = $(this).attr("aria-checked");
        localStorage.setItem("syncLames", value);
        synchro = stringToBool(localStorage.getItem("syncLames"));
    });
}

function updateAllInput(){
    updateInput(".wrap-lames-1");
    updateInput(".wrap-lames-2");
}

function stringToBool(str){
    if(str === "true"){
        return true;
    }
    if(str === "false"){
        return false;
    }
    return null
}

function updateInput(classWrap){
    let rangeWrap = document.querySelector(classWrap + " .range");

    $(rangeWrap).change(function(){

        if(!((monitoring_user_config & 2) || (monitoring_user_config & 4))){
            if(classWrap == ".wrap-lames-1"){
                let val = parseInt(rangeWrap.value*valueMaxMotor0/100);
                deplacementLames(1 ,val);
                if(synchro){
                    deplacementLames(2 ,val);
                }
            }
            else if(classWrap == ".wrap-lames-2"){
                let val = parseInt(rangeWrap.value*valueMaxMotor1/100);
                deplacementLames(2 ,val);
                if(synchro){
                    deplacementLames(1 ,val);
                }
            }
        }
    });
}

//Récupère et converti la valeur du moteur en pourcentage
function getMotorValue(valMotor){
    newVal = valMotor.split(";")
    return newVal[0]*100/newVal[1]
}

//Récupère la valeur maximale du moteur
function getMotorMaxValue(valMotor){
    newVal = valMotor.split(";")
    return newVal[1];
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

function updateOutputRange(){
    refreshBarre(".wrap-lames-1", valueMotor0);
    refreshBarre(".wrap-lames-2", valueMotor1);
}

function synchronisationLames(){
    $(".synchro-check .switch").click(function(){
        if($(this).attr("aria-checked") == "false"){
            synchro = false;
        }else{
            synchro = true;
        }
    });
}

//Applique le pourcentage des boutons
$("h3").click(function(){
    if(!((monitoring_user_config & 2) || (monitoring_user_config & 4))){
        if(this.id == "1-LO1"){
            deplacementLames(1, 0)
            if(synchro){
                deplacementLames(2, 0)
                $("#2-LO1").attr("check", "true")
                resetOther("2-LO1");
            }
        }
        if(this.id == "1-LO2"){
            deplacementLames(1, parseInt(valueMaxMotor0/4));
            if(synchro){
                deplacementLames(2, parseInt(valueMaxMotor1/4))
                $("#2-LO2").attr("check", "true")
                resetOther("2-LO2");
            }
        }
        if(this.id == "1-LO3"){
            deplacementLames(1, parseInt(valueMaxMotor0/2))
            if(synchro){
                deplacementLames(2, parseInt(valueMaxMotor1/2))
                $("#2-LO3").attr("check", "true")
                resetOther("2-LO3");
            }
        }
        if(this.id == "1-LO4"){
            deplacementLames(1, parseInt(valueMaxMotor0/4*3))
            if(synchro){
                deplacementLames(2, parseInt(valueMaxMotor1/4*3))
                $("#2-LO4").attr("check", "true")
                resetOther("2-LO4");
            }
        }
        if(this.id == "1-LO5"){
            deplacementLames(1, valueMaxMotor0)
            if(synchro){
                deplacementLames(2, valueMaxMotor1)
                $("#2-LO5").attr("check", "true")
                resetOther("2-LO5");
            }
        }
        if(this.id == "2-LO1"){
            deplacementLames(2, 0)
            if(synchro){
                deplacementLames(1, 0)
                $("#1-LO1").attr("check", "true")
                resetOther("1-LO1");
            }
        }
        if(this.id == "2-LO2"){
            deplacementLames(2, parseInt(valueMaxMotor1/4))
            if(synchro){
                deplacementLames(1, parseInt(valueMaxMotor0/4))
                $("#1-LO2").attr("check", "true")
                resetOther("1-LO2");
            }
        }
        if(this.id == "2-LO3"){
            deplacementLames(2, parseInt(valueMaxMotor1/2))
            if(synchro){
                deplacementLames(1, parseInt(valueMaxMotor0/2))
                $("#1-LO3").attr("check", "true")
                resetOther("1-LO3");
            }
        }
        if(this.id == "2-LO4"){
            deplacementLames(2, parseInt(valueMaxMotor1/4*3))
            if(synchro){
                deplacementLames(1, parseInt(valueMaxMotor0/4*3))
                $("#1-LO4").attr("check", "true")
                resetOther("1-LO4");
            }
        }
        if(this.id == "2-LO5"){
            deplacementLames(2, valueMaxMotor1)
            if(synchro){
                deplacementLames(1, valueMaxMotor0)
                $("#1-LO5").attr("check", "true")
                resetOther("1-LO5");
            }
        }
    }
});

function resetOther(element){
    let allElements = $("#" + element).parent().children();
    console.log(allElements)
    for(let i = 0; i < allElements.length; i++){
        if($(allElements[i]).attr("id") != element){
            console.log("ele chaque i: " + $(allElements[i]).attr("id"))
            console.log("element: " + element)
            $(allElements[i]).attr("check", "false")
        }
    }
}

//Requête de déplacement de lame
function deplacementLames(moteur, valeur){ 
    console.log(monitoring_user_config)
    $.ajax({
        url: '../cgi/zns.cgi?cmd=m&m=' + moteur + '&p=' + valeur,
        context: document.body
        }).done(function(data) {
            // isConnected(true, data)
        }).fail(function() {
            // isConnected(false, data)
        });
}

//Affiche une popup de prévention en cas de blocage vent/neige/hiver/été
$(".bloc_mot").click(function(){
    if(($("#exampleModalCenter1").css("display") == "none") && (monitoring_user_config & 8)){
        console.log("yep c'est " + monitoring_user_config);
        var myModal = new bootstrap.Modal(document.getElementById("exampleModalCenter1"), {});
    
        myModal.show();
    }
    else if(($("#exampleModalCenter2").css("display") == "none") && (monitoring_user_config & 2)){
        console.log("yep c'est " + monitoring_user_config);
        var myModal = new bootstrap.Modal(document.getElementById("exampleModalCenter2"), {});
    
        myModal.show();
    }
});
//Gestion de l'affichage des blocs selon la config utilisateur
function gestionAffichageBloc(hwcfg){
    if(hwcfg&1){
        $(".bloc_Mot1").show();
    }
    if(hwcfg&2){
        $(".bloc_Mot2").show();
        $(".bloc_sync").show();
    }   
}

// =============================== SAISONNIER ===============================

function updateSaisonnier(){
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
}

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

function set_user_config( new_config ){
	new_config &= 65535;	// bound to 16 bits
	if ( monitoring_user_config != new_config ){
		monitoring_user_config = new_config;	// anticipate to answer.
		var command = '../cgi/zns.cgi?cmd=u&p=3&v=' + new_config;
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

function createSwitch(){
    var el = document.querySelector('.checkbox-switch');
    switchSynchro = new Switch(el, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });
}