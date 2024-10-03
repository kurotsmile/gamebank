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
        cms.msg_collection_data(p,["username","game","money"],list_member,()=>{

        });
    });
};