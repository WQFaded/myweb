/*
 (c) Copyright 2018 JunYang. All Rights Reserved. 2018-12-10
 * */
$(function(){
	$(window).resize(function(){
		$(".carousel,.carouselLeft,.carouselLeft ul").height($(".carouselLeft img").height());
	})
	//透明度轮播
	var index = 0; //定义轮播索引
	function show(){
		if(index==$(".carouselLeft ul li").length){
			index = 0;	
		}else if(index<0){
			index = $(".carouselLeft ul li").length-1;
		}
		$(".carouselLeft ul li").stop();
		$(".carouselLeft ul li").eq(index).animate({"opacity": 1},1000).siblings().animate({"opacity": 0},1000);
		$(".carouselLeft ul li").eq(index).css("z-index",9).siblings().css("z-index",0);
	}
	var carousel = function(){
		index++;
		show();
	}
	var carouselTimer = setInterval(carousel,4000);
	$.getJSON("json/indexCarousel.json",function(data){
		for(var i in data){
			var movieName = data[i].movieName;
			var releaseDate = data[i].releaseDate.slice(0,4);
			$(".carouselLeft ul").append("<li>"
				+"<a target='_blank' href='pages/filmDetails.html?filmName="+movieName+"&releaseDate="+releaseDate+"'>"
				+"<img src='"+data[i].moviePoster+"' /></a>"
			+"</li>");
		}
		$(".carouselLeft img")[0].onload = function(){
			$(".carousel,.carouselLeft,.carouselLeft ul").height($(".carouselLeft img").height());
		}
	})
	//上一张
	$(".carouselLeft .icon-xiangzuo").click(function(){
		index--;
		show();
	})
	//下一张
	$(".carouselLeft .icon-xiangyou").click(function(){
		index++;
		show();
	})
})