<?php
namespace App\Home\Model;
use Frame\Libs\BaseModel;


final class Checkreg extends BaseModel{
    protected $checkusername = null;
    protected $reguser_pass  = [];
    protected $login_msg     = [];
    protected $table = 'scin_user';
    /*校验用户名是否存在*/
    function checkreg(){
        #将ajax发送注册的用户名返回
       $this -> checkusername = $_GET['regusername'];
       return "'$this->checkusername'";
    }
    /*注册用户*/
    function RegUser(){
        $this -> reguser_pass = [
            'user_name' => $_POST['username'],
            /*密码经过MD5加密 32位*/
            'user_pass' => $_POST['password']
        ];
        return $this -> reguser_pass;
    }
    /*用户登录*/
    function User_Login(){
        /*将ajax传来的参数返回到控制器*/
        $this -> login_msg = [
            'user_name' => $_POST['login_user'],
            /*密码经过MD5加密 32位*/
            'user_pass' => md5($_POST['login_pass'])
        ];
        return $this -> login_msg;
    }

}