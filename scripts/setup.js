let GPI = [0,0,0,0,0,0]
let GPO = [0,0,0,0,0,0,0,0]
let mot0 = []
let mot1 = []
let waitCheck = false;

$(document).ready(function(){
    $(".checkDiv").hide()
    $(".info-check").show()
    $(".middle").css("visibility","hidden")
    $(".validate_spe").css("visibility","hidden")
    afficheUn(".para1")

    setInterval(function(){ 
        lectureC();
        
    }, 1000);
})

//====================== clics ======================

$(".mod").click(function(){
    //Si le bouton inscrit "Modifier"
    if($(this).text() == "Modifier"){
        //Montre la partie du milieu
        $(this).parent().children(".middle").css("visibility","visible")
        //Change le bouton "modifier" en "annuler"
        $(this).text("Annuler")
        //Récupération de la valeur affichée 
        let val = parseInt($(this).parent().children(".desc").text())
        //Insertion ce cette valeur dans l'input
        $(this).parent().children(".middle").children(".form-control").val(val)
    
        waitCheck = true;

        $(".checkDiv").show()
        $(".info-check").hide()
        $(".validate_spe").css("visibility","visible")
    }
    //Si le bouton inscrit "Annuler"
    else{
        $(this).text("Modifier")
        $(this).parent().children(".middle").css("visibility","hidden")
    
        waitCheck = false;

        $(".checkDiv").hide()
        $(".info-check").show()
    }
    
});
$(".validate_spe").click(function(){
    $(".checkDiv").hide()
    $(".info-check").show()
    $(this).css("visibility","hidden")

    //Change le bouton "annuler" en "modifier"
    $(this).parent().children(".mod").text("Modifier")

});

$(".validate").click(function(){
    if($(this).parent().hasClass("middle")){
        //Cache la partie du milieu à l'utilisateur
        $(this).parent().css("visibility","hidden")
    }
    
    //Change le bouton "annuler" en "modifier"
    $(this).parent().parent().children(".mod").text("Modifier");
    //Récupération de la valeur mise dans l'input

    let valueToInsert = $(this).parent().children("input").val()
    let idToInsert = $(this).parent().children("input").attr("id")
    let categorie = $(this).parent().parent().parent()

    console.log(valueToInsert)
    //Application de la config
    applyConfig(categorie, valueToInsert, idToInsert)

    waitCheck = false;

});

$(".elem1").click(function(){
    afficheUn(".para1")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem2").click(function(){
    afficheUn(".para2")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem3").click(function(){
    afficheUn(".para3")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem4").click(function(){
    afficheUn(".para4")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem5").click(function(){
    afficheUn(".para5")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem6").click(function(){
    afficheUn(".para6")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem7").click(function(){
    afficheUn(".para7")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem8").click(function(){
    afficheUn(".para8")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem9").click(function(){
    afficheUn(".para9")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem10").click(function(){
    afficheUn(".para10")
    $(this).css("background-color","rgb(82, 128, 139)")
})
$(".elem-spe").click(function(){
    afficheUn(".debug")
    $(this).css("background-color","rgb(82, 128, 139)")
})

function afficheUn(celuiAAfficher){
    $(".left-content").children().hide()
    $(".right-content").children().css("background-color","rgb(56, 56, 56)")
    $(celuiAAfficher).show()
}


//Lecture de la carte, récupération des infos pour les paramètres
function lectureC(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data){
			// console.log(data.all)

             //=================== GPI ===================
             for(let i = 0; i < 6; i++){
                GPI[i] = parseInt(data.all[i+2].textContent);
                $(".GPI" + i).text(GPI[i])
            }

            //=================== GPO ===================
            for(let i = 0; i < 8; i++){
                GPO[i] = parseInt(data.all[i+8].textContent)
                $(".GPO" + i).text(GPO[i])
            }
            
            //=================== General calibration  ===================

            vin[0] = parseInt(data.all[22].textContent)//VDC1
            $(".vin1").text(vin[0] + " mV")

            vin[1] = parseInt(data.all[23].textContent) //VDC2
            $(".vin2").text(vin[1] + " mV")

            let boardTemp = parseInt(data.all[21].textContent) //Temp
            $(".tmp").text(boardTemp + " ("+ (boardTemp/10) + "°C)")

      }).fail(function() {
			  alert("Lecture de la carte échouée")  
    });	

	$.ajax({
        url: '../cgi/zns.cgi?cmd=c'+my_current_automatum_cmd,
        context: document.body
      }).done(function(data){
			// console.log(data.all)

            //=================== Board setting ===================
            let board_version = parseInt(data.all[8].textContent); //board
            $(".board_version").text(board_version)
            
            let board_rds = parseInt(data.all[9].textContent); //rds
            $(".MOS_LED_rds").text(board_rds + " mOhms")

            let board_rth = parseInt(data.all[10].textContent); //rth
            $(".MOS_LED_Rth").text(board_rth + " DegC/W")

            let board_mot_fs = parseInt(data.all[11].textContent); //mot_fs
            $(".MOS_motor_FS").text(board_mot_fs + " mAmps")

            let board_led_fs = parseInt(data.all[12].textContent); //led_fs
            $(".MOS_LEDs_FS").text(board_led_fs + " mAmps")

            

            //=================== Motor 0 calib ===================
            let valMot0 = data.all[2].textContent;
            mot0 = valMot0.split(";")

            $(".PID_Kp0").text(mot0[0]);
            $(".PID_Ki0").text(mot0[1]);
            $(".PID_Kt0").text(mot0[2]);
            $(".motor_max_count0").text(mot0[3]);
            $(".motor_max_angle0").text(mot0[5]);
            $(".max_current_mAmps0").text(mot0[4]);
            $(".home_current_mAmps0").text(mot0[6]);
            $(".home_current_offset0").text(mot0[9]);
            $(".home_switch_offset0").text(mot0[10]);
            $(".zero_degree_offset0").text(mot0[11]);
            $(".speed_homing0").text(mot0[7]);
            $(".speed_normal0").text(mot0[8]);
            $(".max_delta_setpoint_homing0").text(mot0[12]);
            $(".max_delta_setpoint_normal0").text(mot0[13]);

            //=================== Motor 1 calib ===================
            let valMot1 = data.all[3].textContent;
            mot1 = valMot1.split(";")

            $(".PID_Kp1").text(mot1[0]);
            $(".PID_Ki1").text(mot1[1]);
            $(".PID_Kt1").text(mot1[2]);
            $(".motor_max_count1").text(mot1[3]);
            $(".motor_max_angle1").text(mot1[5]);
            $(".max_current_mAmps1").text(mot1[4]);
            $(".home_current_mAmps1").text(mot1[6]);
            $(".home_current_offset1").text(mot1[9]);
            $(".home_switch_offset1").text(mot1[10]);
            $(".zero_degree_offset1").text(mot1[11]);
            $(".speed_homing1").text(mot1[7]);
            $(".speed_normal1").text(mot1[8]);
            $(".max_delta_setpoint_homing1").text(mot1[12]);
            $(".max_delta_setpoint_normal1").text(mot1[13]);

            //=================== Miscellaneous ===================
            //pergola_drying
            let pergola_drying = parseInt(data.all[5].textContent); //drying
            $(".shader_drying").text(pergola_drying);

            if(waitCheck == false){
                let hwcfg = parseInt(data.all[17].textContent);
                affichageCheck(hwcfg)
            }
        
      }).fail(function() {
          alert("Lecture de la carte échouée")  
    });
}

//=================== Configuration (checkbox) ===================

$(".validate_spe").click(function(){
    let mask = 0;
    
    if($("#checkMot1").is(":checked")){
        console.log("le mot1 est checké")
        mask |= 1
    }
    if($("#checkBlanc1").is(":checked")){
        console.log("le blanc1 est checké")
        mask |= 4
    }
    if($("#checkRGB1").is(":checked")){
        console.log("le rgb1 est checké")
        mask |= 16
    }
    if($("#checkMot2").is(":checked")){
        console.log("le mot2 est checké")
        mask |= 2
    }
    if($("#checkBlanc2").is(":checked")){
        console.log("le blanc2 est checké")
        mask |= 8
    }
    if($("#checkRGB2").is(":checked")){
        console.log("le RGB2 est checké")
        mask |= 32
    }

    $.ajax({
        url: '../cgi/zns.cgi?cmd=f&p=49&v=' + mask,	
        context: document.body
      }).done(function(){
          alert("envoie du changement de config reussi")
      }).fail( function(){
        alert("envoie du changement de config échoué")
      });

});

function affichageCheck(hwcfg){
    let listeDispo = $(".info-check")
    $(listeDispo).empty();

    $("#checkMot1").prop("checked", hwcfg&1)
    $("#checkMot2").prop("checked", hwcfg&2)
    $("#checkBlanc1").prop("checked", hwcfg&4)
    $("#checkBlanc2").prop("checked", hwcfg&8)
    $("#checkRGB1").prop("checked", hwcfg&16)
    $("#checkRGB2").prop("checked", hwcfg&32)

    if(hwcfg&1){
        $(listeDispo).append($("<h3>Moteur 1</h3>"))
    }
    if(hwcfg&2){
        $(listeDispo).append($("<h3>Moteur 2</h3>"))
    }
    if(hwcfg&4){
        $(listeDispo).append($("<h3>Blanc 1</h3>"))
    }
    if(hwcfg&8){
        $(listeDispo).append($("<h3>Blanc 2</h3>"))
    }
    if(hwcfg&16){
        $(listeDispo).append($("<h3>RGB 1</h3>"))
    }
    if(hwcfg&32){
        $(listeDispo).append($("<h3>RGB 2</h3>"))
    }
}
// ========================= Manufacturer settings =========================

$(".save").click(function(){
    save_manuf_config();
});

function save_manuf_config(){
	var password = prompt("Please enter password", "xxxx");
	var command = '../cgi/zns.cgi?cmd=f&p=1234&v=' + password;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data) {
		alert("sauvegarde effectuée")
	}).error(function(){
		alert("sauvegarde échouée")
	});
}

$(".charge").click(function(){
    reset_manuf_config();
});

function reset_manuf_config(){
	var command = '../cgi/zns.cgi?cmd=f&p=1235&v=7913'+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(data) {
		alert("reset effectué")
		startup_setup();
	}).error(function(){
		alert("reset échoué")
	});
}

// ========================= Application =========================

function applyConfig(categorie, valueToInsert, idToInsert){
    if(categorie.hasClass("para1")){
        apply_board_config(valueToInsert, idToInsert)
    }else{
        console.log("nope c'est aps board")
        apply_manuf_config(valueToInsert, idToInsert)
    }
}

// send a board  setting to pergola : note setting is not automatically saved, call save_board_config() to do that
function apply_board_config(valueToInsert, idToInsert){

    var command = '../cgi/zns.cgi?cmd=b&p=' + idToInsert + '&v=' + valueToInsert + my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done(function(){
        alert("insérer " + valueToInsert + " de l'ID: " + idToInsert + "(dans board)")
    }).fail(function(){
        alert("fail de l'envoi du board")
    });
}
    

// send a manufacturer setting to pergola : note setting is not automatically saved, call save_manuf_config() to do that
function apply_manuf_config(valueToInsert, idToInsert){

    if(idToInsert == '0'){
        valueToInsert = parseInt(valueToInsert) + 500;	// automatically add the 50°C offset to user entry
    }
        
//	alert ('set parameter ' + suffix_id + ' to ' + cal_val );
    var command = '../cgi/zns.cgi?cmd=f&p=' + idToInsert + '&v=' + valueToInsert + my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done(function(){
        alert("insérer " + valueToInsert + " de l'ID: " + idToInsert + "(pas board)")
    }).fail(function(){
        alert("fail de l'envoi du board")
    });
}