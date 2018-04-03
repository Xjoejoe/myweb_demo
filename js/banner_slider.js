		var LoopImage = function(imgArr,container){
			this.imagesArray = imgArr;
			this.container = container;
			this.width = parseFloat($(container).css("width"));
			this.current_index = 0;
		}
		LoopImage.prototype = {
			//create
			create:function(){
				$("<div class='xzh_loopImage_ctn'></div>").appendTo(this.container);
				$("<ul class='xzh_loopImage_ul'></ul>").appendTo('.xzh_loopImage_ctn');
				$("<ul class='xzh_loopImage_btn_ctn'></ul>").appendTo(this.container);
				var html = "";
				var ul_width = parseInt($(this.container).css("width"))*this.imagesArray.length;
				var li_width = parseInt($(this.container).css("width"));
				for(var i = 0;i<this.imagesArray.length;i++){
					var tpl = [	"<li class='xzh_loopImage_li'>",
								"<a href='"+this.imagesArray[i]['a_href']+"'>",
									"<img src='"+this.imagesArray[i]['img_src']+"'>",
								"</a>",
							"</li>"
							].join("");
					$(tpl).appendTo('.xzh_loopImage_ul');
					$("<li class='xzh_loopImage_btn_ctrl'>"+i+"</li>").appendTo('.xzh_loopImage_btn_ctn');			
				}
				$(".xzh_loopImage_li").css("width",li_width+"px");
				$(".xzh_loopImage_btn_ctrl:eq(0)").addClass("xzh_loopImage_btn_ctrl_active");
				$(".xzh_loopImage_ul").css("width",ul_width+"px");
			},
			//切换效果
			changeImage:function(){
				var that = this;
				$(that.container+" .xzh_loopImage_btn_ctrl").click(function(){
					$this = $(this);
					that.current_index = $this.index();
					$this.addClass("xzh_loopImage_btn_ctrl_active").siblings().removeClass("xzh_loopImage_btn_ctrl_active");
					that.run();
				});
			},
			run:function(){
				var that = this;
				$('.xzh_loopImage_ul').css({"left":"-"+that.current_index*this.width+"px"});
			}
		};
		var SliderLoopImg = function(imgArr,container){
			LoopImage.call(this,imgArr,container);
			this.timer = "";
		}
		SliderLoopImg.prototype = new LoopImage();
		SliderLoopImg.prototype.changeImage = function(){
			var that = this;
			$(that.container).mouseenter(function(){
				clearInterval(that.timer);
			});
			$(that.container).mouseleave(function(){
				that.timer = setInterval(function(){
						that.current_index++;
						if(that.current_index>that.imagesArray.length-1){
							that.current_index = 0;
						}
						that.run()
					},2000);
			});
			$(that.container+" .xzh_loopImage_btn_ctrl").click(function(){
				$this = $(this);
				that.current_index = $this.index();
				that.run();
			});
		}
		SliderLoopImg.prototype.run = function(){
			var that = this;
			$(that.container+' .xzh_loopImage_btn_ctrl:eq('+that.current_index+')').addClass("xzh_loopImage_btn_ctrl_active").siblings().removeClass("xzh_loopImage_btn_ctrl_active");
			$('.xzh_loopImage_ul').animate({"left":"-"+that.current_index*this.width+"px"});
		}
		SliderLoopImg.prototype.autoRun = function(){
			var that = this;
			this.timer = setInterval(function(){
				that.current_index++;
				if(that.current_index>that.imagesArray.length-1){
					that.current_index = 0;
				}
				that.run()
			},2000);
		}
		var BarLoopImg = function(imgArr,container,b_w_num,b_h_num){
			LoopImage.call(this,imgArr,container);
			this.w_num = b_w_num||4;
			this.h_num = b_h_num||4;
		}
		BarLoopImg.prototype = new LoopImage();
		BarLoopImg.prototype.createBar = function(){
			this.create();
			var that = this;
			var w_num = this.w_num;
			var h_num = this.h_num;
			var height = 0;
			var width = parseFloat($(this.container).css('width'));
			var d_img = $(that.container+' img:eq(0)').get(0);
			imgLoad(d_img, function() {
				height = $(that.container+' .xzh_loopImage_ul').height();
				init();
        	});
        	function init(){
        		var h_bar_height = height/h_num;
				var w_bar_width = width/w_num;
				for(var i = 0;i<h_num;i++){
					$('<div class="xzh_h_bar"></div>').appendTo(that.container+' .xzh_loopImage_ctn');
				}
				for(var k = 0;k<w_num;k++){
					$('<div class="xzh_w_bar"></div>').appendTo(that.container+' .xzh_loopImage_ctn');
				}
				$('.xzh_h_bar').css({"width":width+'px',"height":h_bar_height+'px'});
				$('.xzh_w_bar').css({"width":w_bar_width+'px',"height":height+'px'});
				for(var j = 0;j<h_num;j++){
					$('.xzh_h_bar:eq('+j+')').css("top",j*h_bar_height+"px");
				}
				for(var q = 0;q<w_num;q++){
					$('.xzh_w_bar:eq('+q+')').css("left",q*w_bar_width+"px");
				}
        	}
		}
		BarLoopImg.prototype.changeImage = function(){
			var that = this;
			var old_index = 0;
			var current_index = 0;
			var flag = false;
			var going = true;
			$(that.container+" .xzh_loopImage_btn_ctrl").click(function(){
				old_index = current_index;
				if(going == false){
					console.log('not yet');
					return;
				}
				current_index = $(this).index();
				if(old_index == current_index){
					console.log(old_index+"||"+current_index);
					return;
				}
				$(this).addClass("xzh_loopImage_btn_ctrl_active").siblings().removeClass("xzh_loopImage_btn_ctrl_active");
				flag = !flag;
				img_ctrl(flag);
			});
			function img_ctrl(flag){
				if(flag){
					return (function(){
						going = false;
						var t1_delay = 0;
						$('.xzh_h_bar').each(function(){
							t1_delay+=0.06*1000;
							var index = $(this).index();
							$(this).css('transform','translateX(100%)');
							$(this).css('transition-delay',index*0.06+'s');
						});
						setTimeout(function(){
							var t2_delay = 0;
							$('.xzh_w_bar').css('top','0px');
							$('.xzh_h_bar').css('left','0px');
							$('.xzh_loopImage_ul').css({"left":"-"+current_index*that.width+"px"});
							$('.xzh_w_bar').each(function(){
								t2_delay+=0.06*1000;
								var index = $(this).index();
								$(this).css('transform','translateY(100%)');
								$(this).css('transition-delay',index*0.06+'s');
							});
							setTimeout(function(){going = true;},1000+t2_delay);
						},1000+t1_delay);
					})();
				}else{
					return (function(){
						going = false;
						var t1_delay = 0;
						$('.xzh_w_bar').each(function(){
							t1_delay += 0.06*1000;
							var index = $(this).index();
							$(this).css('transform','translateY(0%)');
							$(this).css('transition-delay',index*0.06+'s');
						});
						setTimeout(function(){
							var t2_delay = 0;
							$('.xzh_w_bar').css('top','-100%');
							$('.xzh_h_bar').css('left','-100%');
							$('.xzh_loopImage_ul').css({"left":"-"+current_index*that.width+"px"});
							$('.xzh_h_bar').each(function(){
								t2_delay+=0.06*1000;
								var index = $(this).index();
								$(this).css('transform','translateX(0%)');
								$(this).css('transition-delay',index*0.06+'s');
							});
							setTimeout(function(){going = true;},1000+t2_delay);
						},1000+t1_delay*3);
					})();
				}
			}
		}
		var FadeLoopImg = function(imgArr,container){
			LoopImage.call(this,imgArr,container);
			this.timer = "";
		}
		FadeLoopImg.prototype = new LoopImage();
		FadeLoopImg.prototype.createCover = function(){
			this.create();
			var that = this;
			var d_img = $(that.container+' img:eq(0)').get(0);
			imgLoad(d_img, function() {
				height = $(that.container+' .xzh_loopImage_ul').height();
				$("<div class='xzh_loopImage_cover'></div>").appendTo(that.container+' .xzh_loopImage_ul');
				$('.xzh_loopImage_cover').css('height',height);
        	});
		}
		FadeLoopImg.prototype.changeImage = function(){
			var that = this;
			var index = 0;
			$(that.container+" .xzh_loopImage_btn_ctrl").click(function(){
				that.current_index = $(this).index();
				that.run();
			});
			
		}
		FadeLoopImg.prototype.run = function(){
			var that = this;
			$(that.container+' .xzh_loopImage_btn_ctrl:eq('+that.current_index+')').addClass("xzh_loopImage_btn_ctrl_active").siblings().removeClass("xzh_loopImage_btn_ctrl_active");
			$(that.container+" .xzh_loopImage_cover").show().animate({'opacity':'1'},function(){
				$(that.container+' .xzh_loopImage_ul').css('left','-'+that.current_index*that.width+'px');
				$(that.container+" .xzh_loopImage_cover").animate({'opacity':'0'},function(){
					$(that.container+" .xzh_loopImage_cover").hide();
				});
			});
		}
		FadeLoopImg.prototype.loop = function(){
			var that = this;
			this.timer = setInterval(function(){
				that.current_index++;
				if(that.current_index>that.imagesArray.length-1){
					that.current_index = 0;
				}
				that.run();
			},1000);
		}
		function imgLoad(img, callback) {
	            var timer = setInterval(function() {
	                if (img.complete) {
	                    callback(img)
	                    clearInterval(timer)
	                }
	            }, 50)
	    }