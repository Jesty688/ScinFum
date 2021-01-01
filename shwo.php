<?php
$dsn = 'mysql:host=127.0.0.1;dbname=test;charset=utf8';
$pdo = new PDO($dsn,'root','su1980root');
//var_dump($pdo);
// 获取当前所有文章
$qsql = "select article_id , article_header from scin_article";
// sql预处理
$stmt = $pdo -> prepare($qsql);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
   // foreach ($rows as $key => $value) {
   //  echo $value['article_header'];
   // }
//print_r($rows);
//echo json_encode($rows);
if(@$_GET['id']){
$dsql = "delete from scin_article where article_id=?";
//准备sql模板
$stmt = $pdo->prepare($dsql);
$id = @$_GET['id'];
//绑定参数
$stmt->bindValue(1,$id);

$stmt->execute();
//执行预处理语句

$affect_row = $stmt->rowCount();
// echo $affect_row;
}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>文章Action</title>
  </head>
  <body>
      <h3>
          当前论坛包含文章数:<?php echo $stmt->rowCount() ?>
      </h3>
      <ul>
        <?php
      foreach ($rows as $key => $value) {?>
        <li><?php echo $value['article_header'] ?> <a href="javascript:void(0);" onclick="deleteArt(<?php echo $value['article_id'] ?>)">删除</a> </li>
      <?php  } ?>
      </ul>
  </body>
  <script type="text/javascript">
    // 创建ajax对象
    function ajax(id , cb){
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
           console.log(xhr.responseText)
          cb()
        }
      }
      xhr.open("GET" , './shwo.php?id=' + id , true);
      xhr.send()
    }

    function deleteArt(id){
      // 删除节点
      let pt = window.event.srcElement.parentNode;
      if(confirm('确定删除?')){
        ajax(id , function(){
        pt.remove()
        })
      }

    }
  </script>
</html>
