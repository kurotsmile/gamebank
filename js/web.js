class Web{

    ver="0.1";

    onLoad(){
        var page=cr.arg("page");
        if(page)
            w.show_page(page);
        else
            w.show_page("home");
    }

    show_page(id){
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

        cr.get("page/"+id+".html?v="+w.ver,(data)=>{
            $("#page_contains").html(data);
            w.menu_top();
        });
    }

    menu_top(){
        cr.get("page/menu_top.html?v="+w.ver,(data)=>{
            $("#profile__tabs").html(data);
        });
    }
}

var w=new Web();

$(document).ready(function() {
    w.onLoad();
});