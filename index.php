<?php
/**定义目录常量
 * @param
 * DS         动态目录分割     -- \
 * ROOT_PATH 当前目录路径     --xxx\ScinFum\
 * APP_PATH 设定默认目录位置  --xxx\ScinFum\APP\Home\
 * */
define('DS',DIRECTORY_SEPARATOR);
define('ROOT_PATH',getcwd().DS);
define('APP_PATH',ROOT_PATH . 'APP' . DS .'Home' . DS);

require_once(ROOT_PATH . 'Frame' . DS . 'Frame.class.php');
//利用命名空间 找到对应的类 调用类中的静态初始化配置信息的方法
Frame\Frame::run(); #这里不需要实例化类可以直接调用此类中的静态方法
