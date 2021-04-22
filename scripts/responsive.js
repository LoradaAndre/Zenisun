
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
        "margin-right" : "0",
        "margin-left" : widthNavBar,
    })

    // $(".contenu-main").css({
    //     "width": "100%",
    //     // "margin" : "auto"
    // })
}

if(window.innerWidth > 800){
    resizeWindowEvent()
    window.onresize = () => {
        resizeWindowEvent;
        // window.location.reload();
    }
}

// if(window.innerWidth < 500){
    
// }

$(".menu").click(function(){
    $(this).hide()
    $(".navigation_bar").css({
        "display" : "block",
        "width" : "50%",
        "z-index" : "3",
        "box-shadow" : "0px 0px 10px #42555a"
    })
    $("aside").css({
        "width" : "50%",
    })
    $(".categorie a").css({
        "display" : 'flex'
    })
    $(".nom_widget").css({
        "margin" : "auto",
        "margin-left" : "10px"
    })
    $(".icon_navbar img").css({
        "margin" : "auto",
        "width" : "5vw"
    })

    // $(".icon_close img").css({
    //     "width": "25px",
    //     "margin": "auto",
    //     "margin-right" : "2px"
    // })

    // $(".icon_close").css({
    //     "justify-content"
    // })
});

$(".icon_close img").click(function(){
    $(this).hide();
    $(".navigation_bar").hide();
    $("aside").css({
        "width" : "100%",
    })
    $(".menu").show()
})

// // console.log(document.querySelector("."))
// // offsetHeight

// setTimeout(function(){
//     if($(".canvas-mot2").css("display") == "none"){
//         $(".eclairage_widget").css({
//             "grid-area: 1 / 2;"
//         })
//     }
// }, 100)




