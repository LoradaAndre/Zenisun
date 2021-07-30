/* ========================== FOR SWITCHER ========================== */
// $.switcher();
let theme_switch;
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
let colorConnexionTitleS = "#13A4F5" //#13A4F5


$(document).ready(function(){
    createSwitchTheme()
    refreshAffichage("not ok")

    //mettre le thème à jour au changement du switcher
    $('.line-check-theme .switch').click(function(){ 
        console.log("oui j'ai cliqué sur celui de thème")
        refreshAffichage("ok");
    });
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

    $('.ambiance h3').css({
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
    $('.ambiance h3').css({
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
    $(".connexion_widget").css('color', colorConnexionTitleS);

    $(".eclairage_widget").css('background-image', "url(resources/background/widgets/fond_eclairage_sombre.jpg)");
    $(".lames-orientable_widget").css('background-image', "url(resources/background/widgets/fond_lames_orientables_sombre.jpg)");
    $(".wifi_widget").css('background-image', "url(resources/background/widgets/fond_wifi_sombre.jpg)");
    $(".parametres_widget").css('background-image', "url(resources/background/widgets/fond_settings_sombre.jpg)");
    $(".guide_utilisation_widget").css('background-image', "url(resources/background/widgets/fond_guide_utilisation_sombre.jpg)");
    $(".station_meteo_widget").css('background-image', "url(resources/background/widgets/fond_station_meteo_sombre.jpg)");
    $(".connexion_widget").css('background-image', "url(resources/background/widgets/fond_connexion_sombre.jpg)");

   
    $(".wifi_widget img").attr('src', "resources/icons/widgets_dark/wifiSombre.png");
    $(".parametres_widget img").attr('src', "resources/icons/widgets_dark/settingsSombre.png");
    $(".guide_utilisation_widget img").attr('src', "resources/icons/widgets_dark/bookSombre.png");
    $(".station_meteo_widget img").attr('src', "resources/icons/widgets_dark");
    $(".connexion_widget img").attr('src', "resources/icons/widgets_dark/connexionSombre.png");
}

function getThemeEnregistre(){
       return localStorage.getItem("modeSombre");
}

function enregistrer(){
     localStorage.setItem("modeSombre", themeSombreActif);

    
}

function refreshAffichage(value){
    let onofftheme = ($('.line-check-theme .switch').attr('aria-checked'))
    console.log(onofftheme)
   
    //On récupère la valeur par défaut si le local storag est inexistant
    if(localStorage.getItem("modeSombre") == null){
        //On balance false dans le local storage
        localStorage.setItem("modeSombre",themeSombreActif)
        console.log("et la si défini: " + localStorage.getItem("modeSombre"))
        //On affiche le theme selon ce qui est enregistré
        afficheTheme(getThemeEnregistre());
    }
   
    else if(onofftheme === undefined){
        afficheTheme(getThemeEnregistre());
        
    }
    if(value === "ok"){
        console.log("thèmesombre: " + onofftheme)
        afficheTheme(onofftheme);
    }
    //sinon on affiche le thème selon ce qui est enregistré
    else{
        afficheTheme(getThemeEnregistre());
        //met a jour le switcher selon le thème enregistré
        let check = document.querySelector('.theme-check')
        if(check != undefined){
            if(getThemeEnregistre() == "true"){
                theme_switch.on();
            }else{
                theme_switch.off();
            }
        }
    }
}

//application du thème selon l'argument
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

// $(".coucou").click(function(){
//     refreshAffichage("not ok");
// });

function createSwitchTheme(){
    let eltheme = document.querySelector('.theme-check');
    theme_switch = new Switch(eltheme, 
        {
            size: 'small',
            onSwitchColor    : '#52808B', //inter
            offSwitchColor   : '#bbbfc0',
            onJackColor      : '#ffffff', //bouboule
            offJackColor     : '#ffffff'
        });
}