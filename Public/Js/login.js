$(function () {
    //注册变量
    var RegArr = [];
    /*判断用户是否登录 Cookie判断*/
    var usercookie = $.cookie('loginstate');
    if(usercookie == undefined || usercookie == null){
        $('html,body').css('overflow-y','hidden');
        $('.mask_layer').css('display','block');
        var left = $('body').Getwh('.Popup_login');
        var pop = $('.Popup_login');
        pop.animate({right:left}).fadeIn(380);
    }

    //自动登录 小红点
    $('.clickable').click(function () {
        $(this).toggleClass('checked_login');
        $(this).children().children('span').toggle();
    });
    //点击注册 弹出注册页 当前页淡出
    $('.login_tips').click(function (e) {
        e.stopPropagation(); //点击当前不消失
        //淡出当前登录页面
       $('.Popup_login').fadeOut(100);
        //计算距离页面的宽度 便于居中显示
        var pop = $('.Popup');
        var left = pop.Getwh('.Popup');
        //点击注册按钮 先淡出当前的登录div 在淡入注册
        pop.animate({right: left}).fadeIn(600);

        //当点击注册时 判断loading加载条状态 设置鼠标放上和离开事件
        if($('.ajax_loding').css('display') == 'none'){
            $('.reg_submit').hover(function(){
                $(this).css('background','#1ecd97');
            },function(){
                $(this).css('background','#fff');
            })
        }

    });
    //点击自身不消失
    $('.Popup_login').click(function (e) {
        e.stopPropagation();
    });
    //点击自身不消失
    $('.Popup').click(function (e) {
        e.stopPropagation();
    });

    /*注册验证*/
    $('.inputuser').focus(function () {

    }).blur(function () {
        /*正则判断是否是数字 或者 字母 下换线组成 不能全部是数字*/
        if(!/^(?!\d+$)[0-9A-Za-z_]{6,8}$/g.test($(this).val().replace(/\s*/g,''))){
            $(this).parent().siblings('span').css('display','block').text('用户名由数字字母下划线组成咩');
        }else{
            /*若正则没有问题则发送ajax请求 查询数据库中是否存在此用户名*/
            var regusername = $(this).val().replace(/\s*/g,'');
            $.ajax({
                type:'get',
                url:'?Controller=Index&Mode=Ajax_Checkreg',
                data:{'regusername' : regusername},
                success:function(json_data){
                    if(json_data['code'] == -1){
                        $('.inputuser').parent().siblings('span').css('display','block').text('用户名已被注册咩');
                    }else{
                        $('.inputuser').parent().siblings('span').css('display','block').text('');
                        if(RegArr.indexOf('username') == -1){
                            RegArr.push('username');
                        }
                    }
                },
                dataType:'json'
            });
        }
    });
    /*注册密码验证*/
    $('.reg_pwd').blur(function () {
        if(!/^.{6,12}$/g.test($(this).val().replace(/\s*/g,''))){
            $(this).parent().siblings('span').css('display','block').text('密码大于6位数小于12位咩');
        }else{
            $(this).parent().siblings('span').css('display','block').text('');
            if(RegArr.indexOf('password') == -1){
                RegArr.push('password');
            }
        }
    });
    /*点击注册*/
    $('.reg_submit').click(function () {
        //点击提交时禁止修改输入框
        $(':input').attr('readonly','readonly');
        /************* 点击注册时发送ajax到服务器 **************/
        if(RegArr.length == 2){
            if($('.reg_surepwd').val().replace(/\s*/g,'') != $('.reg_pwd').val().replace(/\s*/g,'')){
                $('.reg_surepwd').parent().siblings('span').css('display','block').text('两次密码不一致');
                $('.dialog-box').PopDialog('请修改错误后提交咩!');
                $(':input').attr('readonly',false);

            }else{
                //显示加载样式条
                $(this).children('div').css('display','inline-block');
                if($(this).children('div').css('display') == 'inline-block'){
                    $('.reg_submit').hover(function(){
                        $(this).css('background','#fff');
                    })
                }
                $('.reg_surepwd').parent().siblings('span').css('display','none').text(''); //错误提示隐藏
                $(this).find('.reg_submit_b').css('display','none'); //注册的文字隐藏
                $(this).css('border','none');
                $(this).css('cursor','default');
                $(this).css('background','#fff');
                $.ajax({
                    type:'POST',
                    url:'?Controller=Index&Mode=Reguser', //向控制器请求注册的方法
                    data:{'username':$('.inputuser').val().replace(/\s*/g,''),'password':$('.reg_pwd').val().replace(/\s*/g,'')},
                    success:function(json_reslut){
                        if(json_reslut['code'] == 1){
                            /*注册成功进入登录页面进行登录*/
                            $('.Popup').hide(500);
                            $('.Popup_login').fadeIn(1000);
                            $('.Popup :input').val('');
                            $('.dialog-box').PopDialog('注册成功!');
                            $('.reg_submit').find('.reg_submit_b').css('display','block').hover(function () {
                                $(this).css('border','none');
                            },function () {
                                $(this).css('border','1px solid rgba(0, 0, 0, 0.1)');
                            });
                            $('.reg_submit').find('.reg_submit_b').css('border-radius','60px');
                            $('.reg_submit').find('.reg_submit_b').css('border','1px solid rgba(0, 0, 0, 0.1)');
                            $(':input').attr('readonly',false);
                            //注册成功 清空一下 防止再次提交
                            RegArr = [];
                        }else{
                            $('.dialog-box').PopDialog('注册失败请稍后再试!');
                            $('.Popup').fadeOut(300);
                            $('.Popup_login').fadeOut(300);
                            $('.ajax_loding').fadeOut(800);
                            $('html,body').css('overflow-y','auto');
                            $('.mask_layer').css('display','none');
                        }
                        $('.ajax_loding').fadeOut(600);
                    },
                    dataType: 'json'
                });
            }
        }else{
            $('.dialog-box').PopDialog('请先修改错误哦!');
            $(this).children('div').css('display','none');
            $(this).find('.reg_submit_b').css('display','block');
            $(':input').attr('readonly',false);
            if($(this).children('div').css('display') == 'inline-block'){
                $('.reg_submit').hover(function(){
                    $(this).css('background','#fff');
                })
            }
        }
    });




    /*点击登录*/
    $('.login_submit').click(function () {
        //先判断用户名 或者密码是否为空  若为空直接提示错误
        /*正则去除所有的空格*/
        var login_user = $('.login_user').val().replace(/\s*/g,'');
        var login_pass = $('.login_pwd').val().replace(/\s*/g,'');
        if(login_user == '' || login_pass == ''){
            $('.dialog-box').PopDialog('输入点什么吧');
        }else{
        //用户名或密码不为空 执行
        //发送请求时候 先加载 加载动画
        $('.ajax_loding').css('display','block');
        //将登录框隐藏
        $('.login_submit_b').css('display','none'); //字体隐藏
        $('.login_submit').css('border','none');
        $('.login_submit').css('background','#fff')
        if($('.ajax_loding').css('display') == 'block'){
            $('.login_submit').hover(function () {
                $(this).css('background','#fff');
            });
        }

        /*发送ajax请求*/
        $.ajax({
            type:'POST',
            url:'?Controller=Index&Mode=Login',
            data:{'login_user':login_user,'login_pass':login_pass}, //将用户输入的用户名和密码发送到服务器端效验
            success:function(login_json){
                //大致思路:是否勾选自动登录 若是则设置cookie时间30天 不是则
                //设置cookie关闭浏览器时清除

                    if(login_json['code'] == 1){
                        //当加载成功隐藏
                        $('.ajax_loding').css('display','none');
                        $('.Popup_login').fadeOut(500);
                        $('.dialog-box').PopDialog('登录成功');
                        /*关闭遮罩 打开滑动条*/
                        $('html,body').css('overflow-y','auto');
                        $('.mask_layer').css('display','none');
                        //登录成功后再次判断 用户是否勾选了自动登录 若勾选了 设置cookie存在时间30 否则cookie只有在浏览器打开时生效
                        if($('.clickable ').hasClass('checked_login')){
                            //存在这里class 那就是不自动登录
                            $.cookie('loginstate','1');
                            $.cookie('login_u',login_user);
                        }else{
                            //相反 则自动登录 设置长时间存在的cookie
                            $.cookie('loginstate','1',{ expires: 30 });
                            $.cookie('login_u',login_user,{ expires: 30 });
                        }
                    }else{
                        $('.dialog-box').PopDialog('用户名或密码错误咩');
                        $('.ajax_loding').css('display','none');
                        $('.login_submit_b').css('display','block'); //字体显示
                        $('.login_submit').css('border','1px solid rgba(0, 0, 0, 0.1)');
                        $('.login_submit').hover(function () {
                            $(this).css('background','#1ecd97');
                        },function () {
                            $(this).css('background','#fff');
                        });
                    }

            },
            dataType:'json'
        });
       } //用户名密码判断空 -end
    });



});
//取消外部区域
$(document).click(function (e) {
    if($('.ajax_loding').css('display') != 'none'){
        /*这里判断 如果点击了注册 显示注册动画后 点击*/
    }else{
        if($('.js-reply-pop').css('display') == 'block'){
            $('.mask_layer').css('display','block');
        }else{
        $('.Popup').fadeOut(300);
        $('.Popup_login').fadeOut(300);
        $('.ajax_loding').fadeOut(800);
        $('html,body').css('overflow-y','auto');
        $('.mask_layer').css('display','none');
        }
    }
});

