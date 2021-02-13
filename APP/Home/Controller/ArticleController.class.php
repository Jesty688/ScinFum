<?php

namespace APP\Home\Controller;

use APP\Home\Model\Comment;
use APP\Home\Model\Publish;

final class ArticleController
{
    protected $returnmsg = [
        'code' => '',
        'result' => '',
    ];
    public function setComment()
    {
        //获取前端传给控制器的评论内容
        //获取保存在session中的用户名
        $username   = $_SESSION['username'];
        $nowtime    = time();
        $Comment    = Comment::getInstance(); //实例化对象
        $c_content  = ($Comment->SetComment()['c_content']);
        $c_artid    = ($Comment->SetComment()['art_id']);
        $c_content  = $Comment->RemoveXSS($c_content); //对象调方法
        $user_msg   = $Comment->Commentfetch("user_name = '$username'"); //获取发布评论用户的信息
        //格式化时间
        $formattime = $Comment->formatTime($nowtime);

        //告知前端是否评论成功或失败
        if ($Comment->CommentInsert($_SESSION['username'], $c_artid, $nowtime, $c_content)) {
            echo json_encode($returnmsg = ['code' => '200', 'result' => '评论成功', 'comment_time' => $formattime, 'c_content' => $c_content, $user_msg]);
            //评论成功后需要再次执行SQL 使文章表的评论数加1
        } else {
            echo json_encode($returnmsg = ['code' => '-1', 'result' => '评论失败']);
        }
        $returnmsg = [];
    }
    public function getComment()
    {
        //返回从评论表中获取的全部评论
        $Comment = Comment::getInstance(); //实例化对象
        $Art_id  = $Comment->GetComment();
        $query  = 'comment_id,comment_pid,comment_userid,comment_useralias,comment_userimg,comment_istop,comment_best,';
        $query .= 'comment_agree,comment_addtime,comment_content,user_id,user_name'; //查询的表
        $tablename = 'scin_article_comment,scin_user'; //查询的表明
        $where = 'scin_article_comment.comment_userid = scin_user.user_id and scin_article_comment.comment_pid = ' . $Art_id; //查询的条件
        $Comment_comment = $Comment->CommentfetchAll($query, $tablename, $where);
        /*获取评论表中所有的全部回复*/
        //先遍历所有的评论 然后往每一条评论中添加对应评论的回复
        for ($i = 0; $i < count($Comment_comment); $i++) {
            //获取当前评论的id 方便后面的SQL查询
            $fetch_comment_id = $comment_id = $Comment_comment[$i]['comment_id'];
            $Comment_reply = $Comment->ReplyfetchAll($fetch_comment_id);
            //在对应的评论下添加此评论所有的回复
            array_push($Comment_comment[$i], $Comment_reply);
        }
        /*echo '<pre>';
            print_r($Comment_comment);
            die();*/
        if ($Comment->CommentfetchAll($query, $tablename, $where)) {
            //返回所有的评论和其对应的评论(前端动态添加)
            echo json_encode($Comment_comment);
        } else {
            echo json_encode($returnmsg = ['code' => '-1', 'result' => '暂无评论']);
        }
        $returnmsg = []; //初始化
    }
    public function setReplyComment()
    {
        $username        = $_SESSION['username'];
        $nowtime         = time();
        $ReplyComment    = Comment::getInstance(); //实例化对象
        $ReplyComment_id = ($ReplyComment->SetReplyComment()['r_comment_id']);
        $r_content       = $ReplyComment->RemoveXSS($ReplyComment->SetReplyComment()['r_content ']); //对象调方法
        $user_msg        = $ReplyComment->Commentfetch("user_name = '$username'"); //获取发布评论用户的信息
        //格式化时间
        $formattime = $ReplyComment->formatTime($nowtime);

        //告知前端是否评论成功或失败
        if ($ReplyComment->ReplyInsert($ReplyComment_id, $nowtime, $username, $r_content)) {
            echo json_encode($returnmsg = ['code' => '200', 'result' => '回复成功', 'comment_time' => $formattime, 'r_content' => $r_content, $user_msg]);
            //成功后需要再次执行SQL 使文章表的评论数加1
        } else {
            echo json_encode($returnmsg = ['code' => '-1', 'result' => '回复失败']);
        }
        $returnmsg = [];
    }
    public function setSecondReply()
    {
        $username        = $_SESSION['username'];
        $nowtime         = time();
        //格式化内容
        $SecondeReplyComment      = Comment::getInstance(); //实例化对象

        $SecondReplyComment_id    = ($SecondeReplyComment->SetSecondReplyComment()['comment_id']);
        $content = ($SecondeReplyComment->SetSecondReplyComment()['reply_r_content ']);
        $touser  = ($SecondeReplyComment->SetSecondReplyComment()['to_user']);
        $SecondReplyContent       = $SecondeReplyComment->RemoveXSS($content); //对象调方法
        //返回评论用户的信息 我觉得可以直接在外面定义一个私有的变量 因为这个变量存放的y用户信息一直都是一样的 [根据不同的用户存放不同的用户信息]
        $user_msg                 = $SecondeReplyComment->Commentfetch("user_name = '$username'"); //获取发布评论用户的信息
        //格式化时间
        $formattime               = $SecondeReplyComment->formatTime($nowtime);

        if ($SecondeReplyComment->ReplyInsert($SecondReplyComment_id, $nowtime, $username, $SecondReplyContent, 1, $touser)) {
            echo json_encode($returnmsg = ['code' => '200', 'result' => '回复成功', 'comment_time' => $formattime, 'reply_r_content' => $SecondReplyContent, $user_msg]);
            //成功后需要再次执行SQL 使文章表的评论数加1
        } else {
            echo json_encode($returnmsg = ['code' => '-1', 'result' => '回复失败']);
        }
        $returnmsg = [];
    }
    public function AtrEdit()
    {
        require_once(VIEW_PATH . 'artedit.php');
    }
    /*获取文章内容*/
    public function getArticle()
    {
        /*接收前端发送过来的文章id 由模型类来获取数据 控制器用来处理数据*/
        /*获取到文章id当做条件从数据库取出数据返回到前端*/
        /* 需要取出的数据
         * 1.标题头
         * 2.标签（最多为5个）
         * 3.用户头像（这里应该还有个认证图标没加进数据库 以后再说吧）
         * 4.用户名
         * 5.浏览量
         * 6.点赞
         * 7.评论
         * 8.时间
         * 9.文章内容
         * */
        $InstanceObj = Comment::getInstance();
        $GetArtId    = $InstanceObj->GerArticle(); //返回文章id
        $query = "article_header,article_tags,user_img,article_puser,atricle_borwse,article_thumb,article_comment,article_addtime,article_content";
        $table = "scin_article,scin_user";
        $where = "where article_id = $GetArtId and scin_user.user_name = scin_article.article_puser";
        if ($r = $InstanceObj->Publishfetch($query, $table, $where)) {
            $r['article_content'] =  html_entity_decode($r['article_content']);
            echo json_encode($r);
        } else {
            echo json_encode($returnmsg = ['code' => '-1', 'result' => '内容走丢了哦']);
        }
    }


    /*发布文章 插入数据*/
    public function Publish_Art()
    {
        //实例化
        $Publish_Obj = Publish::getInstance();
        //接收模型类返回的数据
        $Data = $Publish_Obj->Get_Content(); //是个数组
        //先判断有没有错误
        if (isset($Data['code'])) {
            echo json_encode($returnmsg = ['code' => '0', 'result' => $Data['error']]);
        } else {
            //插入数据进数据库
            $title = $Data[0]['title']; //获取标题 过滤过XSS可以直接插入紧数据库
            $tags  = $Data[0]['tags']; //获取标签 是个数组
            $tagsstr = implode(',', $tags); // 将tags中的数组转化为字符串插入数据库中
            $content = $Data[0]['content']; //获取文章的内容
            $anneximg = $Data[0]['annex_img']; //获取封面图片
            $annexysb = $Data[0]['annex_ysb']; //获取附件的链接 可能是第三方的也可能是本地的附件
            $addtime = $Data[0]['addtime']; //获取发布的时间
            $publishuser = isset($Data[0]['user']) ? $Data[0]['user'] : $_COOKIE['login_u'];



            if ($Publish_Obj->PublishInsert($title, $tagsstr, $content, $addtime, $anneximg, $annexysb, $publishuser)) {
                echo json_encode($returnmsg = ['code' => '1', 'result' => '发布成功']);
            } else {
                echo json_encode($returnmsg = ['code' => '0', 'result' => '发布失败未知错误~~~']);
                /*如果插入数据库失败 则需要将刚才插入的图片或者压缩包删除*/
                @unlink($anneximg);
                @unlink($annexysb);
            }
        }
    }
    /*获取文章表中的数据并且显示在card中*/
    public function CardShowData()
    {
        //当用户访问主页面的时候 固定先显示4条数据 如果往下滑动 则瀑布流加载
        /*需要获取的数据
         *  1.文章id
         *  2.用户名 / 别名
         *  3.发布时间
         *  4.热度
         *  5.封面图片
         *  6.喜欢
         *  7.点赞
         *  8.评论
         *  9.文章标题
         * */
        $Publish_Obj = Publish::getInstance();
        $where = "order by article_id desc limit 4";
        //        print_r(CardShow::getInstance() -> PublishfetchAll('scin_article',$where));
        $Arry = $Publish_Obj->PublishfetchAll('scin_article', $where);
        for ($i = 0; $i < count($Arry); $i++) {
            $temp = $Arry[$i]['article_puser'];
            $result = $Publish_Obj->Publishfetch('user_img,user_alias', 'scin_user', "where user_name = '$temp'");
            array_push($Arry[$i], $result);
        }
        echo json_encode($Arry);
    }
}
