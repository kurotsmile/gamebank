class TaiXiu_MD5{
    emp_game=null;
    is_play=false;
    is_tai_bet=false;
    is_test_bet=true;

    thread_game_play=null;
    thread_game_countdown=null;
    thread_game_pending_return=null;
    thread_game_return=null;

    array_history=[];

    total_bet_tai=0;
    total_bet_xiu=0;
    total_bet_min=100;
    total_bet_max=5000000000;

    total_user_tai=0;
    total_user_xiu=0;

    money_pending_bet=0;
    money_bet=0;
    length_history_bet=16;

    timeLeft_length=10;
    timeLeft =0;
    dice_total=0;

    id_session=null;
    data_session_cur=null;

    box_chat=null;

    show(){
        var d_cur=new Date();
        this.id_session="tx"+d_cur.getDay()+""+d_cur.getMonth()+d_cur.getFullYear();
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
        taixiu.load_session();
    }

    load_session(){
        taixiu.clear_thread();
        taixiu.getSession(data=>{
            if(data!=null){
                taixiu.data_session_cur=data;
                taixiu.play(taixiu.timeDifferenceInSeconds(data.time_end));
            }else{
                taixiu.play();    
            }
        },()=>{
            taixiu.play();
        });
    }

    get_realtime_for_session(){
        cr_realtime.getData("tx",taixiu.id_session,(tx)=>{
            if(tx==null){
                var obj_session={};
                obj_session["users"]=[{username:0}];
                cr_realtime.add("tx",taixiu.id_session,obj_session);
            }
            alert(JSON.stringify(tx));
        });
    }

    laodAllEmp(){
        var html_game='<div id="tx">';
        html_game+='<div id="game_tx">';
            html_game+='<div class="btn"></div>';
            html_game+='<div class="info">';
                html_game+='<div id="total_user_tai" class="txt_user tai">0</div>';
                html_game+='<img id="txt_tai" class="txt tai" src="images/txt_tai.png"/>';
                html_game+='<div id="txt_money_bet_total_tai" class="txt_money_bet_total tai">0</div>';
                html_game+='<div id="btn-bet-tai" role="button" class="btn-bet tai" onclick="taixiu.show_bet(true);return false;"></div>';
                html_game+='<div id="txt_money_bet_tai" class="txt_money_bet">0</div>';
            html_game+='</div>';
            html_game+='<div id="dia">';
                html_game+='<div id="dice_history"></div>';
                html_game+='<div id="dice_md5"></div>';
                html_game+='<div id="effect_c"></div>';
                html_game+='<div id="dice">';
                    html_game+='<div id="all_dice">';
                        html_game+='<div id="dice_a" class="sprite_dice d1 p1"></div>';
                        html_game+='<div id="dice_b" class="sprite_dice d1 p2"></div>';
                        html_game+='<div id="dice_c" class="sprite_dice d1 p3"></div>';
                    html_game+='</div>';
                    html_game+='<div id="dice_roll"></div>';
                    html_game+='<div id="guess"></div>';
                    html_game+='<div id="countdown"><i class="fas fa-spinner fa-spin"></i></div>';
                html_game+='</div>';

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

            html_game+='</div>';
            html_game+='<div class="info">';
                html_game+='<div id="total_user_xiu" class="txt_user xiu">0</div>';
                html_game+='<img id="txt_xiu" class="txt xiu" src="images/txt_xiu.png"/>';
                html_game+='<div id="txt_money_bet_total_xiu" class="txt_money_bet_total xiu">0</div>';
                html_game+='<div id="btn-bet-xiu"  role="button" class="btn-bet xiu" onclick="taixiu.show_bet(false);return false;"></div>';
                html_game+='<div id="txt_money_bet_xiu" class="txt_money_bet">0</div>';
            html_game+='</div>';
            html_game+='<div class="btn">';
                html_game+='<img onclick="taixiu.close();" class="close" src="images/btn_close.png"/>';
                html_game+='<img onclick="taixiu.show_chat();" class="chat" src="images/btn_chat.png"/>';
            html_game+='</div>';
        html_game+='</div>';
        html_game+='</div>';

        taixiu.emp_game=$(html_game);
        $("body").append(taixiu.emp_game);
        $("#dice_md5").html(CryptoJS.MD5(cr.create_id()).toString());
        taixiu.update_dice_history();
    }

    play(timer_length=null){
        if(this.is_play) return;

        $("#effect_c").show();
        $("#countdown").show();
        $("#guess").hide();
        $(".btn-bet").animate({ opacity: 1 }, 1000);
   
        if(timer_length==null)
            this.timeLeft=this.timeLeft_length;
        else
            this.timeLeft=timer_length;
        this.total_bet_tai=0;
        this.total_bet_xiu=0;
        this.total_user_tai=0;
        this.total_user_xiu=0;
        $("#txt_xiu").removeClass("zoom");
        $("#txt_tai").removeClass("zoom");
        $("#all_dice").hide();
        this.update_ui();
        $("#txt_money_bet_tai").html("0 đ");
        $("#txt_money_bet_xiu").html("0 đ");

        this.thread_game_countdown= setInterval(function() {
            if(taixiu.timeLeft <= 0) {
                taixiu.show_pending_return();
            } else {
                $('#countdown').html(taixiu.timeLeft);
            }
            taixiu.timeLeft -= 1;
            taixiu.auto_bet_test();
        }, 900);
    }

    auto_bet_test(){
        function getRandomInRange(a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a;
        }

        var randomValue = Math.floor(Math.random() * 2);
        if(randomValue==0){
            this.total_bet_tai+=getRandomInRange(taixiu.total_bet_min,taixiu.total_bet_max);
            this.total_bet_xiu+=getRandomInRange(taixiu.total_bet_min,taixiu.total_bet_max);
        }

        this.total_user_tai+=getRandomInRange(0,10);
        this.total_user_xiu+=getRandomInRange(0,10);

        this.update_ui();
    }

    show_pending_return(){
        taixiu.cancel_bet();
        clearInterval(this.thread_game_countdown);
        $("#effect_c").hide();
        $("#countdown").hide();
        $(".btn-bet").animate({ opacity: 0 }, 1000);
        if($("#roll_dice").length>0) $("#roll_dice").remove();
        $("#dice_roll").empty();
        $("#dice_roll").append('<img id="roll_dice" src="images/roll1.gif?v='+ Math.floor(Math.random() * 26)+'"/>');

        cr_firestore.get("tx",taixiu.data_session_cur.id,data=>{
            taixiu.show_return(data);
        },()=>{
            taixiu.thread_game_pending_return=setTimeout(()=>{
                taixiu.show_return();
            },3000);
        });
    }

    show_return(data=null){
        $("#guess").show();
        $("#guess").css({
            top:70,
            left:50
        });
        $("#guess").draggable({
            stop: function(event, ui) {
                if(taixiu.is_play) taixiu.mo_dia_xong();
            }
        });

        $("#all_dice").show();
        taixiu.money_pending_bet=0;
        taixiu.money_bet=0;
        $("#roll_dice").remove();
        
        var dice_a=0;
        var dice_b=0;
        var dice_c=0;

        if(data==null){
            dice_a= Math.floor(Math.random() * 6) + 1;
            dice_b= Math.floor(Math.random() * 6) + 1;
            dice_c= Math.floor(Math.random() * 6) + 1;
        }else{
            dice_a=parseInt(data.a);
            dice_b=parseInt(data.b);
            dice_c=parseInt(data.c);
        }

        taixiu.dice_total=dice_a+dice_b+dice_c;
        $("#dice_a").attr("class","sprite_dice p1");
        $("#dice_b").attr("class","sprite_dice p2");
        $("#dice_c").attr("class","sprite_dice p3");

        $("#dice_a").addClass("d"+dice_a);
        $("#dice_b").addClass("d"+dice_b);
        $("#dice_c").addClass("d"+dice_c);

        $("#dice_md5").html(CryptoJS.MD5(cr.create_id()).toString());

        taixiu.thread_game_return=setTimeout(() => {
            $("#guess").hide();
            taixiu.mo_dia_xong();
            taixiu.thread_game_play=setTimeout(()=>{
                $("#guess").hide();
                taixiu.load_session();
            },6000);    
        }, 3000);
    }

    mo_dia_xong(){
        if(taixiu.dice_total<=10){
            $("#txt_xiu").addClass("zoom");
            $("#txt_tai").removeClass("zoom");
            taixiu.add_dice_history(0);
        }else{
            $("#txt_tai").addClass("zoom");
            $("#txt_xiu").removeClass("zoom");
            taixiu.add_dice_history(1);
        }
        taixiu.is_play=false;
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
        if(taixiu.thread_game_countdown!=null)  clearTimeout(taixiu.thread_game_countdown);
        if(taixiu.thread_game_pending_return!=null)  clearTimeout(taixiu.thread_game_pending_return);
        if(taixiu.thread_game_return!=null) clearTimeout(taixiu.thread_game_return);
    }

    add_dice_history(newValue) {
        taixiu.array_history.push(newValue);
        if (taixiu.array_history.length > taixiu.length_history_bet) taixiu.array_history.shift();
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
        taixiu.update_ui();
    }

    show_bet(is_tai=true){
        taixiu.is_tai_bet=is_tai;
        $("#dice_panel_bet").show();
        $("#btn-bet-tai").removeClass("block");
        $("#btn-bet-xiu").removeClass("block");
        if(is_tai){
            if(taixiu.money_bet>0) $("#txt_money_bet_tai").html(w.formatVND(taixiu.money_bet));
            $("#btn-bet-tai").addClass("block");
            $("#txt_money_bet_xiu").html("0 đ");
        }
        else{
            if(taixiu.money_bet>0) $("#txt_money_bet_xiu").html(w.formatVND(taixiu.money_bet));
            $("#btn-bet-xiu").addClass("block");
            $("#txt_money_bet_tai").html("0 đ");
        }
        taixiu.update_ui();
    }

    cancel_bet(){
        $("#dice_panel_bet").hide();
        $("#btn-bet-tai").removeClass("block");
        $("#btn-bet-xiu").removeClass("block");
        if(taixiu.is_tai_bet){
            $("#txt_money_bet_tai").html(w.formatVND(taixiu.money_bet));
        }else{
            $("#txt_money_bet_xiu").html(w.formatVND(taixiu.money_bet));
        }
    }

    done_bet(){
        taixiu.money_bet=taixiu.money_pending_bet;
        taixiu.money_pending_bet=0;
        $("#dice_panel_bet").hide();
        $("#btn-bet-tai").removeClass("block");
        $("#btn-bet-xiu").removeClass("block");
        if(w.user_login==null){
            cr.msg("Vui lòng đăng nhập để chơi!","Tài Xỉu MD5","warning");
            taixiu.close();
        }
        else{
            if(taixiu.is_tai_bet)
                cr_realtime.add("tx",taixiu.id_session+"/users/tai/"+w.user_login.username,taixiu.money_bet);
            else
                cr_realtime.add("tx",taixiu.id_session+"/users/xiu/"+w.user_login.username,taixiu.money_bet);
        }
    }

    bet(money){
        taixiu.money_pending_bet+=money;
        taixiu.update_money_bet();
    }

    betx2(){
        taixiu.money_pending_bet=(taixiu.money_bet*2);
        taixiu.update_money_bet();
    }

    update_money_bet(){
        if(taixiu.is_tai_bet){
            $("#txt_money_bet_tai").html(w.formatVND(taixiu.money_pending_bet.toString()));
        }else{
            $("#txt_money_bet_xiu").html(w.formatVND(taixiu.money_pending_bet.toString()));
        }
    }

    update_ui(){
        var referenceDiv = $('#dia');
        var referenceOffset = referenceDiv.offset();
        $('#dice_panel_bet').css({
            top: referenceOffset.top + referenceDiv.height() + 165 + 'px'
        });
        $('#dice_history').css({
            top: referenceOffset.top + referenceDiv.height() + 136 + 'px'
        });
        $('#dice_md5').css({
            top: referenceOffset.top + referenceDiv.height() + 176 + 'px'
        });
        $("#txt_money_bet_total_tai").html(w.formatVND(this.total_bet_tai));
        $("#txt_money_bet_total_xiu").html(w.formatVND(this.total_bet_xiu));
        $("#total_user_tai").html(this.total_user_tai);
        $("#total_user_xiu").html(this.total_user_xiu);
    }

    getSession(act_done=null,act_fail=null){

        function compareWithCurrentTime(dateString) {
            var date = new Date(dateString);
   
            var hoursFromString = date.getHours();
            var minutesFromString = date.getMinutes();
   
            var currentDate = new Date();
            var currentHours = currentDate.getHours();
            var currentMinutes = currentDate.getMinutes();
   
            if (hoursFromString > currentHours || (hoursFromString === currentHours && minutesFromString > currentMinutes)) {
               return 0;//xắp
            } else if (hoursFromString < currentHours || (hoursFromString === currentHours && minutesFromString < currentMinutes)) {
               return 2; //Đã
            } else {
               return 1; //Đang
            }
        }

        var q=new Firestore_Query("tx");
        q.add_select("id");
        q.add_select("code");
        q.add_select("time_start");
        q.add_select("time_end");
        q.add_where("hour",new Date().getHours().toString());
        q.set_limit(100);
        q.get_data(datas=>{
            datas.sort((a, b) => new Date(a.time_start) - new Date(b.time_start));
            $.each(datas,function(index,t){
                if(compareWithCurrentTime(t.time_start)==1){
                    if(act_done) act_done(t);
                    return false;
                }

                if(compareWithCurrentTime(t.time_start)==0){
                    if(act_done) act_done(t);
                    return false;
                }
            });
        },()=>{
            if(act_fail) act_fail();
        });
    }

    timeDifferenceInSeconds(inputTime) {
        const targetDate = new Date(inputTime);
        const currentDate = new Date();
    
        const targetHours = targetDate.getHours();
        const targetMinutes = targetDate.getMinutes();
        const targetSeconds = targetDate.getSeconds();
    
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentSeconds = currentDate.getSeconds();
    
        const targetTotalSeconds = (targetHours * 3600) + (targetMinutes * 60) + targetSeconds;
        const currentTotalSeconds = (currentHours * 3600) + (currentMinutes * 60) + currentSeconds;
    
        let secondsRemaining = targetTotalSeconds - currentTotalSeconds;
    
        if (secondsRemaining < 0) {
            secondsRemaining += 24 * 3600; 
        }
        return secondsRemaining;
    }

    show_chat(){

        function item_chat(username,msg){
            var html='<div class="chat_item"><b class="username">'+username+':</b> <div class="text-white msg">'+msg+'</div></div>';
            return html;
        }

        if(taixiu.box_chat!=null) $(taixiu.box_chat).remove();
        var box_chat='';
        box_chat+='<div id="tx_chat">';
        box_chat+='<div onclick="taixiu.close_chat()" class="btn_close"></div>';
        box_chat+='<div id="tx_chat_all_item"></div>';
        box_chat+='<input type="text" value="" placeholder="Nhập nội dung trò chuyện vào đây..." id="tx_inp_chat"/>';
        box_chat+='</div>';
        taixiu.box_chat=$(box_chat);

        $(taixiu.box_chat).find('#tx_inp_chat').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                var message = $(this).val();
                if (message.trim() !== "") {
                    if(w.user_login!=null){
                        $("#tx_chat_all_item").append(item_chat(w.user_login.username,message));
                    }else{
                        $("#tx_chat_all_item").append(item_chat("Ẩn danh",message));
                    }
                    $(this).val('');
                }
            }
        });
        $("body").append(taixiu.box_chat);
        setTimeout(()=>{$("#tx_chat").draggable(); },300)
    }

    close_chat(){
        if(taixiu.box_chat!=null) $(taixiu.box_chat).remove();
    }
}

var taixiu=new TaiXiu_MD5();