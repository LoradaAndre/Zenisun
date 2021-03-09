// ====== Couleurs thème clair ======

let test = "green"
let colorMain = "#52808B";

// let colorNavBarC = ["#7093AE","#868FC9"];
let colorBackgroudC = "white";
let colorH2C = "white";
let colorMenuBarC = "#7093AE";
let colorMenuTitle = "white";

// ====== Couleurs thème Sombre ======

// let colorNavBarS = ["#455B6C","#40445F"]; //#455B6C à #40445F
let colorBackgroudS = "#343D47"; //tester le #121212
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
        background: "-webkit-gradient(linear, left top, left bottom, from(rgba(118, 146, 181, 0.7)), to(rgba(128, 144, 193, 0.7)))" 
    });
    $("h2").css('color', colorH2C);
    $("html").css('background-color', colorBackgroudC);
    $("aside").css('background-color', colorMenuBarC);
    $(".bouton h3, .bubble").css('background-color', colorMain);
    //pas le slider, c'est du less
    $(".nom_widget").css('color', colorMenuTitle);
}
function themeClair(){
    $('.test').css({
        background: "-webkit-gradient(linear, left top, left bottom, from(rgba(118, 146, 181, 0.7)), to(rgba(128, 144, 193, 0.7)))" 
    });
    $("h2").css('color', colorH2C);
    $("html").css('background-color', colorBackgroudC);
    $("aside").css('background-color', colorMenuBarC);
    $(".bouton h3, .bubble").css('background-color', colorMain);
    //pas le slider, c'est du less
    $(".nom_widget").css('color', colorMenuTitle);
}
themeSombre();