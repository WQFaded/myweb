$(function(){
	function filtrate(type,year,area){
		
	}
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
					+data[k].releaseDate.slice(0,4)+"'><img src='"+data[k].imgUrl+"' /></a>"
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
					+data[k].movieName+"&releaseDate="+data[k].releaseDate.slice(0,4)+"'>"+data[k].movieTitle+"</a>"
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
			if($("#pagination a.current").index()==2){
				$(this).addClass("not-allowed");
			} 
			if($("#pagination a.current").index()<=paginations){
				$("#next").removeClass("not-allowed");
			}
			var prev = $("#pagination a.current").index()-1;
			$("#pagination a").removeClass("current").eq(prev-1).addClass("current");
			pageNum = prev-1;
			getMovieListData(pageNum,pageSize);
		});
		//创建页码
		for(var i=1;i<=paginations;i++){
			$("<a href='#'>"+i+"</a>").appendTo("#pagination").click(function(){
				parseInt($(this).text())==1?$("#prev").addClass("not-allowed"):$("#prev").removeClass("not-allowed");
				parseInt($(this).text())==paginations?$("#next").addClass("not-allowed"):$("#next").removeClass("not-allowed");
				$("#pagination a").removeClass("current").eq(parseInt($(this).text())-1).addClass("current");
				//显示对应分页内容
				pageNum = parseInt($(this).text())-1;
				getMovieListData(pageNum,pageSize);
			});
		}
		//默认显示页数及内容
		$("#pagination a").eq(0).addClass("current");
		$("#prev").addClass("not-allowed");
		showContent(data);
		if($.cookie("index")){
			var index = parseInt($.cookie("index"));
			console.log(index);
			$("#pagination a").removeClass("current").eq(index).addClass("current");
		}
		//创建下一页
		$("<span id='next'>下一页</span>").appendTo("#pagination").click(function(){ 
			if($("#pagination a.current").index()==paginations){
				return;
			} 
			if($("#pagination a.current").index()==paginations-1){
				$(this).addClass("not-allowed");
			} 
			if($("#pagination a.current").index()>0){
				$("#prev").removeClass("not-allowed");
			}
			var next = $("#pagination a.current").index();
			$("#pagination a").removeClass("current").eq(next).addClass("current");
			//显示对应分页内容
			pageNum = next;
			getMovieListData(pageNum,pageSize);
		});
		if($.cookie("index")){
			var index = parseInt($.cookie("index"))+1;
			index==1?$("#prev").addClass("not-allowed"):$("#prev").removeClass("not-allowed");
			index==paginations?$("#next").addClass("not-allowed"):$("#next").removeClass("not-allowed");
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