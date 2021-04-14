let variab = 0;

let vin = [0,0]

let boardTemp;
let MosTemp;

let gpi = [0,0,0,0,0]
let gpO = [0,0,0,0,0,0,0,0]
let gpPWM = [0,0,0,0,0,0,0,0]

let gpColor = [0,0,0]
let gpColorPWM = [0,0,0]

let mot = [0,0]
let maxMot = [0,0]

let sunElev;
let sunAsimut;
let sunShader;

let pergOrient;
let pergLong;
let pergLat;

//Lecture de la carte, récupération des infos pour les paramètres
function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data){

            vin[0] = parseInt(data.all[22].textContent)/1000 //VDC1
            vin[1] = parseInt(data.all[23].textContent)/1000 //VDC2

            boardTemp = parseInt(data.all[21].textContent)/10 //Temp
            MosTemp = parseInt(data.all[31].textContent)/10 //tmos

            for(let i = 0; i < 6; i++){
                //GPI
                gpi[i] = parseInt(data.all[(i+2)].textContent)/1000
            }
            
            for(let i = 0; i < 8; i++){
                //GPO
                gpO[i] = parseInt(getValue(data,(i+8),1))/1000
                //GPPWM
                gpPWM[i] = parseInt(getValue(data,(i+8),0))
            }
            
            for(let i = 0; i < 4; i++){
                //RGB
                gpColor[i] = parseInt(getValue(data,(i+16),0))
                //RGBPWM
                gpColorPWM[i] = parseInt(getValue(data,(i+16),1))
            }

            for(let i = 0; i < 2; i++){
                //mot
                mot[i] = parseInt(getValue(data,(i+24),0))
                //maxMot
                maxMot[i] = parseInt(getValue(data,(i+24),1))
            }

            sunElev = parseInt(data.all[27].textContent) //s_elev
            sunAsimut = parseInt(data.all[28].textContent) //s_azi
            sunShader = parseInt(data.all[29].textContent) //s_prj


      }).fail(function() {
			//   alert("Lecture de la carte échouée")  
    });	

	$.ajax({
        url: '../cgi/zns.cgi?cmd=c'+my_current_automatum_cmd,
        context: document.body
      }).done(function(data){

            pergOrient = parseInt(data.all[4].textContent) //orient
            pergLong = parseInt(data.all[6].textContent)/100 //lon
            pergLat = parseInt(data.all[7].textContent)/100 //lat
			
      }).fail(function() {
        //   alert("Lecture de la carte échouée")  
    });
}

function getValue(data, input, pos){
    let valMotor = data.all[input].textContent
    valMotor = valMotor.split(";")
    return valMotor[pos]
}


function affichageInfos(){
    $("ul").remove()
    let liste = $("<ul></ul>")
    let bloc1 = $("<div></div>")
    let bloc2 = $("<div></div>")
    let bloc3 = $("<div></div>")
    let bloc4 = $("<div></div>")
    $(".debug").append(liste)
    $(liste).append(bloc1)
    $(liste).append(bloc2)
    $(liste).append(bloc3)
    $(liste).append(bloc4)

    $(bloc1).append("<h4>General</h4>")
    $(bloc1).append("<hr>")
    $(bloc1).append("<li>VIN #1= <span>" + vin[0] + " V</span></li>")
    $(bloc1).append("<li>VIN #2= <span>" + vin[1] + " V</span></li>")
    $(bloc1).append("<hr>")
    $(bloc1).append("<li>Board temp= <span>" + boardTemp + "°C</span></li>")
    $(bloc1).append("<li>MOS temp= <span>" + MosTemp + "°C</span></li>")
    
    $(bloc2).append("<h4>GPI</h4>")
    $(bloc2).append("<hr>")
    for(let i = 0; i < 6; i++){
        $(bloc2).append("<li>GPI #"+ i +"= <span>" + gpi[i] + " V</span></li>")
    }
    $(bloc3).append("<h4>GPO</h4>")
    $(bloc3).append("<hr>")
    for(let i = 0; i < 8; i++){
        $(bloc3).append("<li>GPO #" + i + "= <span>" + gpO[i] + " A / PWM= <span>"+ gpPWM[i] +"</span></li>")
    }
    $(bloc3).append("<hr>")
    $(bloc3).append("<li>GPO #R = PWM= <span>" + gpColor[0] +"</span></li>")
    $(bloc3).append("<li>GPO #G = PWM= <span>" + gpColor[1] + "</span></li>")
    $(bloc3).append("<li>GPO #B = PWM= <span>" + gpColor[2] +"</span></li>")

    $(bloc4).append("<h4>Other</h4>")
    $(bloc4).append("<hr>")
    for(let i = 0; i < 2; i++){
        $(bloc4).append("<li>Moteur #" + i + "= <span>" + mot[i] + "</span> / <span>" + maxMot[i] + " count</span></li>")
    }

    $(bloc4).append("<hr>")
    $(bloc4).append("<li>Pergola orientation = <span>" + pergOrient + "°</span></li>")
    $(bloc4).append("<li>Pergola longitude= <span>" + pergLong + "</span></li>")
    $(bloc4).append("<li>Pergola latitude= <span>" + pergLat + "</span></li>")
    $(bloc4).append("<hr>")
    $(bloc4).append("<li>Sun elevation= <span>" + sunElev + "°</span></li>")
    $(bloc4).append("<li>Sun azimut= <span>" + sunAsimut + "°</span></li>")
    $(bloc4).append("<li>Sun projection on shaders= <span>" + sunShader + "°</span></li>")

    $("span").css("color","white")
    $("h4").css({
        "font-size": "medium",
        "padding-left" : "1rem",
        "width" : "80%",
        "text-align" : "center"
    });
    $("li").css("padding-left","0")
    $("ul").css("padding-left","0")
    $(".debug").css({
        "padding" : "20px"
    });

}


$(document).ready(function(){
    //Actualisation des informations, refresh
    setInterval(function(){ 
        lectureCarte()
        affichageInfos()
    }, 1000);
   
});

