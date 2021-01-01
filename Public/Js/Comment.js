$(function () {
    /*
    *          ┌─┐       ┌─┐
    *       ┌──┘ ┴───────┘ ┴──┐
    *       │                 │
    *       │       ───       │
    *       │  ─┬┘       └┬─  │
    *       │                 │
    *       │       ─┴─       │
    *       │                 │
    *       └───┐         ┌───┘
    *           │         │
    *           │         │
    *           │         │
    *           │         └──────────────┐
    *           │                        │
    *           │                        ├─┐
    *           │                        ┌─┘
    *           │                        │
    *           └─┐  ┐  ┌───────┬──┐  ┌──┘
    *             │ ─┤ ─┤       │ ─┤ ─┤
    *             └──┴──┘       └──┴──┘
    *                 神兽保佑
    *                 代码无BUG!
    */

    // $.cookie('loginstate',null); //先不登录 给个cookie模拟登录
    //点击发布评论
    $('.commment-btn').click(function (e) {
        //当用户点击这个评论是 校验用户是否已经登录 否则不让注册
        var loginState = $.cookie('loginstate');
        if(loginState == undefined || loginState == null || loginState == ''){
            //点击登录框时不会显示后马上消失
            e.stopPropagation();
            $('.dialog-box').PopDialog('登录后再评论mie');
            $('html,body').css('overflow-y','hidden');
            $('.mask_layer').css('display','block');
            $('.Popup_login').show(500);
        }else{
            //找到评论 / 回复框框显示
            $('.mask_layer').css('display','block');
            $('.js-reply-pop').fadeIn(500).find('button').addClass('comment-btn').text('发布');
            $('.js-reply-pop').find('textarea').attr('placeholder','写下你的评论');
        }
    });

    //点击回复按钮 ajax动态添加再传参到后端插入到数据库中
    $('.js-reply-pop').find('button').click(function () {
        art_id = $('.answer-list-box').attr('data-artid');
        console.log(art_id);
        var textval = $('textarea').val();
        if($(this).hasClass('comment-btn')){
            //主评论
            //判断输入框中的字体 少于3不允许发布
            if(textval.length < 3){
                //错误提示显示
                $(this).siblings('span').css('display','block')
                return false;
            }else{
                //隐藏提示
                $(this).siblings('span').css('display','none');
                //访问后端控制器 -> 模型类 -> 取出ajax传来的数据
                $.ajax({
                    type:'POST',
                    url:'?Controller=Article&Mode=setComment',
                    //这里的参数还没传完 因为暂时还没有添加文章表 对应的评论无法追加 后期齐全了传入的参数会多一个文章id
                    data:{'c_content':textval,'art_id':art_id},
                    success:function(json_result){
                        var name = '';
                        if(json_result['code'] == 200){
                            if(json_result[0].user_alias == null || json_result[0].user_alias == ''){
                                name = json_result[0].user_name;
                            }else{
                                name = json_result[0].user_alias;
                            }
                            //评论成功
                            $('.mask_layer').css('display','none');
                            $('.js-reply-pop').fadeOut(400);
                            $('.js-reply-pop').find('textarea').val('');
                            //添加评论布局
                            var html = '';
                            for(var i in json_result){
                                html = '<div class="answer-item">';
                                    html += '<a class="user-pic">';
                                        html += '<img src="' + json_result[0].user_img + '">';
                                    html += '</a>';
                                    html += '<div class="answer-box">';
                                        html += '<div class="answer-content">';
                                            html += '<a href="javascript:void(0)">' + name + '</a>';
                                            html += '<div data-comment-user="' + json_result[0].user_name  + '"class="answer-desc">';
                                            html += '<p>' + json_result.c_content + '</p>'; //1. 这里不能直接用用户输入的字符 容易xss攻击
                                            html += '</div>';
                                        html += '</div>';
                                        html += '<div class="ctrl-bar clear">';
                                            html += '<span class="agree moco-btn-gray-l js-if">';
                                                html += '<i class="diyfont icon-dianzan-copy"></i>';
                                            html += '</span>';
                                            html += '<span class="oppose moco-btn-gray-l js-if">';
                                                html += '<i class="diyfont icon-unzan"></i>';
                                                html += '<em>&nbsp;反对</em>';
                                            html += '</span>';
                                            html += '<a href="javascript:;" class="reply-del">回复</a>';
                                            html += '<span class="timer">'+ json_result.comment_time +'</span>';
                                        html += '</div>';
                                        html += '<div class="reply-con">';
                                            html += '<ul class="reply-list"></ul>';
                                        html += '</div>';
                                    html += '</div>';
                                html += '</div>';
                            }
                            $(html).appendTo($('.answer-list-box'));
                            $('.answer-box').css('width',$('.show-detail').width() - 48 - 64 + 5);
                            html = '';
                            //弹出提示框
                            $('.dialog-box').PopDialog('评论成功');
                            if(!$(".answer-list-box").children().length){
                                $('.show-none').css('display','flex');
                                $('.answer-list-box').css('display','none');
                            }else{
                                $('.show-none').css('display','none');
                                $('.answer-list-box').css('display','block');
                            }

                        }else{
                            //评论失败
                            $('.dialog- box').PopDialog('评论失败');
                        }
                    },
                    dataType:'json'
                });
            }

        }else if($(this).hasClass('reply-second')){
            //回复再回复
            if(textval.length < 3){
                //错误提示显示
                $(this).siblings('span').css('display','block')
            }else{
                $(this).siblings('span').css('display','none')
                //获取需要在这个回复下回复的回复id
                var comment_id = $(this).attr('put_id');
                var to_user = $(this).attr('data-reply-r-name');
                /*插入数据进数据库 获取数据*/
                $.ajax({
                    type:'POST',
                    url:'?Controller=Article&Mode=setSecondReply',
                    data:{'reply_r_content':textval,'comment_id':comment_id,'to_user':to_user},
                    dataType:'json',
                    success:function (json_result) {
                        var name = '';
                        if(json_result['code'] == 200){
                            if(json_result[0].user_alias == null || json_result[0].user_alias == ''){
                                name = json_result[0].user_name;
                            }else{
                                name = json_result[0].user_alias;
                            }
                            //回复成功
                            $('.mask_layer').css('display','none');
                            $('.js-reply-pop').fadeOut(400);
                            $('.js-reply-pop').find('textarea').val('');
                            //添加评论布局
                            var html = '';
                            html += '<li class="clear">';
                            html += '<a class="user-pic">';
                            html += '<img src="' + json_result[0].user_img + '" alt="">';
                            html += '</a>';
                            html += '<div class="reply-item">';
                            html += '<a href="javascript:void(0)" class="from-user">' + name + '</a>' + '<span style="font-style: 14px; margin: 0 8px;color: #9199a1;">回复</span>' + '<a href="javascript:void(0)" class="to-user">' + to_user + '</a>';
                            html += '<div data-second-name="' + json_result[0].user_name + '"class="reply-content">';
                            html += json_result.reply_r_content;
                            html += '</div>';
                            html += '<div class="reply-footer clear">';
                            html += '<a href="javascript:;" class="reply-del-second">回复</a>';
                            html += '<span class="timer"> ' + json_result.comment_time + ' </span>';
                            html += '</div>';
                            html += '</div>';
                            html += '</li>';
                            var eleul = ".reply-list[data-reply-id='" + comment_id + "']";
                            $(html).appendTo($(eleul));
                            $('.reply-item').css('width',$('.show-detail').width() - 95 - 64 + 5);
                            html = '';
                            //弹出提示框
                            $('.dialog-box').PopDialog('回复成功');
                            $('.reply-btn').removeClass('reply-second').addClass('reply-btn');
                        }else{
                            //评论失败
                            $('.dialog- box').PopDialog('回复失败');
                        }
                    }

                    //实现:
                    
                    //明天: 现在实现了回复和再次回复 明天主要是当点击某个文章卡片时候 怎么加载那些回复再回复的li
                        //还有个bug 点击显示文章和对应的评论时 加载的评论内容是所有得文章都共享的 也就是无论点那个文章 当前的这个评论在所有的文章都有
                        //解决办法 data属性  append的时候获取这个文章的id 点击某片文章 添加进id对应大的文章中!!! mt jie jue


                    //后天:每一个卡片都是不同的文章和此文章对应的评论
                    //大后天:点赞 收藏 浏览量 评论数量 赞同
                    //模型都基本成型了 主要都是数据怎么和后端 / 前端交互 渲染 (r文章热度问题)
                    //这些都写完时会写一个api文档  我写的这个站点 基本上都是ajax传来传去的数据 用户体验及其的良好 哈哈隔
                    //如果是app对接的话 post的方式比较多 网站?控制器=控制器名称&方法=调用方法名
                    //返回的json都可以直接拼接一下就好了
                });
            }

        }else{
            //回复对应的评论
            if(textval.length < 3){
                //错误提示显示
                $('.sublime-trips').css('display','block');
            }else{
                $('.sublime-trips').css('display','none');
                //实现无限级
                //NEED:1.不能对自己评论
                var comment_id = $(this).attr('data-reply-id');
                //插入数据进数据库
                $.ajax({
                    type:'POST',
                    url:'?Controller=Article&Mode=setReplyComment',
                    data:{'r_content':textval,'comment_id':comment_id},
                    success:function (json_result) {
                        var name = '';
                        if(json_result['code'] == 200){
                            if(json_result[0].user_alias == null || json_result[0].user_alias == ''){
                                name = json_result[0].user_name;
                            }else{
                                name = json_result[0].user_alias;
                            }
                            //回复成功
                            $('.mask_layer').css('display','none');
                            $('.js-reply-pop').fadeOut(400);
                            $('.js-reply-pop').find('textarea').val('');
                            //添加评论布局
                                    var html = '';
                                    html += '<li class="clear">';
                                        html += '<a class="user-pic">';
                                            html += '<img src="' + json_result[0].user_img + '" alt="">';
                                        html += '</a>';
                                        html += '<div class="reply-item">';
                                          html += '<a href="javascript:void(0)" class="from-user">' + name + '</a>';
                                            html += '<div data-reply-name="' + json_result[0].user_name + '"class="reply-content">';
                                                html += json_result.r_content;
                                            html += '</div>';
                                            html += '<div class="reply-footer clear">';
                                                html += '<a href="javascript:;" class="reply-del-second">回复</a>';
                                                html += '<span class="timer"> ' + json_result.comment_time + ' </span>';
                                            html += '</div>';
                                        html += '</div>';
                                    html += '</li>';
                            var eleul = ".reply-list[data-reply-id='" + comment_id + "']";
                            $(html).appendTo($(eleul));
                            $('.reply-item').css('width',$('.show-detail').width() - 95 - 64 + 5);
                            html = '';
                            //弹出提示框
                            $('.dialog-box').PopDialog('回复成功');

                        }else{
                            //评论失败
                            $('.dialog- box').PopDialog('回复失败');
                        }
                    },
                    dataType:'json'
                });
            }
        }
    });

    //点击某一个文章卡片 js初始化所有样式
    $(document).on('click','.swcontent',function()  {
        var art_id = $(this).attr('data-artid');
        $('.answer-list-box').html(''); //这里很细节 如果在添加之前不清除父元素中的子元素 就会点击一次 添加一次
                                        //还需要吧文章也全部清除 其实可以将整个大盒子全部的html清空 ajax直接渲染
        //判断是否有评论 若没有 就展示空的页面 否则就隐藏 并且展示评论
        if(!$(".answer-list-box").children().length){
            $('.show-none').css('display','flex');
            $('.answer-list-box').css('display','none');
        }else{
            $('.show-none').css('display','none');
            $('.answer-list-box').css('display','block');
        }
        /*这里还需要加一个ajax是用来显示文章的 先获取文章再获取其文章下的评论数量*/
        /*清除ajax待渲染的标签的html*/
        $('.show-title').html('');
        $('.show-mood').html('');
        $('.showUhead_att').html('');
        $('.show-icon').html('');
        $('article').html('');
        var arthead = '';
        var artstate = '';
        var tags = [];
        var tagshtml = '';
        /*清空结束*/
        $.ajax({
            type:'POST',
            url:'?Controller=Article&Mode=getArticle',
            /*传入需要获取的文章id*/
            data:{'art_id':art_id},
            dataType:'json',
            success:function (json_result) {
                tags = json_result.article_tags.split(',',5);
                for(let i = 0; i < tags.length; i++){
                    tagshtml += '<span>' + tags[i] + '</span>';
                }
                for(var i in json_result){
                    arthead ='<img src="' + json_result.user_img + '">';
                    arthead += '<span>' + json_result.article_puser + '</span>';
                    arthead += '<i class="diyfont"></i><span>关注</span>';
                    artstate = '<i class="diyfont"></i> <span>' + json_result.atricle_borwse + '</span>';
                    artstate += '<i class="diyfont"></i> <span>' + json_result.article_thumb + '</span>';
                    artstate += '<i class="diyfont"></i> <span>' + json_result.article_comment + '</span>';
                    artstate += '<span>' + $().formattime(json_result.article_addtime) +'</span>';
                    $('.show-mood').html(tagshtml);
                    $('.show-title').html("<p>" + json_result.article_header + "</p>");
                    $('.showUhead_att').html(arthead);
                    $('.show-icon').html(artstate);
                    $('article').html( json_result.article_content );

                }

            }
            
        });


        //二次点击文章卡片
        //实现: 显示所有的评论内容
        //后期再加判断是某个文章 添加ajax参数
        $.ajax({
            type:'POST',
            url:'?Controller=Article&Mode=getComment',
            //这里的参数还没传完 因为暂时还没有添加文章表 对应的评论无法追加 后期齐全了传入的参数会多一个文章id
            data:{'art_id':art_id},
            success:function(json_result){
                var name = '';
                var re_name = '';
                if(json_result.code == -1){
                    $('.dialog- box').PopDialog('获取评论失败');
                }else{
                    var html = '';
                    for(var i in json_result){
                        //别名为空 则获取注册时的用户名

                        if(json_result[i].comment_useralias == null || json_result[i].comment_useralias == ''){
                            re_name = json_result[i].user_name;
                        }else{
                            re_name = json_result[i].comment_useralias;
                        }
                        html = '<div class="answer-item">';
                        html += '<a class="user-pic">';
                        html += '<img src="' + json_result[i].comment_userimg + '">';
                        html += '</a>';
                        html += '<div class="answer-box">';
                        html += '<div class="answer-content">';
                        html += '<a href="javascript:void(0)">' + re_name + '</a>';
                        html += '<div data-comment-id="'+ json_result[i].comment_id + '"data-comment-user="' + json_result[i].user_name + '"class="answer-desc">';
                        html += '<p>' + json_result[i].comment_content + '</p>';
                        html += '</div>';
                        html += '</div>';
                        html += '<div class="ctrl-bar clear">';
                        html += '<span class="agree moco-btn-gray-l js-if">';
                        html += '<i class="diyfont icon-dianzan-copy"></i>';
                        html += '</span>';
                        html += '<span class="oppose moco-btn-gray-l js-if">';
                        html += '<i class="diyfont icon-unzan"></i>';
                        html += '<em>&nbsp;反对</em>';
                        html += '</span>';
                        html += '<a href="javascript:;" class="reply-del">回复</a>';
                        html += '<span class="timer">'+ $().formattime(json_result[i].comment_addtime) +'</span>';
                        html += '</div>';
                        html += '<div class="reply-con">';
                        html += '<ul class="reply-list">';
                        //渲染对应评论下的所有的回复
                        for(let j = 0; j < json_result[i][0].length; j++){
                            var reply = json_result[i][0]; // 方便
                            var reply_html = '';
                            var touser = '';
                            if(reply[j].reply_useralias == null || reply[j].reply_useralias == ''){
                                re_name = reply[j].reply_username;
                            }else{
                                re_name = reply[j].reply_useralias;
                            }
                            if(reply[j].reply_second == 1){
                                touser = reply[j].reply_secondtouser;
                                reply_html = '<a href="javascript:void(0)" class="from-user">' + re_name + '</a>' + '<span style="font-style: 14px; margin: 0 8px;color: #9199a1;">回复</span>' + '<a href="javascript:void(0)" class="to-user">' + touser + '</a>';
                            }else{
                                reply_html = '<a href="javascript:void(0)" class="from-user">' + re_name + '</a>';
                            }

                            html += '<li class="clear">';
                            html += '<a class="user-pic">';
                            html += '<img src="' + reply[j].reply_userimg + '" alt="">';
                            html += '</a>';
                            html += '<div class="reply-item">';
                            //html += '<a href="javascript:void(0)" class="from-user">' + re_name + '</a>';
                            html += reply_html;
                            html += '<div data-reply-id="' + reply[j].reply_id + '"' + 'data-reply-name="' + reply[j].reply_username + '"' + 'data-second-name="' + reply[j].reply_username + '" class="reply-content">';
                            html +=  reply[j].reply_content;
                            html += '</div>';
                            html += '<div class="reply-footer clear">';
                            html += '<a href="javascript:;" class="reply-del-second">回复</a>';
                            html += '<span class="timer"> ' + $().formattime(reply[j].reply_addtime) + ' </span>';
                            html += '</div>';
                            html += '</div>';
                            html += '</li>';
                        }
                        html += '</ul>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        //这里不能直接这样添加！！！ 后期改正
                         $(html).appendTo($('.answer-list-box'));


                        //给uldata属性赋值
                        $('.answer-list-box').children('.answer-item').eq(i).children('.answer-box').children('.reply-con').children('.reply-list').attr('data-reply-id',json_result[i].comment_id);
                        $('.answer-box').css('width',$('.show-detail').width() - 48 - 64 + 5);
                        $('.reply-item').css('width',$('.show-detail').width() - 95 - 64 + 5);
                        html = '';
                    }
                    //添加完成后 判断是否显示与隐藏
                    if(!$(".answer-list-box").children().length){
                        $('.show-none').css('display','flex');
                        $('.answer-list-box').css('display','none');
                    }else{
                        $('.show-none').css('display','none');
                        $('.answer-list-box').css('display','block');
                    }
                }

            },
            dataType:'json'
        });

    });

    //第二级回复
    /*因为是后台渲染的元素 所以用的是未来点击事件*/
    $(document).on('click','.reply-del-second',function () {
        var loginState = $.cookie('loginstate');
        var login_u = $.cookie('login_u');
        var replyusername = $(this).parent().siblings('.reply-content').attr('data-reply-name');
        var replyusername_second = $(this).parent().siblings('.reply-content').attr('data-second-name');
        //这里如果想要安全一点 可以在这个页面弹出以后点击回复时候 ajax发送数据到后端 后端来验证是否对自己评论 后端是存放了session 的用户名
        if(replyusername == login_u || replyusername_second == login_u){
            $('.dialog-box').PopDialog('不可以对自己进行回复!');
            return false;
        }else{
            if(!$('.reply-btn').hasClass('reply-second')){ //if开始
                $('.reply-btn').addClass('reply-second');
                $('.mask_layer').css('display','block');
                $('.js-reply-pop').fadeIn(500);
                var reply_id = $(this).parent().siblings('.reply-content').attr('data-reply-id');
                var reply_name = $(this).parent().siblings('.reply-content').attr('data-reply-name');
                var r_comment_id = $(this).parent().parent().parent().parent().parent().siblings('.answer-content').children('.answer-desc').attr('data-comment-id');
                if($('.reply-btn').hasClass('reply-second')){
                    $('.reply-second').attr('data-reply-r-id',reply_id);
                    $('.reply-second').attr('put_id',r_comment_id);
                    $('.reply-second').attr('data-reply-r-name',reply_name);
                }else{
                    $('.reply-second').removeAttr('data-reply-r-id');
                    $('.reply-second').removeAttr('put_id');
                    $('.reply-second').removeAttr('data-reply-r-name');
                }

            } //if 结束
        }
    });



});