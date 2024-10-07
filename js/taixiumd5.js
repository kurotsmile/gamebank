class TaiXiu_MD5{
    emp_game=null;
    is_play=false;
    is_tai_bet=false;

    thread_game_return=null;
    thread_game_play=null;

    array_history=[];

    money_pending_bet=0;
    money_bet=0;
    length_history_bet=16;

    show(){
        taixiu.array_history=[];
        for(var i=0;i<taixiu.length_history_bet;i++){
            var randomValue = Math.floor(Math.random() * 2);
            taixiu.array_history.push(randomValue);
        }

        taixiu.clear_thread();
        if(this.emp_game!=null){
            $(this.emp_game).remove();
            this.emp_game=null;
        }
        Swal.close();
        $("#preloader").show();
        taixiu.laodAllEmp();
        taixiu.play();

        setTimeout(()=>{
            taixiu.update_dice_history();
        },5000);
    }

    laodAllEmp(){
        var html_game='<div id="tx">';
        html_game+='<div id="game_tx">';
            html_game+='<div class="btn">a</div>';
            html_game+='<div class="info">';
                html_game+='<img id="txt_tai" class="txt" src="images/txt_tai.png"/>';
                html_game+='<div class="txt_money_bet_total">0</div>';
                html_game+='<div id="btn-bet-tai" role="button" class="btn-bet" onclick="taixiu.show_bet(true);return false;"></div>';
                html_game+='<div id="txt_money_bet_tai" class="txt_money_bet">0</div>';
            html_game+='</div>';
            html_game+='<div id="dia">';
                html_game+='<div id="dice_history"></div>';
                html_game+='<div id="dice_md5"></div>';
                html_game+='<div id="dice_panel_bet">';
                    html_game+='<div class="row">';
                    html_game+='<div class="col-12">';
                        html_game+='<button onclick="taixiu.bet(10000)" class="btn-bet">10k</button>';
                        html_game+='<button onclick="taixiu.bet(20000)" class="btn-bet">20k</button>';
                        html_game+='<button onclick="taixiu.bet(30000)" class="btn-bet">30k</button>';
                        html_game+='<button onclick="taixiu.bet(50000)" class="btn-bet">50k</button>';
                        html_game+='<button onclick="taixiu.bet(100000)" class="btn-bet">100k</button>';
                        html_game+='<button onclick="taixiu.bet(500000)" class="btn-bet">500k</button>';
                        html_game+='<button onclick="taixiu.bet(1000000)" class="btn-bet">1M</button>';
                    html_game+='</div>';
                    html_game+='<div class="col-12">';
                        html_game+='<button class="btnx2" onclick="taixiu.betx2();"><i class="fas fa-socks"></i> X2</button>';
                        html_game+='<button class="btn-bet-done" onclick="taixiu.done_bet();return false;"><i class="fas fa-check-circle"></i> Đặt Cược</button>';
                        html_game+='<button class="btnx2" onclick="taixiu.cancel_bet();return false;"><i class="fas fa-times-circle"></i> Hủy bỏ</button>';
                    html_game+='</div>';
                    html_game+='</div>';
                html_game+='</div>';
                html_game+='<div id="effect_c"></div>';
                html_game+='<div id="dice"></div>';
            html_game+='</div>';
            html_game+='<div class="info">';
                html_game+='<img id="txt_xiu" class="txt" src="images/txt_xiu.png"/>';
                html_game+='<div class="txt_money_bet_total">0</div>';
                html_game+='<div id="btn-bet-xiu"  role="button" class="btn-bet" onclick="taixiu.show_bet(false);return false;"></div>';
                html_game+='<div id="txt_money_bet_xiu" class="txt_money_bet">0</div>';
            html_game+='</div>';
            html_game+='<div  class="btn"><img onclick="taixiu.close();" class="close" src="images/btn_close.png"/></div>';
        html_game+='</div>';
        html_game+='</div>';

        taixiu.emp_game=$(html_game);
        $("body").append(taixiu.emp_game);
    }

    play(){
        $("#txt_xiu").removeClass("zoom");
        $("#txt_tai").removeClass("zoom");

        if(this.is_play) return;

        $(".sprite_dice").hide();
        $("#dice").empty();
        if($("#roll_dice").length>0) $("#roll_dice").remove();
        $("#dice").append('<img id="roll_dice" src="images/roll1.gif?v='+ Math.floor(Math.random() * 26)+'"/>');

        taixiu.thread_game_return=setTimeout(()=>{
            taixiu.is_play=false;
            taixiu.money_pending_bet=0;
            taixiu.money_bet=0;
            $("#roll_dice").hide();
            
            var randomNumber_a = Math.floor(Math.random() * 6) + 1;
            var randomNumber_b = Math.floor(Math.random() * 6) + 1;
            var randomNumber_c = Math.floor(Math.random() * 6) + 1;

            var dice_total=randomNumber_a+randomNumber_b+randomNumber_c;
            if(dice_total<=10){
                $("#txt_xiu").addClass("zoom");
                $("#txt_tai").removeClass("zoom");
                taixiu.add_dice_history(0);
            }else{
                $("#txt_tai").addClass("zoom");
                $("#txt_xiu").removeClass("zoom");
                taixiu.add_dice_history(1);
            }
    
            var html_game='';
            html_game+='<div id="dice_a" class="sprite_dice d'+randomNumber_a+' p1"></div>';
            html_game+='<div id="dice_b" class="sprite_dice d'+randomNumber_b+' p2"></div>';
            html_game+='<div id="dice_c" class="sprite_dice d'+randomNumber_c+' p3"></div>';
            $("#dice").append(html_game);
            $(".sprite_dice").show();

            
            $("#dice_md5").html(CryptoJS.MD5(cr.create_id()).toString());

            taixiu.thread_game_play=setTimeout(()=>{
                taixiu.clear_thread();
                taixiu.play();
            },5000);
        },3000);
    }

    close(){
        taixiu.is_play=false;
        $("#preloader").hide();
        $("#dice_history").html("");
        $(taixiu.emp_game).remove();
        taixiu.clear_thread();
    }

    clear_thread(){
        if(taixiu.thread_game_play!=null)  clearTimeout(taixiu.thread_game_play);
        if(taixiu.thread_game_return!=null)  clearTimeout(taixiu.thread_game_return);
    }

    add_dice_history(newValue) {
        taixiu.array_history.push(newValue);
        if (taixiu.array_history.length > taixiu.length_history_bet) {
            taixiu.array_history.shift();
        }
        taixiu.update_dice_history();
    }

    update_dice_history(){
        $("#dice_history").empty();
        $.each(taixiu.array_history,function(index,d){
            if(d==0)
                $("#dice_history").append('<div class="item xiu"></div>');
            else
                $("#dice_history").append('<div class="item tai"></div>');
        });
    }

    show_bet(is_tai=true){
        taixiu.is_tai_bet=is_tai;
        $("#dice_panel_bet").show();
        $("#btn-bet-tai").removeClass("block");
        $("#btn-bet-xiu").removeClass("block");
        if(is_tai){
            if(taixiu.money_bet>0) $("#txt_money_bet_tai").html(w.formatVND(taixiu.money_bet));
            $("#btn-bet-tai").addClass("block");
            $("#txt_money_bet_xiu").html("0");
        }
        else{
            if(taixiu.money_bet>0) $("#txt_money_bet_xiu").html(w.formatVND(taixiu.money_bet));
            $("#btn-bet-xiu").addClass("block");
            $("#txt_money_bet_tai").html("0");
        }  
    }

    cancel_bet(){
        $("#dice_panel_bet").hide();
        taixiu.money_pending_bet=0;
        $("#btn-bet-tai").removeClass("block");
        $("#btn-bet-xiu").removeClass("block");
    }

    done_bet(){
        taixiu.money_bet=taixiu.money_pending_bet;
        taixiu.money_pending_bet=0;
        $("#dice_panel_bet").hide();
        $("#btn-bet-tai").removeClass("block");
        $("#btn-bet-xiu").removeClass("block");
    }

    bet(money){
        taixiu.money_pending_bet+=money;
        taixiu.update_money_bet();
    }

    betx2(){
        taixiu.money_pending_bet=(taixiu.money_pending_bet*2);
        taixiu.update_money_bet();
    }

    update_money_bet(){
        if(taixiu.is_tai_bet){
            $("#txt_money_bet_tai").html(w.formatVND(taixiu.money_pending_bet.toString()));
        }else{
            $("#txt_money_bet_xiu").html(w.formatVND(taixiu.money_pending_bet.toString()));
        }
    }
}

var taixiu=new TaiXiu_MD5();