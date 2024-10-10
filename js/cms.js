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

cms.getStatusCurrentTime=(dateString)=>{
    var date = new Date(dateString);
    var hoursFromString = date.getHours();
    var minutesFromString = date.getMinutes();

    var currentDate = new Date();
    var currentHours = currentDate.getHours();
    var currentMinutes = currentDate.getMinutes();

    if (hoursFromString > currentHours || (hoursFromString === currentHours && minutesFromString > currentMinutes)) {
       return 0;
    } else if (hoursFromString < currentHours || (hoursFromString === currentHours && minutesFromString < currentMinutes)) {
       return 2;
    } else {
       return 1;
    }
}

cms.compareWithCurrentTime=(dateString)=>{
    var date = new Date(dateString);
    var hoursFromString = date.getHours();
    var minutesFromString = date.getMinutes();

    var currentDate = new Date();
    var currentHours = currentDate.getHours();
    var currentMinutes = currentDate.getMinutes();

    if (hoursFromString > currentHours || (hoursFromString === currentHours && minutesFromString > currentMinutes)) {
       return '<i class="fas fa-hourglass-start"></i> <small class="bg-warning p-1 rounded">Xắp diễn ra</small>';
    } else if (hoursFromString < currentHours || (hoursFromString === currentHours && minutesFromString < currentMinutes)) {
       return '<i class="fas fa-check-circle"></i> <small class="bg-success text-white p-1 rounded">Đã diễn ra</small>';
    } else {
       return '<i class="fas fa-running live"></i> <small class="bg-info p-1 rounded">Đang diễn ra</small>';
    }
}

cms.taixiu=(h=null)=>{
    var hours=null;
    if(h==null) 
        hours=new Date().getHours().toString();
    else
        hours=h.toString();
    var html_page='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom mt-5">';
    html_page+='<h1 class="h2">Các phiên cược Tài Xỉu MD5</h1>';
        html_page+='<div class="btn-toolbar mb-2 mb-md-0">';
        html_page+='<div class="btn-group mr-2">';
            html_page+='<button id="btn_createBettingSessions" onclick="cms.createBettingSessions('+h+');" class="btn btn-sm btn-outline-secondary"><i class="fas fa-dice-d6"></i> Tạo mới các phiên</button>';
            html_page+='<button id="btn_deleteBettingSessions" onclick="cms.deleteBettingSessions('+h+');" class="btn btn-sm btn-outline-secondary"><i class="fas fa-trash"></i> Xóa tất cả</button>';
        html_page+='</div>';
    html_page+='</div>';
    html_page+='</div>';

    html_page+='<div class="row">';
    html_page+='<div class="col-12">';
    var h_cur=new Date().getHours();
    for(var i=0;i<24;i++){
        var s_icon_h='';
        if(i==h_cur) s_icon_h='<i class="fas fa-clock"></i>';
        if(i.toString()==hours){
            html_page+='<button onclick="cms.taixiu('+i+')" class="btn btn-sm btn-dark m-1">'+s_icon_h+' Hours '+i+'</button>';
        }
        else{
            html_page+='<button onclick="cms.taixiu('+i+')" class="btn btn-sm btn-light m-1">'+s_icon_h+' Hours '+i+'</button>';
        }
    }
    html_page+='</div>';
    html_page+='</div>';

    html_page+='<div class="table-responsive">';
    html_page+='<table class="table table-linght table-sm table-striped table-hover">';
    html_page+='<thead>';
    html_page+='<tr>';
        html_page+='<th scope="col">Thao tác</th>';
        html_page+='<th scope="col">ID phiên</th>';
        html_page+='<th scope="col">Trạng thái</th>';
        html_page+='<th scope="col">Kết quả</th>';
        html_page+='<th scope="col">Thời gian bắt đầu</th>';
        html_page+='<th scope="col">Thời gian kết thúc</th>';
    html_page+='</tr>';
    html_page+='</thead>';

    html_page+='<tbody id="all_item_taixiu"></tbody>';
    html_page+='</table>';
    html_page+='</div>';
    $("main").html(html_page);

    function load_list_by_hour(h){
        $("#all_item_taixiu").empty();

        var q=new Firestore_Query("tx");
        q.add_where("hour",h);
        q.set_limit(100);
        q.get_data(datas=>{
            cms.data_bet_temp=datas;
            if(datas.length>0)
                $("#btn_createBettingSessions").hide();
            else
                $("#btn_createBettingSessions").show();
            datas.sort((a, b) => new Date(a.time_start) - new Date(b.time_start));
            $.each(datas,function(index,t){
                $("#all_item_taixiu").append(cms.item_taixiu(t));
            });
    
            cms.check_list_attr_item_tx();

            cms.thread_check_timer=setInterval(()=>{
                if($("#all_item_taixiu").length==0) clearInterval(cms.thread_check_timer);
                cms.check_list_attr_item_tx();
            },9000);
        });
    }

   load_list_by_hour(hours);
}

cms.check_list_attr_item_tx=()=>{

    function item_select_xucxac(id_field,label,val){
        var html='';
        html+='<label for="basic-url" class="form-label">'+label+'</label>';
        html+='<div class="input-group mb-3">';
        html+='<select class="form-select" id="'+id_field+'">';
            for(var i=1;i<=6;i++){
                if(val==i)
                    html+='<option value="'+i+'" selected>'+i+'</option>';
                else
                    html+='<option value="'+i+'">'+i+'</option>';
            }
        html+='</select>';
        html+='</div>';
        var emp_select=$(html);
        return emp_select;
    }

    $("#all_item_taixiu tr").each(function(index,emp){
        var timer_start=$(emp).data("timer-start");
        $(emp).find(".col-btn").empty();
        var btn_edit=$('<button class="btn btn-sm btn-light"><i class="fas fa-edit"></i> Chỉnh sửa kết quả</button>');
        $(btn_edit).click(()=>{
            var id_session=$(emp).data("id");
            var timer_end=$(emp).data("timer-end");
            var timer_start=$(emp).data("timer-start");
            var hour=$(emp).data("hour").toString();

            var a=$(emp).data("a");
            var b=$(emp).data("b");
            var c=$(emp).data("c");

            var htm_edit_bet='';
            htm_edit_bet+='<div class="form" id="list_field_xucxac"></div>';
            htm_edit_bet+='<div class="w-100"><button id="btn_bet_update" class="btn btn-success"><i class="fas fa-check"></i> Cập nhật</button></div>';
            cms.box(htm_edit_bet,"Thay đổi kết quả",()=>{
                $("#list_field_xucxac").append(item_select_xucxac('dice_a',"Xúc xắc A",parseInt(a)));
                $("#list_field_xucxac").append(item_select_xucxac('dice_b',"Xúc xắc B",parseInt(b)));
                $("#list_field_xucxac").append(item_select_xucxac('dice_c',"Xúc xắc C",parseInt(c)));
                $("#btn_bet_update").click(()=>{
                    var dice_a=parseInt($("#dice_a").val());
                    var dice_b=parseInt($("#dice_b").val());
                    var dice_c=parseInt($("#dice_c").val());

                    var tx = {
                        id: id_session,
                        a: dice_a,
                        b: dice_b,
                        c: dice_c,
                        time_start: timer_start,
                        time_end: timer_end,
                        hour:hour
                    };

                    cr_firestore.set(tx,"tx",id_session,()=>{
                        cr.msg("Cập nhật kết quả thành công!","Dàng xếp kết quả","success");
                        cms.close_box();
                        cms.taixiu(hour);
                    },()=>{
                        cr.msg("Lỗi kết nối máy chủ!","Dàng xếp kết quả","error");
                    })
                });
            });
        });
        $(emp).find(".col-btn").append(btn_edit);

        $(emp).find(".col-status").html(cms.compareWithCurrentTime(timer_start));
    });
}

cms.item_taixiu=(data)=>{
    var dice_font=['',
        '<i class="fas fa-dice-one"></i>',
        '<i class="fas fa-dice-two"></i>',
        '<i class="fas fa-dice-three"></i>',
        '<i class="fas fa-dice-four"></i>',
        '<i class="fas fa-dice-five"></i>',
        '<i class="fas fa-dice-six"></i>'
    ];

    function getTimeFromDate(dateString) {
        var date = new Date(dateString);
        var hours = date.getHours().toString().padStart(2, '0');
        var minutes = date.getMinutes().toString().padStart(2, '0');
        return hours + ":" + minutes;
    }
    var s_return=dice_font[parseInt(data.a)]+' '+dice_font[parseInt(data.b)]+' '+dice_font[parseInt(data.c)];
    var total_dice=parseInt(data.a)+parseInt(data.b)+parseInt(data.c);
    if(total_dice<=10){
        s_return+=" - <b>Xỉu</b>";
    }else{
        s_return+=" - <b>Tài</b>";
    }
    
    var html='';
    html+='<tr data-hour="'+data.hour+'" data-id="'+data.id+'" data-timer-start="'+data.time_start+'" data-timer-end="'+data.time_end+'" data-a="'+data.a+'" data-b="'+data.b+'" data-c="'+data.c+'">';
    html+='<td class="col-btn"></td>';
    html+='<td>'+data.id+'</td>';
    html+='<td class="col-status">'+cms.compareWithCurrentTime(data.time_start)+'</td>';
    html+='<td>'+s_return+'</td>';
    html+='<td>'+getTimeFromDate(data.time_start)+'</td>';
    html+='<td>'+getTimeFromDate(data.time_end)+'</td>';
    html+='</tr>';
    return $(html);
}

cms.createBettingSessions=(hours,min=1)=>{
    var startDate = new Date();
    startDate.setHours(hours, 0, 0, 0);
    var sessionDuration = min * 60 * 1000; 
    var numSessions = 60;

    for (var i = 0; i < numSessions; i++) {
        var startTime = new Date(startDate.getTime() + i * sessionDuration);
        var endTime = new Date(startTime.getTime() + sessionDuration);
        var sessionId = 'session' + cr.create_id(10); 

        var randomNumber_a = Math.floor(Math.random() * 6) + 1;
        var randomNumber_b = Math.floor(Math.random() * 6) + 1;
        var randomNumber_c = Math.floor(Math.random() * 6) + 1;

        var tx = {
            id: sessionId,
            a: randomNumber_a,
            b: randomNumber_b,
            c: randomNumber_c,
            time_start: startTime.toString(),
            time_end: endTime.toString(),
            hour: hours.toString()
        };

        $("#all_item_taixiu").append(cms.item_taixiu(tx));
        cr_firestore.set(tx, "tx", tx.id); 
    }
}

cms.deleteBettingSessions=()=>{
    $.each(cms.data_bet_temp,function(index,b){
        cr_firestore.delete("tx",b.id);
    });

    cr.msg("Xóa thành công tất cả các phiên cược trong giờ","Xóa phiên cược","Success");
    $("#all_item_taixiu").empty();
}