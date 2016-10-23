/**
 * 上传多张图片
 * @method uploadImg
 * @params url:上传图片请求的服务器端的文件的地址,
 * @params container:图片上传之后渲染到哪个父盒子,
 * @params maxCount:最多可上传的数目,
 * @params maxMb:上传的大小MB
 * @params fileInput:上传图片的文件域
 * @params scale:图片的缩放比例  大小
 * @params name:参数名称
 * @params success:上传成功之后执行的回调函数
 * @params error:上传失败之后执行的回调函数
 * @params warn:不符合上传条件时执行的回调函数
 * @return 元素对象.uploadImg(Objext)
 */
(function($){     
    $.fn.extend({     
        uploadImg:function(opt){     
            var up=new UploadImg(opt,this);
        }     
    });
    function UploadImg(option,self){
       var _defaults={
          url:"",
          container:self,
          maxCount:3,
          maxMb:2,
          fileInput:$(self).find(".fileImg"),
          scale:0.8,
          name:"img",
          success:function(data,idx){
                
          },
          error:function(msg){
             alertBox(msg,1,"关 闭","",cancelAlert);
          },
          warn:function(msg){
             alertBox(msg,1,"关 闭","",cancelAlert);
          }
       };
       this.opt=$.extend({},_defaults,option);
       this.init(self);
    }

    UploadImg.prototype={
    	init:function(self){
    	   var _this=this;
           var liIndex=0;
    	   // 给文件域绑定事件
    	   _this.opt.fileInput.on('change',function(){
    	       var files=this.files?this.files:null,
    	           _tar=files[0],
    	           maxSize=_this.opt.maxMb*1024*1024,
                   reg=/\.(jpg)|(jpeg)|(gif)|(png)$/i,
                   err="",
                   html="";

    	       if(!(reg.test(_tar.name))){
                  err="请上传jpg/jpeg/gif/png格式的图片";
    	       }else{
                    if(_tar.size>maxSize){
                      err="图片尺寸超出限制，请上传低于"+_this.opt.maxMb+"M的图片";
                   }
               }
               
               if(err){
                   _this.opt.warn && _this.opt.warn(err);
                   return;
               }
                
               liIndex++;
               
               html='<li class="upload-img upload-loading">'
                        +'<img src="">'
                        +'<a href="javascript:void(0)" class="upload_delete" title="删除"></a>'
                   +'</li>';

               $(html).prependTo($(_this.opt.container));

               _this.getCount(liIndex);

               // 上传图片
               _this.zipImg({
               	  files:files,
               	  scale:_this.opt.scale,
               	  callback:function(tar){
                     if(tar.constructor!='Array'){
                        tar=[tar];
                     }
                     _this.submit(tar,liIndex,self);
               	  }
               })
    	   })
           // 关闭
           $(_this.opt.container).on('click','.upload_delete',function(){
           	   liIndex-=1;
           	   $(this).parents('li.upload-img').remove();
           	   _this.getCount(liIndex);
           })
    	},
    	//压缩图片方法
    	zipImg: function(cfg){
    	 /*
    	  * cfg.files      input对象触发onchange时候的files
    	  * cfg.scale      压缩比例
    	  * cfg.callback     压缩成功后的回调
    	  */
    	  var _this = this;
    	  var options = cfg;
    	 [].forEach.call(options.files, function(v, k){
    	   var fr = new FileReader();  
    	   fr.onload= function(e) {  
    	     var oExif = EXIF.readFromBinaryFile(new BinaryFile(e.target.result)) || {};

    	     var $img = document.createElement('img');                         
    	     $img.onload = function(){                 
    	       _this.fixDirect().fix($img, oExif, options.callback,options.scale);
    	     };  
    	     if(typeof(window.URL) != 'undefined'){
    	      $img.src = window.URL.createObjectURL(v);
    	     }else{
    	      $img.src = e.target.result;       
    	     }
    	   };  
    	   //fr.readAsDataURL(v);
    	   fr.readAsBinaryString(v);
    	 }); 
    	},
    	//调整图片方向
    	fixDirect: function(){
    	 var r = {};
    	 r.fix = function(img, a, callback,scale) {
    	   var n = img.naturalHeight,
    	     i = img.naturalWidth,
    	     c = 1024,
    	     o = document.createElement("canvas"),
    	     s = o.getContext("2d");
    	   a = a || {};
    	   //o.width = o.height = c;
    	   //debugger;
    	   if(n > c || i > c){
    	     o.width = o.height = c;
    	   }else{
    	     o.width = i;
    	     o.height = n;
    	   }
    	   a.Orientation = a.Orientation || 1;
    	   r.detectSubSampling(img) && (i /= 2, n /= 2);
    	   var d, h;
    	   i > n ? (d = c, h = Math.ceil(n / i * c)) : (h = c, d = Math.ceil(i / n * c));
    	   // var g = c / 2,
    	   var g = Math.max(o.width,o.height)/2,
    	     l = document.createElement("canvas");
    	   if(n > c || i > c){
    	     l.width = g, l.height = g;
    	   }else{
    	     l.width = i;
    	     l.height = n;
    	     d = i;
    	     h =n;
    	   }
    	   //l.width = g, l.height = g;
    	   var m = l.getContext("2d"), u = r.detect(img, n) || 1;
    	   s.save();
    	   r.transformCoordinate(o, d, h, a.Orientation);
    	   var isUC = navigator.userAgent.match(/UCBrowser[\/]?([\d.]+)/i);
    	   if (isUC && $.os.android){
    	     s.drawImage(img, 0, 0, d, h);
    	   }else{
    	     for (var f = g * d / i, w = g * h / n / u, I = 0, b = 0; n > I; ) {
    	       for (var x = 0, C = 0; i > x; )
    	         m.clearRect(0, 0, g, g), m.drawImage(img, -x, -I), s.drawImage(l, 0, 0, g, g, C, b, f, w), x += g, C += f;
    	       I += g, b += w
    	     }
    	   }
    	   s.restore();
    	   a.Orientation = 1;
    	   img = document.createElement("img");
    	   img.onload = function(){
    	     a.PixelXDimension = img.width;
    	     a.PixelYDimension = img.height;
    	     //e(img, a);
    	   };
    	   
    	   callback && callback(o.toDataURL("image/jpeg", scale).substring(22));//压缩图片
    	 };
    	 r.detect = function(img, a) {
    	   var e = document.createElement("canvas");
    	   e.width = 1;
    	   e.height = a;
    	   var r = e.getContext("2d");
    	   r.drawImage(img, 0, 0);
    	   for(var n = r.getImageData(0, 0, 1, a).data, i = 0, c = a, o = a; o > i; ) {
    	     var s = n[4 * (o - 1) + 3];
    	     0 === s ? c = o : i = o, o = c + i >> 1
    	   }
    	   var d = o / a;
    	   return 0 === d ? 1 : d
    	 };
    	 r.detectSubSampling = function(img) {
    	   var a = img.naturalWidth, e = img.naturalHeight;
    	   if (a * e > 1048576) {
    	     var r = document.createElement("canvas");
    	     r.width = r.height = 1;
    	     var n = r.getContext("2d");
    	     return n.drawImage(img, -a + 1, 0), 0 === n.getImageData(0, 0, 1, 1).data[3]
    	   }
    	   return !1;
    	 };
    	 r.transformCoordinate = function(img, a, e, r) {
    	   switch (r) {
    	     case 5:
    	     case 6:
    	     case 7:
    	     case 8:
    	       img.width = e, img.height = a;
    	       break;
    	     default:
    	       img.width = a, img.height = e
    	   }
    	   var n = img.getContext("2d");
    	   switch (r) {
    	     case 2:
    	       n.translate(a, 0), n.scale(-1, 1);
    	       break;
    	     case 3:
    	       n.translate(a, e), n.rotate(Math.PI);
    	       break;
    	     case 4:
    	       n.translate(0, e), n.scale(1, -1);
    	       break;
    	     case 5:
    	       n.rotate(.5 * Math.PI), n.scale(1, -1);
    	       break;
    	     case 6:
    	       n.rotate(.5 * Math.PI), n.translate(0, -e);
    	       break;
    	     case 7:
    	       n.rotate(.5 * Math.PI), n.translate(a, -e), n.scale(-1, 1);
    	       break;
    	     case 8:
    	       n.rotate(-.5 * Math.PI), n.translate(-a, 0)
    	   }
    	 };
    	 return r;
    	},
    	getCount:function(idx){
            var _this=this,
                size=$(_this.opt.container).find('li.upload-img').size(),
                $uploadLi=$(_this.opt.fileInput).parents("li");

            if(idx>=_this.opt.maxCount){
               $uploadLi.hide();
            }else{
               $uploadLi.show();
            }
    	},
    	submit:function(files,idx,t){
           var _this=this,
               files=files[0],
               param={},
               url=_this.opt.url;
           param[_this.opt.name]=files;
           $.ajax({
           	  url:url,
           	  type:"post",
           	  data:param,
           	  success:function(data){
                  data=JSON.parse(data);
                  _this.opt.success && _this.opt.success(data,idx);
                  $(t).find("li").eq(0).removeClass('upload-loading').find('img').attr('src',data.url);
           	  },
           	  error:function(data){
                 _this.opt.error && _this.opt.error(data.msg); 
           	  }
           })
    	}
    }
})(jQuery);