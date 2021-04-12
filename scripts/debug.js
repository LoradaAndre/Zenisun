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
			console.log(data.all)

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
          console.log(data.all)

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
    $("body").append(liste)
    
    $(liste).append("<li>VIN #1 = " + vin[0] + " V</li>")
    $(liste).append("<li>VIN #2 = " + vin[1] + " V</li>")
    $(liste).append("<li>Board temp = " + boardTemp + "°C</li>")
    $(liste).append("<li>MOS temp = " + MosTemp + "°C</li>")
    $(liste).append("<hr>")
    for(let i = 0; i < 6; i++){
        $(liste).append("<li>GPI #"+ i +" = " + gpi[i] + " V</li>")
    }
    $(liste).append("<hr>")
    for(let i = 0; i < 8; i++){
        $(liste).append("<li>GPO #" + i + " = " + gpO[i] + " A / PWM = "+ gpPWM[i] +"</li>")
    }
    
    $(liste).append("<li>GPO #R = PWM = " + gpColor[0] +"</li>")
    $(liste).append("<li>GPO #G = PWM = " + gpColor[1] + "</li>")
    $(liste).append("<li>GPO #B = PWM = " + gpColor[2] +"</li>")

    $(liste).append("<hr>")
    for(let i = 0; i < 2; i++){
        $(liste).append("<li>Moteur #" + i + " = " + mot[i] + " / " + maxMot[i] + " count</li>")
    }

    $(liste).append("<hr>")
    $(liste).append("<li>Pergola orientation = " + pergOrient + "°</li>")
    $(liste).append("<li>Pergola location: longitude = " + pergLong + " / latitude = " + pergLat + "</li>")
    $(liste).append("<hr>")
    $(liste).append("<li>Sun elevation = " + sunElev + "°</li>")
    $(liste).append("<li>Sun azimut = " + sunAsimut + "°</li>")
    $(liste).append("<li>Sun projection on shaders = " + sunShader + "°</li>")

}


$(document).ready(function(){
    //Actualisation des informations, refresh
    setInterval(function(){ 
        lectureCarte()
        affichageInfos()
    }, 1000);
   
});