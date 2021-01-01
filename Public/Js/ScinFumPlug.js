/*
* @Getwh
* @Param
* --ele jq对象 计算距离页面左边或者右边的宽度 待优化
* */
/*
* @PopDialog
* @param
*   --trips:弹窗提示文字
*   --
* */

$.fn.extend({
    Getwh:function (ele) {
       var obj = $(ele);
       return ($(window).width() - obj.outerWidth()) / 2 ;

    },
    PopDialog:function (trips) {
        $(this).children('div').text(trips);
        $(this).css('left', ($('body').width() - $(this).width()) / 2);
        $(this).css('display','block').fadeIn(100).fadeOut(5500);
    },
    formattime:function (timer) {
        var result = new Date().getTime() - parseInt(timer) * 1000; //乘1000 是要和js的时间戳一致 否则无法转换
        // console.log((new Date().getTime()),(parseInt(timer) * 1000));
        var timerstr = '';
        /*判断时间 秒数 分钟 天数 日期*/
        if(result < 60000){
            return timerstr =  Math.floor(((new Date().getTime()-(parseInt(timer) * 1000)) / 1000)) + '秒前';
        }else if(result > 60000 && result <= 3600000){
            return timerstr =  (Math.floor(result / 60000)) + '分钟前';
        }else if(result > 3600000 && result <= 86400000){
            return timerstr =  (Math.floor(result / 3600000)) + '小时前';
        }else if(result > 3600000 && result <= 108000000){
            return timerstr = (Math.floor(result / 86400000)) + '天前';
        }else{
            timerstr = new Date(parseInt(timer) * 1000).getFullYear() + '-';
            timerstr += (new Date(parseInt(timer) * 1000).getMonth()+1 < 10 ? '0'+(new Date(parseInt(timer) * 1000).getMonth()+1) : new Date(parseInt(timer) * 1000).getMonth()+1) + '-';
            timerstr += new Date(parseInt(timer) * 1000).getDate();
            return timerstr;
        }
    }
});