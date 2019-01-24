$(function(){
	window.addEventListener("mousewheel", (e) => {
	   if (e.deltaY === 1) {
	     e.preventDefault();
	   }
	})
	$(".icon-liebiao").click(function(){
		$(".nav").slideToggle("fast");
	})
	$(window).resize(function(){
		if($(".icon-liebiao").is(":hidden")){
			$(".nav").show();
		}else{
			$(".nav").hide();
		}
	})
	//返回顶部
	$(".backToTop").click(function(){
		$(window).scrollTop(0);
	})
	//设置返回顶部位置
	function setBackTopLeft(){
		var left = $(".container-full").offset().left;
		$(".backToTop").css("left",left+$(".container-full").width()-40);
		if(left>=40){
			$(".backToTop").css("left",left+$(".container-full").width()+15);
		}
	}
	$(window).resize(function(){
		setBackTopLeft();
	})
	$(window).scroll(function(){
		setBackTopLeft();
		if($(window).scrollTop()>=600){
			$(".backToTop").show();
		}else{
			$(".backToTop").hide();
		}
	})
	window.getMovieListUrl = 'https://www.wuflock.com/php/getMovieInfo.php';
	/*
	 获取地址栏url传递过来的的信息
	 * */
	window.getRequest = function(){
		var url = decodeURI(location.search); 
	   	var theRequest = new Object();  
	   	if (url.indexOf("?") != -1) {  
	      	var str = url.substr(1);  
	      	strs = str.split("&");  
	     	for(var i=0; i<strs.length; i++){  
	         	theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
	      	}  
	   	}  
	   	return theRequest;
	}
	/* *
	 * 数组根据数组对象中的某个属性值进行排序的方法
     * 使用例子：newArray.sort(sortBy('number',false))，表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
     * @param attr：排序的属性 如number属性
     * @param rev：true表示升序排列，false降序排序
     * */
    window.sortBy = function(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        return function(a,b){
        	if(attr=="score"){
        		a = a[attr]["douban"];
        		b = b[attr]["douban"];
        	}else{
        		a = a[attr];
            	b = b[attr];
        	}
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    }
    
})