cms.view_history_play_user=()=>{
    var user=cms.data_select;
    cr.msg_loading();
    cr_realtime.list_one("lich_su_danh_kh",datas=>{
        var list_member=[];
        var p=cms.get_post_by_id_collection("lich_su_danh_kh");
        $.each(datas,function(index,m){
            if(m.username==user.username) list_member.push(m);
        })
        
        list_member.sort(function(a, b) {
            return new Date(b['date']) - new Date(a['date']);
        });
        p.label="Lịch sử chơi của ("+user.username+")";
        cms.msg_collection_data(p,["username","game","money"],list_member);
    });
};


cms.doangthu=()=>{
    var html_page='<h1 class="h3 mt-3">Doanh thu lời</h3>';
    html_page+='<div class="row text-center">';
    html_page+='<div class="col-6">';
    html_page+='<div class="card">';
        html_page+='<div class="card-header">';
        html_page+='Tiền Vào';
        html_page+='</div>';
        html_page+='<div class="card-body">';
            html_page+='Tổ số tiền vào:<h1 id="money_vao"><i class="fas fa-spinner fa-spin"></i> đang xử lý</h1> <span class="text-muted">vnđ</span>';
        html_page+='</div>';
    html_page+='</div>';
    html_page+='</div>';

    html_page+='<div class="col-6">';
    html_page+='<div class="card">';
    html_page+='<div class="card-header">';
    html_page+='Tiền Ra';
    html_page+='</div>';
    html_page+='<div class="card-body">';
    html_page+='Tổ số tiền ra:<h1 id="money_ra" class="text-danger"><i class="fas fa-spinner fa-spin"></i> đang xử lý</h1> <span class="text-muted">vnđ</span>';
    html_page+='</div>';
    html_page+='</div>';
    html_page+='</div>';

    html_page+='<div class="row  text-center mt-5">';
    html_page+='<div class="col-12">';
    html_page+='<div class="card">';
    html_page+='<div class="card-header">';
    html_page+='Tiền Lời';
    html_page+='</div>';
    html_page+='<div class="card-body">';
    html_page+='Tổ doanh thu lời:<h1 id="money_tong" class="text-success"><i class="fas fa-spinner fa-spin"></i> đang xử lý</h1> <span class="text-muted">vnđ</span>';
    html_page+='</div>';
    html_page+='</div>';
    html_page+='</div>';
    $("main").html(html_page);

    function formatVND(number) {
        if (typeof number !== 'number') {
            number = parseFloat(number);
            if (isNaN(number)) return '0 đ';
        }
        
        return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace("₫", "đ");
    }

    var money_vao=0;
    var money_ra=0;
    cr_realtime.list_one("lich_su_danh_kh",datas=>{
        $.each(datas,function(index,m){
            money_vao+=parseInt(m.money);
        });
        $("#money_vao").html(formatVND(money_vao));
        
        cr_realtime.list_one("lich_su_chuyen_kh",datas=>{
            $.each(datas,function(index,m){
                money_ra+=parseInt(m.money);
            });
            $("#money_ra").html(formatVND(money_ra));
            var money_tong=money_vao-money_ra;
            $("#money_tong").html(formatVND(money_tong));
        });
    });
}