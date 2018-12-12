$(function(){
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
	$.getJSON("../json/sites.json",function(data){
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].siteList.length;j++){
				$(".siteList li."+data[i].siteBigType+" ul."+data[i].siteList[j].siteSmallType).append("<li>"
					+"<a target='_blank' href='"+data[i].siteList[j].webSite+"'>"
					+"<div><img src='"+data[i].siteList[j].siteIcon+"'/>"
					+"<span>"+data[i].siteList[j].siteName+"</span></div>"
					+"<p>"+data[i].siteList[j].websiteDesc+"</p>"
					+"</a>"
				+"</li>");
			}
		}
		$(".siteList img")[0].onload = function(){
			setLiH();
		}
		$(".siteList>li").hide().eq(0).show();
	})
	$(".siteType li").click(function(){
		$(".siteType li").removeClass("activeSiteType").eq($(this).index()).addClass("activeSiteType");
		$(".siteList>li").hide().eq($(this).index()).show();
		setLiH();
	})
})