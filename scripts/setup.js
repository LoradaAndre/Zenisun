$(".mod").click(function(){
    console.log($(this).text())
    if($(this).text() == "Modifier"){
        $(".middle").show()
        $(this).parent().children(".middle").css("visibility","visible")
        $(this).text("Annuler")
    }
    else{
        $(this).text("Modifier")
        $(this).parent().children(".middle").css("visibility","hidden")
    }
    
});

$(document).ready(function(){
    $(".middle").css("visibility","hidden")
    afficheUn(".para1")
})

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