$(function(){
	/*获取cookie设置列表显示方式*/
	function GraphicShow(){
		$("#displayMode").removeClass("icon-tuwenliebiao").addClass("icon-wenziliebiao").text("切换文字列表");
		$("#GraphicList").show();
		$("#textList").hide();
	}
	function textShow(){
		$("#displayMode").removeClass("icon-wenziliebiao").addClass("icon-tuwenliebiao").text("切换图文平铺");
		$("#GraphicList").hide();
		$("#textList").show();
	}
	if($.cookie("displayMode")==0||$.cookie("displayMode")==undefined){
		textShow();
	}else{
		GraphicShow();
	}
	//获取分页数据
	var pageNum = 0; //定义页码，0代表第一页
	var pageSize = 24; //定义每页显示条数
	var type = "all"; //定义电影显示类型，默认显示全部
	function getMovieListData(pageNum,pageSize){
		$.ajax({
			type:"get", dataType:"json", url: getMovieListUrl,
			data: {pageNum: pageNum, pageSize: pageSize},
			success: function(data){
				getMovieList(data);
			},
			error: function(e){
				console.log(e);
			}
		});
	}
	if($.cookie("index")==undefined){
		getMovieListData(pageNum,pageSize);
	}else{
		pageNum = $.cookie("index");
		getMovieListData(pageNum,pageSize);
	}
	function getMovieList(movieData){
		var data = movieData.pagingData;
		var paginations = Math.ceil(movieData.num_rows/pageSize); //总页码数
		function showContent(data){
			//清空之前的分页内容
			$("#GraphicList").empty();
			$("#textList").empty();
			for(var k=0;k<data.length;k++){
				//图文列表
				var $imdbSpan = data[k].imdb==""?"":"<span class='imdb'>"+data[k].imdb+"</span>";
				$("#GraphicList").append("<li><div>"
					+"<span class='douban'>"+data[k].douban+"</span>"+$imdbSpan
					+"<span class='year'>"+data[k].releaseDate.slice(0,4)+"</span>"
					+"<a target='_blank' href='filmDetails.html?filmName="+data[k].movieName+"&releaseDate="
					+data[k].releaseDate+"' title='"+data[k].movieTitle+"'><img src='"+data[k].imgUrl+"' /></a>"
					+"<p>"+data[k].movieName+"</p>"
				+"</div></li>");
				//文字列表
				var douban = data[k].douban==""?"暂无":data[k].douban+"分";
				var imdb = data[k].imdb==""?"暂无":data[k].imdb+"分";
				var green = parseInt(douban)>=7&&parseInt(douban)<8?'green':'';
				var red = parseInt(douban)>=8?'red':'';
				var cla = red ? red : green;
				$("#textList").append("<li>"
					+"<a class='"+cla+"' target='_blank' href='filmDetails.html?filmName="
					+data[k].movieName+"&releaseDate="+data[k].releaseDate+"'>"+data[k].movieTitle+"</a>"
					+"<p><span class='douban'>"+douban+"</span><span class='imdb'>"+imdb+"</span><i>"+data[k].updateTime.slice(0,10)+"</i></p>"
				+"</li>");
			}
			$("#textList li a").css("max-width",$("#textList li").width()-$("#textList li p").width());
			$.cookie("index",pageNum);
		}
		$("#pagination").empty();
		//创建上一页
		$("<span id='prev'>上一页</span>").appendTo("#pagination").click(function(){ 
			if($("#pagination a.current").index()==1){
				return;
			}
			pageNum = $("#pagination a.current").index()-2;
			getMovieListData(pageNum,pageSize);
			$(window).scrollTop(0);
		});
		//创建页码
		for(var i=1;i<=paginations;i++){
			$("<a href='#'>"+i+"</a>").appendTo("#pagination").click(function(){
				pageNum = parseInt($(this).text())-1;
				getMovieListData(pageNum,pageSize);
			});
		}
		//默认显示页数及内容
		$("#pagination a").eq(0).addClass("current"); $("#prev").addClass("not-allowed");
		showContent(data);
		//创建下一页
		$("<span id='next'>下一页</span>").appendTo("#pagination").click(function(){ 
			if($("#pagination a.current").index()==paginations){
				return;
			} 
			pageNum = $("#pagination a.current").index();
			getMovieListData(pageNum,pageSize);
			$(window).scrollTop(0);
		});
		if($.cookie("index")!=undefined){
			var index = parseInt($.cookie("index"));
			$("#pagination a").removeClass("current").eq(index).addClass("current");
			index+1==1?$("#prev").addClass("not-allowed"):$("#prev").removeClass("not-allowed");
			index+1==paginations?$("#next").addClass("not-allowed"):$("#next").removeClass("not-allowed");
		}
	}
	
	$(window).resize(function(){
		$("#textList li a").css("max-width",$("#textList li").width()-$("#textList li p").width());
	})
	//切换显示方式
	$("#displayMode").click(function(){
		if($("#displayMode").hasClass("icon-tuwenliebiao")){
			GraphicShow();
			$.cookie("displayMode",1);
		}else{
			textShow();
			$("#textList li a").css("max-width",$("#textList li").width()-$("#textList li p").width());
			$.cookie("displayMode",0);
		}
	})
})