class Web{

    ver="0.5";
    isToggleSidebar=true;
    tap_game="home_cltx";
    box=null;
    user_login=null;

    onLoad(){
        var page=cr.arg("page");
        if(page){
            if(page=="home")
                w.show_home();
            else
                w.show_page(page);
        }else{
            w.show_home();
        }   
    }

    show_home(){
        w.show_game_tap(w.tap_game);
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
        cr.get("page/login.html",(data)=>{
            Swal.close();
            $("#preloader").show();
            if(w.box!=null){
                $(w.box).remove();
                w.box=null;
            }
            w.box=$(data);
            $("body").append(w.box);
        });
    }

    show_register(){
        cr.msg_loading();
        cr.get("page/register.html",(data)=>{
            Swal.close();
            $("#preloader").show();
            if(w.box!=null){
                $(w.box).remove();
                w.box=null;
            }
            w.box=$(data);
            $("body").append(w.box);
        });
    }

    box_close(){
        if(w.box!=null) $(w.box).remove();
        w.box=null;
        $("#preloader").hide();
    }
}

var w=new Web();

$(document).ready(function() {
    w.onLoad();
});