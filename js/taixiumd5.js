class TaiXiu_MD5{
    game_obj=null;

    show(){
        Swal.close();
        $("#preloader").show(500);
        $("body").append('<img src="images/tx_bk.png"/>');
    }
}

var taixiu=new TaiXiu_MD5();