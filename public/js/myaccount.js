$(function() {
    var $li = $('.tab-bar li');
    var $content = $('.sider-content .tab-content');
    $content.css('display', 'none');
    $content.eq(0).css('display', 'block');

    $li.click(function() {
        var _this = $(this);
        var _index = _this.index();
        $li.removeClass();
        _this.addClass('active-bar');
        $content.css('display', 'none');
        $content.eq(_index).css('display', 'block');
    })

    //获取当前用户信息
    $.ajax({
        type: 'GET',
        url: URI_DOMAIN + '/userinfo/query_by_id',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: { id: USER_ID },
        success: function(res) {
            if (res.status == 1) {
                $(".email-view input").val(res.data.email);
                $(".username-view input").val(res.data.username);
                $(".institution-view input").val(res.data.groupOf);
                $(".address-view input").val(res.data.location);
                $(".phone-view input").val(res.data.phone);

                $(".email-edit input").val(res.data.email);
                $(".username-edit input").val(res.data.username);
                $(".institution-edit input").val(res.data.groupOf);
                $(".address-edit input").val(res.data.location);
                $(".phone-edit input").val(res.data.phone);

                $(".pwd-email input").val(res.data.email);
            }
        }
    });

    //修改当前用户信息
    $(".self-info-submit button").click(function() {
        var username = $(".username-edit input").val();
        var groupOf = $(".institution-edit input").val();
        var location = $(".address-edit input").val();
        var phone = $(".phone-edit input").val();
        $.ajax({
            type: 'POST',
            url: URI_DOMAIN + '/userinfo/update_by_id',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: { id: USER_ID, username: username, groupOf: groupOf, location: location, phone: phone },
            success: function(res) {
                if (res.status == 1) {
                    window.location.reload();
                }
                alert(res.msg);
            }

        })
    })

    //获取修改密码的验证码  
    $(".v-code button").click(function() {
        var email = $(".pwd-email input").val();
        var time = 60;
        var $code = $(this);
        var validCode = true;
        if (validCode) {
            validCode = false;
            var t = setInterval(function() {
                time--;
                $code.html(time + " 秒");
                $(".v-code button").attr('disabled', true);
                if (time == 0) {
                    clearInterval(t);
                    $code.html("重新获取");
                    $(".v-code button").attr('disabled', false);
                    validCode = true;
                }
            }, 1000)
        };
        $.ajax({
            type: 'POST',
            url: URI_DOMAIN + '/auth/send_vftcode',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: { email: email },
            success: function(res) {
                console.log(res);
            }
        })
    })

    //修改密码
    $(".self-pwd-submit button").click(function() {
        var email = $(".pwd-email input").val();
        var verificationCode = $(".v-code input").val();
        var password = $(".pwd-pwd input").val();
        var replyPwd = $(".pwd-repwd input").val();
        if (!verificationCode) {
            alert("请填写验证码！");
            return false;
        }
        if (password.length < 6) {
            alert("请确保密码不少于六位数！");
            return false;
        }
        if (password != replyPwd) {
            alert("两次密码不一致");
            return false;
        }
        $.ajax({
            type: 'POST',
            url: URI_DOMAIN + '/auth/changePwd',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: { email: email, verificationCode: verificationCode, password: password },
            success: function(res) {
                if (res.status == 1) {
                    window.location.reload();
                }
                alert(res.msg);
            }
        })
    })

    //获取有关自己的未读的消息通知
    $.ajax({
        type: 'GET',
        url: URI_DOMAIN + '/reply/unread',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: {},
        success: function(res) {
            console.log(res);
            if (res.status == 1) {
                if (res.data.length == 0) {
                    $(".reply-ul").html('<span style="text-align:center;font-size:20px;padding-top: 30px;display: block;color: red;">暂无通知</span>');
                } else {
                    var liHtml = '';
                    for (var i = 0; i < res.data.length; i++) {
                        liHtml += '<li class="reply-li">' +
                            '<div class="reply-content">' +
                            '<span class="reply-headinfo"><span class="reply-author">' + res.data[i].uname + '</span>&nbsp;回复了您的评论:</span>' +
                            '<span>' + res.data[i].content + '</span>' +
                            '</div>' +
                            '<div class="reply-info">' +
                            '<a class="reply-opt" href="./comment_reply.html?commentId=' + res.data[i].commentid + '">read</a>' +
                            '<span class="reply-date">' + new Date(res.data[i].createtime).format('yyyy-MM-dd') + '</span>' +
                            '</div>' +
                            '</li>' +
                            '<hr style="width:100%;margin:0 auto;opacity: 0.3;">';
                    }
                    $(".reply-ul").html(liHtml);
                }
            }
        }
    })
})