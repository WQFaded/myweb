$(function(){
	function uniformLiHeight($ul,flag){
		$ul.find("a").css("height","auto");
		var arrAH=[], arrLiH=[];
		for(var i=0;i<$ul.find("li").length;i++){
			arrAH[i] = $ul.find("a").eq(i).height();
			arrLiH[i] = $ul.find("li").eq(i).height();
		}
		if(flag){
			$ul.find("a").height(Math.max.apply(null,arrLiH));
		}else{
			$ul.find("a").height(Math.max.apply(null,arrAH));
		}
	}
	function ulFalse(){
		//Web前端开发
		uniformLiHeight($("ul.webMaterial"),false);
		uniformLiHeight($("ul.UIFrame"),false);
		uniformLiHeight($("ul.CSSFrame"),false);
		uniformLiHeight($("ul.JSFrame"),false);
		uniformLiHeight($("ul.others"),false);
		uniformLiHeight($("ul.webBasicStudy"),false);
		//电影资源
		uniformLiHeight($("ul.movieSite"),false);
		uniformLiHeight($("ul.movieForum"),false);
		uniformLiHeight($("ul.movieSubtitle"),false);
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
		if($(".siteList p").is(":hidden")){
			ulFalse();
		}else{
			//Web前端开发
			uniformLiHeight($("ul.webMaterial"),true);
			uniformLiHeight($("ul.UIFrame"),true);
			uniformLiHeight($("ul.CSSFrame"),true);
			uniformLiHeight($("ul.JSFrame"),true);
			uniformLiHeight($("ul.others"),true);
			uniformLiHeight($("ul.webBasicStudy"),true);
			//电影资源
			uniformLiHeight($("ul.movieSite"),true);
			uniformLiHeight($("ul.movieForum"),true);
			uniformLiHeight($("ul.movieSubtitle"),true);
		}
		$(".siteList>li").hide().eq(0).show();
	})
	$(".siteType li").click(function(){
		$(".siteType li").removeClass("activeSiteType").eq($(this).index()).addClass("activeSiteType");
		$(".siteList>li").hide().eq($(this).index()).show();
		ulFalse();
	})
})