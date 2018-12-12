/*
 (c) Copyright 2018 JunYang. All Rights Reserved. 2018-12-10
 * */
$(function(){
	$(window).resize(function(){
		$(".carouselLeft,.carouselLeft ul,.carouselLeft i").height($(".carouselLeft img").height());
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
			$(".carouselLeft,.carouselLeft ul,.carouselLeft i").height($(".carouselLeft img").height());
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
	//热门电影
	$.getJSON("json/movieSection.json",function(data){
		for(var i in data){
			var section = data[i].section;
			for(var j in data[i].movieList){
				var imdb = data[i].movieList[j].score.imdb;
				var douban = data[i].movieList[j].score.douban;
				var releaseDate = data[i].movieList[j].releaseDate.slice(0,4);
				var movieName = data[i].movieList[j].imgName;
				var $imdbSpan = imdb==""?"":"<span class='imdb'>"+imdb+"</span>";
				$("#"+section+" ul").append("<li><div>"
					+"<span class='douban'>"+douban+"</span>"+$imdbSpan
					+"<span class='year'>"+releaseDate+"</span>"
					+"<a target='_blank' href='pages/filmDetails.html?filmName="+movieName+"&releaseDate="
					+releaseDate+"'><img src='"+data[i].movieList[j].imgUrl+"' /></a>"
					+"<p class='textOverflow'>"+movieName+"</p>"
				+"</div></li>");
			}
		}
	})
	//
	function movieSection(dataArr,$obj){
		if($obj.find("ul").find("li").length==12){
			return;
		}
		var imdb = dataArr.score.imdb;
		var douban = dataArr.score.douban;
		var releaseDate = dataArr.releaseDate.slice(0,4);
		var movieName = dataArr.imgName;
		var $imdbSpan = imdb==""?"":"<span class='imdb'>"+imdb+"</span>";
		$obj.find("ul").append("<li><div>"
			+"<span class='douban'>"+douban+"</span>"+$imdbSpan
			+"<span class='year'>"+releaseDate+"</span>"
			+"<a target='_blank' href='pages/filmDetails.html?filmName="+movieName+"&releaseDate="
			+releaseDate+"'><img src='"+dataArr.imgUrl+"' /></a>"
			+"<p class='textOverflow'>"+movieName+"</p>"
		+"</div></li>");
	}
	$.getJSON("json/movieList.json",function(data){
		for(var a in data){
			if(data[a].type.indexOf("喜剧") != -1){
				movieSection(data[a],$("#comedy"));
			}
			if(data[a].type.indexOf("动作") != -1){
				movieSection(data[a],$("#actioner"));
			}
			if(data[a].type.indexOf("爱情") != -1){
				movieSection(data[a],$("#affectional"));
			}
		}
	})
})