function alertBox(msg,btn_num,btn_left,btn_right,fn_left,fn_right){
    if(!$('.alert_bg').length && !$('.alert_box').length){
      var html='<div class="alert_bg" id="alert_bg"></div>'
              +'<div class="alert_box">'
                   +'<div class="alert_msg">信息</div>'
                   +'<div class="alert_btn"></div>'
              +'</div>';
    $(html).appendTo($('body'));
    $('#alert_bg').height($('body').height());
    $('.alert_msg').html(msg);
    var mt=parseInt($('.alert_box').outerHeight()/2);
    var btn_box=$('.alert_btn');
    $('.alert_box').css('marginTop',-mt+'px');
    
    if(typeof btn_num==='undefined'){
       btn_box.hide();
    }

    if(btn_num==1){
        $('<div id="btn_left">'+btn_left+'</div>').appendTo(btn_box);
    }

    if(btn_num==2){
       $('<div id="btn_left">'+btn_left+'</div><div id="btn_right">'+btn_right+'</div>').appendTo(btn_box);
    }

    $('#btn_left').click(function(){
        fn_left();
    })

    $('#btn_right').click(function(){
        fn_right();
    })
   }
    

   $('.alert_bg')[0].addEventListener('touchmove',function(e){
       e.preventDefault();
   })

   $('.alert_box')[0].addEventListener('touchmove',function(e){
       e.preventDefault();
   })

   btn_box.on('touchstart',function(e){
       $(this).addClass('hover');
   })

   btn_box.on('touchmove',function(){
       $(this).removeClass('hover');
   })

   btn_box.on('touchend',function(){
       $(this).removeClass('hover');
   })
}

function cancelAlert(){
    $('.alert_bg').remove();
    $('.alert_box').remove();
}
 // 图片上传


$(".pic-list").each(function(){
  $(this).uploadImg({
    url:"upload.php"
  });
});
