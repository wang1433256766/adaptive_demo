var USER_ID = null; //当前登录用户的id,全局变量
$(function() {
    //监听浏览器窗口大小的变化事件
    $(window).resize(function() {
        if ($(window).width() >= 768) {
            $(".nav-list").css('display', 'block');
        }
    })

    //屏幕宽度小于769px时，点击菜单按钮切换菜单的显示/隐藏
    $("#toggle-navlist").click(function() {
        //$(window).width() 表示窗口可视化区域宽度
        if ($(window).width() < 768) {
            $(".nav-list").toggle();
        }
    })

    //判断是否登录 isLogin
    $.ajax({
        async: false,
        type: 'GET',
        url: URI_DOMAIN + '/auth/isLogin',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function(res) {
            var hasLogin = "";
            if (res.status == 1) {
                USER_ID = res.data.id;
                if (window.location.pathname.indexOf('myaccount') != -1) {
                    hasLogin = '<span class="active"><a href="./myaccount.html">' + res.data.username + '</a></span><a onclick="logout()">Logout</a>';
                } else {
                    hasLogin = '<a href="./myaccount.html">' + res.data.username + '</a><a onclick="logout()">Logout</a>';
                }
            } else {
                hasLogin = '<a href="./login.html">Login</a><a href="./register.html">Register</a>';
            }
            $('.login-self').html(hasLogin);
        }
    })
})

function logout() {
    $.ajax({
        type: 'GET',
        url: URI_DOMAIN + '/auth/logout',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function(res) {
            if (res.status == 1) {
                window.location.href = './login.html';
            }
        }
    })
}