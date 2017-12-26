$(function() {
    // var checkFname = $(".check-fname");
    // var checkLname = $(".check-lname");
    var checkUname = $(".check-name");
    var checkEmail = $(".check-email");
    var checkIns = $(".check-institution");
    var checkAddr = $(".check-addr");
    var checkPwd = $(".check-pwd");
    var checkReped = $(".check-repwd");

    var myreg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,4}$/; //严格的邮箱正则

    // $(".register-fname input").bind('blur', function() {
    //     if ($(".register-fname input").val().trim().length > 0) {
    //         checkFname.html('');
    //     }
    // })
    // $(".register-lname input").bind('blur', function() {
    //     if ($(".register-lname input").val().trim().length > 0) {
    //         checkLname.html('');
    //     }
    // })
    $(".register-name input").bind('blur', function() {
        if ($(".register-name input").val().trim().length > 0) {
            checkUname.html('');
        }
    });
    // $(".register-institution input").bind('blur', function() {
    //     if ($(".register-institution input").val().trim().length > 0) {
    //         checkIns.html('');
    //     }
    // })
    // $(".register-addr input").bind('blur', function() {
    //     if ($(".register-addr input").val().trim().length > 0) {
    //         checkAddr.html('');
    //     }
    // })

    //邮箱校验
    $(".register-email input").bind('blur', function() {
            if ($(".register-email input").val().trim().length > 0) {
                if (!myreg.test($(".register-email input").val())) {
                    checkEmail.html('Please enter a valid email！');
                } else {
                    checkEmail.html('');
                }
            }
        })
        //密码校验
    $(".register-pwd input").bind('blur', function() {
            if ($(".register-pwd input").val().trim().length > 5) {
                checkPwd.html('');
            }
        })
        //确认密码校验
    $(".register-repwd input").bind('blur', function() {
        if ($(".register-repwd input").val().trim().length > 0) {
            if ($(".register-repwd input").val() != $(".register-pwd input").val()) {
                checkReped.html('Two passwords must be consistent!');
            } else {
                checkReped.html('');
            }
        }
    })

    $("#submit").click(function() {
        var flag = true;
        // var first_name = $(".register-fname input").val();
        // var last_name = $(".register-lname input").val();
        var username = $(".register-name input").val();
        var email = $(".register-email input").val();
        var institution = $(".register-institution input").val();
        var address = $(".register-addr input").val();
        var pwd = $(".register-pwd input").val();
        var repwd = $(".register-repwd input").val();

        //$("#fname").bind('input propertychange', function(){
        //console.log($("#fname").val().trim().length);
        // if (first_name.trim().length > 0) {
        //     checkFname.html('');
        // } else {
        //     checkFname.html('Can\'t be empty');
        //     flag = false;
        // }
        //})
        //$("#lname").bind('input propertychange', function(){
        // if (last_name.trim().length > 0) {
        //     checkLname.html('');
        // } else {
        //     checkLname.html('Can\'t be empty');
        //     flag = false;
        // }
        //})
        //$("#uname").bind('input propertychange', function(){
        if (username.trim().length > 0) {
            checkUname.html('');
        } else {
            checkUname.html('Please fill in the username');
            flag = false;
        }
        //})
        //$("#institution").bind('input propertychange', function(){
        // if (institution.trim().length > 0) {
        //     checkIns.html('');
        // } else {
        //     checkIns.html('Can\'t be empty');
        //     flag = false;
        // }
        //})
        //$("#address").bind('input propertychange', function(){
        // if (address.trim().length > 0) {
        //     checkAddr.html('');
        // } else {
        //     checkAddr.html('Please fill in the address');
        //     flag = false;
        // }
        //})

        //邮箱校验
        //$("#email").bind('input propertychange', function(){
        if (email.trim().length > 0) {
            if (!myreg.test(email)) {
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
        //$("#pwd").bind('input propertychange', function(){
        if (pwd.trim().length > 5) {
            checkPwd.html('');
        } else {
            checkPwd.html('Please fill out six or more passwords');
            flag = false;
        }
        //})
        //确认密码校验
        //$("#repwd").bind('input propertychange', function(){
        if (repwd.trim().length > 0) {
            if (repwd != pwd) {
                checkReped.html('Two passwords must be consistent!');
                flag = false;
            } else {
                checkReped.html('');
            }
        } else {
            checkReped.html('Please fill in the confirmation password');
            flag = false;
        }
        //})
        if (flag == false) {
            return false;
        }

        $.ajax({
            type: 'POST',
            url: URI_DOMAIN + "/auth/register",
            dataType: 'json',
            data: { email: email, username: username, groupOf: institution, location: address, pwd: pwd, sysFrom: 0 },
            success: function(data) {
                if (data.status == 1) {
                    window.location.href = "./login.html";
                    alert(data.msg + ' 请前往邮箱激活！');
                } else {
                    alert(data.msg);
                }
            }
        })
    })
})