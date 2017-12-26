$(function() {
    var user = $(".login-name input");

    var pwd = $(".login-pwd input");

    var checkEmail = $(".check-name");

    var checkPwd = $(".check-pwd");

    var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/; //邮箱正则

    //console.log(pwd.val());
    // if(pwd.val().trim().length>5){
    // 	checkPwd.html('');
    // }

    //邮箱校验
    user.bind('blur', function() {
        if (user.val().trim().length > 0) {
            if (!myreg.test(user.val())) {
                checkEmail.html('Please enter a valid email！');
            } else {
                checkEmail.html('');
            }
        }
    })

    //密码校验
    pwd.bind('blur', function() {
        if (pwd.val().trim().length > 5) {
            checkPwd.html('');
        }
    })

    //$("#submit").attr('disabled', false);


    // var from = $.getUrlParam('from');

    $("#submit").click(function() {
        var flag = true;
        //邮箱校验
        //user.bind('input propertychange', function(){
        if (user.val().trim().length > 0) {
            if (!myreg.test(user.val())) {
                checkEmail.html('Please enter a valid email！');
                flag = false;
            } else {
                checkEmail.html('');
            }
        } else {
            checkEmail.html('Please fill in the login email');
            flag = false;
        }
        //})

        //密码校验
        //pwd.bind('input propertychange', function(){
        if (pwd.val().trim().length > 5) {
            checkPwd.html('');
        } else {
            checkPwd.html('Please fill out six or more passwords');
            flag = false;
        }
        //})
        if (flag == false) {
            return false;
        }

        $.ajax({
            type: "POST",
            url: URI_DOMAIN + "/auth/login",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: { email: user.val(), pwd: pwd.val() },
            success: function(data) {
                // console.log(data);
                // return false;
                if (data.status == 1) { //success relocation
                    if (data.content && data.content != '/favicon.ico') {
                        window.location.href = data.content;
                    } else {
                        window.location.href = "./home.html";
                    }
                } else {
                    alert(data.msg);
                }
            }
        });
    });

    //回车登录
    $("body").keydown(function(event) {
        if (event.keyCode == "13") { //keyCode=13是回车键
            $('#submit').click();
        }
    });

    //激活邮箱
    $("#activeEmail").click(function() {
        if (user.val().trim().length <= 0) {
            alert('Please fill in the email of needing to active');
            return false;
        }
        $.ajax({
            type: 'POST',
            url: URI_DOMAIN + '/auth/reactive',
            dataType: 'json',
            data: { email: user.val() },
            success: function(res) {
                alert(res.msg);
            }
        })
    })
})