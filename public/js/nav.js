$(function() {
    //监听浏览器窗口大小的变化事件
    $(window).resize(function() {
        if ($(window).width() >= 768) {
            $(".nav-list").css('display', 'block');
        } else {
            $(".nav-list").css('display', 'none');
        }
    })

    //屏幕宽度小于769px时，点击菜单按钮切换菜单的显示/隐藏
    $("#toggle-navlist").click(function() {
        //$(window).width() 表示窗口可视化区域宽度
        if ($(window).width() < 768) {
            $(".nav-list").toggle();
        }
    })
})