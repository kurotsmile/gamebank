class TaiXiu_MD5{
    game_obj=null;

    show(){
        Swal.close();
        $("#preloader").show();
        var html_game='<div id="tx">';
        html_game+='<div id="game_tx">';
            html_game+='<div class="btn">a</div>';
            html_game+='<div class="info">a</div>';
            html_game+='<div id="dia">';
                html_game+='<div id="effect_c"></div>';
                html_game+='<div id="dice"><img src="images/roll1.gif"/></div>';
            html_game+='</div>';
            html_game+='<div class="info">a</div>';
            html_game+='<div  class="btn"><img onclick="taixiu.close();" class="close" src="images/btn_close.png"/></div>';
        html_game+='</div>';
        html_game+='</div>';

        taixiu.emp_game=$(html_game);
        $("body").append(taixiu.emp_game);
    }

    close(){
        $("#preloader").hide();
        $(taixiu.emp_game).remove();
    }
}

var taixiu=new TaiXiu_MD5();