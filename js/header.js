$(function(){
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
			$(".backToTop").css("left",left+$(".container-full").width()+5);
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
	
	/**数组根据数组对象中的某个属性值进行排序的方法 
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