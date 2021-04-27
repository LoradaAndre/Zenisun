/* ========================== FOR SWITCHER ========================== */
$.switcher();
let themeSombreActif = 'false';


// ====== Couleurs thème clair ======
let test = "green"
let colorMain = "#52808B";

let colorNavBarC = ["#7093AE","#868FC9"];
let colorCategorieNavBarC = "#50627B"

let colorBackgroundC = "white";
let colorH2C = "white";
let colorMenuBarC = "#7093AE";
let colorMenuTitle = "white";

// ====== Couleurs thème Sombre ======

let colorNavBarS = ["#455B6C","#40445F"]; //#455B6C à #40445F
let colorCategorieNavBarS = "#2E363F"

let colorBackgroundS = "#343D47"; //tester le #121212
let colorH2S = "#A1C3CB";
let colorMenuBarS = "#455B6C";

let colorEclairageTitreS = "#F9AD3C"; //#F9AD3C
let colorLamesTitleS = "#4795D5"; //#4795D5
let colorWifiTitreS = "#CC5D54"; //#CC5D54
let colorParametreTitleS = "#9AC865"; //#9AC865
let colorGuideTitreS = "#858FC8"; //#858FC8
let colorStationMeteoTitleS = "#85C8C4"; //#85C8C4


$(document).ready(function(){
    refreshAffichage("not ok")
});

function themeClair(){
    $('canvas').attr("id", "clair");
    $('.navigation_bar').css({
        background: "-webkit-gradient(linear, right top, left bottom, from("+ colorNavBarC[0] +"), to("+ colorNavBarC[1] +"))" 
    });
    $(".icon_true").css('background-color', colorCategorieNavBarC);
    $('.test').css({
        background: "-webkit-gradient(linear, right top, left bottom, from(rgba(118, 146, 181, 0.7)), to(rgba(128, 144, 193, 0.7)))" 
    });
    $("h2").css('color', colorH2C);
    $("html").css('background-color', colorBackgroundC);
    $("body").attr('style', 'background-color: ' + colorBackgroundC + " !important");
    $("aside").css('background-color', colorMenuBarC);
    $(".bouton h3, .bubble").css('background-color', colorMain);
    //pas le slider, c'est du less
    $(".widget").css('color', "white");
}
function themeSombre(){
    $('canvas').attr("id", "sombre");
    $('.navigation_bar').css({
        background: "-webkit-gradient(linear, right top, left bottom, from("+ colorNavBarS[0] +"), to("+ colorNavBarS[1] +"))" 
    });
    $(".icon_true").css('background-color', colorCategorieNavBarS);
    $('.test').css({
        background: "-webkit-gradient(linear, right top, left bottom, from(rgba(67, 79, 95, 0.7)), to(rgba(64, 68, 95, 0.7)))" 
    });
    $("h2").css('color', colorH2S);
    $("html").css('background-color', colorBackgroundS);
    $("body").attr('style', 'background-color: ' + colorBackgroundS + " !important");
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

   
    $(".wifi_widget img").attr('src', "resources/icons/widgets_dark/wifiSombre.png");
    $(".parametres_widget img").attr('src', "resources/icons/widgets_dark/settingsSombre.png");
    $(".guide_utilisation_widget img").attr('src', "resources/icons/widgets_dark/bookSombre.png");
    $(".station_meteo_widget img").attr('src', "resources/icons/widgets_dark");
}

$('#switcher_theme').click(function(){
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
   
    //On récupère la valeur par défaut si le local storag est inexistant
    if(localStorage.getItem("modeSombre") == null){
        localStorage.setItem("modeSombre",themeSombreActif)
        console.log("et la si défini: " + localStorage.getItem("modeSombre"))
        afficheTheme(getThemeEnregistre());
    }
   
    else if(onofftheme === undefined){
        afficheTheme(getThemeEnregistre());
        
    }
    if(stringue === "ok"){
        afficheTheme(onofftheme);
    }
    else{
        afficheTheme(getThemeEnregistre());
        $('.checkIci .ui-switcher').attr('aria-checked', getThemeEnregistre())
    }
}

function afficheTheme(themeSombreAc){
    themeSombreAc = themeSombreAc.toString();

    if(themeSombreAc == 'true'){
        themeSombreActif = 'true';
        themeSombre();
        enregistrer();
    }
    else if(themeSombreAc == 'false'){
        themeSombreActif = 'false';
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