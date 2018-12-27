$(function(){
	layui.use(['layer']);
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
	var pageNum = 0; //页码，0代表第一页
	var pageSize = 24; //每页显示条数
	var type = "all"; //电影类型，默认显示全部
	var productionAreas = "all"; //制片国家/地区，默认显示全部
	var year = "all"; //电影年份，默认显示全部年份
	var sort = "updateTime"; //默认按更新时间排序
	if(getRequest().type){
		type = getRequest().type;
		history.replaceState(null,null,"movies.html");
		for(var i=0;i<$("#type li").length;i++){
			if(type==$("#type li").eq(i).text()){
				$("#type li").removeClass("activeFiltrate").eq(i).addClass("activeFiltrate");
			}
		}
	}
	//搜索框电影名搜索
	$("#searchMovie").click(function(){
		var movieName = $("#movieName").val();
		if(movieName==""){
			layer.tips("请输入要搜索的电影名", $("#movieName"),{ tips: [3,'#FF5722'], time: 1000});
			return;
		}
		$.ajax({
			type:"get", dataType:"json", url: getMovieListUrl,
			data: {searchMovie: movieName},
			success: function(data){
				$("#pagination").hide();
				if(data.length==0){
					$("#GraphicList").html("未搜索到关键字：<strong style='color: red'>"+movieName+"</strong> 的电影");
					$("#textList").html("未搜索到关键字：<strong style='color: red'>"+movieName+"</strong> 的电影");
					layer.msg("未搜索到关键字：<strong style='color: red'>"+movieName+"</strong> 的电影",{icon: 5, time: 1000});
					return;
				}
				layer.msg("搜索到关键字：<strong>"+movieName+"</strong> 的 <strong>"+data.length+"</strong> 个电影",{icon: 6, time: 1200});
				showContent(data);
			}
		});
	})
	//条件筛选
	var isClickFiltrate = false; //判断是否点击了筛选条件
	function filtrateSameMethod($obj,$this){
		isClickFiltrate = true;
		$obj.removeClass("activeFiltrate").eq($this.index()).addClass("activeFiltrate");
		pageNum = 0;
	}
	$("#type li").click(function(){
		//if($(this).index()==$("#type li.activeFiltrate").index()) return;
		filtrateSameMethod($("#type li"),$(this));
		type = $(this).text()=="全部"?"all":$(this).text();
		getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
	})
	$("#productionAreas li").click(function(){
		//if($(this).index()==$("#productionAreas li.activeFiltrate").index()) return;
		filtrateSameMethod($("#productionAreas li"),$(this));
		productionAreas = $(this).text()=="全部"?"all":$(this).text();
		getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
	})
	$("#year li").click(function(){
		//if($(this).index()==$("#year li.activeFiltrate").index()) return;
		filtrateSameMethod($("#year li"),$(this));
		year = $(this).text()=="全部"?"all":$(this).text();
		getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
	})
	$("#sort li").click(function(){
		//if($(this).index()==$("#sort li.activeFiltrate").index()) return;
		$("#sort li").removeClass("activeFiltrate").eq($(this).index()).addClass("activeFiltrate");
		sort = $(this).attr("sort");
		pageNum = 0;
		isClickFiltrate = false;
		getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
	})
	//获取分页数据
	function getMovieListData(pageNum,pageSize,type,productionAreas,year,sort){
		var uploadData = {pageNum: pageNum, pageSize: pageSize, type:type, productionAreas:productionAreas, releaseDate: year, sort:sort};
		$.ajax({
			type:"get", dataType:"json", url: getMovieListUrl,
			data: uploadData,
			success: function(data){
				if(data.num_rows==0){
					$("#GraphicList").text("未找到与此项相关的电影");
					$("#textList").text("未找到与此项相关的电影");
					layer.msg("未找到与此项相关的电影",{icon: 5, time: 1000});
					$("#pagination").hide();
					return;
				}else if(isClickFiltrate){
					layer.msg("找到与此项相关的 <strong>"+data.num_rows+"</strong> 个电影",{icon: 6, time: 800});
					$("#pagination").show();
				}
				getMovieList(data);
			},
			error: function(e){
				console.log(e);
			}
		});
	}
	if($.cookie("index")==undefined){
		getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
	}else{
		pageNum = $.cookie("index");
		getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
	}
	function showContent(data){
		//清空之前的分页内容
		$("#GraphicList").empty();
		$("#textList").empty();
		for(var k=0;k<data.length;k++){
			//图文列表
			var $imdbSpan = data[k].imdb==""?"":"<span class='imdb'>"+data[k].imdb+"</span>";
			if(data[k].imgUrl.indexOf("picb")!=-1){
				data[k].imgUrl = "https://i.loli.net/2018/12/27/5c24ed06d8bef.jpg";
			}
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
	function getMovieList(movieData){
		var data = movieData.pagingData;
		var paginations = Math.ceil(movieData.num_rows/pageSize); //总页码数
		$("#pagination").empty();
		//创建上一页
		$("<span id='prev'>上一页</span>").appendTo("#pagination").click(function(){ 
			if($("#pagination a.current").index()==1) return; 
			isClickFiltrate = false;
			pageNum = $("#pagination a.current").index()-2;
			getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
			$(window).scrollTop(0);
		});
		//创建页码
		for(var i=1;i<=paginations;i++){
			$("<a href='#'>"+i+"</a>").appendTo("#pagination").click(function(){
				if($(this).text()==$("#pagination a.current").text()) return false;
				isClickFiltrate = false;
				pageNum = parseInt($(this).text())-1;
				getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
			});
		}
		//默认显示页数及内容
		$("#pagination a").eq(0).addClass("current"); $("#prev").addClass("not-allowed");
		showContent(data);
		//创建下一页
		$("<span id='next'>下一页</span>").appendTo("#pagination").click(function(){ 
			if($("#pagination a.current").index()==paginations) return;
			isClickFiltrate = false;
			pageNum = $("#pagination a.current").index();
			getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
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
})