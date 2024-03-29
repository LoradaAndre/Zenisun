let bb1Intensite;
let bb1Watt;

let bb2Intensite;
let bb2Watt;

let RGBIntensite1;
let RGBWatt1;

let RGBIntensite2;
let RGBWatt2;

let RColor;
let GColor;
let BColor;

let init = false;
let oneTime = false;

let hwcfg;

let goSansAttente = true;

let bb1_switch;
let bb2_switch;
let rgb1_switch;
let rgb2_switch;

let allLight_switch;

let sauvegarde_eclairage;	// memory for 8 light pwm : PWM[4 .. 11] = dummy, dymmy, White1, white2, Red, green, blue, RVB dimming.

function getElementCarte(data, value){
    return $(data).find(value).text();
}

//Lecture de la carte, récupération des infos pour l'éclairage
function lectureCarte(){

    IPAdress = localStorage.getItem("IP");

    $.ajax({
        url: "http://"+ IPAdress +"/zns.cgi?cmd=d&p=ios",
        context: document.body
      }).done(function(data) {
            // isConnected(true,data);
            //RGB1
            // RGBIntensite1 = getIntensite(data, 12); //12: <GPO 4> dans la collection data.all
            // RGBWatt1 = getWatt(data, 12);
            RGBIntensite1 = getIntensite(getElementCarte(data, "gpo4"))
            RGBWatt1 = getWatt(getElementCarte(data, "gpo4"));
            //RGB2
            // RGBIntensite2 = getIntensite(data, 13); //13: <GPO 5>
            // RGBWatt2 = getWatt(data, 13);
            RGBIntensite2 = getIntensite(getElementCarte(data, "gpo5"))
            RGBWatt2 = getWatt(getElementCarte(data, "gpo5"));
            //BB1
            // bb1Intensite = getIntensite(data, 14); //14: <GPO 6>
            // bb1Watt = getWatt(data, 14);
            bb1Intensite = getIntensite(getElementCarte(data, "gpo6")); //14: <GPO 6>
            bb1Watt = getWatt(getElementCarte(data, "gpo6"));
            //BB2
            // bb2Intensite = getIntensite(data, 15); //15: <GPO 7>
            // bb2Watt = getWatt(data, 15);
            bb2Intensite = getIntensite(getElementCarte(data, "gpo7")); //15: <GPO 7>
            bb2Watt = getWatt(getElementCarte(data, "gpo7"));
            //RGB color
            // RColor = getColor(data, 16); //16: <GPO 8>
            RColor = getColor(getElementCarte(data, "gpo8"));
            // GColor = getColor(data, 17); //17: <GPO 9>
            GColor = getColor(getElementCarte(data, "gpo9"));
            // BColor = getColor(data, 18); //18: <GPO 10>
            BColor = getColor(getElementCarte(data, "gpo10"));

            getSavedMemoryLight(data)

      }).fail(function() {
            // isConnected(false, data)
    });	

    $.ajax({
        url: "http://"+ IPAdress +"/zns.cgi?cmd=c",
        context: document.body
      }).done(function(data){
             //hwcfg
            //  hwcfg = parseInt(data.all[17].textContent)
            hwcfg = parseInt(getElementCarte(data, "hwcfg"))
             console.log(hwcfg)
             if(oneTime == false){
                gestionAffichageBloc(hwcfg)
             }
        
      }).fail(function() {
    });
    
}

function changeValueWithRange(classRange, input){
    let range = document.querySelector(classRange + " .range");
    $(range).change(function(){

        //Lorsque l'on touche à la barre, automatiquement on active le curseur on/off
        if(classRange == ".wrap-BB-1"){
            bb1_switch.on()
        }else if(classRange == ".wrap-BB-2"){
            bb2_switch.on()
        }else if(classRange == ".wrap-RGB-1"){
            rgb1_switch.on()
        }else if(classRange == ".wrap-RGB-2"){
            rgb2_switch.on()
        }

        let val;
        if(classRange == ".R" || classRange == ".G" || classRange == ".B"){
            val = range.value;
        }
        else{
            //transformer la valeur en pourcentage, en intensité/couleur (0 à 255)
            val = parseInt(range.value*255/100);
        }

        if(input == 16 || input == 32){
            changeValueEclairage(2048, 255);
        }
        changeValueEclairage(input, val);
    });
}

//Change les valeurs de la carte selon la position des sliders
function updateInputRange(){
    changeValueWithRange(".wrap-RGB-1", 16);
    changeValueWithRange(".wrap-RGB-2", 32);
    changeValueWithRange(".wrap-BB-1", 64);
    changeValueWithRange(".wrap-BB-2", 128);
    changeValueWithRange(".R", 256);
    changeValueWithRange(".G", 512);
    changeValueWithRange(".B", 1024);
}

//Met à jour les barres selon les données de la carte
function updateOutputRange(){
    refreshBarre(".wrap-RGB-1", RGBIntensite1, RGBWatt1);
    refreshBarre(".wrap-RGB-2", RGBIntensite2, RGBWatt2);
    refreshBarre(".wrap-BB-1", bb1Intensite, bb1Watt);
    refreshBarre(".wrap-BB-2", bb2Intensite, bb2Watt);
    refreshBarre(".R", RColor);
    refreshBarre(".G", GColor);
    refreshBarre(".B", BColor);
}

$(document).ready(function() {
    $(".test").hide();
    $(".allumage_lumiere").show();
    lectureCarte();
    updateInputRange();
    createSwitch()

    //Actualisation des informations, refresh
    setInterval(function(){ 
        lectureCarte();
        updateOutputRange();
        AllEventSwitch();
    }, 500);

    setInterval(() => {
        defaut();
    }, 1000);

    //Changer couleur selon la roue chromatique
    $('#zoneColor').farbtastic(function(color){
        changeColor(color);
        updateOutputRange();
    });
});

function defaut(){
    if(bb1Intensite != "undefined" && init == false){
        // init = true;
        if(bb1Intensite != 0){
            bb1_switch.on()
        }else{
            bb1_switch.off()
        }
        if(bb2Intensite != 0){
            bb2_switch.on()
        }else{
            bb2_switch.off()
        }
        if(RGBIntensite1 != 0){
            rgb1_switch.on()
        }else{
            rgb1_switch.off()
        }
        if(RGBIntensite2 != 0){
            rgb2_switch.on()
        }else{
            rgb2_switch.off()
        }
    }
  
}
//Off sur le check => met la valeur à 0
function eventSwitch(classCheck, input, value){
    $(classCheck + " .switch").click(function(){
        console.log("cliqué")
        if(goSansAttente && classCheck != ".allumage_lumiere"){
            goSansAttente = false;
            if($(this).attr("aria-checked") == "false"){
                changeValueEclairage(input, 0)
            }else{
                console.log("rentré 1")
                changeValueEclairage(input, value)

                if(classCheck == ".bloc_RGB1" || classCheck == ".bloc_RGB1"){
                    console.log("yep")

                    //application du RGB
                    changeValueEclairage(256, sauvegarde_eclairage[4]);
                    changeValueEclairage(512, sauvegarde_eclairage[5]);
                    changeValueEclairage(1024, sauvegarde_eclairage[6]);

                    //activation des bandeaux rgb
                    changeValueEclairage(2048, sauvegarde_eclairage[7]);
                }else{
                    console.log("nope")
                }
            }
        }else if(goSansAttente && classCheck == ".allumage_lumiere"){
            console.log("youp dedans")
            goSansAttente = false;
            if($(this).attr("aria-checked") == "false"){
                changeValueEclairage(2032, 0)
            }else{
                changeValueEclairage(2048, sauvegarde_eclairage[7]);

                changeValueEclairage(16, sauvegarde_eclairage[7])
                changeValueEclairage(32, sauvegarde_eclairage[7])
                changeValueEclairage(64, sauvegarde_eclairage[2])
                changeValueEclairage(128, sauvegarde_eclairage[3])

                //application du RGB
                changeValueEclairage(256, sauvegarde_eclairage[4]);
                changeValueEclairage(512, sauvegarde_eclairage[5]);
                changeValueEclairage(1024, sauvegarde_eclairage[6]);
            }
        }
    });
}

function AllEventSwitch(){
    eventSwitch(".bloc_RGB1", 16, sauvegarde_eclairage[7]);
    eventSwitch(".bloc_RGB2", 32, sauvegarde_eclairage[7]);

    eventSwitch(".bloc_BB1", 64, sauvegarde_eclairage[2]);
    eventSwitch(".bloc_BB2", 128, sauvegarde_eclairage[3]);

    eventSwitch(".allumage_lumiere", 2032)
}

//Récupère et converti l'intensité (0 à 255) en pourcentage
function getIntensite(ledIntensite){
    let newVal = ledIntensite.split(";")
    return parseInt(newVal[0]*100/255);
}

//Récupère et converti la puissance (en mA) en Watt
function getWatt(ledPower){
    let newVal = ledPower.split(";")
    return parseFirstDecimal(newVal[1]*24/1000);
}

//Récupère la couleur
function getColor(ledColor){
    let newVal = ledColor.split(";")
    return newVal[0];
}

//Troncature d'une décimale aux dixièmes
function parseFirstDecimal(number){
    return Math.round(number * 10)/10
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

//Requète qui change l'intensité d'un ruban
function changeValueEclairage(ruban, valeur){ 
    $.ajax({
        url: "http://"+ IPAdress +"/zns.cgi?cmd=l&o="+ ruban +"&p=" + valeur,
        context: document.body
      }).done(function(data) {
        //   isConnected(true,data);
          setTimeout(function(){
            goSansAttente = true;
          })
      }).fail(function() {
            // isConnected(false, data)
      });
}

function changeColor(color){
    let hexR = color.substring(1,3);
    let hexG = color.substring(3,5);
    let hexB = color.substring(5,7);

    changeValueEclairage(256, parseInt(hexR,16))
    changeValueEclairage(512, parseInt(hexG,16))
    changeValueEclairage(1024, parseInt(hexB,16))
}

//Affichage des blocs semon la config utilisateur
function gestionAffichageBloc(hwcfg){
    oneTime = true;

    console.log(hwcfg)

    if(hwcfg&4){
        $(".bloc_BB1").show();
    }
    if(hwcfg&8){
        $(".bloc_BB2").show();
    }
    if(hwcfg&16){
        $(".bloc_RGB1").show();
        $(".bloc_Colorisation").show();
    }
    if(hwcfg&32){
        $(".bloc_RGB2").show();
        $(".bloc_Colorisation").show();
    }
}

//Création des switcher
function createSwitch(){
    let el1 = document.querySelector('.BB1-check');
    let el2 = document.querySelector('.BB2-check');
    let el3 = document.querySelector('.RGB1-check');
    let el4 = document.querySelector('.RGB2-check');

    let el5 = document.querySelector(".allLight-check");

    bb1_switch = new Switch(el1, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });
    bb2_switch = new Switch(el2, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });
    rgb1_switch = new Switch(el3, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });
    rgb2_switch = new Switch(el4, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });

    allLight_switch = new Switch(el5, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });
}

//récupérer les éléments sauvegardés
function getSavedMemoryLight(data){
    let mem0pack = getElementCarte(data, 'mem0');
	sauvegarde_eclairage = mem0pack.split(";");	// split 8 mem values
    console.log(sauvegarde_eclairage)
}

//Sauvegarde de la configuration d'éclairage
$(".bouton_sauvegarde_eclairage").click(function(){
    saveLightMemory();
});

//Requete sauvegarde de la configuration d'éclairage
function saveLightMemory(){

    IPAdress = localStorage.getItem("IP");

    console.log("rentré")
	let command = "http://"+ IPAdress +"/zns.cgi?cmd=u&p=8&v=1";
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data) {
		alert("Cette configuration d'éclairage sera utilisée pour les allumages automatique")
	}).fail(function() {
	});
}

$(".but-calme").click(function(){
    // tranquilité => rgb(0,107,255) - BB à 25 (10%)$
    applyClickAmbiance($(this))
    applicationAmbiance(0,107,255, 25)
});

$(".but-confort").click(function(){
    // confort => rgb(252, 196, 47) - BB à 50 (20%)
    applyClickAmbiance($(this))
    applicationAmbiance(255, 110, 0, 50)
});

$(".but-serenite").click(function(){
    // serenite => rgb(243, 222, 155) - BB à 76 (30%)
    applyClickAmbiance($(this))
    applicationAmbiance(243, 222, 155, 76) //123, 255, 72
});

$(".but-detente").click(function(){
    // detente => rgb(87, 210, 95) - BB à 102 (40%)
    applyClickAmbiance($(this))
    applicationAmbiance(190, 255, 155, 102)
});

$(".but-cockail").click(function(){
    // vibrante => rgb(208, 215, 221) - BB à 126 (50%)
    applyClickAmbiance($(this))
    applicationAmbiance(172, 215, 0, 0)
});

$(".but-concentration").click(function(){
    // concentration => rgb(200, 208, 217) - - BB à 190 (75%)
    applyClickAmbiance($(this))
    applicationAmbiance(140, 116, 249, 190)
});

$(".but-eveille").click(function(){
    // eveille => rgb(224, 229, 235) - - BB à 204 (80%)
    applyClickAmbiance($(this))
    applicationAmbiance(255, 255, 255,204)
});

$(".but-inspiration").click(function(){
    // inspiration => rgb(85, 11, 255) - BB à 76 (30%)
    applyClickAmbiance($(this))
    applicationAmbiance(85, 11, 255, 76)
});

$(".but-motivation").click(function(){
    // motivation => rgb(255, 62, 0) - BB à 126 (50%)
    applyClickAmbiance($(this))
    applicationAmbiance(255, 126, 0, 126)
});



function applicationAmbiance(R, G, B, BB){

    //application du RGB
    changeValueEclairage(16, 255);
    changeValueEclairage(32, 255);

    //application du BB
    changeValueEclairage(64, BB) // 1/6ème
    changeValueEclairage(128, BB) // 1/6ème

    //application du RGB
    changeValueEclairage(256, R);
    changeValueEclairage(512, G);
    changeValueEclairage(1024, B);

    //activation des bandeaux rgb
    changeValueEclairage(2048, 255);
}

function applyClickAmbiance(event){
    if(localStorage.getItem("modeSombre") == "true"){
        $(".amb").css("background","-webkit-gradient(linear, right top, left bottom, from(rgba(67, 79, 95, 0.7)), to(rgba(64, 68, 95, 0.7)))")
    }else{
        $(".amb").css("background","-webkit-gradient(linear, right top, left bottom, from(rgba(118, 146, 181, 0.7)), to(rgba(128, 144, 193, 0.7)))")
    }
    $(event).css("background","#52808B")
}