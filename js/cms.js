cms.view_history_play_user=()=>{
    var user=cms.data_select;
    cr.msg_loading();
    cr_realtime.list_one("lich_su_danh_kh",datas=>{
        var list_member=[];
        let p=cms.get_post_by_id_collection("lich_su_danh_kh");
        $.each(datas,function(index,m){
            if(m.username==user.username) list_member.push(m);
        })
        
        list_member.sort(function(a, b) {
            return new Date(b['date']) - new Date(a['date']);
        });
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
            html_page+='<p>Tổ số giao dịch : <b id="money_vao_count"><i class="fas fa-spinner fa-spin"></i> đang xử lý</b></p>';
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
    html_page+='<p>Tổ số giao dịch : <b id="money_ra_count"><i class="fas fa-spinner fa-spin"></i> đang xử lý</b></p>';
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
    html_page+='<p>Tổ số giao dịch : <b id="money_tong_count"><i class="fas fa-spinner fa-spin"></i> đang xử lý</b></p>';
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

    var vao_count=0;
    var ra_count=0;

    cr_realtime.list_one("lich_su_danh_kh",datas=>{
        $.each(datas,function(index,m){
            money_vao+=parseInt(m.money);
        });
        $("#money_vao").html(formatVND(money_vao));
        vao_count=datas.length;
        $("#money_vao_count").html(vao_count);
        
        cr_realtime.list_one("lich_su_chuyen_kh",datas=>{
            $.each(datas,function(index,m){
                money_ra+=parseInt(m.money);
            });
            $("#money_ra").html(formatVND(money_ra));
            ra_count=datas.length;
            $("#money_ra_count").html(ra_count);
            var money_tong=money_vao-money_ra;
            var count_pay=vao_count+ra_count;
            $("#money_tong").html(formatVND(money_tong));
            $("#money_tong_count").html(count_pay);
        });
    });
}