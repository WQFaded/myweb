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
		//监听操作按钮
		table.on('tool(movieManage)',function(obj){
			var data = obj.data;
			if(obj.event == 'edit'){ //编辑
				layer.msg('编辑：'+ data.movieName);
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
	  			layer.open({
					type: 1,
					title: '上传电影',
					area: 'auto',
					maxWidth: '100%',
					content: $('#uploadMovie')
				})
	  		}
	  	})
		//监听提交
		form.on('submit(upload)', function(data){
			var uploadData = data.field;
		    $.ajax({
		    	type:"post", url:"http://junyang.imwork.net/php/receiveMovieInfo.php",
		    	data:uploadData, dataType: 'json',
		    	success:function(res){
		    		layer.msg(res, {icon: 1, time: 1000});
		    	}
		    });
		    return false;
		});
	});
	$("#dataManageNav li").click(function(){
		$("#movieDataTab li").hide().eq($(this).index()).show();
	})
	
})