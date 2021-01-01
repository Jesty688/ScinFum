<?php
/*$dsn = 'mysql:host=127.0.0.1;dbname=scin;charset=utf8';
$pdo = new PDO($dsn,'root','su1980root');




$sql = "select * from scin_user where user_name = '123123aa'";
$sql .= " and user_pass = '4297f44b13955235245b2497399d7a93'";

$result = $pdo->query($sql) -> fetch(2);
echo "<pre>";
var_dump($result);*/
$str = '1kkkkkkkkk';
$pwd = 'A111111aa';
if (!preg_match('/^[a-z0-9][a-z0-9]{6,8}$/i',$str)){
//            echo $get_user;
    echo'cuowu ';
    die();
}
