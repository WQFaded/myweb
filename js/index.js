/*
 (c) Copyright 2018 JunYang. All Rights Reserved. 2018-12-10
 * */
$(function(){
	$(window).resize(function(){
		$(".carousel,.carouselLeft,.carouselLeft ul,.carouselLeft i").height($(".carouselLeft img").height());
		$(".carouselLeft img").css("height","auto");
	})
	//透明度轮播
	var index = 0; //定义轮播索引
	function show(){
		if(index==$(".carouselLeft ul li").length){
			index = 0;	
		}else if(index<0){
			index = $(".carouselLeft ul li").length-1;
		}
		$(".carouselLeft ul li").stop(false,true).eq(index).animate({"opacity": 1},1000).siblings().animate({"opacity": 0},1000);
		$(".carouselLeft ul li").eq(index).css("z-index",9).siblings().css("z-index",0);
		$(".carouselLeft ol li").removeClass("focalPoint").eq(index).addClass("focalPoint");
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
			$(".carouselLeft ol").append("<li></li>");
		}
		$(".carouselLeft ol li:first").addClass("focalPoint");
		$(".carouselLeft img")[0].onload = function(){
			$(".carousel,.carouselLeft,.carouselLeft ul,.carouselLeft i").height($(".carouselLeft img").height());
			$(".carouselLeft img").height($(".carouselLeft").height());
			$(".carouselLeft i").show();
		}
		$(".carouselLeft ol li").click(function(){
			index = $(this).index();
			show();
		})
		$(".carouselLeft i,.carouselLeft ol li").hover(function(){
			clearInterval(carouselTimer);
		},function(){
			carouselTimer = setInterval(carousel,4000);
		})
	})
	//上一张
	$(".carouselLeft .icon-left").click(function(){
		index--;
		show();
	})
	//下一张
	$(".carouselLeft .icon-right").click(function(){
		index++;
		show();
	})
})