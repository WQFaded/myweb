$(function(){
	
	layui.use(['layer','laypage'],function(){
		
		var layer = layui.layer;
		var laypage = layui.laypage;
		
		var pageNum = 1; //页码，1代表第一页
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
		if($.cookie("index")==undefined){
			getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
		}else{
			pageNum = $.cookie("index");
			getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
		}
		function createPaging(count,limit,curr){
			laypage.render({
			    elem: $("#paging")[0], //注意，这里的 test1 是 ID，不用加 #号
			    count: count, //数据总数，从服务端得到
			    limit: limit,
			    curr: curr, //获取起始页
  				hash: 'page', //自定义hash值
			    layout: ['count','prev','page','next','skip'],
			    groups: 3,
			    jump: function(obj,first){
			    	//首次不执行
				    if(!first){
				    	isClickFiltrate = false;
				    	$(window).scrollTop(0);
				    	pageNum = obj.curr;
				      	getMovieListData(obj.curr,obj.limit,type,productionAreas,year,sort);
				    }
			    }
			});
		}
		//获取分页数据
		function getMovieListData(pageNum,pageSize,type,productionAreas,year,sort){
			var uploadData = {
				pageNum: pageNum, 
				pageSize: pageSize, 
				type:type, 
				productionAreas:productionAreas, 
				releaseDate: year, sort:sort,
			};
			$.ajax({
				type:"get", dataType:"json", url: getMovieListUrl,
				data: uploadData,
				success: function(data){
					if(data.num_rows==0){
						$("#GraphicList").text("未找到与此项相关的电影");
						$("#textList").text("未找到与此项相关的电影");
						layer.msg("未找到与此项相关的电影",{icon: 5, time: 1000});
						$("#paging").hide();
						return;
					}else if(isClickFiltrate){
						layer.msg("找到与此项相关的 <strong>"+data.num_rows+"</strong> 个电影",{icon: 6, time: 800});
						$("#paging").show();
					}
					getMovieList(data);
				},
				error: function(e){
					console.log(e);
				}
			});
		}
		function showContent(data){
			//清空之前的分页内容
			$("#GraphicList").empty();
			$("#textList").empty();
			for(var k=0;k<data.length;k++){
				//图文列表
				var $imdbSpan = data[k].imdb==""?"":"<span class='imdb'>"+data[k].imdb+"</span>";
				var releaseDate = data[k].releaseDate.slice(0,4);
				$("#GraphicList").append("<li>"
					+"<div>"
						+"<span class='douban'>"+data[k].douban+"</span>"
						+$imdbSpan
						+"<span class='year'>"+releaseDate+"</span>"
						+"<a target='_blank' href='../moviedetails/?filmName="+data[k].movieName+"&releaseDate="+releaseDate+"' title='"+data[k].movieTitle+"'>"
							+"<img src='"+data[k].imgUrl+"' />"
						+"</a>"
						+"<p>"+data[k].movieName+"</p>"
					+"</div>"
				+"</li>");
				//文字列表
				var douban = data[k].douban==""?"无":data[k].douban+"分";
				var imdb = data[k].imdb==""?"无":data[k].imdb+"分";
				var green = parseInt(douban)>=7&&parseInt(douban)<8?'green':'';
				var red = parseInt(douban)>=8?'red':'';
				var cla = red ? red : green;
				$("#textList").append("<li>"
					+"<a class='"+cla+"' target='_blank' href='../moviedetails/?filmName="+data[k].movieName+"&releaseDate="+releaseDate+"'>"+data[k].movieTitle+"</a>"
					+"<p>"
						+"<span class='douban'>"+douban+"</span>"
						+"<span class='imdb'>"+imdb+"</span>"
						+"<i>"+data[k].updateTime.slice(0,10)+"</i>"
					+"</p>"
				+"</li>");
			}
			$("#textList li a").css("max-width",$("#textList li").width()-$("#textList li p").width());
			$.cookie("index",pageNum);
		}
		function getMovieList(movieData){
			createPaging(movieData.num_rows,pageSize,parseInt(pageNum));
			showContent(movieData.pagingData);
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
					$("#paging").hide();
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
		//点击回车搜索
		$(document).keyup(function(event){
		  	if(event.keyCode == 13 && $("#movieName").is(":focus")){
		    	$("#searchMovie").click();
		  	}
		});
		//条件筛选
		var isClickFiltrate = false; //判断是否点击了筛选条件
		function filtrateSameMethod($obj,$this){
			isClickFiltrate = true;
			$obj.removeClass("activeFiltrate").eq($this.index()).addClass("activeFiltrate");
			pageNum = 1;
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
			pageNum = 1;
			isClickFiltrate = true;
			getMovieListData(pageNum,pageSize,type,productionAreas,year,sort);
		})
		
		$(window).resize(function(){
			$("#textList li a").css("max-width",$("#textList li").width()-$("#textList li p").width());
		})
	});
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
})