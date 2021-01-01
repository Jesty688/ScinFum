$(function () {

    //判断用户是否登录
    var loginState = $.cookie('loginstate');
    var login_u = $.cookie('login_u');
    if(loginState == undefined || loginState == null || loginState == '' || login_u == '' || login_u == null || login_u == undefined){
        alert('登录后再发布');
        window.location.href = './';
        return false;
    }
    //初始化编辑器
    var editor = new wangEditor('.toolbar','.textcontent');
    editor.create();
    /*添加 / 删除标签*/
    $('.all_tags span').click(function(){
        //点击判断
        if(!$(this).hasClass('have')){
            //若没有 点击就是添加 若有 点击就是删除
            //将当前这个span添加进div中 并且隐藏
            $('.gettags').prepend($(this));
            $(this).addClass('have');
        }else{
            $('.all_tags').prepend($(this));
            $(this).removeClass('have');
        }

    });

    /*获取一言*/
    $.ajax({
        type:'GET',
        url:'https://v1.hitokoto.cn',
        data:{'c':'b'},
        dataType:'json',
        success:function (json_once) {
            var str = json_once.hitokoto + '-' +json_once.from;
            $('.one_remark span').text(str);
        }
    })

    //上传附件
    $('.up-atta-file').click(function(){
      // $('.up-atta-url').click();
      document.getElementsByClassName('fujian')[0].click();
    });
    // 云盘
    $('#upAttaUrl').click(function(){
      $(this).parent().parent().siblings('div.up-atta-file').css('display','none')
      $(this).parent().parent().siblings('input.up-atta-url').css('display','block');
    });
    // 在线附件
    $('#upAttaFile').click(function(){
      $(this).parent().parent().siblings('div.up-atta-file').css('display','block')
      $(this).parent().parent().siblings('input.up-atta-url').css('display','none');
    });


    //上传封面 + 预览
    function openFile(node,imgele){
        var file = node.files[0];//获取文件
        var reader = new FileReader(); //实例化对象
        reader.readAsDataURL(file);//通过readAsDataURL()方法读取文件
        reader.onload = function (evt) {//调用FileReader()的onload事件，当文件读取成功时,
            //console.log($(imgele));
            $(imgele).attr("src", evt.target.result);
        }
    }
    $('.required').change(function () {
        openFile(this,'.up-cover-pic img');
    });
    $('.up-cover-pic').click(function () {
        document.getElementsByClassName('required')[0].click();
    });
    $('.uploadimg').click(function () {
        document.getElementsByClassName('required')[0].click();
    });

    $('#save_e').click(function () {
        //表单中的任何可以输入的标签都需要过滤xss 包括图片马  -> 给后端的控制器过滤
        //1.检查标题最少3 最多30字体
        var title_len = $('#title').val().length;
        var textareacon_len = $('.w-e-text').text().length;
        var editorhtml = editor.txt.html();
        var tagstext = '';
        if(title_len < 3 || title_len > 30){
            alert('请检查标题字数');
            return false;
        }
        if(textareacon_len < 3){
            alert('请输入点什么吧');
            return false;
        }
        /*获取标签*/

        $.each($('.gettags').children(),function () {
            tagstext += $(this).text() + ',';
        })
        $('.hidetags').val(tagstext);
        /*检查封面是否上传*/
        var imgfile = document.querySelector('.required');
        if(imgfile.files[0] == undefined){
            alert('你还没上传封面哦');
            return false;
        }
        $('#setcontent').val(editorhtml);
        /*点击上传到后端*/
        /*获取表单*/
        var formname = document.eac;
        var formedit = new FormData(formname);
        $.ajax({
            type:'POST',
            url:'?Controller=Article&Mode=Publish_Art',
            dataType:'json',
            data:formedit,
            contentType: false,
            processData: false,
            success:function (json_result) {
                if(json_result.code == 1){
                    alert(json_result.result);
                    window.location.href = './';
                }else if (json_result.cdoe == 0){
                    alert(json_result.result);
                    window.location.href = './';
                }else{
                    alert(json_result.result);
                    window.location.href = './';
                }
            }
        })

    });

    /*获取上传的文件并修改显示*/
    $('.fujian').change(function () {
        var file = this.files[0];//获取文件
        $('.trips_zi').text(file.name);
    });
    /*点击网盘地址 清空上传的value*/
    $('#upAttaUrl').click(function () {
        console.log( $('.fujian').val());
        $('.fujian').val('');
        $('.trips_zi').text("点击上传附件压缩包 ( zip,rar,7z )");
    });




});
