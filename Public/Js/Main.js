
$(function () {
    //导航栏自适应宽高
    $.each($('.main_nav div:not(".curBg")'),function (i,val) {
        $(val).css('width',$(this).innerWidth() + 18 + 'px');
        $(val).css('height',$(this).innerHeight() + 10 + 'px');
    });

    /************************点击菜单栏切换样式************************/
    var $liCur=$(".title_f");
    var curP = 23.5;
    var curW = 15;
    var timer = null;
    var $slider=$(".curBg");
    var $navBox=$(".main_nav");
    $targetEle=$(".main_nav div span");
    /*首页开始先执行一次动画*/
    $slider.animate({"left": curP,"width":curW},200);
    /*鼠标放上*/
    /*$targetEle.mouseenter(function() {
        var $_parent=$(this).parent();
        var _width=15;
        var posL=$_parent.position().left + ($(this).width() / 2) + 2;
        //console.log(($(this).width() / 2));
        timer = setTimeout(function () {
            $slider.stop().animate({"left": posL,"width":_width},500);
        },150);
    });*/
    /*鼠标离开*/
    /*$navBox.mouseleave(function(cur,wid){
        clearTimeout(timer);
        cur=curP;
        wid=curW;
        $slider.stop().animate({
            "left": cur,
            "width":wid,
        },500);
    });*/

    /************************设置点击菜单栏改变样式************************/
    $(".main_nav div span").click(function () {
        var $_parent=$(this).parent();
        var _width=15;
        var posL=$_parent.position().left + ($(this).width() / 2) + 2;
        setTimeout(function () {
            $slider.stop().animate({"left": posL,"width":_width},500);
        },150);
        curP =$(this).parent().position().left + ($(this).width() / 2) + 2;
        $.each($(this),function (i,val) {
            $(this).animate({fontSize:'20px'},300);
            //找父亲兄弟的儿子span
            $(this).addClass('checked_span').parent().siblings().children('span').removeClass('checked_span').css('font-size','18px');
        })
    });

    //顶部轮播
    var $ul=$('.roll ul');
    var timeID;
    function roll(){
        clearInterval(timeID);
        timeID=setInterval(function(){clearInterval(timeID);$ul.animate({top: "0px"
        },2500,function() {
            $ul.find("li:first").removeClass().addClass('roll_hide').appendTo($ul);for(var i=0;i<3;i++){$ul.find("li").eq(i).removeClass().addClass('roll_'+(i+1)+'')
            }
            roll()
        })},1000);
    }
    roll();

    $('.publish').click(function () {
        window.open('?Controller=Article&Mode=AtrEdit', "_blank");
    });



});
