//页面加载所要进行的操作、
//当前登录用户（管理员/医生）的信息
var userinfo = [];
(function ($) {
    getUserInfo = function () {
        //获取当前登录用户（管理员/医生）的信息
        ajax("/zqfz/teacher/teacher/my-info", {}, function (res) {
            if (!res.result) {
                userinfo = res.data;
                $("#username").text(res.data.name);
            } else {
               // alert(res.message);
            }
        });
    };
    //判断为管理员还是医生
    var isadmin = $.cookie('is_admin');
    $("li.isteacher").each(function () {
        if (isadmin == 0) {
            $(this).css('display', 'none');
            $('#head-img').attr('src', 'img/tdoctor.png');
        }else{
        $('#head-img').attr('src', 'img/tmanager.png');
        }
    })
    getUserInfo();
    getflag = function () {
        ajax('/zqfz/teacher/appointment/list', { 'status': 0 }, function (res) {
            if (res.result) {
               // confirm(res.message);
            } else {
                console.log(res.data.list);
                var list = res.data.list;
                $("#flags").text(list.length);
            }
        });
    }
    getflag();

})(jQuery);
