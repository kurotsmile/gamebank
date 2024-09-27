class Web{

    ver="0.6";
    isToggleSidebar=true;
    tap_game="home_cltx";
    box=null;
    user_login=null;

    onLoad(){
        cr.get_json("config.json",(config_data)=>{
            cr_firestore.id_project = config_data.id_project;
            cr_firestore.api_key = config_data.api_key;
            cr_user.id_collection="member";

            if(localStorage.getItem("user")!=null) w.user_login=JSON.parse(localStorage.getItem("user"));
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
        if(id=="home") cr.change_title("Trang chủ","?page="+id);
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

        cr.get("page/"+id+".html?v="+w.ver,(data)=>{
            $("#page_contains").html(data);
            w.menu_top();
            if(act_done) act_done();
        });
    }

    menu_top(){
        cr.get("page/menu_top.html?v="+w.ver,(data)=>{
            $("#profile__tabs").html(data);
        });
    }

    show_game_tap(id){
        w.tap_game=id;
        w.show_page("home",()=>{
            cr.get("page/"+id+".html?v="+w.ver,(data)=>{
                $("#game_dashboar").html(data);
                if(w.user_login==null)
                    w.load_home_box("#game_dashboar_bank","home_box_bank_no_user.html");
                else
                    w.load_home_box("#game_dashboar_bank","home_box_bank.html");
                w.update_menu_game_tap();
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
            <div class="sidebar__user-img"><img src="images/avatar.png" alt="${w.user_login.username}"></div>
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
}

var w=new Web();

$(document).ready(function() {
    w.onLoad();
});