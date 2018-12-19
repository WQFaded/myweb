<?php
	header("Content-type:text/html;charset=utf-8");//字符编码设置  
	$con = mysqli_connect("localhost","root","wuqun962498","mydb");
	if(!$con){
		die("连接失败：".mysqli_error($con));
		exit();
	}
	//设置编码，防止中文乱码
	mysqli_set_charset($con,"utf8");
	//获取数据
	$sqlGet = "SELECT * FROM movielist";
	$result = mysqli_query($con,$sqlGet);
	$arr = array();
	$magnetsKey = array("magnet","magnetName","size");
	while($rows=mysqli_fetch_array($result)){
	    $count=count($rows);//不能在循环语句中，由于每次删除 row数组长度都减小  
	    for($i=0;$i<$count;$i++){  
	        unset($rows[$i]);//删除冗余数据  
	    }
	    if($rows["magnets"] != ""){
	    	$rows["magnets"] = explode(",",$rows["magnets"]);
		   	for($j=0;$j<count($rows["magnets"]);$j++){
		   		$magnets = explode("/",$rows["magnets"][$j]);
		   		//把索引数组改为键值数组
		   		$rows["magnets"][$j] = array_combine($magnetsKey,$magnets);
		   	}
	    }
	    $rows["movieCapture"] = explode(",",$rows["movieCapture"]);
	    $rows["updateTime"] = str_replace("T"," ",$rows["updateTime"]);
	    array_push($arr,$rows);
	}
	/*echo "<pre>";
	print_r($arr);//查看数组
	echo "</pre>";*/
	echo json_encode($arr); //返回json数据
?>