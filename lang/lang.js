let resultatJson;

let page;
let langueSauvegarde;

console.log(langueSauvegarde)
console.log(localStorage.getItem("langue") == null)

if(localStorage.getItem("langue") == null){
    localStorage.setItem("langue", "fr");  
    langueSauvegarde = localStorage.getItem("langue");
}else{
    langueSauvegarde = localStorage.getItem("langue");
}

chargerLangue(langueSauvegarde);

setInterval(function(){
    langueSauvegarde = localStorage.getItem("langue");
    chargerLangue(langueSauvegarde);
},1500);

function chargerLangue(lang){

    page = location.href;
    page = page.split("/");
    page = page[page.length-1];

    // setInterval(function(){
        if(page == "index.htm"){
            $.getJSON("lang/" + lang + "_lang.json", function(res){
                resultatJson = res;
            });
        }else{
            $.getJSON("../lang/" + lang + "_lang.json", function(res){
                resultatJson = res;
            });
        }
    
        console.log(page)

        if(page != "index.htm"){
            // applicationGeneral(resultatJson["general"]);
        }
    
        if(page == "index.htm"){
            applicationAccueil(resultatJson["pageAccueil"]);
        }else if(page == "eclairage.html"){
            applicationEclairage(resultatJson["pageEclairage"]);
        }else if(page == "lames_orientabes.html"){
            applicationLames(resultatJson["pageLames"]);
        }else if(page == "config_wifi.html"){
            applicationWifi(resultatJson["pageWifi"]);
        }else if(page == "guide_utilisation.html"){
            $("#textInstructionAside").text(applicationGeneral(resultatJson["pageGuide"]["insctruction"]));
            applicationGuide(resultatJson["pageGuide"]);
        }else if(page == "parametres.html"){
            applicationParamètre(resultatJson["pageParametre"]);
        }
    // }, 1500);

}

function applicationGeneral(res){
    $("#navEclairage").text(res["navigation"]["eclairageTitle"]);
    $("#navLames").text(res["navigation"]["lamesTitle"]);
    $("#navWifi").text(res["navigationidgets"]["ConfigWifiTitle"]);
    $("#navGuide").text(res["navigation"]["GuideTitle"]);
    $("#navParametres").text(res["navigation"]["ParaTitle"]);
}
function applicationAccueil(res){
    //========================== WIDGETS ======================== 
    $("#titreWidgetEclairage").text(res["widgets"]["eclairageTitle"]);
    $("#titreWidgetLames").text(res["widgets"]["lamesTitle"]);
    $("#titreWidgetWifi").text(res["widgets"]["ConfigWifiTitle"]);
    $("#titreWidgetGuide").text(res["widgets"]["GuideTitle"]);
    $("#titreWidgetParametres").text(res["widgets"]["ParaTitle"]);

    //==================== POPUP INFOS CONTACTS =================== 
    $("#exampleModalLabel").text(res["popupContact"]["titre"]);
    $("#mailContact").text(res["popupContact"]["mail"]);
    $("#telContact").text(res["popupContact"]["tel"]);
    $("#webContact").text(res["popupContact"]["web"]);
    $("#adresseContact").text(res["popupContact"]["adress"]);
    $("#versionContact").text(res["popupContact"]["version"]);
    
}
function applicationEclairage(res){
    //==================== TITRE BANDEAUX =================== 
    $("#titreBB1").text(res["BB1"]);
    $("#titreBB2").text(res["BB2"]);
    $("#titreRGB1").text(res["RGB1"]);
    $("#titreRGB2").text(res["RGB2"]);

    //==================== ALL LIGHTS ===================
    $("#allumageAll").text(res["allLumieres"]);
    
    //==================== COLORISATION ===================
    $("#titreColorisation").text(res["colorisationWidget"]["titre"]);
    $("#R1").text(res["colorisationWidget"]["réglageRVB"]);
    $("#R2").text(res["colorisationWidget"]["roueChroma"]);
    $("#textColoRed").text(res["colorisationWidget"]["R"]);
    $("#textColoGreen").text(res["colorisationWidget"]["G"]);
    $("#textColoBlue").text(res["colorisationWidget"]["B"]);
    

    //==================== LUMIERES D'AMBIANCE ===================
    $("#amb1").text(res["ambiance"]["calme"]);
    $("#amb2").text(res["ambiance"]["confort"]);
    $("#amb3").text(res["ambiance"]["sérénité"]);
    $("#amb4").text(res["ambiance"]["detente"]);
    $("#amb5").text(res["ambiance"]["cocktail"]);
    $("#amb6").text(res["ambiance"]["concentration"]);
    $("#amb7").text(res["ambiance"]["eveillé"]);
    $("#amb8").text(res["ambiance"]["inspiration"]);
    $("#amb9").text(res["ambiance"]["motivation"]);

    //==================== MEMORISATION CONFIG ===================
    $("#textMemoConfigEclairage").text(res["mémoriserConfig"]);
    
}
function applicationLames(res){
    //==================== TITRE MOTEURS =================== 
    $("#titreM1").text(res["M1"]);
    $("#titreM2").text(res["M2"]);

    //==================== SAISONNIER =================== 
    $("#textSaisonnier").text(res["saisonnier"]["modeSaisonnier"]);
    $("#textSaisonnierManuel").text(res["saisonnier"]["manuel"]);
    $("#textSaisonnierEte").text(res["saisonnier"]["ete"]);
    $("#textSaisonnierHiver").text(res["saisonnier"]["hiver"]);

    //==================== SYNC LAMES ===================
    $("#titreSync").text(res["sync"]); 
}

function applicationWifi(res){
    $("#textDetectionWifi").text(res["detectionWifi"]); 
}

function applicationGuide(res){
    //==================== CAS D'INTEMPERIES ===================
    $("#titreIntemp").text(res["casIntemperie"]["title"]);
    $("#sousTitreIntemp1").text(res["casIntemperie"]["subtitle1"]);
    $("#textIntemp1").text(res["casIntemperie"]["para1"]);
    $("#sousTitreIntemp2").text(res["casIntemperie"]["subtitle2"]);
    $("#textIntemp2").text(res["casIntemperie"]["para2"]);

    //==================== ENTRETIEN PERGOLA ===================
    $("#titreEntretien").text(res["entretienPergola"]["title"]);
    $("#textEntretien1").text(res["entretienPergola"]["para1"]);
    $("#textEntretien2").text(res["entretienPergola"]["para2"]);
    $("#textEntretien3").text(res["entretienPergola"]["para3"]);
    $("#textEntretien4").text(res["entretienPergola"]["para4"]);
    $("#textEntretien5").text(res["entretienPergola"]["para5"]);
    $("#textEntretien6").text(res["entretienPergola"]["para6"]);

    //==================== MANIP ELEVATION SOLAIRE ===================
    $("#titreElevSol").text(res["manipElevationSolaire"]["title"]);
    $("#sousTitreElevSol1").text(res["manipElevationSolaire"]["subtitle1"]);
    $("#textElevSol1").text(res["manipElevationSolaire"]["para1"]);
    $("#textElevSol2").text(res["manipElevationSolaire"]["para2"]);
    $("#sousTitreElevSol2").text(res["manipElevationSolaire"]["subtitle2"]);
    $("#textElevSol3").text(res["manipElevationSolaire"]["para3"]);

    //==================== INSTRUCTIONS ===================
    $("#amb9").text(res["insctruction"]);
}

function applicationParamètre(res){
    //==================== GENERAUX ===================
    $("#titreWidgetPara").text(res["blocGeneraux"]["title"]);

    $("#titreDate").text(res["blocGeneraux"]["date"]);
    $("#titreHeure").text(res["blocGeneraux"]["heure"]);
    $("#titreLangue").text(res["blocGeneraux"]["langue"]);

    $("#titreHoming").text(res["blocGeneraux"]["homing"]);
    $("#textHoming").text(res["blocGeneraux"]["boutonHoming"]);

    $("#titreGeolocalisation").text(res["blocGeneraux"]["geolocalisation"]);
    $("#textPositionnement").text(res["blocGeneraux"]["positionnement"]);
    $("#textEnregistrer").text(res["blocGeneraux"]["boutonEnregistrer"]);

    $("#textLattitude").text(res["blocGeneraux"]["lat"]);
    $("#textLongitude").text(res["blocGeneraux"]["lon"]);
    $("#O2_1").text(res["blocGeneraux"]["n"]);
    $("#O2_2").text(res["blocGeneraux"]["s"]);
    $("#O1_1").text(res["blocGeneraux"]["e"]);
    $("#O1_2").text(res["blocGeneraux"]["o"]);

    $("#titreOrientation").text(res["blocGeneraux"]["orientation"]);
    $("#N").text(res["blocGeneraux"]["n"]);
    $("#NNE").text(res["blocGeneraux"]["nne"]);
    $("#NE").text(res["blocGeneraux"]["ne"]);
    $("#ENE").text(res["blocGeneraux"]["ene"]);
    $("#E").text(res["blocGeneraux"]["e"]);
    $("#ESE").text(res["blocGeneraux"]["ese"]);
    $("#SE").text(res["blocGeneraux"]["se"]);
    $("#SSE").text(res["blocGeneraux"]["sse"]);
    $("#S").text(res["blocGeneraux"]["s"]);
    $("#SSO").text(res["blocGeneraux"]["sso"]);
    $("#SO").text(res["blocGeneraux"]["so"]);
    $("#OSO").text(res["blocGeneraux"]["oso"]);
    $("#O").text(res["blocGeneraux"]["o"]);
    $("#ONO").text(res["blocGeneraux"]["ono"]);
    $("#NO").text(res["blocGeneraux"]["no"]);
    $("#NNO").text(res["blocGeneraux"]["nno"]);

    //==================== ECLAIRAGE ===================
    $("#titreWidgetEclairage").text(res["blocEclairage"]["title"]);

    $("#textAllumAuto").text(res["blocEclairage"]["allAuto"]);
    $("#heureDebut").text(res["blocEclairage"]["heureDemarage"]);
    $("#heureFin").text(res["blocEclairage"]["heureExtinction"]);
    $("#textModifier").text(res["blocEclairage"]["modifier"]); 
    $("#textAppliquer").text(res["blocEclairage"]["appliquer"]);

    $("#titreVitesseLed").text(res["blocEclairage"]["vitesseLed"]);
    $("#L1").text(res["blocEclairage"]["instant"]);
    $("#L2").text(res["blocEclairage"]["seconde1"]);
    $("#L3").text(res["blocEclairage"]["seconde2"]);
    $("#L4").text(res["blocEclairage"]["seconde4"]);

    //==================== ENVIRONNEMENT ===================
    $("#titreWidgetEnvironnement").text(res["blocEnvironnement"]["title"]);

    $("#titreFermPluie").text(res["blocEnvironnement"]["fermeturePluie"]);

    $("#titreIntemperie").text(res["blocEnvironnement"]["intemperies"]);
    $("#I1").text(res["blocEnvironnement"]["desactive"]);
    $("#I2").text(res["blocEnvironnement"]["blocageVent"]);
    $("#I3").text(res["blocEnvironnement"]["blocageNeige"]);

    $("#titreSaisonnier").text(res["blocEnvironnement"]["modeSaisonnier"]);
    $("#S1").text(res["blocEnvironnement"]["manuel"]);
    $("#S2").text(res["blocEnvironnement"]["ete"]);
    $("#S3").text(res["blocEnvironnement"]["hiver"]);

    $("#titreSuiviSolaire").text(res["blocEnvironnement"]["suiviSol"]);
    $("#B1").text(res["blocEnvironnement"]["min1"]);
    $("#B2").text(res["blocEnvironnement"]["min5"]);
    $("#B3").text(res["blocEnvironnement"]["min15"]);
    $("#B4").text(res["blocEnvironnement"]["min30"]);
    $("#B5").text(res["blocEnvironnement"]["min60"]);
    
    $("#titreFermetureNuit").text(res["blocEnvironnement"]["fermetureNuit"]); //

    //==================== APPARENCE ===================
    $("#titreWidgetApparence").text(res["blocApparence"]["title"]);
    $("#titreTheme").text(res["blocApparence"]["themeSombre"]);

    //==================== MAINTENANCE ===================
    $("#titreWidgetMaintenance").text(res["blocMaintenance"]["title"]);
    $("#textDebug").text(res["blocMaintenance"]["debug"]);
    $("#textRegFab").text(res["blocMaintenance"]["reglageFab"]);

    //==================== MAJ ===================
    $("#titreWidgetMAJ").text(res["blocMaj"]["title"]);
    $("#textInstaller").text(res["blocMaj"]["installer"]);
}
