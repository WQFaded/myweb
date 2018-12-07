$(function(){
	function uniformLiHeight($ul){
		$ul.find("a").css("height","auto");
		var arrAH=[], arrLiH=[];
		for(var i=0;i<$ul.find("li").length;i++){
			arrAH[i] = $ul.find("a").eq(i).height();
			arrLiH[i] = $ul.find("li").eq(i).height();
		}
		$ul.find("a").height(Math.max.apply(null,arrAH));
		$(".siteList a").css({
			"padding": "4px",
			"width": "95%"
		});
		//$ul.find("a").height(Math.max.apply(null,arrAH));
	}
	function ulFalse(){
		//Web前端开发
		uniformLiHeight($("ul.webMaterial"));
		uniformLiHeight($("ul.UIFrame"));
		uniformLiHeight($("ul.CSSFrame"));
		uniformLiHeight($("ul.JSFrame"));
		uniformLiHeight($("ul.others"));
		uniformLiHeight($("ul.webBasicStudy"));
		//电影资源
		uniformLiHeight($("ul.movieSite"));
		uniformLiHeight($("ul.movieForum"));
		uniformLiHeight($("ul.movieSubtitle"));
		uniformLiHeight($("ul.MagnetURI"));
	}
	$(window).resize(function(){
		ulFalse();
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
		ulFalse();
		$(".siteList>li").hide().eq(0).show();
	})
	$(".siteType li").click(function(){
		$(".siteType li").removeClass("activeSiteType").eq($(this).index()).addClass("activeSiteType");
		$(".siteList>li").hide().eq($(this).index()).show();
		ulFalse();
	})
})