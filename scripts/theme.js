/* ========================== FOR SWITCHER ========================== */

$.switcher();

let themeSombreActif = 'false';


// ====== Couleurs thème clair ======
let test = "green"
let colorMain = "#52808B";

// let colorNavBarC = ["#7093AE","#868FC9"];
let colorBackgroundC = "white";
let colorH2C = "white";
let colorMenuBarC = "#7093AE";
let colorMenuTitle = "white";

// ====== Couleurs thème Sombre ======

// let colorNavBarS = ["#455B6C","#40445F"]; //#455B6C à #40445F
let colorBackgroundS = "#343D47"; //tester le #121212
let colorH2S = "#A1C3CB";
let colorMenuBarS = "#455B6C";

let colorEclairageTitreS = "#F9AD3C"; //#F9AD3C
let colorLamesTitleS = "#4795D5"; //#4795D5
let colorWifiTitreS = "#CC5D54"; //#CC5D54
let colorParametreTitleS = "#9AC865"; //#9AC865
let colorGuideTitreS = "#858FC8"; //#858FC8
let colorStationMeteoTitleS = "#85C8C4"; //#85C8C4

function themeClair(){
    $('.test').css({
        background: "-webkit-gradient(linear, right top, left bottom, from(rgba(118, 146, 181, 0.7)), to(rgba(128, 144, 193, 0.7)))" 
    });
    $("h2").css('color', colorH2C);
    $("html").css('background-color', colorBackgroundC);
    $("aside").css('background-color', colorMenuBarC);
    $(".bouton h3, .bubble").css('background-color', colorMain);
    //pas le slider, c'est du less
    $(".widget").css('color', "white");
}
function themeSombre(){
    $('.test').css({
        background: "-webkit-gradient(linear, right top, left bottom, from(rgba(67, 79, 95, 0.7)), to(rgba(64, 68, 95, 0.7)))" 
    });
    $("h2").css('color', colorH2S);
    $("html").css('background-color', colorBackgroundS);
    $("aside").css('background-color', colorMenuBarS);
    $(".bouton h3, .bubble").css('background-color', colorMain);
    //pas le slider, c'est du less
    $(".eclairage_widget").css('color', colorEclairageTitreS);
    $(".lames-orientable_widget").css('color', colorLamesTitleS);
    $(".wifi_widget").css('color', colorWifiTitreS);
    $(".parametres_widget").css('color', colorParametreTitleS);
    $(".guide_utilisation_widget").css('color', colorGuideTitreS);
    $(".station_meteo_widget").css('color', colorStationMeteoTitleS);

    $(".eclairage_widget").css('background-image', "url(resources/background/widgets/fond_eclairage_sombre.png)");
    $(".lames-orientable_widget").css('background-image', "url(resources/background/widgets/fond_lames_orientables_sombre.png)");
    $(".wifi_widget").css('background-image', "url(resources/background/widgets/fond_wifi_sombre.png)");
    $(".parametres_widget").css('background-image', "url(resources/background/widgets/fond_settings_sombre.png)");
    $(".guide_utilisation_widget").css('background-image', "url(resources/background/widgets/fond_guide_utilisation_sombre.png)");
    $(".station_meteo_widget").css('background-image', "url(resources/background/widgets/fond_station_meteo_sombre.png)");
}

refreshAffichage("not ok")

$('#switcher_theme').click(function(){
    console.log("t'as cliqué")
    refreshAffichage("ok");
});

function getThemeEnregistre(){
       return localStorage.getItem("modeSombre");
}

function enregistrer(){
     localStorage.setItem("modeSombre", themeSombreActif);

    
}

function refreshAffichage(stringue){
    let onofftheme = ($('.checkIci .ui-switcher').attr('aria-checked'))
    // let valeurCurseur = $('.checkIci .ui-switcher').attr('aria-checked');
    console.log("val curs au moment de refresh : " + $('.checkIci .ui-switcher').attr('aria-checked'))
    console.log("variable sauvegardée: " + themeSombreActif)
    //On récupère la valeur par défaut si le local storag est inexistant
    if(localStorage.getItem("modeSombre") == 'undefined'){
        console.log("a")
        localStorage.setItem("modeSombre",themeSombreActif)
        afficheTheme(getThemeEnregistre());
    }
   
    else if(onofftheme === undefined){
        console.log("b: curseur value -> " + onofftheme)
        afficheTheme(getThemeEnregistre());
        
    }
    // else if((onofftheme != undefined) && (onofftheme != getThemeEnregistre())){
    //     console.log("et oui y'a ce cas la aussi...")
    //     $('.checkIci .ui-switcher').attr('aria-checked', getThemeEnregistre())
    // }
    if(stringue === "ok"){
        console.log("sisisisisi");
        afficheTheme(onofftheme);
    }
    else{
        console.log("nope")
        afficheTheme(getThemeEnregistre());
        $('.checkIci .ui-switcher').attr('aria-checked', getThemeEnregistre())
    }
    
    console.log("=============================================")
}

function afficheTheme(themeSombreAc){
    themeSombreAc = themeSombreAc.toString();
    console.log(themeSombreAc + "- type: " + typeof themeSombreAc)

    if(themeSombreAc == 'true'){
        themeSombreActif = 'true';
        console.log("ahah!")
        themeSombre();
        enregistrer();
    }
    else if(themeSombreAc == 'false'){
        themeSombreActif = 'false';
        console.log("bbbbbhbhhhh!")
        themeClair();
        enregistrer();
    }
    else{
        console.log("oula t'as rien a foutre ici ")
    }
}

$(".coucou").click(function(){
    refreshAffichage("not ok");
});


// function sauvegardeDonnees(){
//     //Sur les autres pages que les paramètres
//     console.log("=======================================")
//     console.log( "valcurseur :" + ($('.checkIci .ui-switcher').attr('aria-checked')) +"localstorage :" +(localStorage.getItem("modeSombre")))
//     if( ($('.checkIci .ui-switcher').attr('aria-checked') == undefined) && (localStorage.getItem("modeSombre") == 'undefined')){
//         console.log("local storage undefined et curseur inexistant -> on lui fout la default")
//         localStorage.setItem("modeSombre", themeSombreActif);
//     }
//     else if(localStorage.getItem("modeSombre") == 'undefined'){
//         console.log("local storage undefined -> on lui fout la default")
//         localStorage.setItem("modeSombre", themeSombreActif);
//     }
//     //Sur la page de paramètre
//     else{
//         console.log("curseur existant -> on lui fout la valeur du courseur")
//         console.log( "valcurseur indefini:" + ($('.checkIci .ui-switcher').attr('aria-checked') == undefined) +"localstorage vide:" +(localStorage.getItem("modeSombre") == 'undefined'))
//         localStorage.setItem("modeSombre", $('.checkIci .ui-switcher').attr('aria-checked'));

//     }
// }

// //Récupère le thème enregistré
// function getThemeEnregistre(){
//        return localStorage.getItem("modeSombre");
// }

// //Met à jour le thème
// function refreshTheme(){
//     let valCurseur = $('.checkIci .ui-switcher').attr('aria-checked')
//      //dans le cas où le curseur est à true ou que le thème enregitré est sombre
//      if(valCurseur == 'true' || localStorage.getItem("modeSombre") == 'true'){
//         themeSombreActif = true;
//     console.log("val curseur: " + valCurseur + " (un des deux est à true) et val local:" + localStorage.getItem("modeSombre") )
//         console.log("refresh theme sombre activé");
//         themeSombre();
//     }else if(valCurseur == 'false' || localStorage.getItem("modeSombre") == 'false'){
//         themeSombreActif = false;
//         console.log("val curseur: " + valCurseur + "(un des deux est à false) et val local:" + localStorage.getItem("modeSombre") )
//         console.log("refresh theme clair activé");
//         themeClair();
//     }else{
//         console.log("on est dans les autres cas")
//     }
//     sauvegardeDonnees()
    
// }

// $(document).ready(function(){
//     refreshTheme();

//     // En cas de clic
//     $('#switcher_theme').click(function() {
//         console.log("t'as cliqué")
//         refreshTheme();
//     });
// });

// $(".coucou").click(function(){
//     refreshTheme();
// });