$(function(){
  	var getUrl = 'https://www.wuflock.com/php/getMovieInfo.php';
  	var cTable, siteTable;
	layui.use(['layer','table','form','element','laydate'],function(){
		
		var table = layui.table;
		var element = layui.element;
		var layer = layui.layer;
		var form = layui.form;
		var laydate = layui.laydate;
		
		//提交数据
	  	function submitData(data,index,tableId,obj){
	  		$.ajax({
		    	type:"post", url:"https://www.wuflock.com/php/receiveMovieInfo.php",
		    	data:data, dataType: 'json',
		    	success:function(res){
		    		if(res=="上传失败"){
		    			layer.msg(res, {icon: 2, time: 1000});
		    			return;
		    		}
		    		layer.msg(res, {icon: 1, time: 1000});
		    		table.reload(tableId);
		    		layer.close(index);
		    		if(obj){
		    			obj.del();
		    		}
		    	}
		    });
	  	}
		/*=====所有电影数据=====*/
		//日期时间选择器
		laydate.render({ 
		  	elem: '#updateTime',
		  	type: 'datetime'
		});
		var movieTable = table.render({
			elem: '#movieManage',
			toolbar: '#movieHeadTool',
			height: 'full-20',
			url: getUrl,
			where: {allMovie:"all"},
			page: true,
			limit: 30,
			id: 'allMovie',
			cols: [[
				//{type: 'checkbox'},
				{field:'movieName', title:'电影名'},
				{field:'movieTitle', title:'电影标题', edit:'text'},
				{field:'douban', title:'豆瓣', edit:'text', sort:true, width:70, align:'center'},
				{field:'imdb', title:'IMDB', edit:'text', sort:true, width:75, align:'center'},
				{field:'type', title:'电影类型', edit:'text',},
				{field:'productionAreas', title:'制片国家/地区', edit:'text'},
				{field:'releaseDate', title:'上映日期', edit:'text'},
				{field:'movieTime', title: '电影时长', edit:'text', width:90},
				{field:'imgUrl', title:'电影海报', edit:'text'},
				{field:'movieCapture', title:'电影截图', edit:'text'},
				{title:'操作', toolbar:'#dataManipulation', align:'center', width:161, fixed:'right'}
			]],
			parseData: function(data){
				//console.log(data);
			}
		})
		var isEdit = false, oldMovieName;
		//监听单元格编辑
		table.on('edit(movieManage)', function(obj){ 
		  	isEdit = true;
		  	oldMovieName = obj.data.movieName;
		});
		//监听操作栏按钮
		var title, movieWin;
		function movieWindow(title){
			movieWin = layer.open({
				type: 1,
				title: title,
				area: '1035px',
				maxWidth: '100%',
				content: $('#movieForm'),
			})
		}
		table.on('tool(movieManage)',function(obj){
			var data = obj.data;
			if(obj.event == 'edit'){ //编辑
				$("#movieForm input[name='movieName']").attr("disabled",true);
				title = '修改电影数据';
				movieWindow(title);
				for(var key in data){
					$("#movieForm input[name='"+key+"']").val(data[key]);
				}
				$("#movieForm textarea[name='magnets']").val(data.magnets);
			}
			if(obj.event == 'save'){ //保存
				if(isEdit && oldMovieName==data.movieName){
					data["msg"] = "update";
			    	submitData(data,movieWin,'allMovie');
			    	isEdit = false;
				}else{
					layer.msg("电影<strong> "+data.movieName+" </strong>信息没有修改，不作保存", {icon:2, time: 1000});
				}
			}
			if(obj.event == 'del'){ //删除
				data['msg'] = "delete";
				layer.confirm('确定删除<strong> '+data.movieName+' </strong>这部电影吗？',function(index){
					submitData(data,index,'allMovie',obj);
				})
			}
		})
		//监听头部工具栏
	  	table.on('toolbar(movieManage)',function(obj){
	  		if(obj.event=='search'){ //搜索
	  			if($("#movieName").val()){
	  				var index = layer.msg('查询中，请稍候...',{icon: 16,time:false,shade:0});
	  				setTimeout(function(){
	  					movieTable.reload({
			  				where:{
			  					'movieName': $("#movieName").val()
			  				},
			  				page:{ 
			  					curr:1 
			  				}
			  			})
	  					layer.close(index);
	  				},500)
	  			}else{
	  				layer.tips("请输入要查询的电影名", $("#movieName"),{ tips: [3,'#FF5722'], time: 1000});
	  			}
	  		}
	  		if(obj.event=='addMovie'){ //添加
	  			$("#movieForm input[name='movieName']").attr("disabled",false);
	  			$("#movieForm input,#movieForm textarea").val("");
	  			title = '新增电影';
				movieWindow(title);
	  		}
	  		if(obj.event == 'refresh'){
				movieTable.reload({
					where:{
	  					'movieName': ''
	  				},
	  				page:{ 
	  					curr:1 
	  				}
				});
			}
	  	})
		//监听提交按钮
		form.on('submit(submit)', function(data){
			var uploadData = data.field;
			if(title=="新增电影"){
				uploadData["msg"] = "insert";
			}else if(title=="修改电影数据"){
				uploadData["msg"] = "update";
			}else{
				return;
			}
		    submitData(uploadData,movieWin,'allMovie');
		    return false;
		});
		
		/*=====首页轮播数据=====*/
		laydate.render({ 
		  	elem: '#carouselUpdateTime',
		  	type: 'datetime'
		});
		cTable = table.render({
			elem: '#carousel',
			toolbar: '#carouselHeadTool',
			height: 'full-20',
			url: getUrl,
			where: {carousel:"all"},
			page: true,
			limit: 20,
			id: 'cMovie',
			cols: [[
				//{type: 'checkbox'},
				{field:'movieName', title:'电影名'},
				{field:'releaseDate', title:'上映日期', edit:'text'},
				{field:'moviePoster', title:'电影海报', edit:'text'},
				{field:'updateTime', title:'更新时间', edit:'text'},
				{title:'操作', toolbar:'#dataManipulation', align:'center', width:161}
			]],
			parseData: function(data){
				//console.log(data);
			}
		})
		//监听头部工具
		var cTitle, cwindow;
		function cwin(title){
			cwindow = layer.open({
				type: 1,
				title: title,
				area: '600px',
				content: $('#carouselForm'),
			})
		}
		table.on('toolbar(carouselTable)',function(obj){
			if(obj.event == 'add'){
				$("#carouselForm input[name='movieName']").attr("disabled",false);
				$('#carouselForm input[type=text]').val("");
				cTitle = '添加首页轮播电影信息';
				cwin(cTitle);
			}
		})
		//监听表格工具栏
		table.on('tool(carouselTable)',function(obj){
			var data = obj.data;
			if(obj.event == 'edit'){
				$("#carouselForm input[name='movieName']").attr("disabled",true);
				cTitle = '编辑首页轮播电影信息';
				cwin(cTitle);
				for(var key in data){
					$("#carouselForm input[name='"+key+"']").val(data[key]);
				}
			}
			if(obj.event == 'save'){
				
			}
			if(obj.event == 'del'){
				var delData = {};
				delData['movieName'] = data.movieName;
				delData['cmsg'] = "delete";
				layer.confirm('确定删除<strong> '+data.movieName+' </strong>这部电影吗？',function(index){
					submitData(delData,index,'cMovie',obj);
				})
			}
		})
		//监听提交按钮
		form.on('submit(submitCarousel)',function(data){
			var uploadData = data.field;
			if(cTitle=="添加首页轮播电影信息"){
				uploadData["cmsg"] = "insert";
			}else if(cTitle=="编辑首页轮播电影信息"){
				uploadData["cmsg"] = "update";
			}else{
				return;
			}
		    submitData(uploadData,cwindow,'cMovie');
		    return false;
		});
		
		/*=====网站收藏数据=====*/
		laydate.render({ 
		  	elem: '#siteUpdateTime',
		  	type: 'datetime'
		});
		siteTable = table.render({
			elem: '#siteCollection',
			toolbar: '#siteHeadTool',
			height: 'full-20',
			url: getUrl,
			where: {sitesData:"all"},
			page: true,
			limit: 20,
			id: 'sites',
			cols: [[
				//{type: 'checkbox'},
				{field:'bigType', title:'大类别'},
				{field:'smallType', title:'小类别', edit:'text'},
				{field:'siteName', title:'网站名称', edit:'text'},
				{field:'siteIcon', title:'网站图标', edit:'text'},
				{field:'webSiteAddress', title:'网站网址', edit:'text'},
				{field:'websiteDesc', title:'网站描述', edit:'text'},
				//{field:'updateTime', title:'更新时间', edit:'text'},
				{title:'操作', toolbar:'#dataManipulation', align:'center', width:161}
			]],
			parseData: function(data){
				//console.log(data);
			}
		})
		//监听头部工具
		var siteTitle, siteWindow;
		function siteWin(title){
			siteWindow = layer.open({
				type: 1,
				title: title,
				area: '623px',
				content: $('#siteForm'),
			})
		}
		table.on('toolbar(siteTable)',function(obj){
			if(obj.event == 'addSite'){
				$('#siteForm input[type=text],#siteForm textarea').val("");
				siteTitle = '添加网站';
				siteWin(siteTitle);
			}
			if(obj.event == 'search'){
				if($("#siteName").val()){
	  				var index = layer.msg('查询中，请稍候...',{icon: 16,time:false,shade:0});
	  				setTimeout(function(){
	  					siteTable.reload({
			  				where:{
			  					'siteName': $("#siteName").val()
			  				},
			  				page:{ 
			  					curr:1 
			  				}
			  			})
	  					layer.close(index);
	  				},500)
	  			}else{
	  				layer.tips("请输入要查询的网站名", $("#siteName"),{ tips: [3,'#FF5722'], time: 1000});
	  			}
			}
			if(obj.event == 'refresh'){
				siteTable.reload({
					where:{
	  					'siteName': ''
	  				},
	  				page:{ 
	  					curr:1 
	  				}
				});
			}
		})
		//监听表格工具栏
		var webDeveloperArr = ['webMaterial','UIFrame','CSSFrame','JSFrame','dataPlatform','webBasicStudy','others'],
			movieResourcesArr = ['movieSite','movieForum','movieSubtitle','MagnetURI'];
		table.on('tool(siteTable)',function(obj){
			var data = obj.data;
			if(obj.event == 'edit'){
				siteTitle = '编辑网站信息';
				siteWin(siteTitle);
				for(var key in data){
					$("#siteForm input[name='"+key+"']").val(data[key]);
				}
				$("#siteForm textarea").val(data.websiteDesc);
				$("#siteForm select[name='bigType']").val(data.bigType);
				var $smallTypeSelect = $('select[name="smallType"]');
				$smallTypeSelect.empty();
				if(data.bigType=='webDeveloper'){
					for(var i in webDeveloperArr){
						$smallTypeSelect.append('<option value="'+webDeveloperArr[i]+'">'+webDeveloperArr[i]+'</option>');
					}
				}else if(data.bigType=='movieResources'){
					for(var j in movieResourcesArr){
						$smallTypeSelect.append('<option value="'+movieResourcesArr[j]+'">'+movieResourcesArr[j]+'</option>');
					}
				}
				$smallTypeSelect.val(data.smallType);
				form.render('select','site');
			}
			if(obj.event == 'save'){
				
			}
			if(obj.event == 'del'){
				data['siteMsg'] = "delete";
				layer.confirm('确定删除<strong> '+data.siteName+' </strong>这个网站吗？',function(index){
					submitData(data,siteWindow,'sites',obj);
				})
			}
		})
		//监听表单select
		form.on('select(bigType)',function(data){
			//console.log(data);
			var $smallTypeSelect = $('select[name="smallType"]');
			$smallTypeSelect.empty();
			if(data.value=='webDeveloper'){
				for(var i in webDeveloperArr){
					$smallTypeSelect.append('<option value="'+webDeveloperArr[i]+'">'+webDeveloperArr[i]+'</option>');
				}
			}else if(data.value=='movieResources'){
				for(var j in movieResourcesArr){
					$smallTypeSelect.append('<option value="'+movieResourcesArr[j]+'">'+movieResourcesArr[j]+'</option>');
				}
			}else{
				$smallTypeSelect.append('<option value="">需先选择大类别</option>');
			}
			form.render('select','site');
		})
		//表单提交
		form.on('submit(submitSite)',function(data){
			var uploadData = data.field;
			if(siteTitle=="添加网站"){
				uploadData["siteMsg"] = "insert";
			}else if(siteTitle=="编辑网站信息"){
				uploadData["siteMsg"] = "update";
			}else{
				return;
			}
		    submitData(uploadData,siteWindow,'sites');
		    return false;
		});
	});
	$("#dataManageNav li").click(function(){
		$("#movieDataTab li").hide().eq($(this).index()).show();
		if($(this).index()==0){
			
		}else if($(this).index()==1){
			cTable.reload('cMovie');
		}else if($(this).index()==2){
			siteTable.reload('sites');
		}
	})
	function uploadImgWin(){
		layer.open({
			type: 2,
			content: 'https://sm.ms/',
			fixed: false, //不固定
  			maxmin: true,
  			scrollbar: false,
  			area: ['770px', '550px'],
  			shade: 0,
  			title: '图片上传',
  			offset: 'rt'
		})
	}
	//添加时上传图片
	$("#uploadImg").click(function(){
		uploadImgWin();
	})
	//修改时上传图片
	$("#alterImg").click(function(){
		uploadImgWin();
	})
	//点击回车搜索
	$(document).keyup(function(event){
	  	if(event.keyCode == 13 && $("#movieName").is(":focus")){
	    	$("#search").click();
	  	}
	});
	$("#movieForm input[type='text']").change(function(){
		$(this).val($(this).val().replace(/'/g,"’"));
	})
	$("#movieForm textarea").change(function(){
		$(this).val($(this).val().replace(/'/g,"’"));
	})
})