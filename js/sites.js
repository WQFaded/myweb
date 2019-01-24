$(function(){
	
	layui.use(['element'],function(){
		
		var element = layui.element;
		
		element.on('tab(sites)',function(obj){
			getSiteList($(".siteList>div").eq($(this).index()).attr("id"));
		})
		
		function uniformLiHeight($ul){
			$ul.find("a").css("height","auto");
			var arrAH=[];
			for(var i=0;i<$ul.find("li").length;i++){
				arrAH[i] = $ul.find("a").eq(i).height();
			}
			$ul.find("a").height(Math.max.apply(null,arrAH));
		}
		function setLiH(){
			//Web前端开发
			uniformLiHeight($("ul.webMaterial"));
			uniformLiHeight($("ul.UIFrame"));
			uniformLiHeight($("ul.CSSFrame"));
			uniformLiHeight($("ul.JSFrame"));
			uniformLiHeight($("ul.others"));
			uniformLiHeight($("ul.webBasicStudy"));
			uniformLiHeight($("ul.dataPlatform"));
			//电影资源
			uniformLiHeight($("ul.movieSite"));
			uniformLiHeight($("ul.movieForum"));
			uniformLiHeight($("ul.movieSubtitle"));
			uniformLiHeight($("ul.MagnetURI"));
		}
		$(window).resize(function(){
			setLiH();
		})
		function getSiteList(siteType){
			$.ajax({
				type:"get", dataType:"json", url: getMovieListUrl,
				data:{sites:siteType},
				success: function(data){
					showSiteList(data);
				}
			});
		}; 
		getSiteList("webDeveloper");
		//$(".siteList>li").hide().eq(0).show();
		function showSiteList(data){
			$(".siteList ."+data[0].bigType+" ul").empty();
			for(var i=0;i<data.length;i++){
				$(".siteList ."+data[i].bigType+" ."+data[i].smallType).append("<li>"
					+"<a target='_blank' href='"+data[i].webSiteAddress+"'>"
					+"<div><img src='"+data[i].siteIcon+"'/>"
					+"<span>"+data[i].siteName+"</span></div>"
					+"<p>"+data[i].websiteDesc+"</p>"
					+"</a>"
				+"</li>");
			}
			$(".siteList ."+data[0].bigType+" img")[0].onload = function(){
				setLiH();
			}
		}
		$(".siteType li").click(function(){
			$(".siteType li").removeClass("activeSiteType").eq($(this).index()).addClass("activeSiteType");
			$(".siteList>li").hide().eq($(this).index()).show();
			getSiteList($(".siteList>li").eq($(this).index()).attr("class"));
		})
	})
	
})