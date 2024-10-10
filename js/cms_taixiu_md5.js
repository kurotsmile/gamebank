cms.taixiu_header=(title,h=0)=>{
    var html_page='<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom mt-5">';
    html_page+='<h1 class="h2">'+title+'</h1>';
        html_page+='<div class="btn-toolbar mb-2 mb-md-0">';
            html_page+='<div class="btn-group mr-2">';
                html_page+='<button id="btn_sessionBettingSessions" onclick="cms.taixiu();" class="btn btn-sm '+(cms.tx_page_cms=='session' ? 'btn-dark':'btn-outline-secondary')+'"><i class="fas fa-dice-six"></i> Phiên cược</button>';
                html_page+='<button id="btn_historyBettingSessions" onclick="cms.historyBettingSessions('+h+');" class="btn btn-sm '+(cms.tx_page_cms=='history' ? 'btn-dark':'btn-outline-secondary')+'"><i class="fas fa-history"></i> Lịch sử cược</button>';
            html_page+='</div>';

            if(cms.tx_page_cms=='session'){
                html_page+='<div class="btn-group mr-2">&nbsp;</div>';
                html_page+='<div class="btn-group mr-2">';
                    if(cms.tx_page_cms=='session') html_page+='<button id="btn_createBettingSessions" onclick="cms.createBettingSessions('+h+');" class="btn btn-sm btn-outline-secondary"><i class="fas fa-dice-d6"></i> Tạo mới các phiên</button>';
                    html_page+='<button id="btn_deleteBettingSessions" onclick="cms.deleteBettingSessions('+h+');" class="btn btn-sm btn-outline-secondary"><i class="fas fa-trash"></i> Xóa tất cả</button>';
                html_page+='</div>';
            }
    html_page+='</div>';
    html_page+='</div>';
    return html_page;
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
    var check_status=cms.getStatusCurrentTime(dateString);
    if (check_status==0) {
       return '<i class="fas fa-hourglass-start"></i> <small class="bg-warning p-1 rounded">Xắp diễn ra</small>';
    } else if (check_status==2) {
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

    cms.tx_hours=h;
    cms.tx_page_cms='session';

    var html_page='';
    html_page+=cms.taixiu_header('Các phiên cược tài xỉu MD5',h);
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

        var html_history='<button class="btn btn-sm btn-secondary"><i class="fas fa-history"></i> Lịch sử cược</button>';
        var btn_history=$(html_history);
        $(btn_history).click(()=>{
            cms.box("Chưa có ai cược trong phiên này!","Lịch sử cược");
        });
        $(emp).find(".col-btn").append(btn_history);

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

cms.historyBettingSessions=()=>{
    cms.tx_page_cms='history';
    var htm_h=cms.taixiu_header('Lịch sử cược tài xỉu MD5',cms.tx_hours);
    $("main").html(htm_h);
}