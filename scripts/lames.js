let config = 1;

let valueMotor0;
let valueMotor1;

let valueMaxMotor0;
let valueMaxMotor1;

let synchro = false;

let init = false;

let monitoring_user_config;

$(document).ready(function (){
    
    updateAllInput();
    lectureCarte();

    $("body").click(function(){
        if((monitoring_user_config & 8) && $("#exampleModalCenter").css("display") == "none"){
            console.log("yep c'est 8");
            var myModal = new bootstrap.Modal(document.getElementById("exampleModalCenter"), {});
          
            myModal.show();
        }
    })

    setInterval(function(){ 
        lectureCarte();
        initButtons()
        updateOutputRange();
        
        synchronisationLames();
        sauvegardeSync()
    }, 1000);

    

});

function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data) {
            isConnected(true, data)
            valueMotor0 = parseInt(getMotorValue(data, 24));
            valueMaxMotor0 = parseInt(getMotorMaxValue(data, 24));
            valueMotor1 = parseInt(getMotorValue(data, 25));
            valueMaxMotor1 = parseInt(getMotorMaxValue(data, 25));
      }).fail(function() {
            isConnected(false, data)
        //   alert("Lecture de la carte échouée")
      });	

      my_current_automatum_cmd = "&ID=0";
      $.ajax({
          url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
          context: document.body
        }).done(function(data){
            isConnected(true, data)
          //   console.log(data)
              monitoring_user_config = parseInt(data.all[30].textContent);
        }).fail(function() {
            isConnected(false, data)
          //   alert("Lecture de la carte échouée")  
      });	
  
}

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

function sauvegardeSync(){
    if(localStorage.getItem("modeSombre") == null){
        localStorage.setItem("modeSombre", "false");
        synchro = false;
    }else{
        $(".synchro-check .ui-switcher").attr("aria-checked", localStorage.getItem("syncLames"))
        synchro = stringToBool(localStorage.getItem("syncLames"));
    }
    $(".synchro-check .ui-switcher").click(function(){
        let value = $(this).attr("aria-checked");
        localStorage.setItem("syncLames", value);
        synchro = stringToBool(localStorage.getItem("syncLames"));
    });
    console.log(synchro)
}
function updateAllInput(){
    updateInput(".wrap-lames-1", 1);
    updateInput(".wrap-lames-2", 2);
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

function updateInput(classWrap, motor){
    let rangeWrap = document.querySelector(classWrap + " .range");

    $(rangeWrap).change(function(){

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
    });
}

//Récupère et converti la valeur du moteur en pourcentage
function getMotorValue(data, input){
    let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
    return newVal[0]*100/newVal[1]
}

//Récupère la valeur maximale du moteur
function getMotorMaxValue(data, input){
    let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
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
    $(".synchro-check .ui-switcher").click(function(){
        if($(this).attr("aria-checked") == "false"){
            synchro = false;
        }else{
            synchro = true;
        }
    });
}

//Applique le pourcentage des boutons
$("h3").click(function(){
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
    $.ajax({
        url: '../cgi/zns.cgi?cmd=m&m=' + moteur + '&p=' + valeur,
        context: document.body
      }).done(function(data) {
            isConnected(true, data)
            alert('done')
      }).fail(function() {
            isConnected(false, data)
            alert("Déplacement de la lame échoué")
      });
}