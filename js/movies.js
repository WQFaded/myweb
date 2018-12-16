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
	if($.cookie("displayMode")==0){
		textShow();
	}else{
		GraphicShow();
	}
	//获取分页数据
	var data = movieList.sort(sortBy("updateTime",false)); //根据更新日期降序排序
	var number_entries = 24; //设置每页条目数
	if(number_entries>data.length) number_entries = data.length;
	var paginations = Math.ceil(data.length/number_entries); //总页码数
	function showContent(start,end){
		//清空之前的分页内容
		$("#GraphicList").empty();
		$("#textList").empty();
		for(var k=start;k<end;k++){
			//图文列表
			var $imdbSpan = data[k].score.imdb==""?"":"<span class='imdb'>"+data[k].score.imdb+"</span>";
			$("#GraphicList").append("<li><div>"
				+"<span class='douban'>"+data[k].score.douban+"</span>"+$imdbSpan
				+"<span class='year'>"+data[k].releaseDate.slice(0,4)+"</span>"
				+"<a target='_blank' href='filmDetails.html?filmName="+data[k].imgName+"&releaseDate="
				+data[k].releaseDate.slice(0,4)+"'><img src='"+data[k].imgUrl+"' /></a>"
				+"<p>"+data[k].imgName+"</p>"
			+"</div></li>");
			//文字列表
			var douban = data[k].score.douban==""?"暂无":data[k].score.douban+"分";
			var imdb = data[k].score.imdb==""?"暂无":data[k].score.imdb+"分";
			var green = parseInt(douban)>=7&&parseInt(douban)<8?'green':'';
			var red = parseInt(douban)>=8?'red':'';
			var cla = red ? red : green;
			$("#textList").append("<li>"
				+"<a class='"+cla+"' target='_blank' href='filmDetails.html?filmName="
				+data[k].imgName+"&releaseDate="+data[k].releaseDate.slice(0,4)+"'>"+data[k].textName+"</a>"
				+"<p><span class='douban'>"+douban+"</span><span class='imdb'>"+imdb+"</span><i>"+data[k].updateTime.slice(0,10)+"</i></p>"
			+"</li>");
		}
		$("#textList li a").css("max-width",$("#textList li").width()-$("#textList li p").width());
		$.cookie("start",start); $.cookie("end",end); $.cookie("index",$("#pagination a.current").text());
	}
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
		//分页开始截取的地方
		var start = (prev-1)*number_entries; 
		//分页结束截取的地方
		var end = Math.min((prev-1)*number_entries+number_entries,data.length);
		//显示对应分页内容
		showContent(start,end);
	});
	//创建页码
	for(var i=1;i<=paginations;i++){
		$("<a>"+i+"</a>").appendTo("#pagination").click(function(){
			parseInt($(this).text())==1?$("#prev").addClass("not-allowed"):$("#prev").removeClass("not-allowed");
			parseInt($(this).text())==paginations?$("#next").addClass("not-allowed"):$("#next").removeClass("not-allowed");
			$("#pagination a").removeClass("current").eq(parseInt($(this).text())-1).addClass("current");
			//分页开始截取的地方
			var start = (parseInt($(this).text())-1)*number_entries;
			//分页结束截取的地方
			var end = Math.min((parseInt($(this).text())-1)*number_entries+number_entries,data.length); 
			//显示对应分页内容
			showContent(start,end);
		});
	}
	//默认显示页数及内容
	$("#pagination a").eq(0).addClass("current");
	$("#prev").addClass("not-allowed");	
	if($.cookie("index")){
		var index = parseInt($.cookie("index"));
		$("#pagination a").removeClass("current").eq(index-1).addClass("current");
	}
	var start = 0, end = number_entries;
	if($.cookie("start")&&$.cookie("end")){
		start = $.cookie("start"), end = $.cookie("end");
	}
	showContent(start,end);
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
		//分页开始截取的地方
		var start = next*number_entries; 
		//分页结束截取的地方
		var end = Math.min(next*number_entries+number_entries,data.length); 
		//显示对应分页内容
		showContent(start,end);
	});
	if(number_entries>=data.length){
		$("#next").addClass("not-allowed");
	}
	if($.cookie("index")){
		parseInt($.cookie("index"))==1?$("#prev").addClass("not-allowed"):$("#prev").removeClass("not-allowed");
		parseInt($.cookie("index"))==paginations?$("#next").addClass("not-allowed"):$("#next").removeClass("not-allowed");
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