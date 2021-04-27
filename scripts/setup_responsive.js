
let taille = document.querySelector(".right-content").offsetWidth

if(window.innerWidth < 800){
    $(".right-content").css({
        "position" : "absolute",
        "top" : "0",
        "left" : "-" + taille + "px",
        "width" : "60%",
        "height" : "100%",
        "box-shadow" : "0px 0px 10px black"

    })
}

$(".menu").click(function(){
    $(".right-content").animate({
        left : "0"
    }, 250);
});

$(".close").click(function(){
    $(".right-content").animate({
        left : "-" + taille + "px"
    }, 500);
});

$(".elem-list").click(function(){
    $(".right-content").animate({
        left : "-" + taille + "px"
    }, 500);
});