class Web{

    ver="1.37";
    isToggleSidebar=true;
    tap_game="home_cltx";
    box=null;
    user_login=null;

    onLoad(){
        cr.get_json("config.json?v="+w.ver,(config_data)=>{
            cr.ver=w.ver;
            cr_firestore.id_project = config_data.id_project;
            cr_firestore.api_key = config_data.api_key;
            cr.site_url=config_data.site_url;
            cr_realtime.config=config_data;
            cr_realtime.onLoad(config_data);
            cr_user.id_collection="member";
            
            if(localStorage.getItem("user")!=null) w.user_login=JSON.parse(localStorage.getItem("user"));
            
            cr.show_menu_list("#menu_main","menu",()=>{
                w.update_info_user_login();

                var page=cr.arg("page");
                if(page){
                    if(page=="home")
                        w.show_home();
                    else
                        w.show_page(page);
                }else{
                    w.show_home();
                }

                w.show_msg_welcome();
            });
        });
    }

    show_home(){
        w.show_game_tap(w.tap_game);
    }

    update_info_user_login(){
        if(w.user_login!=null){
            $("#sidebar_user_info").show();
            $("#sidebar_item_logout").show();
            $("#sidebar_item_bank").show();
            $("#sidebar_item_changepassword").show();
            $("#sidebar_user_info").append(w.sidebar_item_user());
            $("#sidebar_item_login").hide();
            $("#sidebar_item_register").hide();
        }else{
            $("#sidebar_user_info").empty();
            $("#sidebar_user_info").hide();
            $("#sidebar_item_logout").hide();
            $("#sidebar_item_bank").hide();
            $("#sidebar_item_changepassword").hide();
            $("#sidebar_item_register").show();
            $("#sidebar_item_login").show();
        }
    }

    show_page(id,act_done=null){
        cr.top();
        if(id=="home") cr.change_title("Trang chủ","");
        if(id=="gifts") cr.change_title("Mã Quà Tặng","?page="+id);
        if(id=="bank") cr.change_title("Cài Đặt Bank","?page="+id);
        if(id=="missions") cr.change_title("Nhiệm Vụ Ngày","?page="+id);
        if(id=="jackpots") cr.change_title("Nổ Hũ","?page="+id);
        if(id=="refunds") cr.change_title("Hoàn Cược","?page="+id);
        if(id=="musters") cr.change_title("Điểm Danh","?page="+id);
        if(id=="fans") cr.change_title("Fan Miễn Phí","?page="+id);
        if(id=="referrals") cr.change_title("Giới Thiệu Người Chơi","?page="+id);
        if(id=="consecutives") cr.change_title("Chuỗi Cược Ngày","?page="+id);
        if(id=="history") cr.change_title("Lịch Sử Chơi","?page="+id);
        if(id=="telegram") cr.change_title("Liên Kết Telegram","?page="+id);
        if(id=="change_password") cr.change_title("Đổi mật khẩu","?page="+id);
        if(id=="xsmb") cr.change_title("XSMB Lô Đề 6H30","?page="+id);
        if(id=="chim") cr.change_title("Thức ăn cho chim","?page="+id);
        if(id=="bongda") cr.change_title("Cá cược bóng đá","?page="+id);

        cr.get("page/"+id+".html?v="+w.ver,(data)=>{
            $("#page_contains").html(w.data_template(data));
            w.menu_top();
            w.update_func_page(id);
            if(act_done==null) w.update_copy();
            if(act_done) act_done();
        });
    }

    update_func_page(id_page){
        if(id_page=="home") w.func_for_home();
        if(id_page=="bank") w.func_for_bank();
        if(id_page=="change_password") w.func_for_change_password();
        if(id_page=="missions") w.func_for_missions();
        if(id_page=="consecutives") w.func_for_consecutives();
        if(id_page=="chim"||id_page=="bongda"||id_page=="xsmb"){
            var id_collection='';
            if(id_page=="xsmb") id_collection="bongda";
            else id_collection=id_page;
            cr_firestore.get("setting","setting_"+id_collection,datas=>{
                if(id_page=="gifts"){
                    $("#gifts_link_fb").attr("href",datas.link_fb);
                    $("#gifts_link_telegram").attr("href",datas.link_telegram);
                }else{
                    $("#link_page_fb").attr("href",datas.link_fb);
                    $("#link_page_fb").html(datas.link_fb);
                    $("#link_page_telegram").attr("href",datas.link_telegram);
                    $("#link_page_telegram").html(datas.link_telegram);
                }
                setTimeout(()=>{
                    w.show_msg(datas.msg);
                },1000);
            });
        }
        w.update_menu_main(id_page);
    }

    update_menu_main(id_page){
        $(".cr_menu_item").removeClass("nav-link--active");
        if($("#sidebar_item_"+id_page).length>0) $("#sidebar_item_"+id_page).addClass("nav-link--active");
    }

    func_for_home(){

        function formatVND(number) {
            if (typeof number !== 'number') {
                number = parseFloat(number);
                if (isNaN(number)) return '0 đ';
            }
            
            return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace("₫", "đ");
        }
        
        function history_item_ketqua(data){
            if(data=="0")
                return '<span class="gstatus not-done bg-success">Thắng - Chờ trả thưởng</span>';
            else if(data=="1")
                return '<span class="gstatus not-done bg-success">Thắng - Đã trả thưởng</span>';
            else
                return '<span class="gstatus not-done bg-warning">Thua</span>';
        }

        function historyBet(data){
            var emp=$(`
                <tr>
                    <td><div class="dashbox__table-text">${data.username}</div></td>
                    <td><div class="dashbox__table-text">${data.game}</div></td>
                    <td><div class="dashbox__table-text">${data.receiving_bank}</div></td>
                    <td><div class="dashbox__table-text">${formatVND(data.money)}</div></td>
                    <td>${history_item_ketqua(data.status)}</td>
                    <td><div class="dashbox__table-text">${data.date}</td>
                </tr>
            `);
            return emp;
        }

        function history_item(data){
            var emp=$(`
                <tr>
                    <td><div class="dashbox__table-text">${data.username}</div></td>
                    <td><div class="dashbox__table-text">${formatVND(data.money)}</div></td>
                    <td><div class="dashbox__table-text">${data.game}</div></td>
                    <td>${history_item_ketqua(data.status)}</td>
                    <td><div class="dashbox__table-text">${data.date}</td>
                </tr>
            `);
            return emp;
        }

        $("#historyData").html('<tr><td class="text-white"><i class="fa-solid fa-spinner fa-spin"></i> Loading..<td></tr>');
        cr_realtime.list("lich_su_danh_kh",datas=>{
            w.sortArrayByDate(datas,'date')
            $("#historyData").empty();
            $("#historyBet").empty();
            $.each(datas,function(index,history){
                if(w.user_login!=null){
                    if(history.username==w.user_login.username){
                        $("#historyBet").append(historyBet(history));
                    }
                }
                $("#historyData").append(history_item(history));
            });
        });
    }
    
    func_for_missions(){
        function missions_item(data,status_bet=0){
            function s_bet(status){
                if(status==0) 
                    return '<span class="gstatus not-done">CHƯA ĐẠT</span>';
                else 
                    return '<span class="gstatus not-done bg-success">ĐẠT</span>';
            }
            var emp=$(`
                <tr>
                    <td>${data.milestone}</td>
                    <td>${data.reward}</td>
                    <td>${s_bet(status_bet)}</td>
                </tr>
            `);
            return emp;
        }

        function list_mission(cur_money=0){
            $("#data_table_missions").html('<tr><td class="text-white"><i class="fa-solid fa-spinner fa-spin"></i> Loading..<td></tr>');
            cr_firestore.list("daily_missions",datas=>{
                datas.sort(function(a, b) { return parseInt(a.order) - parseInt(b.order);});
                $("#data_table_missions").empty();
                $.each(datas,function(index,missions){
                    var status=0;
                    var cur_bet=parseInt(missions.milestone.replace(/,/g, ""));
                    if(cur_bet<=cur_money)
                        status=1;
                    else
                        status=0;
                    $("#data_table_missions").append(missions_item(missions,status));
                });
            });
        }

        if(w.user_login!=null){
            var cont_best=0;
            var money_best=0;
            cr_realtime.list_one("lich_su_danh_kh",datas=>{
                $.each(datas,function(index,b){
                    if(b.username==w.user_login.username){
                        cont_best++;
                        money_best+=parseInt(b.money);
                    }
                });
                $("#m_count_bet").html(cont_best);
                list_mission(money_best);
            });
        }else{
            list_mission();
        }
    }

    func_for_consecutives(){

        let longestWinStreak = 0;
        let longestLoseStreak = 0;
        let currentWinStreak = 0;
        let currentLoseStreak = 0;

        if(w.user_login!=null){
            cr_realtime.list_one("lich_su_danh_kh",datas=>{
                $.each(datas,function(index,b){
                    if(b.status=="2"){
                        currentLoseStreak++;
                        currentWinStreak = 0;
                    }else{
                        currentWinStreak++;
                        currentLoseStreak = 0; 
                    }
                });

                if (currentWinStreak > longestWinStreak)longestWinStreak = currentWinStreak;
                if (currentLoseStreak > longestLoseStreak) longestLoseStreak = currentLoseStreak;

                $("#longestWinStreak").html(longestWinStreak);
                $("#longestLoseStreak").html(longestLoseStreak);

                $(".ss_thang").each(function(index,t){
                    var count=parseInt($(t).data("count"));
                    if(count<=longestWinStreak)
                        $(t).html("ĐẠT").addClass("bg-success");
                    else
                        $(t).html("CHƯA ĐẠT");
                });

                $(".ss_thua").each(function(index,t){
                    var count=parseInt($(t).data("count"));
                    if(count<=longestLoseStreak)
                        $(t).html("ĐẠT").addClass("bg-success");
                    else
                        $(t).html("CHƯA ĐẠT");
                });
            });
        }
    }

    func_for_bank(){
        var cr_bank_name=$("#cr_bank_name");
        var cr_bank_account_number=$("#cr_bank_account_number");
        var cr_bank_account_name=$("#cr_bank_account_name");

        cr_firestore.get("member",w.user_login.id_doc,(data)=>{
            if(cr.alive(data.bank_name)) cr_bank_name.val(data.bank_name);
            if(cr.alive(data.bank_account_number)) cr_bank_account_number.val(data.bank_account_number);
            if(cr.alive(data.bank_account_name)) cr_bank_account_name.val(data.bank_account_name);
        });

        $("#btn_update_bank").click(()=>{

            if(cr_bank_name.val().trim()==""){
                cr.msg("Vui lòng nhập tên ngân hàng!","Cài đặt ngân hàng","warning");
                return false;
            }

            if(cr_bank_account_number.val().trim()==""){
                cr.msg("Vui lòng nhập số tài khoản ngân hàng!","Cài đặt ngân hàng","warning");
                return false;
            }

            if(cr_bank_account_name.val().trim()==""){
                cr.msg("Vui lòng nhập tên tài khoản ngân hàng!","Cài đặt ngân hàng","warning");
                return false;
            }

            w.user_login["bank_name"]=cr_bank_name.val();
            w.user_login["bank_account_number"]=cr_bank_account_number.val();
            w.user_login["bank_account_name"]=cr_bank_account_name.val();

            cr_firestore.update(w.user_login,"member",w.user_login.id_doc,()=>{
                cr.msg("Cập nhật thành công!","Cài đặt ngân hàng","success");
                return false;
            },()=>{
                cr.msg("Lỗi cập nhật! vui lòng thử lại sau!","Cài đặt ngân hàng","error");
                return false;
            });
        });
    }

    func_for_change_password(){
        var cr_oldpassword=$("#cr_oldpassword");
        var cr_password=$("#cr_password");
        var cr_rpassword=$("#cr_rpassword");

        $("#btn_update_password").click(()=>{
            if(cr_oldpassword.val().trim()==""){
                cr.msg("Vui lòng nhập mật khẩu hiện tại","Đổi mật khẩu","warning");
                return false;
            }
    
            if(cr_password.val().trim()==""){
                cr.msg("Vui lòng nhập mật khẩu mới","Đổi mật khẩu","warning");
                return false;
            }
            
            if(cr_password.val().trim()!=cr_rpassword.val().trim()){
                cr.msg("Mật khẩu không trùng khớp!","Đổi mật khẩu","warning");
                return false;
            }

            if(cr_oldpassword.val().trim()!=w.user_login.password){
                cr.msg("Mật khẩu hiện tại không đúng!","Đổi mật khẩu","warning");
                return false;
            }

            if(cr_password.val().trim()==w.user_login.password){
                cr.msg("Vui lòng nhập mật khẩu mới khác với mật khẩu hiện tại!","Đổi mật khẩu","warning");
                return false;
            }

            cr_user.change_password(w.user_login.id_doc,cr_password.val(),(data)=>{
                if(data.status=="success"){
                    w.user_login.password=cr_password.val();
                    cr.msg("Cập nhật mật khẩu thành công!","Đổi mật khẩu","success");
                }else{
                    cr.msg("Cập nhật mật khẩu thất bại!","Đổi mật khẩu","success");
                }
                return false;
            });
            
            return false;
        });
    }

    menu_top(){
        cr.get("page/menu_top.html?v="+w.ver,(data)=>{
            $("#profile__tabs").html(data);
        });
    }

    data_template(data){
        var u_name='username';
        var template = Handlebars.compile(data);
        if(w.user_login!=null) u_name=w.user_login.username;
        return template({username:u_name,url:cr.site_url});
    }

    maskString(input) {
        if (input.length > 3) {
            let lastThree = input.slice(-3);
            let masked = '*'.repeat(input.length - 3) + lastThree;
            return masked;
        } else {
            return input;
        }
    }
    
    show_game_tap(id){
        w.tap_game=id;
        w.show_page("home",()=>{
            w.update_menu_main("home");
            cr.get("page/"+id+".html?v="+w.ver,(data)=>{
                $("#game_dashboar").html(w.data_template(data));
                if(w.user_login==null){
                    w.load_home_box("#game_dashboar_bank","home_box_bank_no_user.html");
                    w.load_home_box("#game_dashboar_history","home_box_history_no_user.html");
                }
                else{
                    w.load_home_box("#game_dashboar_bank","home_box_bank.html",()=>{
                        function bank_item(data){
                            var emp_item=$(`
                                <tr>
                                    <td><div class="dashbox__table-text">${data.name}</div></td>
                                    <td><div class="dashbox__table-text"><span>${w.maskString(data.account_number)}&nbsp;<a class="copy-text" data-clipboard-text="${data.account_number}"><i class="fa-regular fa-clipboard fs-10"></i></a></span> </div></td>
                                    <td><div class="dashbox__table-text">${data.account_name}</div></td>
                                    <td><div class="dashbox__table-text">${data.min}</div></td>
                                    <td><div class="dashbox__table-text">${data.max}</div></td>
                                    <td><button style="background-color:var(--main-color)" class="qrc catalog__btn catalog__btn--banned"><i class="fa-solid fa-qrcode"></i></button></td>
                                </tr>
                            `);
                            
                            $(emp_item).find(".qrc").click(()=>{
                                var html='<img style="width:100%" src="'+data.qr_code+'"/>';
                                cr.msg(html,"Mã QR");
                                return false;
                            });
                            return emp_item;
                        }

                        $("#bankData").html('<tr><td class="text-white"><i class="fa-solid fa-spinner fa-spin"></i> Loading..<td></tr>');
                        cr_realtime.list("receiving_bank",datas=>{
                            datas.sort(function(a, b) { return parseInt(a.order) - parseInt(b.order);});
                            $("#bankData").empty();
                            $.each(datas,function(index,bank){
                                $("#bankData").append(bank_item(bank));
                            });
                        });
                    });
                    w.load_home_box("#game_dashboar_history","home_box_history.html");
                }
                w.update_menu_game_tap();
                w.update_copy();
            },()=>{
                w.show_game_tap(w.tap_game);
            });
        });
    }

    load_home_box(id_emp,url_html_box=null,act_done=null){
        cr.get("page/"+url_html_box+"?v="+w.ver,(data)=>{
            $(id_emp).html(data);
            if(act_done) act_done();
        });
    }

    update_menu_game_tap(){
        $(".games").removeClass("active");
        $("#game_tap_"+w.tap_game).addClass("active");
    }

    toggle_sidebar(){
        if (w.isToggleSidebar) {
            $('.sidebar').css('transform', 'translate3d(0, 0, 0)');
        } else {
            $('.sidebar').css('transform', 'translate3d(-280px, 0, 0)');
        }
        w.isToggleSidebar = !w.isToggleSidebar;
    }

    show_login(){
        cr.msg_loading();
        cr.get("page/login.html?v="+w.ver,(data)=>{
            Swal.close();
            $("#preloader").show();
            if(w.box!=null){
                $(w.box).remove();
                w.box=null;
            }
            w.box=$(data);
            $(w.box).find("#cr_login_btn").click(()=>{
                var username=$(w.box).find("#cr_login_username").val();
                var password=$(w.box).find("#cr_login_password").val();
                cr.msg_loading();
                cr_user.login(username,password,(data)=>{
                    if(data.status=="login_success"){
                        localStorage.setItem("user",JSON.stringify(data.user));
                        w.user_login=data.user;
                        Swal.close();
                        w.box_close();
                        w.show_home();
                        w.update_info_user_login();
                        cr.msg("Đăng nhập thành công!","Đăng nhập","success");
                        w.show_msg_welcome();
                    }else{
                        cr.msg("Vui lòng kiểm tra lại thông tin đăng nhập!","Đăng nhập không thành công!","warning");
                    }
                });
                return false;
            });
            $("body").append(w.box);
        });
    }

    show_register(){
        cr.msg_loading();
        cr.get("page/register.html?v="+w.ver,(data)=>{
            Swal.close();
            $("#preloader").show();
            if(w.box!=null){
                $(w.box).remove();
                w.box=null;
            }
            w.box=$(data);
            $(w.box).find("#cr_btn_register").click(()=>{
                var cr_reg_username=$(w.box).find("#cr_reg_username").val();
                var cr_reg_password=$(w.box).find("#cr_reg_password").val();
                var cr_reg_rpassword=$(w.box).find("#cr_reg_rpassword").val();

                if(cr_reg_username.trim()==""){
                    cr.msg("Vui lòng nhập tên đăng nhập","Đăng ký","warning");
                    return false;
                }

                if(cr_reg_password.trim()==""){
                    cr.msg("Vui lòng nhập mật khẩu!","Đăng ký","warning");
                    return false;
                }

                if(cr_reg_password!=cr_reg_rpassword){
                    cr.msg("Mật khẩu không trùng khớp!","Đăng ký","warning");
                    return false;
                }

                cr.msg_loading();
                cr_user.check_username(cr_reg_username,(data)=>{
                    if(data.status=="no_user"){
                        var data_user={};
                        data_user["username"]=cr_reg_username;
                        data_user["password"]=cr_reg_password;
                        cr_firestore.add(data_user,"member",()=>{
                            cr.msg("Đăng ký thành công! Bạn có thể đăng nhập vào hệ thống với các thông tin đã đăng ký!","Đăng ký","success");
                            w.box_close();
                            return false;
                        },()=>{
                            cr.msg("Lỗi hệ thống! xin vui lòng đăng ký lại!","Đăng ký","error");
                            return false;
                        });
                    }else if(data.status=="user_ready"){
                        cr.msg("Tên đăng nhập đã tồn tại!","Đăng ký","warning");
                        return false;
                    }else{
                        cr.msg("Lỗi hệ thống! xin vui lòng đăng ký lại!","Đăng ký","error");
                        return false;
                    }
                });
            });
            $("body").append(w.box);
        });
    }

    box_close(){
        if(w.box!=null) $(w.box).remove();
        w.box=null;
        $("#preloader").hide();
    }

    sidebar_item_user(){
        var box_user=$(`
            <div class="sidebar__user-img"><img src="images/avatar_user.png?=${w.ver}" alt="${w.user_login.username}"></div>
            <div class="sidebar__user-title"><span>Xin chào</span><p>${w.user_login.username}</p></div>
            <div role="button" onclick="w.logout()" class="sidebar__user-btn" href="#" id="cr_user_logouts"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="log-out" style="fill:none !important; color: #fff" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg></div>
        `);
        return box_user;
    }

    logout(){
        cr.msg("Đã đăng xuất!","Đăng xuất tài khoản","success");
        w.user_login=null;
        localStorage.removeItem("user");
        w.update_info_user_login();
        w.show_home();
    }

    update_copy(){
        var clipboard = new ClipboardJS('.copy-text');

        clipboard.off('success');
        clipboard.on('success', function(e) {
            cr.msg("Đã sao chép: "+e.text,"Copied","success");
            e.clearSelection();
        });

        clipboard.off('error');
        clipboard.on('error', function(e) {
            cr.msg("Sao chép lỗi","Copied","error");
        });
    }

    sortArrayByDate(arr, key) {
        return arr.sort(function(a, b) {
            return new Date(b[key]) - new Date(a[key]);
        });
    }

    show_msg(t_body=""){
        var html='';
        html+='<div class="toast toast-ctv" id="toast-ctv" style="display: block;">';
            html+='<div class="toast-body text-center">';
                html+='<div class="w-100">';
                    html+='<img class="w-100" src="images/logo_cl.png" alt=""> <span class="comments__name">BANKCL THÔNG BÁO</span>';
                html+='</div>';

                html+='<div class="w-100" id="w_msg_body"></div>';
                html+='<div class="mt-3 pt-3 border-top"><button onclick=";return false;" type="button" class="close-tctv">ĐÓNG</button></div>';
            html+='</div>';
        html+='</div>';

        var emp_box=$(html);
        $(emp_box).find("#w_msg_body").html(t_body);

        $(emp_box).find(".close-tctv").click(()=>{
            $('#toast-ctv').hide();
        });

        if($("#toast-ctv").length>0) $("#toast-ctv").remove();
        $("body").append(emp_box);
    }

    show_msg_welcome(){
        cr_firestore.get("setting","setting_site",datas=>{
            w.show_msg(datas.msg);
        },()=>{
            w.show_msg_welcome();
        });
    }
}

var w=new Web();

$(document).ready(function() {
    w.onLoad();
});