+function(){
'use strict';
$(function() {
	var _w =$('.album-old').width();
	var _h =_w;
	var _old = {};
	
	var maxWidth=600;
	var allowTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    
    //10MB
    var maxSize = 10 * 1024 * 1024;
	var $blzAlbum=$('.album-box');
	$('.uis-head-image').on('tap',function(){
		$(".weui_uploader_input.js_file").eq(0).trigger('click');
	});
	$(".weui_uploader_input.js_file").on("change", function() {
		
		var fr = new FileReader();
		if(this.files.length===0){return false;}
		 if (allowTypes.indexOf(this.files[0].type) === -1) {
			alert('该类型不允许上传');
			return false;
		}

		if (this.files[0].size > maxSize) {
			alert('图片太大，不允许上传');
			return false;
		}
		fr.readAsDataURL(this.files[0]);
		var image=this.files[0];
		var img = new Image();
		$blzAlbum.css({
			'opacity':1,
			'z-index':999
		});
		var upImg = $(".upload-img");
		upImg.addClass("loading");
		$('.upload-img img, .upload-img canvas').remove();
		fr.onload = function() {
			img.src = this.result;
			
			img.onload = function() {
				var newImg=new Image();
				canvasResize(image, {
					width: 600,
					height: 600,
					crop: false,
					quality: 80,
					rotate: 0,
					callback: function(data, width, height) {

						// SHOW AS AN IMAGE
						// =================================================
						newImg.onload = function() {
							$(this).css({
								'width': width,
								'height': height
							});
							upImg.html(this);
							var scrolls = new IScroll(upImg[0], {
								zoom : true,
								scrollX : true,
								scrollY : true,
								mouseWheel : true,
								bounce : false,
								wheelAction : 'zoom'
							});
							_old.img = this;
							_old.scrolls = scrolls;
							
							upImg.removeClass("loading");

						};
						$(newImg).attr('src', data);		
					}
				});
			};
		};
	});

	$(".submit").on("click",function() {
		
        // oldImg为用户设置的头像数据（base64编码）可以用ajax结合formData发送到服务器；
        var oldImg = imageData(_old);
        
		$blzAlbum.css({
			'opacity':0,
			'z-index':-1
		});
		$('.user-image-set-head').find('img').eq(0).attr('src',oldImg);
	});

	function imageData(obj) {
		obj.scrolls.enabled = false;
		var canvas = document.createElement('canvas');

		canvas.width = _w;
		canvas.height = _h;
		var ctx = canvas.getContext('2d');

		var w = _w / obj.scrolls.scale;
		var x=(obj.scrolls.startX?obj.scrolls.startX:obj.scrolls.x)/obj.scrolls.scale;
		var y=(obj.scrolls.startY?obj.scrolls.startY:obj.scrolls.y)/obj.scrolls.scale;
		ctx.drawImage(obj.img,-x,-y, w, w,0,0,_w,_w);
		return canvas.toDataURL();
	}
});
}(window.Zepto||window.jQuery);