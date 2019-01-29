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
	$(".carouselLeft ol li").click(function(){
		index = $(this).index();
		show();
	})
	$(".carouselLeft i,.carouselLeft ol li").hover(function(){
		clearInterval(carouselTimer);
	},function(){
		carouselTimer = setInterval(carousel,4000);
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
	//
	function movieSection(dataArr,$obj){
		if($obj.find("ul").find("li").length==12){ //显示前12个
			return;
		}
		var imdb = dataArr.imdb;
		var douban = dataArr.douban;
		var releaseDate = dataArr.releaseDate.slice(0,4);
		var movieName = dataArr.movieName;
		var $imdbSpan = imdb==""?"":"<span class='imdb'>"+imdb+"</span>";
		$obj.find("ul").append("<li>"
			+"<div>"
				+"<span class='douban'>"+douban+"</span>"
				+$imdbSpan
				+"<span class='year'>"+releaseDate+"</span>"
				+"<a target='_blank' href='moviedetails/?filmName="+movieName+"&releaseDate="+releaseDate+"'>"
					+"<img src='"+dataArr.imgUrl+"' />"
				+"</a>"
				+"<p class='textOverflow'>"+movieName+"</p>"
			+"</div>"
		+"</li>");
	}
	$.ajax({
		type:"get", dataType:"json", url: getMovieListUrl,
		data: {movieType: "喜剧,动作,科幻,恐怖,惊悚,冒险,犯罪,动画"},
		success: function(data){
			for(var a in data){
				if(data[a].type.indexOf("喜剧") != -1){
					movieSection(data[a],$("#comedy"));
				}
				if(data[a].type.indexOf("动作") != -1){
					movieSection(data[a],$("#actioner"));
				}
				if(data[a].type.indexOf("科幻") != -1){
					movieSection(data[a],$("#sci-fi"));
				}
				if(data[a].type.indexOf("恐怖") != -1){
					movieSection(data[a],$("#horror"));
				}
				if(data[a].type.indexOf("惊悚") != -1){
					movieSection(data[a],$("#panic"));
				}
				if(data[a].type.indexOf("冒险") != -1){
					movieSection(data[a],$("#adventure"));
				}
				if(data[a].type.indexOf("犯罪") != -1){
					movieSection(data[a],$("#crime"));
				}
				if(data[a].type.indexOf("动画") != -1){
					movieSection(data[a],$("#animated"));
				}
			}
		}
	});
	$.ajax({
		type:"get", dataType:"json", url: getMovieListUrl,
		data: {first12: "all"},
		success: function(data){
			for(var i in data){
				movieSection(data[i],$("#hotMovie"));
			}
		}
	})
})