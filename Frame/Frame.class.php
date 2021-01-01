<?php
namespace Frame;

//final 只能被实例化不能被继承
final class Frame{
    //初始化配置信息
    //静态方法可不用实例化类 利用::直接调用方法
    //只将run方法设置为公共的修饰符 使外部可以直接调用 -例如(index.php)
    public static function run(){
        self::initConfig();     //初始化配置信息
        self::initRoute();      //初始化路由信息
        self::initViewConst();  //初始化目录常量
        self::initAutoLoad();   //初始化类自动加载
        self::initDispath();    //初始化请求后分发
    }
    //编写初始化配置信息的方法
    private static function initConfig(){
        //初始化session配置
        session_start();
        //将配置文件(Config.php)中的参数保存到超全局数组中
        $GLOBALS['Config'] = require_once(APP_PATH . 'Conf' . DS . 'Config.php');
    }
    //初始化路由信息
    private static function initRoute(){
        //初始化路由参数
        $PlatForm   = $GLOBALS['Config']['default_platform']; #default -- Home
        $Controller = $_GET['Controller'] ?? $GLOBALS['Config']['default_controller']; #default --Index
        $Mode = $_GET['Mode'] ?? $GLOBALS['Config']['default_mode']; #default --index
        //将获取到的路由参数定义为常量
        define('PLATFORM',$PlatForm);
        define('CONTROLLER',$Controller);
        define('MODE',$Mode);
    }
    //初始化目录常量
    private static function initViewConst(){
        //初始化视图目录常量
        define('VIEW_PATH',APP_PATH . 'View' . DS .CONTROLLER . DS); #default -- xxx\ScinFum\APP\Home\View\Index\
    }
    //初始化类自动加载
    private static function initAutoLoad(){
        //实现所需要的类的自动加载
        //当所需实例化的类不存在的时候 则调用
        spl_autoload_register(function($ClassName){
            //$ClassName --类名
            $ClassFileNames = ROOT_PATH . str_replace('\\',DS,$ClassName) . '.class.php';
            //如果此类存在 则导入
            if(file_exists($ClassFileNames)){
                require_once($ClassFileNames);
            }
        });
    }
    //初始化请求 和 分发
    private static function initDispath(){
        // 默认显示(Home) / Controller / 默认控制器(Index)Controller #Home\Controller\IndexController
        $ControllerClassName =  'APP' . '\\' . PLATFORM . '\\' . 'Controller' . '\\' .CONTROLLER . 'Controller';
        //实例化控制器类
        //这里在实例化的时候会找不到这个类 即会触发initAutoLoad 方法 获取要导入的类文件 自动导入
        $ControllerObj = new $ControllerClassName();
        //因为常量无法作方法名 MODE--默认index
        $Model = MODE;
        $ControllerObj -> $Model();
    }
}