
// $(".overlay").click(function(){
//     $(this).css("display","none");
//     $(".navigation_bar").css({
//         "display" : "block",
//         "width" : "70%",
//         "z-index" : "3"
//     });

//     $(".icon_navbar img").css({
//         "width" : "30px",
//         "vertical-align" : "middle",
//         "margin" : "10px"
//     });
//     $(".categorie a").css({
//         "display" : "flex"
//     })
//     $(".categorie_spe").css({
//         "display" : "flex",
//         "justify-content" : "space-between"
//     })
//     $(".categorie_spe img").css({
//         "margin-top" : "auto",
//         "margin-bottom" : "auto"
//     })
//     $(".nom_widget").css({
//         "margin-top" : "auto",
//         "margin-bottom" : "auto"
//     })
// });

// $(".close").click(function(){
//     $(this).css("float","left");

//     $(".navigation_bar").css({
//         "display" : "none"
//     });

//     $(".overlay").css("display","block");
// });


// $("aside").css("width", $(".left-main").outerWidth() + "px")
// console.log($(".left-main").outerWidth())


// let box = document.querySelector(".left-main");
// console.log(box.offsetWidth)

function resizeWindowEvent(){
    let widthNavBar = $(".navigation_bar").outerWidth()
    let largeurEcran = window.innerWidth;
    let diff = largeurEcran - widthNavBar - 20
    $("main").css({
        "width": diff + "px",
        "margin-right" : "0"
    })

    // $(".contenu-main").css({
    //     "width": "100%",
    //     // "margin" : "auto"
    // })
}

resizeWindowEvent()
window.onresize = resizeWindowEvent;
// // console.log(document.querySelector("."))
// // offsetHeight