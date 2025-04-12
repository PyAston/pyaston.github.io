$(document).ready(function () {
    music = document.getElementById("m");
    music.play();
    $("#music").change(function () {
        music.pause();
        $("#m").remove();
        $("#button").after("<audio loop id='m'><source id='source' src='/alithefox/aliwuyu/source/" + $("#music").val() + "' type='audio/mpeg'></audio>");
        $("#button").attr("src", "/alithefox/aliwuyu/source/pause.png");
        music = document.getElementById("m");
        music.play();
    });
    $("#button").click(function () {
        if ($("#button").attr("src") == "/alithefox/aliwuyu/source/pause.png") {
            $("#button").attr("src", "/alithefox/aliwuyu/source/play.png");
            music.pause();
        }
        else if ($("#button").attr("src") == "/alithefox/aliwuyu/source/play.png") {
            $("#button").attr("src", "/alithefox/aliwuyu/source/pause.png");
            music.play();
        }
    });

    picid = 0;
    tmp = 0;
    $("#backPic").click(function () {
        do {
            tmp = parseInt(Math.random()*(5-1+1)+1);
        }while(tmp == picid);
        picid = tmp;
        $("body").css("background-image", "url('/alithefox/aliwuyu/source/b" + picid + ".jpg')");
    });

    $("#color").change(function () {
        $("body").css("background-image", "none");
        picid = 0;
        $("body").css("background-color", "transparent");
        zeros = "";
        var colorStr = parseInt($("#color").val(), 10).toString(16);
        var zero = 6 - colorStr.length;
        for(var i = 0; i < zero; i++){
            zeros += "0"; 
        }
        $("body").css("background-color", "#" + zeros + colorStr);
    });
});
/*$(document).ready(function () {
    music = document.getElementById("m");
    music.play();
    $("#button").click(function () {
        if ($("#button").attr("src") == "/alithefox/aliwuyu/source/pause.png") {
            $("#button").attr("src", "/alithefox/aliwuyu/source/play.png");
            music.pause();
        }
        else if ($("#button").attr("src") == "/alithefox/aliwuyu/source/play.png") {
            $("#button").attr("src", "/alithefox/aliwuyu/source/pause.png");
            music.play();
        }
    });

});*/