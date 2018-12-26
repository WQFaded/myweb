$(function(){
	layui.use(['layer','table','form','element'],function(){
		
		var table = layui.table;
		var element = layui.element;
		var layer = layui.layer;
		var form = layui.form;
		
		var tableIns = table.render({
			elem: '#movieManage',
			toolbar: '#searchMovie',
			height: 'full-20',
			url: 'http://junyang.imwork.net/php/getMovieInfo.php',
			page: true,
			limit: 30,
			id: 'searchMovie',
			cols: [[
				{type: 'checkbox'},
				{field:'movieName', title:'电影名'},
				{field:'movieTitle', title:'电影标题', edit:'text'},
				{field:'douban', title:'豆瓣', edit:'text', sort:true, width:70, align:'center'},
				{field:'imdb', title:'IMDB', edit:'text', sort:true, width:75, align:'center'},
				{field:'type', title:'电影类型', edit:'text',},
				{field:'productionAreas', title:'制片国家/地区', edit:'text'},
				{field:'releaseDate', title:'上映日期', edit:'text'},
				{field:'movieTime', title: '电影时长', edit:'text', width:90},
				{field:'magnets', title:'磁力链接', edit: 'text'},
				{field:'movieCapture', title:'电影截图', edit:'text'},
				{title:'操作', toolbar:'#dataManipulation', align:'center', width:161, fixed:'right'}
			]],
			parseData: function(data){
				//console.log(data);
			}
		})
		//监听操作栏按钮
		var updateWindow;
		table.on('tool(movieManage)',function(obj){
			var data = obj.data;
			if(obj.event == 'edit'){ //编辑
				updateWindow = layer.open({
					type: 1,
					title: '修改电影数据',
					area: 'auto',
					maxWidth: '100%',
					content: $('#alterMovie'),
				})
				$("#alterMovie input[name='douban']").val(data.douban);
				$("#alterMovie input[name='imdb']").val(data.imdb);
				$("#alterMovie input[name='movieName']").val(data.movieName);
				$("#alterMovie input[name='movieTitle']").val(data.movieTitle);
				$("#alterMovie input[name='movieCapture']").val(data.movieCapture);
				$("#alterMovie textarea[name='magnets']").val(data.magnets);
				
			}
			if(obj.event == 'save'){ //保存
				layer.msg('保存：'+ data.movieName);
			}
			if(obj.event == 'del'){ //删除
				layer.confirm('确定删除<strong> '+data.movieName+' </strong>这部电影吗？',function(index){
					obj.del();
					layer.close(index);
				})
			}
		})
		//监听头部工具栏
		var addMovieWin;
	  	table.on('toolbar(movieManage)',function(obj){
	  		if(obj.event=='search'){ //搜索
	  			if($("#movieName").val()){
	  				var index = layer.msg('查询中，请稍候...',{icon: 16,time:false,shade:0});
	  				setTimeout(function(){
	  					tableIns.reload({
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
	  			addMovieWin = layer.open({
					type: 1,
					title: '上传电影',
					area: 'auto',
					maxWidth: '100%',
					content: $('#uploadMovie'),
					offset: 'l'
				})
	  		}
	  	})
	  	function submitData(data,index){
	  		$.ajax({
		    	type:"post", url:"http://junyang.imwork.net/php/receiveMovieInfo.php",
		    	data:data, dataType: 'json',
		    	success:function(res){
		    		layer.msg(res, {icon: 1, time: 1000});
		    		tableIns.reload('searchMovie');
		    		layer.close(index);
		    	}
		    });
	  	}
		//监听提交增加
		form.on('submit(upload)', function(data){
			var uploadData = data.field;
			uploadData["msg"] = "insert";
		    submitData(uploadData,addMovieWin);
		    return false;
		});
		//提交修改
		form.on('submit(alter)', function(data){
			var updateData = data.field;
			updateData["msg"] = "update";
		    submitData(updateData,updateWindow);
		    return false;
		});
	});
	$("#dataManageNav li").click(function(){
		$("#movieDataTab li").hide().eq($(this).index()).show();
	})
	function uploadImgWin(){
		layer.open({
			type: 2,
			content: 'https://www.picb.cc/',
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
})