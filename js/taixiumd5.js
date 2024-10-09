class TaiXiu_MD5{
    emp_game=null;
    is_play=false;
    is_tai_bet=false;
    is_test_bet=true;
    is_hand=true;

    thread_game_play=null;
    thread_game_countdown=null;
    thread_game_pending_return=null;
    thread_game_return=null;
    thread_effect=null;

    array_history=[];

    total_bet_tai=0;
    total_bet_xiu=0;
    total_bet_min=100;
    total_bet_max=5000000000;

    total_user_tai=0;
    total_user_xiu=0;

    money_pending_bet=0;
    money_bet=0;
    length_history_bet=17;

    timeLeft_length=10;
    timeLeft =0;
    dice_total=0;

    id_session=null;
    data_session_cur=null;

    box_chat=null;
    box_msg=null;

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
        this.thread_effect=setInterval(taixiu.createGoldenDot, 2000);
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
            html_game+='<div class="btn">';
                html_game+='<img onclick="taixiu.info();" class="info" src="images/btn_info.png"/>';
                html_game+='<img onclick="taixiu.chart();" class="chart" src="images/btn_chart.png"/>';
                html_game+='<img onclick="taixiu.question();" class="question" src="images/btn_question.png"/>';
                html_game+='<img onclick="taixiu.history();" class="history" src="images/btn_history.png"/>';
            html_game+='</div>';
            html_game+='<div class="info">';
                html_game+='<div id="timer_session" class="timer_session">00:00</div>';
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
                html_game+='<div id="name_session" class="txt_session">#name session</div>';
                html_game+='<div id="total_user_xiu" class="txt_user xiu">0</div>';
                html_game+='<img id="txt_xiu" class="txt xiu" src="images/txt_xiu.png"/>';
                html_game+='<div id="txt_money_bet_total_xiu" class="txt_money_bet_total xiu">0</div>';
                html_game+='<div id="btn-bet-xiu"  role="button" class="btn-bet xiu" onclick="taixiu.show_bet(false);return false;"></div>';
                html_game+='<div id="txt_money_bet_xiu" class="txt_money_bet">0</div>';
            html_game+='</div>';
            html_game+='<div class="btn">';
                html_game+='<img onclick="taixiu.close();" class="close" src="images/btn_close.png"/>';
                html_game+='<img onclick="taixiu.rank();" class="rank" src="images/btn_rank.png"/>';
                html_game+='<img onclick="taixiu.show_chat();" class="chat" src="images/btn_chat.png"/>';
                html_game+='<img id="btn_dice_hand" onclick="taixiu.hand();" class="hand" src="images/btn_hand_used.png"/>';
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
        $("#name_session").html("#"+cr.create_id(10));
   
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
        if(this.thread_effect!=null) clearInterval(this.thread_effect);
        taixiu.is_play=false;
        $("#preloader").hide();
        $("#dice_history").html("");
        $(taixiu.emp_game).remove();
        taixiu.clear_thread();
        if(taixiu.box_chat) $(taixiu.box_chat).remove();
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
        
        if(taixiu.box_chat!=null) $(taixiu.box_chat).remove();
        var box_chat='';
        box_chat+='<div id="tx_chat">';
        box_chat+='<div onclick="taixiu.close_chat()" class="btn_close"></div>';
        box_chat+='<div id="tx_chat_all_item"></div>';
        box_chat+='<input type="text" value="" placeholder="Nhập nội dung trò chuyện vào đây..." id="tx_inp_chat"/>';
        box_chat+='<img id="btn_send" onclick="taixiu.send_chat()" src="images/btn_send.png">';
        box_chat+='</div>';
        taixiu.box_chat=$(box_chat);

        $(taixiu.box_chat).find('#tx_inp_chat').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                taixiu.send_chat();
            }
        });
        $("body").append(taixiu.box_chat);
        $("#tx_chat_all_item").html('<div class="w-100 text-white text-center"><i class="fas fa-spinner"></i> Loading...</div>');
        setTimeout(()=>{
            $("#tx_chat").draggable();
            cr_realtime.list("chat",chats=>{
                $("#tx_chat_all_item").html("");
                $.each(chats,function(index,c){
                    $("#tx_chat_all_item").append(taixiu.item_chat(c.username,c.msg));
                });
            });
        },300);
    }

    item_chat(username,msg){
        var html='<div class="chat_item"><b class="username">'+username+':</b> <div class="text-white msg">'+msg+'</div></div>';
        return html;
    }

    send_chat(){
        var u_username='';
        var tx_inp_chat=$("#tx_inp_chat");
        var message = $(tx_inp_chat).val();
        if (message.trim() !== "") {
            if(w.user_login!=null)
                u_username=w.user_login.username;
            else
                u_username='Ẩn danh';

            $(tx_inp_chat).val('');
            
            var obj_chat={};
            obj_chat["username"]=u_username;
            obj_chat["date"]=cr.getDateCur();
            obj_chat["msg"]=message;
            obj_chat["id"]="c"+cr.create_id(10);
            obj_chat["id_doc"]=obj_chat.id;
            cr_realtime.add("chat",obj_chat.id,obj_chat,()=>{
                $('#tx_chat_all_item').scrollTop($('#tx_chat_all_item')[0].scrollHeight);
            });
        }
    }

    close_chat(){
        if(taixiu.box_chat!=null) $(taixiu.box_chat).remove();
    }

    info(){
        var html_info='';
        html_info+='<p>Trò chơi Tài Xỉu MD5 là một trò chơi truyền thống nhưng với cách thức vận hành hiện đại và minh bạch hơn nhờ ứng dụng công nghệ mã hóa MD5. Trò chơi mang đến trải nghiệm quen thuộc của tài xỉu, nhưng với sự đảm bảo tính công bằng và tránh lừa đảo cho người chơi.</p>';
        html_info+='<p>Cơ chế xác thực bằng mã hóa MD5</p>';
        html_info+='<p>Một điểm nổi bật của Tài Xỉu MD5 là cơ chế xác thực kết quả phiên chơi dựa trên thuật toán mã hóa MD5, giúp người chơi tin tưởng vào tính minh bạch và độ tin cậy của trò chơi.</p>';
        html_info+='<p>Mã hóa phiên bằng MD5: Mỗi phiên chơi sẽ được mã hóa bằng một chuỗi MD5 cố định ngay từ khi phiên bắt đầu, đảm bảo rằng kết quả không thể bị thay đổi sau khi đã công bố. Người chơi có thể kiểm tra tính xác thực của kết quả bằng cách sao chép chuỗi MD5 phiên đã mã hóa.</p>';
        html_info+='<p>Kiểm tra mã MD5: Sau khi phiên kết thúc, người chơi có thể sao chép chuỗi mã MD5 và vào trang web https://md5.cz/ để kiểm tra xem chuỗi đó có khớp với kết quả mà trò chơi đã công bố hay không. Nếu chuỗi mã trùng khớp, điều đó chứng minh rằng kết quả phiên chơi là chính xác và không bị can thiệp.</p>';
        html_info+='<p>Cách kiểm tra mã MD5:</p>';
        html_info+='<p>Sao chép chuỗi mã MD5: Khi kết thúc một phiên, trò chơi sẽ cung cấp cho người chơi chuỗi mã MD5 liên quan đến kết quả của phiên đó.</p>';
        html_info+='<p>Truy cập trang web kiểm tra MD5: Người chơi có thể truy cập trang web https://md5.cz/ để kiểm tra.</p>';
        html_info+='<p>Dán mã MD5 vào ô kiểm tra trên trang web và bấm "Tính toán". Trang web sẽ so sánh kết quả mã MD5 với chuỗi bạn cung cấp.</p>';
        html_info+='<p>Đối chiếu kết quả: Nếu chuỗi mã MD5 trùng khớp với kết quả công bố, trò chơi đã diễn ra công bằng và không có bất kỳ sự thao túng nào.</p>';
        html_info+='<p>Tính minh bạch và bảo mật</p>';
        html_info+='<p>Với cơ chế mã hóa MD5, Tài Xỉu MD5 đảm bảo rằng kết quả mỗi phiên chơi đều đã được xác định và không thể thay đổi. Người chơi hoàn toàn có thể tự mình kiểm chứng độ chính xác của trò chơi, tránh được mọi tình trạng lừa đảo hoặc thay đổi kết quả không mong muốn.</p>';
        html_info+='<p>Hãy tham gia ngay Tài Xỉu MD5 để trải nghiệm cảm giác hồi hộp của trò chơi và sự yên tâm về tính công bằng mà công nghệ mã hóa hiện đại mang lại!</p>';
        this.msg(html_info,"Thông tin");
    }

    msg(msg="",title="info"){
        if(taixiu.box_msg!=null) $(taixiu.box_msg).remove();
        var html='';
        html+='<div id="tx_msg">';
            html+='<div class="btn_close"></div>';
            html+='<div class="title">'+title+'</div>';
            html+='<div class="msg_body">';
                html+='<div class="txt">'+msg+'</div>';
            html+='</div>';
        html+='</div>';
        taixiu.box_msg=$(html);
        $(taixiu.box_msg).find(".btn_close").click(()=>{
            taixiu.close_msg();
        });
        $("body").append(taixiu.box_msg);

        setTimeout(()=>{
            $("#tx_msg").draggable({
                start: function(event, ui) {
                    $(this).css('transform', 'none');
                },
                drag: function(event, ui) {
                },
                stop: function(event, ui) {

                }
            });
        },300);
    }

    close_msg(){
        if(taixiu.box_msg!=null) $(taixiu.box_msg).remove();
    }

    chart(){
        var html_c='';
        html_c+='<canvas id="myChart" style="width:100%;height:250px"></canvas>';
        this.msg(html_c,"Biểu đồ");
        var ctx = $("#myChart");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May'],
                datasets: [{
                    label: 'Sample Data',
                    data: [65, 59, 80, 81, 56],
                    borderColor: 'yellow',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    pointBackgroundColor: ['white', 'white', 'black', 'white', 'black'],
                    pointBorderColor: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow'],
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'yellow',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {color: '#FFFFFF'},
                        ticks: {color: '#FFFFFF'}
                    },
                    x:{
                        grid: {color: '#FFFFFF'},
                        ticks: {color: '#FFFFFF'}
                    }
                }
            }
        });
    }

    question(){
        var html_info='';
        html_info+='<p>1. Luật chơi cơ bản:</p>';
        html_info+='<p>Trò chơi sử dụng ba viên xí ngầu, mỗi viên có 6 mặt, tương ứng với các số từ 1 đến 6.</p>';
        html_info+='<p>Sau khi người chơi đặt cược, ba viên xí ngầu sẽ được tung. Kết quả của trò chơi dựa vào tổng điểm của ba viên xí ngầu này.</p>';
        html_info+='<p>2. Cách đặt cược:</p>';
        html_info+='<p>Tài (Lớn): Nếu tổng điểm của ba viên xí ngầu từ 11 đến 17, người chơi đặt vào cửa "Tài" sẽ thắng.</p>';
        html_info+='<p>Xỉu (Nhỏ): Nếu tổng điểm của ba viên xí ngầu từ 4 đến 10, người chơi đặt vào cửa "Xỉu" sẽ thắng.</p>';
        html_info+='<p>Nếu ba viên xí ngầu ra ba số giống nhau (ví dụ: 1-1-1, 6-6-6), đây là "Bộ Ba". Khi ra bộ ba, tất cả người chơi đặt cược vào "Tài" hoặc "Xỉu" đều thua, trừ khi đặt vào cửa Bộ Ba.</p>';
        html_info+='<p>3. Các hình thức đặt cược khác:</p>';
        html_info+='<p>Ngoài cược "Tài" và "Xỉu", người chơi có thể tham gia vào các kiểu cược khác như:</p>';
        html_info+='<p>Cược số cụ thể: Đặt cược vào một số cụ thể sẽ xuất hiện trên một hoặc nhiều viên xí ngầu.</p>';
        html_info+='<p>Cược tổng điểm: Người chơi có thể cược vào tổng điểm cụ thể của ba viên xí ngầu, với tỷ lệ thưởng khác nhau dựa trên xác suất xuất hiện.</p>';
        html_info+='<p>Cược bộ ba đồng nhất: Đặt cược rằng ba viên xí ngầu sẽ có cùng một số.</p>';
        html_info+='<p>Cược bộ đôi: Đặt cược rằng sẽ có hai viên xí ngầu ra cùng một số.</p>';
        html_info+='<p>4. Tỷ lệ thưởng:</p>';
        html_info+='<p>Cửa Tài/Xỉu: Tỷ lệ thưởng là 1:1. Nếu bạn đặt cược 100.000 VND, bạn sẽ nhận được 200.000 VND (bao gồm tiền gốc) nếu thắng.</p>';
        html_info+='<p>Cược số cụ thể: Tỷ lệ thưởng có thể lên đến 1:180 tùy thuộc vào loại cược.</p>';
        this.msg(html_info,"Cách chơi");
    }

    history(){
        this.msg("","Lịch sử cược");
    }

    rank(){
        this.msg("","Bảng xếp hạng");
    }

    createGoldenDot(){
        var l=Math.floor(Math.random() * 10) + 3;
       
           for (var i = 0; i < l; i++) {
               var $goldenDot = $('<div class="golden-dot"></div>');
               var w=Math.floor(Math.random() * 12) + 3;
               $('body').append($goldenDot);
               var startX = $('#dia').offset().left + 110;
               var startY = $('#dia').offset().top-140;
               $goldenDot.css({
                   left: startX + 'px',
                   top: startY + 'px',
                   width:w+'px',
                   height:w+'px'
               });
               var speed = 1500 + Math.random() * 1500;
               $goldenDot.animate({
                   top: startY - 300 + Math.random() * 100 + 'px', 
                   left: startX + Math.random() * 100 - 10 + 'px', 
                   opacity: 0  // Mờ dần
               }, speed, function() {
                   $(this).remove(); 
               });
           }
    }

    hand(){
        if(this.is_hand)
            this.is_hand=false;
        else
            this.is_hand=true;
        this.check_hand();
    }

    check_hand(){
        if(this.is_hand)
            $("#btn_dice_hand").attr("src","images/btn_hand_used.png");
        else
            $("#btn_dice_hand").attr("src","images/btn_hand.png");
    }
}

var taixiu=new TaiXiu_MD5();