$(function(){
	var movieMsg = getRequest(); //获取电影信息
	function autoWH(){
		var carouselW = $(".carousel").width();
		//克隆第一张图加到轮播列表最后,防止轮播出现空白
		$(".carousel ul").append($(".carousel ul li:first").clone());
		//设置每个图片宽度
		$(".carousel ul img").width(carouselW);
		//设置轮播列表总宽度
		$(".carousel ul").width(carouselW*$(".carousel ul li").length+carouselW);
		//设置轮播容器的高度以及缩略图列表的总高度
		$(".carousel,.thumbnail").height($(".carousel ul img").height());
		//设置缩略图列表每个li的高度
		$(".thumbnail ul li").css("height",1/$(".thumbnail ul li").length*100+"%");
	}
	$.ajax({
		type:"get", dataType:"json", url: getMovieListUrl,
		success: function(data){
			for(var i=0;i<data.length;i++){
				var movieName = data[i].movieName;
				var year = data[i].releaseDate.slice(0,4);
				//加载对应电影详细信息
				if(movieMsg.filmName==movieName&&movieMsg.releaseDate==year){
					console.log(data[i]);
					/*摘要*/
					$(".filmAbstract h1").text(data[i].movieTitle);
					if(data[i].movieTitle==""){
						$(".filmAbstract h1").text(movieName);
					}
					$(".filmAbstract p span").eq(0).text(data[i].updateTime);
					$(".filmAbstract p span").eq(1).text(data[i].type);
					$(".filmAbstract p span.douban").text(data[i].douban+"分");
					$(".filmAbstract p span.imdb").text(data[i].imdb+"分");
					if(data[i].imdb=="") $(".filmAbstract p span.imdb").remove();
					/*详细信息*/
					$(".filmDetails>img").attr("src",data[i].imgUrl);
					$(".filmDetails>div h1").text(data[i].movieName);
					$(".filmDetails>div span").eq(0).text(data[i].director);
					$(".filmDetails>div span").eq(1).text(data[i].scriptwriter);
					$(".filmDetails>div span").eq(2).text(data[i].protagonist);
					$(".filmDetails>div span").eq(3).text(data[i].productionAreas);
					$(".filmDetails>div span").eq(4).text(data[i].language);
					$(".filmDetails>div span").eq(5).text(data[i].releaseDate);
					$(".filmDetails>div span").eq(6).text(data[i].filmTime);
					$(".filmDetails>div span").eq(7).text(data[i].alternateName);
					/*剧情简介*/
					var intros = data[i].intro.split("/"); //返回一个数组
					for(var j in intros){
						$(".intro").append("<p>"+intros[j]+"</p>");
					}
					/*下载地址*/
					if(data[i].magnets.length>0){
						for(var k in data[i].magnets){
							var magnets = data[i].magnets[k];
							$(".download").append("<a class='magnet' href='"+magnets.magnet+"'>"+magnets.magnetName+"</a>");
							$("a.magnet").eq(k).attr("size",magnets.size);
						}
					}else{
						$(".download").append("<a class='magnet'>暂无</a>");
					}
					/*if(data[i].baiduCloud==""){
						$(".download").append("<a class='baiduCloud'>暂无</a>");
					}else{
						$(".download").append("<a class='baiduCloud'>"+data[i].baiduCloud+"</a>");
					}*/
					/*电影截图*/
					for(var m in data[i].movieCapture){
						var carousel = data[i].movieCapture[m];
						$(".carousel ul").append("<li><img src='"+carousel+"' ></li>");
						$(".thumbnail ul").append("<li><img src='"+carousel+"' ></li>");
					}
					if(data[i].movieCapture.length>0){
						$(".carousel ul li img")[0].onload = function(){
							$(".thumbnail ul li img").eq(0).addClass("activeImg");
							autoWH();
						};
					}
					$(".carousel").append("<span class='prev noselect'><img src='https://t1.picb.cc/uploads/2018/12/06/JTjEgd.png'/></span>"
						+"<span class='next noselect'><img src='https://t1.picb.cc/uploads/2018/12/06/JTp2Ni.png'/></span>");
					var index = 0; //定义轮播索引
					//定义轮播动画的函数
					var carousel = function(){
						var carouselW = $(".carousel").width();
						$(".carousel ul").stop().animate({"left":"-="+carouselW},100,function(){
							var curLeft = $(".carousel ul").position().left;
							if(index>=$(".thumbnail ul li").length){
								$(".carousel ul").css("left",0);
								index = 0;
								$(".thumbnail ul li img").eq(index).addClass("activeImg");
							}
						});
						index++;
						$(".thumbnail ul li img").removeClass("activeImg").eq(index).addClass("activeImg");
					}
					//定义轮播定时器
					var carouselTimer = setInterval(carousel,3000);
					//窗口改变时轮播图始终保持百分比自适应的状态
					$(window).resize(function(){
						$(".carousel ul li:last").remove();
						autoWH();
						$(".carousel ul").css("left",-$(".carousel").width()*index);
					});
					function showCorrImg(index){
						$(".thumbnail ul li img").removeClass("activeImg").eq(index).addClass("activeImg");
						$(".carousel ul").stop().animate({"left":-$(".carousel").width()*index},100);
					}
					//点击缩略图显示对应大图
					$(".thumbnail ul li").click(function(){
						index = $(this).index();
						showCorrImg(index);
					})
					//鼠标移入缩略图(上一个、下一个按钮)暂停轮播定时器，移出开启定时器
					$(".thumbnail,div.carousel span").hover(function(){ 
						clearInterval(carouselTimer);
					},function(){
						carouselTimer = setInterval(carousel,3000);
					})
					//点击上一个按钮显示上一个
					$(".prev").click(function(){
						index -= 1;
						if(index<0) index=$(".thumbnail ul li").length-1;
						showCorrImg(index);
					})
					//点击下一个按钮显示下一个
					$(".next").click(function(){
						index += 1;
						if(index==$(".carousel ul li").length-1) index=0;
						showCorrImg(index);
					})
				}
			}
		}
	});
	var data = movieList;
	
})