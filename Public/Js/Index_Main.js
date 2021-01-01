$(function() {

    /*页面打开是 先加载一次ajax数据 显示文章卡片 这里固定了是当页面是有4个卡片时候才会有滑动条显示 然后在加载瀑布流的 所以 我们开始只让页面显示4个卡片 用户需要我子啊滑动加载即可*/
    /*获取页面固定死的4个div*/
    $divone   = $('.grid .grid-item:eq(0)');
    $divtwo   = $('.grid .grid-item:eq(1)');
    $divthree = $('.grid .grid-item:eq(2)');
    $divfour  = $('.grid .grid-item:eq(3)');
    $.ajax({
        type:'GET',
        dataType:'json',
        url:'?Controller=Article&Mode=CardShowData',
        success:function(json_result){
            $divone.css('display','none');
            $divtwo.css('display','none');
            $divthree.css('display','none');
            $divfour.css('display','none');
            sw_loader.css('display','inline-block');
            var html = '';
            for(var i in json_result){
                html += '<div class="swcontent" data-artid="' + json_result[i].article_id + '">';
                html += '<div class="sw-head">';
                html += '<div class="sw-left">';
                html += '<div class="userimg">';
                html += '<img src=' + json_result[i][0].user_img + '>';
                html += '</div>';
                html += '<div class="ct">';
                html += '<div>' + json_result[i].article_puser + '</div>';
                html += '<span>' + $().formattime(json_result[i].article_addtime) + '</span>';
                html += '<span>' + json_result[i].article_heat +  '热度' + '</span>';
                html += '</div>';
                html += '</div>';
                html += '<div class="sw-body">';
                html += '<img id="sw-img" src=' + json_result[i].article_mainimg + '>';
                html += '<div class="sw-xdpz">';
                html += '<span><span class="sw-like diyfont"></span>' + json_result[i].article_like + '</span>';
                html += '<span><span class="sw-dianzan diyfont"></span>' + json_result[i].article_thumb + '</span>';
                html += '<span><span class="sw-comment diyfont"></span>' + json_result[i].article_comment + '</span>';
                html += '<span><span class="sw-forword diyfont"></span>转发</span>';
                html += '</div>';
                html += '<div class="sw-title">';
                html += '<p>'+ json_result[i].article_header +'</p>'
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                if(i == 0){
                    $divone.html('');
                    $(html).appendTo($divone).hide().fadeIn(600);html = '';
                    $divone.css('display','flex');
                }else if(i == 1){
                    $divtwo.html('');
                    $(html).appendTo($divtwo).hide().fadeIn(600);html = '';
                    $divtwo.css('display','flex');
                }else if(i == 2){
                    $divthree.html('');
                    $(html).appendTo($divthree).hide().fadeIn(600);html = '';
                    $divthree.css('display','flex');
                }else{
                    $divfour.html('');
                    $(html).appendTo($divfour).hide().fadeIn(600);html = '';
                    $divfour.css('display','flex');
                }
                // $(html).appendTo($('.grid')).hide().fadeIn(1800);html = ''
            }
            //ajax请求成功 隐藏加载条
              sw_loader.fadeOut(570);


        }
    });



    /*为未来的ajax添加的元素绑定事件*/
    $(document).on('mouseenter','#sw-img',function(){
        $(this).css('transform','scale(1.05,1.05)');
    });
    $(document).on('mouseleave','#sw-img',function(){
        $(this).css('transform','scale(1,1)');
    });
    $.each($('.swcontent'),function(i,val){
        $(document).on('mouseenter','.swcontent',function () {
            $(this).children().children().children().siblings('.ct').children('div:first').css('color','#3D7EFE');
        });
        $(document).on('mouseleave','.swcontent',function () {
            $(this).children().children().children().siblings('.ct').children('div:first').css('color','#34495E');

        });
    });

    minigrid('.grid', '.grid-item', 8, null,function () {
        $('.grid').css('overflow','hidden');
        //这里有滑动条的影响 加一个2
        $('.grid').children().css('width',$('.grid-item').innerWidth() + 2);
    });
    /*窗口改变进行一次动画*/
    window.addEventListener('resize', function(){
        minigrid('.grid', '.grid-item', 8, null,null);
    } );
    /*鼠标移入显示滚动条 反之移出*/
    $('.main_msg-box').hover(function () {
        $(this).children('.grid').css('overflow','auto');

    },function () {
        $(this).children('.grid').css('overflow','hidden');
    });
    var tranY;
    var restop = 0;
    var sw_loader= $('.sw-loader>svg'); /*加载条*/
    var sw_tips = $('.nodata').css('display','none');
    //console.log(sw_loader)
    var StaticPage = 1;
    $('.grid').scroll(function () {
        var sTop = Math.ceil($(this).scrollTop()); /*获取滚动条的高度*/
        var last_item = Math.ceil($('.grid-item:last').innerHeight());/* 获取最后一个元素的高度 */
        tranY = Math.ceil(minigrid('.grid','.grid-item',8,null,null));
        /*console.log("Y轴：" + tranY);
        console.log("高度：" + last_item);
        console.log("滚动条高度：" + sTop);
        console.log("last_item + sTop：" + Math.ceil(last_item + sTop - 108));*/
        //没办法 只能这样消除一点bug   手机端
        if(Math.ceil(last_item + sTop - 108) == tranY || Math.ceil(last_item + sTop - 108) + 1 == tranY || Math.ceil(last_item + sTop - 108) - 1 == tranY){
            sw_loader.css('display','inline-block');
            /*获取ajax数据*/
            $.ajax({
                type:'POST',
                url:'?Controller=Index&Mode=Ajax_CardShow',
                data:{'P':StaticPage},
                success:function(json_data){
                    // console.log(json_data);
                    if( json_data.length == 0 ){
                        sw_loader.hide();
                        sw_tips.fadeIn(800).fadeOut(4000);
                        return false;
                    }
                    var html = '';
                    for(var i in json_data){
                        html += '<div class="grid-item" style="transform: translate(10%, -5%);">';
                        html += '<div class="swcontent" data-artid="' +json_data[i].article_id  + '">';
                        html += '<div class="sw-head">';
                        html += '<div class="sw-left">';
                        html += '<div class="userimg">';
                        html += '<img src=' + json_data[i][0].user_img + '>';
                        html += '</div>';
                        html += '<div class="ct">';
                        html += '<div>' + json_data[i].article_puser + '</div>';
                        html += '<span>' + $().formattime(json_data[i].article_addtime) + '</span>';
                        html += '<span>' + json_data[i].article_heat +  '热度' + '</span>';
                        html += '</div>';
                        html += '</div>';
                        html += '<div class="sw-body">';
                        html += '<img id="sw-img" src=' + json_data[i].article_mainimg + '>';
                        html += '<div class="sw-xdpz">';
                        html += '<span><span class="sw-like diyfont"></span>' + json_data[i].article_like + '</span>';
                        html += '<span><span class="sw-dianzan diyfont"></span>' + json_data[i].article_thumb + '</span>';
                        html += '<span><span class="sw-comment diyfont"></span>' + json_data[i].article_comment + '</span>';
                        html += '<span><span class="sw-forword diyfont"></span>转发</span>';
                        html += '</div>';
                        html += '<div class="sw-title">';
                        html += '<p>'+ json_data[i].article_header +'</p>'
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                    }
                    StaticPage++; //媒介  类似于分页中的页码
                    //ajax请求成功 隐藏加载条
                    sw_loader.fadeOut(570);
                    $(html).appendTo($('.grid')).hide().fadeIn(1800);html = '';
                    /*加大二个像素 防止鼠标放上时会扩大一下标签*/
                    $.each($('.grid').children(),function(i,val){
                        if(!$('.grid').children().eq(i).attr('min-w')){
                            $('.grid').children().eq(i).css('width',$('.grid').children().innerWidth() + 2);
                        }
                        $('.grid').children().eq(i).attr('min-w','max');
                    });
                    minigrid('.grid', '.grid-item', 8, null,null);
                    /*加载完成自适应一次布局*/
                    Adaption();

                },
                dataType:'json'
            });
        }

    });
    /*点击某张卡片进入详细页*/
    $(document).on('click','.swcontent',function(){
        $('.show-detail').css('display','block').animate({height:'550px'},600);
        $('.show-detail').children('.ques-list').children('.answer-list-box').attr('data-artid',$(this).attr('data-artid'));
        $('.show-fixed-bottom').css('width',$('.show-detail').width());
        $('.show-fixed-bottom').fadeIn(800);
        /*设置article 中的所有img属性的宽度最大为他的父元素宽度*/
        $('article img').css('max-width',$('.show-detail').width());
        /*判断回复框宽度*/
        Adaption();
        /*左边  整个宽度*/
        $('.answer-box').css('width',$('.show-detail').width() - 48 - 64 + 5);
        $('.reply-item').css('width',$('.show-detail').width() - 95 - 64 + 5);
        $('.js-reply-pop').css('left',($('body').width() -640) / 2);
        $('.js-reply-pop').css('top',($(window).height() -360) / 2);

    });
    $('.show-detail #detail-close span').click(function () {
        $('.show-fixed-bottom').fadeOut(400);
        /*关闭时 回到顶部*/
        $('.show-detail').animate({height:'0',scrollTop:0},600).fadeOut(0);
    });


    /*评论点赞*/
    $(document).on('click','.agree',function () {
        /*用指定的当前的class获取他的兄弟元素 如果直接 选择所有的类名的话 点赞或反对则所有的点赞或取消都会修改 所以用此可以保证只是当前的改变*/
        var siblingoppo = $(this).siblings('.oppose');
        if($(this).hasClass('js-if')){
            /*首先应该发送ajax*/
            $(this).children('i').css('color','#fff');
            $(this).css('background-color','#1FAD4E');
        }else{
            $(this).children('i').css('color','#545C63');
            // $(this).children('em').css('display','none').css('color','black');
            $(this).css('background-color','#EFEFEF');
        }
        /*用来判断已反对显示的图标*/
        if($(this).hasClass('js-if') == true || ($('.oppose').hasClass('js-if') == false) ){
            $(this).children('i').css('color','#fff');
            $(this).css('background-color','#1FAD4E');
            siblingoppo.children('em').text('反对');
            siblingoppo.children('i').css('color','#545C63');
            siblingoppo.children('em').css('color','black');
            siblingoppo.css('background-color','#EEEEEF');
        }
        siblingoppo.addClass('js-if')
        /*有则删除 没有这添加 取反*/
        $(this).toggleClass("js-if");

    });
    /*评论反对*/
    $(document).on('click','.oppose',function () {
        var siblingsagree = $(this).siblings('.agree');
        if($(this).hasClass('js-if')){
            /*首先应该发送ajax*/
            $(this).children('em').text('已反对');
            $(this).children('i').css('color','#fff');
            $(this).children('em').css('color','#fff');
            $(this).css('background-color','#1FAD4E');
            $(this).removeClass('js-if');
            siblingsagree.addClass("js-if");
            siblingsagree.children('i').css('color','#545C63');
            siblingsagree.css('background-color','#EEEEEF');
        }else{
            /*调用自定义弹窗插件*/
            $('.dialog-box').PopDialog('你已经反对过了哦');
        }
    });
    //点击弹出回复输入框
    $(document).on('click','.reply-del',function (e) {
        var loginState = $.cookie('loginstate');
        var login_u = $.cookie('login_u');
        if(loginState == undefined || loginState == null || loginState == ''){
            //点击登录框时不会显示后马上消失
            e.stopPropagation();
            $('.dialog-box').PopDialog('登录后再回复mie');
            $('html,body').css('overflow-y','hidden');
            $('.mask_layer').css('display','block');
            $('.Popup_login').show(500);
        }else{
            //二次判断 不可以对自己评论
            //data-comment-user
            var realyusername = $(this).parent().siblings('.answer-content').children('.answer-desc').attr('data-comment-user');
            //这里如果想要安全一点 可以在这个页面弹出以后点击回复时候 ajax发送数据到后端 后端来验证是否对自己评论 后端是存放了session 的用户名
            if(realyusername == login_u){
                $('.dialog-box').PopDialog('不可以对自己发布的评论回复咩');
                return false;
            }
            //回复框框显示
            e.stopPropagation();
            $('.mask_layer').css('display','block');
            $('.js-reply-pop').fadeIn(600);


            //获取用户点击的这个评论的data属性的评论id值
            var ele = $(this).parent().siblings('.answer-content').children('.answer-desc');
            var comment_id = ele.attr('data-comment-id');
            var comment_name = ele.attr('data-comment-user');
            $('.reply-btn').attr('data-reply-id',comment_id);
            $('.reply-btn').attr('data-reply-name',comment_name);


        }

    });
    /*关闭输入框*/
    $(document).on('click','.js-close-replypop',function (e) {
        e.stopPropagation();
        $('.mask_layer').css('display','none');
        $('.js-reply-pop').fadeOut(400).find('button').removeClass('comment-btn').text('回复');
        $('.js-reply-pop').find('textarea').attr('placeholder','写下你的回复');
        $(this).parent().siblings('.sublime-footer').find('button').removeClass('reply-second').addClass('reply-btn');
        $('.reply-btn').removeAttr('data-reply-id');
        $('.reply-btn').removeAttr('data-reply-name');
        $('.reply-btn').removeAttr('data-reply-r-id');
        $('.reply-btn').removeAttr('data-reply-r-name');
        $('.reply-btn').removeAttr('put_id');
    });


    function Adaption(){
        if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
            //手机端 设置主页面宽度90%
            $('.Main').css('width','90%');

            /*修改显示布局适应手机端显示*/
            $('.grid-item').css('width','90%');
            $('.grid-item').css('margin-left','0px');
            $('.js-reply-pop').css('width',$('.show-detail').width());
            $('.js-reply-pop textarea ').css('width',$('.show-detail').width());
        }
    }

    Adaption();


}); //--全局结束





