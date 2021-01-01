<?php

namespace App\Home\Model;
use Frame\Libs\BaseModel;
final class Comment extends BaseModel{
    protected $table = 'scin_article_comment';
    function SetComment(){
        //返回数据到控制器
        $param = [
            'c_content' =>  $_POST['c_content'],
            'art_id'    =>  $_POST['art_id']
        ];
        return $param;
    }
    function GetComment(){
        //需要一个参数也就是文章id 作为SQL查询条件
        return $_POST['art_id'];
    }
    function GerArticle(){
        /*获取查询条件 也就是为了对应id的文章详细*/
        return $_POST['art_id'];
    }
    function SetReplyComment(){
        $paramarry = [
                'r_content ' => $_POST['r_content'],
                'r_comment_id' => $_POST['comment_id']
        ];
        return $paramarry;
    }
    function SetSecondReplyComment(){
        $paramarry = [
            'reply_r_content ' => $_POST['reply_r_content'],
            'comment_id' => $_POST['comment_id'],
            'to_user' => $_POST['to_user']
        ];
        return $paramarry;
    }
    /*感觉这个没啥用 ca 害我考虑那么久 js格式化就行了*/
    function formatTime($latertime){
        $result = time() - $latertime;
        $timerstr = '';
        /*判断时间 秒数 分钟 天数 日期*/
        if($result < 60){
            return $timerstr =  $result . '秒前';
        }elseif($result > 60 && $result <= 3600){
            return $timerstr =  (floor($result / 60)) . '分钟前';
        }elseif($result > 3600 && $result <= 86400){
            return $timerstr =  (floor($result / 3600)) . '小时前';
        }elseif($result > 3600 && $result <= 108000){
            return $timerstr = (floor($result / 86400)) . '天前';
        }else{
            return $timerstr = date("Y-m-d",$latertime);
        }
    }
}