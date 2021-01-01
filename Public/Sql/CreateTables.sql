--创建用户数据表
create table if not exists scin_user(
	user_id int not null auto_increment primary key comment'id名 自增长',
	user_name varchar(8) comment'用户名 长度8字符',
	user_alias char(15) comment'用户别名',
	user_pass varchar(32) comment'密码定长32 md5加密',
	user_intro varchar(50) default'一个只会Ctrl C V的菜b程序猿' comment'个人简介',
	user_img varchar(100) DEFAULT 'Public/Images/favicon.ico' COMMENT '用户头像图片',
    user_friends int default 0 comment'互关好友',
    user_follow int default 0 comment'用户关注的好友',
    user_scingold int default 0 comment'scin币',
	user_group tinyint default 0 comment'用户所拥有的权限 默认是普通用户'
)charset=utf8;
--创建文章表
create table if not exists scin_article(
    article_id int not null auto_increment  primary key comment'文章id名 自增长',
    article_header varchar(30) not null comment'文章标题头',
    article_tags char(50) default 'PHP' comment'文章的标签 后端设置最多可以5个',
    article_content text not null comment'文章主体内容' ,
    article_heat int not null default 0 comment'文章热度',
    article_like int not null default 0 comment'文章喜欢/收藏',
    atricle_borwse int not null default 0 comment'文章浏览量' ,
    article_thumb  int not null default 0 comment'文章点赞数',
    article_comment smallint not null default 0 comment'文章评论数',
    article_addtime int not null comment'发布时间',
    article_mainimg varchar(100) not null default'Public/Images/st.png' comment'首页显示的图片封面',
    article_annex char(255) comment'文章附件',
	    article_puser char(15) comment'发布者用户名'
	)charset=utf8;

--存放评论表
create table if not exists scin_article_comment(
    comment_id int not null auto_increment primary key comment'自增长 主键',
    comment_pid int not null comment'文章表id对应的评论的id',
    comment_userid int not null comment'发布评论的用户id',
    comment_useralias char(15) comment'发布评论用户的别名',
    comment_userimg char(255) comment'发布评论用户的头像',
    comment_istop tinyint not null default 0 comment'发布的评论是否置顶',
    comment_best enum('1','0') default '0' comment'最佳评论',
    comment_agree int not null default 0 comment'赞同',
    comment_addtime int not null comment'评论时间',
    comment_content text comment'评论内容'
)charset=utf8;
--评论回复表:
create table if not exists scin_comment_reply(
    reply_id int not null auto_increment primary key comment'自增长  主键',
    reply_pid int not null comment'回复pid对应的评论的id',
    reply_userimg char(255) comment'回复的用户的图片',
    reply_addtime int not null comment'回复时间',
    reply_useralias char(15) comment'发布回复用户的别名',
    reply_userid int not null comment'发布回复的用户id',
    reply_username varchar(8) comment'用户名 _ 登录的',
    reply_second tinyint not null default 0 comment'0标识是主回复 1表示回复的的回复',
    reply_secondtouser char(15)  default 'null' comment'null表示主回复 不需要填入回复的用户',
    reply_content text comment'回复内容'
)charset=utf8;

--insert into scin_user (user_id,user_name,user_pass,user_intro,user_img,user_friends,user_follow,user_scingold,user_group) VALUES (null,'123123a',null,null,null,null,null,null,null);
--truncate table tablename
--drop database databasename
--delete form tablename






