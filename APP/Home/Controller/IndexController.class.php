<?php
namespace APP\Home\Controller;
use APP\Home\Model\CardShow;
use APP\Home\Model\Checkreg;
//final 只能实例化 不能继承
final class IndexController{

    public function index(){
        require_once(VIEW_PATH . 'index.html');
    }
    /*首推页面的卡片布局数据*/
    public function Ajax_CardShow(){
        //每次获取4个数据
        $limit = CardShow::getInstance() -> AjaxCardShow();
        $where = "order by article_id desc limit $limit , 4";
        $Arry = CardShow::getInstance() -> PublishfetchAll('scin_article',$where);
        for($i = 0; $i < count($Arry); $i++){
            $temp = $Arry[$i]['article_puser'];
            $result = CardShow::getInstance() -> Publishfetch('user_img,user_alias','scin_user',"where user_name = '$temp'");
            array_push($Arry[$i],$result);
        }
       echo json_encode($Arry);
    }
    /*Ajax 用户注册的用户名是否已经存在*/
    public function Ajax_Checkreg(){
        #连接数据库查询
        $returnmsg = [[
            'code' => 200,
            'msg'  => '用户名可用'
        ],[
            'code' => -1,
            'msg'  => '用户名已被使用'
        ]];
        $checkusername = 'user_name =' . Checkreg::getInstance() -> checkreg();
        if(!Checkreg::getInstance() -> fetch($checkusername,$orderby = 'user_id asc')){
            echo json_encode($returnmsg[0]);
        }else{
            echo json_encode($returnmsg[1]);
        }
    }

    public function Reguser(){
        $returnmsg = [[
            'code' => 1,
            'msg'  => '注册成功(>﹏<)'
        ],[
            'code' => -1,
            'msg'  => '注册失败(>﹏<)'
        ],[
            'code' => -2,
            'msg'  => '用户名已经存在(>﹏<)'
        ],[
            'code' => -3,
            'msg'  => '用户名只能是字母加数字(>﹏<)'
        ],[
            'code' => -4,
            'msg'  => '密码只能是字母或数字(>﹏<)'
        ]
        ];
        //存放用户输入的用户名和密码
        $user_pass = Checkreg::getInstance() -> RegUser();
        //这里还要进行一次判断 防止POST提交时 用户名和已有的用户名一致
        $get_user = preg_replace('/\s+/','',$user_pass['user_name']);
        $get_pass = preg_replace('/\s+/','',$user_pass['user_pass']);
        if($get_pass == '' || $get_user == ''){
            echo json_encode($returnmsg[1]);
            die();
        }

        if (!preg_match('/^(?![^a-zA-Z0-9]+$)(?!\D+$).{6,12}$/i',$get_user)){
            echo json_encode($returnmsg[3]);
            die();
        }
        if (!preg_match('/^[A-Za-z0-9_]{6,12}$/i',$get_pass)){
            echo json_encode($returnmsg[4]);
            die();
        }
        $user_pass['user_pass'] = md5($user_pass['user_pass']);
        if(!Checkreg::getInstance() -> CommentfetchAll('user_id','scin_user',"user_name='$get_user'")){
            //添加数据到数据库中
            if(Checkreg::getInstance() -> insert($user_pass)){
                echo json_encode($returnmsg[0]);
            }else{
                echo json_encode($returnmsg[1]);
            }
        }else{
                echo json_encode($returnmsg[2]);
        }


    }
    public function Login(){
        $returnmsg = [[
            'code' => 1,
            'msg'  => '登录成功'
        ],[
            'code' => -1,
            'msg'  => '登录失败'
        ]];
        $login_msg = Checkreg::getInstance() -> User_Login(); /*将返回时一个账号密码 数组类型*/
        //调用pdo内置方法fetch向数据库查询登录的用户是否存在
        //构造查询参数
        $username = $login_msg['user_name'];
        $password = $login_msg['user_pass'];
        $condient = "user_name = '$username'" . " and user_pass = '$password'";
        if(Checkreg::getInstance() -> fetch($condient)){
            //有数据就是查询到了 那么就登录成功
            //存放session
            $_SESSION['username'] = $username;
            echo json_encode($returnmsg[0]);
        }else{
            echo json_encode($returnmsg[1]);
        }

    }

    /*对接APP端 获取总的文章便于视图显示和判断*/
    public function getArtCount(){
        /*可以直接POST/GET这个方法*/
        $getall = CardShow::getInstance();
        $getcount = $getall -> getParam();
        /*好像获取这个参数没啥用哈 擦*/
        $getcount = $getall -> CommentfetchAll('*','scin_article','1');
        echo json_encode(count($getcount));
    }

}
