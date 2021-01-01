$(function () {

    $('.UserCenter').click(function () {
        $.each($('.main_msg'),function (index,value) {
            //console.log(index,value);
            if(!$(value).hasClass('UserC')){
                $(value).fadeOut(500);
            }else{
                $(value).fadeIn(500);
            }
        })

    })
    $('.St').click(function () {

        $.each($('.main_msg'),function (index,value) {
            //console.log(index,value);
            if(!$(value).hasClass('Shuitui')){
                $(value).fadeOut(500);
            }else{
                $(value).fadeIn(500);
            }
        })
        // $(this).fadeIn(500);
    })

});