cms.formatVND=(number)=>{
    if (typeof number !== 'number') {
        number = parseFloat(number);
        if (isNaN(number)) return '0 đ';
    }
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace("₫", "đ");
}

cms.status_game=(s)=>{
    var html_status="";
    if(s=="0"){
        html_status+='<i class="fas fa-hourglass-start"></i> <small  class="bg-warning rounded p-1 text-white">Thắng</small> <small style="font-size:9px;">chờ trả thưởng</small>';
    }
    if(s==1){
        html_status+='<i class="fas fa-check-circle"></i> <small class="bg-success rounded p-1 text-white">Thắng</small> <small style="font-size:9px;">đã trả thưởng</small>';
    }
    if(s==2){
        html_status+='<i class="fas fa-skull"></i> <small class="bg-danger rounded p-1 text-white">Thua</small>';
    }
    return html_status;
}

cms.view_history_play_user=()=>{
    var user=cms.data_select;
    cr.msg_loading();
    cr_realtime.list_one("lich_su_danh_kh",datas=>{
        var list_member=[];
        let p=cms.get_post_by_id_collection("lich_su_danh_kh");
        $.each(datas,function(index,m){
            if(m.username==user.username){
                m["status"]=cms.status_game(m.status);
                list_member.push(m);
            }
        })
        
        list_member.sort(function(a, b) {
            return new Date(b['date']) - new Date(a['date']);
        });
        cms.msg_collection_data(p,["username","game","money","status"],list_member);
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

    var money_vao=0;
    var money_ra=0;

    var vao_count=0;
    var ra_count=0;

    cr_realtime.list_one("lich_su_danh_kh",datas=>{
        $.each(datas,function(index,m){
            money_vao+=parseInt(m.money);
        });
        $("#money_vao").html(cms.formatVND(money_vao));
        vao_count=datas.length;
        $("#money_vao_count").html(vao_count);
        
        cr_realtime.list_one("lich_su_chuyen_kh",datas=>{
            $.each(datas,function(index,m){
                money_ra+=parseInt(m.money);
            });
            $("#money_ra").html(cms.formatVND(money_ra));
            ra_count=datas.length;
            $("#money_ra_count").html(ra_count);
            var money_tong=money_vao-money_ra;
            var count_pay=vao_count+ra_count;
            $("#money_tong").html(cms.formatVND(money_tong));
            $("#money_tong_count").html(count_pay);
        });
    });
}

cms.table_render=()=>{
    $("#list_post_table tr").each(function(index,emp){
        var status_emp=$(emp).find(".col_t_status");
        var status=$(status_emp).html();
        $(status_emp).html(cms.status_game(status));
        if(status=="0"){
            var btn_chuyentien=$('<button class="btn btn-dark btn-sm"><i class="fas fa-hand-holding-usd"></i> Chuyển tiền</button>');
            $(btn_chuyentien).click(()=>{
                var id_data=$(emp).attr("id");
                cms.chuyentien(id_data);
                return false;
            });
            $(emp).find(".list_btn_tr").append(btn_chuyentien);
        }
    });
}


cms.lichsuthangthua=(status_view="1")=>{

    var html_page='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom mt-5">';
        html_page+='<h1 class="h2">Lịch sử Thắng/Thua</h1>';
            html_page+='<div class="btn-toolbar mb-2 mb-md-0">';
            html_page+='<div class="btn-group mr-2">';
                html_page+='<button onclick="cms.lichsuthangthua(\'1\');return false;" class="btn '+(status_view=="1"? "active":"")+' btn-sm btn-outline-secondary"><i class="fas fa-trophy"></i> Lịch sử thắng</button>';
                html_page+='<button onclick="cms.lichsuthangthua(\'2\');return false;" class="btn '+(status_view=="2"? "active":"")+' btn-sm btn-outline-secondary"><i class="fas fa-skull"></i> Lịch sử thua</button>';
            html_page+='</div>';
        html_page+='</div>';
    html_page+='</div>';

    html_page+='<div class="table-responsive">';
    html_page+='<table class="table table-linght table-sm table-striped table-hover">';

    html_page+='<thead>';
    html_page+='<tr>';
        html_page+='<th scope="col">Username</th>';
        html_page+='<th scope="col">Tiền cược</th>'
        html_page+='<th scope="col">Ngân hàng</th>';
        html_page+='<th scope="col">Kết quả</th>';
        html_page+='<th scope="col">Thời gian</th>';
    html_page+='</tr>';
    html_page+='</thead>';

    html_page+='<tbody id="all_item_history"></tbody>';
    html_page+='</table>';
    html_page+='</div>';
    $("main").html(html_page);

    cr_realtime.list("lich_su_danh_kh",datas=>{
        datas.sort(function(a, b) {
            return new Date(b['date']) - new Date(a['date']);
        });

        $.each(datas,function(index,d){
            var tr_item='<tr>';
            tr_item+='<td><i class="fas fa-user-astronaut"></i> '+d.username+'</td>';
            tr_item+='<td>'+cms.formatVND(d.money)+'</td>';
            tr_item+='<td><i class="fas fa-university"></i> '+d.receiving_bank+'</td>';
            tr_item+='<td>'+cms.status_game(d.status)+'</td>';
            tr_item+='<td>'+d.date+'</td>';
            tr_item+='</tr>';
            if(d.status==status_view) $("#all_item_history").append(tr_item);
        });
    });
}

cms.history_pay=()=>{
    var bank=cms.data_select;
    cr.msg_loading();
    cr_realtime.list_one("lich_su_chuyen_kh",datas=>{
        var list_member=[];
        let p=cms.get_post_by_id_collection("lich_su_chuyen_kh");
        $.each(datas,function(index,m){
            if(m.receiving_bank==bank.name){
                list_member.push(m);
            }
        })
        
        list_member.sort(function(a, b) {
            return new Date(b['date']) - new Date(a['date']);
        });
        cms.msg_collection_data(p,["username","game","money","date"],list_member);
    });
}

cms.chuyentien=(id_data_danh_kh)=>{
    cr.msg_loading();
    cr_realtime.getData("lich_su_danh_kh",id_data_danh_kh,data_kh=>{
        Swal.close();
        cms.data_kh_temp=data_kh;
        cms.p_temp=cms.get_post_by_id_collection("lich_su_chuyen_kh");
        cms.p_temp.js_act_done_frm='update_for_data_kh';
        $("main").html('');
        $("main").append(cms.p_temp.show_form_add());
        cms.collapse_box_add_show('none');
        $("#username").val(data_kh.username);
        $("#game").val(data_kh.game);
    });
}

cms.update_for_data_kh=(data)=>{
    alert(JSON.stringify(data));
    cms.data_kh_temp["status"]="1";
    cms.data_kh_temp["reward"]=data["money"];
    var id_doc=cms.data_kh_temp["id_doc"];
    cr_realtime.add('lich_su_danh_kh',id_doc,cms.data_kh_temp,()=>{
        cms.p_temp.js_act_done_frm=null;
        return false;
    });
}

cms.taixiu=()=>{
    var currentTime = new Date();
    var html_page='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom mt-5">';
    html_page+='<h1 class="h2">Các phiên cược Tài Xỉu MD5</h1>';
        html_page+='<div class="btn-toolbar mb-2 mb-md-0">';
        html_page+='<div class="btn-group mr-2">';
            html_page+='<button onclick="return false;" class="btn btn-sm btn-outline-secondary"><i class="fas fa-dice-d6"></i> Tạo mới (nếu bản trống)</button>';
            //html_page+='<button onclick="cms.lichsuthangthua(\'2\');return false;" class="btn '+(status_view=="2"? "active":"")+' btn-sm btn-outline-secondary"><i class="fas fa-skull"></i> Lịch sử thua</button>';
        html_page+='</div>';
    html_page+='</div>';
    html_page+='</div>';

    html_page+='<div class="table-responsive">';
    html_page+='<table class="table table-linght table-sm table-striped table-hover">';

    html_page+='<thead>';
    html_page+='<tr>';
        html_page+='<th scope="col">Mã phiên</th>';
        html_page+='<th scope="col">Số người chơi</th>'
        html_page+='<th scope="col">Số người cược tài</th>';
        html_page+='<th scope="col">Số người cược Xỉu</th>';
        html_page+='<th scope="col">Trạng thái</th>';
        html_page+='<th scope="col">Thời gian bắt đầu</th>';
        html_page+='<th scope="col">Thời gian kết thúc</th>';
    html_page+='</tr>';
    html_page+='</thead>';

    html_page+='<tbody id="all_item_taixiu"></tbody>';
    html_page+='</table>';
    html_page+='</div>';
    $("main").html(html_page);

    function item_taixiu(data){
        var html='';
        html+='<tr>';
        html+='<td>'+data.id+'</td>';
        html+='<td>'+data.count_user+'</td>';
        html+='<td>'+data.count_tai+'</td>';
        html+='<td>'+data.count_xiu+'</td>';


              var date1 = new Date(currentTime);
              var date2 = new Date(data.time_start);
  
              // Chuyển đổi sang giờ Việt Nam (UTC+7)
              var vietnamOffset = 7 * 60; // UTC+7 bằng 7 giờ x 60 phút
              var vietnamDate1 = new Date(date1.getTime() + vietnamOffset * 60 * 1000);
              var vietnamDate2 = new Date(date2.getTime() + vietnamOffset * 60 * 1000);

        if (vietnamDate1 > vietnamDate2) {
            html+='<td>Hoàn tất</td>';
        } else if (vietnamDate1 < vietnamDate2) {
            html+='<td>Xắp diễn ra</td>';
        }else{
            html+='<td>Đang diễn ra</td>';
        }
        html+='<td>'+data.time_start+'</td>';
        html+='<td>'+data.time_end+'</td>';
        html+='</tr>';
        return $(html);
    }

    function createBettingSessions() {
        var startDate = new Date();
        var sessionDuration = 3 * 60 * 1000;
        var numSessions = 480;

        for (var i = 0; i < numSessions; i++) {
            var startTime = new Date(startDate.getTime() + i * sessionDuration);
            var endTime = new Date(startTime.getTime() + sessionDuration);
            var sessionId = 'session' + (i + 1);

            var tx={id:sessionId,count_user:0,count_tai:0,count_xiu:0,status:"waiting",time_start:startTime.toISOString(),time_end:endTime.toISOString()};
            $("#all_item_taixiu").append(item_taixiu(tx));
        }
    }

    createBettingSessions();
}