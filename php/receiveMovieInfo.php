<?php
	header("Content-type:text/html;charset=utf-8");//字符编码设置  
	$douban = $_POST["douban"];
	$imdb = $_POST["imdb"];
	$movieName = $_POST["movieName"];
	$director = $_POST["director"];
	$scriptwriter = $_POST["scriptwriter"];
	$protagonist = $_POST["protagonist"];
	$type = $_POST["type"];
	$productionAreas = $_POST["productionAreas"];
	$language = $_POST["language"];
	$releaseDate = $_POST["releaseDate"];
	$movieTime = $_POST["movieTime"];
	$alternateName = $_POST["alternateName"];
	$intro = $_POST["intro"];
	$movieTitle = $_POST["movieTitle"];
	$imgUrl = $_POST["imgUrl"];
	$magnets = $_POST["magnets"];
	$movieCapture = $_POST["movieCapture"];
	$con = mysqli_connect("localhost","root","wuqun962498","mydb");
	if(!$con){
		die("连接失败：".mysqli_error($con));
		exit();
	}
	//设置编码，防止中文乱码
	mysqli_set_charset($con,"utf8");
	//插入数据
	$sqlInsert = "INSERT INTO movielist (douban,imdb,movieName,director,scriptwriter,protagonist,type,productionAreas,language,releaseDate,movieTime,alternateName,intro,movieTitle,imgUrl,magnets,movieCapture) ".
		"VALUES ('$douban','$imdb','$movieName','$director','$scriptwriter','$protagonist','$type','$productionAreas','$language','$releaseDate','$movieTime','$alternateName','$intro','$movieTitle','$imgUrl','$magnets','$movieCapture')";
	if(mysqli_query($con, $sqlInsert)){
		echo json_encode("上传成功");
	}else{
		echo json_encode("上传失败");
	}
	mysqli_close($con);
?>