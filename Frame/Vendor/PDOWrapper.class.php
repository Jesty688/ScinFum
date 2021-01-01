<?php
namespace Frame\Vendor;

#使用命名空间下的PDO的类
use \PDO;
#使用PDO自带的异常类
use \PDOException;

final class PDOWrapper{
    private $db_type; #数据库类型
    private $db_host; #数据库主机
    private $db_port; #数据库端口
    private $db_user; #数据库用户
    private $db_pass; #数据库密码
    private $db_char; #数据库字符
    protected $pdo = null; #保存连接数据库的对象属性

    public function __construct(){
        #将前面设置的超全局变量放到需要连接的属性中
        $this -> db_type = $GLOBALS['Config']['dbtype'];
        $this -> db_host = $GLOBALS['Config']['dbhost'];
        $this -> db_port = $GLOBALS['Config']['dbport'];
        $this -> db_name = $GLOBALS['Config']['dbname'];
        $this -> db_user = $GLOBALS['Config']['dbuser'];
        $this -> db_pass = $GLOBALS['Config']['dbpass'];
        $this -> db_char = $GLOBALS['Config']['dbchar'];
        //创建数据库连接
        $this -> CreatePDO();
        //修改PDO异常模式
        $this -> SetErrMode();
    }
    private function ErrMsg($e){
        echo "<h2>Failed to execute SQL statement ！</h2>";
        echo "Error_Line：".$e->getLine()."<br>";
        echo "Error_Code：".$e->getCode()."<br>";
        echo "Error_Msg：".$e->getMessage()."<br>";
        echo "Error_File：".$e->getFile()."<br>";
    }
    private function CreatePDO(){
        try{
            #连接数据库
            $dsn = $this -> db_type . ':host=' . $this -> db_host . ';' ;
            $dsn .= 'port=' . $this -> db_port . ';';
            $dsn .= 'dbname=' . $this -> db_name . ';';
            $dsn .= 'charset=' . $this -> db_char . ';';
            #将返回的实例化对象 保存在pdo属性中
            $this -> pdo = new PDO($dsn,$this -> db_user,$this -> db_pass);
        }catch(\PDOException $error){
            //若有错误 输出错误信息
            $this -> ErrMsg($error);
        }
    }
    private function SetErrMode(){
        #设置PDO错误模式为异常模式
        $this -> pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    #执行SQL Insert Update Delete
    public function exec($sql){
        try{
            //返回的是1 否则不显示
            return $this -> pdo -> exec($sql);
        }catch (PDOException $e){
            $this -> ErrMsg($e);
        }

    }
    public function fetch($sql,$type=2){
        try{
            $stat = $this -> pdo -> query($sql);
            return $stat -> fetch($type);
        }catch (PDOException $e){
            $this -> ErrMsg($e);
        }
    }

    public function fetchAll($sql){
        try{
            $stat = $this -> pdo -> query($sql);
            return $stat -> fetchAll(PDO::FETCH_ASSOC);
        }catch (PDOException $e){
            $this -> ErrMsg($e);
        }
    }
    public function rowCount($sql){
        try{
            $stat = $this -> pdo -> query($sql);
            return $stat -> rowCount();
        }catch (PDOException $e){
            $this -> ErrMsg($e);
        }
    }

}