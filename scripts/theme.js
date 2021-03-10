let themeSombreActif = false;

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
    $(".widget").css('color', colorMenuTitle);
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

// Par défaut
if(themeSombreActif){
    themeSombre();
}else{
    themeClair();
}

// En cas de clic
$('#switcher_theme').click(function() {
    if($("#switcher_theme").is(':checked')){
        themeSombreActif = true;
        themeSombre();
    }else{
        themeSombreActif = false;
        themeClair();
    }
});

