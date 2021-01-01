<?php
namespace App\Home\Model;
use Frame\Libs\BaseModel;
/*
 * 用户头像
 * 用户名
 * 发布日期
 * 热度值
 * 主体图片
 * 喜欢数量
 * 点赞数量
 * 评论数量
 * 文章标题
 * */
final class CardShow extends BaseModel{
    function AjaxCardshow(){
        //接收ajax法发过来的媒介值
        $p = $_POST['P'];
        //因为当页面加载时会自动加载一次ajax获取数据库中4个数据 所以我们只能从他后面的4个数据开始
        //limit 第一个参数是从第几个数据开始查 第二个参数是每次查几个(这里的查询数固定的 也就是4) 我们只需要根据用户传的参数计算从第几个开始查询就好了
        //每次取出4个 也就是limit ($p * 4),4
        $LimitStart = $p * 4;
        return $LimitStart;

    }
    /*接收客户端的POST/GET数据*/
    function getParam(){
        /*
         * 1.getcount 获取总的文章数量
         * */
        $getcont =  ['getcount'];
        return $getcont;
    }

}
