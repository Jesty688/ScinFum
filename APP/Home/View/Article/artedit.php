<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon " type="images/x-icon" href="Public/Images/favicon.ico">
    <title>文章发表-一个帅帅的小社区</title>
    <link rel="stylesheet" href="Public/Css/edit_style.css">
    <link rel="stylesheet" href="Public/Css/imp_font.css">
    <link rel="stylesheet" href="Public/Css/iconfont.css">
    <!--导入编辑器js-->
    <script src="Public/Vendor_Style/Js/Editor.js"></script>
    <script src="Public/Js/jquery-3.3.1.js"></script>
    <script src="Public/Vendor_Style/Js/jquery.cookie.js"></script>
    <script src="Public/Js/Release.js"></script>
</head>
<body class="test">

<div class="scrollHeader" style="display: block;">
    <div class="detailscroll-nav">
        <div class="img_logo">
            <img src="Public/Images/favicon.ico" alt="">
        </div>
        <div class="scroll-answerbtn r">文章发表 (ฅ• . •ฅ)</div>
    </div>
</div>

<!--整个表单  -->
<form action="#" class="form-style" name="eac">
    <div class="up-wrap">

        <div class="wpn clear">
            <!--一言-->
            <div class="one_remark">
                <a href="javascript:;">一句</a>
                <span>loading...</span>
            </div>
            <!--一言END-->
            <div class="show_left">
                <div class="clear">
                    <div class="form-group">
                        <label for="title" class="control-label">
                            标题:
                            <small class="y">3-30字</small>
                        </label>
                        <input class="control-input control-input2" name="title" maxlength="30" id="title" type="text" value="" placeholder="请输入标题">
                    </div>

                    <div class="up-form">
                        <label for="title" class="control-label">
                            文章正文:
                            <small>在这里填写详细的文章内容分享给大家</small>
                        </label>
                        <!--编译器-->
                        <div id="editor">
                            <div id="tool" class="toolbar"></div>
                            <div style="padding: 5px 0; color: #ccc"></div>
                            <div id="t_content" class="textcontent">
                                <p>请输入内容</p>
                            </div>
                        </div>
                    </div>

                    <div class="form-group bom clear">
                        <label class="control-label">
                            上传:
                            <label for="prosupload" class="up-atta">
                                <input id="upAttaFile" name="upfile-choose" checked="checked" type="radio" value="local">
                                本地上传
                            </label>
                            <label class="up-atta" for="prosurl">
                                <input id="upAttaUrl" name="upfile-choose" type="radio" value="sky">
                                网盘地址
                            </label>
                            <small class="y">超过30M的附件请使用网盘地址</small>
                        </label>
                        <!--本地上传-->
                        <!--<div class="up-atta-file">
                            <input class="up-atta-url" type="file" name="panurl">
                        </div>-->
                        <div class="control-input up-atta-file">
                            <!--隐藏-->
                            <input class="up-atta-url fujian" type="file" name="onlineurl" accept="application/x-rar-compressed,application/zip,application/x-7z-compressed">
                            <!--提示文字-->
                            <i class="diyfont"></i>
                            <span class="trips_zi">点击上传附件压缩包 ( zip,rar,7z )</span>
                        </div>
                        <!--网盘上传-->
                        <input class="control-input up-atta-url wp" type="text" value="" name="panurl" style="display: none;">
                    </div>
                    <!--上传标签-->
                    <div class="form-group bom clear">
                        <label class="control-label" for="tags">
                            标签:
                            <small class="y">建议2-5标签</small>
                        </label>
                        <div class="control-input gettags"></div>
                        <input class="hidetags" type="text" readonly name="tags"></input>
                        <!--标签存放器-->
                        <div class="all_tags">
                            <span class="red">PHP</span>
                            <span>AJAX</span>
                            <span >HTML</span>
                            <span class="red"class="red">CSS</span>
                            <span class="red">JAVASCRIPT</span>
                            <span>前端开发</span>
                            <span>Android</span>
                            <span>IOS</span>
                            <span class="red">JAVA</span>
                            <span>C</span>
                            <span>.NET</span>
                            <span class="red">C#</span>
                            <span>图标设计</span>
                            <span class="red">UI设计</span>
                            <span>教程</span>
                            <span>PS教程</span>
                            <span>界面设计</span>
                            <span>网页设计</span>
                            <span>GUI</span>
                            <span>游戏界面</span>
                            <span>排版</span>
                        </div>
                    </div>
                </div>
            </div>

            <!--右边封面上传-->
            <div class="y cover">
                <p class="up-cover-user">
                    <a href="javascript:;" class="avatar">
                        <img src="Public/Images/favicon.ico" alt="">
                        <span class="user"><?php echo $_COOKIE['login_u'] ?? '请先登录'?></span>
                    </a>
                </p>
                <a href="javascript:;" class="up-cover-pic">
                    <img src="Public/Images/cover.png" alt="">
                </a>
                <div class="uploadimg">
                    <span>上传封面</span>
                    <input type="file" accept=".jpg,.gif,.png" class="required" name="coverfile"  multiple="" value="">
                </div>
            </div>

        </div>
    </div>
    <textarea name="editor_content" id="setcontent"></textarea>
</form>
<div class="footer">
    <div class="clear wpn">
        <div class="up-submit y up-submit2">
            <span class="btn btn-primary btn-big btn-fixed-w" id="save_e">立即发布</span>
        </div>
    </div>

</div>
</body>
</html>
