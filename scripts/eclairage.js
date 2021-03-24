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

let config = 1;

//Lecture de la carte, récupération des infos pour l'éclairage
function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data) {
            //RGB1
            RGBIntensite1 = getIntensite(data, 12); //12: <GPO 4> dans la collection data.all
            RGBWatt1 = getWatt(data, 12);
            //RGB2
            RGBIntensite2 = getIntensite(data, 13); //13: <GPO 5>
            RGBWatt2 = getWatt(data, 13);
            //BB1
            bb1Intensite = getIntensite(data, 14); //14: <GPO 6>
            bb1Watt = getWatt(data, 14);
            //BB2
            bb2Intensite = getIntensite(data, 15); //15: <GPO 7>
            bb2Watt = getWatt(data, 15);
            //RGB color
            RColor = getColor(data, 16); //16: <GPO 8>
            GColor = getColor(data, 17); //17: <GPO 9>
            BColor = getColor(data, 18); //18: <GPO 10>
            console.log("("+RColor+","+GColor+","+BColor+")")
      }).fail(function() {
        //   alert("Lecture de la carte échouée")
          
      });	
}

function changeValueWithRange(classRange, input){
    let range = document.querySelector(classRange + " .range");
    $(range).change(function(){
        let val;
        if(classRange == ".R" || classRange == ".G" || classRange == ".B"){
            val = range.value;
        }
        else{
            //transformer la valeur en pourcentage, en intensité/couleur (0 à 255)
            val = parseInt(range.value*255/100);
        }
        console.log("mettre la val: " + val + " à: " + classRange + "=> porte " + input)
        changerIntensite(input, val);
    });
}

function updateInputRange(){
    changeValueWithRange(".wrap-RGB-1", 16);
    changeValueWithRange(".wrap-RGB-2", 32);
    changeValueWithRange(".wrap-BB-1", 64);
    changeValueWithRange(".wrap-BB-2", 128);
    changeValueWithRange(".R", 256);
    changeValueWithRange(".G", 512);
    changeValueWithRange(".B", 1024);
}

function updateOutputRange(){
    refreshBarre(".wrap-RGB-1", RGBIntensite1);
    refreshBarre(".wrap-RGB-2", RGBIntensite2);
    refreshBarre(".wrap-BB-1", bb1Intensite);
    refreshBarre(".wrap-BB-2", bb2Intensite);
    refreshBarre(".R", RColor);
    refreshBarre(".G", GColor);
    refreshBarre(".B", BColor);
}

let zone = document.querySelector(".wrap-BB-1 .range");

$(document).ready(function() {
    lectureCarte();
    updateInputRange();
    //Actualisation des informations, refresh
    setInterval(function(){ 
        lectureCarte();
        updateOutputRange();
    }, 1000);

    // $('#zoneColor').farbtastic('#color');

    $('#zoneColor').farbtastic(function(color){
        changeColor(color);
        updateOutputRange()
        console.log(this)
        // $('#zoneColor').mouseup(function(){
        //     changeColor(color)
        //     console.log("relaché")
        // });
    });
});

//Récupère et converti l'intensité (0 à 255) en pourcentage
function getIntensite(data, input){
    let ledIntensite = data.all[input].textContent
    let newVal = ledIntensite.split(";")
    return parseInt(newVal[0]*100/255);
}

//Récupère et converti la puissance (en mA) en Watt
function getWatt(data, input){
    let ledIntensite = data.all[input].textContent
    let newVal = ledIntensite.split(";")
    return parseFirstDecimal(newVal[1]*24/1000);
}

//Récupère la couleur
function getColor(data, input){
    let ledColor = data.all[input].textContent
    let newVal = ledColor.split(";")
    return newVal[0];
}

//Troncature d'une décimale aux dixièmes
function parseFirstDecimal(number){
    return Math.round(number * 10)/10
}

//Actualisation des barres selon les données de la carte
function refreshBarre(classRange, input){

        let range = document.querySelector(classRange)
        let bubble = range.querySelector(".bubble");
        let contenuVal = range.querySelector(".value-range-wrap");

        setOffsetBubble(bubble, contenuVal, input);
}

//Requète qui change l'intensité d'un ruban
function changerIntensite(ruban, valeur){ 
    $.ajax({
        url: '../cgi/zns.cgi?cmd=l&o='+ ruban +'&p=' + valeur,
        context: document.body
      }).done(function(data) {
        //  alert('done')
      }).fail(function() {
          alert("changement d'intensité échoué")
      });
}

function changeColor(color){
    console.log(color)
    let hexR = color.substring(1,3);
    let hexG = color.substring(3,5);
    let hexB = color.substring(5,7);

    
    console.log("==============================")
    console.log(hexR +" => "+ parseInt(hexR,16))
    console.log(hexG +" => "+ parseInt(hexG,16))
    console.log(hexB +" => "+ parseInt(hexB,16))
    changerIntensite(256, parseInt(hexR,16))
    changerIntensite(512, parseInt(hexG,16))
    changerIntensite(1024, parseInt(hexB,16))
    console.log("envoyé: (" + hexR + "," + hexG + "," + hexB + ")");
    // console.log("test:" + hexR + " =>" + parseInt(hexR,16))
}