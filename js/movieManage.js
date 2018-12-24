$(function(){
	layui.use(['layer','table'],function(){
		var table = layui.table;
		table.render({
			elem: '#movieManage',
			toolbar: '#toolbarDemo',
			height: 'full-20',
			url: 'http://junyang.imwork.net/php/getMovieInfo.php',
			page: true,
			limit: 30,
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
				{title:'操作', toolbar:'#dataManipulation', align:'center', width:161}
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
	});
})