<?php
return $Config = [
    //PDO参数
    'dbtype' => 'mysql',
    'dbname' => 'test',
    'dbchar' => 'utf8',
    'dbhost' =>'127.0.0.1',
    'dbport' =>'3306',
    'dbuser' => 'root',
    'dbpass' => 'su1980root',

    //配置路由参数
    'default_platform'   => 'Home', #默认显示Home文件夹下的index.html页面
    'default_controller' => 'Index',#默认的控制器
    'default_mode'       => 'index',#默认模型



];